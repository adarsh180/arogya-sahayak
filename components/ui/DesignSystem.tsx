'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface FloatingOrbProps {
    color: 'purple' | 'cyan'
    size?: 'sm' | 'md' | 'lg'
    delay?: number
    duration?: number
    className?: string
}

export function FloatingOrb({ color, size = 'md', delay = 0, duration = 20, className = '' }: FloatingOrbProps) {
    const sizeClasses = {
        sm: 'w-64 h-64',
        md: 'w-96 h-96',
        lg: 'w-[32rem] h-[32rem]',
    }

    const colorClass = color === 'purple' ? 'aurora-orb-purple' : 'aurora-orb-cyan'

    return (
        <motion.div
            className={`aurora-orb ${colorClass} ${sizeClasses[size]} ${className}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
                opacity: [0.1, 0.2, 0.15, 0.1],
                scale: [1, 1.1, 0.9, 1],
            }}
            transition={{
                duration,
                delay,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
            }}
        />
    )
}

interface GlassCardProps {
    children: ReactNode
    className?: string
    variant?: 'default' | 'strong'
    hover?: boolean
}

export function GlassCard({ children, className = '', variant = 'default', hover = false }: GlassCardProps) {
    const baseClass = variant === 'strong' ? 'glass-card-strong' : 'glass-card'
    const hoverClass = hover ? 'hover-lift cursor-pointer' : ''

    return (
        <div className={`${baseClass} ${hoverClass} rounded-3xl ${className}`}>
            {children}
        </div>
    )
}

interface BentoItemProps {
    children: ReactNode
    className?: string
    size?: 'default' | 'large' | 'tall'
}

export function BentoItem({ children, className = '', size = 'default' }: BentoItemProps) {
    const sizeClass = {
        default: '',
        large: 'bento-large',
        tall: 'bento-tall',
    }[size]

    return (
        <div className={`bento-item ${sizeClass} ${className}`}>
            {children}
        </div>
    )
}

export function BentoGrid({ children, className = '' }: { children: ReactNode; className?: string }) {
    return (
        <div className={`bento-grid ${className}`}>
            {children}
        </div>
    )
}

interface MagneticButtonProps {
    children: ReactNode
    variant?: 'primary' | 'secondary'
    className?: string
    onClick?: () => void
    type?: 'button' | 'submit'
    disabled?: boolean
}

export function MagneticButton({
    children,
    variant = 'primary',
    className = '',
    onClick,
    type = 'button'
}: MagneticButtonProps) {
    const variantClass = variant === 'primary' ? 'btn-primary-new' : 'btn-secondary-new'

    return (
        <motion.button
            type={type}
            onClick={onClick}
            className={`${variantClass} ${className}`}
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
        >
            {children}
        </motion.button>
    )
}

interface MedicalPillProps {
    children: ReactNode
    className?: string
}

export function MedicalPill({ children, className = '' }: MedicalPillProps) {
    return (
        <span className={`medical-pill ${className}`}>
            {children}
        </span>
    )
}

interface NoiseTextureProps {
    opacity?: number
}

export function NoiseTexture({ opacity = 0.03 }: NoiseTextureProps) {
    return (
        <div
            className="fixed inset-0 pointer-events-none z-[1]"
            style={{
                opacity,
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='4' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                mixBlendMode: 'overlay',
            }}
        />
    )
}
