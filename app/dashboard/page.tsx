'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import {
  Activity, ArrowRight, BookA, CalendarClock, ChevronRight, ClipboardList, FileSearch, GraduationCap,
  HeartPulse, MessageSquareText, Pill, Plus, ShieldCheck, Siren, Sparkles, Stethoscope
} from 'lucide-react'
import AppShell from '@/components/shell/AppShell'
import { EmptyState, PageHeader, Skeleton, StatusBadge } from '@/components/ui/kit'
import { Sparkline } from '@/components/ui/charts'
import { api } from '@/lib/client-api'
import { formatReading, METRIC_META, type MetricType } from '@/lib/health-assess'

type Reading = { id: string; type: MetricType; value: Record<string, number | string>; analysis: { status?: string; message?: string; suggestion?: string }; createdAt: string }
type TimelineItem = { id: string; time: string; message: string; type: string; status: string | null }
type Medicine = { id: string; name: string; dosage: string; reminders: string[]; isActive: boolean }

const metricOrder: MetricType[] = ['blood_pressure', 'glucose', 'heart_rate', 'bmi']
const metricValue = (reading: Reading) => Number(reading.type === 'blood_pressure' ? reading.value.systolic : reading.value[reading.type === 'heart_rate' ? 'heart_rate' : reading.type])

function greeting() {
  const hour = new Date().getHours()
  return hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
}

export default function DashboardPage() {
  return <AppShell loadingLabel="Preparing your overview"><Dashboard /></AppShell>
}

