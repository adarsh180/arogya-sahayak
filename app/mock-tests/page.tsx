'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { ArrowRight, ClipboardCheck, Clock3, Gauge, Play, ShieldCheck, Timer, Trophy, Zap } from 'lucide-react'
import AppShell from '@/components/shell/AppShell'
import { EmptyState, PageHeader, Skeleton, cx } from '@/components/ui/kit'
import { api } from '@/lib/client-api'
import { MEDICAL_EXAMS, subjectsFor } from '@/lib/constants'

type Stats = { totalTests: number; averageScore: number; bestScore: number; recentTests: Array<{ id: string; examType: string; subject: string; score: number; completedAt: string }> }

const modes = [
  { id: 'quick', title: 'Quick check', questions: 10, minutes: 12, icon: Zap, note: 'A fast pulse-check on one subject.' },
  { id: 'standard', title: 'Standard', questions: 20, minutes: 25, icon: Gauge, note: 'Enough depth to spot weak areas.' },
  { id: 'extended', title: 'Extended', questions: 25, minutes: 32, icon: Trophy, note: 'Closer to real exam stamina.' },
]

export default function MockTestsPage() {
  return <AppShell loadingLabel="Opening practice tests"><MockTests /></AppShell>
}

function MockTests() {
  const router = useRouter()
  const { data: session } = useSession()
  const [exam, setExam] = useState('neet-pg')
  const [subject, setSubject] = useState('')
  const [mode, setMode] = useState('quick')
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => { api<Stats>('/api/mock-tests/stats').then(setStats).catch(() => setStats({ totalTests: 0, averageScore: 0, bestScore: 0, recentTests: [] })) }, [])
  useEffect(() => {
    const target = session?.user.targetExam
    if (target && target in MEDICAL_EXAMS) setExam(target)
  }, [session])

  const subjects = useMemo(() => subjectsFor(exam), [exam])
  useEffect(() => { setSubject(current => (subjects.includes(current) ? current : '')) }, [subjects])
  const chosen = modes.find(item => item.id === mode)!

  function start() {
    if (!subject) return
    const query = new URLSearchParams({ exam, subject, questions: String(chosen.questions), duration: String(chosen.minutes) })
    router.push(`/mock-tests/test?${query}`)
  }

  return (
    <>
      <PageHeader kicker="Mock tests" title="Practise under gentle pressure." description="Choose an exam and subject. Questions are generated fresh, timed, and every answer comes with an explanation." />

      <div className="mt-layout">
        <div className="mt-builder">
          <section className="ui-card ui-card-pad">
            <div className="ui-card-head"><div><span className="ui-card-label">Step 1</span><h2>Exam</h2></div></div>
            <div className="mt-chip-grid">
              {Object.entries(MEDICAL_EXAMS).map(([value, label]) => <button key={value} type="button" className="ui-chip" aria-pressed={exam === value} onClick={() => setExam(value)}>{label}</button>)}
            </div>
          </section>

          <section className="ui-card ui-card-pad">
            <div className="ui-card-head"><div><span className="ui-card-label">Step 2</span><h2>Subject</h2></div></div>
            <div className="mt-chip-grid">
              {subjects.map(item => <button key={item} type="button" className="ui-chip" aria-pressed={subject === item} onClick={() => setSubject(item)}>{item}</button>)}
            </div>
          </section>

          <section className="ui-card ui-card-pad">
            <div className="ui-card-head"><div><span className="ui-card-label">Step 3</span><h2>Length</h2></div></div>
            <div className="mt-modes">
              {modes.map(({ id, title, questions, minutes, icon: Icon, note }) => (
                <button key={id} type="button" className={cx('mt-mode', mode === id && 'is-selected')} onClick={() => setMode(id)} aria-pressed={mode === id}>
                  <span className="ui-row-icon is-gold"><Icon /></span>
                  <strong>{title}</strong>
                  <span className="mt-mode-meta"><span><ClipboardCheck /> {questions} questions</span><span><Timer /> {minutes} min</span></span>
                  <small>{note}</small>
                </button>
              ))}
            </div>
          </section>

          <div className="mt-start">
            <div>
              <strong>{subject ? `${MEDICAL_EXAMS[exam as keyof typeof MEDICAL_EXAMS]} · ${subject}` : 'Choose a subject to begin'}</strong>
              <small>{chosen.questions} questions · {chosen.minutes} minutes · generated just for you</small>
            </div>
            <button type="button" className="ui-btn ui-btn-lg" disabled={!subject} onClick={start}><Play /> Start test</button>
          </div>
        </div>

        <aside className="mt-side">
          <section className="ui-card ui-card-pad">
            <div className="ui-card-head"><div><span className="ui-card-label">Your record</span><h2>Results so far</h2></div></div>
            {stats ? (
              <div className="mt-record">
                <div><small>Tests</small><strong className="ui-num">{stats.totalTests}</strong></div>
                <div><small>Average</small><strong className="ui-num">{stats.totalTests ? `${stats.averageScore}%` : '—'}</strong></div>
                <div><small>Best</small><strong className="ui-num">{stats.totalTests ? `${stats.bestScore}%` : '—'}</strong></div>
              </div>
            ) : <Skeleton height={64} />}
            {stats?.recentTests.length ? (
              <div className="ui-list mt-recent">
                {stats.recentTests.map(test => (
                  <div key={test.id} className="ui-row">
                    <span className={`learn-score ${test.score >= 70 ? 'is-good' : test.score >= 50 ? 'is-mid' : 'is-low'}`}>{test.score}%</span>
                    <div className="ui-row-body"><strong>{test.subject}</strong><small>{test.examType.toUpperCase()} · {new Date(test.completedAt).toLocaleDateString()}</small></div>
                  </div>
                ))}
              </div>
            ) : stats ? <EmptyState icon={Clock3} title="No tests yet">Your first result will appear here.</EmptyState> : null}
            {stats?.totalTests ? <Link href="/analytics" className="ui-link mt-more">See full progress <ArrowRight /></Link> : null}
          </section>
          <div className="ui-alert"><ShieldCheck /><span>Questions are AI-generated practice, not past papers. If an answer looks wrong, check a standard textbook.</span></div>
        </aside>
      </div>
    </>
  )
}
