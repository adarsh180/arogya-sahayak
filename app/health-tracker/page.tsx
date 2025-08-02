'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Activity, Heart, Scale, Droplet, TrendingUp, Plus, Calendar, Zap, Target, Award, Trash2, Brain, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import Navbar from '@/components/Navbar'
import toast from 'react-hot-toast'

export default function HealthTracker() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('bmi')
  const [healthData, setHealthData] = useState({
    weight: '',
    height: '',
    bloodPressure: { systolic: '', diastolic: '' },
    glucose: '',
    heartRate: ''
  })
  const [records, setRecords] = useState<any[]>([])
  const [analysis, setAnalysis] = useState<any>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (session) {
      fetchHealthRecords()
    }
  }, [status, session, router])

  const fetchHealthRecords = async () => {
    try {
      const response = await fetch('/api/health-records')
      if (response.ok) {
        const data = await response.json()
        setRecords(data)
      }
    } catch (error) {
      console.error('Failed to fetch health records:', error)
    }
  }

  const calculateBMI = () => {
    const weight = parseFloat(healthData.weight)
    const height = parseFloat(healthData.height) / 100
    if (weight && height) {
      return (weight / (height * height)).toFixed(1)
    }
    return null
  }

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-blue-600 dark:text-blue-400', bg: 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20' }
    if (bmi < 25) return { category: 'Normal', color: 'text-green-600 dark:text-green-400', bg: 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20' }
    if (bmi < 30) return { category: 'Overweight', color: 'text-yellow-600 dark:text-yellow-400', bg: 'from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20' }
    return { category: 'Obese', color: 'text-red-600 dark:text-red-400', bg: 'from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20' }
  }

  const saveHealthRecord = async (type: string, value: any) => {
    try {
      const response = await fetch('/api/health-records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          value: JSON.stringify(value),
          unit: type === 'weight' ? 'kg' : type === 'height' ? 'cm' : type === 'glucose' ? 'mg/dL' : type === 'heart_rate' ? 'BPM' : '',
          notes: ''
        })
      })

      if (response.ok) {
        toast.success('Health record saved!')
        fetchHealthRecords()
        // Get AI analysis
        await getAIAnalysis(type, value)
      } else {
        toast.error('Failed to save record')
      }
    } catch (error) {
      toast.error('Network error')
    }
  }

  const getAIAnalysis = async (type: string, value: any) => {
    setIsAnalyzing(true)
    try {
      const response = await fetch('/api/health-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, value })
      })
      
      if (response.ok) {
        const analysisData = await response.json()
        setAnalysis(analysisData)
      }
    } catch (error) {
      console.error('Analysis error:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const deleteHealthRecord = async (id: string) => {
    if (!confirm('Are you sure you want to delete this health record?')) return
    
    try {
      const response = await fetch(`/api/health-records?id=${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        // Remove from UI immediately for real-time update
        setRecords(prev => prev.filter(record => record.id !== id))
        toast.success('Health record deleted!')
      } else {
        toast.error('Failed to delete record')
      }
    } catch (error) {
      toast.error('Network error')
    }
  }

  const tabs = [
    { id: 'bmi', name: 'BMI Calculator', icon: Scale, color: 'from-blue-500 to-cyan-500', bgColor: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20' },
    { id: 'bp', name: 'Blood Pressure', icon: Heart, color: 'from-red-500 to-pink-500', bgColor: 'from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20' },
    { id: 'glucose', name: 'Glucose', icon: Droplet, color: 'from-green-500 to-emerald-500', bgColor: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20' },
    { id: 'heart', name: 'Heart Rate', icon: Activity, color: 'from-purple-500 to-indigo-500', bgColor: 'from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20' },
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
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-medical-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
            <div className="relative p-6 bg-gradient-to-r from-primary-100 to-medical-100 dark:from-primary-900/30 dark:to-medical-900/30 rounded-full w-24 h-24 mx-auto flex items-center justify-center">
              <TrendingUp className="h-12 w-12 text-primary-600 dark:text-primary-400 animate-bounce-gentle" />
            </div>
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-black mb-6">
            <span className="gradient-text">Health Tracker</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Monitor your vital health metrics with AI-powered insights and personalized recommendations
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center mb-12 animate-slide-up">
          <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-gray-200/50 dark:border-dark-700/50">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-3 px-6 py-3 m-1 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                  activeTab === tab.id
                    ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <tab.icon className="h-5 w-5" />
                <span className="font-medium">{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* AI Analysis Section */}
        {(analysis || isAnalyzing) && (
          <div className="mb-8 animate-slide-up">
            <div className="card hover-lift bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl text-white">
                  <Brain className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">AI Health Analysis</h2>
              </div>
              
              {isAnalyzing ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">Analyzing your health data...</p>
                </div>
              ) : analysis && (
                <div className="space-y-4">
                  <div className={`p-4 rounded-xl border-2 ${
                    analysis.status === 'normal' ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' :
                    analysis.status === 'warning' ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800' :
                    'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
                  }`}>
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${
                        analysis.status === 'normal' ? 'bg-green-100 dark:bg-green-800' :
                        analysis.status === 'warning' ? 'bg-yellow-100 dark:bg-yellow-800' :
                        'bg-red-100 dark:bg-red-800'
                      }`}>
                        {analysis.status === 'normal' && <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />}
                        {analysis.status === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />}
                        {analysis.status === 'danger' && <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />}
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-bold text-lg mb-2 ${
                          analysis.status === 'normal' ? 'text-green-800 dark:text-green-200' :
                          analysis.status === 'warning' ? 'text-yellow-800 dark:text-yellow-200' :
                          'text-red-800 dark:text-red-200'
                        }`}>
                          {analysis.message}
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {analysis.suggestion}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setAnalysis(null)}
                    className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-dark-700 dark:hover:bg-dark-600 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
                  >
                    Dismiss Analysis
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className={`card hover-lift animate-slide-up bg-gradient-to-br ${tabs.find(t => t.id === activeTab)?.bgColor}`}>
            <div className="flex items-center space-x-3 mb-6">
              <div className={`p-3 bg-gradient-to-r ${tabs.find(t => t.id === activeTab)?.color} rounded-xl text-white`}>
                {(() => {
                  const activeTabData = tabs.find(t => t.id === activeTab)
                  if (activeTabData?.icon) {
                    const IconComponent = activeTabData.icon
                    return <IconComponent className="h-6 w-6" />
                  }
                  return null
                })()}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {tabs.find(t => t.id === activeTab)?.name}
              </h2>
            </div>

            {activeTab === 'bmi' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Weight (kg)</label>
                    <input
                      type="number"
                      value={healthData.weight}
                      onChange={(e) => setHealthData({...healthData, weight: e.target.value})}
                      className="input-field focus-ring"
                      placeholder="Enter weight in kg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Height (cm)</label>
                    <input
                      type="number"
                      value={healthData.height}
                      onChange={(e) => setHealthData({...healthData, height: e.target.value})}
                      className="input-field focus-ring"
                      placeholder="Enter height in cm"
                    />
                  </div>
                </div>
                
                {healthData.weight && healthData.height && (
                  <div className={`p-6 bg-gradient-to-r ${getBMICategory(parseFloat(calculateBMI() || '0')).bg} rounded-2xl border border-gray-200/50 dark:border-dark-700/50 animate-scale-in`}>
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-3 mb-4">
                        <Target className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                        <p className="text-4xl font-black text-gray-900 dark:text-gray-100">{calculateBMI()}</p>
                      </div>
                      <p className={`text-lg font-bold ${getBMICategory(parseFloat(calculateBMI() || '0')).color} mb-2`}>
                        {getBMICategory(parseFloat(calculateBMI() || '0')).category}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Body Mass Index</p>
                    </div>
                  </div>
                )}
                
                <button
                  onClick={() => saveHealthRecord('bmi', { weight: healthData.weight, height: healthData.height, bmi: calculateBMI() })}
                  disabled={!healthData.weight || !healthData.height}
                  className="btn-primary w-full py-4 text-lg flex items-center justify-center space-x-2"
                >
                  <Plus className="h-5 w-5" />
                  <span>Save BMI Record</span>
                </button>
              </div>
            )}

            {activeTab === 'bp' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Systolic (mmHg)</label>
                    <input
                      type="number"
                      value={healthData.bloodPressure.systolic}
                      onChange={(e) => setHealthData({
                        ...healthData, 
                        bloodPressure: {...healthData.bloodPressure, systolic: e.target.value}
                      })}
                      className="input-field focus-ring"
                      placeholder="120"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Diastolic (mmHg)</label>
                    <input
                      type="number"
                      value={healthData.bloodPressure.diastolic}
                      onChange={(e) => setHealthData({
                        ...healthData, 
                        bloodPressure: {...healthData.bloodPressure, diastolic: e.target.value}
                      })}
                      className="input-field focus-ring"
                      placeholder="80"
                    />
                  </div>
                </div>
                
                {healthData.bloodPressure.systolic && healthData.bloodPressure.diastolic && (
                  <div className="p-6 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-2xl border border-red-200/50 dark:border-red-800/50 animate-scale-in">
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-3 mb-2">
                        <Heart className="h-6 w-6 text-red-600 dark:text-red-400" />
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                          {healthData.bloodPressure.systolic}/{healthData.bloodPressure.diastolic}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Blood Pressure Reading</p>
                    </div>
                  </div>
                )}
                
                <button
                  onClick={() => saveHealthRecord('blood_pressure', healthData.bloodPressure)}
                  disabled={!healthData.bloodPressure.systolic || !healthData.bloodPressure.diastolic}
                  className="btn-primary w-full py-4 text-lg flex items-center justify-center space-x-2"
                >
                  <Plus className="h-5 w-5" />
                  <span>Save Blood Pressure</span>
                </button>
              </div>
            )}

            {activeTab === 'glucose' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Glucose Level (mg/dL)</label>
                  <input
                    type="number"
                    value={healthData.glucose}
                    onChange={(e) => setHealthData({...healthData, glucose: e.target.value})}
                    className="input-field focus-ring"
                    placeholder="Enter glucose level"
                  />
                </div>
                
                {healthData.glucose && (
                  <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200/50 dark:border-green-800/50 animate-scale-in">
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-3 mb-2">
                        <Droplet className="h-6 w-6 text-green-600 dark:text-green-400" />
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{healthData.glucose} mg/dL</p>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Blood Glucose Level</p>
                    </div>
                  </div>
                )}
                
                <button
                  onClick={() => saveHealthRecord('glucose', healthData.glucose)}
                  disabled={!healthData.glucose}
                  className="btn-primary w-full py-4 text-lg flex items-center justify-center space-x-2"
                >
                  <Plus className="h-5 w-5" />
                  <span>Save Glucose Level</span>
                </button>
              </div>
            )}

            {activeTab === 'heart' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Heart Rate (BPM)</label>
                  <input
                    type="number"
                    value={healthData.heartRate}
                    onChange={(e) => setHealthData({...healthData, heartRate: e.target.value})}
                    className="input-field focus-ring"
                    placeholder="Enter heart rate"
                  />
                </div>
                
                {healthData.heartRate && (
                  <div className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-2xl border border-purple-200/50 dark:border-purple-800/50 animate-scale-in">
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-3 mb-2">
                        <Activity className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{healthData.heartRate} BPM</p>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Heart Rate</p>
                    </div>
                  </div>
                )}
                
                <button
                  onClick={() => saveHealthRecord('heart_rate', healthData.heartRate)}
                  disabled={!healthData.heartRate}
                  className="btn-primary w-full py-4 text-lg flex items-center justify-center space-x-2"
                >
                  <Plus className="h-5 w-5" />
                  <span>Save Heart Rate</span>
                </button>
              </div>
            )}
          </div>

          {/* Recent Records */}
          <div className="card hover-lift animate-slide-up" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl text-white">
                <Calendar className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Recent Records</h2>
            </div>
            
            <div className="space-y-4">
              {records.length === 0 ? (
                <div className="text-center py-12">
                  <div className="p-6 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-dark-700 to-dark-600 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <TrendingUp className="h-10 w-10 text-gray-400" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">No records yet</p>
                  <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Start tracking your health metrics!</p>
                </div>
              ) : (
                records.slice(0, 10).map((record, index) => {
                  let displayValue = record.value
                  let iconColor = 'text-blue-600 dark:text-blue-400'
                  let bgColor = 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20'
                  
                  try {
                    const parsed = JSON.parse(record.value)
                    if (parsed.bmi) {
                      displayValue = parsed.bmi
                      iconColor = 'text-green-600 dark:text-green-400'
                      bgColor = 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20'
                    } else if (parsed.systolic) {
                      displayValue = `${parsed.systolic}/${parsed.diastolic}`
                      iconColor = 'text-red-600 dark:text-red-400'
                      bgColor = 'from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20'
                    }
                  } catch (e) {
                    displayValue = record.value
                  }
                  
                  return (
                    <div 
                      key={record.id} 
                      className={`relative p-4 bg-gradient-to-r ${bgColor} rounded-xl border border-gray-200/50 dark:border-dark-700/50 hover:shadow-lg transition-all duration-300 transform hover:scale-102 animate-slide-up group`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg bg-white/80 dark:bg-dark-800/80 ${iconColor}`}>
                            {record.type === 'bmi' && <Scale className="h-5 w-5" />}
                            {record.type === 'blood_pressure' && <Heart className="h-5 w-5" />}
                            {record.type === 'glucose' && <Droplet className="h-5 w-5" />}
                            {record.type === 'heart_rate' && <Activity className="h-5 w-5" />}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 dark:text-gray-100 capitalize">
                              {record.type.replace('_', ' ')}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {new Date(record.recordedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                              {displayValue}{record.unit && ` ${record.unit}`}
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteHealthRecord(record.id)
                            }}
                            className="opacity-0 group-hover:opacity-100 p-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 rounded-lg transition-all duration-200 transform hover:scale-110"
                            title="Delete record"
                          >
                            <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
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