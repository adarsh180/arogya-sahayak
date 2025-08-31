import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { type, value, analysis } = await request.json()

    const healthData = await prisma.healthData.create({
      data: {
        userEmail: session.user.email,
        type,
        value: JSON.stringify(value),
        analysis: JSON.stringify(analysis),
        createdAt: new Date()
      }
    })

    return NextResponse.json(healthData)
  } catch (error) {
    console.error('Health data save error:', error)
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    const where: any = { userEmail: session.user.email }
    if (type) where.type = type

    const healthData = await prisma.healthData.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 10
    })

    const formattedData = healthData.map(item => ({
      ...item,
      value: JSON.parse(item.value),
      analysis: JSON.parse(item.analysis)
    }))

    return NextResponse.json(formattedData)
  } catch (error) {
    console.error('Health data fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
  }
}