import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { parseJson } from '@/lib/api-security'

const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  type: z.enum(['family', 'doctor', 'hospital', 'other']),
  phone: z.string().trim().regex(/^[+\d][\d\s-]{7,17}$/),
  address: z.string().trim().max(240).optional().nullable(),
  specialty: z.string().trim().max(100).optional().nullable()
})

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    return NextResponse.json(await prisma.emergencyContact.findMany({
      where: { userId: session.user.id, isActive: true }, orderBy: { createdAt: 'desc' }
    }))
  } catch (error) {
    console.error('Emergency contacts GET error:', error)
    return NextResponse.json({ error: 'Unable to load contacts.' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const parsed = await parseJson(request, contactSchema)
  if (!parsed.ok) return parsed.response
  try {
    return NextResponse.json(await prisma.emergencyContact.create({
      data: { userId: session.user.id, ...parsed.data }
    }), { status: 201 })
  } catch (error) {
    console.error('Emergency contacts POST error:', error)
    return NextResponse.json({ error: 'Unable to save this contact.' }, { status: 500 })
  }
}
