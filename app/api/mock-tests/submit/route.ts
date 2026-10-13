import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { parseJson } from '@/lib/api-security'

const submitSchema = z.object({
  exam: z.string().trim().min(2).max(60),
  subject: z.string().trim().min(2).max(100),
  questions: z.array(z.object({
    question: z.string().max(1_000),
    options: z.array(z.string().max(500)).length(4),
    correct: z.number().int().min(0).max(3),
    explanation: z.string().max(2_000).optional()
  })).min(1).max(50),
  answers: z.record(z.coerce.number().int().min(0).max(3)),
  timeSpentSeconds: z.coerce.number().int().min(0).max(6 * 60 * 60)
})

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const parsed = await parseJson(request, submitSchema)
  if (!parsed.ok) return parsed.response
  const { exam, subject, questions, answers, timeSpentSeconds } = parsed.data

  const review = questions.map((question, index) => {
    const selected = answers[String(index)]
    return { selected: selected ?? null, correct: question.correct, isCorrect: selected === question.correct }
  })
  const correctAnswers = review.filter(item => item.isCorrect).length
  const attempted = review.filter(item => item.selected !== null).length
  const totalQuestions = questions.length
  const score = Math.round((correctAnswers / totalQuestions) * 100)
  const minutes = Math.max(1, Math.round(timeSpentSeconds / 60))

  try {
    const mockTest = await prisma.mockTest.create({
      data: {
        userId: session.user.id,
        examType: exam,
        subject,
        score,
        totalQuestions,
        correctAnswers,
        timeSpent: minutes,
        completedAt: new Date(),
        answers: JSON.stringify({ review, timeSpentSeconds })
      }
    })

    return NextResponse.json({
      id: mockTest.id,
      score,
      correctAnswers,
      attempted,
      totalQuestions,
      timeSpentSeconds,
      review,
      band: score >= 85 ? 'Excellent' : score >= 70 ? 'Strong' : score >= 50 ? 'Developing' : 'Needs revision'
    })
  } catch (error) {
    console.error('Test submission error:', error)
    return NextResponse.json({ error: 'Your answers could not be saved. Please try again.' }, { status: 500 })
  }
}
