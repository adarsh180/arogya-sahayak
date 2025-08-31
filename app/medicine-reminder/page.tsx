'use client'

import { useState, useEffect } from 'react'
import { Pill, Plus, Clock, Bell, Calendar, Trash2, Edit3, CheckCircle, X, AlertTriangle, Info, Shield, Zap } from 'lucide-react'
import Navbar from '@/components/Navbar'

export default function MedicineReminder() {
  const [activeTab, setActiveTab] = useState('today')
  const [medicines, setMedicines] = useState<any[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({})
  const [selectedMedicine, setSelectedMedicine] = useState(null)
  const [notifications, setNotifications] = useState<any[]>([])
  const [currentTime, setCurrentTime] = useState(new Date())
  const [mounted, setMounted] = useState(false)

  // Load medicines and setup real-time updates
  useEffect(() => {
    setMounted(true)
    loadMedicines()
    requestNotificationPermission()
    
    // Update current time every minute
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    
    // Check for medicine reminders every minute
    const reminderInterval = setInterval(() => {
      checkMedicineReminders()
    }, 60000)
    
    return () => {
      clearInterval(timeInterval)
      clearInterval(reminderInterval)
    }
  }, [])

  const loadMedicines = async () => {
    try {
      const response = await fetch('/api/medicines')
      if (response.ok) {
        const data = await response.json()
        setMedicines(data)
      }
    } catch (error) {
      console.error('Failed to load medicines:', error)
    }
  }

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission()
    }
  }

  const checkMedicineReminders = () => {
    const now = new Date()
    const currentTimeStr = now.toTimeString().slice(0, 5)
    
    medicines.forEach((medicine: any) => {
      if (medicine.isActive && medicine.reminders) {
        medicine.reminders.forEach((reminderTime: string) => {
          if (reminderTime === currentTimeStr) {
            showNotification(medicine)
          }
        })
      }
    })
  }

  const showNotification = (medicine: any) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`Time for ${medicine.name}`, {
        body: `Take ${medicine.dosage} now`,
        icon: '/images/pill-bottle.png'
      })
    }
    
    // Add to in-app notifications
    setNotifications(prev => [{
      id: Date.now(),
      medicine: medicine.name,
      dosage: medicine.dosage,
      time: new Date().toLocaleTimeString()
    }, ...prev.slice(0, 4)])
  }

  const getTodaySchedule = () => {
    const today = new Date().toDateString()
    const schedule: any[] = []
    
    medicines.forEach((medicine: any) => {
      if (medicine.isActive && medicine.reminders) {
        medicine.reminders.forEach((time: string) => {
          schedule.push({
            ...medicine,
            time,
            taken: false // This would come from a separate tracking table
          })
        })
      }
    })
    
    return schedule.sort((a, b) => a.time.localeCompare(b.time))
  }

  async function handleAddMedicine(medicineData: any) {
    setLoading(true)
    try {
      const response = await fetch('/api/medicines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(medicineData)
      })
      
      if (response.ok) {
        await loadMedicines()
        setShowAddModal(false)
      }
    } catch (error) {
      console.error('Failed to add medicine:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-neutral-100 mb-2">Medicine Reminder</h1>
              <p className="text-neutral-400">Never miss your medications with smart reminders</p>
            </div>
            <div className="flex items-center space-x-4">
              {notifications.length > 0 && (
                <div className="flex items-center space-x-2 px-3 py-2 bg-orange-900/20 border border-orange-700/40 rounded-xl">
                  <Bell className="h-4 w-4 text-orange-400" />
                  <span className="text-sm text-orange-400">{notifications.length} reminders</span>
                </div>
              )}
              <button 
                onClick={() => setShowAddModal(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Add Medicine</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-neutral-900/50 p-1 rounded-2xl backdrop-blur-xl border border-neutral-800/40">
            {[
              { id: 'today', name: "Today's Schedule", icon: Clock },
              { id: 'all', name: 'All Medicines', icon: Pill },
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

        {/* Today's Schedule */}
        {activeTab === 'today' && (
          <div className="space-y-6">
            {/* Real-time Notifications */}
            {notifications.length > 0 && (
              <div className="card bg-orange-900/10 border-orange-700/40">
                <h3 className="text-lg font-semibold text-orange-400 mb-4 flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Recent Reminders
                </h3>
                <div className="space-y-2">
                  {notifications.map(notif => (
                    <div key={notif.id} className="flex items-center justify-between p-3 bg-neutral-800/40 rounded-xl">
                      <div>
                        <span className="text-neutral-100 font-medium">{notif.medicine}</span>
                        <span className="text-neutral-400 text-sm ml-2">{notif.dosage}</span>
                      </div>
                      <span className="text-xs text-neutral-500">{notif.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Today's Schedule */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-neutral-100">Today's Schedule</h3>
                <div className="text-sm text-neutral-400">
                  {mounted ? currentTime.toLocaleTimeString() : '--:--:--'}
                </div>
              </div>
              
              {getTodaySchedule().length === 0 ? (
                <div className="card text-center py-12">
                  <Pill className="h-16 w-16 text-neutral-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-neutral-100 mb-2">No medicines scheduled</h3>
                  <p className="text-neutral-400">Add your first medicine to get started</p>
                </div>
              ) : (
                getTodaySchedule().map((medicine, index) => (
                  <div key={`${medicine.id}-${index}`} className="card-interactive border border-neutral-700/40">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-primary-900/30 rounded-2xl flex items-center justify-center">
                          <Pill className="h-6 w-6 text-primary-400" />
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-neutral-100">{medicine.name}</h4>
                          <p className="text-sm text-neutral-400">{medicine.dosage} • {medicine.frequency}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="flex items-center space-x-2 text-neutral-300">
                            <Clock className="h-4 w-4" />
                            <span className="font-medium">{medicine.time}</span>
                          </div>
                        </div>
                        
                        <button 
                          onClick={() => setSelectedMedicine(medicine)}
                          className="btn-secondary px-4 py-2 text-sm"
                        >
                          View Info
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* All Medicines */}
        {activeTab === 'all' && (
          <div className="space-y-6">
            {medicines.length === 0 ? (
              <div className="card text-center py-12">
                <Pill className="h-16 w-16 text-neutral-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-neutral-100 mb-2">No medicines added</h3>
                <p className="text-neutral-400">Add your first medicine to start tracking</p>
              </div>
            ) : (
              medicines.map((medicine) => (
                <div key={medicine.id} className="card-interactive">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        medicine.isActive ? 'bg-primary-900/30' : 'bg-neutral-800/60'
                      }`}>
                        <Pill className={`h-6 w-6 ${
                          medicine.isActive ? 'text-primary-400' : 'text-neutral-500'
                        }`} />
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-neutral-100 text-lg">{medicine.name}</h4>
                        <p className="text-neutral-400">{medicine.dosage} • {medicine.frequency}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-neutral-500">
                          <span>Start: {new Date(medicine.startDate).toLocaleDateString()}</span>
                          {medicine.endDate && <span>End: {new Date(medicine.endDate).toLocaleDateString()}</span>}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="text-right mr-4">
                        <div className="text-sm text-neutral-400 mb-1">Reminders</div>
                        <div className="space-y-1">
                          {medicine.reminders?.map((time: string, index: number) => (
                            <div key={index} className="flex items-center space-x-1 text-neutral-300">
                              <Bell className="h-3 w-3" />
                              <span className="text-sm">{time}</span>
                            </div>
                          )) || <span className="text-xs text-neutral-500">No reminders</span>}
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => setSelectedMedicine(medicine)}
                        className="p-2 hover:bg-neutral-800/60 rounded-xl transition-all duration-200 text-neutral-400"
                      >
                        <Info className="h-4 w-4" />
                      </button>
                      
                      <button className="p-2 hover:bg-medical-900/20 rounded-xl transition-all duration-200 text-medical-400">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* History */}
        {activeTab === 'history' && (
          <div className="card text-center py-20">
            <Calendar className="h-16 w-16 text-neutral-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-neutral-100 mb-2">History Coming Soon</h3>
            <p className="text-neutral-400">Your medication history and adherence reports will be available here.</p>
          </div>
        )}

        {/* Add Medicine Modal */}
        {showAddModal && (
          <AddMedicineModal 
            onClose={() => setShowAddModal(false)}
            onSave={handleAddMedicine}
            loading={loading}
          />
        )}

        {/* Medicine Info Modal */}
        {selectedMedicine && (
          <MedicineInfoModal 
            medicine={selectedMedicine}
            onClose={() => setSelectedMedicine(null)}
          />
        )}
      </div>
    </div>
  )
}

function AddMedicineModal({ onClose, onSave, loading }: any) {
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: 'daily',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    reminders: ['08:00'],
    notes: ''
  })

  const handleSubmit = (e: any) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-900 rounded-3xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto border border-neutral-800">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-neutral-100">Add Medicine</h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-200">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Medicine Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 bg-neutral-800/60 border border-neutral-700/40 rounded-2xl text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="e.g., Aspirin, Vitamin D3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Dosage</label>
            <input
              type="text"
              required
              value={formData.dosage}
              onChange={(e) => setFormData(prev => ({ ...prev, dosage: e.target.value }))}
              className="w-full px-4 py-3 bg-neutral-800/60 border border-neutral-700/40 rounded-2xl text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="e.g., 500mg, 1 tablet"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Frequency</label>
            <select
              value={formData.frequency}
              onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value }))}
              className="w-full px-4 py-3 bg-neutral-800/60 border border-neutral-700/40 rounded-2xl text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="daily">Daily</option>
              <option value="twice-daily">Twice Daily</option>
              <option value="three-times-daily">Three Times Daily</option>
              <option value="weekly">Weekly</option>
              <option value="as-needed">As Needed</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Start Date</label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full px-4 py-3 bg-neutral-800/60 border border-neutral-700/40 rounded-2xl text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">End Date (Optional)</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full px-4 py-3 bg-neutral-800/60 border border-neutral-700/40 rounded-2xl text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Reminder Times</label>
            <input
              type="time"
              value={formData.reminders[0] || '08:00'}
              onChange={(e) => setFormData(prev => ({ ...prev, reminders: [e.target.value] }))}
              className="w-full px-4 py-3 bg-neutral-800/60 border border-neutral-700/40 rounded-2xl text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Adding...' : 'Add Medicine'}
          </button>
        </form>
      </div>
    </div>
  )
}

function MedicineInfoModal({ medicine, onClose }: any) {
  const analysis = medicine.aiAnalysis

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-900 rounded-3xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-neutral-800">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-neutral-100">{medicine.name}</h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-200">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-neutral-800/40 rounded-2xl">
              <div className="text-sm text-neutral-400 mb-1">Dosage</div>
              <div className="text-lg font-semibold text-neutral-100">{medicine.dosage}</div>
            </div>
            <div className="p-4 bg-neutral-800/40 rounded-2xl">
              <div className="text-sm text-neutral-400 mb-1">Frequency</div>
              <div className="text-lg font-semibold text-neutral-100">{medicine.frequency}</div>
            </div>
          </div>

          {/* AI Analysis */}
          {analysis && (
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-neutral-100 flex items-center">
                <Zap className="h-5 w-5 text-primary-400 mr-2" />
                AI Analysis
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-900/20 border border-blue-700/40 rounded-2xl">
                  <div className="text-sm text-blue-400 mb-2">Purpose</div>
                  <div className="text-neutral-100">{analysis.purpose}</div>
                </div>
                
                <div className="p-4 bg-green-900/20 border border-green-700/40 rounded-2xl">
                  <div className="text-sm text-green-400 mb-2">Best Time</div>
                  <div className="text-neutral-100">{analysis.bestTime}</div>
                </div>
              </div>

              {analysis.sideEffects && (
                <div className="p-4 bg-yellow-900/20 border border-yellow-700/40 rounded-2xl">
                  <div className="text-sm text-yellow-400 mb-2 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    Common Side Effects
                  </div>
                  <div className="text-neutral-100 text-sm">
                    {analysis.sideEffects.join(', ')}
                  </div>
                </div>
              )}

              {analysis.precautions && (
                <div className="p-4 bg-red-900/20 border border-red-700/40 rounded-2xl">
                  <div className="text-sm text-red-400 mb-2 flex items-center">
                    <Shield className="h-4 w-4 mr-1" />
                    Precautions
                  </div>
                  <div className="text-neutral-100 text-sm">
                    {analysis.precautions.join(', ')}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Notes */}
          {medicine.notes && (
            <div className="p-4 bg-neutral-800/40 rounded-2xl">
              <div className="text-sm text-neutral-400 mb-2">Notes</div>
              <div className="text-neutral-100">{medicine.notes}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}