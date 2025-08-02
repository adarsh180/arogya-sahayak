'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  GraduationCap, BookOpen, Brain, Target, Trophy, Clock, 
  TrendingUp, FileText, Calendar, Users, Star, ArrowRight,
  Play, Zap, Award, CheckCircle, BarChart3, PenTool
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import { MEDICAL_EXAMS } from '@/lib/ai'

export default function StudentCorner() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [selectedExam, setSelectedExam] = useState('neet-ug')
  const [studyStats, setStudyStats] = useState({
    totalTests: 0,
    averageScore: 0,
    studyHours: 0,
    streak: 0
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-medical-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const quickActions = [
    {
      title: 'AI Study Chat',
      description: 'Get personalized tutoring and doubt clearing',
      icon: Brain,
      href: '/chat?type=student',
      color: 'from-blue-500 to-purple-600',
      bgColor: 'from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20'
    },
    {
      title: 'Mock Tests',
      description: 'Practice with exam-pattern questions',
      icon: FileText,
      href: '/mock-tests',
      color: 'from-green-500 to-emerald-600',
      bgColor: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20'
    },
    {
      title: 'Study Planner',
      description: 'Organize your preparation schedule',
      icon: Calendar,
      href: '/study-planner',
      color: 'from-orange-500 to-red-600',
      bgColor: 'from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20'
    },
    {
      title: 'Performance Analytics',
      description: 'Track your progress and improvement',
      icon: BarChart3,
      href: '/analytics',
      color: 'from-purple-500 to-pink-600',
      bgColor: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20'
    }
  ]

  const subjects = [
    { name: 'Physics', progress: 75, color: 'bg-blue-500' },
    { name: 'Chemistry', progress: 82, color: 'bg-green-500' },
    { name: 'Biology', progress: 68, color: 'bg-red-500' },
    { name: 'Mathematics', progress: 71, color: 'bg-purple-500' }
  ]

  const recentAchievements = [
    { title: 'Physics Master', description: 'Completed 50 physics questions', icon: Trophy, color: 'text-yellow-500' },
    { title: 'Study Streak', description: '7 days continuous study', icon: Target, color: 'text-green-500' },
    { title: 'Mock Test Pro', description: 'Scored 85% in latest test', icon: Award, color: 'text-blue-500' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-medical-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 theme-transition page-transition">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-medical-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
            <div className="relative p-6 bg-gradient-to-r from-primary-100 to-medical-100 dark:from-primary-900/30 dark:to-medical-900/30 rounded-full w-24 h-24 mx-auto flex items-center justify-center">
              <GraduationCap className="h-12 w-12 text-primary-600 dark:text-primary-400 animate-bounce-gentle" />
            </div>
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-black mb-6">
            <span className="gradient-text">Student Corner</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Master medical entrance exams with AI-powered personalized learning, practice tests, and comprehensive study materials
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="card hover-lift animate-scale-in">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">Mock Tests</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{studyStats.totalTests}</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50 rounded-xl">
                <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="card hover-lift animate-scale-in" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">Avg Score</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{studyStats.averageScore}%</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/50 dark:to-green-800/50 rounded-xl">
                <Target className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="card hover-lift animate-scale-in" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">Study Hours</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{studyStats.studyHours}</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900/50 dark:to-purple-800/50 rounded-xl">
                <Clock className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className="card hover-lift animate-scale-in" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">Streak</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{studyStats.streak}</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-orange-100 to-orange-200 dark:from-orange-900/50 dark:to-orange-800/50 rounded-xl">
                <TrendingUp className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8">Quick Actions</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {quickActions.map((action, index) => (
                <Link
                  key={action.title}
                  href={action.href}
                  className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${action.bgColor} p-6 hover:shadow-2xl transition-all duration-500 transform hover:scale-105 animate-slide-up border border-gray-200/50 dark:border-dark-700/50`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative z-10">
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${action.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <action.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                      {action.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                      {action.description}
                    </p>
                    <div className="flex items-center text-primary-600 dark:text-primary-400 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                      Get Started <ArrowRight className="h-4 w-4 ml-2" />
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              ))}
            </div>

            {/* Subject Progress */}
            <div className="card animate-slide-up" style={{ animationDelay: '400ms' }}>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">Subject Progress</h3>
              <div className="space-y-6">
                {subjects.map((subject, index) => (
                  <div key={subject.name} className="group">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-900 dark:text-gray-100">{subject.name}</span>
                      <span className="text-sm font-bold text-gray-600 dark:text-gray-400">{subject.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-3 overflow-hidden">
                      <div 
                        className={`h-full ${subject.color} rounded-full transition-all duration-1000 ease-out group-hover:animate-pulse`}
                        style={{ 
                          width: `${subject.progress}%`,
                          animationDelay: `${index * 200}ms`
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Exam Selection */}
            <div className="card animate-slide-up" style={{ animationDelay: '500ms' }}>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Target Exam</h3>
              <select
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
                className="input-field focus-ring"
              >
                {Object.entries(MEDICAL_EXAMS).map(([code, name]) => (
                  <option key={code} value={code}>{name}</option>
                ))}
              </select>
            </div>

            {/* Recent Achievements */}
            <div className="card animate-slide-up" style={{ animationDelay: '600ms' }}>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">Recent Achievements</h3>
              <div className="space-y-4">
                {recentAchievements.map((achievement, index) => (
                  <div key={achievement.title} className="flex items-start space-x-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors duration-300">
                    <div className={`p-2 rounded-lg bg-gray-100 dark:bg-dark-700 ${achievement.color}`}>
                      <achievement.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">{achievement.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Study Tips */}
            <div className="card animate-slide-up" style={{ animationDelay: '700ms' }}>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <Star className="h-5 w-5 mr-2 text-yellow-500" />
                Today's Study Tip
              </h3>
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-4 rounded-xl border border-yellow-200/50 dark:border-yellow-800/50">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  <strong className="text-yellow-700 dark:text-yellow-400">Active Recall:</strong> Instead of just re-reading notes, test yourself frequently. This strengthens memory pathways and improves long-term retention.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 dark:bg-primary-900/30 rounded-full opacity-10 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-medical-200 dark:bg-medical-900/30 rounded-full opacity-10 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-60 h-60 bg-purple-200 dark:bg-purple-900/30 rounded-full opacity-5 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>
    </div>
  )
}