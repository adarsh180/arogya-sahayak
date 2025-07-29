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

    const { type, value, unit, notes } = await request.json()



    const healthRecord = await prisma.healthRecord.create({
      data: {
        userId: session.user.id,
        type,
        value: typeof value === 'string' ? value : JSON.stringify(value),
        unit: unit || null,
        notes: notes || null
      }
    })

    return NextResponse.json(healthRecord)
  } catch (error) {
    console.error('Health record creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    const where: any = { userId: session.user.id }
    if (type) {
      where.type = type
    }

    const healthRecords = await prisma.healthRecord.findMany({
      where,
      orderBy: { recordedAt: 'desc' },
      take: 50
    })

    return NextResponse.json(healthRecords)
  } catch (error) {
    console.error('Health records fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}