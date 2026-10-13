import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { formatReading, METRIC_META, type MetricType } from '@/lib/health-assess'

// Recent activity timeline built from saved readings.
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const limit = Math.min(Math.max(Number(new URL(request.url).searchParams.get('limit')) || 10, 1), 50)

  try {
    const healthData = await prisma.healthData.findMany({
      where: { userEmail: session.user.email },
      orderBy: { createdAt: 'desc' },
      take: limit
    })

    return NextResponse.json(healthData.map(item => {
      let value: Record<string, unknown> = {}
      let analysis: { status?: string } = {}
      try { value = JSON.parse(item.value) } catch {}
      try { analysis = JSON.parse(item.analysis) } catch {}
      const meta = METRIC_META[item.type as MetricType]
      return {
        id: item.id,
        time: item.createdAt,
        type: item.type,
        status: analysis.status || null,
        message: meta ? `${meta.label} recorded: ${formatReading(item.type, value)} ${meta.unit}` : 'Health reading recorded',
      }
    }))
  } catch (error) {
    console.error('Activity fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch activity' }, { status: 500 })
  }
}
