'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { 
  Heart, Activity, Calendar, Users, FileText, Pill, 
  Phone, BookOpen, TrendingUp, Clock, AlertCircle, ArrowRight 
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import HealthTipsSection from '@/components/HealthTipsSection'
import Link from 'next/link'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [healthStats, setHealthStats] = useState<{
    bmi: number
    lastCheckup: string | null
    medications: number
    appointments: number
    lastBP: string | null
    lastGlucose: string | null
  }>({
    bmi: 0,
    lastCheckup: null,
    medications: 0,
    appointments: 0,
    lastBP: null,
    lastGlucose: null
  })
  const [recentRecords, setRecentRecords] = useState<any[]>([])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (session) {
      fetchHealthStats()
    }
  }, [status, session, router])

  const fetchHealthStats = async () => {
    try {
      const response = await fetch('/api/health-records')
      if (response.ok) {
        const records = await response.json()
        setRecentRecords(records.slice(0, 5))
        
        // Calculate latest stats
        const bmiRecord = records.find((r: any) => r.type === 'bmi')
        const bpRecord = records.find((r: any) => r.type === 'blood_pressure')
        const glucoseRecord = records.find((r: any) => r.type === 'glucose')
        
        setHealthStats({
          bmi: bmiRecord ? JSON.parse(bmiRecord.value).bmi : 0,
          lastCheckup: records.length > 0 ? new Date(records[0].recordedAt).toLocaleDateString() : null,
          medications: 0,
          appointments: 0,
          lastBP: bpRecord ? `${JSON.parse(bpRecord.value).systolic}/${JSON.parse(bpRecord.value).diastolic}` : null,
          lastGlucose: glucoseRecord ? `${glucoseRecord.value} mg/dL` : null
        })
      }
    } catch (error) {
      console.error('Failed to fetch health stats:', error)
    }
  }

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (session) {
      const interval = setInterval(fetchHealthStats, 30000)
      return () => clearInterval(interval)
    }
  }, [session])

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  const quickActions = [
    { name: 'Medical Chat', href: '/chat', image: '/images/chat-bubble.png' },
    { name: 'Health Tracker', href: '/health-tracker', image: '/images/monitor.png' },
    { name: 'Medicine Reminder', href: '/medicine-reminder', image: '/images/pill-bottle.png' },
    { name: 'Emergency Contacts', href: '/emergency', image: '/images/emergency.png' },
    { name: 'Medical Dictionary', href: '/dictionary', image: '/images/book.png' },
  ]

  const studentActions: Array<{
    name: string
    href: string
    icon?: any
    color?: string
    image?: string
  }> = [
    { name: 'Mock Tests', href: '/mock-tests', icon: FileText, color: 'bg-orange-500' },
    { name: 'Study Planner', href: '/study-planner', icon: Calendar, color: 'bg-teal-500' },
    { name: 'Student Corner', href: '/student', image: '/images/hat-scholar.png' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-medical-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 theme-transition page-transition">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-12 text-center animate-fade-in">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
            <div className="relative p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
              <Heart className="h-10 w-10 text-blue-600 animate-bounce" />
            </div>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold gradient-text mb-4">
            Welcome back, {session?.user?.name || 'User'}!
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Your comprehensive AI-powered health dashboard
          </p>
        </div>

        {/* Health Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 animate-slide-up">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">BMI Index</p>
                <p className="text-3xl font-bold text-gray-900">
                  {healthStats.bmi || 'N/A'}
                </p>
                <p className="text-sm text-blue-600 font-medium mt-1">Body Mass Index</p>
              </div>
              <div className="p-4 bg-gradient-to-r from-blue-100 to-blue-200 rounded-2xl group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-300">
                <Activity className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">Last Checkup</p>
                <p className="text-2xl font-bold text-gray-900">
                  {healthStats.lastCheckup || 'None'}
                </p>
                <p className="text-sm text-green-600 font-medium mt-1">Health Record</p>
              </div>
              <div className="p-4 bg-gradient-to-r from-green-100 to-green-200 rounded-2xl group-hover:from-green-200 group-hover:to-green-300 transition-all duration-300">
                <Heart className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">Medications</p>
                <p className="text-3xl font-bold text-gray-900">
                  {healthStats.medications}
                </p>
                <p className="text-sm text-purple-600 font-medium mt-1">Active Prescriptions</p>
              </div>
              <div className="p-4 bg-gradient-to-r from-purple-100 to-purple-200 rounded-2xl group-hover:from-purple-200 group-hover:to-purple-300 transition-all duration-300">
                <Pill className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 animate-slide-up" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">Appointments</p>
                <p className="text-3xl font-bold text-gray-900">
                  {healthStats.appointments}
                </p>
                <p className="text-sm text-orange-600 font-medium mt-1">Scheduled Visits</p>
              </div>
              <div className="p-4 bg-gradient-to-r from-orange-100 to-orange-200 rounded-2xl group-hover:from-orange-200 group-hover:to-orange-300 transition-all duration-300">
                <Calendar className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center lg:text-left">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
              {quickActions.map((action, index) => (
                <Link
                  key={action.name}
                  href={action.href}
                  className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-center animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative mb-4">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    <div className="relative w-16 h-16 mx-auto group-hover:scale-110 transition-transform duration-300">
                      <Image
                        src={action.image}
                        alt={action.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-contain rounded-2xl"
                      />
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm group-hover:text-blue-600 transition-colors duration-300">{action.name}</h3>
                </Link>
              ))}
            </div>

            {/* Student Features */}
            {session?.user && (session.user as any).userType === 'student' && (
              <>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Student Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {studentActions.map((action) => (
                    <Link
                      key={action.name}
                      href={action.href}
                      className="card hover:shadow-lg transition-all duration-200 text-center group"
                    >
                      {action.image ? (
                        <div className="w-16 h-16 mx-auto mb-3 group-hover:scale-110 transition-transform">
                          <Image
                            src={action.image}
                            alt={action.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-contain rounded-2xl"
                          />
                        </div>
                      ) : (
                        <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                          <action.icon className="h-6 w-6 text-white" />
                        </div>
                      )}
                      <h3 className="font-medium text-gray-900 text-sm">{action.name}</h3>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Recent Health Records */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center lg:text-left">Recent Health Records</h2>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
              <div className="space-y-6">
                {recentRecords.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="p-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <TrendingUp className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">No health records yet</p>
                    <p className="text-sm text-gray-400 mt-2">Start tracking your health metrics</p>
                  </div>
                ) : (
                  recentRecords.map((record) => {
                    let displayValue = record.value
                    let alertColor = 'bg-blue-500'
                    let isAbnormal = false
                    
                    try {
                      const parsed = JSON.parse(record.value)
                      if (record.type === 'bmi') {
                        displayValue = parsed.bmi
                        const bmi = parseFloat(parsed.bmi)
                        if (bmi < 18.5 || bmi > 25) {
                          alertColor = bmi > 30 ? 'bg-red-500' : 'bg-yellow-500'
                          isAbnormal = true
                        }
                      } else if (record.type === 'blood_pressure') {
                        displayValue = `${parsed.systolic}/${parsed.diastolic}`
                        if (parsed.systolic > 140 || parsed.diastolic > 90) {
                          alertColor = 'bg-red-500'
                          isAbnormal = true
                        } else if (parsed.systolic > 120 || parsed.diastolic > 80) {
                          alertColor = 'bg-yellow-500'
                          isAbnormal = true
                        }
                      } else if (record.type === 'glucose') {
                        displayValue = record.value
                        const glucose = parseInt(record.value)
                        if (glucose > 126) {
                          alertColor = 'bg-red-500'
                          isAbnormal = true
                        } else if (glucose > 100) {
                          alertColor = 'bg-yellow-500'
                          isAbnormal = true
                        }
                      } else if (record.type === 'heart_rate') {
                        displayValue = record.value
                        const hr = parseInt(record.value)
                        if (hr < 60 || hr > 100) {
                          alertColor = 'bg-yellow-500'
                          isAbnormal = true
                        }
                      }
                    } catch (e) {
                      displayValue = record.value
                    }
                    
                    return (
                      <div key={record.id} className="flex items-center space-x-3">
                        <div className={`w-2 h-2 ${alertColor} rounded-full ${isAbnormal ? 'animate-pulse' : ''}`}></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 capitalize">
                            {record.type.replace('_', ' ')}: {displayValue}{record.unit && ` ${record.unit}`}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(record.recordedAt).toLocaleDateString()}
                          </p>
                          {record.notes && isAbnormal && (
                            <p className="text-xs text-red-600 mt-1 font-medium">
                              ⚠️ {record.notes.substring(0, 50)}...
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>

            {/* Health Alerts */}
            {recentRecords.some(record => {
              try {
                if (record.type === 'glucose') {
                  const glucose = parseInt(record.value)
                  return glucose > 100 || glucose < 70
                }
                if (record.type === 'blood_pressure') {
                  const parsed = JSON.parse(record.value)
                  return parsed.systolic > 120 || parsed.diastolic > 80
                }
                if (record.type === 'bmi') {
                  const parsed = JSON.parse(record.value)
                  const bmi = parseFloat(parsed.bmi)
                  return bmi < 18.5 || bmi > 25
                }
                if (record.type === 'heart_rate') {
                  const hr = parseInt(record.value)
                  return hr < 60 || hr > 100
                }
              } catch (e) {}
              return false
            }) && (
              <div className="mt-8">
                <h3 className="text-xl font-bold text-red-700 mb-4 flex items-center">
                  <AlertCircle className="h-6 w-6 mr-2" />
                  Health Alerts
                </h3>
                <div className="bg-gradient-to-r from-red-50 to-orange-50 backdrop-blur-sm rounded-2xl border-2 border-red-200 p-6 shadow-lg">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-red-100 rounded-full">
                      <AlertCircle className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <p className="text-red-700 font-semibold mb-3">
                        Some of your recent health readings are outside normal ranges.
                      </p>
                      <Link href="/health-tracker" className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300 font-medium">
                        View detailed analysis
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* AI Health Tips */}
            <div className="mt-8">
              <HealthTipsSection />
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full opacity-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-60 h-60 bg-green-200 rounded-full opacity-5 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
    </div>
  )
}