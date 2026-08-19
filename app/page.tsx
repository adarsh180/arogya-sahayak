import Link from 'next/link'
import {
  Activity, AlertCircle, ArrowRight, BookOpenCheck, Check, FileSearch,
  Languages, LockKeyhole, MessageSquareText, Mic, Pill, ShieldCheck, Stethoscope
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import AnimatedHealthTrend from '@/components/AnimatedHealthTrend'

const capabilities = [
  { icon: MessageSquareText, title: 'Ask with context', copy: 'Have a calm, structured health conversation that remembers the current thread and asks for missing context.' },
  { icon: FileSearch, title: 'See the evidence', copy: 'Relevant curated sources are retrieved before a health answer, with provenance shown separately from generated text.' },
  { icon: Activity, title: 'Understand trends', copy: 'Record measurements and view deterministic, clearly bounded summaries instead of AI-made diagnoses.' },
  { icon: Pill, title: 'Organise treatment', copy: 'Keep medication schedules, appointments, vaccinations and health records together for easier follow-through.' },
  { icon: Mic, title: 'Speak naturally', copy: 'Use device speech where the browser supports it, with an optional local endpoint for private experimentation.' },
  { icon: BookOpenCheck, title: 'Learn actively', copy: 'Study medicine through recall, cases and adaptive explanations—clearly labelled as generated practice material.' },
]

export default function Home() {
  return (
    <div className="as-site">
      <Navbar />
      <main id="main-content">
        <section className="as-hero">
          <div className="as-hero-grid" aria-hidden="true" />
          <div className="as-container as-hero-layout">
            <div className="as-hero-copy">
              <div className="as-eyebrow"><span />Designed for health clarity in India</div>
              <h1>Health information should leave you <em>clearer,</em> not more anxious.</h1>
              <p className="as-hero-lede">
                Arogya Sahayak brings evidence-aware guidance, everyday health organisation and medical learning into one considered workspace—across languages and devices.
              </p>
              <div className="as-hero-actions">
                <Link href="/auth/signup" className="as-button">Create your space <ArrowRight aria-hidden="true" /></Link>
                <Link href="#safety" className="as-button as-button-quiet">How safety works</Link>
              </div>
              <div className="as-hero-note">
                <ShieldCheck aria-hidden="true" />
                <span><strong>Not a diagnosis.</strong> Urgent concerns are routed to emergency guidance before an AI provider is called.</span>
              </div>
            </div>

            <div className="as-product-frame" aria-label="Preview of the Arogya workspace">
              <div className="as-product-topbar">
                <div className="as-product-identity"><span className="as-status-dot" /> Personal health space</div>
                <span>Today</span>
              </div>
              <div className="as-product-body">
                <div className="as-product-greeting">
                  <span>Good morning</span>
                  <h2>What would help you feel prepared today?</h2>
                </div>
                <div className="as-quick-grid">
                  <article><MessageSquareText /><strong>Ask a health question</strong><span>Private thread · sources shown</span></article>
                  <article><Activity /><strong>Record a measurement</strong><span>Blood pressure, glucose, BMI</span></article>
                </div>
                <div className="as-insight-card">
                  <div className="as-insight-label"><span>Weekly view</span><span>3 entries</span></div>
                  <AnimatedHealthTrend />
                  <p>Your records stay organised. A single measurement is never presented as a diagnosis.</p>
                </div>
                <div className="as-next-row"><span><Stethoscope /> Prepare for a clinician visit</span><ArrowRight /></div>
              </div>
            </div>
          </div>
        </section>

        <section className="as-principles" aria-label="Product principles">
          <div className="as-container as-principle-grid">
            <div><LockKeyhole /><span><strong>Data minimisation</strong>Collect only what a feature needs</span></div>
            <div><FileSearch /><span><strong>Source separation</strong>Evidence stays visible and attributable</span></div>
            <div><Languages /><span><strong>Language access</strong>Designed for multilingual conversations</span></div>
          </div>
        </section>

        <section id="capabilities" className="as-section as-container">
          <div className="as-section-heading">
            <div><span className="as-kicker">One considered system</span><h2>Less switching. More continuity.</h2></div>
            <p>Each tool has a clear job, a visible safety boundary and a common interaction language.</p>
          </div>
          <div className="as-capability-grid">
            {capabilities.map(({ icon: Icon, title, copy }, index) => (
              <article key={title} className="as-capability-card" style={{ '--delay': `${index * 60}ms` } as React.CSSProperties}>
                <span className="as-capability-number">0{index + 1}</span>
                <Icon aria-hidden="true" />
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="safety" className="as-safety-section">
          <div className="as-container as-safety-layout">
            <div className="as-safety-copy">
              <span className="as-kicker">A safer answer architecture</span>
              <h2>Confidence is earned in layers.</h2>
              <p>Health AI should show where information came from, admit when its evidence is thin and make escalation unmistakable.</p>
              <Link href="/auth/signup" className="as-inline-link">Explore the protected workspace <ArrowRight /></Link>
            </div>
            <ol className="as-safety-steps">
              <li><span>01</span><div><strong>Urgency screen</strong><p>Potential emergency language is intercepted first and directed to India’s 112 service.</p></div><Check /></li>
              <li><span>02</span><div><strong>Relevant source retrieval</strong><p>A small, reviewed knowledge layer is searched locally—without a vector database.</p></div><Check /></li>
              <li><span>03</span><div><strong>Bounded generation</strong><p>The selected provider receives strict medical boundaries, source context and a low-variance setting.</p></div><Check /></li>
              <li><span>04</span><div><strong>Human next step</strong><p>The interface distinguishes education from diagnosis and preserves the route to professional care.</p></div><Check /></li>
            </ol>
          </div>
        </section>

        <section id="students" className="as-section as-container">
          <div className="as-student-panel">
            <div>
              <span className="as-kicker">For medical learners</span>
              <h2>A tutor that makes you retrieve, reason and reflect.</h2>
              <p>Build active-recall sessions, case reasoning and practice questions adapted to your topic. Generated material is labelled and never passed off as official exam content.</p>
              <div className="as-check-list"><span><Check /> Socratic guidance</span><span><Check /> Case-based practice</span><span><Check /> Progress reflection</span></div>
              <Link href="/auth/signup" className="as-button as-button-light">Start learning <ArrowRight /></Link>
            </div>
            <div className="as-study-stack" aria-label="Sample study cards">
              <article><span>Learning objective</span><strong>Connect preload to stroke volume</strong><p>Explain the relationship in your own words before revealing the model.</p></article>
              <article><span>Clinical reasoning</span><strong>What changes first?</strong><p>A patient develops acute blood loss. Predict the early compensatory response.</p></article>
              <article><span>Reflection</span><strong>One-minute recall</strong><p>Write the three variables that determine cardiac output.</p></article>
            </div>
          </div>
        </section>

        <section className="as-final-cta">
          <div className="as-container">
            <AlertCircle aria-hidden="true" />
            <h2>Built to assist judgment,<br />never replace it.</h2>
            <p>Begin with a workspace that makes its limits as visible as its capabilities.</p>
            <Link href="/auth/signup" className="as-button">Create your account <ArrowRight /></Link>
          </div>
        </section>
      </main>

      <footer className="as-footer">
        <div className="as-container as-footer-grid">
          <div><strong>Arogya Sahayak</strong><p>Health information and learning support for India.</p></div>
          <div><span>Medical boundary</span><p>Educational support only. For emergencies in India, call 112.</p></div>
          <div><span>Product</span><Link href="/auth/signin">Sign in</Link><Link href="/#safety">Safety architecture</Link></div>
          <small>© {new Date().getFullYear()} Arogya Sahayak</small>
        </div>
      </footer>
    </div>
  )
}
