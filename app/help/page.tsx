'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Activity, ArrowRight, BookOpen, GraduationCap, LifeBuoy, Lock, MessageSquareText, Plus, Search, Siren } from 'lucide-react'
import AdaptiveShell from '@/components/shell/AdaptiveShell'
import { EmptyState, PageHeader } from '@/components/ui/kit'

const groups = [
  {
    title: 'Getting started', icon: BookOpen, items: [
      ['Is Arogya Sahayak free?', 'Yes. Create an account with your email (or Google, where the operator has enabled it) and every feature is available at no cost.'],
      ['Which languages can Arogya answer in?', 'Twelve: English, Hindi, Bengali, Telugu, Marathi, Tamil, Gujarati, Kannada, Malayalam, Punjabi, Odia and Urdu. Pick one in the chat header or set a default in your profile.'],
      ['Can I switch between health and learning?', 'Any time. Your starting focus only changes what you see first — every section stays available from the sidebar.'],
    ],
  },
  {
    title: 'Health features', icon: Activity, items: [
      ['Can Arogya diagnose me or tell me what medicine to take?', 'No. Arogya explains information, helps you organise readings and prepare questions, and points you to a clinician. It never diagnoses, prescribes or sets a dose.'],
      ['How do measurements work?', 'Record blood pressure, glucose, resting pulse or weight and height. Each reading is compared with general adult reference ranges and saved so you can see trends. A single reading is never treated as a diagnosis.'],
      ['Why didn’t my medicine reminder pop up?', 'Reminders appear while Arogya is open in a browser tab. Use “Enable alerts” on the Medicines page to allow system notifications; if your browser blocked them, allow notifications for this site in its settings.'],
      ['What should I do in an emergency?', 'Call 112 straight away. The Emergency page lists national helplines (108 ambulance, 14416 Tele-MANAS and more) and lets you save trusted contacts.'],
    ],
  },
  {
    title: 'Learning', icon: GraduationCap, items: [
      ['Which exams are supported?', 'NEET UG, NEET PG, INI-CET, FMGE, NEET SS, NEET MDS and AIIMS Nursing, with subject lists for each.'],
      ['Are the mock-test questions from past papers?', 'No. They are generated fresh for practice and come with an explanation. If an answer looks wrong, check a standard textbook — and treat it as a chance to reason it through.'],
      ['How is my progress calculated?', 'Only from tests you completed and study sessions you marked done. Nothing is estimated or invented.'],
    ],
  },
  {
    title: 'Privacy & data', icon: Lock, items: [
      ['Who can see my health information?', 'Only you, through your account. When you ask an AI question, the relevant text is sent to the operator’s configured AI provider to produce the answer. See the privacy notice for details.'],
      ['Can I delete my data?', 'You can delete individual readings, medicines, contacts, study sessions and conversations yourself. For full account deletion, use the contact page.'],
      ['Should I upload my lab reports?', 'You can attach a PDF or text file to a question. Remove your name, ID numbers and anything not needed for the question before uploading.'],
    ],
  },
]

export default function HelpPage() {
  const [query, setQuery] = useState('')
  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return groups
    return groups.map(group => ({ ...group, items: group.items.filter(([q, a]) => `${q} ${a}`.toLowerCase().includes(term)) })).filter(group => group.items.length)
  }, [query])

  return (
    <AdaptiveShell>
      <PageHeader kicker="Help centre" title="Answers, without the runaround." description="Quick answers about how Arogya works, what it can and can’t do, and how your information is handled." />
      <div className="faq-layout">
        <div>
          <div className="ui-input-group faq-search"><Search /><input className="ui-input" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search questions" aria-label="Search help" /></div>
          {filtered.length ? filtered.map(({ title, icon: Icon, items }) => (
            <section key={title} className="faq-group">
              <h2><Icon />{title}</h2>
              {items.map(([question, answer]) => (
                <details key={question} className="faq-item">
                  <summary>{question}<Plus /></summary>
                  <p>{answer}</p>
                </details>
              ))}
            </section>
          )) : <div className="ui-card"><EmptyState icon={Search} title="No matching questions">Try a different word, or ask Arogya directly.</EmptyState></div>}
        </div>
        <aside className="faq-aside">
          <div className="ui-card ui-card-pad">
            <div className="ui-card-head"><div><span className="ui-card-label">Still stuck?</span><h3>Ask Arogya</h3><p>Describe what you’re trying to do and get a step-by-step answer.</p></div><MessageSquareText /></div>
            <Link href="/chat" className="ui-btn ui-btn-block">Open chat <ArrowRight /></Link>
          </div>
          <div className="ui-card ui-card-pad">
            <div className="ui-card-head"><div><span className="ui-card-label">Feedback</span><h3>Report a problem</h3><p>Found a bug or a wrong answer? Tell us.</p></div><LifeBuoy /></div>
            <Link href="/contact" className="ui-btn ui-btn-secondary ui-btn-block">Contact</Link>
          </div>
          <Link href="/emergency" className="ui-alert is-danger"><Siren /><span><strong>Emergency?</strong> Call 112 now — see all helplines.</span></Link>
        </aside>
      </div>
    </AdaptiveShell>
  )
}
