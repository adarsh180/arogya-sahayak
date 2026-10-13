'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { ArrowRight, BookOpen, Brain, CalendarDays, CheckCircle2, ClipboardCheck, Clock3, Flame, LineChart, Target } from 'lucide-react'
import AppShell from '@/components/shell/AppShell'
import { PageHeader, Skeleton } from '@/components/ui/kit'
import { api } from '@/lib/client-api'

type Stats = { totalTests: number; averageScore: number; bestScore: number; studyHours: number; studyMinutes: number; streak: number; upcomingSessions: number; recentTests: Array<{ id: string; subject: string; examType: string; score: number; completedAt: string }> }
type Plan = { id: string; subject: string; topic: string; scheduledDate: string; duration: number; status: string }

const paths = [
  { href: '/chat?type=student', icon: Brain, title: 'Guided study', copy: 'Work a concept through with recall questions and clinical reasoning.' },
  { href: '/mock-tests', icon: ClipboardCheck, title: 'Practice test', copy: 'Timed MCQs with an explanation for every answer.' },
  { href: '/study-planner', icon: CalendarDays, title: 'Study plan', copy: 'Turn a syllabus into realistic, time-boxed sessions.' },
  { href: '/analytics', icon: LineChart, title: 'Progress', copy: 'See scores by subject and how they move over time.' },
]

export default function StudentPage() {
  return <AppShell loadingLabel="Opening your learning space"><Hub /></AppShell>
}

function Hub() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<Stats | null>(null)
  const [next, setNext] = useState<Plan[]>([])

  useEffect(() => {
    api<Stats>('/api/student/stats').then(setStats).catch(() => setStats({ totalTests: 0, averageScore: 0, bestScore: 0, studyHours: 0, studyMinutes: 0, streak: 0, upcomingSessions: 0, recentTests: [] }))
    api<Plan[]>('/api/study-plans').then(plans => {
      const today = new Date(new Date().setHours(0, 0, 0, 0))
      setNext(plans.filter(plan => plan.status === 'pending' && new Date(plan.scheduledDate) >= today).slice(0, 3))
    }).catch(() => undefined)
  }, [])

  const first = session?.user.name?.split(' ')[0]
  const tiles = [
    { icon: ClipboardCheck, label: 'Tests completed', value: stats?.totalTests ?? 0 },
    { icon: Target, label: 'Average score', value: stats?.totalTests ? `${stats.averageScore}%` : '—' },
    { icon: Clock3, label: 'Study time', value: stats ? (stats.studyMinutes < 60 ? stats.studyMinutes : stats.studyHours) : 0, unit: stats && stats.studyMinutes < 60 ? 'min' : 'h' },
    { icon: Flame, label: 'Day streak', value: stats?.streak ?? 0 },
  ]

  return (
    <>
      <PageHeader
        kicker={`Learning${first ? ` · ${first}` : ''}`}
        title="Study for understanding that lasts."
        description="Pick one focused action and finish it well. Every number here comes from work you actually completed."
        actions={<Link href="/chat?type=student" className="ui-btn"><Brain /> Start guided study</Link>}
      />

      <section className="ui-stats" aria-label="Learning activity">
        {tiles.map(({ icon: Icon, label, value, unit }, index) => (
          <article key={label} className="ui-stat ui-rise" style={{ '--d': `${index * 50}ms` } as React.CSSProperties}>
            <span><Icon />{label}</span>
            {stats ? <strong>{value}{unit && <small>{unit}</small>}</strong> : <Skeleton height={32} width="50%" />}
          </article>
        ))}
      </section>

      <div className="learn-grid">
        <section className="ui-card ui-card-pad learn-paths">
          <div className="ui-card-head"><div><span className="ui-card-label">Choose an action</span><h2>What will you finish now?</h2></div></div>
          <div className="learn-path-list">
            {paths.map(({ href, icon: Icon, title, copy }, index) => (
              <Link key={href} href={href} className="learn-path">
                <span className="learn-path-num">0{index + 1}</span>
                <span className="ui-row-icon"><Icon /></span>
                <span className="learn-path-text"><strong>{title}</strong><small>{copy}</small></span>
                <ArrowRight />
              </Link>
            ))}
          </div>
        </section>

        <aside className="ui-card is-deep learn-focus">
          <span className="ui-card-label">Suggested session</span>
          <h2>25 minutes. One hard concept.</h2>
          <ol>
            <li><i>05</i><div><strong>Retrieve</strong><p>Write what you know without notes.</p></div></li>
            <li><i>12</i><div><strong>Reason</strong><p>Work one case or mechanism end to end.</p></div></li>
            <li><i>08</i><div><strong>Correct</strong><p>Close the gaps and schedule a recall.</p></div></li>
          </ol>
          <Link href="/chat?type=student&prompt=Build%20a%2025-minute%20active-recall%20session%20on%20a%20topic%20I%20find%20difficult.%20Ask%20me%20which%20topic%20first." className="ui-btn ui-btn-light">Begin a focus session <ArrowRight /></Link>
        </aside>

        <section className="ui-card ui-card-pad">
          <div className="ui-card-head"><div><span className="ui-card-label">Up next</span><h2>Planned sessions</h2></div><Link href="/study-planner" className="ui-link">Planner <ArrowRight /></Link></div>
          {next.length ? (
            <div className="ui-list">
              {next.map(plan => (
                <div key={plan.id} className="ui-row">
                  <span className="learn-date"><b>{new Date(plan.scheduledDate).getDate()}</b>{new Date(plan.scheduledDate).toLocaleDateString(undefined, { month: 'short' })}</span>
                  <div className="ui-row-body"><strong>{plan.topic}</strong><small>{plan.subject} · {plan.duration} min</small></div>
                </div>
              ))}
            </div>
          ) : <p className="ui-faint learn-empty">No sessions planned. <Link href="/study-planner" className="ui-link">Build a plan <ArrowRight /></Link></p>}
        </section>

        <section className="ui-card ui-card-pad">
          <div className="ui-card-head"><div><span className="ui-card-label">Recent</span><h2>Latest tests</h2></div><Link href="/analytics" className="ui-link">Progress <ArrowRight /></Link></div>
          {stats?.recentTests?.length ? (
            <div className="ui-list">
              {stats.recentTests.slice(0, 3).map(test => (
                <div key={test.id} className="ui-row">
                  <span className={`learn-score ${test.score >= 70 ? 'is-good' : test.score >= 50 ? 'is-mid' : 'is-low'}`}>{test.score}%</span>
                  <div className="ui-row-body"><strong>{test.subject}</strong><small>{test.examType.toUpperCase()} · {new Date(test.completedAt).toLocaleDateString()}</small></div>
                </div>
              ))}
            </div>
          ) : <p className="ui-faint learn-empty">No tests yet. <Link href="/mock-tests" className="ui-link">Take a practice test <ArrowRight /></Link></p>}
        </section>
      </div>

      <div className="ui-alert learn-integrity"><BookOpen /><span><strong>Practice integrity.</strong> Generated questions and explanations are practice material, not official exam content. Check disputed facts against current textbooks and guidelines.</span><CheckCircle2 /></div>
    </>
  )
}
