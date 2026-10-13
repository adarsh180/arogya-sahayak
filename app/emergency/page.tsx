'use client'

import { FormEvent, useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import {
  Ambulance, Baby, Brain, ExternalLink, HeartHandshake, MapPin, Phone, Plus, ShieldAlert, Siren, Stethoscope, Trash2, UserRound
} from 'lucide-react'
import AdaptiveShell from '@/components/shell/AdaptiveShell'
import { EmptyState, Modal, PageHeader, Skeleton, Spinner } from '@/components/ui/kit'
import { api, errorMessage } from '@/lib/client-api'

type Contact = { id: string; name: string; type: string; phone: string; address?: string | null; specialty?: string | null }

const helplines = [
  { number: '108', title: 'Ambulance', note: 'Emergency ambulance in most states', icon: Ambulance },
  { number: '102', title: 'Mother & child transport', note: 'Pregnancy and infant ambulance (state-run)', icon: Baby },
  { number: '14416', title: 'Tele-MANAS', note: 'Free 24×7 mental-health support', icon: Brain },
  { number: '1098', title: 'Childline', note: 'Children in distress or danger', icon: HeartHandshake },
  { number: '181', title: 'Women helpline', note: 'Support for women facing violence', icon: ShieldAlert },
]

const typeLabel: Record<string, string> = { family: 'Family or friend', doctor: 'Doctor', hospital: 'Hospital', other: 'Other' }
const blank = { name: '', type: 'family', phone: '', address: '', specialty: '' }

export default function EmergencyPage() {
  return <AdaptiveShell><Emergency /></AdaptiveShell>
}

function Emergency() {
  const { status } = useSession()
  const signedIn = status === 'authenticated'
  const [contacts, setContacts] = useState<Contact[] | null>(null)
  const [adding, setAdding] = useState(false)
  const [saving, setSaving] = useState(false)
  const [removing, setRemoving] = useState<string>()
  const [form, setForm] = useState(blank)

  const load = useCallback(() => api<Contact[]>('/api/emergency-contacts').then(setContacts).catch(() => setContacts([])), [])
  useEffect(() => { if (signedIn) load() }, [load, signedIn])

  async function save(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    try {
      const contact = await api<Contact>('/api/emergency-contacts', { method: 'POST', json: { ...form, address: form.address || null, specialty: form.specialty || null } })
      setContacts(items => [contact, ...(items || [])])
      setAdding(false)
      setForm(blank)
      toast.success(`${contact.name} saved`)
    } catch (reason) {
      toast.error(errorMessage(reason))
    } finally {
      setSaving(false)
    }
  }

  async function remove(contact: Contact) {
    if (!window.confirm(`Remove ${contact.name} from your emergency contacts?`)) return
    setRemoving(contact.id)
    try {
      await api(`/api/emergency-contacts/${contact.id}`, { method: 'DELETE' })
      setContacts(items => (items || []).filter(item => item.id !== contact.id))
    } catch (reason) {
      toast.error(errorMessage(reason))
    } finally {
      setRemoving(undefined)
    }
  }

  return (
    <div className="emg">
      <PageHeader kicker="Emergency" title="Help, without guesswork." description="If someone may be in danger, call first. Arogya never invents hospitals, distances or clinicians — use the national services below or contacts you have verified." />

      <section className="emg-hero ui-rise">
        <div className="emg-hero-pulse" aria-hidden="true"><Siren /></div>
        <div className="emg-hero-copy">
          <span>National emergency response · India</span>
          <strong className="ui-num">112</strong>
          <p>Police, fire and medical emergencies. Stay on the line and follow the dispatcher’s instructions.</p>
        </div>
        <a href="tel:112" className="ui-btn ui-btn-lg emg-call"><Phone /> Call 112 now</a>
      </section>

      <section className="emg-lines" aria-label="Other national helplines">
        {helplines.map(({ number, title, note, icon: Icon }) => (
          <a key={number} href={`tel:${number}`} className="ui-card emg-line is-interactive">
            <span className="ui-row-icon is-danger"><Icon /></span>
            <span className="emg-line-text"><strong>{title}</strong><small>{note}</small></span>
            <span className="emg-line-number ui-num">{number}</span>
          </a>
        ))}
      </section>
      <p className="emg-footnote">Service availability can vary by state. If a number doesn’t connect, call 112.</p>

      <div className="emg-grid">
        <section className="ui-card ui-card-pad">
          <div className="ui-card-head">
            <div><span className="ui-card-label">Verified by you</span><h2>Your emergency contacts</h2></div>
            {signedIn && <button type="button" className="ui-btn ui-btn-secondary ui-btn-sm" onClick={() => setAdding(true)}><Plus /> Add contact</button>}
          </div>
          {!signedIn ? (
            <EmptyState icon={UserRound} title="Keep trusted numbers one tap away" action={<Link href="/auth/signin?callbackUrl=/emergency" className="ui-btn ui-btn-sm">Sign in to add contacts</Link>}>
              Save family, your doctor and your nearest hospital so they are ready when you need them.
            </EmptyState>
          ) : contacts === null ? <div className="grid gap-3"><Skeleton height={56} /><Skeleton height={56} /></div> : contacts.length ? (
            <div className="ui-list">
              {contacts.map(contact => (
                <div key={contact.id} className="ui-row">
                  <span className="ui-row-icon">{contact.type === 'doctor' ? <Stethoscope /> : contact.type === 'hospital' ? <Ambulance /> : <UserRound />}</span>
                  <div className="ui-row-body"><strong>{contact.name}</strong><small>{contact.specialty || typeLabel[contact.type] || contact.type}{contact.address ? ` · ${contact.address}` : ''}</small></div>
                  <div className="ui-row-end">
                    <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="ui-btn ui-btn-sm"><Phone /> <span className="ui-num">{contact.phone}</span></a>
                    <button type="button" className="ui-icon-btn is-danger" onClick={() => remove(contact)} disabled={removing === contact.id} aria-label={`Remove ${contact.name}`}>{removing === contact.id ? <Spinner /> : <Trash2 />}</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon={UserRound} title="No contacts saved yet" action={<button type="button" className="ui-btn ui-btn-sm" onClick={() => setAdding(true)}><Plus /> Add your first contact</button>}>
              Add only numbers you have checked yourself.
            </EmptyState>
          )}
        </section>

        <aside className="ui-card is-deep emg-map">
          <MapPin />
          <span className="ui-card-label">Find care yourself</span>
          <h2>Search hospitals near you on a map.</h2>
          <p>Results, distance and opening hours come from your map provider, not from Arogya. Call ahead when you can.</p>
          <a href="https://www.google.com/maps/search/emergency+hospital+near+me" target="_blank" rel="noopener noreferrer" className="ui-btn ui-btn-light">Open map search <ExternalLink /></a>
        </aside>
      </div>

      <section className="ui-card ui-card-pad emg-signs">
        <div className="ui-card-head"><div><span className="ui-card-label">Don’t wait</span><h2>Call 112 immediately for</h2></div></div>
        <ul>
          <li>Chest pain or pressure, especially with sweating or breathlessness</li>
          <li>Difficulty breathing, blue lips or choking</li>
          <li>Face drooping, arm weakness or slurred speech</li>
          <li>Severe bleeding that won’t stop</li>
          <li>Unconsciousness, a seizure, or sudden confusion</li>
          <li>Thoughts of self-harm or suicide — or call Tele-MANAS on 14416</li>
        </ul>
      </section>

      <Modal open={adding} onOpenChange={setAdding} title="Add an emergency contact" description="Save only numbers you have verified yourself.">
        <form onSubmit={save} className="grid gap-4">
          <div className="ui-form-grid">
            <label className="ui-field is-wide"><span>Name</span><input className="ui-input" value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} required minLength={2} maxLength={100} autoFocus /></label>
            <label className="ui-field"><span>Who is this?</span><select className="ui-select" value={form.type} onChange={event => setForm({ ...form, type: event.target.value })}>{Object.entries(typeLabel).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
            <label className="ui-field"><span>Phone</span><input className="ui-input" type="tel" inputMode="tel" placeholder="+91 98765 43210" value={form.phone} onChange={event => setForm({ ...form, phone: event.target.value })} required minLength={8} maxLength={18} /></label>
            <label className="ui-field"><span>Relationship or specialty <small>(optional)</small></span><input className="ui-input" maxLength={100} value={form.specialty} onChange={event => setForm({ ...form, specialty: event.target.value })} /></label>
            <label className="ui-field"><span>Address <small>(optional)</small></span><input className="ui-input" maxLength={240} value={form.address} onChange={event => setForm({ ...form, address: event.target.value })} /></label>
          </div>
          <div className="ui-modal-foot">
            <button type="button" className="ui-btn ui-btn-secondary" onClick={() => setAdding(false)}>Cancel</button>
            <button type="submit" className="ui-btn" disabled={saving}>{saving ? <><Spinner /> Saving…</> : 'Save contact'}</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
