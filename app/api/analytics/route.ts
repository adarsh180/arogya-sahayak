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

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '7d'

    const periodDays = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '1y': 365
    }

    const days = periodDays[period as keyof typeof periodDays] || 7
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const mockTests = await prisma.mockTest.findMany({
      where: {
        userId: session.user.id,
        completedAt: {
          gte: startDate
        }
      },
      orderBy: {
        completedAt: 'desc'
      }
    })

    const totalTests = mockTests.length
    const averageScore = totalTests > 0 ? Math.round(mockTests.reduce((sum, test) => sum + test.score, 0) / totalTests) : 0
    const bestScore = totalTests > 0 ? Math.max(...mockTests.map(test => test.score)) : 0
    const totalStudyTime = mockTests.reduce((sum, test) => sum + test.timeSpent, 0)

    const subjectScores: { [key: string]: number } = {}
    const subjectCounts: { [key: string]: number } = {}

    mockTests.forEach(test => {
      if (!subjectScores[test.subject]) {
        subjectScores[test.subject] = 0
        subjectCounts[test.subject] = 0
      }
      subjectScores[test.subject] += test.score
      subjectCounts[test.subject]++
    })

    Object.keys(subjectScores).forEach(subject => {
      subjectScores[subject] = Math.round(subjectScores[subject] / subjectCounts[subject])
    })

    const recentTests = mockTests.slice(0, 10).map(test => ({
      id: test.id,
      examType: test.examType,
      subject: test.subject,
      score: test.score,
      totalQuestions: test.totalQuestions,
      timeSpent: test.timeSpent,
      completedAt: test.completedAt.toISOString()
    }))

    return NextResponse.json({
      totalTests,
      averageScore,
      bestScore,
      totalStudyTime,
      streak: 0,
      subjectScores,
      recentTests,
      weeklyProgress: []
    })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}