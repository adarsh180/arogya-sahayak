import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const updated = await prisma.medication.updateMany({
      where: { id, userId: session.user.id },
      data: { isActive: false }
    })
    if (!updated.count) return NextResponse.json({ error: 'Medication not found' }, { status: 404 })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Medication deletion error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
