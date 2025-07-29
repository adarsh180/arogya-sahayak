'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { 
  Heart, Activity, Calendar, Users, FileText, Pill, 
  Phone, BookOpen, TrendingUp, Clock, AlertCircle 
} from 'lucide-react'
import Navbar from '@/components/Navbar'
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
    { name: 'Symptom Checker', href: '/symptom-checker', image: '/images/medical-diagonist.png' },
    { name: 'Health Tracker', href: '/health-tracker', image: '/images/monitor.png' },
    { name: 'Medicine Reminder', href: '/medicine-reminder', image: '/images/pill-bottle.png' },
    { name: 'Emergency Contacts', href: '/emergency', image: '/images/emergency.png' },
    { name: 'Medical Dictionary', href: '/dictionary', image: '/images/book.png' },
  ]

  const studentActions = [
    { name: 'Mock Tests', href: '/mock-tests', icon: FileText, color: 'bg-orange-500' },
    { name: 'Study Planner', href: '/study-planner', icon: Calendar, color: 'bg-teal-500' },
    { name: 'Student Corner', href: '/student', image: '/images/hat-scholar.png' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {session?.user?.name || 'User'}!
          </h1>
          <p className="text-gray-600">
            Your comprehensive health dashboard
          </p>
        </div>

        {/* Health Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">BMI</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {healthStats.bmi || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <Heart className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Last Checkup</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {healthStats.lastCheckup || 'None'}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <Pill className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Medications</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {healthStats.medications}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-full">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Appointments</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {healthStats.appointments}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {quickActions.map((action) => (
                <Link
                  key={action.name}
                  href={action.href}
                  className="card hover:shadow-lg transition-all duration-200 text-center group"
                >
                  <div className="w-16 h-16 mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <Image
                      src={action.image}
                      alt={action.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="font-medium text-gray-900 text-sm">{action.name}</h3>
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
                            className="w-full h-full object-contain"
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
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Health Records</h2>
            <div className="card">
              <div className="space-y-4">
                {recentRecords.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No health records yet</p>
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
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-red-700 mb-3">⚠️ Health Alerts</h3>
                <div className="card bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-red-700 font-medium mb-2">
                        Some of your recent health readings are outside normal ranges.
                      </p>
                      <Link href="/health-tracker" className="text-xs text-red-600 underline">
                        View detailed analysis →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Health Tips */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Today's Health Tip</h3>
              <div className="card bg-gradient-to-r from-blue-50 to-green-50">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-700">
                      Drink at least 8 glasses of water daily to maintain proper hydration and support your body's natural functions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}