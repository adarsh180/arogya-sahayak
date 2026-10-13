'use client'

import { FormEvent, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'
import {
  Bell, BellOff, Check, ChevronDown, Clock, Info, Pause, Pill, Play, Plus, ShieldCheck, Trash2, X
} from 'lucide-react'
import AppShell from '@/components/shell/AppShell'
import { EmptyState, Modal, PageHeader, Skeleton, Spinner, Tabs, cx } from '@/components/ui/kit'
import { api, errorMessage } from '@/lib/client-api'

type Analysis = { category?: string; purpose?: string; sideEffects?: string[]; precautions?: string[]; interactions?: string[]; bestTime?: string; withFood?: string; warnings?: string[] }
type Medicine = { id: string; name: string; dosage: string; frequency: string; startDate: string; endDate: string | null; reminders: string[]; notes: string | null; isActive: boolean; aiAnalysis: Analysis | null }
type Tab = 'today' | 'all'

const frequencies: Array<{ label: string; times: string[] }> = [
  { label: 'Once daily', times: ['08:00'] },
  { label: 'Twice daily', times: ['08:00', '20:00'] },
  { label: 'Three times daily', times: ['08:00', '14:00', '20:00'] },
  { label: 'Four times daily', times: ['07:00', '12:00', '17:00', '22:00'] },
  { label: 'At bedtime', times: ['22:00'] },
  { label: 'As needed', times: [] },
  { label: 'Weekly', times: ['09:00'] },
]

const today = () => new Date().toISOString().slice(0, 10)
const nowHM = () => new Date().toTimeString().slice(0, 5)
const takenKey = () => `arogya:taken:${today()}`

function readTaken(): string[] {
  try { return JSON.parse(localStorage.getItem(takenKey()) || '[]') } catch { return [] }
}

function isCurrent(medicine: Medicine) {
  if (!medicine.isActive) return false
  const date = today()
  if (medicine.startDate.slice(0, 10) > date) return false
  return !medicine.endDate || medicine.endDate.slice(0, 10) >= date
}

export default function MedicinesPage() {
  return <AppShell loadingLabel="Opening your medicines"><Suspense fallback={null}><Medicines /></Suspense></AppShell>
}

function Medicines() {
  const params = useSearchParams()
  const [medicines, setMedicines] = useState<Medicine[] | null>(null)
  const [tab, setTab] = useState<Tab>('today')
  const [adding, setAdding] = useState(Boolean(params.get('add')))
  const [taken, setTaken] = useState<string[]>([])
  const [busy, setBusy] = useState<string>()
  const [clock, setClock] = useState(nowHM())
  const [alerts, setAlerts] = useState<'unsupported' | NotificationPermission>('default')
  const latest = useRef<Medicine[]>([])
  const notified = useRef(new Set<string>())

  const load = useCallback(() => api<Medicine[]>('/api/medicines').then(items => { setMedicines(items); latest.current = items }).catch(reason => { setMedicines([]); toast.error(errorMessage(reason)) }), [])

  useEffect(() => {
    load()
    setTaken(readTaken())
    setAlerts('Notification' in window ? Notification.permission : 'unsupported')
  }, [load])

  // Check reminders against the latest list (a ref, so the interval never reads a stale closure).
  useEffect(() => {
    const tick = () => {
      const time = nowHM()
      setClock(time)
      for (const medicine of latest.current.filter(isCurrent)) {
        if (!medicine.reminders.includes(time)) continue
        const key = `${today()}-${medicine.id}-${time}`
        if (notified.current.has(key) || readTaken().includes(`${medicine.id}@${time}`)) continue
        notified.current.add(key)
        toast(`Time for ${medicine.name} · ${medicine.dosage}`, { icon: '💊', duration: 10_000 })
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(`Time for ${medicine.name}`, { body: `${medicine.dosage} — scheduled ${time}`, icon: '/arogya-mark.png', tag: key })
        }
      }
    }
    tick()
    const interval = window.setInterval(tick, 20_000)
    return () => window.clearInterval(interval)
  }, [])

  const doses = useMemo(() => (medicines || []).filter(isCurrent)
    .flatMap(medicine => medicine.reminders.map(time => ({ medicine, time, key: `${medicine.id}@${time}` })))
    .sort((a, b) => a.time.localeCompare(b.time)), [medicines])
  const doneCount = doses.filter(dose => taken.includes(dose.key)).length

  function toggleTaken(key: string) {
    setTaken(current => {
      const next = current.includes(key) ? current.filter(item => item !== key) : [...current, key]
      try { localStorage.setItem(takenKey(), JSON.stringify(next)) } catch {}
      return next
    })
  }

  async function enableAlerts() {
    if (!('Notification' in window)) return
    const permission = await Notification.requestPermission()
    setAlerts(permission)
    if (permission === 'granted') toast.success('Reminders will notify you while Arogya is open.')
    else toast('Notifications are blocked. You can allow them in your browser settings.')
  }

  async function setActive(medicine: Medicine, isActive: boolean) {
    setBusy(medicine.id)
    try {
      const updated = await api<Medicine>('/api/medicines', { method: 'PUT', json: { id: medicine.id, isActive } })
      setMedicines(items => { const next = (items || []).map(item => item.id === medicine.id ? updated : item); latest.current = next; return next })
      toast.success(isActive ? `${medicine.name} resumed` : `${medicine.name} paused`)
    } catch (reason) { toast.error(errorMessage(reason)) } finally { setBusy(undefined) }
  }

  async function remove(medicine: Medicine) {
    if (!window.confirm(`Remove ${medicine.name} and its reminders?`)) return
    setBusy(medicine.id)
    try {
      await api(`/api/medicines?id=${encodeURIComponent(medicine.id)}`, { method: 'DELETE' })
      setMedicines(items => { const next = (items || []).filter(item => item.id !== medicine.id); latest.current = next; return next })
      toast.success(`${medicine.name} removed`)
    } catch (reason) { toast.error(errorMessage(reason)) } finally { setBusy(undefined) }
  }

  return (
    <>
      <PageHeader
        kicker="Medicines"
        title="Your schedule, kept simple."
        description="Add what you take and when. Arogya reminds you while the app is open and keeps a simple daily check-off."
        actions={<>
          {alerts === 'default' && <button type="button" className="ui-btn ui-btn-secondary" onClick={enableAlerts}><Bell /> Enable alerts</button>}
          {alerts === 'denied' && <span className="ui-badge is-warn"><BellOff /> Alerts blocked</span>}
          {alerts === 'granted' && <span className="ui-badge is-ok">Alerts on</span>}
          <button type="button" className="ui-btn" onClick={() => setAdding(true)}><Plus /> Add medicine</button>
        </>}
      />

      <Tabs<Tab> label="Medicine views" value={tab} onChange={setTab} tabs={[
        { value: 'today', label: 'Today', icon: Clock, count: doses.length },
        { value: 'all', label: 'All medicines', icon: Pill, count: medicines?.length },
      ]} />

      {medicines === null ? <div className="grid gap-3"><Skeleton height={80} /><Skeleton height={80} /></div> : tab === 'today' ? (
        doses.length ? (
          <div className="med-today">
            <section className="ui-card ui-card-pad">
              <div className="ui-card-head">
                <div><span className="ui-card-label">{new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}</span><h2>{doneCount} of {doses.length} doses checked off</h2></div>
              </div>
              <div className="ui-progress" aria-hidden="true"><i style={{ width: `${(doneCount / doses.length) * 100}%` }} /></div>
              <ol className="med-dose-list">
                {doses.map(({ medicine, time, key }) => {
                  const done = taken.includes(key)
                  const due = !done && time <= clock
                  return (
                    <li key={key} className={cx(done && 'is-done', due && 'is-due')}>
                      <time className="ui-num">{time}</time>
                      <div><strong>{medicine.name}</strong><small>{medicine.dosage}{medicine.aiAnalysis?.withFood ? ` · ${medicine.aiAnalysis.withFood}` : ''}</small></div>
                      {due && <span className="ui-badge is-saffron">Due</span>}
                      <button type="button" className={cx('med-check', done && 'is-checked')} onClick={() => toggleTaken(key)} aria-pressed={done} aria-label={done ? `Mark ${medicine.name} at ${time} as not taken` : `Mark ${medicine.name} at ${time} as taken`}><Check /></button>
                    </li>
                  )
                })}
              </ol>
            </section>
            <p className="med-footnote"><Info /> Check-offs are saved on this device only. Reminders work while Arogya is open in a browser tab.</p>
          </div>
        ) : (
          <section className="ui-card"><EmptyState icon={Clock} title="Nothing scheduled for today" action={<button type="button" className="ui-btn ui-btn-sm" onClick={() => setAdding(true)}><Plus /> Add a medicine</button>}>
            Medicines with reminder times that are active today will appear here.
          </EmptyState></section>
        )
      ) : medicines.length ? (
        <div className="med-grid">
          {medicines.map(medicine => <MedicineCard key={medicine.id} medicine={medicine} busy={busy === medicine.id} onActive={value => setActive(medicine, value)} onRemove={() => remove(medicine)} />)}
        </div>
      ) : (
        <section className="ui-card"><EmptyState icon={Pill} title="No medicines yet" action={<button type="button" className="ui-btn ui-btn-sm" onClick={() => setAdding(true)}><Plus /> Add your first medicine</button>}>
          Keep prescriptions, supplements and their timings in one organised list.
        </EmptyState></section>
      )}

      <div className="ui-alert med-boundary"><ShieldCheck /><span><strong>Reference only.</strong> Medicine notes are general information. Never start, stop or change a dose without your doctor or pharmacist.</span></div>

      {adding && <AddMedicine onClose={() => setAdding(false)} onSaved={medicine => { setMedicines(items => { const next = [medicine, ...(items || [])]; latest.current = next; return next }); setTab('today') }} />}
    </>
  )
}

