import Image from 'next/image'
import Link from 'next/link'
import {
  Activity, ArrowRight, BookOpenCheck, Check, FileSearch, GraduationCap, HeartPulse, Languages,
  LockKeyhole, MessageSquareText, Mic, Pill, ShieldCheck, Siren, Sparkles, Stethoscope
} from 'lucide-react'
import { SiteFooter, SiteHeader } from '@/components/shell/SiteChrome'

const features = [
  { icon: MessageSquareText, tone: 'rose', title: 'Ask with context', copy: 'A calm conversation that asks what matters, remembers the thread and answers in your language.' },
  { icon: FileSearch, tone: 'peacock', title: 'See the evidence', copy: 'Reviewed sources are found before a health answer and shown apart from generated text.' },
  { icon: Activity, tone: 'gold', title: 'Understand your numbers', copy: 'Blood pressure, glucose, pulse and BMI — trends against usual ranges, never an AI diagnosis.' },
  { icon: Pill, tone: 'rose', title: 'Stay on schedule', copy: 'Medicine reminders, a daily check-off and plain-language notes about what you take.' },
  { icon: Mic, tone: 'peacock', title: 'Speak naturally', copy: 'Talk instead of typing where your browser allows, and have answers read aloud.' },
  { icon: BookOpenCheck, tone: 'gold', title: 'Learn medicine actively', copy: 'Guided study, timed mock tests with explanations, study plans and honest progress.' },
]

