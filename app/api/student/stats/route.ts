import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getLearningStats } from '@/lib/learning-stats'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    return NextResponse.json(await getLearningStats(session.user.id))
  } catch (error) {
    console.error('Error fetching student stats:', error)
    return NextResponse.json({ error: 'Unable to load learning statistics.' }, { status: 500 })
  }
}
