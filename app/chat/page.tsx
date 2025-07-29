'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Bot, User, Menu, Plus, MessageCircle, Globe, Send } from 'lucide-react'
import { INDIAN_LANGUAGES } from '@/lib/ai'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import ChatInput from '@/components/ChatInput'
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
        toast.error('Failed to send message')
        // Remove the temporary user message on error
        setMessages(prev => prev.slice(0, -1))
      }
    } catch (error) {
      toast.error('Network error')
      setMessages(prev => prev.slice(0, -1))
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-page">
      <Navbar />
      
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar - Hidden on mobile */}
        <div className="hidden lg:flex w-64 sidebar flex-col">
          <div className="p-4 border-b border-gray-200">
            <button
              onClick={startNewChat}
              className="w-full flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>New Chat</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Recent Chats</h3>
            <div className="space-y-2">
              {chatSessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => loadChatSession(session.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    currentSessionId === session.id
                      ? 'bg-primary-100 text-primary-700'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="h-4 w-4 text-gray-400" />
                    <span className="text-sm truncate">{session.title}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Language Selector */}
          <div className="p-4 border-t border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Globe className="inline h-4 w-4 mr-1" />
              Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full input-field text-sm"
            >
              {Object.entries(INDIAN_LANGUAGES).map(([code, name]) => (
                <option key={code} value={code}>{name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="header p-3 lg:p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {/* Mobile New Chat Button */}
                <button
                  onClick={startNewChat}
                  className="lg:hidden p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
                <div>
                  <h1 className="text-lg lg:text-xl font-semibold text-primary">Medical Assistant</h1>
                  <p className="text-xs lg:text-sm text-secondary hidden sm:block">Ask me about your medical reports, symptoms, or health concerns</p>
                </div>
              </div>
              {/* Mobile Language Selector */}
              <div className="lg:hidden">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="text-xs border border-gray-300 rounded px-2 py-1"
                >
                  {Object.entries(INDIAN_LANGUAGES).slice(0, 5).map(([code, name]) => (
                    <option key={code} value={code}>{name.split(' ')[0]}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-2 lg:p-4 space-y-3 lg:space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-12">
                <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Welcome to Arogya Sahayak</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  I'm here to help you understand your medical reports, analyze symptoms, and provide health guidance. 
                  How can I assist you today?
                </p>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex space-x-2 lg:space-x-3 max-w-[85%] lg:max-w-3xl ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`flex-shrink-0 w-7 h-7 lg:w-8 lg:h-8 rounded-full flex items-center justify-center ${
                    message.role === 'user' ? 'bg-primary-600' : 'bg-medical-600'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="h-3 w-3 lg:h-4 lg:w-4 text-white" />
                    ) : (
                      <Bot className="h-3 w-3 lg:h-4 lg:w-4 text-white" />
                    )}
                  </div>
                  <div className={`chat-message ${message.role === 'user' ? 'chat-user' : 'chat-assistant'} text-sm lg:text-base`}>
                    <div className="leading-relaxed">
                      {message.content.split('\n').map((line, index) => (
                        line.trim() ? (
                          <p key={index} className="mb-2 lg:mb-3 last:mb-0 text-gray-800">
                            {line.startsWith('•') ? (
                              <span className="flex items-start">
                                <span className="text-primary-600 mr-2 mt-1">•</span>
                                <span>{line.substring(1).trim()}</span>
                              </span>
                            ) : line}
                          </p>
                        ) : <br key={index} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="flex space-x-3 max-w-3xl">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-medical-600 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="chat-message chat-assistant">
                    <div className="loading-dots">Thinking</div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <div className="bg-white border-t border-gray-200 p-3 lg:p-4">
            <form onSubmit={handleSubmit} className="flex space-x-2 lg:space-x-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about symptoms, reports..."
                className="flex-1 input-field text-sm lg:text-base py-3 lg:py-2"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="btn-primary px-3 lg:px-6 py-3 lg:py-2 flex items-center space-x-1 lg:space-x-2 text-sm lg:text-base"
              >
                <Send className="h-4 w-4" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </form>
            <p className="text-xs text-gray-500 mt-2 hidden sm:block">
              Always consult with healthcare professionals for medical decisions. This AI provides information only.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}