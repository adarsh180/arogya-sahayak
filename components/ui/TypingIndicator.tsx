import { motion } from 'framer-motion'

export function TypingIndicator() {
    return (
        <div className="flex items-center gap-2 px-4 py-3 max-w-fit">
            <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        className="w-2 h-2 bg-zinc-600 rounded-full"
                        animate={{
                            y: [0, -8, 0],
                            opacity: [0.5, 1, 0.5]
                        }}
                        transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: i * 0.2
                        }}
                    />
                ))}
            </div>
            <span className="text-sm text-zinc-500 ml-2">AI is thinking...</span>
        </div>
    )
}
