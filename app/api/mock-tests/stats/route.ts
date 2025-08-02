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

    const mockTests = await prisma.mockTest.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        completedAt: 'desc'
      },
      take: 5
    })

    const totalTests = await prisma.mockTest.count({
      where: {
        userId: session.user.id
      }
    })

    const averageScore = mockTests.length > 0 
      ? Math.round(mockTests.reduce((sum, test) => sum + test.score, 0) / mockTests.length)
      : 0

    const bestScore = mockTests.length > 0 
      ? Math.max(...mockTests.map(test => test.score))
      : 0

    const recentTests = mockTests.map(test => ({
      id: test.id,
      examType: test.examType,
      subject: test.subject,
      score: test.score,
      completedAt: test.completedAt.toISOString()
    }))

    return NextResponse.json({
      totalTests,
      averageScore,
      bestScore,
      recentTests
    })
  } catch (error) {
    console.error('Mock test stats error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}