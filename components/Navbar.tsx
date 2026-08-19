'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { Activity, BookOpen, ChevronDown, FileSearch, LogOut, Menu, MessageSquareText, UserRound, X } from 'lucide-react'

const appLinks = [
  { href: '/dashboard', label: 'Overview', icon: Activity },
  { href: '/chat', label: 'Ask Arogya', icon: MessageSquareText },
  { href: '/resources', label: 'Evidence', icon: FileSearch },
  { href: '/student', label: 'Learn', icon: BookOpen },
  { href: '/profile', label: 'Profile', icon: UserRound },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <header className="as-nav">
      <div className="as-nav-inner">
        <Link href="/" className="as-brand" aria-label="Arogya Sahayak home">
          <Image src="/arogya-mark.png" alt="" width={38} height={38} className="as-brand-mark" priority />
          <span><strong>Arogya</strong> Sahayak</span>
        </Link>

        <nav className="as-nav-links" aria-label="Primary navigation">
          {session ? appLinks.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className={pathname === href || pathname.startsWith(`${href}/`) ? 'is-active' : ''} aria-current={pathname === href || pathname.startsWith(`${href}/`) ? 'page' : undefined}>
              <Icon aria-hidden="true" />{label}
            </Link>
          )) : (
            <>
              <Link href="/#capabilities">What it does</Link>
              <Link href="/#safety">Safety</Link>
              <Link href="/#students">For students</Link>
            </>
          )}
        </nav>

        <div className="as-nav-actions">
          {session ? (
            <button type="button" className="as-icon-button" onClick={() => signOut({ callbackUrl: '/' })} aria-label="Sign out">
              <LogOut aria-hidden="true" />
            </button>
          ) : (
            <>
              <Link href="/auth/signin" className="as-text-link">Sign in</Link>
              <Link href="/auth/signup" className="as-button as-button-sm">Create account</Link>
            </>
          )}
          <button
            type="button"
            className="as-menu-button"
            aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={open}
            onClick={() => setOpen(value => !value)}
          >
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="as-mobile-menu" aria-label="Mobile navigation">
          {(session ? appLinks : [
            { href: '/#capabilities', label: 'What it does', icon: ChevronDown },
            { href: '/#safety', label: 'Safety', icon: ChevronDown },
            { href: '/#students', label: 'For students', icon: ChevronDown },
          ]).map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}>
              <Icon aria-hidden="true" />{label}
            </Link>
          ))}
          {!session && <><Link href="/auth/signin" onClick={() => setOpen(false)}>Sign in</Link><Link href="/auth/signup" onClick={() => setOpen(false)}>Create account</Link></>}
        </nav>
      )}
    </header>
  )
}
