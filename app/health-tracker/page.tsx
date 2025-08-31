'use client'

import { useState, useEffect } from 'react'
import { Heart, TrendingUp, Activity, Scale, Droplets, Thermometer, Plus, Calendar, X, AlertTriangle, CheckCircle } from 'lucide-react'
import Navbar from '@/components/Navbar'

export default function HealthTracker() {
  const [activeTab, setActiveTab] = useState('overview')
  const [showInputModal, setShowInputModal] = useState(false)
  const [inputType, setInputType] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({})
  const [healthData, setHealthData] = useState([])
  const [currentMetrics, setCurrentMetrics] = useState<any>({})

  // Load health data on component mount
  useEffect(() => {
    loadHealthData()
  }, [])

  const loadHealthData = async () => {
    try {
      const response = await fetch('/api/health-data')
      if (response.ok) {
        const data = await response.json()
        setHealthData(data)
        updateCurrentMetrics(data)
      }
    } catch (error) {
      console.error('Failed to load health data:', error)
    }
  }

  const updateCurrentMetrics = (data: any) => {
    const latest: any = {}
    data.forEach((item: any) => {
      if (!latest[item.type] || new Date(item.createdAt) > new Date(latest[item.type].createdAt)) {
        latest[item.type] = item
      }
    })
    setCurrentMetrics(latest)
  }

  const getMetricDisplay = (type: string, defaultValue: string, unit?: string) => {
    const metric = (currentMetrics as any)[type]
    if (!metric) return { value: defaultValue, status: 'No Data' }
    
    const value = metric.value
    const analysis = metric.analysis
    
    let displayValue = defaultValue
    if (type === 'blood_pressure' && value.systolic && value.diastolic) {
      displayValue = `${value.systolic}/${value.diastolic}`
    } else if (type === 'bmi' && value.bmi) {
      displayValue = value.bmi
    } else if (type === 'glucose' && value.glucose) {
      displayValue = value.glucose
    } else if (type === 'heart_rate' && value.heart_rate) {
      displayValue = value.heart_rate
    }
    
    return {
      value: displayValue,
      status: analysis.status ? analysis.status.charAt(0).toUpperCase() + analysis.status.slice(1) : 'Normal'
    }
  }

  const healthMetrics = [
    {
      id: 'bmi',
      name: 'BMI',
      ...getMetricDisplay('bmi', '22.5'),
      unit: 'kg/m²',
      icon: Scale,
      color: currentMetrics.bmi?.analysis?.status === 'danger' ? 'text-red-400' : 
             currentMetrics.bmi?.analysis?.status === 'warning' ? 'text-yellow-400' : 'text-green-400',
      bgColor: currentMetrics.bmi?.analysis?.status === 'danger' ? 'bg-red-900/20' : 
               currentMetrics.bmi?.analysis?.status === 'warning' ? 'bg-yellow-900/20' : 'bg-green-900/20',
      borderColor: currentMetrics.bmi?.analysis?.status === 'danger' ? 'border-red-700/40' : 
                   currentMetrics.bmi?.analysis?.status === 'warning' ? 'border-yellow-700/40' : 'border-green-700/40'
    },
    {
      id: 'bp',
      name: 'Blood Pressure',
      ...getMetricDisplay('blood_pressure', '120/80'),
      unit: 'mmHg',
      icon: Heart,
      color: currentMetrics.blood_pressure?.analysis?.status === 'danger' ? 'text-red-400' : 
             currentMetrics.blood_pressure?.analysis?.status === 'warning' ? 'text-yellow-400' : 'text-medical-400',
      bgColor: currentMetrics.blood_pressure?.analysis?.status === 'danger' ? 'bg-red-900/20' : 
               currentMetrics.blood_pressure?.analysis?.status === 'warning' ? 'bg-yellow-900/20' : 'bg-medical-900/20',
      borderColor: currentMetrics.blood_pressure?.analysis?.status === 'danger' ? 'border-red-700/40' : 
                   currentMetrics.blood_pressure?.analysis?.status === 'warning' ? 'border-yellow-700/40' : 'border-medical-700/40'
    },
    {
      id: 'glucose',
      name: 'Blood Glucose',
      ...getMetricDisplay('glucose', '95'),
      unit: 'mg/dL',
      icon: Droplets,
      color: currentMetrics.glucose?.analysis?.status === 'danger' ? 'text-red-400' : 
             currentMetrics.glucose?.analysis?.status === 'warning' ? 'text-yellow-400' : 'text-blue-400',
      bgColor: currentMetrics.glucose?.analysis?.status === 'danger' ? 'bg-red-900/20' : 
               currentMetrics.glucose?.analysis?.status === 'warning' ? 'bg-yellow-900/20' : 'bg-blue-900/20',
      borderColor: currentMetrics.glucose?.analysis?.status === 'danger' ? 'border-red-700/40' : 
                   currentMetrics.glucose?.analysis?.status === 'warning' ? 'border-yellow-700/40' : 'border-blue-700/40'
    },
    {
      id: 'heart_rate',
      name: 'Heart Rate',
      ...getMetricDisplay('heart_rate', '72'),
      unit: 'BPM',
      icon: Activity,
      color: currentMetrics.heart_rate?.analysis?.status === 'danger' ? 'text-red-400' : 
             currentMetrics.heart_rate?.analysis?.status === 'warning' ? 'text-yellow-400' : 'text-orange-400',
      bgColor: currentMetrics.heart_rate?.analysis?.status === 'danger' ? 'bg-red-900/20' : 
               currentMetrics.heart_rate?.analysis?.status === 'warning' ? 'bg-yellow-900/20' : 'bg-orange-900/20',
      borderColor: currentMetrics.heart_rate?.analysis?.status === 'danger' ? 'border-red-700/40' : 
                   currentMetrics.heart_rate?.analysis?.status === 'warning' ? 'border-yellow-700/40' : 'border-orange-700/40'
    }
  ]

  return (
    <div className="min-h-screen bg-neutral-950">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-neutral-100 mb-2">Health Tracker</h1>
              <p className="text-neutral-400">Monitor your vital health metrics and track progress over time</p>
            </div>
            <button 
              onClick={() => setShowInputModal(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add Reading</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-neutral-900/50 p-1 rounded-2xl backdrop-blur-xl border border-neutral-800/40">
            {[
              { id: 'overview', name: 'Overview', icon: Activity },
              { id: 'trends', name: 'Trends', icon: TrendingUp },
              { id: 'history', name: 'History', icon: Calendar }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Health Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {healthMetrics.map((metric) => (
                <div
                  key={metric.id}
                  className={`card-interactive ${metric.bgColor} ${metric.borderColor} border`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 ${metric.bgColor} rounded-2xl flex items-center justify-center`}>
                      <metric.icon className={`h-6 w-6 ${metric.color}`} />
                    </div>
                    <span className={`text-sm font-medium px-3 py-1 rounded-full ${metric.bgColor} ${metric.color}`}>
                      {metric.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-100 mb-2">{metric.name}</h3>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-bold text-neutral-100">{metric.value}</span>
                    <span className="text-neutral-400 text-sm">{metric.unit}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="card">
              <h3 className="text-xl font-semibold text-neutral-100 mb-6">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button 
                  onClick={() => { setInputType('blood_pressure'); setShowInputModal(true); }}
                  className="flex items-center space-x-3 p-4 bg-neutral-800/60 hover:bg-neutral-700/60 rounded-2xl transition-all duration-200 text-left"
                >
                  <div className="w-10 h-10 bg-medical-900/30 rounded-xl flex items-center justify-center">
                    <Heart className="h-5 w-5 text-medical-400" />
                  </div>
                  <div>
                    <div className="font-medium text-neutral-100">Record BP</div>
                    <div className="text-sm text-neutral-400">Blood pressure reading</div>
                  </div>
                </button>
                
                <button 
                  onClick={() => { setInputType('glucose'); setShowInputModal(true); }}
                  className="flex items-center space-x-3 p-4 bg-neutral-800/60 hover:bg-neutral-700/60 rounded-2xl transition-all duration-200 text-left"
                >
                  <div className="w-10 h-10 bg-blue-900/30 rounded-xl flex items-center justify-center">
                    <Droplets className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="font-medium text-neutral-100">Log Glucose</div>
                    <div className="text-sm text-neutral-400">Blood sugar level</div>
                  </div>
                </button>
                
                <button 
                  onClick={() => { setInputType('bmi'); setShowInputModal(true); }}
                  className="flex items-center space-x-3 p-4 bg-neutral-800/60 hover:bg-neutral-700/60 rounded-2xl transition-all duration-200 text-left"
                >
                  <div className="w-10 h-10 bg-green-900/30 rounded-xl flex items-center justify-center">
                    <Scale className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <div className="font-medium text-neutral-100">Check BMI</div>
                    <div className="text-sm text-neutral-400">Body mass index</div>
                  </div>
                </button>
              </div>
            </div>

            {/* AI Health Insights */}
            <div className="card">
              <h3 className="text-xl font-semibold text-neutral-100 mb-6">AI Health Insights</h3>
              <div className="space-y-4">
                {Object.values(currentMetrics).slice(0, 3).map((metric: any, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-neutral-800/40 rounded-2xl">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      metric.analysis.status === 'danger' ? 'bg-red-900/30' :
                      metric.analysis.status === 'warning' ? 'bg-yellow-900/30' : 'bg-green-900/30'
                    }`}>
                      <Heart className={`h-4 w-4 ${
                        metric.analysis.status === 'danger' ? 'text-red-400' :
                        metric.analysis.status === 'warning' ? 'text-yellow-400' : 'text-green-400'
                      }`} />
                    </div>
                    <div>
                      <h4 className="font-medium text-neutral-100 mb-1 capitalize">{metric.type.replace('_', ' ')} Update</h4>
                      <p className="text-neutral-400 text-sm">{metric.analysis.message}</p>
                      {metric.analysis.suggestion && (
                        <p className="text-neutral-500 text-xs mt-1">{metric.analysis.suggestion.slice(0, 100)}...</p>
                      )}
                    </div>
                  </div>
                ))}
                
                {Object.keys(currentMetrics).length === 0 && (
                  <div className="text-center py-8 text-neutral-400">
                    <Activity className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Add your first health reading to see AI insights</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Trends Tab */}
        {activeTab === 'trends' && (
          <div className="space-y-6">
            {Object.keys(currentMetrics).length > 0 ? (
              Object.entries(currentMetrics).map(([type, metric]: [string, any]) => (
                <div key={type} className="card">
                  <h3 className="text-xl font-semibold text-neutral-100 mb-4 capitalize">
                    {type.replace('_', ' ')} Trend
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="p-4 bg-neutral-800/40 rounded-2xl">
                        <div className="text-sm text-neutral-400 mb-1">Latest Reading</div>
                        <div className="text-2xl font-bold text-neutral-100">
                          {type === 'blood_pressure' ? `${metric.value.systolic}/${metric.value.diastolic}` :
                           type === 'bmi' ? metric.value.bmi :
                           type === 'glucose' ? metric.value.glucose :
                           type === 'heart_rate' ? metric.value.heart_rate : 'N/A'}
                        </div>
                        <div className={`text-sm capitalize ${
                          metric.analysis.status === 'danger' ? 'text-red-400' :
                          metric.analysis.status === 'warning' ? 'text-yellow-400' : 'text-green-400'
                        }`}>
                          {metric.analysis.status}
                        </div>
                      </div>
                      <div className="p-4 bg-neutral-800/40 rounded-2xl">
                        <div className="text-sm text-neutral-400 mb-2">AI Analysis</div>
                        <p className="text-neutral-200 text-sm">{metric.analysis.message}</p>
                      </div>
                    </div>
                    <div className="p-4 bg-neutral-800/40 rounded-2xl">
                      <div className="text-sm text-neutral-400 mb-2">Recommendations</div>
                      <p className="text-neutral-200 text-sm">{metric.analysis.suggestion}</p>
                      {metric.analysis.medicalContext && (
                        <div className="mt-3 pt-3 border-t border-neutral-700/40">
                          <div className="text-xs text-neutral-500">{metric.analysis.medicalContext}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="card text-center py-20">
                <TrendingUp className="h-16 w-16 text-neutral-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-neutral-100 mb-2">No Data Yet</h3>
                <p className="text-neutral-400">Add health readings to see trends and analysis.</p>
              </div>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            {healthData.length > 0 ? (
              <div className="card">
                <h3 className="text-xl font-semibold text-neutral-100 mb-6">Recent Health Records</h3>
                <div className="space-y-4">
                  {(healthData as any[]).map((record: any) => (
                    <div key={record.id} className="flex items-center justify-between p-4 bg-neutral-800/40 rounded-2xl">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          record.analysis.status === 'danger' ? 'bg-red-900/30' :
                          record.analysis.status === 'warning' ? 'bg-yellow-900/30' : 'bg-green-900/30'
                        }`}>
                          {record.type === 'blood_pressure' && <Heart className="h-5 w-5 text-medical-400" />}
                          {record.type === 'glucose' && <Droplets className="h-5 w-5 text-blue-400" />}
                          {record.type === 'bmi' && <Scale className="h-5 w-5 text-green-400" />}
                          {record.type === 'heart_rate' && <Activity className="h-5 w-5 text-orange-400" />}
                        </div>
                        <div>
                          <div className="font-medium text-neutral-100 capitalize">
                            {record.type.replace('_', ' ')}
                          </div>
                          <div className="text-sm text-neutral-400">
                            {new Date(record.createdAt).toLocaleDateString()} at {new Date(record.createdAt).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-neutral-100">
                          {record.type === 'blood_pressure' ? `${record.value.systolic}/${record.value.diastolic}` :
                           record.type === 'bmi' ? record.value.bmi :
                           record.type === 'glucose' ? record.value.glucose :
                           record.type === 'heart_rate' ? record.value.heart_rate : 'N/A'}
                        </div>
                        <div className={`text-sm capitalize ${
                          record.analysis.status === 'danger' ? 'text-red-400' :
                          record.analysis.status === 'warning' ? 'text-yellow-400' : 'text-green-400'
                        }`}>
                          {record.analysis.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="card text-center py-20">
                <Calendar className="h-16 w-16 text-neutral-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-neutral-100 mb-2">No History Yet</h3>
                <p className="text-neutral-400">Your health records will appear here after adding readings.</p>
              </div>
            )}
          </div>
        )}

        {/* Input Modal */}
        {showInputModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-neutral-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 w-full max-w-sm sm:max-w-md max-h-[90vh] overflow-y-auto border border-neutral-800">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-neutral-100">
                  {inputType === 'blood_pressure' && 'Blood Pressure'}
                  {inputType === 'glucose' && 'Blood Glucose'}
                  {inputType === 'bmi' && 'BMI Calculator'}
                  {inputType === 'heart_rate' && 'Heart Rate'}
                  {!inputType && 'Select Health Metric'}
                </h3>
                <button 
                  onClick={() => { setShowInputModal(false); setInputType(''); setFormData({}); setAnalysis(null); }}
                  className="text-neutral-400 hover:text-neutral-200"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {!inputType ? (
                <div className="space-y-2 sm:space-y-3">
                  {[
                    { id: 'blood_pressure', name: 'Blood Pressure', icon: Heart },
                    { id: 'glucose', name: 'Blood Glucose', icon: Droplets },
                    { id: 'bmi', name: 'BMI Calculator', icon: Scale },
                    { id: 'heart_rate', name: 'Heart Rate', icon: Activity }
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setInputType(option.id)}
                      className="w-full flex items-center space-x-3 p-3 sm:p-4 bg-neutral-800/60 hover:bg-neutral-700/60 rounded-xl sm:rounded-2xl transition-all duration-200 text-left"
                    >
                      <option.icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary-400" />
                      <span className="text-sm sm:text-base text-neutral-100">{option.name}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <HealthInputForm 
                  type={inputType}
                  formData={formData}
                  setFormData={setFormData}
                  onAnalyze={handleAnalyze}
                  loading={loading}
                  analysis={analysis}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )

  async function handleAnalyze() {
    setLoading(true)
    try {
      const response = await fetch('/api/health-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: inputType, value: formData })
      })
      const result = await response.json()
      setAnalysis(result)
      
      // Save to database
      await fetch('/api/health-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: inputType, value: formData, analysis: result })
      })
      
      // Reload data to update dashboard
      loadHealthData()
    } catch (error) {
      console.error('Analysis error:', error)
    } finally {
      setLoading(false)
    }
  }
}

function HealthInputForm({ type, formData, setFormData, onAnalyze, loading, analysis }: any) {
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-green-400 bg-green-900/20 border-green-700/40'
      case 'warning': return 'text-yellow-400 bg-yellow-900/20 border-yellow-700/40'
      case 'danger': return 'text-red-400 bg-red-900/20 border-red-700/40'
      default: return 'text-neutral-400 bg-neutral-800/40 border-neutral-700/40'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal': return <CheckCircle className="h-5 w-5" />
      case 'warning': case 'danger': return <AlertTriangle className="h-5 w-5" />
      default: return null
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Input Fields */}
      <div className="space-y-3 sm:space-y-4">
        {type === 'blood_pressure' && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-neutral-300 mb-1 sm:mb-2">Systolic</label>
                <input
                  type="number"
                  placeholder="120"
                  value={formData.systolic || ''}
                  onChange={(e) => handleInputChange('systolic', e.target.value)}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-neutral-800/60 border border-neutral-700/40 rounded-xl sm:rounded-2xl text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-neutral-300 mb-1 sm:mb-2">Diastolic</label>
                <input
                  type="number"
                  placeholder="80"
                  value={formData.diastolic || ''}
                  onChange={(e) => handleInputChange('diastolic', e.target.value)}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-neutral-800/60 border border-neutral-700/40 rounded-xl sm:rounded-2xl text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
                />
              </div>
            </div>
          </>
        )}

        {type === 'glucose' && (
          <div>
            <label className="block text-xs sm:text-sm font-medium text-neutral-300 mb-1 sm:mb-2">Blood Glucose (mg/dL)</label>
            <input
              type="number"
              placeholder="95"
              value={formData.glucose || ''}
              onChange={(e) => handleInputChange('glucose', e.target.value)}
              className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-neutral-800/60 border border-neutral-700/40 rounded-xl sm:rounded-2xl text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
            />
          </div>
        )}

        {type === 'bmi' && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-neutral-300 mb-1 sm:mb-2">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="70"
                  value={formData.weight || ''}
                  onChange={(e) => {
                    const weight = e.target.value
                    handleInputChange('weight', weight)
                    if (weight && formData.height) {
                      const bmi = (parseFloat(weight) / ((parseFloat(formData.height) / 100) ** 2)).toFixed(1)
                      handleInputChange('bmi', bmi)
                    }
                  }}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-neutral-800/60 border border-neutral-700/40 rounded-xl sm:rounded-2xl text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-neutral-300 mb-1 sm:mb-2">Height (cm)</label>
                <input
                  type="number"
                  placeholder="175"
                  value={formData.height || ''}
                  onChange={(e) => {
                    const height = e.target.value
                    handleInputChange('height', height)
                    if (height && formData.weight) {
                      const bmi = (parseFloat(formData.weight) / ((parseFloat(height) / 100) ** 2)).toFixed(1)
                      handleInputChange('bmi', bmi)
                    }
                  }}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-neutral-800/60 border border-neutral-700/40 rounded-xl sm:rounded-2xl text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
                />
              </div>
            </div>
            {formData.bmi && (
              <div className="p-2 sm:p-3 bg-neutral-800/40 rounded-xl">
                <span className="text-xs sm:text-sm text-neutral-300">Calculated BMI: </span>
                <span className="text-lg sm:text-xl font-semibold text-neutral-100">{formData.bmi}</span>
              </div>
            )}
          </>
        )}

        {type === 'heart_rate' && (
          <div>
            <label className="block text-xs sm:text-sm font-medium text-neutral-300 mb-1 sm:mb-2">Heart Rate (BPM)</label>
            <input
              type="number"
              placeholder="72"
              value={formData.heart_rate || ''}
              onChange={(e) => handleInputChange('heart_rate', e.target.value)}
              className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-neutral-800/60 border border-neutral-700/40 rounded-xl sm:rounded-2xl text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
            />
          </div>
        )}
      </div>

      {/* Analyze Button */}
      <button
        onClick={onAnalyze}
        disabled={loading || !Object.keys(formData).length}
        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base py-2 sm:py-3"
      >
        {loading ? 'Analyzing...' : 'Analyze Health Status'}
      </button>

      {/* Analysis Results */}
      {analysis && (
        <div className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border ${getStatusColor(analysis.status)}`}>
          <div className="flex items-center space-x-2 mb-3">
            {getStatusIcon(analysis.status)}
            <h4 className="font-semibold text-lg capitalize">{analysis.status} Status</h4>
          </div>
          <p className="mb-2 sm:mb-3 text-xs sm:text-sm opacity-90">{analysis.message}</p>
          <div className="text-xs opacity-75 space-y-1 sm:space-y-2">
            <div><strong>Recommendation:</strong> {analysis.suggestion}</div>
            {analysis.medicalContext && (
              <div className="pt-1 sm:pt-2 border-t border-current/20">
                <strong>Medical Context:</strong> {analysis.medicalContext}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}