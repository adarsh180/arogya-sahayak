import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { checkRateLimit, getRequestKey, parseJson, rateLimitResponse } from '@/lib/api-security'

const optionalText = (length: number) => z.string().trim().max(length).optional().nullable()
const signupSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(180).transform(value => value.toLowerCase()),
  password: z.string().min(10).max(128).regex(/[a-z]/, 'Use a lowercase letter').regex(/[A-Z]/, 'Use an uppercase letter').regex(/\d/, 'Use a number'),
  phone: z.string().trim().regex(/^[+\d][\d\s-]{7,17}$/).optional().or(z.literal('')),
  age: z.coerce.number().int().min(13).max(120).optional().nullable(),
  gender: optionalText(40),
  userType: z.enum(['patient', 'student']).default('patient'),
  preferredLanguage: z.string().regex(/^[a-z-]{2,10}$/i).default('en'),
  height: z.coerce.number().min(60).max(260).optional().nullable(),
  weight: z.coerce.number().min(15).max(500).optional().nullable(),
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional().nullable(),
  medicalHistory: optionalText(4_000),
  currentMedications: optionalText(2_000),
  allergies: optionalText(1_000),
  chronicConditions: optionalText(1_000),
  targetExam: optionalText(80),
  currentYear: optionalText(80),
  medicalCollege: optionalText(180)
})

export async function POST(request: NextRequest) {
  const rate = checkRateLimit(`signup:${getRequestKey(request)}`, 5, 15 * 60_000)
  if (!rate.allowed) return rateLimitResponse(rate.retryAfter)
  const parsed = await parseJson(request, signupSchema)
  if (!parsed.ok) return parsed.response

  try {
    const data = parsed.data
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } })
    if (existingUser) return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 })
    const password = await bcrypt.hash(data.password, 12)
    const user = await prisma.user.create({
      data: {
        ...data,
        password,
        phone: data.phone || null,
        medicalHistory: data.medicalHistory || null,
        currentMedications: data.currentMedications || null,
        allergies: data.allergies || null,
        chronicConditions: data.chronicConditions || null,
        targetExam: data.targetExam || null,
        currentYear: data.currentYear || null,
        medicalCollege: data.medicalCollege || null
      },
      select: { id: true, name: true, email: true, userType: true, preferredLanguage: true, createdAt: true }
    })
    return NextResponse.json({ message: 'Account created.', user }, { status: 201 })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json({ error: 'Unable to create the account.' }, { status: 500 })
  }
}
