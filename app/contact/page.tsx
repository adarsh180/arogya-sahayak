'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { AlertTriangle, ExternalLink, LifeBuoy, Mail, MessageSquareText, Siren } from 'lucide-react'
import AdaptiveShell from '@/components/shell/AdaptiveShell'
import { PageHeader } from '@/components/ui/kit'

const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL?.trim()
const issuesUrl = 'https://github.com/adarsh180/arogya-sahayak/issues/new'
const topics = ['Bug report', 'Wrong or unsafe answer', 'Feature request', 'Account or data request', 'Something else']

export default function ContactPage() {
  const [form, setForm] = useState({ topic: topics[0], subject: '', message: '' })

  function submit(event: FormEvent) {
    event.preventDefault()
    const title = `[${form.topic}] ${form.subject}`
    if (supportEmail) {
      window.location.href = `mailto:${supportEmail}?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(form.message)}`
      return
    }
    const body = `${form.message}\n\n---\nPage: ${document.referrer || 'n/a'}\nBrowser: ${navigator.userAgent}`
    window.open(`${issuesUrl}?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <AdaptiveShell>
      <PageHeader kicker="Contact" title="Tell us what’s not working." description="Bug reports, unsafe answers and ideas all help make Arogya better." />
      <div className="contact-grid">
        <form className="ui-card contact-form" onSubmit={submit}>
          <div className="ui-alert is-warn"><AlertTriangle /><span><strong>Please don’t include personal health details.</strong> {supportEmail ? 'Your email app will open with this message.' : 'This opens a public GitHub issue that anyone can read.'}</span></div>
          <label className="ui-field"><span>Topic</span><select className="ui-select" value={form.topic} onChange={event => setForm({ ...form, topic: event.target.value })}>{topics.map(topic => <option key={topic}>{topic}</option>)}</select></label>
          <label className="ui-field"><span>Subject</span><input className="ui-input" required minLength={4} maxLength={120} value={form.subject} onChange={event => setForm({ ...form, subject: event.target.value })} placeholder="One line summary" /></label>
          <label className="ui-field"><span>Details</span><textarea className="ui-textarea" required minLength={10} maxLength={4000} rows={7} value={form.message} onChange={event => setForm({ ...form, message: event.target.value })} placeholder="What happened, what you expected, and the steps to reproduce it." /></label>
          <button type="submit" className="ui-btn ui-btn-lg">{supportEmail ? <><Mail /> Compose email</> : <><ExternalLink /> Continue on GitHub</>}</button>
        </form>
        <aside className="contact-side">
          <div className="ui-card ui-card-pad">
            <div className="ui-card-head"><div><span className="ui-card-label">Quickest help</span><h3>Ask Arogya</h3><p>For how-to questions, the assistant can usually answer straight away.</p></div><MessageSquareText /></div>
            <Link href="/chat" className="ui-btn ui-btn-secondary ui-btn-block">Open chat</Link>
          </div>
          <div className="ui-card ui-card-pad">
            <div className="ui-card-head"><div><span className="ui-card-label">Self-service</span><h3>Help centre</h3><p>Answers about features, privacy and data.</p></div><LifeBuoy /></div>
            <Link href="/help" className="ui-btn ui-btn-secondary ui-btn-block">Browse help</Link>
          </div>
          <Link href="/emergency" className="ui-alert is-danger"><Siren /><span><strong>This is not an emergency service.</strong> For urgent help call 112.</span></Link>
        </aside>
      </div>
    </AdaptiveShell>
  )
}
