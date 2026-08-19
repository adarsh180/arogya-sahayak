'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Activity, ArrowLeft, ArrowRight, BookOpen, Check, FileText, Languages, MessageSquareText, Mic, ShieldCheck } from 'lucide-react'

const languages = [
  ['en', 'English'], ['hi', 'हिंदी'], ['bn', 'বাংলা'], ['te', 'తెలుగు'],
  ['mr', 'मराठी'], ['ta', 'தமிழ்'], ['gu', 'ગુજરાતી'], ['kn', 'ಕನ್ನಡ'],
  ['ml', 'മലയാളം'], ['pa', 'ਪੰਜਾਬੀ'], ['or', 'ଓଡ଼ିଆ'], ['ur', 'اردو']
]

const steps = [
  { label: 'Purpose', title: 'Shape the space around your goal.' },
  { label: 'Language', title: 'Choose how Arogya speaks with you.' },
  { label: 'Orientation', title: 'Learn the three places that matter.' },
  { label: 'Boundaries', title: 'Know what happens to your information.' }
]

export default function OnboardingPage() {
  const router = useRouter()
  const { data: session, status, update } = useSession()
  const [step, setStep] = useState(0)
  const [mode, setMode] = useState<'patient' | 'student'>('patient')
  const [language, setLanguage] = useState('en')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [accepted, setAccepted] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/auth/signin?callbackUrl=/onboarding')
    if (session?.user.userType === 'student') setMode('student')
    if (session?.user.preferredLanguage) setLanguage(session.user.preferredLanguage)
  }, [router, session, status])

  async function finish() {
    if (!accepted) return setError('Please confirm the medical boundary before entering the workspace.')
    setSaving(true)
    setError('')
    const response = await fetch('/api/user/profile', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userType: mode, preferredLanguage: language, onboardingCompleted: true })
    })
    if (!response.ok) {
      setError('We could not save your setup. Please try again.')
      setSaving(false)
      return
    }
    localStorage.setItem('arogya:onboarding-complete', 'true')
    localStorage.removeItem('arogya:tour-complete')
    await update()
    router.push(mode === 'student' ? '/student' : '/dashboard')
  }

  if (status === 'loading') return <div className="as-segment-loader"><div className="as-loader-stage"><span className="as-loader-orbit" /><Image src="/arogya-mark.png" alt="" width={54} height={54} /></div></div>

  return (
    <main id="main-content" className="as-onboarding">
      <header className="as-onboarding-header">
        <div className="as-brand"><Image src="/arogya-mark.png" alt="" width={38} height={38} /><span><strong>Arogya</strong> Sahayak</span></div>
        <button type="button" onClick={() => router.push('/dashboard')}>Finish later</button>
      </header>

      <div className="as-onboarding-shell">
        <aside className="as-onboarding-rail" aria-label="Setup progress">
          <span>Setup</span>
          <ol>{steps.map((item, index) => <li key={item.label} className={index === step ? 'is-active' : index < step ? 'is-done' : ''}><i>{index < step ? <Check /> : index + 1}</i><span><strong>{item.label}</strong>{item.title}</span></li>)}</ol>
        </aside>

        <section className="as-onboarding-content">
          <div className="as-onboarding-progress"><i style={{ width: `${((step + 1) / steps.length) * 100}%` }} /></div>
          <span className="as-kicker">Step {step + 1} of {steps.length} · {steps[step].label}</span>
          <h1>{steps[step].title}</h1>

          {step === 0 && <div className="as-onboarding-options"><button className={mode === 'patient' ? 'is-selected' : ''} onClick={() => setMode('patient')}><Activity /><span><strong>Personal health</strong>Organise measurements, medicines, appointments and questions.</span>{mode === 'patient' && <Check />}</button><button className={mode === 'student' ? 'is-selected' : ''} onClick={() => setMode('student')}><BookOpen /><span><strong>Medical learning</strong>Build study sessions, active recall and practice cases.</span>{mode === 'student' && <Check />}</button><p>You are not locked in. Both spaces remain available.</p></div>}

          {step === 1 && <div className="as-language-grid" role="radiogroup" aria-label="Preferred language">{languages.map(([code, label]) => <button key={code} role="radio" aria-checked={language === code} className={language === code ? 'is-selected' : ''} onClick={() => setLanguage(code)}><Languages />{label}{language === code && <Check />}</button>)}</div>}

          {step === 2 && <div className="as-tour-preview"><div className="as-tour-path" aria-hidden="true"><i /><ArrowRight /><i /><ArrowRight /><i /></div><article><span>01</span><MessageSquareText /><strong>Ask Arogya</strong><p>Start a sourced conversation. Use voice when your browser supports it.</p></article><article><span>02</span><Activity /><strong>Your overview</strong><p>See what is due and what changed without alarmist scoring.</p></article><article><span>03</span><FileText /><strong>Your records</strong><p>Keep files and measurements ready for a real clinical conversation.</p></article><div className="as-tour-tip"><Mic /><span>Look for short guided callouts after setup. They point to real controls and disappear when you are done.</span></div></div>}

          {step === 3 && <div className="as-boundary-list"><article><ShieldCheck /><div><strong>AI is not a clinician</strong><p>Answers are educational. Uncertainty, sources and a human next step should remain visible.</p></div></article><article><FileText /><div><strong>Upload only what is needed</strong><p>Document text can be sent to your configured AI provider when you ask about it. Remove unnecessary identifiers first.</p></div></article><article><Mic /><div><strong>Microphone access is on demand</strong><p>Browser voice asks permission only when you activate it. A local endpoint is optional and never downloaded automatically.</p></div></article><label className="as-boundary-check"><input type="checkbox" checked={accepted} onChange={event => setAccepted(event.target.checked)} /><span>I understand that Arogya Sahayak is not for diagnosis or emergency response.</span></label></div>}

          {error && <div className="as-form-error" role="alert">{error}</div>}
          <div className="as-onboarding-actions">
            <button type="button" className="as-back-button" onClick={() => setStep(value => Math.max(0, value - 1))} disabled={step === 0}><ArrowLeft /> Back</button>
            {step < steps.length - 1
              ? <button type="button" className="as-button" onClick={() => setStep(value => value + 1)}>Continue <ArrowRight /></button>
              : <button type="button" className="as-button" onClick={finish} disabled={saving || !accepted}>{saving ? 'Saving…' : <>Enter my workspace <ArrowRight /></>}</button>}
          </div>
        </section>
      </div>
    </main>
  )
}
