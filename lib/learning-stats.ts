import { prisma } from '@/lib/prisma'

const dayKey = (date: Date) => date.toISOString().slice(0, 10)

/** Learning metrics shared by the learning hub and the progress page. `score` is already a percentage. */
export async function getLearningStats(userId: string, periodDays?: number) {
  const since = periodDays ? new Date(Date.now() - periodDays * 86_400_000) : undefined

  const [tests, completedPlans, upcomingPlans] = await Promise.all([
    prisma.mockTest.findMany({
      where: { userId, ...(since ? { completedAt: { gte: since } } : {}) },
      orderBy: { completedAt: 'desc' },
      select: { id: true, examType: true, subject: true, score: true, totalQuestions: true, correctAnswers: true, timeSpent: true, completedAt: true }
    }),
    prisma.studyPlan.findMany({
      where: { userId, status: 'completed', ...(since ? { scheduledDate: { gte: since } } : {}) },
      select: { duration: true, scheduledDate: true }
    }),
    prisma.studyPlan.count({ where: { userId, status: 'pending', scheduledDate: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } } })
  ])

  const totalTests = tests.length
  const averageScore = totalTests ? Math.round(tests.reduce((sum, test) => sum + test.score, 0) / totalTests) : 0
  const bestScore = totalTests ? Math.max(...tests.map(test => test.score)) : 0
  const studyMinutes = completedPlans.reduce((sum, plan) => sum + plan.duration, 0) + tests.reduce((sum, test) => sum + test.timeSpent, 0)

  const activeDays = new Set([...tests.map(test => dayKey(test.completedAt)), ...completedPlans.map(plan => dayKey(plan.scheduledDate))])
  let streak = 0
  const cursor = new Date()
  if (!activeDays.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1)
  while (activeDays.has(dayKey(cursor))) {
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }

  const bySubject = new Map<string, { total: number; count: number }>()
  for (const test of tests) {
    const entry = bySubject.get(test.subject) || { total: 0, count: 0 }
    entry.total += test.score
    entry.count += 1
    bySubject.set(test.subject, entry)
  }
  const subjects = [...bySubject.entries()]
    .map(([subject, { total, count }]) => ({ subject, average: Math.round(total / count), tests: count }))
    .sort((a, b) => b.tests - a.tests)

  const timeline = [...tests].reverse().slice(-20).map(test => ({ date: test.completedAt.toISOString(), score: test.score, subject: test.subject }))

  return {
    totalTests,
    averageScore,
    bestScore,
    studyMinutes,
    studyHours: Math.round((studyMinutes / 60) * 10) / 10,
    streak,
    upcomingSessions: upcomingPlans,
    subjects,
    timeline,
    recentTests: tests.slice(0, 8).map(test => ({ ...test, completedAt: test.completedAt.toISOString() }))
  }
}
