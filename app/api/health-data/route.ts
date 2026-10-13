import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Prisma } from '@prisma/client'
import { z } from 'zod'
import { checkRateLimit, getRequestKey, parseJson, rateLimitResponse } from '@/lib/api-security'
import { assess, METRIC_TYPES, normalizeReading } from '@/lib/health-assess'

const healthDataSchema = z.object({
  type: z.enum(METRIC_TYPES),
  value: z.record(z.union([z.string().max(40), z.number()]))
})

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const rate = checkRateLimit(`health-data:${getRequestKey(request, session.user.id)}`, 30)
  if (!rate.allowed) return rateLimitResponse(rate.retryAfter)

  const parsed = await parseJson(request, healthDataSchema)
  if (!parsed.ok) return parsed.response
  const { type } = parsed.data
  const value = normalizeReading(type, parsed.data.value)

  let analysis
  try {
    analysis = assess(type, value)
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Enter a valid reading.' }, { status: 400 })
  }

  try {
    const record = await prisma.healthData.create({
      data: { userEmail: session.user.email, type, value: JSON.stringify(value), analysis: JSON.stringify(analysis) }
    })
    return NextResponse.json({ ...record, value, analysis }, { status: 201 })
  } catch (error) {
    console.error('Health data save error:', error)
    return NextResponse.json({ error: 'The reading could not be saved. Please try again.' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')
  const take = Math.min(Math.max(Number(searchParams.get('limit')) || 60, 1), 200)
  const where: Prisma.HealthDataWhereInput = { userEmail: session.user.email }
  if (type) where.type = type

  try {
    const records = await prisma.healthData.findMany({ where, orderBy: { createdAt: 'desc' }, take })
    return NextResponse.json(records.map(item => ({ ...item, value: safelyParse(item.value), analysis: safelyParse(item.analysis) })))
  } catch (error) {
    console.error('Health data fetch error:', error)
    return NextResponse.json({ error: 'Unable to load your readings.' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const id = new URL(request.url).searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Reading ID required.' }, { status: 400 })
  try {
    const deleted = await prisma.healthData.deleteMany({ where: { id, userEmail: session.user.email } })
    if (!deleted.count) return NextResponse.json({ error: 'Reading not found.' }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Health data delete error:', error)
    return NextResponse.json({ error: 'Unable to delete this reading.' }, { status: 500 })
  }
}

function safelyParse(value: string) {
  try { return JSON.parse(value) } catch { return {} }
}
