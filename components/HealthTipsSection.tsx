'use client'

import { useState, useEffect } from 'react'
import { Heart, Lightbulb, Quote, CheckCircle, Sparkles, RefreshCw } from 'lucide-react'

interface HealthTip {
  tip: string
  explanation: string
  quote: string
  steps: string[]
  category: string
  personalNote?: string
}

export default function HealthTipsSection() {
  const [healthTip, setHealthTip] = useState<HealthTip | null>(null)
  const [personalTip, setPersonalTip] = useState<HealthTip | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchHealthTips()
  }, [])

  const fetchHealthTips = async () => {
    try {
      const [generalResponse, personalResponse] = await Promise.all([
        fetch('/api/health-tips?type=general'),
        fetch('/api/health-tips?type=personal')
      ])

      if (generalResponse.ok) {
        const generalTip = await generalResponse.json()
        setHealthTip(generalTip)
      }

      if (personalResponse.ok) {
        const personalTipData = await personalResponse.json()
        setPersonalTip(personalTipData)
      }
    } catch (error) {
      console.error('Failed to fetch health tips:', error)
    } finally {
      setLoading(false)
    }
  }

  const refreshTips = async () => {
    setRefreshing(true)
    await fetchHealthTips()
    setRefreshing(false)
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'nutrition': return '🥗'
      case 'exercise': return '🏃‍♂️'
      case 'mental-health': return '🧠'
      case 'hydration': return '💧'
      case 'wellness': return '🌟'
      default: return '💡'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'nutrition': return 'from-green-500 to-emerald-500'
      case 'exercise': return 'from-blue-500 to-cyan-500'
      case 'mental-health': return 'from-purple-500 to-indigo-500'
      case 'hydration': return 'from-blue-400 to-teal-400'
      case 'wellness': return 'from-pink-500 to-rose-500'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-dark-700 rounded mb-4"></div>
        <div className="h-32 bg-gray-200 dark:bg-dark-700 rounded"></div>
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Today's Health Tip */}
      {healthTip && (
        <div className="animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
              <Lightbulb className="h-6 w-6 mr-2 text-yellow-500" />
              Daily Wellness
            </h3>
            <button
              onClick={refreshTips}
              disabled={refreshing}
              className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors duration-300"
              title="Refresh tips"
            >
              <RefreshCw className={`h-4 w-4 text-gray-600 dark:text-gray-400 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl border border-yellow-200/50 dark:border-yellow-800/50 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="mb-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className={`p-2 bg-gradient-to-r ${getCategoryColor(healthTip.category)} rounded-lg text-white`}>
                  <span className="text-xl">{getCategoryIcon(healthTip.category)}</span>
                </div>
                <span className={`px-2 py-1 bg-gradient-to-r ${getCategoryColor(healthTip.category)} text-white text-xs font-semibold rounded-full capitalize`}>
                  {healthTip.category.replace('-', ' ')}
                </span>
              </div>
              <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                {healthTip.tip}
              </h4>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                {healthTip.explanation}
              </p>
            </div>

            <div className="mb-4">
              <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center text-sm">
                <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                Steps:
              </h5>
              <div className="space-y-2">
                {healthTip.steps.map((step, index) => (
                  <div key={index} className="flex items-start space-x-2 p-2 bg-white/60 dark:bg-dark-800/60 rounded-lg">
                    <div className="flex-shrink-0 w-5 h-5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {index + 1}
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 text-sm">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg p-3 border-l-4 border-blue-500">
              <div className="flex items-start space-x-2">
                <Quote className="h-4 w-4 text-blue-500 flex-shrink-0 mt-1" />
                <p className="text-blue-800 dark:text-blue-300 italic text-sm leading-relaxed">
                  "{healthTip.quote}"
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Personal Health Tip */}
      {personalTip && (
        <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <Sparkles className="h-6 w-6 mr-2 text-purple-500" />
            Personal Insight
          </h3>
          
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200/50 dark:border-purple-800/50 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="mb-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white">
                  <Heart className="h-5 w-5" />
                </div>
                <span className="px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold rounded-full capitalize">
                  {personalTip.category}
                </span>
              </div>
              <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                {personalTip.tip}
              </h4>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm mb-3">
                {personalTip.explanation}
              </p>

              {personalTip.personalNote && (
                <div className="bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 rounded-lg p-3 mb-3">
                  <p className="text-purple-800 dark:text-purple-300 font-semibold text-center text-sm">
                    💪 {personalTip.personalNote}
                  </p>
                </div>
              )}
            </div>

            <div className="mb-4">
              <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center text-sm">
                <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                Actions:
              </h5>
              <div className="space-y-2">
                {personalTip.steps.map((step, index) => (
                  <div key={index} className="flex items-start space-x-2 p-2 bg-white/60 dark:bg-dark-800/60 rounded-lg">
                    <div className="flex-shrink-0 w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {index + 1}
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 text-sm">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-lg p-3 border-l-4 border-purple-500">
              <div className="flex items-start space-x-2">
                <Quote className="h-4 w-4 text-purple-500 flex-shrink-0 mt-1" />
                <p className="text-purple-800 dark:text-purple-300 italic text-sm leading-relaxed">
                  "{personalTip.quote}"
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}