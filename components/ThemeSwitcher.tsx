'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

export default function ThemeSwitcher() {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <div className="as-theme-switcher" role="group" aria-label="Colour theme">
      <button
        type="button"
        className={resolvedTheme === 'light' ? 'is-active' : ''}
        onClick={() => setTheme('light')}
        aria-label="Use light theme"
        aria-pressed={resolvedTheme === 'light'}
        title="Light theme"
      >
        <Sun aria-hidden="true" />
      </button>
      <button
        type="button"
        className={resolvedTheme === 'dark' ? 'is-active' : ''}
        onClick={() => setTheme('dark')}
        aria-label="Use dark theme"
        aria-pressed={resolvedTheme === 'dark'}
        title="Dark theme"
      >
        <Moon aria-hidden="true" />
      </button>
    </div>
  )
}
