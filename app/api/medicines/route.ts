import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { callAI } from '@/lib/ai'
import { checkRateLimit, getRequestKey, parseJson, rateLimitResponse } from '@/lib/api-security'

const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Use a 24-hour time such as 08:30.')

const createSchema = z.object({
  name: z.string().trim().min(2).max(120),
  dosage: z.string().trim().min(1).max(100),
  frequency: z.string().trim().min(1).max(120),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional().nullable(),
  reminders: z.array(time).max(8).default([]),
  notes: z.string().trim().max(1_000).optional().nullable()
}).refine(data => !data.endDate || data.endDate >= data.startDate, { message: 'End date must be on or after the start date.', path: ['endDate'] })

const updateSchema = z.object({
  id: z.string().min(1).max(60),
  isActive: z.boolean().optional(),
  reminders: z.array(time).max(8).optional(),
  notes: z.string().trim().max(1_000).optional().nullable(),
  dosage: z.string().trim().min(1).max(100).optional(),
  frequency: z.string().trim().min(1).max(120).optional(),
  endDate: z.coerce.date().optional().nullable()
})

const analysisSchema = z.object({
  category: z.string().max(160).optional(),
  purpose: z.string().max(600).optional(),
  sideEffects: z.array(z.string().max(240)).max(8).optional(),
  precautions: z.array(z.string().max(240)).max(8).optional(),
  interactions: z.array(z.string().max(240)).max(8).optional(),
  bestTime: z.string().max(200).optional(),
  withFood: z.string().max(200).optional(),
  warnings: z.array(z.string().max(240)).max(8).optional()
})

async function describeMedicine(name: string, dosage: string, frequency: string) {
  const prompt = `Give general, educational reference information about the medicine "${name}" (${dosage}, ${frequency}).
Return only JSON with this shape:
{"category":"drug class","purpose":"common uses","sideEffects":["..."],"precautions":["..."],"interactions":["..."],"bestTime":"general timing guidance","withFood":"with food / empty stomach / either","warnings":["when to contact a doctor"]}
If the name is not a recognisable medicine, set "category" to "Unrecognised" and explain briefly in "purpose". Do not give an individual dose or tell the person to change their prescription.`
  try {
    const response = await callAI([{ role: 'user', content: prompt }], 'medical', 'en', 1, undefined, { temperature: 0.2, maxTokens: 700 })
    const match = response.match(/\{[\s\S]*\}/)
    if (!match) return null
    const parsed = analysisSchema.safeParse(JSON.parse(match[0]))
    return parsed.success ? parsed.data : null
  } catch (error) {
    console.error('Medicine description error:', error)
    return null
  }
}

function safelyParse(value: string | null) {
  if (!value) return null
  try { return JSON.parse(value) } catch { return null }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const rate = checkRateLimit(`medicines:${getRequestKey(request, session.user.id)}`, 10)
  if (!rate.allowed) return rateLimitResponse(rate.retryAfter)
  const parsed = await parseJson(request, createSchema)
  if (!parsed.ok) return parsed.response
  const data = parsed.data

  try {
    const aiAnalysis = await describeMedicine(data.name, data.dosage, data.frequency)
    const medicine = await prisma.medication.create({
      data: {
        userId: session.user.id,
        name: data.name,
        dosage: data.dosage,
        frequency: data.frequency,
        startDate: data.startDate,
        endDate: data.endDate || null,
        reminders: [...new Set(data.reminders)].sort(),
        notes: data.notes || null,
        isActive: true,
        aiAnalysis: aiAnalysis ? JSON.stringify(aiAnalysis) : null
      }
    })
    return NextResponse.json({ ...medicine, aiAnalysis }, { status: 201 })
  } catch (error) {
    console.error('Medicine creation error:', error)
    return NextResponse.json({ error: 'The medicine could not be saved. Please try again.' }, { status: 500 })
  }
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const medicines = await prisma.medication.findMany({ where: { userId: session.user.id }, orderBy: { createdAt: 'desc' } })
    return NextResponse.json(medicines.map(medicine => ({ ...medicine, aiAnalysis: safelyParse(medicine.aiAnalysis) })))
  } catch (error) {
    console.error('Medicine fetch error:', error)
    return NextResponse.json({ error: 'Unable to load your medicines.' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const parsed = await parseJson(request, updateSchema)
  if (!parsed.ok) return parsed.response
  const { id, reminders, ...rest } = parsed.data

  try {
    const updated = await prisma.medication.updateMany({
      where: { id, userId: session.user.id },
      data: { ...rest, ...(reminders ? { reminders: [...new Set(reminders)].sort() } : {}) }
    })
    if (!updated.count) return NextResponse.json({ error: 'Medicine not found.' }, { status: 404 })
    const medicine = await prisma.medication.findUnique({ where: { id } })
    return NextResponse.json(medicine ? { ...medicine, aiAnalysis: safelyParse(medicine.aiAnalysis) } : null)
  } catch (error) {
    console.error('Medicine update error:', error)
    return NextResponse.json({ error: 'Unable to update this medicine.' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const id = new URL(request.url).searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Medicine ID required.' }, { status: 400 })
  try {
    const deleted = await prisma.medication.deleteMany({ where: { id, userId: session.user.id } })
    if (!deleted.count) return NextResponse.json({ error: 'Medicine not found.' }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Medicine delete error:', error)
    return NextResponse.json({ error: 'Unable to remove this medicine.' }, { status: 500 })
  }
}
