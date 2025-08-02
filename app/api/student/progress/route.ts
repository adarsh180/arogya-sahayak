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

    const subjects = [
      { name: 'Physics', color: 'bg-blue-500' },
      { name: 'Chemistry', color: 'bg-green-500' },
      { name: 'Biology', color: 'bg-red-500' },
      { name: 'Mathematics', color: 'bg-purple-500' }
    ]

    // Fetch real progress from database
    const progressData = await Promise.all(
      subjects.map(async (subject) => {
        const testResults = await prisma.mockTest.findMany({
          where: { 
            userId: session.user.id,
            subject: subject.name.toLowerCase()
          },
          select: { score: true, totalQuestions: true }
        })
        
        const progress = testResults.length > 0
          ? Math.round(testResults.reduce((sum, test) => sum + (test.score / test.totalQuestions * 100), 0) / testResults.length)
          : 0
        
        return {
          ...subject,
          progress
        }
      })
    )

    return NextResponse.json(progressData)
  } catch (error) {
    console.error('Error fetching student progress:', error)
    const subjects = [
      { name: 'Physics', color: 'bg-blue-500' },
      { name: 'Chemistry', color: 'bg-green-500' },
      { name: 'Biology', color: 'bg-red-500' },
      { name: 'Mathematics', color: 'bg-purple-500' }
    ]
    const defaultProgress = subjects.map(subject => ({
      ...subject,
      progress: 0
    }))
    return NextResponse.json(defaultProgress)
  }
}