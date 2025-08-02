import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const studyPlans = await prisma.studyPlan.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        scheduledDate: 'asc'
      }
    })

    return NextResponse.json(studyPlans)
  } catch (error) {
    console.error('Study plans fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { examType, subject, topic, scheduledDate, duration, notes } = await request.json()

    const studyPlan = await prisma.studyPlan.create({
      data: {
        userId: session.user.id,
        examType,
        subject,
        topic,
        scheduledDate: new Date(scheduledDate),
        duration,
        notes: notes || null,
        status: 'pending'
      }
    })

    return NextResponse.json(studyPlan)
  } catch (error) {
    console.error('Study plan creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}