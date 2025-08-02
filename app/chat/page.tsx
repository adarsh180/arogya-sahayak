'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Bot, User, Menu, Plus, MessageCircle, Globe, Send, Trash2 } from 'lucide-react'
import { INDIAN_LANGUAGES } from '@/lib/ai'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import ChatInput from '@/components/ChatInput'
import MessageRenderer from '@/components/MessageRenderer'
import toast from 'react-hot-toast'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  translation?: string
  createdAt: string
}

interface ChatSession {
  id: string
  title: string
  messages: Message[]
}

export default function Chat() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [language, setLanguage] = useState('en')
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (session) {
      fetchChatSessions()
    }
  }, [session])

  const fetchChatSessions = async () => {
    try {
      const response = await fetch('/api/chat')
      if (response.ok) {
        const sessions = await response.json()
        setChatSessions(sessions)
      }
    } catch (error) {
      console.error('Failed to fetch chat sessions:', error)
    }
  }

  const loadChatSession = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/chat?sessionId=${sessionId}`)
      if (response.ok) {
        const session = await response.json()
        setMessages(session.messages || [])
        setCurrentSessionId(sessionId)
      }
    } catch (error) {
      console.error('Failed to load chat session:', error)
    }
  }

  const startNewChat = () => {
    setMessages([])
    setCurrentSessionId(null)
  }

  const deleteChat = async (sessionId: string) => {
    if (!confirm('Are you sure you want to delete this chat?')) return
    
    try {
      const response = await fetch(`/api/chat?sessionId=${sessionId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        // Remove from UI immediately
        setChatSessions(prev => prev.filter(session => session.id !== sessionId))
        
        // If current chat is deleted, start new chat
        if (currentSessionId === sessionId) {
          setMessages([])
          setCurrentSessionId(null)
        }
        
        toast.success('Chat deleted successfully')
      } else {
        toast.error('Failed to delete chat')
      }
    } catch (error) {
      toast.error('Network error')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setIsLoading(true)

    // Add user message to UI immediately
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
          chatSessionId: currentSessionId,
          type: 'medical',
          language
        })
      })

      if (response.ok) {
        const data = await response.json()
        
        // Update current session ID if it's a new chat
        if (!currentSessionId) {
          setCurrentSessionId(data.chatSessionId)
          fetchChatSessions() // Refresh sessions list
        }

        // Add assistant message
        setMessages(prev => [...prev, {
          id: data.message.id,
          role: 'assistant',
          content: data.message.translation || data.message.content,
          translation: data.message.translation,
          createdAt: data.message.createdAt
        }])
      } else {
        const errorData = await response.json().catch(() => ({}))
        
        if (response.status === 503 && errorData.fallback) {
          // Add error message as assistant response
          setMessages(prev => [...prev, {
            id: Date.now().toString() + '_error',
            role: 'assistant',
            content: errorData.error || 'I\'m currently experiencing high demand. Please try again in a few moments.',
            createdAt: new Date().toISOString()
          }])
        } else {
          toast.error(errorData.error || 'Failed to send message')
          // Remove the temporary user message on error
          setMessages(prev => prev.slice(0, -1))
        }
      }
    } catch (error) {
      console.error('Chat error:', error)
      // Add error message as assistant response
      setMessages(prev => [...prev, {
        id: Date.now().toString() + '_error',
        role: 'assistant',
        content: 'I\'m experiencing technical difficulties. Please check your internet connection and try again.',
        createdAt: new Date().toISOString()
      }])
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-medical-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 theme-transition">
      <Navbar />
      
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar - Hidden on mobile */}
        <div className="hidden lg:flex w-72 sidebar flex-col">
          <div className="p-6 border-b border-gray-200/50">
            <button
              onClick={startNewChat}
              className="w-full flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Plus className="h-5 w-5" />
              <span className="font-medium">New Chat</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <h3 className="text-sm font-semibold text-gray-600 mb-4 uppercase tracking-wide">Recent Chats</h3>
            <div className="space-y-3">
              {chatSessions.map((session, index) => (
                <div
                  key={session.id}
                  className={`group relative rounded-xl transition-all duration-300 transform hover:scale-102 ${
                    currentSessionId === session.id
                      ? 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 shadow-md'
                      : 'hover:bg-gray-50 hover:shadow-md'
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <button
                    onClick={() => loadChatSession(session.id)}
                    className="w-full text-left p-4 pr-12 transition-all duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        currentSessionId === session.id ? 'bg-blue-200' : 'bg-gray-100 group-hover:bg-blue-100'
                      } transition-colors duration-200`}>
                        <MessageCircle className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="text-sm font-medium truncate">{session.title}</span>
                    </div>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteChat(session.id)
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 opacity-0 group-hover:opacity-100 hover:bg-red-100 rounded-lg transition-all duration-200"
                    title="Delete chat"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Language Selector */}
          <div className="p-6 border-t border-gray-200/50 bg-gradient-to-r from-gray-50 to-blue-50">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <Globe className="inline h-4 w-4 mr-2 text-blue-600" />
              Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm text-sm font-medium transition-all duration-200"
            >
              {Object.entries(INDIAN_LANGUAGES).map(([code, name]) => (
                <option key={code} value={code}>{name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-white/60 dark:bg-dark-800/60 backdrop-blur-sm">
          {/* Chat Header */}
          <div className="header p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Mobile New Chat Button */}
                <button
                  onClick={startNewChat}
                  className="lg:hidden p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <Plus className="h-5 w-5" />
                </button>
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl">
                    <Bot className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Arogya Sahayak</h1>
                    <p className="text-sm text-gray-600 hidden sm:block">Your AI Medical Assistant • Ask about reports, symptoms & health concerns</p>
                  </div>
                </div>
              </div>
              {/* Mobile Language Selector */}
              <div className="lg:hidden">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(INDIAN_LANGUAGES).slice(0, 5).map(([code, name]) => (
                    <option key={code} value={code}>{name.split(' ')[0]}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4 lg:space-y-6 bg-gray-50/50 dark:bg-dark-900/50">
            {messages.length === 0 && (
              <div className="text-center py-16 animate-fade-in">
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
                  <div className="relative p-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full w-24 h-24 mx-auto flex items-center justify-center">
                    <Bot className="h-12 w-12 text-blue-600 animate-bounce" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Arogya Sahayak</h3>
                <p className="text-gray-600 max-w-lg mx-auto text-lg leading-relaxed">
                  I'm your AI medical assistant, ready to help you understand medical reports, analyze symptoms, and provide health guidance. 
                  <span className="block mt-2 text-blue-600 font-medium">How can I assist you today?</span>
                </p>
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  <div className="p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                    <h4 className="font-semibold text-blue-600 mb-2">📋 Medical Reports</h4>
                    <p className="text-sm text-gray-600">Upload and analyze your lab reports, X-rays, and medical documents</p>
                  </div>
                  <div className="p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                    <h4 className="font-semibold text-green-600 mb-2">🩺 Health Guidance</h4>
                    <p className="text-sm text-gray-600">Get advice on symptoms, medications, and general health concerns</p>
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
                <div className={`flex space-x-3 lg:space-x-4 max-w-[85%] lg:max-w-4xl ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`flex-shrink-0 w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 ${
                    message.role === 'user' 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600' 
                      : 'bg-gradient-to-r from-green-500 to-blue-500'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
                    ) : (
                      <Bot className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
                    )}
                  </div>
                  <div className={`relative p-4 lg:p-6 rounded-2xl shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl ${
                    message.role === 'user' 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                      : 'bg-white/90 text-gray-800 border border-gray-200'
                  }`}>
                    <MessageRenderer content={message.content} role={message.role} />
                    <div className={`absolute w-3 h-3 transform rotate-45 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 right-4 top-6'
                        : 'bg-white border-l border-t border-gray-200 left-4 top-6'
                    }`}></div>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start animate-fade-in">
                <div className="flex space-x-4 max-w-4xl">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center shadow-lg animate-pulse">
                    <Bot className="h-6 w-6 text-white" />
                  </div>
                  <div className="relative p-6 rounded-2xl bg-white/90 backdrop-blur-sm shadow-lg border border-gray-200">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-gray-600 font-medium">Analyzing your query...</span>
                    </div>
                    <div className="absolute w-3 h-3 bg-white border-l border-t border-gray-200 transform rotate-45 left-4 top-6"></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <div className="bg-white/95 dark:bg-dark-900/95 backdrop-blur-sm border-t border-gray-200/50 dark:border-dark-700/50 p-4 lg:p-6 shadow-lg">
            <form onSubmit={handleSubmit} className="flex space-x-3 lg:space-x-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about symptoms, medical reports, health concerns..."
                  className="w-full px-6 py-4 lg:py-5 text-base border-2 border-gray-200 dark:border-dark-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm transition-all duration-300 pr-12 text-gray-900 dark:text-gray-100"
                  disabled={isLoading}
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="px-6 lg:px-8 py-4 lg:py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2"
              >
                <Send className="h-5 w-5" />
                <span className="hidden sm:inline font-medium">Send</span>
              </button>
            </form>
            <div className="mt-4 flex items-center justify-center">
              <p className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100/80 dark:bg-dark-800/80 backdrop-blur-sm px-4 py-2 rounded-full">
                🔒 Always consult healthcare professionals for medical decisions • AI provides information only
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full opacity-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-60 h-60 bg-green-200 rounded-full opacity-5 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
    </div>
  )
}