'use client'

import { FormEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getProviders, signIn } from 'next-auth/react'
import { ArrowRight, Eye, EyeOff } from 'lucide-react'
import AuthFrame from '@/components/auth/AuthFrame'

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [googleAvailable, setGoogleAvailable] = useState(false)

  useEffect(() => {
    getProviders()
      .then(providers => setGoogleAvailable(Boolean(providers?.google)))
      .catch(() => setGoogleAvailable(false))
  }, [])

  async function submit(event: FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError('')
    const result = await signIn('credentials', { email, password, redirect: false })
    if (result?.error) {
      setError('That email and password combination was not recognised.')
      setLoading(false)
      return
    }
    const next = new URLSearchParams(window.location.search).get('callbackUrl')
    router.push(next?.startsWith('/') ? next : '/dashboard')
  }

  return (
    <AuthFrame eyebrow="Welcome back" title="Return to your health space." description="Your records, learning sessions and conversations are ready when you are.">
      <form className="as-auth-form" onSubmit={submit}>
        {error && <div className="as-form-error" role="alert">{error}</div>}
        <label><span>Email address</span><input type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" /></label>
        <label><span>Password</span><div className="as-password-field"><input type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} required /><button type="button" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff /> : <Eye />}</button></div></label>
        <button className="as-button as-auth-submit" type="submit" disabled={loading}>{loading ? 'Signing in…' : <>Sign in <ArrowRight /></>}</button>
      </form>
      {googleAvailable && <button type="button" className="as-google-button" onClick={() => signIn('google', { callbackUrl: '/dashboard' })}><GoogleMark /> Continue with Google</button>}
      <p className="as-auth-switch">New to Arogya? <Link href="/auth/signup">Create an account</Link></p>
    </AuthFrame>
  )
}

function GoogleMark() {
  return <svg aria-hidden="true" viewBox="0 0 24 24"><path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.5-.2-2.2H12v4.3h5.4a4.6 4.6 0 0 1-2 3v2.8h3.3c1.9-1.8 2.9-4.4 2.9-7.9Z"/><path fill="#34A853" d="M12 22c2.7 0 5-.9 6.7-2.4l-3.3-2.7c-.9.6-2 1-3.4 1a5.9 5.9 0 0 1-5.5-4.1H3.1v2.8A10 10 0 0 0 12 22Z"/><path fill="#FBBC05" d="M6.5 13.8A6 6 0 0 1 6.2 12c0-.6.1-1.2.3-1.8V7.4H3.1A10 10 0 0 0 2 12c0 1.6.4 3.1 1.1 4.6l3.4-2.8Z"/><path fill="#EA4335" d="M12 6.1c1.5 0 2.8.5 3.8 1.5l2.9-2.9A9.7 9.7 0 0 0 12 2a10 10 0 0 0-8.9 5.4l3.4 2.8A5.9 5.9 0 0 1 12 6.1Z"/></svg>
}
