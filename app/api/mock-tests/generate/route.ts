import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { exam, subject, questions = 10 } = await request.json()

    const prompt = `Generate ${questions} multiple choice questions for ${exam} exam in ${subject} subject. 
    Format as JSON array with this structure:
    [
      {
        "question": "Question text",
        "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
        "correct": 0,
        "explanation": "Detailed explanation"
      }
    ]`

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 4000
      })
    })

    if (!response.ok) {
      throw new Error('Failed to generate questions')
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content

    try {
      const questions = JSON.parse(content)
      return NextResponse.json({ questions })
    } catch (parseError) {
      // Fallback questions if AI fails
      const fallbackQuestions = Array.from({ length: questions }, (_, i) => ({
        question: `Sample ${subject} question ${i + 1} for ${exam}`,
        options: [
          "A) Option 1",
          "B) Option 2", 
          "C) Option 3",
          "D) Option 4"
        ],
        correct: Math.floor(Math.random() * 4),
        explanation: "This is a sample explanation."
      }))
      
      return NextResponse.json({ questions: fallbackQuestions })
    }
  } catch (error) {
    console.error('Error generating questions:', error)
    return NextResponse.json({ error: 'Failed to generate questions' }, { status: 500 })
  }
}