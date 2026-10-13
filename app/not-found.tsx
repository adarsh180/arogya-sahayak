import Link from 'next/link'
import { ArrowLeft, LifeBuoy } from 'lucide-react'

export default function NotFound() {
  return (
    <main id="main-content" className="err-page">
      <div>
        <span className="err-code">404</span>
        <h1>This page doesn’t exist.</h1>
        <p>The link may be old, or the page may have moved. Everything you saved is still in your workspace.</p>
        <div className="home-hero-actions">
          <Link href="/" className="ui-btn"><ArrowLeft /> Back to home</Link>
          <Link href="/help" className="ui-btn ui-btn-secondary"><LifeBuoy /> Help centre</Link>
        </div>
      </div>
    </main>
  )
}
