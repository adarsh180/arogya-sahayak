'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  FileText, Clock, Target, Brain, Play, Trophy,
  BookOpen, Zap, ArrowRight, CheckCircle, Users
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

  const startTest = () => {
    if (selectedExam && selectedSubject) {
      router.push(`/mock-tests/test?exam=${selectedExam}&subject=${selectedSubject}`)
    }
  }

  const testModes = [
    {
      title: 'Quick Test',
      description: '10 questions • 15 minutes',
      duration: 15,
      questions: 10,
      icon: Zap,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20'
    },
    {
      title: 'Standard Test',
      description: '25 questions • 30 minutes',
      duration: 30,
      questions: 25,
      icon: FileText,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20'
    },
    {
      title: 'Full Test',
      description: '50 questions • 60 minutes',
      duration: 60,
      questions: 50,
      icon: Trophy,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20'
    }
  ]

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-medical-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-medical-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 theme-transition">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-medical-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
            <div className="relative p-6 bg-gradient-to-r from-primary-100 to-medical-100 dark:from-primary-900/30 dark:to-medical-900/30 rounded-full w-24 h-24 mx-auto flex items-center justify-center">
              <FileText className="h-12 w-12 text-primary-600 dark:text-primary-400 animate-bounce-gentle" />
            </div>
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-black mb-6">
            <span className="gradient-text">Mock Tests</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Practice with AI-generated questions tailored to your target exam and track your progress
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Test Configuration */}
          <div className="lg:col-span-2">
            <div className="card animate-slide-up mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
                <Target className="h-6 w-6 mr-2 text-primary-600 dark:text-primary-400" />
                Configure Your Test
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Select Exam
                  </label>
                  <div className="grid md:grid-cols-2 gap-3">
                    {Object.entries(MEDICAL_EXAMS).slice(0, 6).map(([code, name]) => (
                      <button
                        key={code}
                        onClick={() => setSelectedExam(code)}
                        className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                          selectedExam === code
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                            : 'border-gray-200 dark:border-dark-700 hover:border-primary-300 dark:hover:border-primary-600 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <div className="font-semibold">{name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Select Subject
                  </label>
                  <div className="grid md:grid-cols-3 gap-3">
                    {subjects[selectedExam as keyof typeof subjects]?.map((subject) => (
                      <button
                        key={subject}
                        onClick={() => setSelectedSubject(subject)}
                        className={`p-3 rounded-xl border-2 transition-all duration-300 ${
                          selectedSubject === subject
                            ? 'border-medical-500 bg-medical-50 dark:bg-medical-900/20 text-medical-700 dark:text-medical-300'
                            : 'border-gray-200 dark:border-dark-700 hover:border-medical-300 dark:hover:border-medical-600 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <div className="font-semibold text-center">{subject}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Test Modes */}
            <div className="card animate-slide-up" style={{ animationDelay: '200ms' }}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
                <Brain className="h-6 w-6 mr-2 text-medical-600 dark:text-medical-400" />
                Choose Test Mode
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                {testModes.map((mode, index) => (
                  <div
                    key={mode.title}
                    className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${mode.bgColor} p-6 border border-gray-200/50 dark:border-dark-700/50 hover:shadow-lg transition-all duration-300 transform hover:scale-105 animate-scale-in`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${mode.color} text-white mb-4`}>
                      <mode.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                      {mode.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {mode.description}
                    </p>
                    <button
                      onClick={() => router.push(`/mock-tests/test?exam=${selectedExam}&subject=${selectedSubject}&mode=${mode.title.toLowerCase().replace(' ', '-')}&questions=${mode.questions}&duration=${mode.duration}`)}
                      disabled={!selectedExam || !selectedSubject}
                      className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      <Play className="h-4 w-4" />
                      <span>Start Test</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="card animate-slide-up" style={{ animationDelay: '300ms' }}>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-yellow-600 dark:text-yellow-400" />
                Your Stats
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Tests Taken</span>
                  <span className="font-bold text-gray-900 dark:text-gray-100">{testStats.totalTests}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Average Score</span>
                  <span className="font-bold text-green-600 dark:text-green-400">{testStats.averageScore}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Best Score</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">{testStats.bestScore}%</span>
                </div>
              </div>
              
              <Link 
                href="/analytics" 
                className="mt-4 w-full btn-secondary flex items-center justify-center space-x-2"
              >
                <span>View Analytics</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Test Tips */}
            <div className="card animate-slide-up" style={{ animationDelay: '400ms' }}>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
                Test Tips
              </h3>
              
              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Read questions carefully before answering</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-medical-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Manage your time effectively</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Review your answers before submitting</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Don't spend too much time on one question</span>
                </div>
              </div>
            </div>

            {/* Leaderboard Preview */}
            <div className="card animate-slide-up" style={{ animationDelay: '500ms' }}>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <Users className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
                Top Performers
              </h3>
              
              <div className="space-y-3">
                {[
                  { name: 'Priya S.', score: 95, rank: 1 },
                  { name: 'Rahul K.', score: 92, rank: 2 },
                  { name: 'Anita M.', score: 89, rank: 3 }
                ].map((user) => (
                  <div key={user.rank} className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                      user.rank === 1 ? 'bg-yellow-500' :
                      user.rank === 2 ? 'bg-gray-400' :
                      'bg-orange-500'
                    }`}>
                      {user.rank}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 dark:text-gray-100">{user.name}</div>
                    </div>
                    <div className="font-bold text-primary-600 dark:text-primary-400">{user.score}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 dark:bg-primary-900/30 rounded-full opacity-10 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-medical-200 dark:bg-medical-900/30 rounded-full opacity-10 animate-float" style={{ animationDelay: '1s' }}></div>
      </div>
    </div>
  )
}