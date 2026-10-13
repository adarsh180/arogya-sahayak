'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import {
  Activity, BookA, CalendarDays, ClipboardCheck, FileSearch, GraduationCap, LayoutDashboard,
  LifeBuoy, LineChart, LogOut, MessageSquareText, Pill, Siren, UserRound
} from 'lucide-react'
import Brand from './Brand'
import ThemeToggle from './ThemeToggle'
import { PageDial, type DialItem } from './PageDial'
import { BrandLoader, cx } from '@/components/ui/kit'

export const appPages: DialItem[] = [
  { href: '/dashboard', label: 'Overview', short: 'Home', icon: LayoutDashboard, group: 'Care' },
  { href: '/chat', label: 'Ask Arogya', short: 'Ask', icon: MessageSquareText, group: 'Care' },
  { href: '/health-tracker', label: 'Measurements', short: 'Track', icon: Activity, group: 'Care' },
  { href: '/medicine-reminder', label: 'Medicines', short: 'Meds', icon: Pill, group: 'Care' },
  { href: '/emergency', label: 'Emergency', short: 'SOS', icon: Siren, group: 'Care' },
  { href: '/medical-dictionary', label: 'Dictionary', short: 'Words', icon: BookA, group: 'Library' },
  { href: '/resources', label: 'Evidence', short: 'Sources', icon: FileSearch, group: 'Library' },
  { href: '/student', label: 'Learning hub', short: 'Learn', icon: GraduationCap, group: 'Learn' },
  { href: '/mock-tests', label: 'Mock tests', short: 'Tests', icon: ClipboardCheck, group: 'Learn' },
  { href: '/study-planner', label: 'Study planner', short: 'Plan', icon: CalendarDays, group: 'Learn' },
  { href: '/analytics', label: 'Progress', short: 'Scores', icon: LineChart, group: 'Learn' },
  { href: '/profile', label: 'Profile', short: 'You', icon: UserRound, group: 'You' },
  { href: '/help', label: 'Help centre', short: 'Help', icon: LifeBuoy, group: 'You' },
]

const tabs = [
  { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { href: '/chat', label: 'Ask', icon: MessageSquareText },
  { href: '/health-tracker', label: 'Track', icon: Activity },
  { href: '/student', label: 'Learn', icon: GraduationCap },
]

const quick = ['/dashboard', '/chat', '/health-tracker', '/medicine-reminder', '/student']

function isActive(pathname: string, href: string) {
  if (href === '/student') return pathname === '/student'
  return pathname === href || pathname.startsWith(`${href}/`)
}

export default function AppShell({ children, flush = false, loadingLabel }: { children: React.ReactNode; flush?: boolean; loadingLabel?: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'unauthenticated') router.replace(`/auth/signin?callbackUrl=${encodeURIComponent(pathname)}`)
  }, [pathname, router, status])

  if (status !== 'authenticated') return <BrandLoader screen label={loadingLabel || 'Opening your space'} />

  const name = session.user.name || session.user.email || 'You'
  const initials = name.split(/[\s@.]+/).filter(Boolean).slice(0, 2).map(part => part[0]?.toUpperCase()).join('')
  const actions = [{ label: 'Sign out', icon: LogOut, onClick: () => signOut({ callbackUrl: '/' }) }]

  return (
    <div className={cx('ui-app', flush && 'is-flush')}>
      <header className="ui-topbar">
        <div className="ui-topbar-inner">
          <Brand href="/dashboard" tagline={session.user.userType === 'student' ? 'Learning space' : 'Personal health space'} />
          <nav className="ui-quick" aria-label="Main sections">
            {appPages.filter(page => quick.includes(page.href)).map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} className={cx('ui-quick-link', isActive(pathname, href) && 'is-active')} aria-current={isActive(pathname, href) ? 'page' : undefined}>
                <Icon aria-hidden="true" />{label}
              </Link>
            ))}
          </nav>
          <div className="ui-topbar-actions">
            <Link href="/emergency" className="ui-sos" aria-label="Emergency help"><Siren aria-hidden="true" /><span>112</span></Link>
            <ThemeToggle />
            <Link href="/profile" className="ui-avatar-coin" aria-label="Your profile" title={name}>{initials || 'A'}</Link>
            <PageDial items={appPages} title="All sections" label="Open the section dial" actions={actions} anchor="top-right" />
          </div>
        </div>
      </header>

      <main id="main-content" className={cx('ui-content', flush && 'is-flush')}>{children}</main>

      <nav className="ui-tabbar" aria-label="Quick navigation">
        {tabs.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className={isActive(pathname, href) ? 'is-active' : ''} aria-current={isActive(pathname, href) ? 'page' : undefined}><Icon aria-hidden="true" />{label}</Link>
        ))}
        <PageDial items={appPages} title="All sections" label="Open the section dial" actions={actions} variant="dock" />
      </nav>
    </div>
  )
}
