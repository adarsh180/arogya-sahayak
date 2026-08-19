import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { checkRateLimit, getRequestKey, rateLimitResponse } from '@/lib/api-security'

const MAX_FILE_BYTES = 5 * 1024 * 1024
const MAX_EXTRACTED_CHARACTERS = 50_000
const ALLOWED_TYPES = new Set(['application/pdf', 'text/plain'])

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const rate = checkRateLimit(`upload:${getRequestKey(request, session.user.id)}`, 5, 60_000)
    if (!rate.allowed) return rateLimitResponse(rate.retryAfter)
    const contentLength = Number(request.headers.get('content-length') || 0)
    if (contentLength > MAX_FILE_BYTES + 256_000) {
      return NextResponse.json({ error: 'File is too large. Maximum size is 5 MB.' }, { status: 413 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }
    if (file.size > MAX_FILE_BYTES) return NextResponse.json({ error: 'File is too large. Maximum size is 5 MB.' }, { status: 413 })
    if (!ALLOWED_TYPES.has(file.type) && !file.name.toLowerCase().endsWith('.txt')) {
      return NextResponse.json({ error: 'Only text-based PDF and TXT files are currently supported. Images are not analysed.' }, { status: 415 })
    }

    let extractedText = ''

    try {
      if (file.type === 'application/pdf') {
        const buffer = await file.arrayBuffer()
        
        // Dynamic import to avoid build issues
        const pdf = (await import('pdf-parse')).default
        const data = await pdf(Buffer.from(buffer))
        extractedText = data.text
        if (!extractedText || extractedText.trim().length === 0) {
          return NextResponse.json({ error: 'No readable text was found. Scanned or image-only PDFs are not yet supported.' }, { status: 422 })
        }
      } else if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        extractedText = await file.text()
      }
    } catch (fileError) {
      console.error('File processing error:', fileError)
      return NextResponse.json({ error: 'The file could not be read. It may be encrypted or corrupted.' }, { status: 422 })
    }

    extractedText = extractedText.slice(0, MAX_EXTRACTED_CHARACTERS)

    return NextResponse.json({ 
      success: true, 
      text: extractedText,
      fileName: file.name,
      fileType: file.type,
      truncated: extractedText.length >= MAX_EXTRACTED_CHARACTERS,
      privacyNotice: 'The extracted text may be sent to your configured AI provider when you ask a question. Avoid uploading unnecessary identifiers.'
    })
  } catch (error) {
    console.error('File upload error:', error)
    return NextResponse.json({ 
      error: 'Failed to process file. Please try again or contact support if the issue persists.',
    }, { status: 500 })
  }
}
