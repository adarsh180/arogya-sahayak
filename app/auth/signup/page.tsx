'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { ArrowRight, BookOpen, Check, Eye, EyeOff, HeartPulse } from 'lucide-react'
import AuthFrame from '@/components/auth/AuthFrame'

export default function SignUpPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '', userType: 'patient' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const validPassword = form.password.length >= 10 && /[a-z]/.test(form.password) && /[A-Z]/.test(form.password) && /\d/.test(form.password)

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (!validPassword) return setError('Use at least 10 characters with uppercase, lowercase and a number.')
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/auth/signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'We could not create this account.')
      const result = await signIn('credentials', { email: form.email, password: form.password, redirect: false })
      if (result?.error) throw new Error('Your account was created. Please sign in to continue.')
      router.push('/onboarding')
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'We could not create this account.')
      setLoading(false)
    }
  }

  return (
    <AuthFrame eyebrow="Your space, your pace" title="Begin with what matters to you." description="Choose a starting mode. You can switch between personal health and medical learning at any time.">
      <form className="as-auth-form" onSubmit={submit}>
        <fieldset className="as-mode-picker"><legend>I want to start with</legend><button type="button" className={form.userType === 'patient' ? 'is-selected' : ''} onClick={() => setForm({ ...form, userType: 'patient' })}><HeartPulse /><span><strong>My health</strong>Track and prepare</span>{form.userType === 'patient' && <Check />}</button><button type="button" className={form.userType === 'student' ? 'is-selected' : ''} onClick={() => setForm({ ...form, userType: 'student' })}><BookOpen /><span><strong>Medical learning</strong>Recall and reason</span>{form.userType === 'student' && <Check />}</button></fieldset>
        {error && <div className="as-form-error" role="alert">{error}</div>}
        <label><span>Full name</span><input type="text" autoComplete="name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} minLength={2} maxLength={100} required /></label>
        <label><span>Email address</span><input type="email" autoComplete="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required /></label>
        <label><span>Password</span><div className="as-password-field"><input type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} minLength={10} required /><button type="button" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff /> : <Eye />}</button></div><small className={validPassword ? 'is-valid' : ''}>10+ characters · uppercase · lowercase · number</small></label>
        <button className="as-button as-auth-submit" type="submit" disabled={loading}>{loading ? 'Creating your space…' : <>Continue to setup <ArrowRight /></>}</button>
      </form>
      <p className="as-auth-terms">By continuing, you acknowledge that this product provides educational guidance—not diagnosis or emergency care.</p>
      <p className="as-auth-switch">Already have an account? <Link href="/auth/signin">Sign in</Link></p>
    </AuthFrame>
  )
}
