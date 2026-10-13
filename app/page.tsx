import Image from 'next/image'
import Link from 'next/link'
import {
  Activity, ArrowRight, BookOpenCheck, Check, FileSearch, HeartPulse, Languages, LockKeyhole,
  MessageSquareText, Mic, Pill, ShieldCheck, Siren, Sparkles
} from 'lucide-react'
import { SiteFooter, SiteHeader } from '@/components/shell/SiteChrome'

const capabilities = [
  { icon: MessageSquareText, title: 'Ask with context', copy: 'A calm conversation that asks for what matters, remembers the thread and answers in your language.' },
  { icon: FileSearch, title: 'See the evidence', copy: 'Reviewed sources are retrieved before a health answer and shown separately from generated text.' },
  { icon: Activity, title: 'Understand your numbers', copy: 'Record BP, glucose, pulse and BMI. See trends against usual ranges — never an AI diagnosis.' },
  { icon: Pill, title: 'Stay on schedule', copy: 'Medicine reminders, a daily check-off and plain-language notes about what you take.' },
  { icon: Mic, title: 'Speak naturally', copy: 'Talk instead of typing where your browser supports it, and have answers read aloud.' },
  { icon: BookOpenCheck, title: 'Learn medicine actively', copy: 'Guided study, timed mock tests with explanations, study plans and honest progress tracking.' },
]

