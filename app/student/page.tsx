'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { GraduationCap, BookOpen, Brain, Send, Bot, User, Plus, MessageCircle, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { MEDICAL_EXAMS } from '@/lib/ai'
import toast from 'react-hot-toast'

const EXAM_SUBJECTS = {
  'neet-ug': {
    'physics': 'Physics',
    'chemistry': 'Chemistry', 
    'biology': 'Biology (Botany + Zoology)',
    'general': 'General Knowledge'
  },
  'neet-pg': {
    'anatomy': 'Anatomy',
    'physiology': 'Physiology',
    'biochemistry': 'Biochemistry',
    'pathology': 'Pathology',
    'pharmacology': 'Pharmacology',
    'microbiology': 'Microbiology',
    'forensic': 'Forensic Medicine',
    'community': 'Community Medicine',
    'medicine': 'General Medicine',
    'surgery': 'General Surgery',
    'pediatrics': 'Pediatrics',
    'gynecology': 'Gynecology & Obstetrics',
    'orthopedics': 'Orthopedics',
    'ent': 'ENT',
    'ophthalmology': 'Ophthalmology',
    'dermatology': 'Dermatology',
    'psychiatry': 'Psychiatry',
    'radiology': 'Radiology',
    'anesthesia': 'Anesthesiology'
  },
  'aiims-ug': {
    'physics': 'Physics',
    'chemistry': 'Chemistry',
    'biology': 'Biology',
    'gk': 'General Knowledge',
    'aptitude': 'Logical Thinking'
  },
  'aiims-pg': {
    'anatomy': 'Anatomy',
    'physiology': 'Physiology', 
    'biochemistry': 'Biochemistry',
    'pathology': 'Pathology',
    'pharmacology': 'Pharmacology',
    'microbiology': 'Microbiology',
    'medicine': 'General Medicine',
    'surgery': 'General Surgery'
  },
  'fmge': {
    'medicine': 'General Medicine',
    'surgery': 'General Surgery',
    'pediatrics': 'Pediatrics',
    'gynecology': 'Gynecology & Obstetrics',
    'community': 'Community Medicine',
    'pathology': 'Pathology',
    'pharmacology': 'Pharmacology',
    'microbiology': 'Microbiology'
  },
  'default': {
    'anatomy': 'Anatomy',
    'physiology': 'Physiology',
    'biochemistry': 'Biochemistry',
    'pathology': 'Pathology',
    'pharmacology': 'Pharmacology',
    'medicine': 'General Medicine',
    'surgery': 'General Surgery'
  }
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
}

