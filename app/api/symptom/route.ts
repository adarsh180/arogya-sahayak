import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { callAI, translateText } from '@/lib/ai'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { symptoms, severity, duration, age, gender, additionalInfo, language = 'en' } = await request.json()

    // Create symptom analysis prompt
    const symptomPrompt = `
Analyze the following symptoms and provide a detailed medical assessment:

Symptoms: ${symptoms.join(', ')}
Severity: ${severity}
Duration: ${duration}
Patient Age: ${age}
Patient Gender: ${gender}
Additional Information: ${additionalInfo || 'None'}

Please provide:
1. Possible conditions/diagnoses (ranked by likelihood)
2. Severity assessment
3. Recommended actions
4. When to seek immediate medical attention
5. General care suggestions

Remember to always recommend consulting a healthcare professional for proper diagnosis and treatment.
`

    // Get AI analysis
    const analysis = await callAI([{ role: 'user', content: symptomPrompt }], 'symptom', language)
    
    if (!analysis || analysis.includes('technical difficulties') || analysis.includes('high demand')) {
      return NextResponse.json({ error: 'AI service temporarily unavailable. Please try again.' }, { status: 503 })
    }

    // Create suggestions prompt
    const suggestionPrompt = `
Based on the symptoms: ${symptoms.join(', ')} with ${severity} severity lasting ${duration}, provide simple home remedies and care suggestions. Include when to see a doctor immediately.
`

    const suggestions = await callAI([{ role: 'user', content: suggestionPrompt }], 'symptom', language)
    
    if (!suggestions || suggestions.includes('technical difficulties') || suggestions.includes('high demand')) {
      return NextResponse.json({ error: 'AI service temporarily unavailable. Please try again.' }, { status: 503 })
    }

    // Use original analysis and suggestions (no translation for now to avoid issues)
    let translatedAnalysis = analysis
    let translatedSuggestions = suggestions

    // Save to database
    const symptomCheck = await prisma.symptomCheck.create({
      data: {
        userId: session.user.id,
        symptoms,
        severity,
        duration,
        age: parseInt(age) || 0,
        gender: gender || 'not-specified',
        analysis: translatedAnalysis,
        suggestions: translatedSuggestions,
        language
      }
    })

    return NextResponse.json({
      id: symptomCheck.id,
      analysis: translatedAnalysis,
      suggestions: translatedSuggestions
    })
  } catch (error) {
    console.error('Symptom analysis error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const symptomHistory = await prisma.symptomCheck.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 20
    })

    return NextResponse.json(symptomHistory)
  } catch (error) {
    console.error('Symptom history error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}