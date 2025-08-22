import { NextRequest, NextResponse } from 'next/server'
import { callAI } from '@/lib/ai'

export async function POST(request: NextRequest) {
  try {
    const { 
      action, 
      topic, 
      subject, 
      difficulty, 
      learningStyle, 
      messages, 
      studyContext 
    } = await request.json()

    let prompt = ''
    let aiType: 'study-mode' | 'guided-learning' = 'study-mode'

    switch (action) {
      case 'start-session':
        prompt = `Start an advanced study session on "${topic}" in ${subject}. 
        Student level: ${difficulty}
        Learning style: ${learningStyle}
        
        Begin with:
        1. Learning objective for this session
        2. Quick assessment of current knowledge
        3. Personalized learning path
        4. Interactive introduction to the topic
        
        Use engaging, interactive teaching methods with questions and exercises.`
        break

      case 'guided-learning':
        aiType = 'guided-learning'
        prompt = `Switch to guided learning mode for "${topic}". 
        Provide:
        1. Step-by-step breakdown of the concept
        2. Interactive exercises with immediate feedback
        3. Real-world applications and examples
        4. Practice problems with guided solutions
        5. Progress checkpoints
        
        Use Socratic method and active learning techniques.`
        break

      case 'practice-mode':
        prompt = `Create practice exercises for "${topic}" in ${subject}.
        Difficulty: ${difficulty}
        
        Include:
        1. Multiple choice questions with explanations
        2. Case-based scenarios
        3. Problem-solving exercises
        4. Memory techniques and mnemonics
        5. Self-assessment tools`
        break

      case 'review-session':
        prompt = `Conduct a review session for "${topic}".
        
        Provide:
        1. Key concept summary
        2. Common misconceptions and clarifications
        3. Quick recall exercises
        4. Connection to related topics
        5. Preparation for next learning session`
        break

      case 'adaptive-help':
        prompt = `The student is struggling with "${topic}". 
        Learning style: ${learningStyle}
        
        Provide adaptive help:
        1. Identify potential knowledge gaps
        2. Offer alternative explanations
        3. Suggest different learning approaches
        4. Provide encouragement and motivation
        5. Break down into smaller, manageable parts`
        break

      default:
        prompt = messages[messages.length - 1]?.content || 'Continue the study session'
    }

    const aiResponse = await callAI(
      messages || [{ role: 'user', content: prompt }],
      aiType,
      'en',
      3,
      studyContext
    )

    // Analyze response for learning analytics
    const analytics = analyzeStudyResponse(aiResponse, studyContext)

    return NextResponse.json({
      response: aiResponse,
      analytics,
      suggestions: generateStudySuggestions(topic, subject, difficulty),
      nextSteps: getNextLearningSteps(studyContext)
    })

  } catch (error) {
    console.error('Study mode API error:', error)
    return NextResponse.json(
      { error: 'Failed to process study session' },
      { status: 500 }
    )
  }
}

function analyzeStudyResponse(response: string, context: any) {
  // Simple analytics based on response content
  const hasQuestions = /\?/.test(response)
  const hasExamples = /example|for instance|such as/i.test(response)
  const hasExercises = /exercise|practice|try|solve/i.test(response)
  const hasEncouragement = /great|excellent|good job|well done/i.test(response)

  return {
    interactivity: hasQuestions ? 'high' : 'medium',
    hasExamples,
    hasExercises,
    hasEncouragement,
    estimatedReadTime: Math.ceil(response.length / 200), // words per minute
    complexity: response.length > 1000 ? 'high' : response.length > 500 ? 'medium' : 'low'
  }
}

function generateStudySuggestions(topic: string, subject: string, difficulty: string) {
  const suggestions = [
    `Create flashcards for key ${topic} concepts`,
    `Practice ${topic} problems daily for 15 minutes`,
    `Review ${topic} before moving to advanced concepts`,
    `Connect ${topic} to real-world ${subject} applications`,
    `Teach ${topic} to someone else to reinforce learning`
  ]

  return suggestions.slice(0, 3) // Return top 3 suggestions
}

function getNextLearningSteps(context: any) {
  return [
    {
      action: 'practice',
      title: 'Practice Exercises',
      description: 'Reinforce learning with targeted practice problems',
      estimatedTime: '15-20 minutes'
    },
    {
      action: 'review',
      title: 'Quick Review',
      description: 'Summarize key concepts and check understanding',
      estimatedTime: '5-10 minutes'
    },
    {
      action: 'advance',
      title: 'Next Topic',
      description: 'Move to the next related concept',
      estimatedTime: '20-30 minutes'
    }
  ]
}