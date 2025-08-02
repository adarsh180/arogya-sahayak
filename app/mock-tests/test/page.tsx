'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Clock, CheckCircle, AlertCircle, ArrowRight, ArrowLeft, Flag } from 'lucide-react'
import Navbar from '@/components/Navbar'
import toast from 'react-hot-toast'

interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export default function MockTest() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<{ [key: number]: number }>({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [testStarted, setTestStarted] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [testResults, setTestResults] = useState<any>(null)
  const timerRef = useRef<NodeJS.Timeout>()

  const exam = searchParams.get('exam')
  const subject = searchParams.get('subject')
  const mode = searchParams.get('mode')
  const questionCount = parseInt(searchParams.get('questions') || '10')
  const duration = parseInt(searchParams.get('duration') || '15')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (session && exam && subject) {
      generateQuestions()
    }
  }, [status, session, exam, subject])

  useEffect(() => {
    if (testStarted && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
    } else if (testStarted && timeLeft === 0) {
      handleSubmitTest()
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [testStarted, timeLeft])

  const generateQuestions = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/mock-tests/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exam,
          subject,
          questionCount,
          difficulty: 'mixed'
        })
      })

      if (response.ok) {
        const data = await response.json()
        setQuestions(data.questions)
        setTimeLeft(duration * 60)
      } else {
        toast.error('Failed to generate questions')
        router.push('/mock-tests')
      }
    } catch (error) {
      toast.error('Network error')
      router.push('/mock-tests')
    } finally {
      setIsLoading(false)
    }
  }

  const startTest = () => {
    setTestStarted(true)
  }

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }))
  }

  const handleSubmitTest = async () => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/mock-tests/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exam,
          subject,
          questions,
          answers,
          timeSpent: (duration * 60) - timeLeft,
          mode
        })
      })

      if (response.ok) {
        const results = await response.json()
        setTestResults(results)
        setShowResults(true)
      } else {
        toast.error('Failed to submit test')
      }
    } catch (error) {
      toast.error('Network error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400'
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-medical-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600 dark:text-gray-300">Generating AI questions...</p>
        </div>
      </div>
    )
  }

  if (showResults && testResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-medical-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 theme-transition">
        <Navbar />
        
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-medical-400 rounded-full blur-2xl opacity-20 animate-pulse"></div>
              <div className="relative p-6 bg-gradient-to-r from-primary-100 to-medical-100 dark:from-primary-900/30 dark:to-medical-900/30 rounded-full w-24 h-24 mx-auto flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold gradient-text mb-4">Test Completed!</h1>
            <p className="text-gray-600 dark:text-gray-300">Here are your results</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="card">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Score Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Score</span>
                  <span className={`text-3xl font-bold ${getScoreColor(testResults.score)}`}>
                    {testResults.score}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Correct Answers</span>
                  <span className="font-bold text-gray-900 dark:text-gray-100">
                    {testResults.correctAnswers}/{testResults.totalQuestions}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Time Taken</span>
                  <span className="font-bold text-gray-900 dark:text-gray-100">
                    {Math.floor(testResults.timeSpent / 60)}m {testResults.timeSpent % 60}s
                  </span>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Performance</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Accuracy</span>
                    <span className="text-gray-900 dark:text-gray-100">{testResults.score}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-primary-500 to-medical-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${testResults.score}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p>• {testResults.correctAnswers} correct answers</p>
                  <p>• {testResults.totalQuestions - testResults.correctAnswers} incorrect answers</p>
                  <p>• Average time per question: {Math.round(testResults.timeSpent / testResults.totalQuestions)}s</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={() => router.push('/mock-tests')}
              className="btn-secondary flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Tests</span>
            </button>
            <button
              onClick={() => router.push('/analytics')}
              className="btn-primary flex items-center space-x-2"
            >
              <span>View Analytics</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!testStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-medical-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 theme-transition">
        <Navbar />
        
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold gradient-text mb-4">Ready to Start?</h1>
            <p className="text-gray-600 dark:text-gray-300">Review the test details before beginning</p>
          </div>

          <div className="card mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Test Details</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Test Information</h3>
                <div className="space-y-2 text-gray-600 dark:text-gray-300">
                  <p>• Exam: {exam?.toUpperCase()}</p>
                  <p>• Subject: {subject}</p>
                  <p>• Questions: {questionCount}</p>
                  <p>• Duration: {duration} minutes</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Instructions</h3>
                <div className="space-y-2 text-gray-600 dark:text-gray-300">
                  <p>• Read each question carefully</p>
                  <p>• Select the best answer</p>
                  <p>• You can navigate between questions</p>
                  <p>• Submit before time runs out</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={startTest}
              className="btn-primary text-xl px-12 py-4 flex items-center space-x-3 mx-auto"
            >
              <span>Start Test</span>
              <ArrowRight className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  const currentQ = questions[currentQuestion]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-medical-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 theme-transition">
      <Navbar />
      
      <div className="max-w-6xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gray-200/50 dark:border-dark-700/50">
          <div className="flex items-center space-x-4">
            <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Question {currentQuestion + 1} of {questions.length}
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl ${
              timeLeft < 300 ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300' : 
              'bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
            }`}>
              <Clock className="h-5 w-5" />
              <span className="font-bold">{formatTime(timeLeft)}</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Question Panel */}
          <div className="lg:col-span-3">
            <div className="card mb-6">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium">
                    {currentQ?.difficulty?.toUpperCase()}
                  </span>
                </div>
                
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 leading-relaxed">
                  {currentQ?.question}
                </h2>
                
                <div className="space-y-3">
                  {currentQ?.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(currentQuestion, index)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 ${
                        answers[currentQuestion] === index
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                          : 'border-gray-200 dark:border-dark-700 hover:border-primary-300 dark:hover:border-primary-600 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          answers[currentQuestion] === index
                            ? 'border-primary-500 bg-primary-500'
                            : 'border-gray-300 dark:border-dark-600'
                        }`}>
                          {answers[currentQuestion] === index && (
                            <CheckCircle className="h-4 w-4 text-white" />
                          )}
                        </div>
                        <span className="font-medium">{String.fromCharCode(65 + index)}.</span>
                        <span>{option}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-dark-700">
                <button
                  onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                  disabled={currentQuestion === 0}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Previous</span>
                </button>
                
                {currentQuestion === questions.length - 1 ? (
                  <button
                    onClick={handleSubmitTest}
                    disabled={isSubmitting}
                    className="btn-primary disabled:opacity-50 flex items-center space-x-2"
                  >
                    <span>{isSubmitting ? 'Submitting...' : 'Submit Test'}</span>
                    <CheckCircle className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <span>Next</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Question Navigator */}
          <div className="card h-fit">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Question Navigator</h3>
            <div className="grid grid-cols-5 gap-2">
              {questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-10 h-10 rounded-lg font-semibold transition-all duration-300 ${
                    index === currentQuestion
                      ? 'bg-primary-600 text-white'
                      : answers[index] !== undefined
                      ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-700'
                      : 'bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-600'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-4 h-4 bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded"></div>
                <span>Answered</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-100 dark:bg-dark-700 rounded"></div>
                <span>Not answered</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}