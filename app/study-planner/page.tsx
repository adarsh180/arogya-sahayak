'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import { CalendarDays, Check, CheckCircle2, Clock3, Plus, RotateCcw, SkipForward, Sparkles, Trash2 } from 'lucide-react'
import AppShell from '@/components/shell/AppShell'
import { EmptyState, Modal, PageHeader, Skeleton, Spinner, Tabs, cx } from '@/components/ui/kit'
import { api, errorMessage } from '@/lib/client-api'
import { MEDICAL_EXAMS, subjectsFor } from '@/lib/constants'

type Plan = { id: string; examType: string; subject: string; topic: string; scheduledDate: string; duration: number; status: 'pending' | 'completed' | 'skipped'; notes: string | null }
type View = 'upcoming' | 'past' | 'done'

const dayKey = (value: string | Date) => {
  const date = new Date(value)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}
const todayKey = () => dayKey(new Date())

export default function StudyPlannerPage() {
  return <AppShell loadingLabel="Opening your planner"><Planner /></AppShell>
}

function Planner() {
  const { data: session } = useSession()
  const [plans, setPlans] = useState<Plan[] | null>(null)
  const [view, setView] = useState<View>('upcoming')
  const [generating, setGenerating] = useState(false)
  const [adding, setAdding] = useState(false)
  const [busy, setBusy] = useState<string>()
  const defaultExam = session?.user.targetExam && session.user.targetExam in MEDICAL_EXAMS ? session.user.targetExam : 'neet-pg'

  useEffect(() => { api<Plan[]>('/api/study-plans').then(setPlans).catch(reason => { setPlans([]); toast.error(errorMessage(reason)) }) }, [])

  const groups = useMemo(() => {
    const today = todayKey()
    const list = (plans || []).filter(plan => view === 'done' ? plan.status !== 'pending' : view === 'past' ? plan.status === 'pending' && dayKey(plan.scheduledDate) < today : plan.status === 'pending' && dayKey(plan.scheduledDate) >= today)
    if (view !== 'upcoming') list.reverse()
    const map = new Map<string, Plan[]>()
    for (const plan of list) map.set(dayKey(plan.scheduledDate), [...(map.get(dayKey(plan.scheduledDate)) || []), plan])
    return [...map.entries()]
  }, [plans, view])

  const week = useMemo(() => Array.from({ length: 7 }, (_, index) => {
    const date = new Date()
    date.setDate(date.getDate() + index)
    const key = dayKey(date)
    const items = (plans || []).filter(plan => dayKey(plan.scheduledDate) === key)
    return { key, date, total: items.length, done: items.filter(plan => plan.status === 'completed').length, minutes: items.reduce((sum, plan) => sum + plan.duration, 0) }
  }), [plans])

  const counts = {
    upcoming: (plans || []).filter(plan => plan.status === 'pending' && dayKey(plan.scheduledDate) >= todayKey()).length,
    past: (plans || []).filter(plan => plan.status === 'pending' && dayKey(plan.scheduledDate) < todayKey()).length,
    done: (plans || []).filter(plan => plan.status !== 'pending').length,
  }

  async function setStatus(plan: Plan, status: Plan['status']) {
    setBusy(plan.id)
    try {
      const updated = await api<Plan>(`/api/study-plans/${plan.id}`, { method: 'PATCH', json: { status } })
      setPlans(items => (items || []).map(item => item.id === plan.id ? updated : item))
      if (status === 'completed') toast.success('Session complete — nice work.')
    } catch (reason) { toast.error(errorMessage(reason)) } finally { setBusy(undefined) }
  }

  async function remove(plan: Plan) {
    setBusy(plan.id)
    try {
      await api(`/api/study-plans/${plan.id}`, { method: 'DELETE' })
      setPlans(items => (items || []).filter(item => item.id !== plan.id))
    } catch (reason) { toast.error(errorMessage(reason)) } finally { setBusy(undefined) }
  }

  return (
    <>
      <PageHeader
        kicker="Study planner"
        title="A realistic plan, one day at a time."
        description="Generate a draft plan for your exam, then adjust it. Mark sessions done as you go — your progress page uses this time."
        actions={<>
          <button type="button" className="ui-btn ui-btn-secondary" onClick={() => setAdding(true)}><Plus /> Add session</button>
          <button type="button" className="ui-btn" onClick={() => setGenerating(true)}><Sparkles /> Generate plan</button>
        </>}
      />

      <section className="plan-week" aria-label="Next seven days">
        {week.map(day => (
          <div key={day.key} className={cx('plan-day', day.key === todayKey() && 'is-today', day.total > 0 && day.done === day.total && 'is-complete')}>
            <small>{day.key === todayKey() ? 'Today' : day.date.toLocaleDateString(undefined, { weekday: 'short' })}</small>
            <strong className="ui-num">{day.date.getDate()}</strong>
            <span>{day.total ? `${day.done}/${day.total} · ${day.minutes}m` : '—'}</span>
          </div>
        ))}
      </section>

      <Tabs<View> label="Plan views" value={view} onChange={setView} tabs={[
        { value: 'upcoming', label: 'Upcoming', icon: CalendarDays, count: counts.upcoming },
        { value: 'past', label: 'Missed', icon: Clock3, count: counts.past },
        { value: 'done', label: 'Done & skipped', icon: CheckCircle2, count: counts.done },
      ]} />

      {plans === null ? <div className="grid gap-3"><Skeleton height={70} /><Skeleton height={70} /><Skeleton height={70} /></div> : groups.length ? (
        <div className="plan-days">
          {groups.map(([key, items]) => {
            const date = new Date(`${key}T00:00:00`)
            return (
              <section key={key} className="plan-group">
                <h3><span>{key === todayKey() ? 'Today' : date.toLocaleDateString(undefined, { weekday: 'long' })}</span>{date.toLocaleDateString(undefined, { day: 'numeric', month: 'long' })}</h3>
                <div className="ui-card">
                  {items.map(plan => (
                    <div key={plan.id} className={cx('plan-item', plan.status !== 'pending' && `is-${plan.status}`)}>
                      <button type="button" className={cx('med-check', plan.status === 'completed' && 'is-checked')} disabled={busy === plan.id} onClick={() => setStatus(plan, plan.status === 'completed' ? 'pending' : 'completed')} aria-label={plan.status === 'completed' ? 'Mark as not done' : 'Mark as done'}><Check /></button>
                      <div className="plan-item-body">
                        <strong>{plan.topic}</strong>
                        <small>{plan.subject} · {plan.duration} min · {MEDICAL_EXAMS[plan.examType as keyof typeof MEDICAL_EXAMS] || plan.examType}</small>
                        {plan.notes && <p>{plan.notes}</p>}
                      </div>
                      <div className="ui-row-end">
                        {plan.status === 'skipped' && <span className="ui-badge">Skipped</span>}
                        {plan.status === 'pending'
                          ? <button type="button" className="ui-icon-btn" onClick={() => setStatus(plan, 'skipped')} disabled={busy === plan.id} aria-label="Skip session" title="Skip"><SkipForward /></button>
                          : plan.status === 'skipped' && <button type="button" className="ui-icon-btn" onClick={() => setStatus(plan, 'pending')} disabled={busy === plan.id} aria-label="Restore session" title="Restore"><RotateCcw /></button>}
                        <button type="button" className="ui-icon-btn is-danger" onClick={() => remove(plan)} disabled={busy === plan.id} aria-label="Delete session">{busy === plan.id ? <Spinner /> : <Trash2 />}</button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      ) : (
        <section className="ui-card">
          <EmptyState icon={CalendarDays} title={view === 'upcoming' ? 'No sessions planned' : view === 'past' ? 'Nothing missed' : 'Nothing completed yet'} action={view === 'upcoming' ? <button type="button" className="ui-btn ui-btn-sm" onClick={() => setGenerating(true)}><Sparkles /> Generate a plan</button> : undefined}>
            {view === 'upcoming' ? 'Generate a draft for your exam or add sessions yourself.' : view === 'past' ? 'Sessions you didn’t mark done will show here so you can reschedule them.' : 'Sessions you finish or skip are listed here.'}
          </EmptyState>
        </section>
      )}

      {generating && <GenerateModal defaultExam={defaultExam} onClose={() => setGenerating(false)} onDone={created => { setPlans(items => [...(items || []), ...created].sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate))); setView('upcoming') }} />}
      {adding && <AddModal defaultExam={defaultExam} onClose={() => setAdding(false)} onDone={plan => setPlans(items => [...(items || []), plan].sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate)))} />}
    </>
  )
}

function GenerateModal({ defaultExam, onClose, onDone }: { defaultExam: string; onClose: () => void; onDone: (plans: Plan[]) => void }) {
  const [form, setForm] = useState({ examType: defaultExam, duration: '7', minutesPerDay: '120', focus: '' })
  const [saving, setSaving] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    try {
      const created = await api<Plan[]>('/api/study-plans/generate', { method: 'POST', json: { ...form, focus: form.focus || undefined } })
      toast.success(`${created.length} sessions added to your plan`)
      onDone(created)
      onClose()
    } catch (reason) {
      toast.error(errorMessage(reason))
      setSaving(false)
    }
  }

  return (
    <Modal open onOpenChange={open => !open && !saving && onClose()} title="Generate a study plan" description="Arogya drafts sessions from tomorrow onward. You can edit, skip or delete any of them.">
      <form onSubmit={submit} className="grid gap-4">
        <div className="ui-form-grid">
          <label className="ui-field is-wide"><span>Exam</span><select className="ui-select" value={form.examType} onChange={event => setForm({ ...form, examType: event.target.value })}>{Object.entries(MEDICAL_EXAMS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
          <label className="ui-field"><span>Number of days</span><select className="ui-select" value={form.duration} onChange={event => setForm({ ...form, duration: event.target.value })}>{[3, 5, 7, 10, 14, 21].map(days => <option key={days} value={days}>{days} days</option>)}</select></label>
          <label className="ui-field"><span>Study time per day</span><select className="ui-select" value={form.minutesPerDay} onChange={event => setForm({ ...form, minutesPerDay: event.target.value })}>{[60, 90, 120, 180, 240, 360].map(minutes => <option key={minutes} value={minutes}>{minutes >= 60 ? `${minutes / 60} h` : `${minutes} min`}</option>)}</select></label>
          <label className="ui-field is-wide"><span>Focus areas <small>(optional)</small></span><input className="ui-input" maxLength={200} placeholder="e.g. weak in renal physiology and antibiotics" value={form.focus} onChange={event => setForm({ ...form, focus: event.target.value })} /></label>
        </div>
        {saving && <div className="ui-alert"><Spinner /><span>Drafting your plan — this can take up to half a minute.</span></div>}
        <div className="ui-modal-foot">
          <button type="button" className="ui-btn ui-btn-secondary" onClick={onClose} disabled={saving}>Cancel</button>
          <button type="submit" className="ui-btn" disabled={saving}>{saving ? <><Spinner /> Generating…</> : <><Sparkles /> Generate</>}</button>
        </div>
      </form>
    </Modal>
  )
}

function AddModal({ defaultExam, onClose, onDone }: { defaultExam: string; onClose: () => void; onDone: (plan: Plan) => void }) {
  const [form, setForm] = useState({ examType: defaultExam, subject: '', topic: '', scheduledDate: todayKey(), duration: '60', notes: '' })
  const [saving, setSaving] = useState(false)
  const subjects = subjectsFor(form.examType)

  async function submit(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    try {
      const plan = await api<Plan>('/api/study-plans', { method: 'POST', json: { ...form, scheduledDate: `${form.scheduledDate}T09:00:00`, notes: form.notes || null } })
      toast.success('Session added')
      onDone(plan)
      onClose()
    } catch (reason) {
      toast.error(errorMessage(reason))
      setSaving(false)
    }
  }

  return (
    <Modal open onOpenChange={open => !open && onClose()} title="Add a study session">
      <form onSubmit={submit} className="grid gap-4">
        <div className="ui-form-grid">
          <label className="ui-field"><span>Exam</span><select className="ui-select" value={form.examType} onChange={event => setForm({ ...form, examType: event.target.value, subject: '' })}>{Object.entries(MEDICAL_EXAMS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
          <label className="ui-field"><span>Subject</span><input className="ui-input" list="plan-subjects" required minLength={2} maxLength={100} value={form.subject} onChange={event => setForm({ ...form, subject: event.target.value })} /><datalist id="plan-subjects">{subjects.map(subject => <option key={subject} value={subject} />)}</datalist></label>
          <label className="ui-field is-wide"><span>Topic</span><input className="ui-input" required minLength={2} maxLength={200} placeholder="e.g. Cardiac cycle and heart sounds" value={form.topic} onChange={event => setForm({ ...form, topic: event.target.value })} /></label>
          <label className="ui-field"><span>Date</span><input className="ui-input" type="date" required value={form.scheduledDate} onChange={event => setForm({ ...form, scheduledDate: event.target.value })} /></label>
          <label className="ui-field"><span>Duration (minutes)</span><input className="ui-input" type="number" min={10} max={600} step={5} required value={form.duration} onChange={event => setForm({ ...form, duration: event.target.value })} /></label>
          <label className="ui-field is-wide"><span>Notes <small>(optional)</small></span><input className="ui-input" maxLength={1000} value={form.notes} onChange={event => setForm({ ...form, notes: event.target.value })} /></label>
        </div>
        <div className="ui-modal-foot">
          <button type="button" className="ui-btn ui-btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="ui-btn" disabled={saving}>{saving ? <><Spinner /> Adding…</> : 'Add session'}</button>
        </div>
      </form>
    </Modal>
  )
}