const path = [
  { icon: Siren, title: 'Urgency first', copy: 'Emergency words are caught before any AI runs and routed to 112.' },
  { icon: FileSearch, title: 'Reviewed sources', copy: 'A curated library is searched and cited with relevant answers.' },
  { icon: ShieldCheck, title: 'Bounded answers', copy: 'No prescribing, no dosing, no diagnosis — by design.' },
  { icon: Stethoscope, title: 'A human next step', copy: 'Every answer keeps the way to a real clinician clear.' },
]

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="lp">
        <section className="lp-hero">
          <div className="lp-wrap lp-hero-grid">
            <div className="lp-hero-copy">
              <span className="lp-pill"><Sparkles /> Health clarity, designed for India</span>
              <h1>Calm, kind guidance for <em>body</em> and <em>mind</em>.</h1>
              <p>Arogya Sahayak gathers evidence-aware answers, everyday health care and medical learning into one gentle space — in your language, on any device.</p>
              <div className="lp-actions">
                <Link href="/auth/signup" className="ui-btn ui-btn-lg">Begin your space <ArrowRight /></Link>
                <Link href="/#safety" className="ui-btn ui-btn-lg ui-btn-secondary">How we keep it safe</Link>
              </div>
              <ul className="lp-points">
                <li><Check /> 12 Indian languages</li>
                <li><Check /> Sources shown</li>
                <li><Check /> Free to use</li>
              </ul>
            </div>

            <div className="lp-stage" aria-hidden="true">
              <div className="lp-app">
                <header><span className="lp-dot" /> Personal health space <small>Today</small></header>
                <h3>Good morning, Meera</h3>
                <div className="lp-app-vitals">
                  <div><small>Blood pressure</small><strong>128/82</strong><span className="ui-badge is-ok">Within range</span></div>
                  <div><small>Fasting glucose</small><strong>104</strong><span className="ui-badge is-warn">Above range</span></div>
                </div>
                <div className="lp-app-trend">
                  <svg viewBox="0 0 300 64">
                    <path d="M6 48 C40 46 52 34 84 36 S128 26 156 30 S206 18 236 24 S280 14 294 16" />
                    {[[6, 48], [84, 36], [156, 30], [236, 24], [294, 16]].map(([cx, cy]) => <circle key={cx} cx={cx} cy={cy} r="4" />)}
                  </svg>
                  <small>Blood pressure · last 7 days</small>
                </div>
                <div className="lp-app-actions">
                  <span><MessageSquareText /> Ask</span>
                  <span><Activity /> Track</span>
                  <span><GraduationCap /> Learn</span>
                </div>
              </div>
              <div className="lp-note is-chat">
                <p className="lp-bubble is-user">Is a fasting sugar of 104 worth worrying about?</p>
                <p className="lp-bubble is-bot"><Image src="/arogya-mark.png" alt="" width={18} height={18} /><span>It’s a little above the usual fasting range. One reading can’t diagnose anything — when was it taken?</span></p>
                <span className="lp-source"><FileSearch /> WHO · Diabetes fact sheet</span>
              </div>
              <div className="lp-note is-dose">
                <span className="lp-note-icon"><Pill /></span>
                <span><small>Next dose · 20:00</small><strong>Metformin 500</strong></span>
                <span className="lp-check"><Check /></span>
              </div>
              <div className="lp-note is-sos"><Siren /><span>112</span></div>
            </div>
          </div>
        </section>

        <section className="lp-wrap lp-trust" aria-label="Principles">
          <div><LockKeyhole /><span><strong>Data minimisation</strong>Only what a feature needs</span></div>
          <div><FileSearch /><span><strong>Sources kept apart</strong>Evidence stays attributable</span></div>
          <div><Languages /><span><strong>Your language</strong>Hindi, Tamil, Bengali and more</span></div>
          <div><Siren /><span><strong>Emergency-aware</strong>112 always one tap away</span></div>
        </section>

        <section id="capabilities" className="lp-section lp-wrap">
          <div className="lp-head">
            <span className="ui-kicker">Everything in one place</span>
            <h2>One gentle space for everything health asks of you.</h2>
            <p>Each tool has one clear job and a visible boundary, so nothing feels overwhelming.</p>
          </div>
          <div className="lp-features">
            {features.map(({ icon: Icon, tone, title, copy }, index) => (
              <article key={title} className={`lp-feature is-${tone}`} style={{ '--d': `${index * 70}ms` } as React.CSSProperties}>
                <span className="lp-feature-icon"><Icon /></span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="safety" className="lp-section lp-wrap">
          <div className="lp-safety">
            <div className="lp-head is-light">
              <span className="ui-kicker">How an answer is made</span>
              <h2>Trust, earned one step at a time.</h2>
              <p>Health AI should show where it learned something, admit when evidence is thin and make urgent help unmistakable.</p>
            </div>
            <ol className="lp-path">
              {path.map(({ icon: Icon, title, copy }, index) => (
                <li key={title}>
                  <span className="lp-stone"><Icon /><b>{index + 1}</b></span>
                  <strong>{title}</strong>
                  <p>{copy}</p>
                </li>
              ))}
            </ol>
            <Link href="/resources" className="ui-btn ui-btn-light">Browse the evidence library <ArrowRight /></Link>
          </div>
        </section>

        <section id="students" className="lp-section lp-wrap lp-worlds">
          <article className="lp-world is-care">
            <span className="lp-world-icon"><HeartPulse /></span>
            <span className="ui-kicker">For you and your family</span>
            <h3>Arrive at every appointment prepared.</h3>
            <ul>
              <li><Check /> Readings with trends, not alarms</li>
              <li><Check /> Medicines, reminders and check-offs</li>
              <li><Check /> Questions ready for your doctor</li>
            </ul>
            <Link href="/auth/signup" className="ui-btn">Start caring <ArrowRight /></Link>
          </article>
          <article className="lp-world is-learn">
            <span className="lp-world-icon"><GraduationCap /></span>
            <span className="ui-kicker">For medical learners</span>
            <h3>A tutor that makes you recall, reason and reflect.</h3>
            <ul>
              <li><Check /> NEET UG, NEET PG, INI-CET, FMGE and more</li>
              <li><Check /> Timed MCQs with an explanation for every answer</li>
              <li><Check /> AI-drafted study plans you stay in control of</li>
            </ul>
            <Link href="/auth/signup" className="ui-btn ui-btn-secondary">Start learning <ArrowRight /></Link>
          </article>
        </section>

        <section className="lp-section lp-wrap">
          <div className="lp-cta">
            <span className="lp-cta-mark" aria-hidden="true"><Image src="/arogya-mark.png" alt="" width={48} height={48} /></span>
            <h2>Built to support your judgment — never to replace it.</h2>
            <p>A space that is as honest about its limits as it is about what it can do.</p>
            <div className="lp-actions">
              <Link href="/auth/signup" className="ui-btn ui-btn-lg">Create your free account <Sparkles /></Link>
              <Link href="/emergency" className="ui-btn ui-btn-lg ui-btn-secondary"><Siren /> Emergency numbers</Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
