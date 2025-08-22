'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  Calendar, Plus, Clock, Target, Brain, CheckCircle,
  X, Edit3, Trash2, BookOpen, Zap, Star, AlertCircle
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import { MEDICAL_EXAMS } from '@/lib/ai'
import toast from 'react-hot-toast'

interface StudyPlan {
  id: string
  examType: string
  subject: string
  topic: string
  scheduledDate: string
  duration: number
  status: 'pending' | 'completed' | 'skipped'
  notes?: string
  createdAt: string
}

export default function StudyPlanner() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingPlan, setEditingPlan] = useState<StudyPlan | null>(null)
  const [newPlan, setNewPlan] = useState({
    examType: 'neet-ug',
    subject: '',
    topic: '',
    scheduledDate: '',
    duration: 60,
    notes: ''
  })

  const subjects = {
    'neet-ug': ['Physics', 'Chemistry', 'Biology'],
    'neet-pg': ['General Medicine', 'Surgery', 'Pediatrics', 'Gynecology'],
    'aiims-ug': ['Physics', 'Chemistry', 'Biology', 'General Knowledge'],
  }

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (session) {
      fetchStudyPlans()
    }
  }, [status, session, router])

  const fetchStudyPlans = async () => {
    try {
      const response = await fetch('/api/study-plans')
      if (response.ok) {
        const data = await response.json()
        setStudyPlans(data)
      }
    } catch (error) {
      console.error('Failed to fetch study plans:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddPlan = async () => {
    if (!newPlan.subject || !newPlan.topic || !newPlan.scheduledDate) {
      toast.error('Please fill all required fields')
      return
    }

    try {
      const response = await fetch('/api/study-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPlan)
      })

      if (response.ok) {
        const plan = await response.json()
        setStudyPlans(prev => [plan, ...prev])
        setShowAddModal(false)
        setNewPlan({
          examType: 'neet-ug',
          subject: '',
          topic: '',
          scheduledDate: '',
          duration: 60,
          notes: ''
        })
        toast.success('Study plan added successfully')
      } else {
        toast.error('Failed to add study plan')
      }
    } catch (error) {
      toast.error('Network error')
    }
  }

  const handleUpdateStatus = async (id: string, status: 'completed' | 'skipped') => {
    try {
      const response = await fetch(`/api/study-plans/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })

      if (response.ok) {
        setStudyPlans(prev => prev.map(plan =>
          plan.id === id ? { ...plan, status } : plan
        ))
        toast.success(`Plan marked as ${status}`)
      }
    } catch (error) {
      toast.error('Failed to update plan')
    }
  }

  const handleDeletePlan = async (id: string) => {
    if (!confirm('Are you sure you want to delete this plan?')) return

    try {
      const response = await fetch(`/api/study-plans/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setStudyPlans(prev => prev.filter(plan => plan.id !== id))
        toast.success('Plan deleted successfully')
      }
    } catch (error) {
      toast.error('Failed to delete plan')
    }
  }

  const generateAIStudyPlan = async () => {
    try {
      const response = await fetch('/api/study-plans/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examType: newPlan.examType,
          duration: 30 // 30 days plan
        })
      })

      if (response.ok) {
        const plans = await response.json()
        setStudyPlans(prev => [...plans, ...prev])
        toast.success('AI study plan generated successfully')
      }
    } catch (error) {
      toast.error('Failed to generate AI plan')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20'
      case 'skipped': return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20'
      default: return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20'
    }
  }

  const todayPlans = studyPlans.filter(plan => {
    const today = new Date().toDateString()
    const planDate = new Date(plan.scheduledDate).toDateString()
    return today === planDate
  })

  const upcomingPlans = studyPlans.filter(plan => {
    const today = new Date()
    const planDate = new Date(plan.scheduledDate)
    return planDate > today
  }).slice(0, 5)

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
              <Calendar className="h-12 w-12 text-primary-600 dark:text-primary-400 animate-bounce-gentle" />
            </div>
          </div>

          <h1 className="text-4xl lg:text-6xl font-black mb-6">
            <span className="gradient-text">Study Planner</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Organize your study schedule with AI-powered planning and track your progress
          </p>
        </div>

        <div className="flex justify-center mb-8 space-x-4">
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Study Plan</span>
          </button>
          <button
            onClick={generateAIStudyPlan}
            className="btn-secondary flex items-center space-x-2"
          >
            <Brain className="h-5 w-5" />
            <span>Generate AI Plan</span>
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Today's Plans */}
          <div className="card animate-slide-up">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
              <Target className="h-6 w-6 mr-2 text-primary-600 dark:text-primary-400" />
              Today's Schedule
            </h2>

            {todayPlans.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No plans for today</p>
              </div>
            ) : (
              <div className="space-y-4">
                {todayPlans.map((plan) => (
                  <div key={plan.id} className="p-4 bg-gray-50 dark:bg-dark-800 rounded-xl">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">{plan.topic}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(plan.status)}`}>
                        {plan.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{plan.subject}</p>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{plan.duration} minutes</span>
                    </div>
                    {plan.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleUpdateStatus(plan.id, 'completed')}
                          className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-green-700 transition-colors"
                        >
                          Complete
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(plan.id, 'skipped')}
                          className="flex-1 bg-gray-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-gray-700 transition-colors"
                        >
                          Skip
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Plans */}
          <div className="lg:col-span-2">
            <div className="card animate-slide-up" style={{ animationDelay: '200ms' }}>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
                <BookOpen className="h-6 w-6 mr-2 text-medical-600 dark:text-medical-400" />
                Upcoming Plans
              </h2>

              {upcomingPlans.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 text-lg">No upcoming plans</p>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="mt-4 btn-primary"
                  >
                    Create Your First Plan
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingPlans.map((plan, index) => (
                    <div
                      key={plan.id}
                      className="p-6 bg-gray-50 dark:bg-dark-800 rounded-xl hover:shadow-lg transition-all duration-300 animate-slide-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{plan.topic}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(plan.status)}`}>
                              {plan.status}
                            </span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 mb-2">{plan.subject} • {plan.examType.toUpperCase()}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>{new Date(plan.scheduledDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>{plan.duration} minutes</span>
                            </div>
                          </div>
                          {plan.notes && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 italic">{plan.notes}</p>
                          )}
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => setEditingPlan(plan)}
                            className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePlan(plan.id)}
                            className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Add/Edit Modal */}
        {(showAddModal || editingPlan) && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-dark-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {editingPlan ? 'Edit Study Plan' : 'Add Study Plan'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddModal(false)
                    setEditingPlan(null)
                  }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Exam Type
                  </label>
                  <select
                    value={newPlan.examType}
                    onChange={(e) => setNewPlan(prev => ({ ...prev, examType: e.target.value }))}
                    className="input-field focus-ring"
                  >
                    {Object.entries(MEDICAL_EXAMS).slice(0, 6).map(([code, name]) => (
                      <option key={code} value={code}>{name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Subject
                  </label>
                  <select
                    value={newPlan.subject}
                    onChange={(e) => setNewPlan(prev => ({ ...prev, subject: e.target.value }))}
                    className="input-field focus-ring"
                  >
                    <option value="">Select Subject</option>
                    {subjects[newPlan.examType as keyof typeof subjects]?.map((subject) => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Topic
                  </label>
                  <input
                    type="text"
                    value={newPlan.topic}
                    onChange={(e) => setNewPlan(prev => ({ ...prev, topic: e.target.value }))}
                    placeholder="Enter topic to study"
                    className="input-field focus-ring"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Scheduled Date
                  </label>
                  <input
                    type="date"
                    value={newPlan.scheduledDate}
                    onChange={(e) => setNewPlan(prev => ({ ...prev, scheduledDate: e.target.value }))}
                    className="input-field focus-ring"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={newPlan.duration}
                    onChange={(e) => setNewPlan(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                    min="15"
                    max="480"
                    className="input-field focus-ring"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={newPlan.notes}
                    onChange={(e) => setNewPlan(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Add any notes or reminders"
                    rows={3}
                    className="input-field focus-ring"
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowAddModal(false)
                    setEditingPlan(null)
                  }}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddPlan}
                  className="flex-1 btn-primary"
                >
                  {editingPlan ? 'Update' : 'Add'} Plan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>


    </div>
  )
}