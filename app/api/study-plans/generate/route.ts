import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { callAI, MEDICAL_EXAMS } from '@/lib/ai'
import { checkRateLimit, getRequestKey, parseJson, rateLimitResponse } from '@/lib/api-security'

const requestSchema = z.object({
  examType: z.string().trim().min(2).max(60),
  duration: z.coerce.number().int().min(3).max(21),
  minutesPerDay: z.coerce.number().int().min(30).max(600).default(120),
  focus: z.string().trim().max(200).optional()
})

const sessionSchema = z.object({
  day: z.coerce.number().int().min(1).max(60),
  subject: z.string().trim().min(2).max(100),
  topic: z.string().trim().min(2).max(200),
  duration: z.coerce.number().int().min(15).max(600),
  notes: z.string().trim().max(400).optional().nullable()
})

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const rate = checkRateLimit(`study-plan:${getRequestKey(request, session.user.id)}`, 3, 60_000)
  if (!rate.allowed) return rateLimitResponse(rate.retryAfter)
  const parsed = await parseJson(request, requestSchema)
  if (!parsed.ok) return parsed.response
  const { examType, duration, minutesPerDay, focus } = parsed.data
  const examName = MEDICAL_EXAMS[examType as keyof typeof MEDICAL_EXAMS] || examType

  const prompt = `Create a ${duration}-day study plan for ${examName} preparation with about ${minutesPerDay} minutes of study per day${focus ? `, focusing on: ${focus}` : ''}.
Use subjects that actually belong to the ${examName} syllabus. Mix new learning, active-recall revision and one short practice-test session every few days.
Return ONLY a JSON array with one or two sessions per day. Each item must be exactly:
{"day":1,"subject":"Subject","topic":"Specific topic","duration":60,"notes":"One short, practical instruction"}
Keep notes under 120 characters.`

  try {
    const response = await callAI(
      [{ role: 'user', content: prompt }], 'student', 'en', 1,
      { exam: examName, task: 'study-plan' },
      { temperature: 0.3, maxTokens: Math.min(6_000, 300 + duration * 260) }
    )
    const json = response.match(/\[[\s\S]*\]/)?.[0]
    if (!json) throw new Error('No plan array returned.')
    const sessions = (JSON.parse(json) as unknown[]).flatMap(item => {
      const result = sessionSchema.safeParse(item)
      return result.success && result.data.day <= duration ? [result.data] : []
    })
    if (sessions.length < Math.min(3, duration)) throw new Error('Too few valid sessions.')

    const start = new Date()
    start.setHours(9, 0, 0, 0)
    const created = await prisma.$transaction(sessions.map(item => {
      const scheduledDate = new Date(start)
      scheduledDate.setDate(start.getDate() + item.day)
      return prisma.studyPlan.create({
        data: {
          userId: session.user.id, examType, subject: item.subject, topic: item.topic,
          scheduledDate, duration: item.duration, notes: item.notes || null, status: 'pending'
        }
      })
    }))
    return NextResponse.json(created, { status: 201 })
  } catch (error) {
    console.error('AI study plan generation error:', error)
    return NextResponse.json({ error: 'A study plan could not be generated right now. Nothing was added — please try again in a moment.' }, { status: 502 })
  }
}
