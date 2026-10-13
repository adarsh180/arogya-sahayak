'use client'

import { FormEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getProviders, signIn } from 'next-auth/react'
import { AlertCircle, ArrowRight, Eye, EyeOff, Mail } from 'lucide-react'
import AuthFrame from '@/components/auth/AuthFrame'
import { Spinner } from '@/components/ui/kit'

function nextPath() {
  const next = new URLSearchParams(window.location.search).get('callbackUrl')
  return next?.startsWith('/') && !next.startsWith('//') ? next : '/dashboard'
}

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [googleAvailable, setGoogleAvailable] = useState(false)

  useEffect(() => {
    getProviders().then(providers => setGoogleAvailable(Boolean(providers?.google))).catch(() => setGoogleAvailable(false))
    if (new URLSearchParams(window.location.search).get('error')) setError('Sign-in did not complete. Please try again.')
  }, [])

  async function submit(event: FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError('')
    const result = await signIn('credentials', { email: email.trim(), password, redirect: false })
    if (!result || result.error) {
      setError('That email and password combination was not recognised.')
      setLoading(false)
      return
    }
    router.replace(nextPath())
    router.refresh()
  }

  return (
    <AuthFrame eyebrow="Welcome back" title="Sign in to your space." description="Your readings, medicines, conversations and study progress are right where you left them.">
      <form className="auth-form" onSubmit={submit} noValidate={false}>
        {error && <div className="ui-alert is-danger" role="alert"><AlertCircle /><span>{error}</span></div>}
        <label className="ui-field"><span>Email address</span>
          <div className="ui-input-group"><Mail /><input className="ui-input" type="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} required placeholder="you@example.com" autoFocus /></div>
        </label>
        <label className="ui-field"><span>Password</span>
          <div className="ui-input-group auth-password">
            <input className="ui-input" type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} required />
            <button type="button" className="ui-icon-btn" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff /> : <Eye />}</button>
          </div>
        </label>
        <button className="ui-btn ui-btn-lg ui-btn-block" type="submit" disabled={loading}>{loading ? <><Spinner /> Signing in…</> : <>Sign in <ArrowRight /></>}</button>
      </form>
      {googleAvailable && (
        <>
          <div className="auth-divider"><span>or</span></div>
          <button type="button" className="ui-btn ui-btn-secondary ui-btn-lg ui-btn-block" onClick={() => signIn('google', { callbackUrl: nextPath() })}><GoogleMark /> Continue with Google</button>
        </>
      )}
      <p className="auth-switch">New to Arogya? <Link href="/auth/signup" className="ui-link">Create an account</Link></p>
    </AuthFrame>
  )
}

function GoogleMark() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18"><path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.5-.2-2.2H12v4.3h5.4a4.6 4.6 0 0 1-2 3v2.8h3.3c1.9-1.8 2.9-4.4 2.9-7.9Z"/><path fill="#34A853" d="M12 22c2.7 0 5-.9 6.7-2.4l-3.3-2.7c-.9.6-2 1-3.4 1a5.9 5.9 0 0 1-5.5-4.1H3.1v2.8A10 10 0 0 0 12 22Z"/><path fill="#FBBC05" d="M6.5 13.8A6 6 0 0 1 6.2 12c0-.6.1-1.2.3-1.8V7.4H3.1A10 10 0 0 0 2 12c0 1.6.4 3.1 1.1 4.6l3.4-2.8Z"/><path fill="#EA4335" d="M12 6.1c1.5 0 2.8.5 3.8 1.5l2.9-2.9A9.7 9.7 0 0 0 12 2a10 10 0 0 0-8.9 5.4l3.4 2.8A5.9 5.9 0 0 1 12 6.1Z"/></svg>
}
