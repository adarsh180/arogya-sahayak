import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { parseJson } from '@/lib/api-security'

const planSchema = z.object({
  examType: z.string().trim().min(2).max(60),
  subject: z.string().trim().min(2).max(100),
  topic: z.string().trim().min(2).max(200),
  scheduledDate: z.coerce.date(),
  duration: z.coerce.number().int().min(10).max(600),
  notes: z.string().trim().max(1_000).optional().nullable()
})

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const studyPlans = await prisma.studyPlan.findMany({ where: { userId: session.user.id }, orderBy: { scheduledDate: 'asc' } })
    return NextResponse.json(studyPlans)
  } catch (error) {
    console.error('Study plans fetch error:', error)
    return NextResponse.json({ error: 'Unable to load your study plan.' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const parsed = await parseJson(request, planSchema)
  if (!parsed.ok) return parsed.response
  try {
    const studyPlan = await prisma.studyPlan.create({
      data: { userId: session.user.id, ...parsed.data, notes: parsed.data.notes || null, status: 'pending' }
    })
    return NextResponse.json(studyPlan, { status: 201 })
  } catch (error) {
    console.error('Study plan creation error:', error)
    return NextResponse.json({ error: 'Unable to save this session.' }, { status: 500 })
  }
}
