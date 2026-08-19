import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { parseJson } from '@/lib/api-security'

const medicationSchema = z.object({
  name: z.string().trim().min(2).max(120),
  dosage: z.string().trim().min(1).max(100),
  frequency: z.string().trim().min(1).max(120),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional().nullable(),
  reminders: z.array(z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/)).max(8).default([]),
  notes: z.string().trim().max(1_000).optional().nullable()
}).refine(data => !data.endDate || data.endDate >= data.startDate, { message: 'End date must be after the start date.', path: ['endDate'] })

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const parsed = await parseJson(request, medicationSchema)
    if (!parsed.ok) return parsed.response
    const { name, dosage, frequency, startDate, endDate, reminders, notes } = parsed.data

    const medication = await prisma.medication.create({
      data: {
        userId: session.user.id,
        name,
        dosage,
        frequency,
        startDate,
        endDate: endDate || null,
        reminders,
        notes
      }
    })

    return NextResponse.json(medication)
  } catch (error) {
    console.error('Medication creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const medications = await prisma.medication.findMany({
      where: { 
        userId: session.user.id,
        isActive: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(medications)
  } catch (error) {
    console.error('Medications fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
