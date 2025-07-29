'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Activity, Heart, Scale, Droplet, TrendingUp, Plus, Calendar } from 'lucide-react'
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
    const height = parseFloat(healthData.height) / 100 // Convert cm to m
    if (weight && height) {
      return (weight / (height * height)).toFixed(1)
    }
    return null
  }

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-blue-600' }
    if (bmi < 25) return { category: 'Normal', color: 'text-green-600' }
    if (bmi < 30) return { category: 'Overweight', color: 'text-yellow-600' }
    return { category: 'Obese', color: 'text-red-600' }
  }

  const getAIAnalysis = async (type: string, value: any) => {
    try {
      const response = await fetch('/api/health-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, value })
      })
      if (response.ok) {
        const analysis = await response.json()
        return analysis
      }
    } catch (error) {
      console.error('AI analysis error:', error)
    }
    return null
  }

  const saveHealthRecord = async (type: string, value: any) => {
    try {
      const analysis = await getAIAnalysis(type, value)
      
      const response = await fetch('/api/health-records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          value: JSON.stringify(value),
          unit: type === 'weight' ? 'kg' : type === 'height' ? 'cm' : type === 'glucose' ? 'mg/dL' : type === 'heart_rate' ? 'BPM' : '',
          notes: analysis?.suggestion || ''
        })
      })

      if (response.ok) {
        toast.success('Health record saved!')
        if (analysis) {
          toast(analysis.message, { 
            icon: analysis.status === 'normal' ? '✅' : analysis.status === 'warning' ? '⚠️' : '🚨',
            duration: 5000
          })
        }
        fetchHealthRecords()
      } else {
        toast.error('Failed to save record')
      }
    } catch (error) {
      toast.error('Network error')
    }
  }

  const deleteRecord = async (id: string) => {
    if (!confirm('Delete this health record?')) return
    
    try {
      const response = await fetch(`/api/health-records/${id}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        toast.success('Record deleted!')
        fetchHealthRecords()
      }
    } catch (error) {
      toast.error('Failed to delete record')
    }
  }

  const tabs = [
    { id: 'bmi', name: 'BMI Calculator', icon: Scale },
    { id: 'bp', name: 'Blood Pressure', icon: Heart },
    { id: 'glucose', name: 'Glucose', icon: Droplet },
    { id: 'heart', name: 'Heart Rate', icon: Activity },
  ]

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <TrendingUp className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Health Tracker</h1>
          <p className="text-gray-600">Monitor your vital health metrics</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 m-1 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span className="text-sm">{tab.name}</span>
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">
              {tabs.find(t => t.id === activeTab)?.name}
            </h2>

            {activeTab === 'bmi' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                  <input
                    type="number"
                    value={healthData.weight}
                    onChange={(e) => setHealthData({...healthData, weight: e.target.value})}
                    className="input-field"
                    placeholder="Enter weight in kg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
                  <input
                    type="number"
                    value={healthData.height}
                    onChange={(e) => setHealthData({...healthData, height: e.target.value})}
                    className="input-field"
                    placeholder="Enter height in cm"
                  />
                </div>
                {healthData.weight && healthData.height && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{calculateBMI()}</p>
                      <p className={`text-sm font-medium ${getBMICategory(parseFloat(calculateBMI() || '0')).color}`}>
                        {getBMICategory(parseFloat(calculateBMI() || '0')).category}
                      </p>
                    </div>
                  </div>
                )}
                <button
                  onClick={() => saveHealthRecord('bmi', { weight: healthData.weight, height: healthData.height, bmi: calculateBMI() })}
                  disabled={!healthData.weight || !healthData.height}
                  className="btn-primary w-full"
                >
                  Save BMI Record
                </button>
              </div>
            )}

            {activeTab === 'bp' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Systolic</label>
                    <input
                      type="number"
                      value={healthData.bloodPressure.systolic}
                      onChange={(e) => setHealthData({
                        ...healthData, 
                        bloodPressure: {...healthData.bloodPressure, systolic: e.target.value}
                      })}
                      className="input-field"
                      placeholder="120"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Diastolic</label>
                    <input
                      type="number"
                      value={healthData.bloodPressure.diastolic}
                      onChange={(e) => setHealthData({
                        ...healthData, 
                        bloodPressure: {...healthData.bloodPressure, diastolic: e.target.value}
                      })}
                      className="input-field"
                      placeholder="80"
                    />
                  </div>
                </div>
                <button
                  onClick={() => saveHealthRecord('blood_pressure', healthData.bloodPressure)}
                  disabled={!healthData.bloodPressure.systolic || !healthData.bloodPressure.diastolic}
                  className="btn-primary w-full"
                >
                  Save Blood Pressure
                </button>
              </div>
            )}

            {activeTab === 'glucose' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Glucose Level (mg/dL)</label>
                  <input
                    type="number"
                    value={healthData.glucose}
                    onChange={(e) => setHealthData({...healthData, glucose: e.target.value})}
                    className="input-field"
                    placeholder="Enter glucose level"
                  />
                </div>
                <button
                  onClick={() => saveHealthRecord('glucose', healthData.glucose)}
                  disabled={!healthData.glucose}
                  className="btn-primary w-full"
                >
                  Save Glucose Level
                </button>
              </div>
            )}

            {activeTab === 'heart' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Heart Rate (BPM)</label>
                  <input
                    type="number"
                    value={healthData.heartRate}
                    onChange={(e) => setHealthData({...healthData, heartRate: e.target.value})}
                    className="input-field"
                    placeholder="Enter heart rate"
                  />
                </div>
                <button
                  onClick={() => saveHealthRecord('heart_rate', healthData.heartRate)}
                  disabled={!healthData.heartRate}
                  className="btn-primary w-full"
                >
                  Save Heart Rate
                </button>
              </div>
            )}
          </div>

          {/* Recent Records */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Recent Records</h2>
            <div className="space-y-3">
              {records.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No records yet. Start tracking your health!</p>
              ) : (
                records.slice(0, 10).map((record) => {
                  let displayValue = record.value
                  try {
                    const parsed = JSON.parse(record.value)
                    displayValue = parsed.bmi || parsed.systolic ? `${parsed.systolic}/${parsed.diastolic}` : record.value
                  } catch (e) {
                    displayValue = record.value
                  }
                  
                  return (
                    <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 capitalize">{record.type.replace('_', ' ')}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(record.recordedAt).toLocaleDateString()}
                        </p>
                        {record.notes && (
                          <p className="text-xs text-blue-600 mt-1">{record.notes}</p>
                        )}
                      </div>
                      <div className="text-right flex items-center space-x-2">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {displayValue}{record.unit && ` ${record.unit}`}
                          </p>
                        </div>
                        <button
                          onClick={() => deleteRecord(record.id)}
                          className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-700 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}