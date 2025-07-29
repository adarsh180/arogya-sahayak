'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Phone, MapPin, Plus, User, Shield, Trash2 } from 'lucide-react'
import Navbar from '@/components/Navbar'
import toast from 'react-hot-toast'

interface EmergencyContact {
  id: string
  name: string
  type: string
  phone: string
  address?: string
  specialty?: string
  isActive: boolean
}

export default function EmergencyContacts() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [contacts, setContacts] = useState<EmergencyContact[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    type: 'hospital',
    phone: '',
    address: '',
    specialty: ''
  })

  const emergencyNumbers = [
    { name: 'Police', number: '100', icon: Shield, color: 'bg-blue-600' },
    { name: 'Fire', number: '101', icon: Shield, color: 'bg-red-600' },
    { name: 'Ambulance', number: '102', icon: Phone, color: 'bg-green-600' },
    { name: 'Emergency', number: '112', icon: Phone, color: 'bg-purple-600' },
  ]

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (session) {
      fetchContacts()
    }
  }, [status, session, router])

  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/emergency-contacts')
      if (response.ok) {
        const data = await response.json()
        setContacts(data)
      }
    } catch (error) {
      console.error('Failed to fetch contacts:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/emergency-contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast.success('Emergency contact added!')
        setShowAddForm(false)
        setFormData({
          name: '',
          type: 'hospital',
          phone: '',
          address: '',
          specialty: ''
        })
        fetchContacts()
      } else {
        toast.error('Failed to add contact')
      }
    } catch (error) {
      toast.error('Network error')
    }
  }

  const deleteContact = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact?')) return

    try {
      const response = await fetch(`/api/emergency-contacts/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Contact deleted!')
        fetchContacts()
      } else {
        toast.error('Failed to delete contact')
      }
    } catch (error) {
      toast.error('Network error')
    }
  }

  const getContactIcon = (type: string) => {
    switch (type) {
      case 'hospital': return Hospital
      case 'ambulance': return Ambulance
      case 'doctor': return User
      default: return Phone
    }
  }

  const getContactColor = (type: string) => {
    switch (type) {
      case 'hospital': return 'bg-blue-100 text-blue-600'
      case 'ambulance': return 'bg-red-100 text-red-600'
      case 'doctor': return 'bg-green-100 text-green-600'
      default: return 'bg-gray-100 text-gray-600'
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
          <Phone className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Emergency Contacts</h1>
          <p className="text-gray-600">Quick access to emergency services and your medical contacts</p>
        </div>

        {/* Emergency Numbers */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Emergency Numbers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {emergencyNumbers.map((emergency) => (
              <a
                key={emergency.number}
                href={`tel:${emergency.number}`}
                className="card text-center hover:shadow-lg transition-all duration-200 group"
              >
                <div className={`w-12 h-12 ${emergency.color} rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                  <emergency.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-medium text-gray-900 text-sm mb-1">{emergency.name}</h3>
                <p className="text-lg font-bold text-gray-900">{emergency.number}</p>
              </a>
            ))}
          </div>
        </div>

        {/* Add Contact Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Emergency Contact</span>
          </button>
        </div>

        {/* Add Contact Form */}
        {showAddForm && (
          <div className="card mb-6">
            <h2 className="text-xl font-semibold mb-4">Add Emergency Contact</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="input-field"
                    placeholder="Hospital/Doctor name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="input-field"
                  >
                    <option value="hospital">Hospital</option>
                    <option value="ambulance">Ambulance</option>
                    <option value="doctor">Doctor</option>
                    <option value="family">Family</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="input-field"
                    placeholder="+91 9876543210"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Specialty (for doctors)</label>
                  <input
                    type="text"
                    value={formData.specialty}
                    onChange={(e) => setFormData({...formData, specialty: e.target.value})}
                    className="input-field"
                    placeholder="Cardiologist, Neurologist, etc."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="input-field"
                  rows={3}
                  placeholder="Full address with landmarks"
                />
              </div>

              <div className="flex space-x-3">
                <button type="submit" className="btn-primary">
                  Add Contact
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

        {/* Contacts List */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Emergency Contacts</h2>
          <div className="space-y-4">
            {contacts.length === 0 ? (
              <div className="card text-center py-12">
                <Phone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No emergency contacts added yet</h3>
                <p className="text-gray-600">Add your trusted medical contacts for quick access during emergencies</p>
              </div>
            ) : (
              contacts.map((contact) => {
                const Icon = getContactIcon(contact.type)
                return (
                  <div key={contact.id} className="card">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className={`p-3 rounded-lg ${getContactColor(contact.type)}`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="text-lg font-semibold text-gray-900">{contact.name}</h3>
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full capitalize">
                              {contact.type}
                            </span>
                          </div>
                          
                          <div className="space-y-2">
                            <a
                              href={`tel:${contact.phone}`}
                              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                            >
                              <Phone className="h-4 w-4" />
                              <span>{contact.phone}</span>
                            </a>
                            
                            {contact.specialty && (
                              <p className="text-sm text-gray-600">
                                <strong>Specialty:</strong> {contact.specialty}
                              </p>
                            )}
                            
                            {contact.address && (
                              <div className="flex items-start space-x-2 text-gray-600">
                                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{contact.address}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => deleteContact(contact.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}