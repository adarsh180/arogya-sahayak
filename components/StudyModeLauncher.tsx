'use client'

import { useState } from 'react'
import { Brain, BookOpen, Target, Zap, ArrowRight, X } from 'lucide-react'
import StudyMode from './StudyMode'

interface StudyModeLauncherProps {
  isOpen: boolean
  onClose: () => void
}

export default function StudyModeLauncher({ isOpen, onClose }: StudyModeLauncherProps) {
  const [selectedTopic, setSelectedTopic] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [showStudyMode, setShowStudyMode] = useState(false)

  const medicalTopics = {
    'Anatomy': [
      'Cardiovascular System',
      'Respiratory System', 
      'Nervous System',
      'Musculoskeletal System',
      'Digestive System',
      'Endocrine System'
    ],
    'Physiology': [
      'Cardiac Physiology',
      'Respiratory Physiology',
      'Renal Physiology',
      'Neurophysiology',
      'Endocrine Physiology',
      'Gastrointestinal Physiology'
    ],
    'Pathology': [
      'Inflammation',
      'Neoplasia',
      'Cardiovascular Pathology',
      'Respiratory Pathology',
      'Infectious Diseases',
      'Autoimmune Disorders'
    ],
    'Pharmacology': [
      'Cardiovascular Drugs',
      'Antibiotics',
      'CNS Drugs',
      'Endocrine Drugs',
      'Anti-inflammatory Drugs',
      'Chemotherapy'
    ]
  }

  const startStudySession = () => {
    if (selectedTopic && selectedSubject) {
      setShowStudyMode(true)
    }
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4">
        <div className="bg-neutral-900/95 backdrop-blur-2xl rounded-3xl border border-neutral-800/50 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-neutral-800/40">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-medical-500 rounded-2xl flex items-center justify-center">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-neutral-100">AI Study Mode</h2>
                <p className="text-neutral-400">Choose your learning path</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-800/60 rounded-xl transition-colors text-neutral-400"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            
            {/* Features Overview */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-neutral-800/40 rounded-2xl border border-neutral-700/40">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-neutral-100 mb-2">Adaptive Learning</h3>
                <p className="text-sm text-neutral-400">AI adjusts to your learning style and pace</p>
              </div>

              <div className="text-center p-6 bg-neutral-800/40 rounded-2xl border border-neutral-700/40">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-neutral-100 mb-2">Interactive Sessions</h3>
                <p className="text-sm text-neutral-400">Engaging conversations with practice exercises</p>
              </div>

              <div className="text-center p-6 bg-neutral-800/40 rounded-2xl border border-neutral-700/40">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-neutral-100 mb-2">Real-time Feedback</h3>
                <p className="text-sm text-neutral-400">Instant corrections and explanations</p>
              </div>
            </div>

            {/* Topic Selection */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-neutral-100">Select Your Study Topic</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Subject Selection */}
                <div>
                  <label className="block text-sm font-semibold text-neutral-300 mb-3">Subject</label>
                  <div className="space-y-2">
                    {Object.keys(medicalTopics).map((subject) => (
                      <button
                        key={subject}
                        onClick={() => {
                          setSelectedSubject(subject)
                          setSelectedTopic('')
                        }}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                          selectedSubject === subject
                            ? 'border-primary-500 bg-primary-900/20 text-primary-300'
                            : 'border-neutral-700/60 hover:border-neutral-600/80 text-neutral-300 hover:bg-neutral-800/40'
                        }`}
                      >
                        <div className="font-semibold">{subject}</div>
                        <div className="text-sm opacity-75">
                          {medicalTopics[subject as keyof typeof medicalTopics].length} topics available
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Topic Selection */}
                <div>
                  <label className="block text-sm font-semibold text-neutral-300 mb-3">
                    Topic {selectedSubject && `(${selectedSubject})`}
                  </label>
                  {selectedSubject ? (
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                      {medicalTopics[selectedSubject as keyof typeof medicalTopics].map((topic) => (
                        <button
                          key={topic}
                          onClick={() => setSelectedTopic(topic)}
                          className={`w-full text-left p-3 rounded-xl border transition-all duration-200 ${
                            selectedTopic === topic
                              ? 'border-medical-500 bg-medical-900/20 text-medical-300'
                              : 'border-neutral-700/60 hover:border-neutral-600/80 text-neutral-300 hover:bg-neutral-800/40'
                          }`}
                        >
                          {topic}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="h-80 flex items-center justify-center bg-neutral-800/20 rounded-xl border border-neutral-700/40">
                      <p className="text-neutral-500">Select a subject first</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Start Button */}
              <div className="flex justify-center pt-6">
                <button
                  onClick={startStudySession}
                  disabled={!selectedTopic || !selectedSubject}
                  className="btn-primary text-lg px-8 py-4 flex items-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Brain className="h-5 w-5" />
                  <span>Start AI Study Session</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>

              {selectedTopic && selectedSubject && (
                <div className="text-center p-4 bg-primary-900/20 border border-primary-700/40 rounded-xl">
                  <p className="text-primary-300 font-medium">
                    Ready to start: <span className="font-bold">{selectedTopic}</span> in {selectedSubject}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Study Mode Component */}
      <StudyMode
        isOpen={showStudyMode}
        onClose={() => {
          setShowStudyMode(false)
          onClose()
        }}
        initialTopic={selectedTopic}
        initialSubject={selectedSubject}
      />
    </>
  )
}