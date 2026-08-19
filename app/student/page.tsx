'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { ArrowRight, BarChart3, BookOpen, Brain, CalendarDays, CheckCircle2, Clock3, FileQuestion, Flame, GraduationCap, Target } from 'lucide-react'
import Navbar from '@/components/Navbar'

type Stats = { totalTests: number; averageScore: number; studyHours: number; streak: number }

const paths = [
  { href: '/chat?type=student', icon: Brain, title: 'Guided study', copy: 'Work through a concept with retrieval questions and clinical reasoning.' },
  { href: '/mock-tests', icon: FileQuestion, title: 'Practice tests', copy: 'Generate labelled practice material, then review every explanation.' },
  { href: '/study-planner', icon: CalendarDays, title: 'Study plan', copy: 'Turn a syllabus into realistic, time-bounded sessions.' },
  { href: '/analytics', icon: BarChart3, title: 'Learning analytics', copy: 'Use completed activity—not invented scores—to reflect on progress.' },
]

export default function StudentPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [stats, setStats] = useState<Stats>({ totalTests: 0, averageScore: 0, studyHours: 0, streak: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/auth/signin?callbackUrl=/student')
    if (status === 'authenticated') fetch('/api/student/stats').then(response => response.ok ? response.json() : null).then(data => data && setStats(data)).finally(() => setLoading(false))
  }, [router, status])

  if (status === 'loading' || loading) return <div className="as-segment-loader" role="status">Opening your learning space…</div>

  return (
    <div className="as-student-page">
      <Navbar />
      <main id="main-content" className="as-student-dashboard as-container">
        <header className="as-student-heading">
          <div><span className="as-kicker">Medical learning workspace</span><h1>Study for durable understanding.</h1><p>Welcome{session?.user.name ? `, ${session.user.name.split(' ')[0]}` : ''}. Choose one focused action and finish it well.</p></div>
          <Link href="/chat?type=student" className="as-button">Start guided study <ArrowRight /></Link>
        </header>

        <section className="as-learning-stats" aria-label="Learning activity">
          <article><FileQuestion /><span><strong>{stats.totalTests}</strong>completed tests</span></article>
          <article><Target /><span><strong>{stats.totalTests ? `${stats.averageScore}%` : '—'}</strong>average score</span></article>
          <article><Clock3 /><span><strong>{Math.round(stats.studyHours / 60 * 10) / 10}h</strong>planned study</span></article>
          <article><Flame /><span><strong>{stats.streak}</strong>day activity streak</span></article>
        </section>

        <div className="as-learning-grid">
          <section className="as-learning-paths">
            <div className="as-card-heading"><div><span>Choose a learning action</span><h2>What will you finish now?</h2></div><GraduationCap /></div>
            <div>{paths.map(({ href, icon: Icon, title, copy }, index) => <Link href={href} key={title}><span className="as-path-index">0{index + 1}</span><Icon /><div><strong>{title}</strong><p>{copy}</p></div><ArrowRight /></Link>)}</div>
          </section>

          <aside className="as-focus-card">
            <span>Suggested session</span>
            <h2>25 minutes.<br />One difficult concept.</h2>
            <ol><li><i>05</i><div><strong>Retrieve</strong><p>Write what you already know without notes.</p></div></li><li><i>12</i><div><strong>Reason</strong><p>Work through one case or mechanism.</p></div></li><li><i>08</i><div><strong>Correct</strong><p>Compare, close gaps and schedule recall.</p></div></li></ol>
            <Link href="/chat?type=student">Open a focus session <ArrowRight /></Link>
          </aside>

          <section className="as-learning-boundary">
            <BookOpen /><div><span>Practice integrity</span><h2>Generated questions are practice—not official exam material.</h2><p>Always verify disputed facts against current textbooks, guidelines and the official syllabus. Arogya should help you reason, not manufacture confidence.</p></div><CheckCircle2 />
          </section>
        </div>
      </main>
    </div>
  )
}
