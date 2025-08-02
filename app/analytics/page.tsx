'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { 
  BarChart3, TrendingUp, Target, Clock, Trophy, Calendar,
  BookOpen, Brain, Zap, Award, ArrowUp, ArrowDown, Activity
} from 'lucide-react'
import Navbar from '@/components/Navbar'

interface PerformanceData {
  totalTests: number
  averageScore: number
  bestScore: number
  totalStudyTime: number
  streak: number
  subjectScores: { [key: string]: number }
  recentTests: Array<{
    id: string
    examType: string
    subject: string
    score: number
    totalQuestions: number
    timeSpent: number
    completedAt: string
  }>
  weeklyProgress: Array<{
    date: string
    score: number
    testsCompleted: number
  }>
}

export default function PerformanceAnalytics() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [performanceData, setPerformanceData] = useState<PerformanceData>({
    totalTests: 0,
    averageScore: 0,
    bestScore: 0,
    totalStudyTime: 0,
    streak: 0,
    subjectScores: {},
    recentTests: [],
    weeklyProgress: []
  })
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('7d')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (session) {
      fetchPerformanceData()
    }
  }, [status, session, router, selectedPeriod])

  const fetchPerformanceData = async () => {
    try {
      const response = await fetch(`/api/analytics?period=${selectedPeriod}`)
      if (response.ok) {
        const data = await response.json()
        setPerformanceData(data)
      }
    } catch (error) {
      console.error('Failed to fetch performance data:', error)
    } finally {
      setLoading(false)
    }
  }

  const performanceMetrics = [
    {
      title: 'Total Tests',
      value: performanceData.totalTests,
      icon: BookOpen,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20'
    },
    {
      title: 'Average Score',
      value: `${performanceData.averageScore}%`,
      icon: Target,
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20'
    },
    {
      title: 'Best Score',
      value: `${performanceData.bestScore}%`,
      icon: Trophy,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20'
    },
    {
      title: 'Study Time',
      value: `${Math.floor(performanceData.totalStudyTime / 60)}h`,
      icon: Clock,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20'
    }
  ]

  if (loading) {
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
              <BarChart3 className="h-12 w-12 text-primary-600 dark:text-primary-400 animate-bounce-gentle" />
            </div>
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-black mb-6">
            <span className="gradient-text">Performance Analytics</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Track your progress, analyze performance trends, and optimize your study strategy
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-gray-200/50 dark:border-dark-700/50">
            {[
              { value: '7d', label: '7 Days' },
              { value: '30d', label: '30 Days' },
              { value: '90d', label: '90 Days' },
              { value: '1y', label: '1 Year' }
            ].map((period) => (
              <button
                key={period.value}
                onClick={() => setSelectedPeriod(period.value)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  selectedPeriod === period.value
                    ? 'bg-gradient-to-r from-primary-600 to-medical-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {performanceMetrics.map((metric, index) => (
            <div
              key={metric.title}
              className={`card hover-lift animate-scale-in bg-gradient-to-br ${metric.bgColor}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                    {metric.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {metric.value}
                  </p>
                </div>
                <div className={`p-3 bg-gradient-to-r ${metric.color} rounded-xl shadow-lg`}>
                  <metric.icon className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card animate-slide-up">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
            <Activity className="h-6 w-6 mr-2 text-purple-600 dark:text-purple-400" />
            Recent Test Results
          </h3>
          
          {performanceData.recentTests.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-lg">No tests completed yet</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Take your first mock test to see analytics</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-dark-700">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-gray-100">Exam</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-gray-100">Subject</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-gray-100">Score</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-gray-100">Time</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-gray-100">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {performanceData.recentTests.map((test) => (
                    <tr 
                      key={test.id} 
                      className="border-b border-gray-100 dark:border-dark-800 hover:bg-gray-50 dark:hover:bg-dark-800/50 transition-colors duration-200"
                    >
                      <td className="py-4 px-4 text-gray-900 dark:text-gray-100 font-medium">{test.examType}</td>
                      <td className="py-4 px-4 text-gray-600 dark:text-gray-300">{test.subject}</td>
                      <td className="py-4 px-4">
                        <span className={`font-bold ${
                          test.score >= 80 ? 'text-green-600 dark:text-green-400' :
                          test.score >= 60 ? 'text-yellow-600 dark:text-yellow-400' :
                          'text-red-600 dark:text-red-400'
                        }`}>
                          {test.score}%
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-600 dark:text-gray-300">{test.timeSpent}m</td>
                      <td className="py-4 px-4 text-gray-600 dark:text-gray-300">
                        {new Date(test.completedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}