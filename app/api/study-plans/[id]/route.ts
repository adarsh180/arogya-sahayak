import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { status, notes } = await request.json()

    const { id } = await params
    const studyPlan = await prisma.studyPlan.updateMany({
      where: { id, userId: session.user.id },
      data: {
        status,
        notes: notes || undefined
      }
    })
    if (!studyPlan.count) return NextResponse.json({ error: 'Study plan not found' }, { status: 404 })
    return NextResponse.json(studyPlan)
  } catch (error) {
    console.error('Study plan update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const deleted = await prisma.studyPlan.deleteMany({ where: { id, userId: session.user.id } })
    if (!deleted.count) return NextResponse.json({ error: 'Study plan not found' }, { status: 404 })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Study plan deletion error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
