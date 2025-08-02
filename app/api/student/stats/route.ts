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

    // Fetch real stats from database
    const [testResults, studyLogs] = await Promise.all([
      prisma.mockTest.findMany({
        where: { userId: session.user.id },
        select: { score: true, totalQuestions: true, completedAt: true }
      }),
      prisma.studyPlan.findMany({
        where: { 
          userId: session.user.id,
          status: 'completed'
        },
        select: { duration: true, createdAt: true }
      })
    ])

    const totalTests = testResults.length
    const averageScore = totalTests > 0 
      ? Math.round(testResults.reduce((sum, test) => sum + (test.score / test.totalQuestions * 100), 0) / totalTests)
      : 0
    
    const studyHours = studyLogs.reduce((sum, log) => sum + (log.duration || 0), 0)
    
    // Calculate streak (consecutive days with activity)
    const today = new Date()
    let streak = 0
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today)
      checkDate.setDate(today.getDate() - i)
      const hasActivity = [
        ...testResults.map(t => ({ createdAt: t.completedAt })),
        ...studyLogs
      ].some(item => {
        const itemDate = new Date(item.createdAt)
        return itemDate.toDateString() === checkDate.toDateString()
      })
      if (hasActivity) streak++
      else break
    }

    const stats = {
      totalTests,
      averageScore,
      studyHours,
      streak
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching student stats:', error)
    return NextResponse.json({
      totalTests: 0,
      averageScore: 0,
      studyHours: 0,
      streak: 0
    })
  }
}