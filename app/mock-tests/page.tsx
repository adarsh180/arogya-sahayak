'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  FileText, Clock, Target, Brain, Play, Trophy,
  Zap, ArrowRight, Users, Loader2, Sparkles
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import { MEDICAL_EXAMS } from '@/lib/ai'

const subjects = {
  'neet-ug': ['Physics', 'Chemistry', 'Biology'],
  'neet-pg': ['General Medicine', 'Surgery', 'Pediatrics', 'Gynecology'],
  'aiims-ug': ['Physics', 'Chemistry', 'Biology', 'General Knowledge'],
  'aiims-pg': ['Medicine', 'Surgery', 'Specialty Subjects'],
}

export default function MockTests() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [selectedExam, setSelectedExam] = useState('neet-ug')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [testStats, setTestStats] = useState({
    totalTests: 0,
    averageScore: 0,
    bestScore: 0,
    recentTests: []
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (session) {
      fetchTestStats()
    }
  }, [status, session, router])

  useEffect(() => {
    if (selectedExam && subjects[selectedExam as keyof typeof subjects]) {
      setSelectedSubject(subjects[selectedExam as keyof typeof subjects][0])
    }
  }, [selectedExam])

  const fetchTestStats = async () => {
    try {
      const response = await fetch('/api/mock-tests/stats')
      if (response.ok) {
        const data = await response.json()
        setTestStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch test stats:', error)
    }
  }

  const testModes = [
    {
      title: 'Quick Test',
      description: '10 AI-generated questions',
      duration: 15,
      questions: 10,
      icon: Zap,
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Standard Test',
      description: '25 AI-generated questions',
      duration: 30,
      questions: 25,
      icon: FileText,
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Full Test',
      description: '50 AI-generated questions',
      duration: 60,
      questions: 50,
      icon: Trophy,
      gradient: 'from-purple-500 to-pink-500'
    }
  ]

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-zinc-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.03, 0.05, 0.03],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
          }}
          className="absolute top-0 left-1/4 w-[800px] h-[800px] rounded-full bg-blue-500 blur-[150px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.02, 0.04, 0.02],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            delay: 5
          }}
          className="absolute bottom-0 right-1/4 w-[700px] h-[700px] rounded-full bg-purple-500 blur-[150px]"
        />
      </div>

      <Navbar />

      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-zinc-900 flex items-center justify-center">
                <FileText className="w-6 h-6 text-zinc-400" />
              </div>
              <h1 className="text-4xl font-normal text-zinc-100">AI Mock Tests</h1>
            </div>
            <p className="text-lg text-zinc-500">
              Practice with AI-generated questions tailored to your target exam
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Test Configuration */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-[#1a1a1a] border border-zinc-800 rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-zinc-200 mb-6 flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-400" />
                  Configure Your Test
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-3">
                      Select Exam
                    </label>
                    <div className="grid md:grid-cols-2 gap-3">
                      {Object.entries(MEDICAL_EXAMS).slice(0, 6).map(([code, name]) => (
                        <motion.button
                          key={code}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedExam(code)}
                          className={`p-4 rounded-xl border-2 transition-all text-left ${selectedExam === code
                              ? 'border-blue-500 bg-blue-500/10 text-blue-300'
                              : 'border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-300'
                            }`}
                        >
                          <div className="font-semibold">{name}</div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-3">
                      Select Subject
                    </label>
                    <div className="grid md:grid-cols-3 gap-3">
                      {subjects[selectedExam as keyof typeof subjects]?.map((subject) => (
                        <motion.button
                          key={subject}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedSubject(subject)}
                          className={`p-3 rounded-xl border-2 transition-all ${selectedSubject === subject
                              ? 'border-purple-500 bg-purple-500/10 text-purple-300'
                              : 'border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-300'
                            }`}
                        >
                          <div className="font-semibold text-center">{subject}</div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Test Modes */}
              <div className="bg-[#1a1a1a] border border-zinc-800 rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-zinc-200 mb-6 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-400" />
                  Choose Test Mode
                </h2>

                <div className="grid md:grid-cols-3 gap-4">
                  {testModes.map((mode, index) => (
                    <motion.div
                      key={mode.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.03 }}
                      className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-all"
                    >
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${mode.gradient} flex items-center justify-center mb-4`}>
                        <mode.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-zinc-100 mb-2">
                        {mode.title}
                      </h3>
                      <p className="text-sm text-zinc-500 mb-2">{mode.description}</p>
                      <p className="text-xs text-zinc-600 mb-4">{mode.duration} minutes</p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => router.push(`/mock-tests/test?exam=${selectedExam}&subject=${selectedSubject}&mode=${mode.title.toLowerCase().replace(' ', '-')}&questions=${mode.questions}&duration=${mode.duration}`)}
                        disabled={!selectedExam || !selectedSubject}
                        className={`w-full py-2 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${selectedExam && selectedSubject
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                            : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                          }`}
                      >
                        <Play className="w-4 h-4" />
                        <span>Start Test</span>
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Stats Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="bg-[#1a1a1a] border border-zinc-800 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-zinc-200 mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  Your Stats
                </h3>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500">Tests Taken</span>
                    <span className="font-semibold text-zinc-100">{testStats.totalTests}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500">Average Score</span>
                    <span className="font-semibold text-green-400">{testStats.averageScore}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500">Best Score</span>
                    <span className="font-semibold text-blue-400">{testStats.bestScore}%</span>
                  </div>
                </div>

                <Link
                  href="/analytics"
                  className="mt-6 w-full flex items-center justify-center gap-2 py-2 px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl transition-colors"
                >
                  <span>View Analytics</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* AI Features */}
              <div className="bg-[#1a1a1a] border border-zinc-800 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-zinc-200 mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  AI Features
                </h3>

                <div className="space-y-3 text-sm text-zinc-400">
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2" />
                    <span>Questions generated in real-time based on exam level</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2" />
                    <span>Adaptive difficulty based on your performance</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-pink-500 rounded-full mt-2" />
                    <span>Detailed explanations for each answer</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full mt-2" />
                    <span>Performance analytics and insights</span>
                  </div>
                </div>
              </div>

              {/* Top Performers */}
              <div className="bg-[#1a1a1a] border border-zinc-800 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-zinc-200 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  Top Performers
                </h3>

                <div className="space-y-3">
                  {[
                    { name: 'Priya S.', score: 95, rank: 1 },
                    { name: 'Rahul K.', score: 92, rank: 2 },
                    { name: 'Anita M.', score: 89, rank: 3 }
                  ].map((user) => (
                    <div key={user.rank} className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${user.rank === 1 ? 'bg-yellow-500' :
                          user.rank === 2 ? 'bg-zinc-500' :
                            'bg-orange-500'
                        }`}>
                        {user.rank}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-zinc-300">{user.name}</div>
                      </div>
                      <div className="font-semibold text-purple-400">{user.score}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
