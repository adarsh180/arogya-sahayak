'use client'

import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { ReactNode } from 'react'

interface TooltipProps {
    children: ReactNode
    content: string
    side?: 'top' | 'right' | 'bottom' | 'left'
    delayDuration?: number
}

export function TooltipProvider({ children }: { children: ReactNode }) {
    return (
        <TooltipPrimitive.Provider delayDuration={200}>
            {children}
        </TooltipPrimitive.Provider>
    )
}

export function Tooltip({ children, content, side = 'top', delayDuration = 200 }: TooltipProps) {
    return (
        <TooltipPrimitive.Root delayDuration={delayDuration}>
            <TooltipPrimitive.Trigger asChild>
                {children}
            </TooltipPrimitive.Trigger>
            <TooltipPrimitive.Portal>
                <TooltipPrimitive.Content
                    side={side}
                    className="bg-zinc-900 border border-zinc-800 text-zinc-100 px-3 py-2 rounded-lg text-sm shadow-lg z-50 animate-in fade-in-0 zoom-in-95"
                    sideOffset={5}
                >
                    {content}
                    <TooltipPrimitive.Arrow className="fill-zinc-800" />
                </TooltipPrimitive.Content>
            </TooltipPrimitive.Portal>
        </TooltipPrimitive.Root>
    )
}
