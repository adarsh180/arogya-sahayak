import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { useEffect, useState } from 'react'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

interface ToastProps {
    id: string
    message: string
    type: ToastType
    duration?: number
    onUndo?: () => void
    onClose: (id: string) => void
}

export function Toast({ id, message, type, duration = 5000, onUndo, onClose }: ToastProps) {
    const [progress, setProgress] = useState(100)

    useEffect(() => {
        const startTime = Date.now()
        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime
            const remaining = Math.max(0, 100 - (elapsed / duration) * 100)
            setProgress(remaining)

            if (remaining === 0) {
                onClose(id)
            }
        }, 50)

        return () => clearInterval(interval)
    }, [duration, id, onClose])

    const icons = {
        success: CheckCircle,
        error: AlertCircle,
        info: Info,
        warning: AlertTriangle
    }

    const colors = {
        success: 'bg-green-500/20 border-green-500/30 text-green-400',
        error: 'bg-red-500/20 border-red-500/30 text-red-400',
        info: 'bg-blue-500/20 border-blue-500/30 text-blue-400',
        warning: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400'
    }

    const Icon = icons[type]

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            className={`relative flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-sm shadow-lg min-w-[300px] max-w-md ${colors[type]}`}
        >
            <Icon className="w-5 h-5 flex-shrink-0" />
            <p className="flex-1 text-sm text-zinc-100">{message}</p>

            {onUndo && (
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                        onUndo()
                        onClose(id)
                    }}
                    className="px-3 py-1 text-xs font-medium bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                >
                    Undo
                </motion.button>
            )}

            <button
                onClick={() => onClose(id)}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
                <X className="w-4 h-4" />
            </button>

            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 rounded-b-xl overflow-hidden">
                <motion.div
                    className="h-full bg-white/30"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </motion.div>
    )
}

interface ToastContainerProps {
    toasts: Array<{
        id: string
        message: string
        type: ToastType
        onUndo?: () => void
    }>
    onClose: (id: string) => void
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <Toast key={toast.id} {...toast} onClose={onClose} />
                ))}
            </AnimatePresence>
        </div>
    )
}

// Hook for using toasts
export function useToast() {
    const [toasts, setToasts] = useState<Array<{
        id: string
        message: string
        type: ToastType
        onUndo?: () => void
    }>>([])

    const addToast = (message: string, type: ToastType = 'info', onUndo?: () => void) => {
        const id = Date.now().toString()
        setToasts(prev => [...prev, { id, message, type, onUndo }])
    }

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id))
    }

    return {
        toasts,
        addToast,
        removeToast,
        success: (message: string, onUndo?: () => void) => addToast(message, 'success', onUndo),
        error: (message: string) => addToast(message, 'error'),
        info: (message: string) => addToast(message, 'info'),
        warning: (message: string) => addToast(message, 'warning')
    }
}
