'use client'

import { useState, useEffect, useRef } from 'react'
import {
    Brain, Target, BookOpen, Zap, Clock, Star, Trophy,
    Play, Pause, RotateCcw, CheckCircle, ArrowRight,
    Lightbulb, MessageCircle, BarChart3, Settings,
    Volume2, VolumeX, Maximize2, Minimize2
} from 'lucide-react'
import { callAI } from '@/lib/ai'

interface StudySession {
    id: string
    topic: string
    subject: string
    difficulty: 'beginner' | 'intermediate' | 'advanced'
    duration: number
    progress: number
    completed: boolean
    score?: number
}

interface StudyModeProps {
    isOpen: boolean
    onClose: () => void
    initialTopic?: string
    initialSubject?: string
}

export default function StudyMode({ isOpen, onClose, initialTopic, initialSubject }: StudyModeProps) {
    const [currentSession, setCurrentSession] = useState<StudySession | null>(null)
    const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [studyPhase, setStudyPhase] = useState<'setup' | 'learning' | 'practice' | 'review'>('setup')
    const [learningStyle, setLearningStyle] = useState<'visual' | 'auditory' | 'kinesthetic' | 'mixed'>('mixed')
    const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate')
    const [sessionTimer, setSessionTimer] = useState(0)
    const [isTimerRunning, setIsTimerRunning] = useState(false)
    const [soundEnabled, setSoundEnabled] = useState(true)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [studyStats, setStudyStats] = useState({
        questionsAnswered: 0,
        correctAnswers: 0,
        conceptsMastered: 0,
        timeSpent: 0
    })

    const messagesEndRef = useRef<HTMLDivElement>(null)
    const timerRef = useRef<NodeJS.Timeout>()

    useEffect(() => {
        if (isTimerRunning) {
            timerRef.current = setInterval(() => {
                setSessionTimer(prev => prev + 1)
            }, 1000)
        } else {
            if (timerRef.current) clearInterval(timerRef.current)
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current)
        }
    }, [isTimerRunning])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const startStudySession = async () => {
        if (!initialTopic || !initialSubject) return

        const session: StudySession = {
            id: `session_${Date.now()}`,
            topic: initialTopic,
            subject: initialSubject,
            difficulty,
            duration: 0,
            progress: 0,
            completed: false
        }

        setCurrentSession(session)
        setStudyPhase('learning')
        setIsTimerRunning(true)

        const studyContext = {
            topic: initialTopic,
            subject: initialSubject,
            difficulty,
            learningStyle,
            phase: 'introduction'
        }

        setIsLoading(true)
        try {
            const response = await callAI(
                [{ role: 'user', content: `Start a guided study session on ${initialTopic} in ${initialSubject}. I'm a ${difficulty} level student with ${learningStyle} learning preference.` }],
                'study-mode',
                'en',
                3,
                studyContext
            )

            setMessages([
                { role: 'assistant', content: response }
            ])
        } catch (error) {
            console.error('Failed to start study session:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return

        const userMessage = { role: 'user' as const, content: input }
        setMessages(prev => [...prev, userMessage])
        setInput('')
        setIsLoading(true)

        try {
            const studyContext = {
                topic: currentSession?.topic,
                subject: currentSession?.subject,
                difficulty,
                learningStyle,
                phase: studyPhase,
                progress: currentSession?.progress || 0,
                stats: studyStats
            }

            const response = await callAI(
                [...messages, userMessage],
                'study-mode',
                'en',
                3,
                studyContext
            )

            setMessages(prev => [...prev, { role: 'assistant', content: response }])

            // Update stats based on interaction
            setStudyStats(prev => ({
                ...prev,
                questionsAnswered: prev.questionsAnswered + 1,
                timeSpent: sessionTimer
            }))

        } catch (error) {
            console.error('Failed to send message:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const switchToGuidedLearning = async () => {
        setStudyPhase('practice')
        setIsLoading(true)

        try {
            const studyContext = {
                topic: currentSession?.topic,
                subject: currentSession?.subject,
                difficulty,
                learningStyle,
                phase: 'guided-practice'
            }

            const response = await callAI(
                [{ role: 'user', content: 'Switch to guided learning mode with interactive exercises and step-by-step problem solving.' }],
                'guided-learning',
                'en',
                3,
                studyContext
            )

            setMessages(prev => [...prev, { role: 'assistant', content: response }])
        } catch (error) {
            console.error('Failed to switch to guided learning:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    if (!isOpen) return null

    return (
        <div className={`fixed inset-0 bg-neutral-950/95 backdrop-blur-xl z-50 ${isFullscreen ? '' : 'p-4'}`}>
            <div className={`${isFullscreen ? 'h-full' : 'h-full max-w-7xl mx-auto'} bg-neutral-900/90 backdrop-blur-2xl rounded-3xl border border-neutral-800/50 shadow-2xl flex flex-col overflow-hidden`}>

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-neutral-800/40">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-medical-500 rounded-2xl flex items-center justify-center">
                            <Brain className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-neutral-100">AI Study Mode</h2>
                            <p className="text-sm text-neutral-400">
                                {currentSession ? `${currentSession.topic} • ${currentSession.subject}` : 'Advanced Learning Assistant'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        {/* Timer */}
                        <div className="flex items-center space-x-2 bg-neutral-800/60 px-4 py-2 rounded-xl">
                            <Clock className="h-4 w-4 text-neutral-400" />
                            <span className="text-sm font-mono text-neutral-200">{formatTime(sessionTimer)}</span>
                            <button
                                onClick={() => setIsTimerRunning(!isTimerRunning)}
                                className="p-1 hover:bg-neutral-700/60 rounded-lg transition-colors"
                            >
                                {isTimerRunning ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                            </button>
                        </div>

                        {/* Controls */}
                        <button
                            onClick={() => setSoundEnabled(!soundEnabled)}
                            className="p-2 hover:bg-neutral-800/60 rounded-xl transition-colors text-neutral-400"
                        >
                            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                        </button>

                        <button
                            onClick={() => setIsFullscreen(!isFullscreen)}
                            className="p-2 hover:bg-neutral-800/60 rounded-xl transition-colors text-neutral-400"
                        >
                            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                        </button>

                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-neutral-800/60 rounded-xl transition-colors text-neutral-400"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Study Setup */}
                {studyPhase === 'setup' && (
                    <div className="flex-1 flex items-center justify-center p-8">
                        <div className="max-w-2xl w-full space-y-8">
                            <div className="text-center">
                                <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-medical-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                    <Target className="h-10 w-10 text-white" />
                                </div>
                                <h3 className="text-3xl font-bold text-neutral-100 mb-4">Start Your Study Session</h3>
                                <p className="text-neutral-400 text-lg">Configure your personalized learning experience</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <label className="block text-sm font-semibold text-neutral-300">Learning Style</label>
                                    <select
                                        value={learningStyle}
                                        onChange={(e) => setLearningStyle(e.target.value as any)}
                                        className="w-full px-4 py-3 bg-neutral-800/60 border border-neutral-700/60 rounded-xl text-neutral-100 focus:ring-2 focus:ring-primary-500/40"
                                    >
                                        <option value="visual">Visual (Diagrams, Charts)</option>
                                        <option value="auditory">Auditory (Explanations, Discussions)</option>
                                        <option value="kinesthetic">Kinesthetic (Hands-on, Practice)</option>
                                        <option value="mixed">Mixed (All Styles)</option>
                                    </select>
                                </div>

                                <div className="space-y-4">
                                    <label className="block text-sm font-semibold text-neutral-300">Difficulty Level</label>
                                    <select
                                        value={difficulty}
                                        onChange={(e) => setDifficulty(e.target.value as any)}
                                        className="w-full px-4 py-3 bg-neutral-800/60 border border-neutral-700/60 rounded-xl text-neutral-100 focus:ring-2 focus:ring-primary-500/40"
                                    >
                                        <option value="beginner">Beginner (Foundation)</option>
                                        <option value="intermediate">Intermediate (Standard)</option>
                                        <option value="advanced">Advanced (Expert)</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                onClick={startStudySession}
                                disabled={!initialTopic || !initialSubject}
                                className="w-full btn-primary text-lg py-4 flex items-center justify-center space-x-3"
                            >
                                <Play className="h-5 w-5" />
                                <span>Start Learning</span>
                                <ArrowRight className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Study Interface */}
                {studyPhase !== 'setup' && (
                    <>
                        {/* Study Stats Bar */}
                        <div className="flex items-center justify-between p-4 bg-neutral-800/40 border-b border-neutral-800/40">
                            <div className="flex items-center space-x-6">
                                <div className="flex items-center space-x-2">
                                    <Target className="h-4 w-4 text-primary-400" />
                                    <span className="text-sm text-neutral-300">Progress: {currentSession?.progress || 0}%</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <CheckCircle className="h-4 w-4 text-green-400" />
                                    <span className="text-sm text-neutral-300">Correct: {studyStats.correctAnswers}/{studyStats.questionsAnswered}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Trophy className="h-4 w-4 text-yellow-400" />
                                    <span className="text-sm text-neutral-300">Mastered: {studyStats.conceptsMastered}</span>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={switchToGuidedLearning}
                                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-medium transition-colors flex items-center space-x-2"
                                >
                                    <Lightbulb className="h-4 w-4" />
                                    <span>Guided Mode</span>
                                </button>
                            </div>
                        </div>

                        {/* Chat Interface */}
                        <div className="flex-1 flex flex-col">
                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                {messages.map((message, index) => (
                                    <div
                                        key={index}
                                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-4xl p-6 rounded-3xl shadow-lg ${message.role === 'user'
                                                ? 'bg-primary-600 text-white ml-auto'
                                                : 'bg-neutral-800/60 text-neutral-100 mr-auto border border-neutral-700/40'
                                                }`}
                                        >
                                            {message.role === 'assistant' && (
                                                <div className="flex items-center space-x-2 mb-3">
                                                    <Brain className="h-5 w-5 text-primary-400" />
                                                    <span className="text-sm font-semibold text-primary-400">AI Study Assistant</span>
                                                </div>
                                            )}
                                            <div className="prose prose-invert max-w-none">
                                                {message.content.split('\n').map((line, i) => (
                                                    <p key={i} className="mb-2 last:mb-0 leading-relaxed">
                                                        {line}
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {isLoading && (
                                    <div className="flex justify-start">
                                        <div className="bg-neutral-800/60 p-6 rounded-3xl border border-neutral-700/40">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse"></div>
                                                <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                                <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                                                <span className="text-sm text-neutral-400">AI is thinking...</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input */}
                            <div className="p-6 border-t border-neutral-800/40">
                                <div className="flex items-end space-x-4">
                                    <div className="flex-1">
                                        <textarea
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault()
                                                    sendMessage()
                                                }
                                            }}
                                            placeholder="Ask questions, request explanations, or practice problems..."
                                            className="w-full px-5 py-4 bg-neutral-800/60 border border-neutral-700/60 rounded-2xl text-neutral-100 placeholder-neutral-400 focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500/60 resize-none"
                                            rows={3}
                                            disabled={isLoading}
                                        />
                                    </div>
                                    <button
                                        onClick={sendMessage}
                                        disabled={isLoading || !input.trim()}
                                        className="p-4 bg-primary-600 hover:bg-primary-700 disabled:bg-neutral-700 disabled:cursor-not-allowed text-white rounded-2xl transition-colors"
                                    >
                                        <MessageCircle className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
