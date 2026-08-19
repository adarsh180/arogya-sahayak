import Image from 'next/image'
import Link from 'next/link'
import { Check, ShieldCheck } from 'lucide-react'

export default function AuthFrame({ eyebrow, title, description, children }: {
  eyebrow: string
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <main id="main-content" className="as-auth-page">
      <section className="as-auth-story">
        <Link href="/" className="as-auth-brand" aria-label="Arogya Sahayak home">
          <Image src="/arogya-mark.png" alt="" width={46} height={46} priority />
          <span><strong>Arogya</strong> Sahayak</span>
        </Link>
        <div className="as-auth-story-copy">
          <span>Designed around a simple promise</span>
          <blockquote>“Good health technology should make the next step feel understandable.”</blockquote>
          <ul>
            <li><Check /> Clear medical boundaries</li>
            <li><Check /> Evidence provenance when available</li>
            <li><Check /> Patient and learner workspaces</li>
          </ul>
        </div>
        <div className="as-auth-safety"><ShieldCheck /><span><strong>Emergency?</strong> Call India’s 112 service. Do not wait for an AI response.</span></div>
      </section>
      <section className="as-auth-panel">
        <div className="as-auth-card">
          <span className="as-kicker">{eyebrow}</span>
          <h1>{title}</h1>
          <p>{description}</p>
          {children}
        </div>
      </section>
    </main>
  )
}
