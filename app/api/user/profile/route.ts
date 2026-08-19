import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { parseJson } from '@/lib/api-security'

const profileSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  phone: z.string().trim().regex(/^[+\d][\d\s-]{7,17}$/).optional().nullable().or(z.literal('')),
  age: z.coerce.number().int().min(13).max(120).optional().nullable(),
  gender: z.string().trim().max(40).optional().nullable(),
  location: z.string().trim().max(120).optional().nullable(),
  preferredLanguage: z.string().regex(/^[a-z-]{2,10}$/i).optional(),
  userType: z.enum(['patient', 'student']).optional(),
  onboardingCompleted: z.boolean().optional()
})

const publicUser = {
  id: true, name: true, email: true, phone: true, age: true, gender: true, location: true,
  preferredLanguage: true, userType: true, onboardingCompleted: true, createdAt: true, updatedAt: true
} as const

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const parsed = await parseJson(request, profileSchema)
  if (!parsed.ok) return parsed.response
  try {
    const data = { ...parsed.data, phone: parsed.data.phone || null }
    return NextResponse.json(await prisma.user.update({ where: { id: session.user.id }, data, select: publicUser }))
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json({ error: 'Unable to update the profile.' }, { status: 500 })
  }
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: publicUser })
  return user ? NextResponse.json(user) : NextResponse.json({ error: 'User not found.' }, { status: 404 })
}
