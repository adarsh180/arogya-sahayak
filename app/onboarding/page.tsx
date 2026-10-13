'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Activity, ArrowLeft, ArrowRight, BookOpen, Check, FileText, MessageSquareText, Mic, ShieldCheck, Siren } from 'lucide-react'
import Brand from '@/components/shell/Brand'
import ThemeToggle from '@/components/shell/ThemeToggle'
import { BrandLoader, Spinner, cx } from '@/components/ui/kit'
import { api, errorMessage } from '@/lib/client-api'

const languages = [
  ['en', 'English', 'English'], ['hi', 'हिंदी', 'Hindi'], ['bn', 'বাংলা', 'Bengali'], ['te', 'తెలుగు', 'Telugu'],
  ['mr', 'मराठी', 'Marathi'], ['ta', 'தமிழ்', 'Tamil'], ['gu', 'ગુજરાતી', 'Gujarati'], ['kn', 'ಕನ್ನಡ', 'Kannada'],
  ['ml', 'മലയാളം', 'Malayalam'], ['pa', 'ਪੰਜਾਬੀ', 'Punjabi'], ['or', 'ଓଡ଼ିଆ', 'Odia'], ['ur', 'اردو', 'Urdu']
]

const steps = [
  { label: 'Focus', title: 'What brings you to Arogya?' },
  { label: 'Language', title: 'Which language should Arogya answer in?' },
  { label: 'Tour', title: 'Three places you’ll use most.' },
  { label: 'Boundaries', title: 'What Arogya is — and isn’t.' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const { data: session, status, update } = useSession()
  const [step, setStep] = useState(0)
  const [mode, setMode] = useState<'patient' | 'student'>('patient')
  const [language, setLanguage] = useState('en')
  const [accepted, setAccepted] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/auth/signin?callbackUrl=/onboarding')
    if (session?.user.userType === 'student') setMode('student')
    if (session?.user.preferredLanguage) setLanguage(session.user.preferredLanguage)
  }, [router, session?.user.preferredLanguage, session?.user.userType, status])

  async function finish() {
    if (!accepted) return setError('Please confirm the medical boundary to continue.')
    setSaving(true)
    setError('')
    try {
      await api('/api/user/profile', { method: 'PUT', json: { userType: mode, preferredLanguage: language, onboardingCompleted: true } })
      await update()
      router.push(mode === 'student' ? '/student' : '/dashboard')
    } catch (reason) {
      setError(errorMessage(reason, 'We could not save your setup. Please try again.'))
      setSaving(false)
    }
  }

  if (status !== 'authenticated') return <BrandLoader screen label="Preparing your setup" />

  return (
    <div className="onb">
      <header className="onb-top">
        <Brand href="/dashboard" />
        <div className="onb-top-actions">
          <ThemeToggle />
          <button type="button" className="ui-btn ui-btn-ghost ui-btn-sm" onClick={() => router.push('/dashboard')}>Finish later</button>
        </div>
      </header>

      <main id="main-content" className="onb-main">
        <ol className="onb-steps" aria-label="Setup progress">
          {steps.map((item, index) => (
            <li key={item.label} className={cx(index === step && 'is-active', index < step && 'is-done')} aria-current={index === step ? 'step' : undefined}>
              <i>{index < step ? <Check /> : index + 1}</i><span>{item.label}</span>
            </li>
          ))}
        </ol>

        <section className="onb-card ui-card" key={step}>
          <span className="ui-kicker">Step {step + 1} of {steps.length}</span>
          <h1>{steps[step].title}</h1>

          {step === 0 && (
            <div className="onb-options">
              {([
                ['patient', Activity, 'My health & family', 'Track readings and medicines, prepare for visits and ask health questions.'],
                ['student', BookOpen, 'Medical learning', 'Study with an AI tutor, practise MCQs and plan your preparation.'],
              ] as const).map(([value, Icon, title, copy]) => (
                <button key={value} type="button" className={cx('onb-option', mode === value && 'is-selected')} onClick={() => setMode(value)} aria-pressed={mode === value}>
                  <span className="onb-option-icon"><Icon /></span>
                  <span><strong>{title}</strong><small>{copy}</small></span>
                  <i className="onb-radio">{mode === value && <Check />}</i>
                </button>
              ))}
              <p className="ui-faint">You can use both spaces any time — this only sets your starting point.</p>
            </div>
          )}

          {step === 1 && (
            <div className="onb-languages" role="radiogroup" aria-label="Preferred language">
              {languages.map(([code, native, english]) => (
                <button key={code} type="button" role="radio" aria-checked={language === code} className={cx('onb-lang', language === code && 'is-selected')} onClick={() => setLanguage(code)}>
                  <strong>{native}</strong><small>{english}</small>{language === code && <Check />}
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="onb-tour">
              {[
                [MessageSquareText, 'Ask Arogya', 'Ask in your language — by typing or speaking. Answers show the sources they used.'],
                [Activity, 'Overview', 'Readings, medicine times and what changed, on one calm screen.'],
                [Siren, 'Emergency', 'National helplines and your own trusted contacts, always one tap away.'],
              ].map(([Icon, title, copy], index) => {
                const TourIcon = Icon as typeof Activity
                return <article key={String(title)} style={{ '--d': `${index * 80}ms` } as React.CSSProperties} className="ui-rise"><span className="ui-row-icon"><TourIcon /></span><div><strong>{String(title)}</strong><p>{String(copy)}</p></div></article>
              })}
            </div>
          )}

          {step === 3 && (
            <div className="onb-bounds">
              <article><ShieldCheck /><div><strong>Not a doctor</strong><p>Answers are educational. They can be wrong and never replace a clinician’s assessment.</p></div></article>
              <article><FileText /><div><strong>Share only what’s needed</strong><p>Uploaded text may be sent to the AI provider with your question. Remove names and ID numbers first.</p></div></article>
              <article><Mic /><div><strong>Microphone on request</strong><p>Voice input asks for permission only when you tap the microphone.</p></div></article>
              <label className="ui-check onb-accept"><input type="checkbox" checked={accepted} onChange={event => { setAccepted(event.target.checked); setError('') }} /><span>I understand Arogya Sahayak is not for diagnosis or emergencies. In an emergency I will call 112.</span></label>
            </div>
          )}

          {error && <div className="ui-alert is-danger" role="alert"><ShieldCheck /><span>{error}</span></div>}

          <div className="onb-actions">
            <button type="button" className="ui-btn ui-btn-ghost" onClick={() => setStep(value => Math.max(0, value - 1))} disabled={step === 0}><ArrowLeft /> Back</button>
            {step < steps.length - 1
              ? <button type="button" className="ui-btn" onClick={() => setStep(value => value + 1)}>Continue <ArrowRight /></button>
              : <button type="button" className="ui-btn" onClick={finish} disabled={saving || !accepted}>{saving ? <><Spinner /> Saving…</> : <>Enter my workspace <ArrowRight /></>}</button>}
          </div>
        </section>
      </main>
    </div>
  )
}
