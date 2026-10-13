import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { checkRateLimit, getRequestKey, parseJson, rateLimitResponse } from '@/lib/api-security'
import { MEDICAL_DISCLAIMER } from '@/lib/medical-safety'
import { assess, METRIC_TYPES } from '@/lib/health-assess'

const metricSchema = z.object({
  type: z.enum(METRIC_TYPES),
  value: z.record(z.union([z.string(), z.number()]))
})

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const rate = checkRateLimit(`health:${getRequestKey(request, session.user.id)}`, 30)
  if (!rate.allowed) return rateLimitResponse(rate.retryAfter)
  const parsed = await parseJson(request, metricSchema)
  if (!parsed.ok) return parsed.response
  try {
    return NextResponse.json(assess(parsed.data.type, parsed.data.value))
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Invalid health reading.' }, { status: 400 })
  }
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const data = await prisma.healthData.findMany({
      where: { userEmail: session.user.email }, orderBy: { createdAt: 'desc' }, take: 20
    })
    const insights = data.slice(0, 4).flatMap(item => {
      try {
        return [{ type: item.type, recordedAt: item.createdAt, ...assess(item.type, JSON.parse(item.value)) }]
      } catch {
        return []
      }
    })
    return NextResponse.json({
      summary: insights.length ? 'Recent measurements are summarized below. Trends and symptoms matter more than one value.' : 'No health measurements have been recorded yet.',
      insights,
      disclaimer: MEDICAL_DISCLAIMER
    })
  } catch (error) {
    console.error('Health analysis error:', error)
    return NextResponse.json({ error: 'Unable to load health insights.' }, { status: 500 })
  }
}
