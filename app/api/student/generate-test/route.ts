import { NextRequest, NextResponse } from 'next/server'
import { callAI } from '@/lib/ai'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { checkRateLimit, getRequestKey, parseJson, rateLimitResponse } from '@/lib/api-security'

const testSchema = z.object({
  exam: z.string().trim().min(2).max(60),
  subject: z.string().trim().min(2).max(100),
  questionCount: z.coerce.number().int().min(3).max(25).default(10)
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const rate = checkRateLimit(`test:${getRequestKey(request, session.user.id)}`, 4, 60_000)
    if (!rate.allowed) return rateLimitResponse(rate.retryAfter)
    const parsed = await parseJson(request, testSchema)
    if (!parsed.ok) return parsed.response
    const { exam, subject, questionCount } = parsed.data

    const prompt = `Generate ${questionCount} multiple choice questions for ${exam.toUpperCase()} exam in ${subject} subject. 

Format each question as:
Q1. [Question text]
A) [Option A]
B) [Option B] 
C) [Option C]
D) [Option D]
Correct Answer: [A/B/C/D]
Explanation: [Brief explanation]

Make questions challenging but appropriate for the exam level. Cover different topics within the subject. Ensure questions are factually accurate and follow the latest exam pattern.`

    const aiResponse = await callAI([
      { role: 'user', content: prompt }
    ], 'student')

    // Parse the AI response to extract questions
    const questions = parseQuestions(aiResponse)
    
    // Generate a unique test ID
    const testId = `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // In a real app, you'd save this to a database
    // For now, we'll return the test data
    return NextResponse.json({
      testId,
      exam,
      subject,
      questions,
      generatedAt: new Date().toISOString(),
      notice: 'AI-generated practice material. Verify disputed facts against your current curriculum and official sources.'
    })

  } catch (error) {
    console.error('Error generating test:', error)
    return NextResponse.json(
      { error: 'Failed to generate test' },
      { status: 500 }
    )
  }
}

function parseQuestions(aiResponse: string) {
  const questions = []
  const questionBlocks = aiResponse.split(/Q\d+\./).filter(block => block.trim())

  for (let i = 0; i < questionBlocks.length; i++) {
    const block = questionBlocks[i].trim()
    if (!block) continue

    try {
      const lines = block.split('\n').filter(line => line.trim())
      
      const questionText = lines[0]?.trim()
      if (!questionText) continue

      const options = []
      let correctAnswer = ''
      let explanation = ''

      for (const line of lines) {
        const trimmed = line.trim()
        if (trimmed.match(/^[A-D]\)/)) {
          options.push(trimmed.substring(2).trim())
        } else if (trimmed.startsWith('Correct Answer:')) {
          correctAnswer = trimmed.replace('Correct Answer:', '').trim()
        } else if (trimmed.startsWith('Explanation:')) {
          explanation = trimmed.replace('Explanation:', '').trim()
        }
      }

      if (questionText && options.length === 4 && correctAnswer) {
        questions.push({
          id: i + 1,
          question: questionText,
          options,
          correctAnswer: correctAnswer.replace(/[()]/g, ''),
          explanation: explanation || 'No explanation provided'
        })
      }
    } catch (error) {
      console.error('Error parsing question block:', error)
    }
  }

  return questions
}
