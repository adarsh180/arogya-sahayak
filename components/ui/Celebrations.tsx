import { motion } from 'framer-motion'
import Confetti from 'react-confetti'
import { useWindowSize } from '@/hooks/useWindowSize'

interface SuccessCelebrationProps {
    show: boolean
    message: string
    onComplete?: () => void
}

export function SuccessCelebration({ show, message, onComplete }: SuccessCelebrationProps) {
    const { width, height } = useWindowSize()

    if (!show) return null

    return (
        <>
            <Confetti
                width={width}
                height={height}
                recycle={false}
                numberOfPieces={200}
                onConfettiComplete={onComplete}
            />
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            >
                <motion.div
                    initial={{ y: 50 }}
                    animate={{ y: 0 }}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-6 rounded-2xl shadow-2xl"
                >
                    <motion.div
                        animate={{ rotate: [0, -10, 10, -10, 0] }}
                        transition={{ repeat: 2, duration: 0.5 }}
                        className="text-6xl text-center mb-4"
                    >
                        🎉
                    </motion.div>
                    <h2 className="text-2xl font-bold text-center">{message}</h2>
                </motion.div>
            </motion.div>
        </>
    )
}

export function TrophyBounce() {
    return (
        <motion.div
            animate={{
                y: [0, -10, 0],
                rotate: [-5, 5, -5, 0]
            }}
            transition={{
                duration: 0.6,
                repeat: 1
            }}
            className="text-4xl"
        >
            🏆
        </motion.div>
    )
}
