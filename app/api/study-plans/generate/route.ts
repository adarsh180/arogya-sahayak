import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { callAI } from '@/lib/ai'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { examType, duration } = await request.json()

    const prompt = `Generate a comprehensive ${duration}-day study plan for ${examType.toUpperCase()} exam preparation.

Requirements:
- Create daily study topics covering all subjects
- Include realistic time allocations (30-120 minutes per session)
- Balance theory, practice, and revision
- Include rest days and mock test days
- Provide specific topics for each subject

Format the response as a JSON array with this structure:
[
  {
    "subject": "Physics",
    "topic": "Mechanics - Laws of Motion",
    "scheduledDate": "2024-01-15",
    "duration": 90,
    "notes": "Focus on numerical problems"
  }
]

Generate a complete ${duration}-day plan starting from tomorrow:`

    const aiResponse = await callAI([{ role: 'user', content: prompt }], 'student')
    
    if (!aiResponse || aiResponse.includes('technical difficulties')) {
      return NextResponse.json({ error: 'Failed to generate study plan' }, { status: 500 })
    }

    try {
      const jsonMatch = aiResponse.match(/\[[\s\S]*\]/)
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response')
      }

      const planData = JSON.parse(jsonMatch[0])
      
      const studyPlans = await Promise.all(
        planData.map(async (plan: any, index: number) => {
          const scheduledDate = new Date()
          scheduledDate.setDate(scheduledDate.getDate() + index + 1)

          return await prisma.studyPlan.create({
            data: {
              userId: session.user.id,
              examType,
              subject: plan.subject,
              topic: plan.topic,
              scheduledDate,
              duration: plan.duration || 60,
              notes: plan.notes || null,
              status: 'pending'
            }
          })
        })
      )

      return NextResponse.json(studyPlans)
    } catch (parseError) {
      // Fallback: Generate basic study plan
      const subjects = ['Physics', 'Chemistry', 'Biology']
      const topics = {
        Physics: ['Mechanics', 'Thermodynamics', 'Optics', 'Electricity'],
        Chemistry: ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry'],
        Biology: ['Cell Biology', 'Genetics', 'Ecology', 'Human Physiology']
      }

      const studyPlans = []
      for (let i = 0; i < Math.min(duration, 30); i++) {
        const subject = subjects[i % subjects.length]
        const subjectTopics = topics[subject as keyof typeof topics]
        const topic = subjectTopics[Math.floor(i / subjects.length) % subjectTopics.length]
        
        const scheduledDate = new Date()
        scheduledDate.setDate(scheduledDate.getDate() + i + 1)

        const plan = await prisma.studyPlan.create({
          data: {
            userId: session.user.id,
            examType,
            subject,
            topic,
            scheduledDate,
            duration: 60 + (i % 3) * 30,
            notes: `Day ${i + 1} - Focus on understanding concepts`,
            status: 'pending'
          }
        })

        studyPlans.push(plan)
      }

      return NextResponse.json(studyPlans)
    }
  } catch (error) {
    console.error('AI study plan generation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}