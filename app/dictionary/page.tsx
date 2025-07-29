'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { BookOpen, Search, Volume2, Heart, Star, Clock, Globe, Filter, X } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { INDIAN_LANGUAGES } from '@/lib/ai'
import toast from 'react-hot-toast'

interface MedicalTerm {
  id: string
  term: string
  pronunciation: string
  definition: string
  category: string
  synonyms: string[]
  relatedTerms: string[]
  examples: string[]
  language: string
  difficulty: 'basic' | 'intermediate' | 'advanced'
  isFavorite?: boolean
}

export default function MedicalDictionary() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [searchResults, setSearchResults] = useState<MedicalTerm[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const categories = [
    'all', 'anatomy', 'cardiology', 'neurology', 'oncology', 'pediatrics',
    'surgery', 'pharmacology', 'pathology', 'radiology', 'psychiatry',
    'dermatology', 'orthopedics', 'gynecology', 'ophthalmology', 'ent'
  ]

  const popularTerms = [
    'Hypertension', 'Diabetes', 'Pneumonia', 'Myocardial Infarction',
    'Stroke', 'Asthma', 'Arthritis', 'Anemia', 'Bronchitis', 'Gastritis'
  ]

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (session) {
      loadRecentSearches()
      loadFavorites()
    }
  }, [status, session, router])

  const loadRecentSearches = () => {
    const recent = localStorage.getItem('medicalDictionary_recent')
    if (recent) {
      setRecentSearches(JSON.parse(recent))
    }
  }

  const loadFavorites = () => {
    const favs = localStorage.getItem('medicalDictionary_favorites')
    if (favs) {
      setFavorites(JSON.parse(favs))
    }
  }

  const saveRecentSearch = (term: string) => {
    const updated = [term, ...recentSearches.filter(t => t !== term)].slice(0, 10)
    setRecentSearches(updated)
    localStorage.setItem('medicalDictionary_recent', JSON.stringify(updated))
  }

  const toggleFavorite = (termId: string) => {
    const updated = favorites.includes(termId)
      ? favorites.filter(id => id !== termId)
      : [...favorites, termId]
    setFavorites(updated)
    localStorage.setItem('medicalDictionary_favorites', JSON.stringify(updated))
  }

  const searchMedicalTerms = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsLoading(true)
    saveRecentSearch(query)

    try {
      const response = await fetch('/api/medical-dictionary/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          language: selectedLanguage,
          category: selectedCategory,
          difficulty: selectedDifficulty
        })
      })

      if (response.ok) {
        const results = await response.json()
        setSearchResults(results.map((term: MedicalTerm) => ({
          ...term,
          isFavorite: favorites.includes(term.id)
        })))
      } else {
        toast.error('Search failed')
      }
    } catch (error) {
      toast.error('Network error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    searchMedicalTerms(searchTerm)
  }

  const speakTerm = (text: string, language: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = language === 'en' ? 'en-US' : 'hi-IN'
      speechSynthesis.speak(utterance)
    } else {
      toast.error('Speech synthesis not supported')
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'basic': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      anatomy: 'bg-blue-100 text-blue-800',
      cardiology: 'bg-red-100 text-red-800',
      neurology: 'bg-purple-100 text-purple-800',
      oncology: 'bg-pink-100 text-pink-800',
      pediatrics: 'bg-green-100 text-green-800',
      surgery: 'bg-orange-100 text-orange-800',
      pharmacology: 'bg-indigo-100 text-indigo-800',
      pathology: 'bg-gray-100 text-gray-800',
      radiology: 'bg-cyan-100 text-cyan-800',
      psychiatry: 'bg-violet-100 text-violet-800'
    }
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <BookOpen className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Medical Dictionary</h1>
          <p className="text-gray-600">Comprehensive medical terminology in multiple languages</p>
        </div>

        {/* Search Section */}
        <div className="card mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                  placeholder="Search medical terms, symptoms, conditions..."
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <Filter className="h-4 w-4" />
                  <span>Filters</span>
                </button>
                <button type="submit" className="btn-primary" disabled={isLoading}>
                  {isLoading ? 'Searching...' : 'Search'}
                </button>
              </div>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="grid md:grid-cols-3 gap-4 pt-4 border-t">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="input-field"
                  >
                    {Object.entries(INDIAN_LANGUAGES).map(([code, name]) => (
                      <option key={code} value={code}>{name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="input-field"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="input-field"
                  >
                    <option value="all">All Levels</option>
                    <option value="basic">Basic</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>
            )}
          </form>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Popular Terms */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Popular Terms</h3>
              <div className="space-y-2">
                {popularTerms.map(term => (
                  <button
                    key={term}
                    onClick={() => {
                      setSearchTerm(term)
                      searchMedicalTerms(term)
                    }}
                    className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Recent Searches</h3>
                  <Clock className="h-4 w-4 text-gray-400" />
                </div>
                <div className="space-y-2">
                  {recentSearches.slice(0, 5).map((term, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSearchTerm(term)
                        searchMedicalTerms(term)
                      }}
                      className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Language Stats */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Available Languages</h3>
              <div className="flex items-center space-x-2 mb-2">
                <Globe className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-gray-600">29+ Indian Languages</span>
              </div>
              <div className="text-xs text-gray-500">
                Including Hindi, Bengali, Tamil, Telugu, Marathi, Gujarati, and more
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {searchResults.length === 0 && !isLoading && searchTerm && (
              <div className="card text-center py-12">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-600">Try different keywords or check spelling</p>
              </div>
            )}

            {searchResults.length === 0 && !searchTerm && (
              <div className="card text-center py-12">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Search Medical Terms</h3>
                <p className="text-gray-600">Enter a medical term, symptom, or condition to get detailed information</p>
              </div>
            )}

            {/* Search Results */}
            <div className="space-y-6">
              {searchResults.map((term) => (
                <div key={term.id} className="card">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{term.term}</h3>
                        <button
                          onClick={() => speakTerm(term.term, term.language)}
                          className="text-blue-600 hover:text-blue-700"
                          title="Pronounce"
                        >
                          <Volume2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => toggleFavorite(term.id)}
                          className={`${term.isFavorite ? 'text-yellow-500' : 'text-gray-400'} hover:text-yellow-500`}
                          title="Add to favorites"
                        >
                          <Star className={`h-4 w-4 ${term.isFavorite ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                      
                      {term.pronunciation && (
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Pronunciation:</strong> /{term.pronunciation}/
                        </p>
                      )}

                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(term.category)}`}>
                          {term.category}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(term.difficulty)}`}>
                          {term.difficulty}
                        </span>
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                          {INDIAN_LANGUAGES[term.language as keyof typeof INDIAN_LANGUAGES]}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Definition</h4>
                      <p className="text-gray-700 leading-relaxed">{term.definition}</p>
                    </div>

                    {term.synonyms.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Synonyms</h4>
                        <div className="flex flex-wrap gap-2">
                          {term.synonyms.map((synonym, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded">
                              {synonym}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {term.examples.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Examples</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {term.examples.map((example, index) => (
                            <li key={index} className="text-gray-700 text-sm">{example}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {term.relatedTerms.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Related Terms</h4>
                        <div className="flex flex-wrap gap-2">
                          {term.relatedTerms.map((related, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                setSearchTerm(related)
                                searchMedicalTerms(related)
                              }}
                              className="px-2 py-1 bg-blue-50 text-blue-700 text-sm rounded hover:bg-blue-100 transition-colors"
                            >
                              {related}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}