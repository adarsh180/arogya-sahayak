import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const contacts = await prisma.emergencyContact.findMany({
      where: { userId: session.user.id, isActive: true },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(contacts)
  } catch (error) {
    console.error('Emergency contacts GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, type, phone, address, specialty } = await request.json()

    const contact = await prisma.emergencyContact.create({
      data: {
        userId: session.user.id,
        name,
        type,
        phone,
        address,
        specialty
      }
    })

    return NextResponse.json(contact)
  } catch (error) {
    console.error('Emergency contacts POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}