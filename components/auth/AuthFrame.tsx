import Image from 'next/image'
import { Check, Siren } from 'lucide-react'
import Brand from '@/components/shell/Brand'
import ThemeToggle from '@/components/shell/ThemeToggle'

export default function AuthFrame({ eyebrow, title, description, children }: {
  eyebrow: string
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="auth">
      <aside className="auth-story">
        <Brand />
        <div className="auth-story-body">
          <Image src="/arogya-mark.png" alt="" width={72} height={72} className="auth-story-mark" />
          <blockquote>“Good health technology should make the next step feel understandable.”</blockquote>
          <ul>
            <li><Check /> Clear medical boundaries, every time</li>
            <li><Check /> Sources shown when answers rely on them</li>
            <li><Check /> Personal health and learning in one place</li>
          </ul>
        </div>
        <div className="auth-emergency"><Siren /><span><strong>In an emergency, call 112.</strong> Don’t wait for an AI response.</span></div>
      </aside>
      <main id="main-content" className="auth-panel">
        <div className="auth-panel-top"><span className="auth-mobile-brand"><Brand tagline={null} /></span><ThemeToggle /></div>
        <div className="auth-card">
          <span className="ui-kicker">{eyebrow}</span>
          <h1>{title}</h1>
          <p>{description}</p>
          {children}
        </div>
      </main>
    </div>
  )
}
