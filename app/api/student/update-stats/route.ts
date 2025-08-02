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

    const { type, data } = await request.json()

    switch (type) {
      case 'test_result':
        await prisma.mockTest.create({
          data: {
            userId: session.user.id,
            examType: data.testType || 'mock',
            subject: data.subject,
            score: data.score,
            totalQuestions: data.totalQuestions || 100,
            correctAnswers: data.correctAnswers || data.score,
            timeSpent: data.timeSpent || 60,
            answers: JSON.stringify(data.answers || {})
          }
        })
        break

      case 'study_log':
        await prisma.studyPlan.create({
          data: {
            userId: session.user.id,
            examType: 'general',
            subject: data.subject,
            topic: data.topic || 'General Study',
            scheduledDate: new Date(),
            duration: data.duration,
            status: 'completed'
          }
        })
        break

      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating student stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}