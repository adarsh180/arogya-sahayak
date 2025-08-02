'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Bot, User, GraduationCap, Brain, Send, Sparkles } from 'lucide-react'
import { INDIAN_LANGUAGES, MEDICAL_EXAMS } from '@/lib/ai'
import Navbar from '@/components/Navbar'
import MessageRenderer from '@/components/MessageRenderer'
import toast from 'react-hot-toast'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
}

export default function StudentChat() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [language, setLanguage] = useState('en')
  const [selectedExam, setSelectedExam] = useState('neet-ug')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const quickQuestions = [
    "Explain the mechanism of photosynthesis in detail",
    "What are the differences between mitosis and meiosis?",
    "Describe the structure and function of DNA",
    "How does the human circulatory system work?",
    "What are the laws of thermodynamics in physics?",
    "Explain organic chemistry reaction mechanisms"
  ]

  const studyTopics = [
    { subject: 'Physics', topic: 'Mechanics', icon: '⚡', color: 'from-blue-500 to-cyan-500' },
    { subject: 'Chemistry', topic: 'Organic Chemistry', icon: '🧪', color: 'from-green-500 to-emerald-500' },
    { subject: 'Biology', topic: 'Cell Biology', icon: '🔬', color: 'from-red-500 to-pink-500' },
    { subject: 'Mathematics', topic: 'Calculus', icon: '📐', color: 'from-purple-500 to-indigo-500' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setIsLoading(true)

    const tempUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      createdAt: new Date().toISOString()
    }
    setMessages(prev => [...prev, tempUserMessage])

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          type: 'student',
          language
        })
      })

      if (response.ok) {
        const data = await response.json()
        setMessages(prev => [...prev, {
          id: data.message.id,
          role: 'assistant',
          content: data.message.content,
          createdAt: data.message.createdAt
        }])
      } else {
        toast.error('Failed to get response')
        setMessages(prev => prev.slice(0, -1))
      }
    } catch (error) {
      toast.error('Network error')
      setMessages(prev => prev.slice(0, -1))
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickQuestion = (question: string) => {
    setInput(question)
  }

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
      
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <div className="hidden lg:flex w-80 sidebar flex-col">
          <div className="p-6 border-b border-gray-200/50 dark:border-dark-700/50">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-primary-100 to-medical-100 dark:from-primary-900/50 dark:to-medical-900/50 rounded-xl">
                <GraduationCap className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Study Assistant</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">AI-powered learning</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Target Exam</label>
                <select
                  value={selectedExam}
                  onChange={(e) => setSelectedExam(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-dark-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white/90 dark:bg-dark-800/90 backdrop-blur-sm transition-all duration-300 text-gray-900 dark:text-gray-100 text-sm"
                >
                  {Object.entries(MEDICAL_EXAMS).map(([code, name]) => (
                    <option key={code} value={code}>{name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-dark-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white/90 dark:bg-dark-800/90 backdrop-blur-sm transition-all duration-300 text-gray-900 dark:text-gray-100 text-sm"
                >
                  {Object.entries(INDIAN_LANGUAGES).slice(0, 8).map(([code, name]) => (
                    <option key={code} value={code}>{name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-4">Study Topics</h3>
            <div className="space-y-3">
              {studyTopics.map((topic, index) => (
                <button
                  key={topic.subject}
                  onClick={() => handleQuickQuestion(`Explain ${topic.topic} in ${topic.subject}`)}
                  className={`w-full text-left p-4 rounded-xl bg-gradient-to-r ${topic.color} text-white hover:shadow-lg transition-all duration-300 transform hover:scale-105 animate-slide-up`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{topic.icon}</span>
                    <div>
                      <div className="font-semibold">{topic.subject}</div>
                      <div className="text-sm opacity-90">{topic.topic}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          <div className="header p-4 lg:p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-primary-100 to-medical-100 dark:from-primary-900/50 dark:to-medical-900/50 rounded-xl">
                <Brain className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold gradient-text">AI Study Tutor</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Get personalized help with medical concepts</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6 bg-gray-50/50 dark:bg-dark-900/50">
            {messages.length === 0 && (
              <div className="text-center py-16 animate-fade-in">
                <div className="p-8 bg-gradient-to-r from-primary-100 to-medical-100 dark:from-primary-900/30 dark:to-medical-900/30 rounded-full w-32 h-32 mx-auto flex items-center justify-center mb-8">
                  <Brain className="h-16 w-16 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Welcome to AI Study Tutor</h3>
                <p className="text-gray-600 dark:text-gray-300 max-w-lg mx-auto text-lg leading-relaxed mb-8">
                  I'm here to help you master medical concepts, solve problems, and prepare for your exams.
                </p>

                <div className="max-w-4xl mx-auto">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Quick Questions:</h4>
                  <div className="grid md:grid-cols-2 gap-3">
                    {quickQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickQuestion(question)}
                        className="text-left p-4 card hover:shadow-lg transition-all duration-300 transform hover:scale-105 animate-slide-up"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-start space-x-3">
                          <Sparkles className="h-5 w-5 text-primary-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{question}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`flex space-x-4 max-w-4xl ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
                    message.role === 'user' 
                      ? 'bg-gradient-to-r from-primary-600 to-primary-700' 
                      : 'bg-gradient-to-r from-medical-500 to-primary-500'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="h-6 w-6 text-white" />
                    ) : (
                      <Brain className="h-6 w-6 text-white" />
                    )}
                  </div>
                  <div className={`chat-message ${message.role === 'user' ? 'chat-user' : 'chat-assistant'}`}>
                    <MessageRenderer content={message.content} role={message.role} />
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start animate-fade-in">
                <div className="flex space-x-4 max-w-4xl">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-medical-500 to-primary-500 flex items-center justify-center shadow-lg">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <div className="chat-message chat-assistant">
                    <div className="flex items-center space-x-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                        <div className="w-2 h-2 bg-medical-500 rounded-full"></div>
                        <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                      </div>
                      <span className="text-gray-600 dark:text-gray-300 font-medium">Thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="bg-white/95 dark:bg-dark-900/95 backdrop-blur-sm border-t border-gray-200/50 dark:border-dark-700/50 p-4 lg:p-6 shadow-lg">
            <form onSubmit={handleSubmit} className="flex space-x-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about medical concepts, problems, or exam preparation..."
                className="flex-1 px-6 py-4 text-base border-2 border-gray-200 dark:border-dark-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white/90 dark:bg-dark-800/90 backdrop-blur-sm transition-all duration-300 text-gray-900 dark:text-gray-100"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="btn-primary px-8 py-4 flex items-center space-x-2"
              >
                <Send className="h-5 w-5" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}