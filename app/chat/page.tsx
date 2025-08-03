'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { 
  Bot, User, Send, Paperclip, X, FileText, Image as ImageIcon,
  CheckCircle, AlertTriangle, Stethoscope, Activity, Brain,
  FileCheck, Zap, Shield, Heart
} from 'lucide-react'
import { INDIAN_LANGUAGES } from '@/lib/ai'
import Navbar from '@/components/Navbar'
import MessageRenderer from '@/components/MessageRenderer'
import toast from 'react-hot-toast'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
  attachments?: UploadedFile[]
}

interface UploadedFile {
  id: string
  name: string
  type: string
  size: number
  url: string
  extractedText?: string
}

interface ThinkingStep {
  icon: React.ReactNode
  text: string
  completed: boolean
}

export default function Chat() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [language, setLanguage] = useState('en')
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [thinkingSteps, setThinkingSteps] = useState<ThinkingStep[]>([])
  const [showThinking, setShowThinking] = useState(false)
  const [chatSessions, setChatSessions] = useState<any[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
    if (!confirm('Delete this conversation?')) return
    
    try {
      const response = await fetch(`/api/chat?sessionId=${sessionId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setChatSessions(prev => prev.filter(s => s.id !== sessionId))
        if (currentSessionId === sessionId) {
          setMessages([])
          setCurrentSessionId(null)
        }
        toast.success('Chat deleted')
      }
    } catch (error) {
      toast.error('Failed to delete chat')
    }
  }

  const simulateThinking = (hasFiles: boolean = false) => {
    const steps: ThinkingStep[] = [
      { icon: <Brain className="h-4 w-4" />, text: 'Identifying key medical terms...', completed: false },
    ]
    
    if (hasFiles) {
      steps.push(
        { icon: <FileCheck className="h-4 w-4" />, text: 'Parsing medical documents...', completed: false },
        { icon: <Activity className="h-4 w-4" />, text: 'Extracting health data...', completed: false },
        { icon: <Stethoscope className="h-4 w-4" />, text: 'Cross-referencing medical standards...', completed: false }
      )
    }
    
    steps.push(
      { icon: <Heart className="h-4 w-4" />, text: 'Analyzing health indicators...', completed: false },
      { icon: <Zap className="h-4 w-4" />, text: 'Formulating medical insights...', completed: false },
      { icon: <Shield className="h-4 w-4" />, text: 'Finalizing safe recommendations...', completed: false }
    )

    setThinkingSteps(steps)
    setShowThinking(true)

    steps.forEach((_, index) => {
      setTimeout(() => {
        setThinkingSteps(prev => 
          prev.map((step, i) => 
            i === index ? { ...step, completed: true } : step
          )
        )
        if (index === steps.length - 1) {
          setTimeout(() => setShowThinking(false), 1000)
        }
      }, (index + 1) * 600)
    })
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    const newFiles: UploadedFile[] = []

    for (const file of Array.from(files)) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`File ${file.name} is too large (max 10MB)`)
        continue
      }

      try {
        toast.loading(`Processing ${file.name}...`, { id: file.name })
        
        // Extract text from file
        const formData = new FormData()
        formData.append('file', file)
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })
        
        if (uploadResponse.ok) {
          const { text, fileName, fileType } = await uploadResponse.json()
          
          const fileId = Date.now().toString() + Math.random().toString(36).substr(2, 9)
          newFiles.push({
            id: fileId,
            name: fileName,
            type: fileType,
            size: file.size,
            url: URL.createObjectURL(file),
            extractedText: text
          })
          
          toast.success(`${fileName} processed successfully`, { id: file.name })
        } else {
          const errorData = await uploadResponse.json()
          toast.error(`Failed to process ${file.name}: ${errorData.error}`, { id: file.name })
        }
      } catch (error) {
        console.error('File upload error:', error)
        toast.error(`Failed to process ${file.name}`, { id: file.name })
      }
    }

    setUploadedFiles(prev => [...prev, ...newFiles])
    setIsUploading(false)
    
    if (newFiles.length > 0) {
      toast.success(`${newFiles.length} file(s) ready for analysis`)
    }
  }

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => {
      const file = prev.find(f => f.id === fileId)
      if (file) URL.revokeObjectURL(file.url)
      return prev.filter(f => f.id !== fileId)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    const attachments = [...uploadedFiles]
    setInput('')
    setUploadedFiles([])
    setIsLoading(true)

    simulateThinking(attachments.length > 0)

    const tempUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      createdAt: new Date().toISOString(),
      attachments
    }
    setMessages(prev => [...prev, tempUserMessage])

    // Prepare file content for AI
    let fileContent = null
    if (attachments.length > 0 && attachments[0].extractedText) {
      fileContent = {
        fileName: attachments[0].name,
        text: attachments[0].extractedText
      }
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          chatSessionId: currentSessionId,
          type: 'medical',
          language,
          fileContent
        })
      })

      if (response.ok) {
        const data = await response.json()
        
        // Update current session ID if it's a new chat
        if (!currentSessionId) {
          setCurrentSessionId(data.chatSessionId)
          fetchChatSessions() // Refresh sessions list
        }
        
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

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-spin border-t-blue-600 dark:border-t-blue-400"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Stethoscope className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-white dark:bg-gray-900 flex flex-col">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="flex items-center space-x-3"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
            <Stethoscope className="h-4 w-4 text-white" />
          </div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Arogya Sahayak</h1>
        </button>
        <button
          onClick={startNewChat}
          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Mobile Sidebar Overlay */}
        {mobileSidebarOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setMobileSidebarOpen(false)}></div>
            <div className="relative w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <button
                    onClick={startNewChat}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:from-blue-700 hover:to-green-700 transition-all duration-300 font-medium text-sm mr-2"
                  >
                    <span>+ New Chat</span>
                  </button>
                  <button
                    onClick={() => setMobileSidebarOpen(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4">
                <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-3 uppercase tracking-wide">Recent Conversations</h3>
                <div className="space-y-2">
                  {chatSessions.map((session) => (
                    <div key={session.id} className={`group relative rounded-lg transition-all duration-300 ${
                      currentSessionId === session.id
                        ? 'bg-blue-100 dark:bg-blue-900/50 shadow-md'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}>
                      <button
                        onClick={() => {
                          loadChatSession(session.id)
                          setMobileSidebarOpen(false)
                        }}
                        className="w-full text-left p-3 pr-8"
                      >
                        <div className="flex items-start space-x-2">
                          <div className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 ${
                            currentSessionId === session.id 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                          }`}>
                            <Stethoscope className="h-3 w-3" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">
                              {session.title || 'New conversation'}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(session.updatedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </button>
                      <button
                        onClick={() => deleteChat(session.id)}
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 p-1 opacity-0 group-hover:opacity-100 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-all duration-200"
                      >
                        <X className="h-3 w-3 text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Desktop Sidebar */}
        <div className={`hidden md:flex ${sidebarCollapsed ? 'w-0' : 'w-80'} bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex-col transition-all duration-300 overflow-hidden`}>
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
              >
                <svg className={`w-5 h-5 text-gray-600 dark:text-gray-300 transition-transform duration-300 ${sidebarCollapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              {!sidebarCollapsed && (
                <button
                  onClick={startNewChat}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:from-blue-700 hover:to-green-700 transition-all duration-300 font-medium text-sm"
                >
                  <span>+ New Chat</span>
                </button>
              )}
            </div>
          </div>
          
          {!sidebarCollapsed && (
            <div className="flex-1 overflow-y-auto p-4">
              <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-3 uppercase tracking-wide">Recent Conversations</h3>
              <div className="space-y-2">
                {chatSessions.map((session) => (
                  <div key={session.id} className={`group relative rounded-lg transition-all duration-300 ${
                    currentSessionId === session.id
                      ? 'bg-blue-100 dark:bg-blue-900/50 shadow-md'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}>
                    <button
                      onClick={() => loadChatSession(session.id)}
                      className="w-full text-left p-3 pr-8"
                    >
                      <div className="flex items-start space-x-2">
                        <div className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 ${
                          currentSessionId === session.id 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                        }`}>
                          <Stethoscope className="h-3 w-3" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">
                            {session.title || 'New conversation'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(session.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </button>
                    <button
                      onClick={() => deleteChat(session.id)}
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 p-1 opacity-0 group-hover:opacity-100 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-all duration-200"
                    >
                      <X className="h-3 w-3 text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Desktop Header */}
          <div className="hidden md:block bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
                  <Stethoscope className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Medical AI Assistant</h1>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Trusted healthcare insights</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="px-2 py-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded-full text-xs font-medium flex items-center space-x-1">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <span>Online</span>
                </div>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="px-2 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {Object.entries(INDIAN_LANGUAGES).slice(0, 5).map(([code, name]) => (
                    <option key={code} value={code}>{name.split(' ')[0]}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto">
            {messages.length === 0 && (
              <div className="h-full flex items-center justify-center p-4">
                <div className="text-center max-w-md">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900/30 dark:to-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Stethoscope className="h-8 w-8 md:h-10 md:w-10 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">Welcome to Arogya Sahayak</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                    Your AI medical assistant. Ask about symptoms, health concerns, or upload medical documents.
                  </p>
                </div>
              </div>
            )}

            <div className="px-4 py-4 space-y-4">
              {messages.map((message, index) => (
                <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex space-x-3 max-w-[85%] sm:max-w-2xl ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === 'user' 
                        ? 'bg-blue-600' 
                        : 'bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600'
                    }`}>
                      {message.role === 'user' ? (
                        <User className="h-4 w-4 text-white" />
                      ) : (
                        <Stethoscope className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                      )}
                    </div>
                    <div className={`rounded-2xl px-4 py-3 max-w-full ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700'
                    }`}>
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mb-3 space-y-2">
                          {message.attachments.map((file) => (
                            <div key={file.id} className={`flex items-center space-x-2 p-2 rounded-lg text-xs ${
                              message.role === 'user' ? 'bg-white/20' : 'bg-gray-200 dark:bg-gray-700'
                            }`}>
                              {file.type.startsWith('image/') ? (
                                <ImageIcon className="h-3 w-3" />
                              ) : (
                                <FileText className="h-3 w-3" />
                              )}
                              <span className="truncate">{file.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      <MessageRenderer content={message.content} role={message.role} />
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex space-x-3 max-w-2xl">
                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center">
                      <Stethoscope className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3 border border-gray-200 dark:border-gray-700">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
              <div className="flex space-x-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about symptoms, health concerns..."
                    className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute right-12 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                    disabled={isLoading || isUploading}
                  >
                    {isUploading ? (
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Paperclip className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    )}
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </form>
            
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
            
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center max-w-4xl mx-auto">
              Always consult healthcare professionals for medical decisions. This AI provides information only.
            </p>
          </div>
        </div>


      </div>
    </div>
  )
}