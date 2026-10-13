'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <div className="ui-theme-toggle" role="group" aria-label="Colour theme">
      <button type="button" aria-pressed={resolvedTheme === 'light'} onClick={() => setTheme('light')} aria-label="Light theme" title="Light theme"><Sun aria-hidden="true" /></button>
      <button type="button" aria-pressed={resolvedTheme === 'dark'} onClick={() => setTheme('dark')} aria-label="Dark theme" title="Dark theme"><Moon aria-hidden="true" /></button>
    </div>
  )
}
