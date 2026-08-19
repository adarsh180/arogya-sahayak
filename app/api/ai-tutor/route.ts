import { NextRequest, NextResponse } from 'next/server'
import { callAI } from '@/lib/ai'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { checkRateLimit, getRequestKey, parseJson, rateLimitResponse } from '@/lib/api-security'

const tutorSchema = z.object({
  messages: z.array(z.object({ role: z.enum(['user', 'assistant']), content: z.string().min(1).max(4_000) })).min(1).max(30),
  tutorMode: z.enum(['socratic', 'adaptive', 'interactive', 'problem-solving', 'concept-mapping']).default('adaptive'),
  studentLevel: z.string().max(80).default('adaptive'),
  learningStyle: z.enum(['visual', 'auditory', 'kinesthetic', 'mixed']).default('mixed'),
  subject: z.string().trim().min(1).max(120),
  topic: z.string().trim().min(1).max(180),
  sessionContext: z.record(z.unknown()).optional()
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const rate = checkRateLimit(`tutor:${getRequestKey(request, session.user.id)}`, 10)
    if (!rate.allowed) return rateLimitResponse(rate.retryAfter)
    const parsed = await parseJson(request, tutorSchema)
    if (!parsed.ok) return parsed.response
    const { 
      messages, 
      tutorMode, 
      studentLevel, 
      learningStyle, 
      subject, 
      topic,
      sessionContext 
    } = parsed.data
    const safeMode = tutorMode || 'adaptive'
    const safeLearningStyle = learningStyle || 'mixed'

    let systemPrompt = ''
    let aiType: 'study-mode' | 'guided-learning' = 'study-mode'

    switch (tutorMode) {
      case 'socratic':
        aiType = 'guided-learning'
        systemPrompt = `You are using the Socratic method to teach ${topic} in ${subject}. 
        
        SOCRATIC TEACHING PRINCIPLES:
        - Ask probing questions instead of giving direct answers
        - Guide student to discover concepts through questioning
        - Build on student's existing knowledge
        - Use "What if..." and "Why do you think..." questions
        - Encourage critical thinking and reasoning
        - Celebrate insights and correct reasoning
        
        Student level: ${studentLevel}
        Learning style: ${learningStyle}
        
        Lead the student to understand ${topic} through guided questioning.`
        break

      case 'adaptive':
        systemPrompt = `You are an adaptive AI tutor teaching ${topic} in ${subject}.
        
        ADAPTIVE TEACHING FEATURES:
        - Adjust difficulty based on student responses
        - Provide multiple explanation styles
        - Use ${learningStyle} learning techniques
        - Offer immediate feedback and corrections
        - Identify and address knowledge gaps
        - Provide encouragement and motivation
        
        Student level: ${studentLevel}
        Current understanding: ${sessionContext?.understanding || 'unknown'}
        
        Adapt your teaching to the student's needs and responses.`
        break

      case 'interactive':
        systemPrompt = `You are conducting an interactive study session on ${topic} in ${subject}.
        
        INTERACTIVE ELEMENTS:
        - Include mini-quizzes and exercises
        - Ask for student predictions and hypotheses
        - Use real-world examples and case studies
        - Provide hands-on learning activities
        - Create engaging scenarios and simulations
        - Use gamification elements
        
        Student level: ${studentLevel}
        Learning preference: ${learningStyle}
        
        Make learning engaging and interactive.`
        break

      case 'problem-solving':
        aiType = 'guided-learning'
        systemPrompt = `You are teaching problem-solving skills for ${topic} in ${subject}.
        
        PROBLEM-SOLVING FRAMEWORK:
        1. Problem identification and analysis
        2. Information gathering and organization
        3. Strategy development and planning
        4. Solution implementation
        5. Evaluation and reflection
        
        Use step-by-step guidance:
        - Break complex problems into smaller parts
        - Teach systematic approaches
        - Provide thinking frameworks
        - Encourage multiple solution paths
        - Develop pattern recognition
        
        Student level: ${studentLevel}
        Focus on building analytical and critical thinking skills.`
        break

      case 'concept-mapping':
        systemPrompt = `You are helping create concept maps for ${topic} in ${subject}.
        
        CONCEPT MAPPING APPROACH:
        - Identify key concepts and relationships
        - Create hierarchical knowledge structures
        - Show connections between ideas
        - Use visual descriptions and analogies
        - Build comprehensive understanding
        - Connect to prior knowledge
        
        Help the student visualize and organize knowledge about ${topic}.
        Student level: ${studentLevel}
        Learning style: ${learningStyle}`
        break

      default:
        systemPrompt = `You are an advanced AI tutor for ${topic} in ${subject}.
        Provide comprehensive, engaging instruction adapted to ${studentLevel} level.
        Use ${learningStyle} learning techniques.`
    }

    const aiResponse = await callAI(
      messages,
      aiType,
      'en',
      1,
      {
        tutorMode,
        studentLevel,
        learningStyle,
        subject,
        topic,
        ...sessionContext
      }
    )

    // Generate learning analytics
    const analytics = generateLearningAnalytics(messages, aiResponse, sessionContext)
    
    // Suggest next learning activities
    const nextActivities = suggestNextActivities(safeMode, topic, subject, analytics)

    return NextResponse.json({
      response: aiResponse,
      analytics,
      nextActivities,
      studyTips: generateStudyTips(topic, subject, safeLearningStyle),
      progressUpdate: updateLearningProgress(sessionContext, analytics)
    })

  } catch (error) {
    console.error('AI Tutor API error:', error)
    return NextResponse.json(
      { error: 'Failed to process tutoring session' },
      { status: 500 }
    )
  }
}

