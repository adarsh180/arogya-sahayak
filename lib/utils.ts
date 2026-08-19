// Utility functions for the app

/**
 * Get personalized greeting based on time of day
 */
export function getGreeting(name?: string): string {
    const hour = new Date().getHours()
    const userName = name ? `, ${name}` : ''

    if (hour < 12) {
        return `Good morning${userName}! 🌅`
    } else if (hour < 17) {
        return `Good afternoon${userName}! ☀️`
    } else if (hour < 22) {
        return `Good evening${userName}! 🌙`
    } else {
        return `Burning the midnight oil${userName}? 🌃`
    }
}

/**
 * Get motivational message based on stats
 */
export function getMotivationalMessage(stats: {
    streak?: number
    score?: number
    improvement?: number
}): string {
    if (stats.streak && stats.streak >= 7) {
        return `You're on fire! 🔥 ${stats.streak}-day study streak!`
    }
    if (stats.score && stats.score >= 85) {
        return `Wow, ${stats.score}%! You're crushing it! 💪`
    }
    if (stats.improvement && stats.improvement > 10) {
        return `Amazing progress! Your score improved by ${stats.improvement}% 📈`
    }
    return "Keep up the great work! Every expert was once a beginner. 🌟"
}

/**
 * Format large numbers with K, M suffixes
 */
export function formatNumber(num: number): string {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
}

/**
 * Get friendly error message
 */
export function getFriendlyError(error: string): string {
    const errorMessages: Record<string, string> = {
        '404': "Oops! This page went on a coffee break ☕",
        '500': "Something went wrong on our end. We're fixing it! 🔧",
        '403': "Hmm, you don't have access to this. Let's go back! 🚪",
        'network': "Looks like your internet is taking a nap 💤",
        'timeout': "This is taking longer than expected... 🐌"
    }

    return errorMessages[error] || "Something unexpected happened. Let's try again! 🔄"
}

/**
 * Get progress message
 */
export function getProgressMessage(completed: number, total: number): string {
    const percentage = (completed / total) * 100

    if (percentage === 100) {
        return "Perfect! You've completed everything! 🎉"
    }
    if (percentage >= 75) {
        return `Almost there! Just ${total - completed} more to go! 🎯`
    }
    if (percentage >= 50) {
        return `Halfway there! Keep going! 💪`
    }
    if (percentage >= 25) {
        return `Great start! You're ${completed}/${total} done! 🚀`
    }
    return `Let's get started! ${total} items to complete. 📝`
}

/**
 * Debounce function for search
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout
    return function executedFunction(...args: Parameters<T>) {
        const later = () => {
            clearTimeout(timeout)
            func(...args)
        }
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
    }
}

/**
 * Copy to clipboard with toast
 */
export async function copyToClipboard(text: string): Promise<boolean> {
    try {
        await navigator.clipboard.writeText(text)
        return true
    } catch (err) {
        console.error('Failed to copy:', err)
        return false
    }
}

/**
 * Format date to relative time (e.g., "2 hours ago")
 */
export function getRelativeTime(date: Date | string): string {
    const now = new Date()
    const then = new Date(date)
    const seconds = Math.floor((now.getTime() - then.getTime()) / 1000)

    if (seconds < 60) return 'just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
    return then.toLocaleDateString()
}
