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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-500">
      <Navbar />
      
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Chat History Sidebar */}
        <div className={`${sidebarCollapsed ? 'w-16' : 'w-80'} bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300`}>
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
        <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900">
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
                    <Stethoscope className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Medical AI Assistant</h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Trusted healthcare insights • Document analysis</p>
                </div>
              </div>
              <div className="hidden md:flex items-center space-x-3">
                <div className="px-3 py-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded-full text-xs font-medium flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>AI Online</span>
                </div>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(INDIAN_LANGUAGES).slice(0, 5).map(([code, name]) => (
                    <option key={code} value={code}>{name.split(' ')[0]}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.length === 0 && (
              <div className="text-center py-20 animate-fade-in">
                <div className="relative mb-8">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900/30 dark:to-green-900/30 rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
                    <Stethoscope className="h-16 w-16 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                    <Heart className="h-4 w-4 text-white" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Welcome to Your Medical AI</h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed mb-12">
                  Upload medical documents, ask about symptoms, or get health guidance. 
                  I analyze your information with medical expertise and provide trustworthy insights.
                </p>
                
                <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                  <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm p-6 rounded-2xl border border-blue-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center mb-4 mx-auto">
                      <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Document Analysis</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Upload lab reports, prescriptions, and medical documents for detailed analysis</p>
                  </div>
                  
                  <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm p-6 rounded-2xl border border-green-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-xl flex items-center justify-center mb-4 mx-auto">
                      <Activity className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Symptom Guidance</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Describe symptoms and get preliminary health assessments and recommendations</p>
                  </div>
                  
                  <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm p-6 rounded-2xl border border-purple-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-xl flex items-center justify-center mb-4 mx-auto">
                      <Brain className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Health Insights</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Get personalized health advice and understand medical information better</p>
                  </div>
                </div>
              </div>
            )}

            {messages.map((message, index) => (
              <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`} style={{ animationDelay: `${index * 100}ms` }}>
                <div className={`flex space-x-4 max-w-4xl ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                    message.role === 'user' 
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white' 
                      : 'bg-gradient-to-br from-green-500 to-green-600 text-white'
                  }`}>
                    {message.role === 'user' ? <User className="h-6 w-6" /> : <Stethoscope className="h-6 w-6" />}
                  </div>
                  <div className={`rounded-2xl px-6 py-4 max-w-3xl shadow-lg ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700'
                  }`}>
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mb-4 space-y-2">
                        {message.attachments.map((file) => (
                          <div key={file.id} className={`flex items-center space-x-3 p-3 rounded-xl ${
                            message.role === 'user' ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-700'
                          }`}>
                            {file.type.startsWith('image/') ? (
                              <ImageIcon className={`h-5 w-5 ${message.role === 'user' ? 'text-white' : 'text-gray-600 dark:text-gray-300'}`} />
                            ) : (
                              <FileText className={`h-5 w-5 ${message.role === 'user' ? 'text-white' : 'text-gray-600 dark:text-gray-300'}`} />
                            )}
                            <span className={`text-sm font-medium truncate ${message.role === 'user' ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`}>{file.name}</span>
                            <span className={`text-xs ${message.role === 'user' ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'}`}>{(file.size / 1024).toFixed(1)} KB</span>
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
              <div className="flex justify-start animate-fade-in">
                <div className="flex space-x-4 max-w-4xl">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                    <Stethoscope className="h-6 w-6 text-white" />
                  </div>
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-6 py-4 shadow-lg">
                    <div className="flex items-center space-x-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 font-medium">Analyzing your medical query...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 flex-shrink-0">
            {uploadedFiles.length > 0 && (
              <div className="mb-3 space-y-2">
                <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-1">
                  <FileCheck className="h-3 w-3" />
                  <span>Files</span>
                </h4>
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="flex items-center space-x-2 p-2 bg-blue-50 dark:bg-gray-700 rounded-lg border border-blue-200 dark:border-gray-600">
                    <div className="w-6 h-6 bg-white dark:bg-gray-800 rounded-md flex items-center justify-center">
                      {file.type.startsWith('image/') ? (
                        <ImageIcon className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                      ) : (
                        <FileText className="h-3 w-3 text-green-600 dark:text-green-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">{file.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <button
                      onClick={() => removeFile(file.id)}
                      className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors duration-200"
                    >
                      <X className="h-3 w-3 text-gray-400 hover:text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex space-x-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about health, symptoms, or upload documents..."
                  className="w-full px-4 py-3 pr-12 text-sm border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded transition-all duration-200"
                  disabled={isLoading || isUploading}
                  title="Upload PDF, image, or document"
                >
                  {isUploading ? (
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Paperclip className="h-4 w-4 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400" />
                  )}
                </button>
              </div>
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 disabled:from-gray-300 disabled:to-gray-400 dark:disabled:from-gray-600 dark:disabled:to-gray-700 text-white rounded-lg transition-all duration-300 flex items-center space-x-2 font-medium"
              >
                <Send className="h-4 w-4" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </form>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />

            {/* Medical Disclaimer */}
            <div className="mt-2 px-2 py-1 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded text-center">
              <p className="text-xs text-amber-700 dark:text-amber-300">
                ⚠️ AI for information only • Not medical advice • Consult healthcare providers
              </p>
            </div>
          </div>
        </div>

        {/* Cognitive Transparency Panel */}
        {showThinking && (
          <div className="w-96 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-l border-blue-200/30 dark:border-gray-700/50 shadow-2xl">
            <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-green-500 rounded-full animate-pulse"></div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">AI Analysis Process</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Real-time medical analysis in progress</p>
            </div>
            
            <div className="p-6 space-y-4 max-h-[calc(100vh-12rem)] overflow-y-auto">
              {thinkingSteps.map((step, index) => (
                <div key={index} className={`flex items-start space-x-4 p-4 rounded-2xl transition-all duration-500 ${
                  step.completed 
                    ? 'bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200/50 dark:border-green-800/50' 
                    : 'bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600'
                }`}>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                    step.completed 
                      ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg' 
                      : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
                  }`}>
                    {step.completed ? <CheckCircle className="h-4 w-4" /> : step.icon}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium transition-colors duration-300 ${
                      step.completed 
                        ? 'text-gray-900 dark:text-white' 
                        : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {step.text}
                    </p>
                    {step.completed && (
                      <div className="mt-2 flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-green-600 dark:text-green-400 font-medium">Completed</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}