'use client'

import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export default function RouteLoader() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)
  const startedAt = useRef(0)
  const fallback = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const link = (event.target as HTMLElement).closest('a')
      if (!link || link.target === '_blank' || link.hasAttribute('download')) return
      const url = new URL(link.href, window.location.href)
      if (url.origin !== window.location.origin || `${url.pathname}${url.search}` === `${window.location.pathname}${window.location.search}`) return

      startedAt.current = performance.now()
      setVisible(true)
      if (fallback.current) clearTimeout(fallback.current)
      fallback.current = setTimeout(() => setVisible(false), 1_800)
    }

    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [])

  useEffect(() => {
    if (!startedAt.current) return
    const elapsed = performance.now() - startedAt.current
    const timer = setTimeout(() => {
      setVisible(false)
      startedAt.current = 0
      if (fallback.current) clearTimeout(fallback.current)
    }, Math.max(80, 280 - elapsed))
    return () => clearTimeout(timer)
  }, [pathname])

  return (
    <div className={`as-route-loader ${visible ? 'is-visible' : ''}`} aria-hidden={!visible} aria-live="polite">
      <div className="as-loader-stage">
        <span className="as-loader-orbit" aria-hidden="true" />
        <Image src="/arogya-mark.png" alt="" width={54} height={54} priority />
      </div>
      <span className="sr-only">Opening page</span>
    </div>
  )
}
