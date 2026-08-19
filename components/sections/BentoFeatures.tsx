'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
    Globe,
    Brain,
    Shield,
    TrendingUp,
    GraduationCap,
    Phone,
    ArrowRight,
    Sparkles,
    Activity
} from 'lucide-react'
import { BentoGrid, BentoItem, GlassCard } from '@/components/ui/DesignSystem'

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.1,
            duration: 0.5,
            ease: [0.4, 0, 0.2, 1],
        },
    }),
}

export default function BentoFeatures() {
    return (
        <section className="relative py-20 lg:py-32 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="text-center mb-16 lg:mb-20"
                >
                    <motion.div custom={0} variants={fadeInUp} className="inline-block mb-4">
                        <GlassCard className="inline-flex items-center gap-2 px-4 py-2 text-sm">
                            <Sparkles className="w-4 h-4 text-emerald-400" />
                            <span className="text-zinc-400">
                                Comprehensive Healthcare Solutions
                            </span>
                        </GlassCard>
                    </motion.div>

                    <motion.h2
                        custom={1}
                        variants={fadeInUp}
                        className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal text-zinc-50 mb-6"
                    >
                        Built for{' '}
                        <span className="italic text-gradient-aurora">
                            India's diversity
                        </span>
                    </motion.h2>

                    <motion.p
                        custom={2}
                        variants={fadeInUp}
                        className="text-xl text-zinc-400 max-w-3xl mx-auto"
                    >
                        From bustling cities to remote villages, healthcare guidance in every language, anytime, anywhere.
                    </motion.p>
                </motion.div>

                {/* Bento Grid */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
                >
                    {/* Large Cell - Multilingual Support */}
                    <motion.div custom={0} variants={fadeInUp} className="md:col-span-2">
                        <BentoItem className="relative overflow-hidden h-full min-h-[320px] group">
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500/20 to-emerald-500/20 border border-sky-500/30 flex items-center justify-center">
                                        <Globe className="w-6 h-6 text-sky-400" />
                                    </div>
                                    <Link href="/chat" className="text-zinc-400 hover:text-zinc-200 transition-colors">
                                        <ArrowRight className="w-5 h-5" />
                                    </Link>
                                </div>

                                <h3 className="font-serif text-2xl md:text-3xl font-semibold text-zinc-100 mb-3">
                                    29+ Indian Languages
                                </h3>
                                <p className="text-zinc-400 text-base leading-relaxed mb-6">
                                    Speak in your mother tongue. Our AI understands Hindi, Bengali, Tamil, Telugu, and 25+ other regional languages.
                                </p>

                                {/* India Map Visualization */}
                                <div className="mt-auto relative">
                                    <div className="flex flex-wrap gap-2">
                                        {['हिंदी', 'বাংলা', 'தமிழ்', 'తెలుగు', 'मराठी', 'ગુજરાતી', 'ಕನ್ನಡ', 'മലയാളം'].map((lang, i) => (
                                            <motion.span
                                                key={lang}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                whileInView={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: i * 0.1 }}
                                                className="px-3 py-1 rounded-full text-sm bg-zinc-800/50 border border-zinc-700/50 text-zinc-300"
                                            >
                                                {lang}
                                            </motion.span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Background Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </BentoItem>
                    </motion.div>

                    {/* Tall Cell - AI Diagnosis */}
                    <motion.div custom={1} variants={fadeInUp} className="md:row-span-2">
                        <BentoItem className="relative overflow-hidden h-full min-h-[320px] md:min-h-[664px] group">
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-sky-500/20 border border-emerald-500/30 flex items-center justify-center">
                                        <Brain className="w-6 h-6 text-emerald-400" />
                                    </div>
                                    <Link href="/chat" className="text-zinc-400 hover:text-zinc-200 transition-colors">
                                        <ArrowRight className="w-5 h-5" />
                                    </Link>
                                </div>

                                <h3 className="font-serif text-2xl md:text-3xl font-semibold text-zinc-100 mb-3">
                                    AI-Powered Analysis
                                </h3>
                                <p className="text-zinc-400 text-base leading-relaxed mb-8">
                                    Upload medical reports, describe symptoms, or ask health questions. Our AI provides instant, accurate guidance.
                                </p>

                                {/* Scanning Animation */}
                                <div className="mt-auto relative h-32 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 overflow-hidden">
                                    <motion.div
                                        className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent"
                                        animate={{
                                            y: [0, 120, 0],
                                        }}
                                        transition={{
                                            duration: 3,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                        }}
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Activity className="w-8 h-8 text-zinc-700" />
                                    </div>
                                </div>
                            </div>

                            {/* Background Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </BentoItem>
                    </motion.div>

                    {/* Privacy First */}
                    <motion.div custom={2} variants={fadeInUp}>
                        <BentoItem className="relative overflow-hidden h-full min-h-[240px] group">
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500/20 to-emerald-500/20 border border-sky-500/30 flex items-center justify-center relative">
                                        <Shield className="w-6 h-6 text-sky-400" />
                                        <div className="absolute inset-0 rounded-2xl bg-sky-500/20 blur-xl animate-pulse" />
                                    </div>
                                </div>

                                <h3 className="font-serif text-xl md:text-2xl font-semibold text-zinc-100 mb-3">
                                    Privacy First
                                </h3>
                                <p className="text-zinc-400 text-sm leading-relaxed">
                                    HIPAA compliant. Your medical data is encrypted and never shared.
                                </p>
                            </div>
                        </BentoItem>
                    </motion.div>

                    {/* Health Tracking */}
                    <motion.div custom={3} variants={fadeInUp}>
                        <BentoItem className="relative overflow-hidden h-full min-h-[240px] group">
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-sky-500/20 border border-emerald-500/30 flex items-center justify-center">
                                        <TrendingUp className="w-6 h-6 text-emerald-400" />
                                    </div>
                                    <Link href="/health-tracker" className="text-zinc-400 hover:text-zinc-200 transition-colors">
                                        <ArrowRight className="w-5 h-5" />
                                    </Link>
                                </div>

                                <h3 className="font-serif text-xl md:text-2xl font-semibold text-zinc-100 mb-3">
                                    Health Tracking
                                </h3>
                                <p className="text-zinc-400 text-sm leading-relaxed">
                                    Monitor BMI, blood pressure, glucose levels with AI-powered insights.
                                </p>
                            </div>
                        </BentoItem>
                    </motion.div>

                    {/* Student Hub */}
                    <motion.div custom={4} variants={fadeInUp}>
                        <BentoItem className="relative overflow-hidden h-full min-h-[240px] group">
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500/20 to-emerald-500/20 border border-sky-500/30 flex items-center justify-center">
                                        <GraduationCap className="w-6 h-6 text-sky-400" />
                                    </div>
                                    <Link href="/student" className="text-zinc-400 hover:text-zinc-200 transition-colors">
                                        <ArrowRight className="w-5 h-5" />
                                    </Link>
                                </div>

                                <h3 className="font-serif text-xl md:text-2xl font-semibold text-zinc-100 mb-3">
                                    Student Corner
                                </h3>
                                <p className="text-zinc-400 text-sm leading-relaxed">
                                    NEET/AIIMS preparation with AI tutoring and mock tests.
                                </p>
                            </div>
                        </BentoItem>
                    </motion.div>

                    {/* Emergency Services */}
                    <motion.div custom={5} variants={fadeInUp}>
                        <BentoItem className="relative overflow-hidden h-full min-h-[240px] group">
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30 flex items-center justify-center">
                                        <Phone className="w-6 h-6 text-red-400" />
                                    </div>
                                    <Link href="/emergency" className="text-zinc-400 hover:text-zinc-200 transition-colors">
                                        <ArrowRight className="w-5 h-5" />
                                    </Link>
                                </div>

                                <h3 className="font-serif text-xl md:text-2xl font-semibold text-zinc-100 mb-3">
                                    Emergency Contacts
                                </h3>
                                <p className="text-zinc-400 text-sm leading-relaxed">
                                    Quick access to hospitals, ambulances, and trusted doctors.
                                </p>
                            </div>
                        </BentoItem>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}
