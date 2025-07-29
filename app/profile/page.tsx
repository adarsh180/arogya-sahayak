'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { User, Mail, Phone, Calendar, MapPin, Globe, Save, History, Activity } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { INDIAN_LANGUAGES } from '@/lib/ai'
import toast from 'react-hot-toast'

export default function Profile() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [chatHistory, setChatHistory] = useState<any[]>([])
  const [symptomHistory, setSymptomHistory] = useState<any[]>([])
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    location: '',
    preferredLanguage: 'en',
    userType: 'patient'
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (session?.user) {
      setFormData({
        name: session.user.name || '',
        email: session.user.email || '',
        phone: (session.user as any).phone || '',
        age: (session.user as any).age?.toString() || '',
        gender: (session.user as any).gender || '',
        location: (session.user as any).location || '',
        preferredLanguage: (session.user as any).preferredLanguage || 'en',
        userType: (session.user as any).userType || 'patient'
      })
      fetchUserHistory()
    }
  }, [status, session, router])

  const fetchUserHistory = async () => {
    try {
      // Fetch chat history
      const chatResponse = await fetch('/api/chat')
      if (chatResponse.ok) {
        const chats = await chatResponse.json()
        setChatHistory(chats.slice(0, 10)) // Show last 10 chats
      }

      // Fetch symptom history
      const symptomResponse = await fetch('/api/symptom')
      if (symptomResponse.ok) {
        const symptoms = await symptomResponse.json()
        setSymptomHistory(symptoms.slice(0, 10)) // Show last 10 symptom checks
      }
    } catch (error) {
      console.error('Failed to fetch user history:', error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast.success('Profile updated successfully!')
        setIsEditing(false)
        // Update session
        await update()
      } else {
        toast.error('Failed to update profile')
      }
    } catch (error) {
      toast.error('Network error')
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
          <p className="text-gray-600">Manage your account information and preferences</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Personal Information</h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn-primary"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className="btn-primary flex items-center space-x-2"
                    >
                      <Save className="h-4 w-4" />
                      <span>{isLoading ? 'Saving...' : 'Save'}</span>
                    </button>
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="inline h-4 w-4 mr-1" />
                      Full Name
                    </label>
                    <input
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="input-field"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="inline h-4 w-4 mr-1" />
                      Email Address
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={true} // Email should not be editable
                      className="input-field bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="inline h-4 w-4 mr-1" />
                      Phone Number
                    </label>
                    <input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="input-field"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="inline h-4 w-4 mr-1" />
                      Age
                    </label>
                    <input
                      name="age"
                      type="number"
                      min="1"
                      max="120"
                      value={formData.age}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="input-field"
                      placeholder="Enter your age"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="input-field"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="inline h-4 w-4 mr-1" />
                      Location
                    </label>
                    <input
                      name="location"
                      type="text"
                      value={formData.location}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="input-field"
                      placeholder="City, State"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Globe className="inline h-4 w-4 mr-1" />
                      Preferred Language
                    </label>
                    <select
                      name="preferredLanguage"
                      value={formData.preferredLanguage}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="input-field"
                    >
                      {Object.entries(INDIAN_LANGUAGES).map(([code, name]) => (
                        <option key={code} value={code}>{name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Type
                    </label>
                    <select
                      name="userType"
                      value={formData.userType}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="input-field"
                    >
                      <option value="patient">Patient</option>
                      <option value="student">Medical Student</option>
                    </select>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Activity Summary */}
          <div className="space-y-6">
            {/* Stats Card */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Activity Summary</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Chats</span>
                  <span className="font-semibold">{chatHistory.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Symptom Checks</span>
                  <span className="font-semibold">{symptomHistory.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Account Type</span>
                  <span className="font-semibold capitalize">{formData.userType}</span>
                </div>
              </div>
            </div>

            {/* Recent Chat History */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <History className="h-5 w-5 mr-2" />
                Recent Chats
              </h3>
              <div className="space-y-3">
                {chatHistory.length === 0 ? (
                  <p className="text-gray-500 text-sm">No chat history yet</p>
                ) : (
                  chatHistory.map((chat) => (
                    <div key={chat.id} className="border-l-4 border-primary-200 pl-3">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {chat.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(chat.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Recent Symptom Checks */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Recent Symptom Checks
              </h3>
              <div className="space-y-3">
                {symptomHistory.length === 0 ? (
                  <p className="text-gray-500 text-sm">No symptom checks yet</p>
                ) : (
                  symptomHistory.map((symptom) => (
                    <div key={symptom.id} className="border-l-4 border-medical-200 pl-3">
                      <p className="text-sm font-medium text-gray-900">
                        {symptom.symptoms.slice(0, 2).join(', ')}
                        {symptom.symptoms.length > 2 && ` +${symptom.symptoms.length - 2} more`}
                      </p>
                      <p className="text-xs text-gray-500">
                        {symptom.severity} • {new Date(symptom.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}