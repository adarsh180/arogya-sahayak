'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useRef, useState } from 'react'

function RouteBar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [state, setState] = useState<'idle' | 'active' | 'done'>('idle')
  const fallback = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const link = (event.target as HTMLElement).closest('a')
      if (!link || link.target === '_blank' || link.hasAttribute('download')) return
      const url = new URL(link.href, window.location.href)
      if (url.origin !== window.location.origin) return
      if (url.pathname === window.location.pathname && url.search === window.location.search) return
      setState('active')
      if (fallback.current) clearTimeout(fallback.current)
      fallback.current = setTimeout(() => setState('idle'), 10_000)
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [])

  useEffect(() => {
    setState(current => (current === 'active' ? 'done' : current))
    const timer = setTimeout(() => setState(current => (current === 'done' ? 'idle' : current)), 360)
    return () => clearTimeout(timer)
  }, [pathname, searchParams])

  return (
    <div className={`ui-route-bar ${state === 'active' ? 'is-active' : ''} ${state === 'done' ? 'is-active is-done' : ''}`} aria-hidden="true">
      <i />
    </div>
  )
}

export default function RouteLoader() {
  return <Suspense fallback={null}><RouteBar /></Suspense>
}
