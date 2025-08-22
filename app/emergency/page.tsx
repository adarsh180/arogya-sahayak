'use client'

import { Phone, MapPin, Clock, Heart, Truck, Shield, Plus, Star } from 'lucide-react'
import Navbar from '@/components/Navbar'

export default function Emergency() {
  const emergencyNumbers = [
    {
      id: 1,
      name: 'National Emergency',
      number: '112',
      description: 'Single emergency number for all services',
      type: 'national',
      available: '24/7',
      icon: Shield
    },
    {
      id: 2,
      name: 'Ambulance',
      number: '108',
      description: 'Emergency medical services',
      type: 'medical',
      available: '24/7',
      icon: Truck
    },
    {
      id: 3,
      name: 'Police',
      number: '100',
      description: 'Police emergency services',
      type: 'police',
      available: '24/7',
      icon: Shield
    },
    {
      id: 4,
      name: 'Fire Brigade',
      number: '101',
      description: 'Fire emergency services',
      type: 'fire',
      available: '24/7',
      icon: Shield
    }
  ]

  const nearbyHospitals = [
    {
      id: 1,
      name: 'AIIMS Delhi',
      address: 'Ansari Nagar, New Delhi',
      phone: '+91-11-2658-8500',
      distance: '2.5 km',
      rating: 4.8,
      specialties: ['Cardiology', 'Neurology', 'Emergency'],
      isOpen: true
    },
    {
      id: 2,
      name: 'Fortis Hospital',
      address: 'Sector 62, Noida',
      phone: '+91-120-247-2222',
      distance: '5.2 km',
      rating: 4.6,
      specialties: ['Cardiology', 'Orthopedics', 'ICU'],
      isOpen: true
    },
    {
      id: 3,
      name: 'Max Super Speciality',
      address: 'Saket, New Delhi',
      phone: '+91-11-2651-5050',
      distance: '7.8 km',
      rating: 4.7,
      specialties: ['Emergency', 'Trauma', 'Surgery'],
      isOpen: true
    }
  ]

  const personalContacts = [
    {
      id: 1,
      name: 'Dr. Rajesh Kumar',
      relation: 'Family Doctor',
      phone: '+91-98765-43210',
      specialty: 'General Medicine',
      available: 'Mon-Sat 9AM-6PM'
    },
    {
      id: 2,
      name: 'Dr. Priya Sharma',
      relation: 'Cardiologist',
      phone: '+91-98765-43211',
      specialty: 'Cardiology',
      available: 'Mon-Fri 10AM-5PM'
    }
  ]

  return (
    <div className="min-h-screen bg-neutral-950">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-100 mb-2">Emergency Contacts</h1>
          <p className="text-neutral-400">Quick access to emergency services and medical contacts</p>
        </div>

        {/* Emergency Alert */}
        <div className="mb-8 p-6 bg-gradient-to-r from-red-900/30 to-red-800/30 border border-red-700/40 rounded-2xl backdrop-blur-xl">
          <div className="flex items-center space-x-3 mb-3">
            <Heart className="h-6 w-6 text-red-400" />
            <h3 className="text-lg font-semibold text-red-100">Medical Emergency?</h3>
          </div>
          <p className="text-red-200 mb-4">If you're experiencing a life-threatening emergency, call immediately:</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="tel:112"
              className="flex items-center justify-center space-x-3 bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95"
            >
              <Phone className="h-5 w-5" />
              <span>Call 112 - Emergency</span>
            </a>
            <a
              href="tel:108"
              className="flex items-center justify-center space-x-3 bg-red-700 hover:bg-red-800 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95"
            >
              <Truck className="h-5 w-5" />
              <span>Call 108 - Ambulance</span>
            </a>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Emergency Numbers */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-semibold text-neutral-100 mb-6">Emergency Numbers</h2>
            <div className="space-y-4">
              {emergencyNumbers.map((emergency) => (
                <div key={emergency.id} className="card-interactive">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-red-900/30 rounded-xl flex items-center justify-center">
                        <emergency.icon className="h-5 w-5 text-red-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-neutral-100">{emergency.name}</h4>
                        <p className="text-sm text-neutral-400">{emergency.description}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-neutral-300">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">{emergency.available}</span>
                    </div>
                    
                    <a
                      href={`tel:${emergency.number}`}
                      className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-xl transition-all duration-200"
                    >
                      <Phone className="h-4 w-4" />
                      <span>{emergency.number}</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Nearby Hospitals */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-neutral-100 mb-6">Nearby Hospitals</h2>
            <div className="space-y-6">
              {nearbyHospitals.map((hospital) => (
                <div key={hospital.id} className="card-interactive">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-semibold text-neutral-100">{hospital.name}</h4>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-neutral-300">{hospital.rating}</span>
                        </div>
                        {hospital.isOpen && (
                          <span className="px-2 py-1 bg-green-900/30 text-green-400 rounded-full text-xs font-medium">
                            Open 24/7
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2 text-neutral-400 mb-3">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">{hospital.address}</span>
                        <span className="text-sm">• {hospital.distance}</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {hospital.specialties.map((specialty, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-primary-900/30 text-primary-400 rounded-full text-xs font-medium"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <a
                      href={`tel:${hospital.phone}`}
                      className="flex items-center space-x-2 text-primary-400 hover:text-primary-300 font-medium"
                    >
                      <Phone className="h-4 w-4" />
                      <span>{hospital.phone}</span>
                    </a>
                    
                    <div className="flex space-x-2">
                      <button className="btn-secondary px-4 py-2 text-sm">
                        Directions
                      </button>
                      <a
                        href={`tel:${hospital.phone}`}
                        className="btn-primary px-4 py-2 text-sm"
                      >
                        Call Now
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Personal Medical Contacts */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-neutral-100">Personal Medical Contacts</h2>
            <button className="btn-primary flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Contact</span>
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {personalContacts.map((contact) => (
              <div key={contact.id} className="card-interactive">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-neutral-100 text-lg">{contact.name}</h4>
                    <p className="text-neutral-400">{contact.relation}</p>
                  </div>
                  <div className="w-12 h-12 bg-medical-900/30 rounded-2xl flex items-center justify-center">
                    <Heart className="h-6 w-6 text-medical-400" />
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-neutral-300">
                    <span className="text-sm font-medium">Specialty:</span>
                    <span className="text-sm">{contact.specialty}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-neutral-300">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">{contact.available}</span>
                  </div>
                </div>
                
                <a
                  href={`tel:${contact.phone}`}
                  className="flex items-center justify-center space-x-2 bg-medical-600 hover:bg-medical-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 w-full"
                >
                  <Phone className="h-4 w-4" />
                  <span>{contact.phone}</span>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Important Notes */}
        <div className="mt-12 card">
          <h3 className="text-lg font-semibold text-neutral-100 mb-4">Important Emergency Guidelines</h3>
          <div className="space-y-3 text-neutral-300">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>Always call emergency services first in life-threatening situations</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>Keep your medical history and current medications list updated</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>Share this emergency contact list with family members</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>This app provides information only - always consult healthcare professionals</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}