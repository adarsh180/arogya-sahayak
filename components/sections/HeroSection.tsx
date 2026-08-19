'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Sparkles, Heart } from 'lucide-react'
import { FloatingOrb, MagneticButton, GlassCard } from '@/components/ui/DesignSystem'

const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.1,
            duration: 0.6,
            ease: [0.4, 0, 0.2, 1],
        },
    }),
}

const floatingUI = {
    initial: { y: 0, rotate: -2 },
    animate: {
        y: [-10, 10, -10],
        rotate: [-2, 2, -2],
        transition: {
            y: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
            },
            rotate: {
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
            },
        },
    },
}

export default function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center overflow-hidden">
            {/* Aurora Gradient Orbs */}
            <FloatingOrb color="purple" size="lg" className="absolute -right-48 -top-48" delay={0} />
            <FloatingOrb color="cyan" size="md" className="absolute -left-32 bottom-32" delay={1} />
            <FloatingOrb color="purple" size="sm" className="absolute right-1/4 bottom-0" delay={2} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Left Column - Content */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        className="space-y-8"
                    >
                        {/* Badge */}
                        <motion.div custom={0} variants={fadeInUp} className="inline-block">
                            <GlassCard className="inline-flex items-center gap-2 px-4 py-2 text-sm">
                                <Sparkles className="w-4 h-4 text-cyan-400" />
                                <span className="text-zinc-300">
                                    India's Most Advanced Medical AI
                                </span>
                            </GlassCard>
                        </motion.div>

                        {/* Heading */}
                        <motion.div custom={1} variants={fadeInUp} className="space-y-6">
                            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-normal leading-[1.1] text-zinc-50">
                                Your Health,{' '}
                                <span className="italic text-gradient-aurora">
                                    intelligently
                                </span>
                                <br />
                                simplified
                            </h1>

                            <p className="text-xl lg:text-2xl text-zinc-400 leading-relaxed max-w-xl">
                                AI-powered medical guidance in{' '}
                                <span className="text-cyan-400 font-medium">29+ Indian languages</span>
                                . From symptom analysis to medical education, healthcare reimagined.
                            </p>
                        </motion.div>

                        {/* CTA Buttons */}
                        <motion.div
                            custom={2}
                            variants={fadeInUp}
                            className="flex flex-col sm:flex-row gap-4"
                        >
                            <Link href="/dashboard">
                                <MagneticButton variant="primary" className="group">
                                    <span className="flex items-center gap-2">
                                        Start Your Health Journey
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </MagneticButton>
                            </Link>

                            <Link href="/chat">
                                <MagneticButton variant="secondary" className="group">
                                    <span className="flex items-center gap-2">
                                        <Heart className="w-5 h-5 text-cyan-400" />
                                        Try AI Assistant
                                    </span>
                                </MagneticButton>
                            </Link>
                        </motion.div>

                        {/* Trust Indicators */}
                        <motion.div
                            custom={3}
                            variants={fadeInUp}
                            className="flex flex-wrap gap-6 pt-6"
                        >
                            {[
                                { label: '10,000+', sublabel: 'Active Users' },
                                { label: '29+', sublabel: 'Languages' },
                                { label: '24/7', sublabel: 'Available' },
                            ].map((stat, i) => (
                                <div key={i} className="space-y-1">
                                    <div className="text-2xl font-bold text-gradient-aurora">
                                        {stat.label}
                                    </div>
                                    <div className="text-sm text-zinc-500 uppercase tracking-wide">
                                        {stat.sublabel}
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Right Column - Floating UI Mockup */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        custom={4}
                        variants={fadeInUp}
                        className="relative lg:block hidden"
                    >
                        <motion.div
                            variants={floatingUI}
                            initial="initial"
                            animate="animate"
                            className="relative"
                        >
                            <GlassCard variant="strong" className="p-6 space-y-4 shadow-2xl">
                                {/* Mock Chat Header */}
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center">
                                        <Heart className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-zinc-100">Arogya AI</div>
                                        <div className="text-xs text-zinc-500">Medical Assistant</div>
                                    </div>
                                    <div className="ml-auto">
                                        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                                    </div>
                                </div>

                                {/* Mock Messages */}
                                <div className="space-y-3">
                                    {/* User Message */}
                                    <div className="flex justify-end">
                                        <div className="bg-purple-500/20 border border-purple-500/30 rounded-2xl rounded-tr-sm px-4 py-3 max-w-[80%]">
                                            <p className="text-sm text-zinc-200">
                                                What are the symptoms of diabetes?
                                            </p>
                                        </div>
                                    </div>

                                    {/* AI Message */}
                                    <div className="flex">
                                        <GlassCard className="p-4 max-w-[90%] space-y-2">
                                            <p className="text-sm text-zinc-300 leading-relaxed">
                                                Diabetes symptoms include increased thirst, frequent urination, and unexplained weight loss.
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                <span className="medical-pill text-xs">Hyperglycemia</span>
                                                <span className="medical-pill text-xs">Type 2 Diabetes</span>
                                            </div>
                                        </GlassCard>
                                    </div>

                                    {/* Typing Indicator */}
                                    <div className="flex items-center gap-2 text-zinc-500">
                                        <div className="flex gap-1">
                                            <div className="w-2 h-2 rounded-full bg-zinc-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <div className="w-2 h-2 rounded-full bg-zinc-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <div className="w-2 h-2 rounded-full bg-zinc-600 animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                        <span className="text-xs">AI is thinking...</span>
                                    </div>
                                </div>

                                {/* Mock Input */}
                                <div className="glass-card rounded-full px-4 py-3 flex items-center gap-2">
                                    <input
                                        type="text"
                                        placeholder="Ask anything medical..."
                                        className="flex-1 bg-transparent text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none"
                                        disabled
                                    />
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center">
                                        <ArrowRight className="w-4 h-4 text-white" />
                                    </div>
                                </div>
                            </GlassCard>

                            {/* Decorative Elements */}
                            <div className="absolute -z-10 inset-0 bg-gradient-to-br from-purple-500/20 to-cyan-400/20 blur-3xl rounded-full" />
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
