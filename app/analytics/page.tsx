'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { ArrowRight, Award, ClipboardCheck, Clock3, Flame, LineChart, Target } from 'lucide-react'
import AppShell from '@/components/shell/AppShell'
import { EmptyState, PageHeader, Segmented, Skeleton } from '@/components/ui/kit'
import { ScoreBars, TrendChart } from '@/components/ui/charts'
import { api, errorMessage } from '@/lib/client-api'

type Period = '7d' | '30d' | '90d' | 'all'
type Stats = {
  totalTests: number; averageScore: number; bestScore: number; studyHours: number; studyMinutes: number; streak: number
  subjects: Array<{ subject: string; average: number; tests: number }>
  timeline: Array<{ date: string; score: number; subject: string }>
  recentTests: Array<{ id: string; examType: string; subject: string; score: number; totalQuestions: number; correctAnswers: number; timeSpent: number; completedAt: string }>
}

export default function AnalyticsPage() {
  return <AppShell loadingLabel="Opening your progress"><Analytics /></AppShell>
}

function Analytics() {
  const [period, setPeriod] = useState<Period>('30d')
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    setStats(null)
    api<Stats>(`/api/analytics?period=${period}`).then(setStats).catch(reason => toast.error(errorMessage(reason)))
  }, [period])

  const weakest = stats?.subjects.length ? [...stats.subjects].sort((a, b) => a.average - b.average)[0] : null
  const tiles = [
    { icon: ClipboardCheck, label: 'Tests taken', value: stats?.totalTests ?? 0 },
    { icon: Target, label: 'Average score', value: stats?.totalTests ? `${stats.averageScore}%` : '—' },
    { icon: Award, label: 'Best score', value: stats?.totalTests ? `${stats.bestScore}%` : '—' },
    { icon: Clock3, label: 'Study time', value: stats ? (stats.studyMinutes < 60 ? stats.studyMinutes : stats.studyHours) : 0, unit: stats && stats.studyMinutes < 60 ? 'min' : 'h' },
  ]

  return (
    <>
      <PageHeader
        kicker="Progress"
        title="See what’s working — honestly."
        description="Built only from tests you completed and study sessions you marked done."
        actions={<Segmented<Period> label="Time period" value={period} onChange={setPeriod} options={[{ value: '7d', label: '7 days' }, { value: '30d', label: '30 days' }, { value: '90d', label: '90 days' }, { value: 'all', label: 'All' }]} />}
      />

      <section className="ui-stats" aria-label="Summary">
        {tiles.map(({ icon: Icon, label, value, unit }) => (
          <article key={label} className="ui-stat">
            <span><Icon />{label}</span>
            {stats ? <strong>{value}{unit && <small>{unit}</small>}</strong> : <Skeleton height={32} width="50%" />}
          </article>
        ))}
      </section>

      {stats && !stats.totalTests ? (
        <section className="ui-card prog-empty">
          <EmptyState icon={LineChart} title="No tests in this period" action={<Link href="/mock-tests" className="ui-btn ui-btn-sm">Take a practice test <ArrowRight /></Link>}>
            Complete a mock test and your scores, subject strengths and trend will appear here.
          </EmptyState>
        </section>
      ) : (
        <div className="prog-grid">
          <section className="ui-card ui-card-pad prog-trend">
            <div className="ui-card-head"><div><span className="ui-card-label">Score trend</span><h2>Each test, in order</h2></div>{stats && stats.streak > 0 && <span className="ui-badge is-gold is-bare"><Flame /> {stats.streak}-day streak</span>}</div>
            {stats ? (
              stats.timeline.length > 1
                ? <TrendChart label="Mock test scores over time" unit="%" band={[70, 100]} points={stats.timeline.map(item => ({ date: item.date, value: item.score, note: item.subject }))} />
                : <p className="ui-faint">Take one more test to see a trend line.</p>
            ) : <Skeleton height={220} />}
            {stats && stats.timeline.length > 1 && <div className="ui-chart-legend"><span><i /> Score</span><span><i className="is-band" /> 70%+ target zone</span></div>}
          </section>

          <section className="ui-card ui-card-pad prog-subjects">
            <div className="ui-card-head"><div><span className="ui-card-label">By subject</span><h2>Average score</h2></div></div>
            {stats ? <ScoreBars items={stats.subjects.map(item => ({ label: item.subject, value: item.average, meta: `${item.tests} test${item.tests === 1 ? '' : 's'}` }))} /> : <Skeleton height={160} />}
            {weakest && stats && stats.subjects.length > 1 && (
              <div className="ui-alert is-warn prog-focus"><Target /><span><strong>Suggested focus: {weakest.subject}.</strong> It’s your lowest average this period.</span>
                <Link href={`/chat?type=student&prompt=${encodeURIComponent(`Help me revise ${weakest.subject}: start by asking me five recall questions on high-yield topics.`)}`} className="ui-link">Revise <ArrowRight /></Link>
              </div>
            )}
          </section>

          <section className="ui-card ui-card-pad prog-recent">
            <div className="ui-card-head"><div><span className="ui-card-label">History</span><h2>Recent tests</h2></div></div>
            {stats ? (
              <div className="prog-table-wrap">
                <table className="prog-table">
                  <thead><tr><th>Date</th><th>Subject</th><th>Exam</th><th>Correct</th><th>Time</th><th>Score</th></tr></thead>
                  <tbody>
                    {stats.recentTests.map(test => (
                      <tr key={test.id}>
                        <td>{new Date(test.completedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</td>
                        <td>{test.subject}</td>
                        <td>{test.examType.toUpperCase()}</td>
                        <td className="ui-num">{test.correctAnswers}/{test.totalQuestions}</td>
                        <td className="ui-num">{test.timeSpent} min</td>
                        <td><span className={`learn-score ${test.score >= 70 ? 'is-good' : test.score >= 50 ? 'is-mid' : 'is-low'}`}>{test.score}%</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <Skeleton height={160} />}
          </section>
        </div>
      )}
    </>
  )
}
