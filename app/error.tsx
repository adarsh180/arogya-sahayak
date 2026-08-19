'use client'

import Link from 'next/link'
import { AlertCircle, RotateCcw } from 'lucide-react'

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main id="main-content" className="as-error-page"><AlertCircle /><span className="as-kicker">Something interrupted this page</span><h1>Your information is still yours.</h1><p>Try the page again. If the problem continues, return to your overview and avoid repeating a sensitive upload.</p><div><button className="as-button" onClick={reset}><RotateCcw /> Try again</button><Link className="as-button as-button-quiet" href="/dashboard">Return to overview</Link></div></main>
}