function MedicineCard({ medicine, busy, onActive, onRemove }: { medicine: Medicine; busy: boolean; onActive: (value: boolean) => void; onRemove: () => void }) {
  const [open, setOpen] = useState(false)
  const info = medicine.aiAnalysis
  return (
    <article className={cx('ui-card med-card', !medicine.isActive && 'is-paused')}>
      <header>
        <span className="ui-row-icon is-saffron"><Pill /></span>
        <div className="med-card-title"><strong>{medicine.name}</strong><small>{medicine.dosage} · {medicine.frequency}</small></div>
        {!medicine.isActive && <span className="ui-badge">Paused</span>}
      </header>
      <div className="med-times">
        {medicine.reminders.length ? medicine.reminders.map(time => <span key={time} className="ui-badge is-bare ui-num"><Clock />{time}</span>) : <span className="ui-faint">No reminder times</span>}
      </div>
      <p className="med-dates">From {new Date(medicine.startDate).toLocaleDateString()}{medicine.endDate ? ` to ${new Date(medicine.endDate).toLocaleDateString()}` : ' · ongoing'}</p>
      {medicine.notes && <p className="med-notes">{medicine.notes}</p>}
      {info && (
        <div className="med-info">
          <button type="button" onClick={() => setOpen(value => !value)} aria-expanded={open}><Info /> About this medicine{info.category ? ` · ${info.category}` : ''}<ChevronDown className={open ? 'is-open' : ''} /></button>
          {open && (
            <dl>
              {info.purpose && <><dt>Commonly used for</dt><dd>{info.purpose}</dd></>}
              {info.withFood && <><dt>With food</dt><dd>{info.withFood}</dd></>}
              {info.sideEffects?.length ? <><dt>Common side effects</dt><dd>{info.sideEffects.join(' · ')}</dd></> : null}
              {info.precautions?.length ? <><dt>Precautions</dt><dd>{info.precautions.join(' · ')}</dd></> : null}
              {info.warnings?.length ? <><dt>Contact a doctor if</dt><dd>{info.warnings.join(' · ')}</dd></> : null}
              <dd className="med-info-note">AI-generated reference. Confirm with your pharmacist or prescriber.</dd>
            </dl>
          )}
        </div>
      )}
      <footer>
        <button type="button" className="ui-btn ui-btn-secondary ui-btn-sm" disabled={busy} onClick={() => onActive(!medicine.isActive)}>{medicine.isActive ? <><Pause /> Pause</> : <><Play /> Resume</>}</button>
        <button type="button" className="ui-btn ui-btn-ghost ui-btn-sm" disabled={busy} onClick={onRemove}><Trash2 /> Remove</button>
        {busy && <Spinner />}
      </footer>
    </article>
  )
}

