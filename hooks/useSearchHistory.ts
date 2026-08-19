'use client'

import { useState, useEffect } from 'react'

const SEARCH_HISTORY_KEY = 'medical_search_history'
const MAX_HISTORY = 10

export function useSearchHistory() {
    const [history, setHistory] = useState<string[]>([])

    useEffect(() => {
        const saved = localStorage.getItem(SEARCH_HISTORY_KEY)
        if (saved) {
            try {
                setHistory(JSON.parse(saved))
            } catch (e) {
                console.error('Failed to parse search history')
            }
        }
    }, [])

    const addToHistory = (term: string) => {
        if (!term.trim()) return

        const newHistory = [
            term,
            ...history.filter(item => item.toLowerCase() !== term.toLowerCase())
        ].slice(0, MAX_HISTORY)

        setHistory(newHistory)
        localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory))
    }

    const clearHistory = () => {
        setHistory([])
        localStorage.removeItem(SEARCH_HISTORY_KEY)
    }

    const removeItem = (term: string) => {
        const newHistory = history.filter(item => item !== term)
        setHistory(newHistory)
        localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory))
    }

    return {
        history,
        addToHistory,
        clearHistory,
        removeItem
    }
}
