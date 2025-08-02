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
        await prisma.testResult?.create({
          data: {
            userId: session.user.id,
            score: data.score,
            subject: data.subject,
            testType: data.testType || 'mock',
            createdAt: new Date()
          }
        })
        break

      case 'study_log':
        await prisma.studyLog?.create({
          data: {
            userId: session.user.id,
            duration: data.duration,
            subject: data.subject,
            createdAt: new Date()
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