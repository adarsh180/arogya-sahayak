'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { 
  User, Mail, Phone, Calendar, MapPin, Globe, Save, History, 
  Activity, Edit3, Camera, Award, Target, TrendingUp, Star,
  Shield, Bell, Settings, Heart, Brain
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import { INDIAN_LANGUAGES } from '@/lib/ai'
import toast from 'react-hot-toast'

export default function Profile() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [chatHistory, setChatHistory] = useState<any[]>([])
  const [healthStats, setHealthStats] = useState({
    totalChats: 0,
    testsCompleted: 0,
    studyHours: 0,
    healthRecords: 0
  })
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    location: '',
    preferredLanguage: 'en',
    userType: 'patient',
    bio: '',
    emergencyContact: '',
    bloodGroup: '',
    allergies: ''
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (session?.user) {
      fetchUserProfile()
      fetchUserStats()
    }
  }, [status, session, router])

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/user/profile')
      if (response.ok) {
        const userData = await response.json()
        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          age: userData.age?.toString() || '',
          gender: userData.gender || '',
          location: userData.location || '',
          preferredLanguage: userData.preferredLanguage || 'en',
          userType: userData.userType || 'patient',
          bio: userData.bio || '',
          emergencyContact: userData.emergencyContact || '',
          bloodGroup: userData.bloodGroup || '',
          allergies: userData.allergies || ''
        })
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error)
    }
  }

  const fetchUserStats = async () => {
    try {
      const [chatResponse, mockTestResponse, healthResponse] = await Promise.all([
        fetch('/api/chat'),
        fetch('/api/mock-tests/stats'),
        fetch('/api/health-records')
      ])

      const chats = chatResponse.ok ? await chatResponse.json() : []
      const mockTests = mockTestResponse.ok ? await mockTestResponse.json() : { totalTests: 0 }
      const healthRecords = healthResponse.ok ? await healthResponse.json() : []

      setChatHistory(chats.slice(0, 5))
      setHealthStats({
        totalChats: chats.length,
        testsCompleted: mockTests.totalTests || 0,
        studyHours: Math.floor(Math.random() * 100), // Placeholder
        healthRecords: healthRecords.length
      })
    } catch (error) {
      console.error('Failed to fetch user stats:', error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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

  const achievements = [
    { title: 'Health Tracker', description: 'Logged 10+ health records', icon: Heart, color: 'from-red-500 to-pink-500', earned: healthStats.healthRecords >= 10 },
    { title: 'Chat Master', description: 'Completed 25+ AI conversations', icon: Brain, color: 'from-blue-500 to-purple-500', earned: healthStats.totalChats >= 25 },
    { title: 'Test Taker', description: 'Completed 5+ mock tests', icon: Target, color: 'from-green-500 to-emerald-500', earned: healthStats.testsCompleted >= 5 },
    { title: 'Study Streak', description: 'Studied for 50+ hours', icon: Award, color: 'from-yellow-500 to-orange-500', earned: healthStats.studyHours >= 50 }
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
            <div className="relative">
              <div className="w-32 h-32 mx-auto bg-gradient-to-r from-primary-100 to-medical-100 dark:from-primary-900/30 dark:to-medical-900/30 rounded-full flex items-center justify-center shadow-2xl">
                <User className="h-16 w-16 text-primary-600 dark:text-primary-400" />
              </div>
              <button className="absolute bottom-2 right-1/2 transform translate-x-6 p-2 bg-white dark:bg-dark-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
                <Camera className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-black mb-4">
            <span className="gradient-text">Profile Settings</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Manage your account information, preferences, and track your health journey
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <div className="card hover-lift animate-slide-up">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl text-white">
                    <User className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Personal Information</h2>
                </div>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Edit3 className="h-4 w-4" />
                    <span>Edit Profile</span>
                  </button>
                ) : (
                  <div className="flex space-x-3">
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
                      <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Basic Information</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        <User className="inline h-4 w-4 mr-2" />
                        Full Name
                      </label>
                      <input
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="input-field focus-ring"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        <Mail className="inline h-4 w-4 mr-2" />
                        Email Address
                      </label>
                      <input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={true}
                        className="input-field bg-gray-100 dark:bg-dark-700 cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        <Phone className="inline h-4 w-4 mr-2" />
                        Phone Number
                      </label>
                      <input
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="input-field focus-ring"
                        placeholder="Enter your phone number"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        <Calendar className="inline h-4 w-4 mr-2" />
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
                        className="input-field focus-ring"
                        placeholder="Enter your age"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Gender
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="input-field focus-ring"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        <MapPin className="inline h-4 w-4 mr-2" />
                        Location
                      </label>
                      <input
                        name="location"
                        type="text"
                        value={formData.location}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="input-field focus-ring"
                        placeholder="City, State, Country"
                      />
                    </div>
                  </div>
                </div>

                {/* Medical Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Medical Information</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Blood Group
                      </label>
                      <select
                        name="bloodGroup"
                        value={formData.bloodGroup}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="input-field focus-ring"
                      >
                        <option value="">Select Blood Group</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Emergency Contact
                      </label>
                      <input
                        name="emergencyContact"
                        type="tel"
                        value={formData.emergencyContact}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="input-field focus-ring"
                        placeholder="Emergency contact number"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Allergies & Medical Conditions
                    </label>
                    <textarea
                      name="allergies"
                      value={formData.allergies}
                      onChange={handleChange}
                      disabled={!isEditing}
                      rows={3}
                      className="input-field focus-ring"
                      placeholder="List any allergies, chronic conditions, or important medical information"
                    />
                  </div>
                </div>

                {/* Preferences */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Preferences</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        <Globe className="inline h-4 w-4 mr-2" />
                        Preferred Language
                      </label>
                      <select
                        name="preferredLanguage"
                        value={formData.preferredLanguage}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="input-field focus-ring"
                      >
                        {Object.entries(INDIAN_LANGUAGES).map(([code, name]) => (
                          <option key={code} value={code}>{name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Account Type
                      </label>
                      <select
                        name="userType"
                        value={formData.userType}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="input-field focus-ring"
                      >
                        <option value="patient">Patient</option>
                        <option value="student">Medical Student</option>
                        <option value="professional">Healthcare Professional</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      disabled={!isEditing}
                      rows={3}
                      className="input-field focus-ring"
                      placeholder="Tell us a bit about yourself..."
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats Card */}
            <div className="card hover-lift animate-slide-up" style={{ animationDelay: '200ms' }}>
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl text-white">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Activity Stats</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{healthStats.totalChats}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">AI Chats</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{healthStats.testsCompleted}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Tests</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{healthStats.studyHours}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Study Hours</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-xl">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">{healthStats.healthRecords}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Health Records</div>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="card hover-lift animate-slide-up" style={{ animationDelay: '300ms' }}>
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl text-white">
                  <Award className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Achievements</h3>
              </div>
              
              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <div 
                    key={achievement.title}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                      achievement.earned
                        ? `bg-gradient-to-r ${achievement.color.replace('500', '50').replace('600', '100')} dark:${achievement.color.replace('500', '900/20').replace('600', '800/20')} border-transparent`
                        : 'bg-gray-50 dark:bg-dark-700 border-gray-200 dark:border-dark-600 opacity-60'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        achievement.earned
                          ? `bg-gradient-to-r ${achievement.color} text-white`
                          : 'bg-gray-200 dark:bg-dark-600 text-gray-400'
                      }`}>
                        <achievement.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className={`font-bold ${
                          achievement.earned 
                            ? 'text-gray-900 dark:text-gray-100' 
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {achievement.title}
                        </h4>
                        <p className={`text-sm ${
                          achievement.earned 
                            ? 'text-gray-600 dark:text-gray-300' 
                            : 'text-gray-400 dark:text-gray-500'
                        }`}>
                          {achievement.description}
                        </p>
                      </div>
                      {achievement.earned && (
                        <Star className="h-5 w-5 text-yellow-500 fill-current ml-auto" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card hover-lift animate-slide-up" style={{ animationDelay: '400ms' }}>
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl text-white">
                  <History className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Recent Activity</h3>
              </div>
              
              <div className="space-y-4">
                {chatHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No recent activity</p>
                  </div>
                ) : (
                  chatHistory.map((chat, index) => (
                    <div 
                      key={chat.id} 
                      className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-dark-700 dark:to-dark-600 rounded-xl hover:shadow-md transition-all duration-300 animate-slide-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                          <Brain className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                            {chat.title || 'Medical Consultation'}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(chat.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Security Settings */}
            <div className="card hover-lift animate-slide-up" style={{ animationDelay: '500ms' }}>
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl text-white">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Security & Privacy</h3>
              </div>
              
              <div className="space-y-4">
                <button className="w-full text-left p-4 bg-gray-50 dark:bg-dark-700 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors duration-300">
                  <div className="flex items-center space-x-3">
                    <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">Notification Settings</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Manage your notifications</p>
                    </div>
                  </div>
                </button>
                
                <button className="w-full text-left p-4 bg-gray-50 dark:bg-dark-700 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors duration-300">
                  <div className="flex items-center space-x-3">
                    <Settings className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">Privacy Settings</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Control your data privacy</p>
                    </div>
                  </div>
                </button>
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