export default function StudentCorner() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [step, setStep] = useState(1) // 1: exam selection, 2: subject selection, 3: chat
  const [selectedExam, setSelectedExam] = useState('')
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [chatSessions, setChatSessions] = useState<any[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
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
      fetchStudentChatSessions()
    }
  }, [session])

  const fetchStudentChatSessions = async () => {
    try {
      const response = await fetch('/api/chat?type=student')
      if (response.ok) {
        const sessions = await response.json()
        setChatSessions(sessions.filter((s: any) => s.type === 'student'))
      }
    } catch (error) {
      console.error('Failed to fetch student chat sessions:', error)
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

  const startNewStudentChat = () => {
    setMessages([])
    setCurrentSessionId(null)
  }

  const handleExamSelect = (exam: string) => {
    setSelectedExam(exam)
    setStep(2)
  }

  const handleSubjectToggle = (subject: string) => {
    setSelectedSubjects(prev => 
      prev.includes(subject) 
        ? prev.filter(s => s !== subject)
        : [...prev, subject]
    )
  }

  const startStudySession = () => {
    if (selectedSubjects.length === 0) {
      toast.error('Please select at least one subject')
      return
    }
    setStep(3)
  }

  const getSubjectDescription = (code: string) => {
    const descriptions: { [key: string]: string } = {
      physics: 'Mechanics, Thermodynamics, Optics',
      chemistry: 'Organic, Inorganic, Physical',
      biology: 'Botany, Zoology, Genetics',
      anatomy: 'Human Body Structure',
      physiology: 'Body Functions & Systems',
      pathology: 'Disease Mechanisms',
      pharmacology: 'Drug Actions & Effects',
      medicine: 'Clinical Medicine',
      surgery: 'Surgical Procedures'
    }
    return descriptions[code] || 'Medical Subject'
  }

  const goBack = () => {
    if (step === 2) {
      setStep(1)
      setSelectedSubjects([])
    } else if (step === 3) {
      setStep(2)
      setMessages([])
      setCurrentSessionId(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setIsLoading(true)

    // Add context about exam and subjects
    const examName = MEDICAL_EXAMS[selectedExam as keyof typeof MEDICAL_EXAMS]
    const subjectNames = selectedSubjects.map(s => EXAM_SUBJECTS[selectedExam as keyof typeof EXAM_SUBJECTS]?.[s] || s).join(', ')
    const contextualMessage = `[${examName} - ${subjectNames}] ${userMessage}`

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
          message: contextualMessage,
          chatSessionId: currentSessionId,
          type: 'student',
          language: 'en'
        })
      })

      if (response.ok) {
        const data = await response.json()
        
        // Update current session ID if it's a new chat
        if (!currentSessionId) {
          setCurrentSessionId(data.chatSessionId)
          fetchStudentChatSessions() // Refresh sessions list
        }

        // Add assistant message
        setMessages(prev => [...prev, {
          id: data.message.id,
          role: 'assistant',
          content: data.message.content,
          createdAt: data.message.createdAt
        }])
      } else {
        toast.error('Failed to send message')
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

  // Step 1: Exam Selection
  if (step === 1) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="relative inline-block mb-6">
              <GraduationCap className="h-16 w-16 text-purple-600 mx-auto" />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">AI</span>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Student Corner</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
              Choose your target exam to get personalized AI tutoring and practice questions
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-600 rounded-full mr-2"></div>
                <span>21+ Medical Exams</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span>AI-Powered Learning</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                <span>Personalized Study Plans</span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(MEDICAL_EXAMS).map(([code, name]) => {
              const isPopular = ['neet-ug', 'neet-pg', 'aiims-ug', 'fmge'].includes(code)
              return (
                <button
                  key={code}
                  onClick={() => handleExamSelect(code)}
                  className={`card hover:shadow-lg transition-all duration-200 text-left group relative ${
                    isPopular ? 'border-purple-200 bg-purple-50' : 'hover:border-purple-300'
                  }`}
                >
                  {isPopular && (
                    <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                      Popular
                    </span>
                  )}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        isPopular ? 'bg-purple-100' : 'bg-gray-100'
                      }`}>
                        <GraduationCap className={`h-6 w-6 ${
                          isPopular ? 'text-purple-600' : 'text-gray-600'
                        }`} />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-gray-900 mb-1">
                          {name.split('(')[0].trim()}
                        </h3>
                        {name.includes('(') && (
                          <p className="text-xs text-gray-500">
                            {name.match(/\(([^)]+)\)/)?.[1]}
                          </p>
                        )}
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-purple-600 transition-colors flex-shrink-0" />
                  </div>
                  <div className="text-xs text-gray-600">
                    {code.includes('ug') ? 'Undergraduate Level' : 
                     code.includes('pg') ? 'Postgraduate Level' :
                     code.includes('ss') ? 'Super Specialty' :
                     code.includes('nursing') ? 'Nursing Entrance' :
                     'Medical Entrance'}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // Step 2: Subject Selection
  if (step === 2) {
    const availableSubjects = EXAM_SUBJECTS[selectedExam as keyof typeof EXAM_SUBJECTS] || EXAM_SUBJECTS.default
    
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <button
              onClick={goBack}
              className="flex items-center text-purple-600 hover:text-purple-700 mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Exam Selection
            </button>
            
            <div className="text-center">
              <div className="inline-flex items-center space-x-3 mb-4">
                <div className="p-3 bg-purple-100 rounded-full">
                  <BookOpen className="h-8 w-8 text-purple-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {MEDICAL_EXAMS[selectedExam as keyof typeof MEDICAL_EXAMS]}
                  </h1>
                  <p className="text-sm text-gray-500">
                    Subject Selection
                  </p>
                </div>
              </div>
              <p className="text-gray-600 mb-8 max-w-lg mx-auto">
                Choose the subjects you want to focus on. You can select multiple subjects for comprehensive preparation.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
            {Object.entries(availableSubjects).map(([code, name]) => {
              const isSelected = selectedSubjects.includes(code)
              return (
                <button
                  key={code}
                  onClick={() => handleSubjectToggle(code)}
                  className={`card text-left transition-all duration-200 relative overflow-hidden ${
                    isSelected
                      ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-purple-100 shadow-md transform scale-105'
                      : 'hover:border-purple-300 hover:shadow-md hover:scale-102'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-purple-500">
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center flex-1">
                      <div className={`p-2 rounded-lg mr-3 ${
                        isSelected ? 'bg-purple-200' : 'bg-gray-100'
                      }`}>
                        <BookOpen className={`h-5 w-5 ${
                          isSelected ? 'text-purple-600' : 'text-gray-500'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-medium text-sm ${
                          isSelected ? 'text-purple-900' : 'text-gray-900'
                        }`}>{name}</h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {getSubjectDescription(code)}
                        </p>
                      </div>
                    </div>
                    {isSelected && (
                      <CheckCircle className="h-5 w-5 text-purple-600 flex-shrink-0" />
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              Selected: {selectedSubjects.length} subject{selectedSubjects.length !== 1 ? 's' : ''}
            </p>
            <button
              onClick={startStudySession}
              disabled={selectedSubjects.length === 0}
              className="btn-primary px-8 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center mx-auto"
            >
              Start Study Session
              <ArrowRight className="h-5 w-5 ml-2" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Step 3: Chat Interface
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <button
              onClick={startNewStudentChat}
              className="w-full flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>New Study Session</span>
            </button>
          </div>

          {/* Current Selection */}
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Current Session</h3>
            <div className="space-y-2">
              <div className="text-xs text-gray-600">
                <strong>Exam:</strong> {MEDICAL_EXAMS[selectedExam as keyof typeof MEDICAL_EXAMS]}
              </div>
              <div className="text-xs text-gray-600">
                <strong>Subjects:</strong> {selectedSubjects.length} selected
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {selectedSubjects.slice(0, 3).map(subject => (
                  <span key={subject} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                    {EXAM_SUBJECTS[selectedExam as keyof typeof EXAM_SUBJECTS]?.[subject]?.split(' ')[0] || subject}
                  </span>
                ))}
                {selectedSubjects.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                    +{selectedSubjects.length - 3}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Chat Sessions */}
          <div className="flex-1 overflow-y-auto p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Study Sessions</h3>
            <div className="space-y-2">
              {chatSessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => loadChatSession(session.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    currentSessionId === session.id
                      ? 'bg-purple-100 text-purple-700'
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

          {/* Quick Tips */}
          <div className="p-4 border-t border-gray-200 bg-purple-50">
            <h4 className="text-sm font-medium text-purple-900 mb-2">
              <Brain className="inline h-4 w-4 mr-1" />
              Study Tips
            </h4>
            <ul className="text-xs text-purple-700 space-y-1">
              <li>• Ask for practice questions</li>
              <li>• Request concept explanations</li>
              <li>• Get study strategies</li>
              <li>• Clarify doubts instantly</li>
            </ul>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <GraduationCap className="h-6 w-6 text-purple-600" />
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">AI Study Session</h1>
                  <p className="text-sm text-gray-600">
                    {MEDICAL_EXAMS[selectedExam as keyof typeof MEDICAL_EXAMS]} - {selectedSubjects.length} subject{selectedSubjects.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <button
                onClick={goBack}
                className="text-purple-600 hover:text-purple-700 text-sm flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Change Subjects
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedSubjects.map(subject => {
                const subjectName = EXAM_SUBJECTS[selectedExam as keyof typeof EXAM_SUBJECTS]?.[subject] || subject
                return (
                  <span key={subject} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                    {subjectName}
                  </span>
                )
              })}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-12">
                <GraduationCap className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Welcome to Student Corner</h3>
                <p className="text-gray-600 max-w-md mx-auto mb-6">
                  I'm your AI tutor for medical studies. Ask me questions about concepts, practice problems, 
                  study strategies, or exam preparation.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-2">Practice Questions</h4>
                    <p className="text-sm text-gray-600">"Give me 5 MCQs on {selectedSubjects.length > 0 ? EXAM_SUBJECTS[selectedExam as keyof typeof EXAM_SUBJECTS]?.[selectedSubjects[0]] : 'your selected topics'}"</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-2">Concept Explanation</h4>
                    <p className="text-sm text-gray-600">"Explain the key concepts in {selectedSubjects.length > 0 ? EXAM_SUBJECTS[selectedExam as keyof typeof EXAM_SUBJECTS]?.[selectedSubjects[0]] : 'your subjects'}"</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-2">Study Strategy</h4>
                    <p className="text-sm text-gray-600">"How should I prepare for {MEDICAL_EXAMS[selectedExam as keyof typeof MEDICAL_EXAMS]}?"</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-2">Previous Year Questions</h4>
                    <p className="text-sm text-gray-600">"Show me previous year questions from {MEDICAL_EXAMS[selectedExam as keyof typeof MEDICAL_EXAMS]}"</p>
                  </div>
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex space-x-3 max-w-4xl ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === 'user' ? 'bg-purple-600' : 'bg-blue-600'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="h-4 w-4 text-white" />
                    ) : (
                      <GraduationCap className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <div className={`chat-message ${message.role === 'user' ? 'bg-purple-100' : 'bg-blue-50'}`}>
                    <div className="text-sm leading-relaxed">
                      {message.content.split('\n').map((line, index) => (
                        line.trim() ? (
                          <p key={index} className="mb-3 last:mb-0 text-gray-800">
                            {line.startsWith('•') ? (
                              <span className="flex items-start">
                                <span className="text-purple-600 mr-2 mt-1">•</span>
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
                <div className="flex space-x-3 max-w-4xl">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                    <GraduationCap className="h-4 w-4 text-white" />
                  </div>
                  <div className="chat-message bg-blue-50">
                    <div className="loading-dots">Thinking</div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <div className="bg-white border-t border-gray-200 p-4">
            <form onSubmit={handleSubmit} className="flex space-x-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about medical studies, concepts, or exam preparation..."
                className="flex-1 input-field"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 flex items-center space-x-2"
              >
                <Send className="h-4 w-4" />
                <span>Send</span>
              </button>
            </form>
            <p className="text-xs text-gray-500 mt-2">
              AI tutor for medical education. Verify important information with textbooks and professors.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}