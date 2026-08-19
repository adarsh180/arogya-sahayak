'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface KeyboardShortcut {
    key: string
    ctrl?: boolean
    shift?: boolean
    alt?: boolean
    action: () => void
    description: string
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            for (const shortcut of shortcuts) {
                const ctrlMatch = !shortcut.ctrl || e.ctrlKey || e.metaKey
                const shiftMatch = !shortcut.shift || e.shiftKey
                const altMatch = !shortcut.alt || e.altKey

                if (
                    e.key === shortcut.key &&
                    ctrlMatch &&
                    shiftMatch &&
                    altMatch
                ) {
                    e.preventDefault()
                    shortcut.action()
                    break
                }
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [shortcuts])
}

export function KeyboardShortcutsProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter()

    const globalShortcuts: KeyboardShortcut[] = [
        {
            key: '/',
            action: () => {
                const searchInput = document.querySelector('input[type="search"], input[placeholder*="Search"]') as HTMLInputElement
                searchInput?.focus()
            },
            description: 'Focus search'
        },
        {
            key: 'k',
            ctrl: true,
            action: () => {
                // Open command palette (you can implement this later)
                console.log('Command palette opened')
            },
            description: 'Open command palette'
        },
        {
            key: 'Escape',
            action: () => {
                // Close modals
                const closeButtons = document.querySelectorAll('[aria-label="Close"]')
                if (closeButtons.length > 0) {
                    (closeButtons[closeButtons.length - 1] as HTMLButtonElement).click()
                }
            },
            description: 'Close modal/dialog'
        },
        {
            key: 'd',
            ctrl: true,
            shift: true,
            action: () => router.push('/dashboard'),
            description: 'Go to dashboard'
        },
        {
            key: 'c',
            ctrl: true,
            shift: true,
            action: () => router.push('/chat'),
            description: 'Go to chat'
        },
        {
            key: 's',
            ctrl: true,
            shift: true,
            action: () => router.push('/student'),
            description: 'Go to student corner'
        }
    ]

    useKeyboardShortcuts(globalShortcuts)

    return <>{children}</>
}
