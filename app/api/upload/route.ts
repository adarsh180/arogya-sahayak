import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    console.log(`Processing file: ${file.name}, type: ${file.type}, size: ${file.size}`)

    let extractedText = ''

    try {
      if (file.type === 'application/pdf') {
        console.log('Processing PDF file...')
        const buffer = await file.arrayBuffer()
        
        // Dynamic import to avoid build issues
        const pdf = (await import('pdf-parse')).default
        const data = await pdf(Buffer.from(buffer))
        extractedText = data.text
        console.log(`PDF text extracted: ${extractedText.length} characters`)
        
        if (!extractedText || extractedText.trim().length === 0) {
          extractedText = `[PDF file: ${file.name}] - This PDF appears to be empty or contains only images. Please ensure the PDF contains readable text.`
        }
      } else if (file.type.startsWith('image/')) {
        extractedText = `[Image file: ${file.name}] - I can see you've uploaded an image. Please describe what you'd like me to analyze about this image, as I cannot directly process image content yet.`
      } else if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        extractedText = await file.text()
      } else {
        // Try to read as text for other file types
        try {
          extractedText = await file.text()
        } catch {
          extractedText = `[File: ${file.name}] - This file type (${file.type}) is not fully supported. Please try uploading a PDF or text file.`
        }
      }
    } catch (fileError) {
      console.error('File processing error:', fileError)
      extractedText = `[Error processing ${file.name}] - There was an issue reading this file. Please try uploading a different file or ensure the file is not corrupted.`
    }

    return NextResponse.json({ 
      success: true, 
      text: extractedText,
      fileName: file.name,
      fileType: file.type
    })
  } catch (error) {
    console.error('File upload error:', error)
    return NextResponse.json({ 
      error: 'Failed to process file. Please try again or contact support if the issue persists.',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}