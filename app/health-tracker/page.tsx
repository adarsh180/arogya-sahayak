'use client'

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import toast from 'react-hot-toast'
import {
  Activity, AlertTriangle, CheckCircle2, Droplets, HeartPulse, History, LineChart, Plus, Scale, ShieldCheck, Trash2
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import AppShell from '@/components/shell/AppShell'
import { EmptyState, Modal, PageHeader, Skeleton, Spinner, StatusBadge, Tabs, cx } from '@/components/ui/kit'
import { TrendChart } from '@/components/ui/charts'
import { api, errorMessage } from '@/lib/client-api'
import { formatReading, METRIC_META, type Assessment, type MetricType } from '@/lib/health-assess'

type Reading = { id: string; type: MetricType; value: Record<string, number | string>; analysis: Partial<Assessment>; createdAt: string }
type Tab = 'overview' | 'trends' | 'history'

const metrics: Array<{ type: MetricType; icon: LucideIcon; band: [number, number]; hint: string }> = [
  { type: 'blood_pressure', icon: HeartPulse, band: [90, 129], hint: 'Sit quietly for 5 minutes, arm supported at heart level.' },
  { type: 'glucose', icon: Droplets, band: [70, 139], hint: 'Note whether you were fasting or how long after a meal.' },
  { type: 'heart_rate', icon: Activity, band: [60, 100], hint: 'Measure at rest, ideally at the same time each day.' },
  { type: 'bmi', icon: Scale, band: [18.5, 24.9], hint: 'Enter weight and height; BMI is calculated for you.' },
]
const metricInfo = Object.fromEntries(metrics.map(metric => [metric.type, metric])) as Record<MetricType, typeof metrics[number]>
const primary = (reading: Reading) => Number(reading.type === 'blood_pressure' ? reading.value.systolic : reading.value[reading.type])

export default function HealthTrackerPage() {
  return <AppShell loadingLabel="Opening your measurements"><Suspense fallback={null}><HealthTracker /></Suspense></AppShell>
}

function HealthTracker() {
  const params = useSearchParams()
  const [tab, setTab] = useState<Tab>(params.get('tab') === 'history' ? 'history' : params.get('tab') === 'trends' ? 'trends' : 'overview')
  const [readings, setReadings] = useState<Reading[] | null>(null)
  const [focus, setFocus] = useState<MetricType>((params.get('metric') as MetricType) in METRIC_META ? params.get('metric') as MetricType : 'blood_pressure')
  const [adding, setAdding] = useState<MetricType | null>(params.get('add') ? focus : null)
  const [deleting, setDeleting] = useState<string>()

  const load = useCallback(() => api<Reading[]>('/api/health-data?limit=120').then(setReadings).catch(reason => { setReadings([]); toast.error(errorMessage(reason)) }), [])
  useEffect(() => { load() }, [load])

  const byType = useMemo(() => {
    const groups = Object.fromEntries(metrics.map(metric => [metric.type, [] as Reading[]])) as Record<MetricType, Reading[]>
    for (const reading of readings || []) groups[reading.type]?.push(reading)
    return groups
  }, [readings])

  async function remove(id: string) {
    if (!window.confirm('Delete this reading? This cannot be undone.')) return
    setDeleting(id)
    try {
      await api(`/api/health-data?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
      setReadings(items => (items || []).filter(item => item.id !== id))
      toast.success('Reading deleted')
    } catch (reason) {
      toast.error(errorMessage(reason))
    } finally {
      setDeleting(undefined)
    }
  }

  return (
    <>
      <PageHeader
        kicker="Measurements"
        title="Track the numbers that matter."
        description="Record readings at home and see each one in context. Trends over days say more than any single value."
        actions={<button type="button" className="ui-btn" onClick={() => setAdding(focus)}><Plus /> Add reading</button>}
      />

      <Tabs<Tab> label="Measurement views" value={tab} onChange={setTab} tabs={[
        { value: 'overview', label: 'Overview', icon: Activity },
        { value: 'trends', label: 'Trends', icon: LineChart },
        { value: 'history', label: 'History', icon: History, count: readings?.length },
      ]} />

      {tab === 'overview' && (
        <div className="trk-overview">
          {metrics.map(({ type, icon: Icon }, index) => {
            const latest = byType[type][0]
            const meta = METRIC_META[type]
            return (
              <article key={type} className="ui-card trk-metric ui-rise" style={{ '--d': `${index * 50}ms` } as React.CSSProperties}>
                <header>
                  <span className="ui-row-icon"><Icon /></span>
                  <div><strong>{meta.label}</strong><small>{byType[type].length ? `${byType[type].length} reading${byType[type].length === 1 ? '' : 's'}` : 'No readings yet'}</small></div>
                </header>
                {readings === null ? <Skeleton height={44} width="55%" /> : (
                  <div className="trk-metric-value">
                    <strong className="ui-num">{latest ? formatReading(type, latest.value) : '—'}</strong><span>{meta.unit}</span>
                  </div>
                )}
                {latest ? (
                  <>
                    <StatusBadge status={latest.analysis.status} />
                    <p>{latest.analysis.suggestion}</p>
                    <small className="trk-when">Last recorded {new Date(latest.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}{type === 'glucose' && latest.value.context ? ` · ${String(latest.value.context).replace('-', ' ')}` : ''}</small>
                  </>
                ) : <p className="ui-faint">{metricInfo[type].hint}</p>}
                <div className="trk-metric-actions">
                  <button type="button" className="ui-btn ui-btn-secondary ui-btn-sm" onClick={() => setAdding(type)}><Plus /> Record</button>
                  {byType[type].length > 1 && <button type="button" className="ui-btn ui-btn-ghost ui-btn-sm" onClick={() => { setFocus(type); setTab('trends') }}><LineChart /> Trend</button>}
                </div>
              </article>
            )
          })}
          <div className="ui-alert trk-note"><ShieldCheck /><span><strong>How to read this.</strong> Ranges are general adult reference ranges for screening. A single reading cannot diagnose a condition — repeated readings and a clinician’s assessment can.</span></div>
        </div>
      )}

      {tab === 'trends' && (
        <section className="ui-card ui-card-pad">
          <div className="ui-card-head trk-trend-head">
            <div><span className="ui-card-label">Trend</span><h2>{METRIC_META[focus].label}</h2></div>
            <div className="trk-metric-switch" role="group" aria-label="Choose measurement">
              {metrics.map(({ type, icon: Icon }) => <button key={type} type="button" className="ui-chip" aria-pressed={focus === type} onClick={() => setFocus(type)}><Icon />{METRIC_META[type].short}</button>)}
            </div>
          </div>
          {readings === null ? <Skeleton height={220} /> : byType[focus].length ? (
            <>
              <TrendChart
                label={`${METRIC_META[focus].label} over time`}
                unit={METRIC_META[focus].unit}
                band={metricInfo[focus].band}
                format={value => (focus === 'bmi' ? value.toFixed(1) : String(Math.round(value)))}
                points={[...byType[focus]].reverse().map(reading => ({
                  date: reading.createdAt,
                  value: primary(reading),
                  secondary: focus === 'blood_pressure' ? Number(reading.value.diastolic) : undefined,
                  note: reading.analysis.status === 'danger' ? 'Needs attention' : reading.analysis.status === 'warning' ? 'Outside usual range' : 'Within usual range',
                }))}
              />
              <div className="ui-chart-legend">
                {focus === 'blood_pressure' ? <><span><i /> Systolic</span><span><i className="is-secondary" /> Diastolic</span></> : null}
                <span><i className="is-band" /> {focus === 'blood_pressure' ? 'Usual systolic range' : 'Usual adult range'}</span>
              </div>
              <TrendSummary readings={byType[focus]} type={focus} />
            </>
          ) : (
            <EmptyState icon={LineChart} title={`No ${METRIC_META[focus].label.toLowerCase()} readings yet`} action={<button type="button" className="ui-btn ui-btn-sm" onClick={() => setAdding(focus)}><Plus /> Record one</button>}>
              Add at least two readings on different days to see a trend.
            </EmptyState>
          )}
        </section>
      )}

      {tab === 'history' && (
        <section className="ui-card ui-card-pad">
          {readings === null ? <div className="grid gap-3"><Skeleton height={56} /><Skeleton height={56} /><Skeleton height={56} /></div> : readings.length ? (
            <div className="ui-list">
              {readings.map(reading => {
                const Icon = metricInfo[reading.type]?.icon || Activity
                const tone = reading.analysis.status === 'danger' ? 'is-danger' : reading.analysis.status === 'warning' ? 'is-warn' : ''
                return (
                  <div key={reading.id} className="ui-row">
                    <span className={cx('ui-row-icon', tone)}><Icon /></span>
                    <div className="ui-row-body">
                      <strong>{METRIC_META[reading.type]?.label || reading.type} · <span className="ui-num">{formatReading(reading.type, reading.value)}</span> {METRIC_META[reading.type]?.unit}</strong>
                      <small>{new Date(reading.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}{reading.analysis.message ? ` — ${reading.analysis.message}` : ''}</small>
                    </div>
                    <div className="ui-row-end">
                      <span className="trk-hide-sm"><StatusBadge status={reading.analysis.status} /></span>
                      <button type="button" className="ui-icon-btn is-danger" onClick={() => remove(reading.id)} disabled={deleting === reading.id} aria-label="Delete reading">{deleting === reading.id ? <Spinner /> : <Trash2 />}</button>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <EmptyState icon={History} title="No history yet" action={<button type="button" className="ui-btn ui-btn-sm" onClick={() => setAdding('blood_pressure')}><Plus /> Add your first reading</button>}>
              Every reading you record is listed here with its date and context.
            </EmptyState>
          )}
        </section>
      )}

      {adding && <ReadingModal type={adding} onType={setAdding} onClose={() => setAdding(null)} onSaved={reading => { setReadings(items => [reading, ...(items || [])]); setFocus(reading.type) }} />}
    </>
  )
}

function TrendSummary({ readings, type }: { readings: Reading[]; type: MetricType }) {
  const values = readings.map(primary).filter(Number.isFinite)
  if (values.length < 2) return null
  const average = values.reduce((sum, value) => sum + value, 0) / values.length
  const outside = readings.filter(reading => reading.analysis.status && reading.analysis.status !== 'normal').length
  const digits = type === 'bmi' ? 1 : 0
  return (
    <div className="trk-summary">
      <div><small>Average</small><strong className="ui-num">{average.toFixed(digits)}</strong></div>
      <div><small>Lowest</small><strong className="ui-num">{Math.min(...values).toFixed(digits)}</strong></div>
      <div><small>Highest</small><strong className="ui-num">{Math.max(...values).toFixed(digits)}</strong></div>
      <div><small>Outside range</small><strong className="ui-num">{outside} of {readings.length}</strong></div>
    </div>
  )
}

function ReadingModal({ type, onType, onClose, onSaved }: { type: MetricType; onType: (type: MetricType) => void; onClose: () => void; onSaved: (reading: Reading) => void }) {
  const [form, setForm] = useState<Record<string, string>>({ context: 'random' })
  const [saving, setSaving] = useState(false)
  const [result, setResult] = useState<Reading | null>(null)
  const set = (key: string) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm(current => ({ ...current, [key]: event.target.value }))
  const bmi = Number(form.weight) > 0 && Number(form.height) > 0 ? Number(form.weight) / Math.pow(Number(form.height) / 100, 2) : null

  useEffect(() => { setResult(null); setForm({ context: 'random' }) }, [type])

  async function submit(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    try {
      const reading = await api<Reading>('/api/health-data', { method: 'POST', json: { type, value: form } })
      setResult(reading)
      onSaved(reading)
    } catch (reason) {
      toast.error(errorMessage(reason))
    } finally {
      setSaving(false)
    }
  }

  const analysis = result?.analysis
  const Icon = analysis?.status === 'normal' ? CheckCircle2 : AlertTriangle
  const tone = analysis?.status === 'danger' ? 'is-danger' : analysis?.status === 'warning' ? 'is-warn' : 'is-ok'

  return (
    <Modal open onOpenChange={open => !open && onClose()} title={result ? 'Reading saved' : 'Add a reading'} description={result ? undefined : metricInfo[type].hint}>
      {result && analysis ? (
        <div className="trk-result">
          <div className="trk-result-value"><strong className="ui-num">{formatReading(type, result.value)}</strong><span>{METRIC_META[type].unit}</span></div>
          <div className={cx('ui-alert', tone)}><Icon /><span><strong>{analysis.message}</strong><br />{analysis.suggestion}</span></div>
          {analysis.medicalContext && <p className="trk-context">{analysis.medicalContext}</p>}
          <div className="ui-modal-foot">
            <button type="button" className="ui-btn ui-btn-secondary" onClick={() => setResult(null)}>Add another</button>
            <button type="button" className="ui-btn" onClick={onClose}>Done</button>
          </div>
        </div>
      ) : (
        <form onSubmit={submit} className="grid gap-4">
          <div className="trk-type-picker" role="group" aria-label="Measurement type">
            {metrics.map(({ type: option, icon: OptionIcon }) => <button key={option} type="button" className="ui-chip" aria-pressed={option === type} onClick={() => onType(option)}><OptionIcon />{METRIC_META[option].short}</button>)}
          </div>
          {type === 'blood_pressure' && (
            <div className="ui-form-grid">
              <label className="ui-field"><span>Systolic (top)</span><input className="ui-input" inputMode="numeric" type="number" min={50} max={260} required placeholder="120" value={form.systolic || ''} onChange={set('systolic')} autoFocus /></label>
              <label className="ui-field"><span>Diastolic (bottom)</span><input className="ui-input" inputMode="numeric" type="number" min={30} max={160} required placeholder="80" value={form.diastolic || ''} onChange={set('diastolic')} /></label>
            </div>
          )}
          {type === 'glucose' && (
            <div className="ui-form-grid">
              <label className="ui-field"><span>Glucose (mg/dL)</span><input className="ui-input" inputMode="numeric" type="number" min={20} max={700} required placeholder="95" value={form.glucose || ''} onChange={set('glucose')} autoFocus /></label>
              <label className="ui-field"><span>When was it taken?</span><select className="ui-select" value={form.context} onChange={set('context')}><option value="fasting">Fasting</option><option value="after-meal">After a meal</option><option value="random">Random / not sure</option></select></label>
            </div>
          )}
          {type === 'heart_rate' && (
            <label className="ui-field"><span>Resting pulse (beats per minute)</span><input className="ui-input" inputMode="numeric" type="number" min={20} max={260} required placeholder="72" value={form.heart_rate || ''} onChange={set('heart_rate')} autoFocus /></label>
          )}
          {type === 'bmi' && (
            <>
              <div className="ui-form-grid">
                <label className="ui-field"><span>Weight (kg)</span><input className="ui-input" inputMode="decimal" type="number" step="0.1" min={15} max={500} required placeholder="68" value={form.weight || ''} onChange={set('weight')} autoFocus /></label>
                <label className="ui-field"><span>Height (cm)</span><input className="ui-input" inputMode="decimal" type="number" step="0.1" min={60} max={260} required placeholder="170" value={form.height || ''} onChange={set('height')} /></label>
              </div>
              {bmi && Number.isFinite(bmi) && <div className="trk-bmi-preview">Calculated BMI <strong className="ui-num">{bmi.toFixed(1)}</strong></div>}
            </>
          )}
          <div className="ui-modal-foot">
            <button type="button" className="ui-btn ui-btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="ui-btn" disabled={saving}>{saving ? <><Spinner /> Saving…</> : 'Save reading'}</button>
          </div>
        </form>
      )}
    </Modal>
  )
}
