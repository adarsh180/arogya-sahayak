'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { originOf } from '@/components/theme-shift'

/** A clay coin: the sun rises in light mode, the moon in dark. The new theme opens in a circle from it. */
export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const dark = resolvedTheme === 'dark'

  return (
    <button
      type="button"
      className={`ui-theme-coin ${dark ? 'is-dark' : ''}`}
      onClick={event => setTheme(dark ? 'light' : 'dark', originOf(event.currentTarget))}
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={dark ? 'Light theme' : 'Dark theme'}
    >
      <Sun className="is-sun" aria-hidden="true" />
      <Moon className="is-moon" aria-hidden="true" />
    </button>
  )
}
