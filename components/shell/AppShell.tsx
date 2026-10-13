'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import {
  Activity, BookA, CalendarDays, ClipboardCheck, FileSearch, GraduationCap, LayoutDashboard,
  LifeBuoy, LineChart, LogOut, Menu, MessageSquareText, Pill, Siren, X
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import Brand from './Brand'
import ThemeToggle from './ThemeToggle'
import { BrandLoader, cx } from '@/components/ui/kit'

type NavItem = { href: string; label: string; icon: LucideIcon; emergency?: boolean }

const groups: Array<{ label: string; items: NavItem[] }> = [
  {
    label: 'Care',
    items: [
      { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
      { href: '/chat', label: 'Ask Arogya', icon: MessageSquareText },
      { href: '/health-tracker', label: 'Measurements', icon: Activity },
      { href: '/medicine-reminder', label: 'Medicines', icon: Pill },
      { href: '/emergency', label: 'Emergency', icon: Siren, emergency: true },
    ],
  },
  {
    label: 'Library',
    items: [
      { href: '/medical-dictionary', label: 'Dictionary', icon: BookA },
      { href: '/resources', label: 'Evidence', icon: FileSearch },
    ],
  },
  {
    label: 'Learn',
    items: [
      { href: '/student', label: 'Learning hub', icon: GraduationCap },
      { href: '/mock-tests', label: 'Mock tests', icon: ClipboardCheck },
      { href: '/study-planner', label: 'Study planner', icon: CalendarDays },
      { href: '/analytics', label: 'Progress', icon: LineChart },
    ],
  },
]

const tabs: NavItem[] = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/chat', label: 'Ask', icon: MessageSquareText },
  { href: '/health-tracker', label: 'Track', icon: Activity },
  { href: '/student', label: 'Learn', icon: GraduationCap },
]

function isActive(pathname: string, href: string) {
  if (href === '/student') return pathname === '/student'
  return pathname === href || pathname.startsWith(`${href}/`)
}

export default function AppShell({ children, flush = false, loadingLabel }: { children: React.ReactNode; flush?: boolean; loadingLabel?: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session, status } = useSession()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') router.replace(`/auth/signin?callbackUrl=${encodeURIComponent(pathname)}`)
  }, [pathname, router, status])

  useEffect(() => { setOpen(false) }, [pathname])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  if (status !== 'authenticated') return <BrandLoader screen label={loadingLabel || 'Opening your space'} />

  const name = session.user.name || session.user.email || 'You'
  const initials = name.split(/[\s@.]+/).filter(Boolean).slice(0, 2).map(part => part[0]?.toUpperCase()).join('')

  return (
    <div className="ui-app">
      <aside className={cx('ui-sidebar', open && 'is-open')} aria-label="Workspace navigation">
        <div className="ui-sidebar-top">
          <Brand href="/dashboard" tagline={session.user.userType === 'student' ? 'Learning workspace' : 'Personal health space'} />
          <button type="button" className="ui-icon-btn ui-sidebar-close" onClick={() => setOpen(false)} aria-label="Close navigation"><X /></button>
        </div>
        <nav className="ui-sidebar-scroll">
          {groups.map(group => (
            <div className="ui-nav-group" key={group.label}>
              <span>{group.label}</span>
              {group.items.map(({ href, label, icon: Icon, emergency }) => {
                const active = isActive(pathname, href)
                return (
                  <Link key={href} href={href} className={cx('ui-nav-link', active && 'is-active', emergency && 'is-emergency')} aria-current={active ? 'page' : undefined}>
                    <Icon aria-hidden="true" />{label}{emergency && <span className="ui-nav-tag">112</span>}
                  </Link>
                )
              })}
            </div>
          ))}
          <div className="ui-nav-group">
            <span>Support</span>
            <Link href="/help" className="ui-nav-link"><LifeBuoy aria-hidden="true" />Help centre</Link>
          </div>
        </nav>
        <div className="ui-sidebar-foot">
          <Link href="/profile" className="ui-user" aria-current={pathname === '/profile' ? 'page' : undefined}>
            <span className="ui-avatar" aria-hidden="true">{initials || 'A'}</span>
            <span className="ui-user-text"><strong>{session.user.name || 'Your profile'}</strong><small>{session.user.email}</small></span>
          </Link>
          <div className="ui-sidebar-actions">
            <ThemeToggle />
            <button type="button" className="ui-btn ui-btn-ghost ui-btn-sm" onClick={() => signOut({ callbackUrl: '/' })}><LogOut /> Sign out</button>
          </div>
        </div>
      </aside>
      <button type="button" className={cx('ui-drawer-scrim', open && 'is-open')} onClick={() => setOpen(false)} aria-label="Close navigation" tabIndex={open ? 0 : -1} />

      <div className="ui-main">
        <header className="ui-topbar">
          <Brand href="/dashboard" tagline={null} />
          <div className="ui-topbar-actions">
            <Link href="/emergency" className="ui-icon-btn" aria-label="Emergency help" style={{ color: 'var(--danger)' }}><Siren /></Link>
            <ThemeToggle />
          </div>
        </header>
        <main id="main-content" className={cx('ui-content', flush && 'is-flush')}>{children}</main>
      </div>

      <nav className="ui-tabbar" aria-label="Quick navigation">
        {tabs.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className={isActive(pathname, href) ? 'is-active' : ''} aria-current={isActive(pathname, href) ? 'page' : undefined}><Icon aria-hidden="true" />{label}</Link>
        ))}
        <button type="button" onClick={() => setOpen(true)} aria-expanded={open} aria-label="Open all sections"><Menu aria-hidden="true" />More</button>
      </nav>
    </div>
  )
}