const steps = [
  { title: 'Urgency screen', copy: 'Emergency language is caught first and routed to 112 before any AI is called.' },
  { title: 'Reviewed sources', copy: 'A small, curated evidence library is searched and cited with every relevant answer.' },
  { title: 'Bounded answers', copy: 'The model works under strict medical boundaries: no prescribing, no dosing, no diagnosis.' },
  { title: 'A human next step', copy: 'Every answer keeps the route to a qualified clinician clear and visible.' },
]

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="home">
        <section className="home-hero">
          <div className="home-hero-glow" aria-hidden="true" />
          <div className="home-wrap home-hero-grid">
            <div className="home-hero-copy">
              <span className="ui-kicker">Health clarity, designed for India</span>
              <h1>Health information that leaves you <em>clearer</em>, not more anxious.</h1>
              <p>Arogya Sahayak brings evidence-aware answers, everyday health organisation and medical learning into one calm workspace — in your language, on any device.</p>
              <div className="home-hero-actions">
                <Link href="/auth/signup" className="ui-btn ui-btn-lg">Create your free space <ArrowRight /></Link>
                <Link href="/#safety" className="ui-btn ui-btn-lg ui-btn-secondary">How safety works</Link>
              </div>
              <ul className="home-hero-points">
                <li><Check /> 12 Indian languages</li>
                <li><Check /> Sources shown</li>
                <li><Check /> No diagnosis, ever</li>
              </ul>
            </div>

            <div className="home-preview" aria-label="Preview of the Arogya workspace">
              <div className="home-preview-card is-main">
                <header><span className="home-dot" /> Personal health space <small>Today</small></header>
                <h3>Good morning, Meera</h3>
                <div className="home-preview-vitals">
                  <div><small>Blood pressure</small><strong>128/82</strong><span className="ui-badge is-ok">Within range</span></div>
                  <div><small>Fasting glucose</small><strong>104</strong><span className="ui-badge is-warn">Above range</span></div>
                </div>
                <svg className="home-preview-trend" viewBox="0 0 300 70" aria-hidden="true">
                  <rect x="0" y="22" width="300" height="26" rx="4" />
                  <path d="M6 52 C40 50 52 38 84 40 S128 30 156 34 S206 22 236 28 S280 18 294 20" />
                  {[[6, 52], [84, 40], [156, 34], [236, 28], [294, 20]].map(([cx, cy]) => <circle key={cx} cx={cx} cy={cy} r="4" />)}
                </svg>
                <div className="home-preview-dose"><Pill /><span><small>Next dose · 20:00</small><strong>Metformin 500 · 1 tablet</strong></span></div>
              </div>
              <div className="home-preview-card is-chat">
                <div className="home-bubble is-user">Is a fasting sugar of 104 something to worry about?</div>
                <div className="home-bubble is-bot">
                  <Image src="/arogya-mark.png" alt="" width={18} height={18} />
                  <span>It’s slightly above the usual fasting range. One reading can’t diagnose anything — let’s look at when it was taken and what else you’ve noticed…</span>
                </div>
                <div className="home-source"><FileSearch /> WHO · Diabetes fact sheet</div>
              </div>
            </div>
          </div>
        </section>

        <section className="home-principles" aria-label="Principles">
          <div className="home-wrap">
            <div><LockKeyhole /><span><strong>Data minimisation</strong>Only what a feature needs</span></div>
            <div><FileSearch /><span><strong>Source separation</strong>Evidence stays attributable</span></div>
            <div><Languages /><span><strong>Language access</strong>Hindi, Tamil, Bengali and more</span></div>
            <div><Siren /><span><strong>Emergency-aware</strong>112 is always one tap away</span></div>
          </div>
        </section>

        <section id="capabilities" className="home-section home-wrap">
          <div className="home-section-head">
            <span className="ui-kicker">One considered system</span>
            <h2>Less switching. More continuity.</h2>
            <p>Each tool has one clear job, a visible safety boundary and the same calm interaction language.</p>
          </div>
          <div className="home-caps">
            {capabilities.map(({ icon: Icon, title, copy }, index) => (
              <article key={title} className="ui-card home-cap">
                <span className="home-cap-num">0{index + 1}</span>
                <span className="ui-row-icon"><Icon /></span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="safety" className="home-safety">
          <div className="home-wrap home-safety-grid">
            <div className="home-safety-copy">
              <span className="ui-kicker">A safer answer architecture</span>
              <h2>Confidence is earned in layers.</h2>
              <p>Health AI should show where information came from, admit when evidence is thin and make escalation unmistakable.</p>
              <Link href="/resources" className="ui-btn ui-btn-light">Browse the evidence library <ArrowRight /></Link>
            </div>
            <ol className="home-steps">
              {steps.map((step, index) => (
                <li key={step.title}><span>0{index + 1}</span><div><strong>{step.title}</strong><p>{step.copy}</p></div><ShieldCheck /></li>
              ))}
            </ol>
          </div>
        </section>

        <section id="students" className="home-section home-wrap">
          <div className="home-students ui-card">
            <div>
              <span className="ui-kicker">For medical learners</span>
              <h2>A tutor that makes you retrieve, reason and reflect.</h2>
              <p>Guided sessions built on active recall and clinical cases, timed MCQs for NEET UG, NEET PG, INI-CET, FMGE and more — with an explanation for every answer.</p>
              <ul>
                <li><Check /> Socratic, case-based guidance</li>
                <li><Check /> Mock tests with full answer review</li>
                <li><Check /> AI-drafted study plans you control</li>
              </ul>
              <Link href="/auth/signup" className="ui-btn">Start learning <ArrowRight /></Link>
            </div>
            <div className="home-study-stack" aria-hidden="true">
              <article><small>Learning objective</small><strong>Connect preload to stroke volume</strong><p>Explain it in your own words before revealing the model.</p></article>
              <article><small>Clinical reasoning</small><strong>What changes first?</strong><p>Acute blood loss — predict the earliest compensatory response.</p></article>
              <article><small>Mock test · Physiology</small><strong>Score 84%</strong><p>21 of 25 correct · review 4 explanations</p></article>
            </div>
          </div>
        </section>

        <section className="home-cta">
          <div className="home-wrap">
            <Image src="/arogya-mark.png" alt="" width={56} height={56} />
            <h2>Built to support judgment — never to replace it.</h2>
            <p>Start with a workspace that is as clear about its limits as it is about what it can do.</p>
            <div className="home-hero-actions">
              <Link href="/auth/signup" className="ui-btn ui-btn-lg">Create your account <Sparkles /></Link>
              <Link href="/emergency" className="ui-btn ui-btn-lg ui-btn-secondary"><HeartPulse /> Emergency numbers</Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
