'use client'

import { useState } from 'react'
import { Search, ChevronDown, ChevronRight, HelpCircle, Book, MessageCircle, Phone } from 'lucide-react'
import Navbar from '@/components/Navbar'

const faqs = [
  {
    category: 'Getting Started',
    questions: [
      {
        q: 'How do I create an account on Arogya Sahayak?',
        a: 'You can create an account by clicking the "Sign Up" button and filling in your details, or by signing up with Google for quick access.'
      },
      {
        q: 'Is Arogya Sahayak free to use?',
        a: 'Yes, Arogya Sahayak is completely free to use. All core features including AI medical chat, symptom checker, and health tracking are available at no cost.'
      },
      {
        q: 'What languages does Arogya Sahayak support?',
        a: 'We support 29+ Indian languages including Hindi, Bengali, Tamil, Telugu, Marathi, Gujarati, and many more regional languages.'
      }
    ]
  },
  {
    category: 'Medical Features',
    questions: [
      {
        q: 'How accurate is the AI medical advice?',
        a: 'Our AI provides general health information and guidance. While it\'s trained on medical knowledge, it should not replace professional medical consultation. Always consult a doctor for serious health concerns.'
      },
      {
        q: 'Can I use the symptom checker for emergencies?',
        a: 'No, the symptom checker is for informational purposes only. In case of medical emergencies, immediately contact emergency services (102) or visit the nearest hospital.'
      },
      {
        q: 'How does the health tracker work?',
        a: 'You can manually input your health metrics like BMI, blood pressure, glucose levels, and heart rate. The AI analyzes trends and provides insights about your health patterns.'
      }
    ]
  },
  {
    category: 'Student Features',
    questions: [
      {
        q: 'Which medical exams does the student corner support?',
        a: 'We support 21+ medical entrance exams including NEET UG, NEET PG, AIIMS, JIPMER, FMGE, and many state-level medical entrance exams.'
      },
      {
        q: 'Can I get practice questions for my target exam?',
        a: 'Yes! Our AI tutor can generate practice questions, explain concepts, and provide study strategies tailored to your specific exam and subjects.'
      },
      {
        q: 'Is the study material updated regularly?',
        a: 'Our AI is trained on current medical knowledge and exam patterns. The content is continuously updated to reflect the latest medical information and exam trends.'
      }
    ]
  },
  {
    category: 'Privacy & Security',
    questions: [
      {
        q: 'Is my medical data secure?',
        a: 'Yes, we use industry-standard encryption to protect your data. Your medical information is stored securely and is never shared with third parties without your consent.'
      },
      {
        q: 'Can I delete my account and data?',
        a: 'Yes, you can delete your account anytime from your profile settings. This will permanently remove all your data from our servers.'
      },
      {
        q: 'Do you share data with healthcare providers?',
        a: 'We do not share your personal health data with any healthcare providers or third parties without your explicit consent.'
      }
    ]
  }
]

export default function Help() {
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['Getting Started'])
  const [expandedQuestions, setExpandedQuestions] = useState<string[]>([])

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const toggleQuestion = (question: string) => {
    setExpandedQuestions(prev =>
      prev.includes(question)
        ? prev.filter(q => q !== question)
        : [...prev, question]
    )
  }

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(
      qa => qa.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
            qa.a.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <HelpCircle className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about Arogya Sahayak and learn how to make the most of our features.
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for help topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <a href="/contact" className="card hover:shadow-lg transition-all duration-200 text-center group">
            <MessageCircle className="h-12 w-12 text-blue-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Contact Support</h3>
            <p className="text-gray-600 text-sm">Get personalized help from our support team</p>
          </a>

          <div className="card text-center">
            <Book className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">User Guide</h3>
            <p className="text-gray-600 text-sm">Learn how to use all features effectively</p>
          </div>

          <div className="card text-center">
            <Phone className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Emergency Help</h3>
            <p className="text-gray-600 text-sm">Quick access to emergency medical services</p>
          </div>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-6">
          {filteredFaqs.map((category) => (
            <div key={category.category} className="card">
              <button
                onClick={() => toggleCategory(category.category)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <h2 className="text-xl font-semibold text-gray-900">{category.category}</h2>
                {expandedCategories.includes(category.category) ? (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-gray-500" />
                )}
              </button>

              {expandedCategories.includes(category.category) && (
                <div className="px-4 pb-4 space-y-4">
                  {category.questions.map((qa, index) => (
                    <div key={index} className="border-l-4 border-blue-200 pl-4">
                      <button
                        onClick={() => toggleQuestion(`${category.category}-${index}`)}
                        className="w-full text-left font-medium text-gray-900 hover:text-blue-600 transition-colors"
                      >
                        {qa.q}
                      </button>
                      {expandedQuestions.includes(`${category.category}-${index}`) && (
                        <p className="mt-2 text-gray-600 leading-relaxed">{qa.a}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Still Need Help */}
        <div className="mt-12 card bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Still need help?</h2>
            <p className="text-gray-600 mb-6">
              Can't find what you're looking for? Our support team is here to help you.
            </p>
            <a
              href="/contact"
              className="btn-primary inline-flex items-center space-x-2"
            >
              <MessageCircle className="h-5 w-5" />
              <span>Contact Support</span>
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-16 pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-600">
            © 2024 Arogya Sahayak. All rights reserved. Created by <strong>Adarsh Tiwari</strong> on 10/12/2024.
          </p>
        </div>
      </div>
    </div>
  )
}