import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { parseJson } from '@/lib/api-security'

const updateSchema = z.object({
  status: z.enum(['pending', 'completed', 'skipped']).optional(),
  notes: z.string().trim().max(1_000).optional().nullable()
})

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const parsed = await parseJson(request, updateSchema)
  if (!parsed.ok) return parsed.response
  const { id } = await params
  try {
    const updated = await prisma.studyPlan.updateMany({
      where: { id, userId: session.user.id },
      data: {
        ...(parsed.data.status ? { status: parsed.data.status } : {}),
        ...(parsed.data.notes !== undefined ? { notes: parsed.data.notes || null } : {})
      }
    })
    if (!updated.count) return NextResponse.json({ error: 'Study session not found.' }, { status: 404 })
    return NextResponse.json(await prisma.studyPlan.findUnique({ where: { id } }))
  } catch (error) {
    console.error('Study plan update error:', error)
    return NextResponse.json({ error: 'Unable to update this session.' }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  try {
    const deleted = await prisma.studyPlan.deleteMany({ where: { id, userId: session.user.id } })
    if (!deleted.count) return NextResponse.json({ error: 'Study session not found.' }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Study plan deletion error:', error)
    return NextResponse.json({ error: 'Unable to delete this session.' }, { status: 500 })
  }
}
