'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { 
  BookOpen, Search, Heart, Brain, Eye, Stethoscope, 
  Pill, Microscope, Star, Bookmark, Volume2, Copy,
  Filter, ArrowRight, Zap, Target, Award
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import toast from 'react-hot-toast'

interface MedicalTerm {
  id: string
  term: string
  definition: string
  pronunciation: string
  category: string
  examples: string[]
  relatedTerms: string[]
  difficulty: 'basic' | 'intermediate' | 'advanced'
  isFavorite?: boolean
}

export default function MedicalDictionary() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [searchResults, setSearchResults] = useState<MedicalTerm[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)

  const categories = [
    { id: 'all', name: 'All Categories', icon: BookOpen, color: 'from-gray-500 to-gray-600' },
    { id: 'anatomy', name: 'Anatomy', icon: Heart, color: 'from-red-500 to-pink-500' },
    { id: 'cardiology', name: 'Cardiology', icon: Heart, color: 'from-red-500 to-rose-500' },
    { id: 'neurology', name: 'Neurology', icon: Brain, color: 'from-purple-500 to-indigo-500' },
    { id: 'ophthalmology', name: 'Ophthalmology', icon: Eye, color: 'from-blue-500 to-cyan-500' },
    { id: 'pharmacology', name: 'Pharmacology', icon: Pill, color: 'from-green-500 to-emerald-500' },
    { id: 'pathology', name: 'Pathology', icon: Microscope, color: 'from-orange-500 to-amber-500' },
    { id: 'general', name: 'General Medicine', icon: Stethoscope, color: 'from-teal-500 to-cyan-500' }
  ]

  const difficulties = [
    { id: 'all', name: 'All Levels', color: 'text-gray-600 dark:text-gray-400' },
    { id: 'basic', name: 'Basic', color: 'text-green-600 dark:text-green-400' },
    { id: 'intermediate', name: 'Intermediate', color: 'text-yellow-600 dark:text-yellow-400' },
    { id: 'advanced', name: 'Advanced', color: 'text-red-600 dark:text-red-400' }
  ]

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (session) {
      loadFavorites()
    }
  }, [status, session, router])

  const loadFavorites = async () => {
    try {
      const response = await fetch('/api/medical-dictionary/favorites')
      if (response.ok) {
        const data = await response.json()
        setFavorites(data.favorites || [])
      }
    } catch (error) {
      console.error('Failed to load favorites:', error)
    }
  }

  const searchMedicalTerms = async () => {
    if (!searchTerm.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/medical-dictionary/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          term: searchTerm,
          category: selectedCategory,
          difficulty: selectedDifficulty
        })
      })

      if (response.ok) {
        const data = await response.json()
        setSearchResults(data.results || [])
      } else {
        toast.error('Failed to search medical terms')
      }
    } catch (error) {
      toast.error('Network error')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleFavorite = async (termId: string) => {
    try {
      const response = await fetch('/api/medical-dictionary/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ termId })
      })

      if (response.ok) {
        const data = await response.json()
        setFavorites(data.favorites)
        toast.success(data.added ? 'Added to favorites' : 'Removed from favorites')
      }
    } catch (error) {
      toast.error('Failed to update favorites')
    }
  }

  const speakTerm = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.8
      speechSynthesis.speak(utterance)
    } else {
      toast.error('Speech synthesis not supported')
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Copied to clipboard')
    }).catch(() => {
      toast.error('Failed to copy')
    })
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'basic': return 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
      case 'intermediate': return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300'
      case 'advanced': return 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300'
      default: return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
    }
  }

  const filteredResults = showFavoritesOnly 
    ? searchResults.filter(term => favorites.includes(term.id))
    : searchResults

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
            <div className="relative p-6 bg-gradient-to-r from-primary-100 to-medical-100 dark:from-primary-900/30 dark:to-medical-900/30 rounded-full w-24 h-24 mx-auto flex items-center justify-center">
              <BookOpen className="h-12 w-12 text-primary-600 dark:text-primary-400 animate-bounce-gentle" />
            </div>
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-black mb-6">
            <span className="gradient-text">Medical Dictionary</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Explore comprehensive medical terminology with AI-powered definitions, pronunciations, and examples
          </p>
        </div>

        {/* Search Section */}
        <div className="card mb-8 animate-slide-up">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl text-white">
              <Search className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Search Medical Terms</h2>
          </div>

          <div className="space-y-6">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchMedicalTerms()}
                placeholder="Search for medical terms, conditions, procedures..."
                className="w-full px-6 py-4 text-lg border-2 border-gray-200 dark:border-dark-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white/90 dark:bg-dark-800/90 backdrop-blur-sm transition-all duration-300 text-gray-900 dark:text-gray-100 pr-16"
              />
              <button
                onClick={searchMedicalTerms}
                disabled={isLoading || !searchTerm.trim()}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 btn-primary px-6 py-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <Search className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Filters */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="input-field focus-ring"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Difficulty</label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="input-field focus-ring"
                >
                  {difficulties.map((difficulty) => (
                    <option key={difficulty.id} value={difficulty.id}>{difficulty.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                  className={`w-full px-4 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                    showFavoritesOnly
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                      : 'bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-600'
                  }`}
                >
                  <Star className={`h-5 w-5 ${showFavoritesOnly ? 'fill-current' : ''}`} />
                  <span>Favorites</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {categories.slice(1).map((category, index) => (
            <button
              key={category.id}
              onClick={() => {
                setSelectedCategory(category.id)
                setSearchTerm(category.name)
                searchMedicalTerms()
              }}
              className={`group p-6 bg-gradient-to-br ${category.color.replace('500', '50').replace('600', '100')} dark:${category.color.replace('500', '900/20').replace('600', '800/20')} rounded-2xl border border-gray-200/50 dark:border-dark-700/50 hover:shadow-lg transition-all duration-300 transform hover:scale-105 animate-slide-up`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`p-3 bg-gradient-to-r ${category.color} rounded-xl text-white mb-4 group-hover:scale-110 transition-transform duration-300 mx-auto w-fit`}>
                <category.icon className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100 text-center group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                {category.name}
              </h3>
            </button>
          ))}
        </div>

        {/* Search Results */}
        {filteredResults.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Search Results ({filteredResults.length})
              </h3>
            </div>

            <div className="grid gap-6">
              {filteredResults.map((term, index) => (
                <div
                  key={term.id}
                  className="card hover-lift animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{term.term}</h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(term.difficulty)}`}>
                          {term.difficulty}
                        </span>
                        <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-full text-xs font-semibold">
                          {term.category}
                        </span>
                      </div>
                      
                      {term.pronunciation && (
                        <div className="flex items-center space-x-2 mb-3">
                          <span className="text-sm text-gray-600 dark:text-gray-400 italic">/{term.pronunciation}/</span>
                          <button
                            onClick={() => speakTerm(term.term)}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-dark-700 rounded transition-colors"
                          >
                            <Volume2 className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleFavorite(term.id)}
                        className={`p-2 rounded-lg transition-all duration-300 ${
                          favorites.includes(term.id)
                            ? 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20'
                            : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
                        }`}
                      >
                        <Star className={`h-5 w-5 ${favorites.includes(term.id) ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={() => copyToClipboard(`${term.term}: ${term.definition}`)}
                        className="p-2 text-gray-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-all duration-300"
                      >
                        <Copy className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 text-lg">
                    {term.definition}
                  </p>

                  {term.examples && term.examples.length > 0 && (
                    <div className="mb-4">
                      <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Examples:</h5>
                      <ul className="space-y-1">
                        {term.examples.map((example, idx) => (
                          <li key={idx} className="text-gray-600 dark:text-gray-400 flex items-start">
                            <span className="text-primary-500 mr-2">•</span>
                            <span>{example}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {term.relatedTerms && term.relatedTerms.length > 0 && (
                    <div>
                      <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Related Terms:</h5>
                      <div className="flex flex-wrap gap-2">
                        {term.relatedTerms.map((relatedTerm, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setSearchTerm(relatedTerm)
                              searchMedicalTerms()
                            }}
                            className="px-3 py-1 bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-primary-100 dark:hover:bg-primary-900/20 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-300"
                          >
                            {relatedTerm}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {searchTerm && !isLoading && filteredResults.length === 0 && (
          <div className="text-center py-16">
            <div className="p-6 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-dark-700 to-dark-600 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">No Results Found</h3>
            <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
              Try searching with different terms or check your spelling. You can also browse by category above.
            </p>
          </div>
        )}
      </div>


    </div>
  )
}