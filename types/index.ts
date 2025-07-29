export interface User {
  id: string
  name?: string
  email: string
  image?: string
  phone?: string
  age?: number
  gender?: string
  location?: string
  preferredLanguage?: string
  userType: 'patient' | 'student'
  createdAt: Date
  updatedAt: Date
}

export interface ChatSession {
  id: string
  userId: string
  title: string
  type: 'medical' | 'student' | 'symptom'
  language: string
  createdAt: Date
  updatedAt: Date
  messages: Message[]
}

export interface Message {
  id: string
  chatSessionId: string
  role: 'user' | 'assistant'
  content: string
  language: string
  translation?: string
  createdAt: Date
}

export interface SymptomCheck {
  id: string
  userId: string
  symptoms: string[]
  severity: 'mild' | 'moderate' | 'severe'
  duration: string
  age: number
  gender: string
  analysis: string
  suggestions: string
  language: string
  createdAt: Date
}

export interface SymptomFormData {
  symptoms: string[]
  severity: 'mild' | 'moderate' | 'severe'
  duration: string
  age: number
  gender: 'male' | 'female' | 'other'
  additionalInfo?: string
}