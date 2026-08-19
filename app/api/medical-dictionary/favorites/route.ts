import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { parseJson } from '@/lib/api-security'

const favoriteSchema = z.object({ termId: z.string().trim().min(1).max(160) })

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const records = await prisma.medicalFavorite.findMany({
    where: { userId: session.user.id }, orderBy: { createdAt: 'desc' }, select: { termId: true }
  })
  return NextResponse.json({ favorites: records.map(record => record.termId) })
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const parsed = await parseJson(request, favoriteSchema)
  if (!parsed.ok) return parsed.response
  const where = { userId_termId: { userId: session.user.id, termId: parsed.data.termId } }
  const existing = await prisma.medicalFavorite.findUnique({ where })
  if (existing) await prisma.medicalFavorite.delete({ where })
  else await prisma.medicalFavorite.create({ data: { userId: session.user.id, termId: parsed.data.termId } })
  const records = await prisma.medicalFavorite.findMany({ where: { userId: session.user.id }, select: { termId: true } })
  return NextResponse.json({ added: !existing, favorites: records.map(record => record.termId) })
}
