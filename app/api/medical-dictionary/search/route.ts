import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { callAI } from '@/lib/ai'
import { z } from 'zod'
import { checkRateLimit, getRequestKey, parseJson, rateLimitResponse } from '@/lib/api-security'

const searchSchema = z.object({
  term: z.string().trim().min(2).max(100),
  category: z.string().max(40).default('all'),
  difficulty: z.enum(['all', 'basic', 'intermediate', 'advanced']).default('all')
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const rate = checkRateLimit(`dictionary:${getRequestKey(request, session.user.id)}`, 15)
    if (!rate.allowed) return rateLimitResponse(rate.retryAfter)
    const parsed = await parseJson(request, searchSchema)
    if (!parsed.ok) return parsed.response
    const { term, category, difficulty } = parsed.data

    // Create comprehensive AI prompt for medical term definition
    const aiPrompt = `You are a medical dictionary AI. Provide comprehensive, accurate medical information for the term: "${term}"

Return your response as a valid JSON object with this EXACT structure (no additional text before or after):
{
  "term": "Proper Medical Term Name",
  "pronunciation": "phonetic pronunciation (e.g., hahy-per-TEN-shuhn)",
  "definition": "Detailed, accurate medical definition in 2-3 sentences",
  "category": "${category !== 'all' ? category : 'cardiology/neurology/pharmacology/anatomy/pathology/ophthalmology/general'}",
  "difficulty": "${difficulty !== 'all' ? difficulty : 'basic/intermediate/advanced'}",
  "examples": ["Clinical example 1", "Clinical example 2"],
  "relatedTerms": ["Related Term 1", "Related Term 2", "Related Term 3", "Related Term 4"]
}

IMPORTANT GUIDELINES:
- Provide medically accurate, professional definitions
- Use clear, accessible language while maintaining medical precision
- Include practical clinical examples
- Suggest genuinely related medical terms
- If the term is misspelled or doesn't exist, provide the closest match or explain why it's not a medical term
- Ensure the JSON is valid and parseable
- Do NOT include markdown formatting, code blocks, or any text outside the JSON object`

    // Call AI to get medical term information
    const aiResponse = await callAI(
      [{ role: 'user', content: aiPrompt }],
      'medical',
      'en',
      1
    )

    if (!aiResponse || aiResponse.includes('technical difficulties') || aiResponse.includes('high demand')) {
      console.error('AI Response failed:', aiResponse)
      return NextResponse.json(
        { error: 'AI service temporarily unavailable. Please try again.' },
        { status: 503 }
      )
    }

    // Parse AI response - handle various formats
    let result
    try {
      // Remove markdown code blocks if present
      let cleanResponse = aiResponse.trim()
      cleanResponse = cleanResponse.replace(/```json\s*/g, '').replace(/```\s*/g, '')

      // Try to find JSON object in response
      const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No JSON object found in response')
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError)

      // Fallback: Create a basic response from the text
      result = {
        id: term.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        term: term.charAt(0).toUpperCase() + term.slice(1),
        definition: aiResponse.length > 500 ? aiResponse.substring(0, 500) + '...' : aiResponse,
        pronunciation: '',
        category: category !== 'all' ? category : 'general',
        difficulty: difficulty !== 'all' ? difficulty : 'intermediate',
        examples: ['Please search again for detailed examples'],
        relatedTerms: []
      }
    }

    // Ensure result has an ID
    if (!result.id) {
      result.id = term.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    }

    // Ensure all required fields exist
    result.term = result.term || term
    result.definition = result.definition || 'No definition available'
    result.pronunciation = result.pronunciation || ''
    result.category = result.category || (category !== 'all' ? category : 'general')
    result.difficulty = result.difficulty || (difficulty !== 'all' ? difficulty : 'intermediate')
    result.examples = result.examples || []
    result.relatedTerms = result.relatedTerms || []

    return NextResponse.json({
      results: [result],
      count: 1
    })

  } catch (error: unknown) {
    console.error('Medical dictionary search error:', error)
    return NextResponse.json(
      { error: 'Unable to look up this term.' },
      { status: 500 }
    )
  }
}
