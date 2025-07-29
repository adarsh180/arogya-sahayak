'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Activity, Plus, X, AlertTriangle, Clock, User as UserIcon, Globe } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { INDIAN_LANGUAGES } from '@/lib/ai'
import toast from 'react-hot-toast'

const COMMON_SYMPTOMS = [
  'Fever', 'Headache', 'Cough', 'Sore throat', 'Fatigue', 'Nausea', 'Vomiting',
  'Diarrhea', 'Abdominal pain', 'Chest pain', 'Shortness of breath', 'Dizziness',
  'Joint pain', 'Muscle aches', 'Skin rash', 'Loss of appetite', 'Weight loss',
  'Difficulty sleeping', 'Back pain', 'Constipation'
]

export default function SymptomChecker() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [customSymptom, setCustomSymptom] = useState('')
  const [formData, setFormData] = useState({
    severity: 'mild',
    duration: '',
    age: '',
    gender: '',
    additionalInfo: ''
  })
  const [language, setLanguage] = useState('en')
  const [isLoading, setIsLoading] = useState(false)
  const [analysis, setAnalysis] = useState<any>(null)

  if (status === 'unauthenticated') {
    router.push('/auth/signin')
    return null
  }

  const addSymptom = (symptom: string) => {
    if (!selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms([...selectedSymptoms, symptom])
    }
  }

  const removeSymptom = (symptom: string) => {
    setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom))
  }

  const addCustomSymptom = () => {
    if (customSymptom.trim() && !selectedSymptoms.includes(customSymptom.trim())) {
      setSelectedSymptoms([...selectedSymptoms, customSymptom.trim()])
      setCustomSymptom('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (selectedSymptoms.length === 0) {
      toast.error('Please select at least one symptom')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/symptom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symptoms: selectedSymptoms,
          severity: formData.severity,
          duration: formData.duration,
          age: formData.age || session?.user?.age || 25,
          gender: formData.gender || session?.user?.gender || 'not specified',
          additionalInfo: formData.additionalInfo,
          language
        })
      })

      if (response.ok) {
        const result = await response.json()
        setAnalysis(result)
        toast.success('Analysis completed!')
      } else {
        toast.error('Failed to analyze symptoms')
      }
    } catch (error) {
      toast.error('Network error')
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setSelectedSymptoms([])
    setFormData({
      severity: 'mild',
      duration: '',
      age: '',
      gender: '',
      additionalInfo: ''
    })
    setAnalysis(null)
  }

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <Activity className="h-12 w-12 text-medical-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Symptom Checker</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Describe your symptoms and get AI-powered analysis with severity assessment and recommendations.
            This tool provides information only and should not replace professional medical advice.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Symptom Input Form */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-6">Describe Your Symptoms</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Language Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Globe className="inline h-4 w-4 mr-1" />
                  Preferred Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="input-field"
                >
                  {Object.entries(INDIAN_LANGUAGES).map(([code, name]) => (
                    <option key={code} value={code}>{name}</option>
                  ))}
                </select>
              </div>

              {/* Selected Symptoms */}
              {selectedSymptoms.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selected Symptoms ({selectedSymptoms.length})
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedSymptoms.map((symptom) => (
                      <span
                        key={symptom}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-medical-100 text-medical-800"
                      >
                        {symptom}
                        <button
                          type="button"
                          onClick={() => removeSymptom(symptom)}
                          className="ml-2 text-medical-600 hover:text-medical-800"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Common Symptoms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Common Symptoms (click to add)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {COMMON_SYMPTOMS.map((symptom) => (
                    <button
                      key={symptom}
                      type="button"
                      onClick={() => addSymptom(symptom)}
                      disabled={selectedSymptoms.includes(symptom)}
                      className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedSymptoms.includes(symptom)
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {symptom}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Symptom */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add Custom Symptom
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={customSymptom}
                    onChange={(e) => setCustomSymptom(e.target.value)}
                    placeholder="Describe your symptom"
                    className="flex-1 input-field"
                  />
                  <button
                    type="button"
                    onClick={addCustomSymptom}
                    className="btn-secondary px-4"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Severity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <AlertTriangle className="inline h-4 w-4 mr-1" />
                  Severity Level
                </label>
                <select
                  value={formData.severity}
                  onChange={(e) => setFormData({...formData, severity: e.target.value})}
                  className="input-field"
                  required
                >
                  <option value="mild">Mild - Manageable discomfort</option>
                  <option value="moderate">Moderate - Noticeable impact on daily activities</option>
                  <option value="severe">Severe - Significant distress or disability</option>
                </select>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="inline h-4 w-4 mr-1" />
                  Duration
                </label>
                <select
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  className="input-field"
                  required
                >
                  <option value="">Select duration</option>
                  <option value="less than 1 day">Less than 1 day</option>
                  <option value="1-3 days">1-3 days</option>
                  <option value="4-7 days">4-7 days</option>
                  <option value="1-2 weeks">1-2 weeks</option>
                  <option value="2-4 weeks">2-4 weeks</option>
                  <option value="more than 1 month">More than 1 month</option>
                </select>
              </div>

              {/* Demographics */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                    placeholder={session?.user?.age?.toString() || "Age"}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    className="input-field"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Additional Information */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Information (Optional)
                </label>
                <textarea
                  value={formData.additionalInfo}
                  onChange={(e) => setFormData({...formData, additionalInfo: e.target.value})}
                  placeholder="Any additional details about your symptoms, medical history, or concerns..."
                  rows={3}
                  className="input-field"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={isLoading || selectedSymptoms.length === 0}
                  className="flex-1 btn-primary py-3"
                >
                  {isLoading ? 'Analyzing...' : 'Analyze Symptoms'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn-secondary px-6"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>

          {/* Analysis Results */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-6">Analysis Results</h2>
            
            {!analysis ? (
              <div className="text-center py-12">
                <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  Complete the symptom form to get your AI-powered health analysis
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 mr-2" />
                    <div>
                      <h3 className="font-medium text-yellow-800">Medical Disclaimer</h3>
                      <p className="text-sm text-yellow-700 mt-1">
                        This analysis is for informational purposes only. Always consult healthcare professionals for proper diagnosis and treatment.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Symptom Analysis</h3>
                  <div className="text-sm leading-relaxed">
                    {analysis.analysis.split('\n').map((line: string, index: number) => (
                      line.trim() ? (
                        <p key={index} className="mb-3 text-gray-800">
                          {line.startsWith('•') ? (
                            <span className="flex items-start">
                              <span className="text-medical-600 mr-2 mt-1">•</span>
                              <span>{line.substring(1).trim()}</span>
                            </span>
                          ) : line}
                        </p>
                      ) : <br key={index} />
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Recommendations</h3>
                  <div className="text-sm leading-relaxed">
                    {analysis.suggestions.split('\n').map((line: string, index: number) => (
                      line.trim() ? (
                        <p key={index} className="mb-3 text-gray-800">
                          {line.startsWith('•') ? (
                            <span className="flex items-start">
                              <span className="text-medical-600 mr-2 mt-1">•</span>
                              <span>{line.substring(1).trim()}</span>
                            </span>
                          ) : line}
                        </p>
                      ) : <br key={index} />
                    ))}
                  </div>
                </div>

                {language !== 'en' && analysis.originalAnalysis && (
                  <div className="border-t pt-4">
                    <h3 className="font-semibold text-gray-900 mb-3">English Translation</h3>
                    <details className="text-sm text-gray-600">
                      <summary className="cursor-pointer hover:text-gray-800">View original English analysis</summary>
                      <div className="mt-2 space-y-2">
                        <div>
                          <strong>Analysis:</strong>
                          <p>{analysis.originalAnalysis}</p>
                        </div>
                        <div>
                          <strong>Suggestions:</strong>
                          <p>{analysis.originalSuggestions}</p>
                        </div>
                      </div>
                    </details>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}