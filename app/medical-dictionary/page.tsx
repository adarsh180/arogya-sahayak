'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen, Search, Heart, Brain, Eye, Stethoscope,
  Pill, Microscope, Star, Volume2, Copy, Loader2
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
    { id: 'all', name: 'All Categories', icon: BookOpen },
    { id: 'anatomy', name: 'Anatomy', icon: Heart },
    { id: 'cardiology', name: 'Cardiology', icon: Heart },
    { id: 'neurology', name: 'Neurology', icon: Brain },
    { id: 'ophthalmology', name: 'Ophthalmology', icon: Eye },
    { id: 'pharmacology', name: 'Pharmacology', icon: Pill },
    { id: 'pathology', name: 'Pathology', icon: Microscope },
    { id: 'general', name: 'General Medicine', icon: Stethoscope }
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
      // Use AI-powered search for real-time medical definitions
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
        toast.error('Failed to search. Please try again.')
      }
    } catch (error) {
      console.error('Search error:', error)
      toast.error('Network error. Please check your connection.')
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

  const filteredResults = showFavoritesOnly
    ? searchResults.filter(term => favorites.includes(term.id))
    : searchResults

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-zinc-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] relative overflow-hidden">
      {/* Smoky Background Animations */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.03, 0.06, 0.03],
            x: [0, 50, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-0 left-1/4 w-[800px] h-[800px] rounded-full bg-purple-500 blur-[150px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.02, 0.05, 0.02],
            x: [0, -80, 0],
            y: [0, 80, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5
          }}
          className="absolute bottom-0 right-1/4 w-[700px] h-[700px] rounded-full bg-cyan-400 blur-[150px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.02, 0.04, 0.02],
            x: [0, 60, 0],
            y: [0, -60, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 10
          }}
          className="absolute top-1/2 right-1/3 w-[600px] h-[600px] rounded-full bg-pink-500 blur-[150px]"
        />
      </div>

      <Navbar />

      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-zinc-900 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-zinc-400" />
              </div>
              <h1 className="text-4xl font-normal text-zinc-100">Medical Dictionary</h1>
            </div>
            <p className="text-lg text-zinc-500">
              Explore medical terminology with AI-powered definitions and pronunciations
            </p>
          </motion.div>

          {/* Search Section */}
          <div className="bg-[#1a1a1a] border border-zinc-800 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Search className="w-5 h-5 text-zinc-400" />
              <h2 className="text-lg font-semibold text-zinc-200">Search Medical Terms</h2>
            </div>

            <div className="space-y-4">
              {/* Search Input */}
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchMedicalTerms()}
                  placeholder="Search for medical terms, conditions, procedures..."
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 text-zinc-200 placeholder:text-zinc-600 rounded-xl focus:outline-none focus:border-zinc-700 pr-24"
                />
                <button
                  onClick={searchMedicalTerms}
                  disabled={isLoading || !searchTerm.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-zinc-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Filters */}
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-xl focus:outline-none focus:border-zinc-700"
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Difficulty</label>
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-xl focus:outline-none focus:border-zinc-700"
                  >
                    <option value="all">All Levels</option>
                    <option value="basic">Basic</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                    className={`w-full px-4 py-2 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${showFavoritesOnly
                      ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 border border-zinc-800'
                      }`}
                  >
                    <Star className={`w-4 h-4 ${showFavoritesOnly ? 'fill-current' : ''}`} />
                    <span>Favorites</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {categories.slice(1).map((category, index) => (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => {
                  setSelectedCategory(category.id)
                  setSearchTerm(category.name)
                  searchMedicalTerms()
                }}
                className="group bg-[#1a1a1a] border border-zinc-800 hover:border-zinc-700 rounded-2xl p-5 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center mx-auto mb-3 group-hover:bg-zinc-800 transition-colors">
                  <category.icon className="w-5 h-5 text-zinc-400" />
                </div>
                <h3 className="text-sm font-medium text-zinc-300 text-center group-hover:text-white transition-colors">
                  {category.name}
                </h3>
              </motion.button>
            ))}
          </div>

          {/* Search Results */}
          <AnimatePresence mode="popLayout">
            {filteredResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <h3 className="text-xl font-semibold text-zinc-200 mb-4">
                  Results ({filteredResults.length})
                </h3>

                {filteredResults.map((term, index) => (
                  <motion.div
                    key={term.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-[#1a1a1a] border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-2xl font-semibold text-zinc-100">{term.term}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${term.difficulty === 'basic' ? 'bg-green-500/20 text-green-400' :
                            term.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                            {term.difficulty}
                          </span>
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium">
                            {term.category}
                          </span>
                        </div>

                        {term.pronunciation && (
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-sm text-zinc-500 italic">/{term.pronunciation}/</span>
                            <button
                              onClick={() => speakTerm(term.term)}
                              className="p-1 hover:bg-zinc-800 rounded transition-colors"
                            >
                              <Volume2 className="w-4 h-4 text-zinc-600" />
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleFavorite(term.id)}
                          className={`p-2 rounded-lg transition-colors ${favorites.includes(term.id)
                            ? 'text-yellow-400 bg-yellow-500/20'
                            : 'text-zinc-600 hover:text-yellow-400 hover:bg-yellow-500/10'
                            }`}
                        >
                          <Star className={`w-5 h-5 ${favorites.includes(term.id) ? 'fill-current' : ''}`} />
                        </button>
                        <button
                          onClick={() => copyToClipboard(`${term.term}: ${term.definition}`)}
                          className="p-2 text-zinc-600 hover:text-zinc-400 hover:bg-zinc-800 rounded-lg transition-colors"
                        >
                          <Copy className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-zinc-300 leading-relaxed mb-4">
                      {term.definition}
                    </p>

                    {term.examples && term.examples.length > 0 && (
                      <div className="mb-4">
                        <h5 className="font-medium text-zinc-400 mb-2 text-sm">Examples:</h5>
                        <ul className="space-y-1">
                          {term.examples.map((example, idx) => (
                            <li key={idx} className="text-sm text-zinc-500 flex items-start">
                              <span className="text-zinc-700 mr-2">•</span>
                              <span>{example}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {term.relatedTerms && term.relatedTerms.length > 0 && (
                      <div>
                        <h5 className="font-medium text-zinc-400 mb-2 text-sm">Related Terms:</h5>
                        <div className="flex flex-wrap gap-2">
                          {term.relatedTerms.map((relatedTerm, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                setSearchTerm(relatedTerm)
                                searchMedicalTerms()
                              }}
                              className="px-3 py-1 bg-zinc-900 text-zinc-400 rounded-full text-xs hover:bg-zinc-800 hover:text-zinc-300 transition-colors"
                            >
                              {relatedTerm}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty State */}
          {searchTerm && !isLoading && filteredResults.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="w-16 h-16 rounded-2xl bg-zinc-900 flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-zinc-700" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-300 mb-2">No Results Found</h3>
              <p className="text-zinc-600 max-w-md mx-auto">
                Try searching with different terms or browse by category above.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}