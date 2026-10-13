'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertCircle, RotateCcw } from 'lucide-react'

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error) }, [error])

  return (
    <main id="main-content" className="err-page">
      <div>
        <span className="ui-empty-icon"><AlertCircle /></span>
        <span className="ui-kicker is-plain">Something interrupted this page</span>
        <h1>Your information is safe.</h1>
        <p>Try loading the page again. If it keeps happening, go back to your overview{error.digest ? ` and mention reference ${error.digest} when you contact us` : ''}.</p>
        <div className="home-hero-actions">
          <button type="button" className="ui-btn" onClick={reset}><RotateCcw /> Try again</button>
          <Link className="ui-btn ui-btn-secondary" href="/dashboard">Go to overview</Link>
        </div>
      </div>
    </main>
  )
}
