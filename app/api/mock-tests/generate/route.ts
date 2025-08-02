import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { callAI } from '@/lib/ai'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { exam, subject, questionCount, difficulty } = await request.json()

    const prompt = `Generate ${questionCount} multiple choice questions for ${exam.toUpperCase()} exam in ${subject} subject.

Requirements:
- Difficulty level: ${difficulty}
- Each question should have 4 options (A, B, C, D)
- Include the correct answer index (0-3)
- Provide brief explanation for correct answer
- Questions should be exam-pattern specific
- Cover different topics within the subject
- Ensure questions are factually accurate

Format the response as a JSON array with this structure:
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Brief explanation of why this is correct",
    "difficulty": "medium"
  }
]

Generate exactly ${questionCount} questions now:`

    const aiResponse = await callAI([{ role: 'user', content: prompt }], 'student')
    
    if (!aiResponse || aiResponse.includes('technical difficulties')) {
      return NextResponse.json({ error: 'Failed to generate questions' }, { status: 500 })
    }

    try {
      const jsonMatch = aiResponse.match(/\[[\s\S]*\]/)
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response')
      }

      const questions = JSON.parse(jsonMatch[0])
      
      const questionsWithIds = questions.map((q: any, index: number) => ({
        ...q,
        id: `${Date.now()}_${index}`,
        difficulty: difficulty === 'mixed' ? ['easy', 'medium', 'hard'][index % 3] : difficulty
      }))

      return NextResponse.json({ questions: questionsWithIds })
    } catch (parseError) {
      const fallbackQuestions = Array.from({ length: questionCount }, (_, i) => ({
        id: `fallback_${Date.now()}_${i}`,
        question: `Sample ${subject} question ${i + 1} for ${exam.toUpperCase()} exam?`,
        options: [
          `Option A for question ${i + 1}`,
          `Option B for question ${i + 1}`,
          `Option C for question ${i + 1}`,
          `Option D for question ${i + 1}`
        ],
        correctAnswer: i % 4,
        explanation: `This is the correct answer for question ${i + 1}`,
        difficulty: difficulty === 'mixed' ? ['easy', 'medium', 'hard'][i % 3] : difficulty
      }))

      return NextResponse.json({ questions: fallbackQuestions })
    }
  } catch (error) {
    console.error('Question generation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}