import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Prisma } from '@prisma/client'
import { z } from 'zod'
import { parseJson } from '@/lib/api-security'

const healthDataSchema = z.object({
  type: z.string().trim().min(2).max(50),
  value: z.record(z.union([z.string().max(200), z.number(), z.boolean()])),
  analysis: z.record(z.unknown())
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const parsed = await parseJson(request, healthDataSchema)
    if (!parsed.ok) return parsed.response
    const { type, value, analysis } = parsed.data

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

    const where: Prisma.HealthDataWhereInput = { userEmail: session.user.email }
    if (type) where.type = type

    const healthData = await prisma.healthData.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 10
    })

    const formattedData = healthData.map(item => ({
      ...item,
      value: safelyParse(item.value),
      analysis: safelyParse(item.analysis)
    }))

    return NextResponse.json(formattedData)
  } catch (error) {
    console.error('Health data fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
  }
}

function safelyParse(value: string) {
  try { return JSON.parse(value) } catch { return {} }
}
