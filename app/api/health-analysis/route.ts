import { NextRequest, NextResponse } from 'next/server'
import { callAI } from '@/lib/ai'

export async function POST(request: NextRequest) {
  try {
    const { type, value } = await request.json()

    // Create AI prompt for health analysis
    const prompt = `As a medical AI assistant, analyze this health metric and provide a comprehensive assessment:

Metric Type: ${type}
Values: ${JSON.stringify(value)}

Provide analysis in this exact JSON format:
{
  "status": "normal|warning|danger",
  "message": "Brief assessment of the reading",
  "suggestion": "Specific actionable recommendations",
  "dangerLevel": "low|medium|high",
  "medicalContext": "Additional medical context or explanation"
}

Consider:
- Medical reference ranges and standards
- Potential health implications
- Lifestyle recommendations
- When to seek medical attention
- Age and demographic considerations

Be precise, professional, and include medical disclaimers when appropriate.`

    // Get AI analysis
    const aiResponse = await callAI([{ role: 'user', content: prompt }], 'medical')
    
    // Parse AI response
    let analysis
    try {
      // Clean and extract JSON from AI response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No JSON found in response')
      }
    } catch (parseError) {
      console.error('AI response parsing error:', parseError)
      // Fallback analysis
      analysis = {
        status: 'normal',
        message: 'Health metric recorded successfully.',
        suggestion: 'Continue monitoring your health regularly and consult healthcare providers for personalized advice.',
        dangerLevel: 'low',
        medicalContext: 'AI analysis temporarily unavailable. Please consult a healthcare professional for detailed assessment.'
      }
    }

    // Validate required fields
    if (!analysis.status || !analysis.message || !analysis.suggestion) {
      analysis = {
        status: 'normal',
        message: 'Health data recorded for tracking.',
        suggestion: 'Maintain regular health monitoring and consult healthcare providers as needed.',
        dangerLevel: 'low',
        medicalContext: 'Standard health tracking recommendation.'
      }
    }

    return NextResponse.json(analysis)
  } catch (error) {
    console.error('Health analysis error:', error)
    return NextResponse.json({
      status: 'normal',
      message: 'Health metric recorded.',
      suggestion: 'Please consult a healthcare professional for detailed health assessment.',
      dangerLevel: 'low',
      error: 'Analysis service temporarily unavailable'
    }, { status: 200 })
  }
}