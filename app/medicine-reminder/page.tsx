'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { 
  Pill, Plus, Clock, Calendar, Bell, CheckCircle, 
  X, Edit3, Trash2, AlertCircle, Target, Zap, Star
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import toast from 'react-hot-toast'

interface MedicineReminder {
  id: string
  medicineName: string
  dosage: string
  frequency: string
  times: string[]
  startDate: string
  endDate?: string
  instructions: string
  isActive: boolean
  nextDose?: string
  createdAt: string
}

export default function MedicineReminder() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [reminders, setReminders] = useState<MedicineReminder[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingReminder, setEditingReminder] = useState<MedicineReminder | null>(null)
  const [newReminder, setNewReminder] = useState({
    medicineName: '',
    dosage: '',
    frequency: 'daily',
    times: ['09:00'],
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    instructions: ''
  })

  const frequencies = [
    { value: 'daily', label: 'Daily', times: 1 },
    { value: 'twice-daily', label: 'Twice Daily', times: 2 },
    { value: 'three-times', label: 'Three Times Daily', times: 3 },
    { value: 'four-times', label: 'Four Times Daily', times: 4 },
    { value: 'weekly', label: 'Weekly', times: 1 },
    { value: 'as-needed', label: 'As Needed', times: 1 }
  ]

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (session) {
      fetchReminders()
    }
  }, [status, session, router])

  const fetchReminders = async () => {
    try {
      const response = await fetch('/api/medicine-reminders')
      if (response.ok) {
        const data = await response.json()
        setReminders(data)
      }
    } catch (error) {
      console.error('Failed to fetch reminders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddReminder = async () => {
    if (!newReminder.medicineName || !newReminder.dosage) {
      toast.error('Please fill all required fields')
      return
    }

    try {
      const response = await fetch('/api/medicine-reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReminder)
      })

      if (response.ok) {
        const reminder = await response.json()
        setReminders(prev => [reminder, ...prev])
        setShowAddModal(false)
        resetForm()
        toast.success('Medicine reminder added successfully')
      } else {
        toast.error('Failed to add reminder')
      }
    } catch (error) {
      toast.error('Network error')
    }
  }

  const handleToggleReminder = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/medicine-reminders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive })
      })

      if (response.ok) {
        setReminders(prev => prev.map(reminder => 
          reminder.id === id ? { ...reminder, isActive: !isActive } : reminder
        ))
        toast.success(`Reminder ${!isActive ? 'activated' : 'deactivated'}`)
      }
    } catch (error) {
      toast.error('Failed to update reminder')
    }
  }

  const handleDeleteReminder = async (id: string) => {
    if (!confirm('Are you sure you want to delete this reminder?')) return

    try {
      const response = await fetch(`/api/medicine-reminders/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setReminders(prev => prev.filter(reminder => reminder.id !== id))
        toast.success('Reminder deleted successfully')
      }
    } catch (error) {
      toast.error('Failed to delete reminder')
    }
  }

  const resetForm = () => {
    setNewReminder({
      medicineName: '',
      dosage: '',
      frequency: 'daily',
      times: ['09:00'],
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      instructions: ''
    })
  }

  const updateFrequencyTimes = (frequency: string) => {
    const freq = frequencies.find(f => f.value === frequency)
    if (freq) {
      const defaultTimes: string[] = []
      for (let i = 0; i < freq.times; i++) {
        const hour = 9 + (i * 8) // 9 AM, 5 PM, etc.
        defaultTimes.push(`${hour.toString().padStart(2, '0')}:00`)
      }
      setNewReminder(prev => ({ ...prev, frequency, times: defaultTimes }))
    }
  }

  const getNextDoseTime = (reminder: MedicineReminder) => {
    const now = new Date()
    const today = now.toDateString()
    
    for (const time of reminder.times) {
      const [hours, minutes] = time.split(':').map(Number)
      const doseTime = new Date()
      doseTime.setHours(hours, minutes, 0, 0)
      
      if (doseTime > now) {
        return doseTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    }
    
    // If no more doses today, return first dose tomorrow
    const [hours, minutes] = reminder.times[0].split(':').map(Number)
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(hours, minutes, 0, 0)
    return `Tomorrow ${tomorrow.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
  }

  const activeReminders = reminders.filter(r => r.isActive)
  const todayReminders = activeReminders.filter(reminder => {
    const today = new Date().toDateString()
    const startDate = new Date(reminder.startDate).toDateString()
    const endDate = reminder.endDate ? new Date(reminder.endDate).toDateString() : null
    
    return startDate <= today && (!endDate || endDate >= today)
  })

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
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-medical-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
            <div className="relative p-6 bg-gradient-to-r from-primary-100 to-medical-100 dark:from-primary-900/30 dark:to-medical-900/30 rounded-full w-24 h-24 mx-auto flex items-center justify-center">
              <Pill className="h-12 w-12 text-primary-600 dark:text-primary-400 animate-bounce-gentle" />
            </div>
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-black mb-6">
            <span className="gradient-text">Medicine Reminder</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Never miss your medication with smart reminders and tracking
          </p>
        </div>

        {/* Add Reminder Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary text-lg px-8 py-4 flex items-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <Plus className="h-6 w-6" />
            <span>Add Medicine Reminder</span>
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Today's Reminders */}
          <div className="card animate-slide-up">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl text-white">
                <Bell className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Today's Schedule</h2>
            </div>
            
            {todayReminders.length === 0 ? (
              <div className="text-center py-8">
                <div className="p-4 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-dark-700 to-dark-600 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Calendar className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 font-medium">No reminders for today</p>
              </div>
            ) : (
              <div className="space-y-4">
                {todayReminders.map((reminder, index) => (
                  <div 
                    key={reminder.id} 
                    className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200/50 dark:border-green-800/50 animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-900 dark:text-gray-100">{reminder.medicineName}</h3>
                      <span className="text-xs bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 px-2 py-1 rounded-full font-medium">
                        {reminder.dosage}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {reminder.times.map((time, idx) => (
                        <div key={idx} className="flex items-center space-x-2 text-sm">
                          <Clock className="h-4 w-4 text-green-600 dark:text-green-400" />
                          <span className="text-gray-700 dark:text-gray-300 font-medium">{time}</span>
                        </div>
                      ))}
                    </div>
                    {reminder.instructions && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 italic">{reminder.instructions}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* All Reminders */}
          <div className="lg:col-span-2">
            <div className="card animate-slide-up" style={{ animationDelay: '200ms' }}>
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl text-white">
                  <Target className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">All Reminders</h2>
              </div>
              
              {reminders.length === 0 ? (
                <div className="text-center py-16">
                  <div className="p-6 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-dark-700 to-dark-600 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                    <Pill className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">No Reminders Yet</h3>
                  <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto mb-6">
                    Start by adding your first medicine reminder to stay on track with your medication schedule.
                  </p>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="btn-primary"
                  >
                    Add Your First Reminder
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {reminders.map((reminder, index) => (
                    <div 
                      key={reminder.id} 
                      className={`p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg animate-slide-up ${
                        reminder.isActive 
                          ? 'bg-white dark:bg-dark-800 border-gray-200 dark:border-dark-700' 
                          : 'bg-gray-50 dark:bg-dark-800/50 border-gray-300 dark:border-dark-600 opacity-60'
                      }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className={`p-2 rounded-lg ${
                              reminder.isActive 
                                ? 'bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30' 
                                : 'bg-gray-200 dark:bg-dark-700'
                            }`}>
                              <Pill className={`h-5 w-5 ${
                                reminder.isActive 
                                  ? 'text-blue-600 dark:text-blue-400' 
                                  : 'text-gray-400'
                              }`} />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{reminder.medicineName}</h3>
                              <p className="text-gray-600 dark:text-gray-400">{reminder.dosage} • {reminder.frequency.replace('-', ' ')}</p>
                            </div>
                          </div>
                          
                          <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Schedule</h4>
                              <div className="space-y-1">
                                {reminder.times.map((time, idx) => (
                                  <div key={idx} className="flex items-center space-x-2 text-sm">
                                    <Clock className="h-4 w-4 text-primary-500" />
                                    <span className="text-gray-700 dark:text-gray-300">{time}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Duration</h4>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                <p>Start: {new Date(reminder.startDate).toLocaleDateString()}</p>
                                {reminder.endDate && (
                                  <p>End: {new Date(reminder.endDate).toLocaleDateString()}</p>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {reminder.instructions && (
                            <div className="mb-4">
                              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Instructions</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-dark-700 p-3 rounded-lg">
                                {reminder.instructions}
                              </p>
                            </div>
                          )}
                          
                          {reminder.isActive && (
                            <div className="flex items-center space-x-2 text-sm">
                              <Bell className="h-4 w-4 text-green-500" />
                              <span className="text-green-600 dark:text-green-400 font-medium">
                                Next dose: {getNextDoseTime(reminder)}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => handleToggleReminder(reminder.id, reminder.isActive)}
                            className={`p-2 rounded-lg transition-all duration-300 ${
                              reminder.isActive
                                ? 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20 hover:bg-green-200 dark:hover:bg-green-900/30'
                                : 'text-gray-400 bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600'
                            }`}
                            title={reminder.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {reminder.isActive ? <CheckCircle className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                          </button>
                          <button
                            onClick={() => setEditingReminder(reminder)}
                            className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-all duration-300"
                          >
                            <Edit3 className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteReminder(reminder.id)}
                            className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-300"
                          >
                            <Trash2 className="h-5 w-5" />
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
        {(showAddModal || editingReminder) && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-dark-800 rounded-2xl p-6 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {editingReminder ? 'Edit Reminder' : 'Add Medicine Reminder'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddModal(false)
                    setEditingReminder(null)
                    resetForm()
                  }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
                >
                  <X className="h-6 w-6 text-gray-500" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Medicine Name *
                    </label>
                    <input
                      type="text"
                      value={newReminder.medicineName}
                      onChange={(e) => setNewReminder(prev => ({ ...prev, medicineName: e.target.value }))}
                      placeholder="Enter medicine name"
                      className="input-field focus-ring"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Dosage *
                    </label>
                    <input
                      type="text"
                      value={newReminder.dosage}
                      onChange={(e) => setNewReminder(prev => ({ ...prev, dosage: e.target.value }))}
                      placeholder="e.g., 1 tablet, 5ml"
                      className="input-field focus-ring"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Frequency
                  </label>
                  <select
                    value={newReminder.frequency}
                    onChange={(e) => updateFrequencyTimes(e.target.value)}
                    className="input-field focus-ring"
                  >
                    {frequencies.map((freq) => (
                      <option key={freq.value} value={freq.value}>{freq.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Times
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {newReminder.times.map((time, index) => (
                      <input
                        key={index}
                        type="time"
                        value={time}
                        onChange={(e) => {
                          const newTimes = [...newReminder.times]
                          newTimes[index] = e.target.value
                          setNewReminder(prev => ({ ...prev, times: newTimes }))
                        }}
                        className="input-field focus-ring text-sm"
                      />
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={newReminder.startDate}
                      onChange={(e) => setNewReminder(prev => ({ ...prev, startDate: e.target.value }))}
                      className="input-field focus-ring"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      End Date (Optional)
                    </label>
                    <input
                      type="date"
                      value={newReminder.endDate}
                      onChange={(e) => setNewReminder(prev => ({ ...prev, endDate: e.target.value }))}
                      className="input-field focus-ring"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Instructions (Optional)
                  </label>
                  <textarea
                    value={newReminder.instructions}
                    onChange={(e) => setNewReminder(prev => ({ ...prev, instructions: e.target.value }))}
                    placeholder="e.g., Take with food, Before meals"
                    rows={3}
                    className="input-field focus-ring"
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-8">
                <button
                  onClick={() => {
                    setShowAddModal(false)
                    setEditingReminder(null)
                    resetForm()
                  }}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddReminder}
                  className="flex-1 btn-primary"
                >
                  {editingReminder ? 'Update' : 'Add'} Reminder
                </button>
              </div>
            </div>
          </div>
        )}
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