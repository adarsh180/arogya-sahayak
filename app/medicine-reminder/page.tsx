'use client'

import { useState } from 'react'
import { Pill, Plus, Clock, Bell, Calendar, Trash2, Edit3, CheckCircle } from 'lucide-react'
import Navbar from '@/components/Navbar'

export default function MedicineReminder() {
  const [activeTab, setActiveTab] = useState('today')

  const todayMedicines = [
    {
      id: 1,
      name: 'Vitamin D3',
      dosage: '1000 IU',
      time: '08:00 AM',
      taken: true,
      frequency: 'Daily',
      color: 'bg-green-900/20 border-green-700/40'
    },
    {
      id: 2,
      name: 'Metformin',
      dosage: '500mg',
      time: '12:00 PM',
      taken: false,
      frequency: 'Twice daily',
      color: 'bg-blue-900/20 border-blue-700/40'
    },
    {
      id: 3,
      name: 'Lisinopril',
      dosage: '10mg',
      time: '06:00 PM',
      taken: false,
      frequency: 'Daily',
      color: 'bg-medical-900/20 border-medical-700/40'
    },
    {
      id: 4,
      name: 'Omega-3',
      dosage: '1000mg',
      time: '09:00 PM',
      taken: false,
      frequency: 'Daily',
      color: 'bg-orange-900/20 border-orange-700/40'
    }
  ]

  const allMedicines = [
    {
      id: 1,
      name: 'Vitamin D3',
      dosage: '1000 IU',
      frequency: 'Daily',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      times: ['08:00 AM']
    },
    {
      id: 2,
      name: 'Metformin',
      dosage: '500mg',
      frequency: 'Twice daily',
      startDate: '2024-01-15',
      endDate: '2024-06-15',
      times: ['08:00 AM', '08:00 PM']
    },
    {
      id: 3,
      name: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Daily',
      startDate: '2024-02-01',
      endDate: '2024-08-01',
      times: ['06:00 PM']
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
              <h1 className="text-3xl font-bold text-neutral-100 mb-2">Medicine Reminder</h1>
              <p className="text-neutral-400">Never miss your medications with smart reminders</p>
            </div>
            <button className="btn-primary flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Add Medicine</span>
            </button>
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
            {/* Progress Overview */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-neutral-100">Today's Progress</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-neutral-400">1 of 4 taken</span>
                </div>
              </div>
              
              <div className="w-full bg-neutral-800 rounded-full h-3 mb-4">
                <div className="bg-gradient-to-r from-primary-500 to-medical-500 h-3 rounded-full" style={{ width: '25%' }}></div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-400">1</div>
                  <div className="text-sm text-neutral-400">Taken</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-400">3</div>
                  <div className="text-sm text-neutral-400">Pending</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-neutral-400">0</div>
                  <div className="text-sm text-neutral-400">Missed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary-400">4</div>
                  <div className="text-sm text-neutral-400">Total</div>
                </div>
              </div>
            </div>

            {/* Medicine Schedule */}
            <div className="space-y-4">
              {todayMedicines.map((medicine) => (
                <div
                  key={medicine.id}
                  className={`card-interactive ${medicine.color} border ${
                    medicine.taken ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        medicine.taken ? 'bg-green-900/30' : 'bg-neutral-800/60'
                      }`}>
                        {medicine.taken ? (
                          <CheckCircle className="h-6 w-6 text-green-400" />
                        ) : (
                          <Pill className="h-6 w-6 text-neutral-400" />
                        )}
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
                        <div className={`text-sm ${medicine.taken ? 'text-green-400' : 'text-orange-400'}`}>
                          {medicine.taken ? 'Taken' : 'Pending'}
                        </div>
                      </div>
                      
                      {!medicine.taken && (
                        <button className="btn-primary px-4 py-2 text-sm">
                          Mark Taken
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Medicines */}
        {activeTab === 'all' && (
          <div className="space-y-6">
            {allMedicines.map((medicine) => (
              <div key={medicine.id} className="card-interactive">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary-900/30 rounded-2xl flex items-center justify-center">
                      <Pill className="h-6 w-6 text-primary-400" />
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-neutral-100 text-lg">{medicine.name}</h4>
                      <p className="text-neutral-400">{medicine.dosage} • {medicine.frequency}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-neutral-500">
                        <span>Start: {medicine.startDate}</span>
                        <span>End: {medicine.endDate}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="text-right mr-4">
                      <div className="text-sm text-neutral-400 mb-1">Times</div>
                      <div className="space-y-1">
                        {medicine.times.map((time, index) => (
                          <div key={index} className="flex items-center space-x-1 text-neutral-300">
                            <Bell className="h-3 w-3" />
                            <span className="text-sm">{time}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <button className="p-2 hover:bg-neutral-800/60 rounded-xl transition-all duration-200 text-neutral-400">
                      <Edit3 className="h-4 w-4" />
                    </button>
                    
                    <button className="p-2 hover:bg-medical-900/20 rounded-xl transition-all duration-200 text-medical-400">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
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
      </div>
    </div>
  )
}