function generateLearningAnalytics(messages: any[], response: string, context: any) {
  const studentMessages = messages.filter(m => m.role === 'user')
  const lastMessage = studentMessages[studentMessages.length - 1]?.content || ''

  return {
    engagement: calculateEngagement(studentMessages),
    comprehension: assessComprehension(lastMessage, response),
    questionQuality: evaluateQuestions(studentMessages),
    conceptMastery: estimateConceptMastery(context),
    learningVelocity: calculateLearningVelocity(context),
    recommendedFocus: identifyFocusAreas(studentMessages, response)
  }
}

function calculateEngagement(messages: any[]) {
  const avgLength = messages.reduce((sum, m) => sum + m.content.length, 0) / messages.length
  const hasQuestions = messages.some(m => m.content.includes('?'))
  const hasExamples = messages.some(m => /example|instance|like/i.test(m.content))
  
  let score = 0
  if (avgLength > 50) score += 30
  if (hasQuestions) score += 35
  if (hasExamples) score += 35
  
  return Math.min(score, 100)
}

function assessComprehension(studentMessage: string, aiResponse: string) {
  const hasCorrectTerms = /correct|right|exactly|good/i.test(aiResponse)
  const hasEncouragement = /great|excellent|well done/i.test(aiResponse)
  const needsClarification = /let me explain|try again|not quite/i.test(aiResponse)
  
  if (hasCorrectTerms && hasEncouragement) return 'high'
  if (hasCorrectTerms) return 'medium'
  if (needsClarification) return 'low'
  return 'medium'
}

function evaluateQuestions(messages: any[]) {
  const questions = messages.filter(m => m.content.includes('?'))
  const deepQuestions = questions.filter(m => 
    /why|how|what if|explain|difference|relationship/i.test(m.content)
  )
  
  return {
    total: questions.length,
    deep: deepQuestions.length,
    quality: deepQuestions.length / Math.max(questions.length, 1)
  }
}

function estimateConceptMastery(context: any) {
  // Simple estimation based on session progress
  const progress = context?.progress || 0
  const correctAnswers = context?.correctAnswers || 0
  const totalQuestions = context?.totalQuestions || 1
  
  const accuracy = correctAnswers / totalQuestions
  const mastery = (progress * 0.6) + (accuracy * 0.4)
  
  return Math.round(mastery * 100)
}

function calculateLearningVelocity(context: any) {
  const timeSpent = context?.timeSpent || 1
  const conceptsCovered = context?.conceptsCovered || 1
  
  return conceptsCovered / (timeSpent / 60) // concepts per minute
}

function identifyFocusAreas(messages: any[], response: string) {
  const areas = []
  
  if (/fundamental|basic|foundation/i.test(response)) {
    areas.push('Review fundamentals')
  }
  if (/practice|exercise|problem/i.test(response)) {
    areas.push('More practice needed')
  }
  if (/advanced|complex|detailed/i.test(response)) {
    areas.push('Ready for advanced concepts')
  }
  
  return areas.length > 0 ? areas : ['Continue current pace']
}

function suggestNextActivities(mode: string, topic: string, subject: string, analytics: any) {
  const activities = []
  
  if (analytics.comprehension === 'high') {
    activities.push({
      type: 'advance',
      title: 'Advanced Concepts',
      description: `Explore advanced aspects of ${topic}`,
      estimatedTime: '20-30 minutes'
    })
  }
  
  if (analytics.engagement < 70) {
    activities.push({
      type: 'interactive',
      title: 'Interactive Exercise',
      description: 'Hands-on practice to boost engagement',
      estimatedTime: '15-20 minutes'
    })
  }
  
  activities.push({
    type: 'review',
    title: 'Concept Review',
    description: `Summarize key points about ${topic}`,
    estimatedTime: '10-15 minutes'
  })
  
  return activities
}

function generateStudyTips(topic: string, subject: string, learningStyle: string) {
  const tips = {
    visual: [
      `Create diagrams and flowcharts for ${topic}`,
      `Use color coding to organize ${subject} concepts`,
      `Draw concept maps showing relationships`
    ],
    auditory: [
      `Explain ${topic} concepts out loud`,
      `Record yourself discussing ${subject} topics`,
      `Join study groups for ${topic} discussions`
    ],
    kinesthetic: [
      `Use hands-on models for ${topic}`,
      `Practice ${subject} procedures step-by-step`,
      `Create physical flashcards for ${topic}`
    ],
    mixed: [
      `Combine visual, auditory, and hands-on learning`,
      `Use multiple study methods for ${topic}`,
      `Alternate between different learning approaches`
    ]
  }
  
  return tips[learningStyle as keyof typeof tips] || tips.mixed
}

function updateLearningProgress(context: any, analytics: any) {
  return {
    conceptsMastered: analytics.conceptMastery,
    timeSpent: context?.timeSpent || 0,
    questionsAnswered: context?.questionsAnswered || 0,
    accuracy: analytics.comprehension === 'high' ? 90 : 
              analytics.comprehension === 'medium' ? 70 : 50,
    nextMilestone: analytics.conceptMastery > 80 ? 'Advanced Topics' : 'Concept Reinforcement'
  }
}
