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
    
    if (!analysis) {
      return NextResponse.json({ error: 'Failed to analyze symptoms' }, { status: 500 })
    }

    // Create suggestions prompt
    const suggestionPrompt = `
Based on the symptoms: ${symptoms.join(', ')} with ${severity} severity lasting ${duration}, provide simple home remedies and care suggestions. Include when to see a doctor immediately.
`

    const suggestions = await callAI([{ role: 'user', content: suggestionPrompt }], 'symptom', language)
    
    if (!suggestions) {
      return NextResponse.json({ error: 'Failed to generate suggestions' }, { status: 500 })
    }

    // Translate if needed
    let translatedAnalysis = analysis
    let translatedSuggestions = suggestions

    if (language !== 'en') {
      const translatedAnalysisResult = await translateText(analysis, language)
      const translatedSuggestionsResult = await translateText(suggestions, language)
      
      translatedAnalysis = translatedAnalysisResult || analysis
      translatedSuggestions = translatedSuggestionsResult || suggestions
    }

    // Save to database
    const symptomCheck = await prisma.symptomCheck.create({
      data: {
        userId: session.user.id,
        symptoms,
        severity,
        duration,
        age: parseInt(age),
        gender,
        analysis: language !== 'en' ? translatedAnalysis : analysis,
        suggestions: language !== 'en' ? translatedSuggestions : suggestions,
        language
      }
    })

    return NextResponse.json({
      id: symptomCheck.id,
      analysis: language !== 'en' ? translatedAnalysis : analysis,
      suggestions: language !== 'en' ? translatedSuggestions : suggestions,
      originalAnalysis: language !== 'en' ? analysis : null,
      originalSuggestions: language !== 'en' ? suggestions : null
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