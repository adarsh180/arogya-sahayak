import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import Link from 'next/link'

interface EmptyStateProps {
    icon: LucideIcon
    title: string
    description: string
    actionLabel?: string
    actionHref?: string
    onAction?: () => void
}

export function EmptyState({
    icon: Icon,
    title,
    description,
    actionLabel,
    actionHref,
    onAction
}: EmptyStateProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 px-4 text-center"
        >
            <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="w-20 h-20 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-6"
            >
                <Icon className="w-10 h-10 text-zinc-600" />
            </motion.div>

            <h3 className="text-xl font-semibold text-zinc-200 mb-2">{title}</h3>
            <p className="text-zinc-500 max-w-md mb-6">{description}</p>

            {(actionLabel && (actionHref || onAction)) && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    {actionHref ? (
                        <Link
                            href={actionHref}
                            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl transition-all flex items-center gap-2"
                        >
                            {actionLabel}
                        </Link>
                    ) : (
                        <button
                            onClick={onAction}
                            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl transition-all flex items-center gap-2"
                        >
                            {actionLabel}
                        </button>
                    )}
                </motion.div>
            )}
        </motion.div>
    )
}
