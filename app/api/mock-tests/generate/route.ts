import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { callAI } from '@/lib/ai'
import { checkRateLimit, getRequestKey, parseJson, rateLimitResponse } from '@/lib/api-security'

const requestSchema = z.object({
  exam: z.string().trim().min(2).max(60),
  subject: z.string().trim().min(2).max(100),
  questions: z.coerce.number().int().min(3).max(25).optional(),
  questionCount: z.coerce.number().int().min(3).max(25).optional()
})

const questionSchema = z.object({
  question: z.string().min(8).max(1_000),
  options: z.array(z.string().min(1).max(500)).length(4),
  correct: z.number().int().min(0).max(3),
  explanation: z.string().min(4).max(2_000)
})

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const rate = checkRateLimit(`mock-test:${getRequestKey(request, session.user.id)}`, 6, 60_000)
  if (!rate.allowed) return rateLimitResponse(rate.retryAfter)
  const parsed = await parseJson(request, requestSchema)
  if (!parsed.ok) return parsed.response
  const { exam, subject } = parsed.data
  const questionCount = parsed.data.questionCount || parsed.data.questions || 10

  try {
    const response = await callAI([{ role: 'user', content: `Create ${questionCount} practice MCQs for ${exam} in ${subject}. Return only a JSON array. Each item must use: {"question":"...","options":["...","...","...","..."],"correct":0,"explanation":"..."}. The correct value is the zero-based option index. Avoid ambiguous stems and explain why the correct option is best. These are generated practice questions, not official past-paper questions.` }], 'student', 'en', 1, { exam, subject, task: 'practice-mcq' }, { temperature: 0.25, maxTokens: Math.min(8_000, 400 + questionCount * 320) })
    const json = response.match(/\[[\s\S]*\]/)?.[0]
    if (!json) throw new Error('The provider did not return a question array.')
    const items = (JSON.parse(json) as unknown[]).filter(item => questionSchema.safeParse(item).success).slice(0, questionCount)
    const questionsResult = z.array(questionSchema).min(Math.min(3, questionCount)).safeParse(items)
    if (!questionsResult.success) throw new Error('The generated questions did not pass validation.')
    return NextResponse.json({ questions: questionsResult.data, notice: 'AI-generated practice material. Verify disputed facts against current primary sources and your official syllabus.' })
  } catch (error) {
    console.error('Mock-test generation error:', error)
    return NextResponse.json({ error: 'Validated practice questions are unavailable right now. No placeholder questions were substituted.' }, { status: 502 })
  }
}