function AddMedicine({ onClose, onSaved }: { onClose: () => void; onSaved: (medicine: Medicine) => void }) {
  const [form, setForm] = useState({ name: '', dosage: '', frequency: 'Once daily', startDate: today(), endDate: '', notes: '' })
  const [times, setTimes] = useState<string[]>(['08:00'])
  const [saving, setSaving] = useState(false)

  function chooseFrequency(label: string) {
    setForm(current => ({ ...current, frequency: label }))
    setTimes(frequencies.find(item => item.label === label)?.times || [])
  }

  async function submit(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    try {
      const medicine = await api<Medicine>('/api/medicines', { method: 'POST', json: { ...form, endDate: form.endDate || null, notes: form.notes || null, reminders: times.filter(Boolean) } })
      toast.success(`${medicine.name} added`)
      onSaved(medicine)
      onClose()
    } catch (reason) {
      toast.error(errorMessage(reason))
      setSaving(false)
    }
  }

  return (
    <Modal open onOpenChange={open => !open && onClose()} title="Add a medicine" description="Enter it exactly as prescribed. Reminder times are in 24-hour format.">
      <form onSubmit={submit} className="grid gap-4">
        <div className="ui-form-grid">
          <label className="ui-field is-wide"><span>Medicine name</span><input className="ui-input" required minLength={2} maxLength={120} placeholder="e.g. Metformin 500" value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} autoFocus /></label>
          <label className="ui-field"><span>Dose</span><input className="ui-input" required maxLength={100} placeholder="1 tablet" value={form.dosage} onChange={event => setForm({ ...form, dosage: event.target.value })} /></label>
          <label className="ui-field"><span>How often</span><select className="ui-select" value={form.frequency} onChange={event => chooseFrequency(event.target.value)}>{frequencies.map(item => <option key={item.label}>{item.label}</option>)}</select></label>
        </div>
        <div className="ui-field">
          <span>Reminder times</span>
          <div className="med-time-editor">
            {times.map((time, index) => (
              <div key={index} className="med-time-input">
                <input className="ui-input" type="time" value={time} required onChange={event => setTimes(items => items.map((item, position) => position === index ? event.target.value : item))} aria-label={`Reminder ${index + 1}`} />
                <button type="button" className="ui-icon-btn" onClick={() => setTimes(items => items.filter((_, position) => position !== index))} aria-label={`Remove reminder ${index + 1}`}><X /></button>
              </div>
            ))}
            {times.length < 8 && <button type="button" className="ui-chip" onClick={() => setTimes(items => [...items, '12:00'])}><Plus /> Add time</button>}
          </div>
        </div>
        <div className="ui-form-grid">
          <label className="ui-field"><span>Start date</span><input className="ui-input" type="date" required value={form.startDate} onChange={event => setForm({ ...form, startDate: event.target.value })} /></label>
          <label className="ui-field"><span>End date <small>(optional)</small></span><input className="ui-input" type="date" min={form.startDate} value={form.endDate} onChange={event => setForm({ ...form, endDate: event.target.value })} /></label>
          <label className="ui-field is-wide"><span>Notes <small>(optional)</small></span><input className="ui-input" maxLength={1000} placeholder="After breakfast, avoid with milk…" value={form.notes} onChange={event => setForm({ ...form, notes: event.target.value })} /></label>
        </div>
        <div className="ui-modal-foot">
          <button type="button" className="ui-btn ui-btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="ui-btn" disabled={saving}>{saving ? <><Spinner /> Adding…</> : 'Add medicine'}</button>
        </div>
      </form>
    </Modal>
  )
}
