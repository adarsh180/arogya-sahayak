import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { exam, subject, questions, answers, timeSpent, mode } = await request.json()

    let correctAnswers = 0
    const totalQuestions = questions.length

    questions.forEach((question: any, index: number) => {
      if (answers[index] === question.correctAnswer) {
        correctAnswers++
      }
    })

    const score = Math.round((correctAnswers / totalQuestions) * 100)

    const mockTest = await prisma.mockTest.create({
      data: {
        userId: session.user.id,
        examType: exam,
        subject,
        score,
        totalQuestions,
        correctAnswers,
        timeSpent,
        completedAt: new Date(),
        answers: JSON.stringify(answers)
      }
    })

    return NextResponse.json({
      id: mockTest.id,
      score,
      correctAnswers,
      totalQuestions,
      timeSpent,
      performance: {
        accuracy: score,
        timePerQuestion: Math.round(timeSpent / totalQuestions),
        rank: score >= 90 ? 'Excellent' : score >= 75 ? 'Good' : score >= 60 ? 'Average' : 'Needs Improvement'
      }
    })
  } catch (error) {
    console.error('Test submission error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}