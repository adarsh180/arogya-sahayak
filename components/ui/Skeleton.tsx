import { motion } from 'framer-motion'

interface SkeletonProps {
    className?: string
    variant?: 'text' | 'circular' | 'rectangular'
    width?: string | number
    height?: string | number
}

export function Skeleton({
    className = '',
    variant = 'rectangular',
    width,
    height
}: SkeletonProps) {
    const baseClass = "bg-zinc-800/50 animate-pulse relative overflow-hidden"

    const variantClass = {
        text: "h-4 rounded",
        circular: "rounded-full",
        rectangular: "rounded-xl"
    }[variant]

    const style = {
        width: width || '100%',
        height: height || (variant === 'text' ? '1rem' : variant === 'circular' ? '3rem' : '8rem')
    }

    return (
        <div
            className={`${baseClass} ${variantClass} ${className}`}
            style={style}
        >
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-700/30 to-transparent"
                animate={{
                    x: ['-100%', '100%']
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear"
                }}
            />
        </div>
    )
}

export function CardSkeleton() {
    return (
        <div className="bg-[#1a1a1a] border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
                <Skeleton variant="text" width="40%" />
                <Skeleton variant="circular" width={40} height={40} />
            </div>
            <Skeleton variant="text" width="60%" className="mb-2" />
            <Skeleton variant="text" width="80%" />
        </div>
    )
}

export function StatCardSkeleton() {
    return (
        <div className="bg-[#1a1a1a] border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-2">
                <Skeleton variant="text" width="50%" height={12} />
                <Skeleton variant="circular" width={32} height={32} />
            </div>
            <Skeleton variant="text" width="40%" height={32} />
        </div>
    )
}

export function MessageSkeleton() {
    return (
        <div className="flex items-start gap-3">
            <Skeleton variant="circular" width={32} height={32} />
            <div className="flex-1 space-y-2">
                <Skeleton variant="text" width="90%" />
                <Skeleton variant="text" width="70%" />
                <Skeleton variant="text" width="85%" />
            </div>
        </div>
    )
}
