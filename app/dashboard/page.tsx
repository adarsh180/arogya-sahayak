'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import {
  Activity, ArrowRight, CalendarDays, ChevronRight, ClipboardList, FileText,
  HeartPulse, MessageSquareText, Pill, Plus, ShieldCheck, Stethoscope
} from 'lucide-react'
import Navbar from '@/components/Navbar'

type HealthRecord = { id: string; type: string; value: Record<string, string | number>; analysis?: { status?: string; message?: string }; createdAt: string }
type TimelineItem = { id: string; time: string; message: string; type: string }
type Insight = { type: string; status: 'normal' | 'warning' | 'danger'; message: string; suggestion: string }

const featureLinks = [
  { href: '/health-tracker', icon: Activity, title: 'Record a measurement', note: 'Blood pressure, glucose, BMI and pulse' },
  { href: '/medicine-reminder', icon: Pill, title: 'Review medicines', note: 'Schedules and adherence notes' },
  { href: '/appointments', icon: CalendarDays, title: 'Prepare an appointment', note: 'Questions, documents and follow-ups' },
  { href: '/health-records', icon: FileText, title: 'Open health records', note: 'A single organised timeline' },
]

export default function Dashboard() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [records, setRecords] = useState<HealthRecord[]>([])
  const [activity, setActivity] = useState<TimelineItem[]>([])
  const [insights, setInsights] = useState<Insight[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/auth/signin?callbackUrl=/dashboard')
    if (status === 'authenticated') {
      Promise.all([fetch('/api/health-data'), fetch('/api/health-activity?limit=5'), fetch('/api/health-analysis')])
        .then(async ([healthResponse, activityResponse, insightResponse]) => {
          if (healthResponse.ok) setRecords(await healthResponse.json())
          if (activityResponse.ok) setActivity(await activityResponse.json())
          if (insightResponse.ok) setInsights((await insightResponse.json()).insights || [])
        })
        .finally(() => setLoading(false))
    }
  }, [router, status])

  const latest = (type: string) => records.find(record => record.type === type)
  const metrics = [
    { label: 'Blood pressure', value: latest('blood_pressure') ? `${latest('blood_pressure')?.value.systolic}/${latest('blood_pressure')?.value.diastolic}` : '—', unit: 'mmHg' },
    { label: 'Glucose', value: latest('glucose')?.value.glucose || '—', unit: 'mg/dL' },
    { label: 'Resting pulse', value: latest('heart_rate')?.value.heart_rate || '—', unit: 'bpm' },
    { label: 'BMI', value: latest('bmi')?.value.bmi || '—', unit: 'screening value' },
  ]
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  if (status === 'loading' || loading) return <div className="as-segment-loader" role="status">Preparing your overview…</div>

  return (
    <div className="as-dashboard-page">
      <Navbar />
      <main id="main-content" className="as-dashboard as-container">
        {!session?.user.onboardingCompleted && <Link href="/onboarding" className="as-setup-banner"><span><ShieldCheck /><strong>Complete your guided setup</strong>Choose language, understand privacy and learn the workspace.</span><ArrowRight /></Link>}

        <header className="as-dashboard-heading">
          <div><span className="as-kicker">{greeting}{session?.user.name ? `, ${session.user.name.split(' ')[0]}` : ''}</span><h1>Your health, without the noise.</h1><p>See what changed, what needs attention and what to prepare next.</p></div>
          <Link href="/chat" className="as-button">Ask Arogya <MessageSquareText /></Link>
        </header>

        <section className="as-metric-strip" aria-label="Latest health measurements">
          {metrics.map(metric => <article key={metric.label}><span>{metric.label}</span><div><strong>{metric.value}</strong><small>{metric.unit}</small></div><i>{metric.value === '—' ? 'Not recorded' : 'Latest entry'}</i></article>)}
          <Link href="/health-tracker" aria-label="Add a measurement"><Plus /><span>Add reading</span></Link>
        </section>

        <div className="as-dashboard-grid">
          <section className="as-dashboard-card as-next-actions">
            <div className="as-card-heading"><div><span>Next actions</span><h2>Keep care moving</h2></div><ClipboardList /></div>
            <div className="as-feature-links">{featureLinks.map(({ href, icon: Icon, title, note }) => <Link key={href} href={href}><Icon /><span><strong>{title}</strong><small>{note}</small></span><ChevronRight /></Link>)}</div>
          </section>

          <section className="as-dashboard-card as-health-context">
            <div className="as-card-heading"><div><span>Measurement context</span><h2>Recent interpretations</h2></div><HeartPulse /></div>
            {insights.length ? <div className="as-insight-list">{insights.slice(0, 3).map((insight, index) => <article key={`${insight.type}-${index}`} className={`is-${insight.status}`}><i /><div><strong>{insight.message}</strong><p>{insight.suggestion}</p></div></article>)}</div> : <div className="as-empty-state"><Activity /><strong>No measurements yet</strong><p>Add a reading to see bounded, deterministic context here.</p><Link href="/health-tracker">Record the first one <ArrowRight /></Link></div>}
            <div className="as-card-disclaimer"><ShieldCheck /> Screening context only—not diagnosis. Symptoms and trends should be discussed with a clinician.</div>
          </section>

          <section className="as-dashboard-card as-timeline-card">
            <div className="as-card-heading"><div><span>Recent timeline</span><h2>What changed</h2></div><Activity /></div>
            {activity.length ? <ol>{activity.map(item => <li key={item.id}><i /><div><strong>{item.message}</strong><time>{new Date(item.time).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</time></div></li>)}</ol> : <div className="as-empty-state"><ClipboardList /><strong>Your timeline is clear</strong><p>New records and actions will appear here.</p></div>}
          </section>

          <aside className="as-clinician-card"><Stethoscope /><span>Before a clinical visit</span><h2>Turn scattered details into a useful conversation.</h2><p>Collect symptoms, dates, medicines, measurements and your most important questions.</p><Link href="/chat">Prepare my questions <ArrowRight /></Link></aside>
        </div>
      </main>
    </div>
  )
}
