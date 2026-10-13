import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { parseJson } from '@/lib/api-security'

const blankToNull = (value: unknown) => (typeof value === 'string' && value.trim() === '' ? null : value)
const text = (length: number) => z.preprocess(blankToNull, z.string().trim().max(length).nullable().optional())
const number = (min: number, max: number, int = false) => z.preprocess(
  blankToNull,
  (int ? z.coerce.number().int() : z.coerce.number()).min(min).max(max).nullable().optional()
)

const profileSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  phone: z.preprocess(blankToNull, z.string().trim().regex(/^[+\d][\d\s-]{7,17}$/, 'Use digits, spaces or dashes').nullable().optional()),
  age: number(13, 120, true),
  gender: text(40),
  location: text(120),
  preferredLanguage: z.string().regex(/^[a-z-]{2,10}$/i).optional(),
  userType: z.enum(['patient', 'student']).optional(),
  onboardingCompleted: z.boolean().optional(),
  height: number(60, 260),
  weight: number(15, 500),
  bloodGroup: z.preprocess(blankToNull, z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).nullable().optional()),
  allergies: text(1_000),
  chronicConditions: text(1_000),
  currentMedications: text(2_000),
  targetExam: text(80),
  currentYear: text(80),
  medicalCollege: text(180)
})

const publicUser = {
  id: true, name: true, email: true, phone: true, age: true, gender: true, location: true,
  preferredLanguage: true, userType: true, onboardingCompleted: true, createdAt: true, updatedAt: true,
  height: true, weight: true, bloodGroup: true, allergies: true, chronicConditions: true, currentMedications: true,
  targetExam: true, currentYear: true, medicalCollege: true
} as const

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const parsed = await parseJson(request, profileSchema)
  if (!parsed.ok) return parsed.response
  try {
    return NextResponse.json(await prisma.user.update({ where: { id: session.user.id }, data: parsed.data, select: publicUser }))
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json({ error: 'Unable to update the profile.' }, { status: 500 })
  }
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: publicUser })
    return user ? NextResponse.json(user) : NextResponse.json({ error: 'User not found.' }, { status: 404 })
  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json({ error: 'Unable to load the profile.' }, { status: 500 })
  }
}
