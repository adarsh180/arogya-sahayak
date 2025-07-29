'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Pill, Plus, Clock, Calendar, Bell, Trash2, Edit } from 'lucide-react'
import Navbar from '@/components/Navbar'
import toast from 'react-hot-toast'

interface Medication {
  id: string
  name: string
  dosage: string
  frequency: string
  startDate: string
  endDate?: string
  reminders: string[]
  notes?: string
  isActive: boolean
}

export default function MedicineReminder() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [medications, setMedications] = useState<Medication[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: 'daily',
    startDate: '',
    endDate: '',
    reminders: ['08:00'],
    notes: ''
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (session) {
      fetchMedications()
    }
  }, [status, session, router])

  const fetchMedications = async () => {
    try {
      const response = await fetch('/api/medications')
      if (response.ok) {
        const data = await response.json()
        setMedications(data)
      }
    } catch (error) {
      console.error('Failed to fetch medications:', error)
    }
  }

  const addReminder = () => {
    setFormData({
      ...formData,
      reminders: [...formData.reminders, '12:00']
    })
  }

  const removeReminder = (index: number) => {
    setFormData({
      ...formData,
      reminders: formData.reminders.filter((_, i) => i !== index)
    })
  }

  const updateReminder = (index: number, time: string) => {
    const newReminders = [...formData.reminders]
    newReminders[index] = time
    setFormData({ ...formData, reminders: newReminders })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/medications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast.success('Medication reminder added!')
        setShowAddForm(false)
        setFormData({
          name: '',
          dosage: '',
          frequency: 'daily',
          startDate: '',
          endDate: '',
          reminders: ['08:00'],
          notes: ''
        })
        fetchMedications()
      } else {
        toast.error('Failed to add medication')
      }
    } catch (error) {
      toast.error('Network error')
    }
  }

  const deleteMedication = async (id: string) => {
    if (!confirm('Are you sure you want to delete this medication?')) return

    try {
      const response = await fetch(`/api/medications/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Medication deleted!')
        fetchMedications()
      } else {
        toast.error('Failed to delete medication')
      }
    } catch (error) {
      toast.error('Network error')
    }
  }

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <Pill className="h-12 w-12 text-purple-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Medicine Reminder</h1>
          <p className="text-gray-600">Never miss your medication schedule</p>
        </div>

        {/* Add Medication Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Medication</span>
          </button>
        </div>

        {/* Add Medication Form */}
        {showAddForm && (
          <div className="card mb-6">
            <h2 className="text-xl font-semibold mb-4">Add New Medication</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Medicine Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="input-field"
                    placeholder="e.g., Paracetamol"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dosage</label>
                  <input
                    type="text"
                    value={formData.dosage}
                    onChange={(e) => setFormData({...formData, dosage: e.target.value})}
                    className="input-field"
                    placeholder="e.g., 500mg"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
                  <select
                    value={formData.frequency}
                    onChange={(e) => setFormData({...formData, frequency: e.target.value})}
                    className="input-field"
                  >
                    <option value="daily">Daily</option>
                    <option value="twice">Twice a day</option>
                    <option value="thrice">Three times a day</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date (Optional)</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reminder Times</label>
                <div className="space-y-2">
                  {formData.reminders.map((time, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="time"
                        value={time}
                        onChange={(e) => updateReminder(index, e.target.value)}
                        className="input-field flex-1"
                      />
                      {formData.reminders.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeReminder(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addReminder}
                    className="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Add another time</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="input-field"
                  rows={3}
                  placeholder="Special instructions, side effects to watch for, etc."
                />
              </div>

              <div className="flex space-x-3">
                <button type="submit" className="btn-primary">
                  Add Medication
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Medications List */}
        <div className="space-y-4">
          {medications.length === 0 ? (
            <div className="card text-center py-12">
              <Pill className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No medications added yet</h3>
              <p className="text-gray-600">Add your first medication to get started with reminders</p>
            </div>
          ) : (
            medications.map((medication) => (
              <div key={medication.id} className="card">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Pill className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{medication.name}</h3>
                        <p className="text-sm text-gray-600">{medication.dosage} • {medication.frequency}</p>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Reminder Times:</p>
                        <div className="flex flex-wrap gap-2">
                          {medication.reminders.map((time, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              <Clock className="h-3 w-3 mr-1" />
                              {time}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Duration:</p>
                        <p className="text-sm text-gray-600">
                          {new Date(medication.startDate).toLocaleDateString()} - 
                          {medication.endDate ? new Date(medication.endDate).toLocaleDateString() : 'Ongoing'}
                        </p>
                      </div>
                    </div>

                    {medication.notes && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-700 mb-1">Notes:</p>
                        <p className="text-sm text-gray-600">{medication.notes}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => deleteMedication(medication.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}