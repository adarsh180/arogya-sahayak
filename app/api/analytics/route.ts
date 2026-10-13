import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getLearningStats } from '@/lib/learning-stats'

const periodDays: Record<string, number | undefined> = { '7d': 7, '30d': 30, '90d': 90, all: undefined }

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const period = new URL(request.url).searchParams.get('period') || '30d'
  try {
    return NextResponse.json(await getLearningStats(session.user.id, period in periodDays ? periodDays[period] : 30))
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json({ error: 'Unable to load progress.' }, { status: 500 })
  }
}
