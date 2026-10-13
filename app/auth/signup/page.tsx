'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { AlertCircle, ArrowRight, BookOpen, Check, Eye, EyeOff, HeartPulse } from 'lucide-react'
import AuthFrame from '@/components/auth/AuthFrame'
import { Spinner, cx } from '@/components/ui/kit'
import { api, errorMessage } from '@/lib/client-api'

const rules = [
  { label: '10+ characters', test: (value: string) => value.length >= 10 },
  { label: 'Uppercase', test: (value: string) => /[A-Z]/.test(value) },
  { label: 'Lowercase', test: (value: string) => /[a-z]/.test(value) },
  { label: 'Number', test: (value: string) => /\d/.test(value) },
]

export default function SignUpPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '', userType: 'patient' as 'patient' | 'student' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const valid = rules.every(rule => rule.test(form.password))

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (!valid) return setError('Please choose a password that meets every requirement below.')
    setLoading(true)
    setError('')
    try {
      await api('/api/auth/signup', { method: 'POST', json: { ...form, email: form.email.trim() } })
      const result = await signIn('credentials', { email: form.email.trim().toLowerCase(), password: form.password, redirect: false })
      if (!result || result.error) {
        router.push('/auth/signin')
        return
      }
      router.replace('/onboarding')
      router.refresh()
    } catch (reason) {
      setError(errorMessage(reason, 'We could not create this account.'))
      setLoading(false)
    }
  }

  return (
    <AuthFrame eyebrow="Create your space" title="Begin with what matters to you." description="Free to use. Choose a starting focus — you can switch between health and learning at any time.">
      <form className="auth-form" onSubmit={submit}>
        <fieldset className="auth-modes">
          <legend className="ui-label">I want to start with</legend>
          {([['patient', HeartPulse, 'My health', 'Track and prepare'], ['student', BookOpen, 'Medical learning', 'Recall and reason']] as const).map(([value, Icon, title, note]) => (
            <button key={value} type="button" className={cx('auth-mode', form.userType === value && 'is-selected')} aria-pressed={form.userType === value} onClick={() => setForm({ ...form, userType: value })}>
              <Icon /><span><strong>{title}</strong><small>{note}</small></span>{form.userType === value && <Check className="auth-mode-check" />}
            </button>
          ))}
        </fieldset>
        {error && <div className="ui-alert is-danger" role="alert"><AlertCircle /><span>{error}</span></div>}
        <label className="ui-field"><span>Full name</span><input className="ui-input" autoComplete="name" value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} minLength={2} maxLength={100} required /></label>
        <label className="ui-field"><span>Email address</span><input className="ui-input" type="email" autoComplete="email" value={form.email} onChange={event => setForm({ ...form, email: event.target.value })} required /></label>
        <label className="ui-field"><span>Password</span>
          <div className="ui-input-group auth-password">
            <input className="ui-input" type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={form.password} onChange={event => setForm({ ...form, password: event.target.value })} minLength={10} maxLength={128} required aria-describedby="password-rules" />
            <button type="button" className="ui-icon-btn" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff /> : <Eye />}</button>
          </div>
          <span id="password-rules" className="auth-rules">{rules.map(rule => <span key={rule.label} className={rule.test(form.password) ? 'is-met' : ''}><Check />{rule.label}</span>)}</span>
        </label>
        <button className="ui-btn ui-btn-lg ui-btn-block" type="submit" disabled={loading}>{loading ? <><Spinner /> Creating your space…</> : <>Continue to setup <ArrowRight /></>}</button>
      </form>
      <p className="auth-terms">By continuing you agree to the <Link href="/terms" className="ui-link">terms</Link> and acknowledge the <Link href="/privacy" className="ui-link">privacy notice</Link>. Arogya provides educational guidance — not diagnosis or emergency care.</p>
      <p className="auth-switch">Already have an account? <Link href="/auth/signin" className="ui-link">Sign in</Link></p>
    </AuthFrame>
  )
}
