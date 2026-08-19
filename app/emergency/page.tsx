'use client'

import { FormEvent, useEffect, useState } from 'react'
import { ExternalLink, MapPin, Phone, Plus, ShieldAlert, Trash2, UserRound, X } from 'lucide-react'
import toast from 'react-hot-toast'
import Navbar from '@/components/Navbar'

type Contact = { id: string; name: string; type: string; phone: string; address?: string | null; specialty?: string | null }

export default function EmergencyPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [adding, setAdding] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', type: 'family', phone: '', address: '', specialty: '' })

  useEffect(() => { loadContacts() }, [])
  async function loadContacts() {
    const response = await fetch('/api/emergency-contacts')
    if (response.ok) setContacts(await response.json())
  }
  async function save(event: FormEvent) {
    event.preventDefault(); setSaving(true)
    const response = await fetch('/api/emergency-contacts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const data = await response.json(); setSaving(false)
    if (!response.ok) return toast.error(data.error || 'Unable to save this contact.')
    setContacts(items => [data, ...items]); setAdding(false); setForm({ name: '', type: 'family', phone: '', address: '', specialty: '' })
  }
  async function remove(id: string) {
    const response = await fetch(`/api/emergency-contacts/${id}`, { method: 'DELETE' })
    if (response.ok) setContacts(items => items.filter(item => item.id !== id))
    else toast.error('Unable to remove this contact.')
  }

  return <div className="as-emergency-page"><Navbar /><main id="main-content" className="as-emergency as-container">
    <header><span className="as-kicker">Immediate access</span><h1>Help, without guesswork.</h1><p>This page never fabricates a nearby hospital, distance or clinician. Use the national service or contacts you have verified yourself.</p></header>
    <section className="as-emergency-call"><ShieldAlert /><div><span>National emergency response</span><strong>112</strong><p>For a serious or life-threatening situation in India, call now. Follow the dispatcher’s instructions.</p></div><a href="tel:112"><Phone /> Call 112</a></section>
    <div className="as-emergency-grid"><section className="as-contact-panel"><div className="as-card-heading"><div><span>Your verified contacts</span><h2>People you trust</h2></div><button onClick={() => setAdding(true)}><Plus /> Add contact</button></div>{contacts.length ? <div className="as-contact-list">{contacts.map(contact => <article key={contact.id}><div><UserRound /></div><span><strong>{contact.name}</strong><small>{contact.specialty || contact.type}{contact.address ? ` · ${contact.address}` : ''}</small></span><a href={`tel:${contact.phone}`} aria-label={`Call ${contact.name}`}><Phone /></a><button onClick={() => remove(contact.id)} aria-label={`Remove ${contact.name}`}><Trash2 /></button></article>)}</div> : <div className="as-empty-state"><UserRound /><strong>No personal contacts saved</strong><p>Add only numbers you have verified. Arogya will not invent contact details.</p></div>}</section><aside className="as-find-care"><MapPin /><span>Find care yourself</span><h2>Open a map search you can verify.</h2><p>Results, opening hours and distance come from your map provider—not from Arogya Sahayak.</p><a href="https://www.google.com/maps/search/emergency+hospital+near+me" target="_blank" rel="noreferrer">Search nearby emergency hospitals <ExternalLink /></a></aside></div>
    {adding && <div className="as-modal-backdrop"><form className="as-contact-form" onSubmit={save}><button type="button" className="as-modal-close" onClick={() => setAdding(false)} aria-label="Close form"><X /></button><span className="as-kicker">Verified by you</span><h2>Add an emergency contact</h2><label><span>Name</span><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required maxLength={100} /></label><label><span>Contact type</span><select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}><option value="family">Family or friend</option><option value="doctor">Doctor</option><option value="hospital">Hospital</option><option value="other">Other</option></select></label><label><span>Phone</span><input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required /></label><label><span>Specialty or relationship (optional)</span><input value={form.specialty} onChange={e => setForm({ ...form, specialty: e.target.value })} /></label><label><span>Address (optional)</span><input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} /></label><button className="as-button" disabled={saving}>{saving ? 'Saving…' : 'Save verified contact'}</button></form></div>}
  </main></div>
}
