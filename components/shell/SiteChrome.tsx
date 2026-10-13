'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { ArrowRight, GraduationCap, Home, LayoutDashboard, LifeBuoy, LogIn, ShieldCheck, Siren, Sparkles, UserPlus } from 'lucide-react'
import { PageDial, type DialItem } from './PageDial'
import Brand from './Brand'
import ThemeToggle from './ThemeToggle'
import { cx } from '@/components/ui/kit'

const links = [
  { href: '/#capabilities', label: 'What it does' },
  { href: '/#safety', label: 'Safety' },
  { href: '/#students', label: 'For students' },
  { href: '/help', label: 'Help' },
]

export function SiteHeader() {
  const { status } = useSession()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const signedIn = status === 'authenticated'
  const dialItems: DialItem[] = [
    { href: '/', label: 'Home', icon: Home, group: 'Explore' },
    { href: '/#capabilities', label: 'What it does', short: 'Features', icon: Sparkles, group: 'Explore' },
    { href: '/#safety', label: 'Safety', icon: ShieldCheck, group: 'Explore' },
    { href: '/#students', label: 'For students', short: 'Learn', icon: GraduationCap, group: 'Explore' },
    { href: '/emergency', label: 'Emergency numbers', short: 'SOS', icon: Siren, group: 'Help' },
    { href: '/help', label: 'Help centre', short: 'Help', icon: LifeBuoy, group: 'Help' },
    ...(signedIn
      ? [{ href: '/dashboard', label: 'Open workspace', short: 'Space', icon: LayoutDashboard, group: 'Account' }]
      : [
          { href: '/auth/signin', label: 'Sign in', icon: LogIn, group: 'Account' },
          { href: '/auth/signup', label: 'Create account', short: 'Join', icon: UserPlus, group: 'Account' },
        ]),
  ]

  return (
    <header className={cx('ui-site-header', scrolled && 'is-scrolled')}>
      <div className="ui-site-header-inner">
        <Brand />
        <nav className="ui-site-nav" aria-label="Primary">
          {links.map(link => <Link key={link.href} href={link.href}>{link.label}</Link>)}
        </nav>
        <div className="ui-site-actions">
          <ThemeToggle />
          {signedIn ? (
            <Link href="/dashboard" className="ui-btn ui-btn-sm is-desktop">Open workspace <ArrowRight /></Link>
          ) : (
            <>
              <Link href="/auth/signin" className="ui-btn ui-btn-ghost ui-btn-sm is-desktop">Sign in</Link>
              <Link href="/auth/signup" className="ui-btn ui-btn-sm is-desktop">Create account</Link>
            </>
          )}
          <span className="ui-site-dial"><PageDial items={dialItems} title="Menu" label="Open the menu dial" anchor="top-right" /></span>
        </div>
      </div>
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className="ui-site-footer">
      <div className="ui-site-footer-inner">
        <div>
          <Brand />
          <p>Evidence-aware health information, everyday organisation and medical learning — designed for India.</p>
        </div>
        <div>
          <h4>Product</h4>
          <nav>
            <Link href="/#capabilities">Capabilities</Link>
            <Link href="/#safety">Safety architecture</Link>
            <Link href="/#students">For medical students</Link>
          </nav>
        </div>
        <div>
          <h4>Support</h4>
          <nav>
            <Link href="/help">Help centre</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/emergency">Emergency numbers</Link>
          </nav>
        </div>
        <div>
          <h4>Policies</h4>
          <nav>
            <Link href="/privacy">Privacy notice</Link>
            <Link href="/terms">Terms of use</Link>
          </nav>
        </div>
      </div>
      <div className="ui-site-footer-base">
        <span>© {new Date().getFullYear()} Arogya Sahayak · Created by Adarsh</span>
        <span>Educational support only — not a diagnosis. In an emergency in India, call 112.</span>
      </div>
    </footer>
  )
}

export function PublicPage({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="ui-public-main">{children}</main>
      <SiteFooter />
    </>
  )
}
