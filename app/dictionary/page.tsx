'use client'

import { useState } from 'react'
import { Search, BookOpen, Heart, Brain, Stethoscope, Pill, Filter, Star } from 'lucide-react'
import Navbar from '@/components/Navbar'

export default function MedicalDictionary() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', name: 'All Terms', icon: BookOpen, count: 1250 },
    { id: 'cardiology', name: 'Cardiology', icon: Heart, count: 180 },
    { id: 'neurology', name: 'Neurology', icon: Brain, count: 220 },
    { id: 'general', name: 'General Medicine', icon: Stethoscope, count: 350 },
    { id: 'pharmacology', name: 'Pharmacology', icon: Pill, count: 280 }
  ]

  const medicalTerms = [
    {
      id: 1,
      term: 'Hypertension',
      category: 'cardiology',
      pronunciation: 'hahy-per-TEN-shuhn',
      definition: 'High blood pressure, a condition in which the force of the blood against the artery walls is too high.',
      hindiTerm: 'उच्च रक्तचाप',
      commonName: 'High Blood Pressure',
      relatedTerms: ['Systolic', 'Diastolic', 'Cardiovascular'],
      isFavorite: true
    },
    {
      id: 2,
      term: 'Diabetes Mellitus',
      category: 'general',
      pronunciation: 'dahy-uh-BEE-teez MEL-i-tuhs',
      definition: 'A group of metabolic disorders characterized by high blood sugar levels over a prolonged period.',
      hindiTerm: 'मधुमेह',
      commonName: 'Diabetes',
      relatedTerms: ['Glucose', 'Insulin', 'Hyperglycemia'],
      isFavorite: false
    },
    {
      id: 3,
      term: 'Myocardial Infarction',
      category: 'cardiology',
      pronunciation: 'mahy-uh-KAHR-dee-uhl in-FAHRK-shuhn',
      definition: 'Commonly known as a heart attack, occurs when blood flow decreases or stops to a part of the heart.',
      hindiTerm: 'हृदयाघात',
      commonName: 'Heart Attack',
      relatedTerms: ['Coronary', 'Ischemia', 'Cardiac'],
      isFavorite: true
    },
    {
      id: 4,
      term: 'Pneumonia',
      category: 'general',
      pronunciation: 'noo-MOHN-yuh',
      definition: 'An infection that inflames air sacs in one or both lungs, which may fill with fluid.',
      hindiTerm: 'निमोनिया',
      commonName: 'Lung Infection',
      relatedTerms: ['Respiratory', 'Alveoli', 'Bronchi'],
      isFavorite: false
    }
  ]

  const filteredTerms = medicalTerms.filter(term => {
    const matchesSearch = term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         term.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         term.hindiTerm.includes(searchTerm) ||
                         term.commonName.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === 'all' || term.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-neutral-950">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-100 mb-2">Medical Dictionary</h1>
          <p className="text-neutral-400">Comprehensive medical terminology in English and Hindi</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search medical terms, definitions, or Hindi translations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-neutral-900/90 backdrop-blur-xl border border-neutral-700/60 rounded-2xl focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500/60 text-neutral-100 placeholder-neutral-400 text-lg"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'bg-neutral-800/60 text-neutral-300 hover:bg-neutral-700/60 hover:text-neutral-100'
                }`}
              >
                <category.icon className="h-4 w-4" />
                <span>{category.name}</span>
                <span className="text-xs opacity-75">({category.count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {filteredTerms.length === 0 ? (
            <div className="card text-center py-20">
              <BookOpen className="h-16 w-16 text-neutral-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-neutral-100 mb-2">No terms found</h3>
              <p className="text-neutral-400">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            filteredTerms.map((term) => (
              <div key={term.id} className="card-interactive">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-2xl font-bold text-neutral-100">{term.term}</h3>
                      <button className={`p-1.5 rounded-lg transition-all duration-200 ${
                        term.isFavorite 
                          ? 'text-yellow-400 hover:text-yellow-300' 
                          : 'text-neutral-500 hover:text-yellow-400'
                      }`}>
                        <Star className={`h-5 w-5 ${term.isFavorite ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                    
                    <div className="flex items-center space-x-4 mb-3">
                      <span className="text-neutral-400 italic">/{term.pronunciation}/</span>
                      <span className="px-3 py-1 bg-primary-900/30 text-primary-400 rounded-full text-sm font-medium">
                        {categories.find(cat => cat.id === term.category)?.name}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-neutral-400 uppercase tracking-wider">Common Name:</span>
                        <p className="text-neutral-200 font-medium">{term.commonName}</p>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium text-neutral-400 uppercase tracking-wider">Hindi:</span>
                        <p className="text-neutral-200 font-medium text-lg">{term.hindiTerm}</p>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium text-neutral-400 uppercase tracking-wider">Definition:</span>
                        <p className="text-neutral-300 leading-relaxed">{term.definition}</p>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium text-neutral-400 uppercase tracking-wider">Related Terms:</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {term.relatedTerms.map((relatedTerm, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-neutral-800/60 text-neutral-300 rounded-lg text-sm hover:bg-neutral-700/60 cursor-pointer transition-all duration-200"
                            >
                              {relatedTerm}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.slice(1).map((category) => (
            <div key={category.id} className="card text-center">
              <div className="w-12 h-12 bg-primary-900/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <category.icon className="h-6 w-6 text-primary-400" />
              </div>
              <div className="text-2xl font-bold text-neutral-100 mb-1">{category.count}</div>
              <div className="text-sm text-neutral-400">{category.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}