function Dashboard() {
  const { data: session } = useSession()
  const [readings, setReadings] = useState<Reading[] | null>(null)
  const [activity, setActivity] = useState<TimelineItem[]>([])
  const [medicines, setMedicines] = useState<Medicine[]>([])

  useEffect(() => {
    api<Reading[]>('/api/health-data?limit=60').then(setReadings).catch(() => setReadings([]))
    api<TimelineItem[]>('/api/health-activity?limit=6').then(setActivity).catch(() => setActivity([]))
    api<Medicine[]>('/api/medicines').then(setMedicines).catch(() => setMedicines([]))
  }, [])

  const byType = useMemo(() => {
    const groups = new Map<MetricType, Reading[]>()
    for (const reading of readings || []) groups.set(reading.type, [...(groups.get(reading.type) || []), reading])
    return groups
  }, [readings])

  const doses = useMemo(() => {
    const now = new Date()
    const current = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    return medicines
      .filter(medicine => medicine.isActive)
      .flatMap(medicine => medicine.reminders.map(time => ({ ...medicine, time, upcoming: time >= current })))
      .sort((a, b) => a.time.localeCompare(b.time))
  }, [medicines])
  const nextDose = doses.find(dose => dose.upcoming)

  const insights = metricOrder.map(type => byType.get(type)?.[0]).filter(Boolean) as Reading[]
  const firstName = session?.user.name?.split(' ')[0]

  return (
    <>
      <PageHeader
        kicker={`${greeting()}${firstName ? `, ${firstName}` : ''}`}
        title="Your health, without the noise."
        description="What changed, what needs attention, and what to prepare next — all in one calm place."
        actions={<>
          <Link href="/health-tracker?add=1" className="ui-btn ui-btn-secondary"><Plus /> Add reading</Link>
          <Link href="/chat" className="ui-btn"><MessageSquareText /> Ask Arogya</Link>
        </>}
      />

      {session && !session.user.onboardingCompleted && (
        <Link href="/onboarding" className="dash-setup ui-rise">
          <span className="dash-setup-icon"><Sparkles /></span>
          <span><strong>Finish your two-minute setup</strong><small>Pick your language and focus so Arogya can tailor answers.</small></span>
          <ArrowRight />
        </Link>
      )}

      <section className="dash-vitals" aria-label="Latest measurements">
        {metricOrder.map((type, index) => {
          const series = byType.get(type) || []
          const latest = series[0]
          const meta = METRIC_META[type]
          return (
            <Link key={type} href={`/health-tracker?metric=${type}`} className="dash-vital ui-rise" style={{ '--d': `${index * 50}ms` } as React.CSSProperties}>
              <span className="dash-vital-label">{meta.label}</span>
              {readings === null ? <Skeleton height={34} width="60%" /> : (
                <div className="dash-vital-value">
                  <strong className="ui-num">{latest ? formatReading(type, latest.value) : '—'}</strong>
                  <small>{latest ? meta.unit : 'Not recorded'}</small>
                </div>
              )}
              <div className="dash-vital-foot">
                {latest ? <StatusBadge status={latest.analysis.status} /> : <span className="ui-link">Record <ArrowRight /></span>}
                <Sparkline values={series.slice(0, 10).reverse().map(metricValue).filter(Number.isFinite)} label={`${meta.label} recent trend`} width={76} height={28} />
              </div>
            </Link>
          )
        })}
      </section>

      <div className="dash-grid">
        <section className="ui-card ui-card-pad dash-meds">
          <div className="ui-card-head">
            <div><span className="ui-card-label">Today</span><h2>Medicine schedule</h2></div>
            <Link href="/medicine-reminder" className="ui-link">Manage <ArrowRight /></Link>
          </div>
          {doses.length ? (
            <>
              {nextDose && (
                <div className="dash-next-dose">
                  <CalendarClock />
                  <span><small>Next dose</small><strong>{nextDose.name} · {nextDose.dosage}</strong></span>
                  <time className="ui-num">{nextDose.time}</time>
                </div>
              )}
              <ol className="dash-dose-list">
                {doses.slice(0, 6).map(dose => (
                  <li key={`${dose.id}-${dose.time}`} className={dose.upcoming ? '' : 'is-past'}>
                    <time className="ui-num">{dose.time}</time><span>{dose.name}</span><small>{dose.dosage}</small>
                  </li>
                ))}
              </ol>
            </>
          ) : (
            <EmptyState icon={Pill} title="No reminders yet" action={<Link href="/medicine-reminder?add=1" className="ui-btn ui-btn-secondary ui-btn-sm"><Plus /> Add a medicine</Link>}>
              Add medicines with reminder times and today’s schedule appears here.
            </EmptyState>
          )}
        </section>

        <section className="ui-card ui-card-pad dash-insights">
          <div className="ui-card-head">
            <div><span className="ui-card-label">Measurement context</span><h2>What your readings suggest</h2></div>
            <HeartPulse />
          </div>
          {readings === null ? <div className="grid gap-3"><Skeleton height={58} /><Skeleton height={58} /></div> : insights.length ? (
            <div className="dash-insight-list">
              {insights.slice(0, 3).map(reading => (
                <article key={reading.id} className={`is-${reading.analysis.status || 'normal'}`}>
                  <div><StatusBadge status={reading.analysis.status}>{METRIC_META[reading.type].short}</StatusBadge></div>
                  <strong>{reading.analysis.message}</strong>
                  <p>{reading.analysis.suggestion}</p>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState icon={Activity} title="No measurements yet" action={<Link href="/health-tracker?add=1" className="ui-link">Record your first reading <ArrowRight /></Link>}>
              Add a reading to see clear, bounded context here.
            </EmptyState>
          )}
          <p className="dash-disclaimer"><ShieldCheck /> Screening context only — not a diagnosis.</p>
        </section>

        <section className="ui-card ui-card-pad dash-timeline">
          <div className="ui-card-head">
            <div><span className="ui-card-label">Recent activity</span><h2>What changed</h2></div>
            <ClipboardList />
          </div>
          {activity.length ? (
            <ol className="dash-timeline-list">
              {activity.map(item => (
                <li key={item.id}>
                  <i className={item.status ? `is-${item.status}` : ''} />
                  <div><strong>{item.message}</strong><time>{new Date(item.time).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</time></div>
                </li>
              ))}
            </ol>
          ) : <EmptyState icon={ClipboardList} title="Your timeline is clear">New readings and actions will appear here.</EmptyState>}
        </section>

        <aside className="ui-card is-forest dash-visit">
          <Stethoscope className="dash-visit-icon" />
          <span className="ui-card-label">Before a clinical visit</span>
          <h2>Turn scattered details into a useful conversation.</h2>
          <p>Arogya can help you collect symptoms, dates, medicines and the questions that matter most.</p>
          <Link href="/chat?prompt=appointment" className="ui-btn ui-btn-light">Prepare my questions <ArrowRight /></Link>
        </aside>
      </div>

      <section className="dash-shortcuts" aria-label="More tools">
        {[
          { href: '/medical-dictionary', icon: BookA, title: 'Medical dictionary', note: 'Plain-language definitions' },
          { href: '/resources', icon: FileSearch, title: 'Evidence library', note: 'Sources Arogya relies on' },
          { href: '/student', icon: GraduationCap, title: 'Learning hub', note: 'Practice, plan and review' },
          { href: '/emergency', icon: Siren, title: 'Emergency', note: 'Numbers and your contacts', danger: true },
        ].map(({ href, icon: Icon, title, note, danger }) => (
          <Link key={href} href={href} className={`ui-card dash-shortcut is-interactive ${danger ? 'is-danger' : ''}`}>
            <span className="ui-row-icon"><Icon /></span>
            <span><strong>{title}</strong><small>{note}</small></span>
            <ChevronRight />
          </Link>
        ))}
      </section>
    </>
  )
}
