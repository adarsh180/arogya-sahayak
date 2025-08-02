import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { callAI } from '@/lib/ai'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'general'
    const language = searchParams.get('language') || 'en'

    // Get current date to ensure daily uniqueness
    const today = new Date().toDateString()
    const cacheKey = `health-tip-${type}-${today}`

    // Check if we have a cached tip for today
    const cachedTip = global.healthTipsCache?.[cacheKey]
    if (cachedTip) {
      return NextResponse.json(cachedTip)
    }

    const prompts = {
      general: `Generate a daily health tip for today (${today}) focused on general wellness habits. Topics: hydration, sleep, posture, breathing, or basic nutrition. Include:
      1. A simple daily habit anyone can follow
      2. Brief explanation of benefits
      3. Health-focused quote
      4. 3 easy implementation steps

      Format as JSON:
      {
        "tip": "Daily wellness habit",
        "explanation": "Why this helps your health",
        "quote": "Health wisdom quote",
        "steps": ["Step 1", "Step 2", "Step 3"],
        "category": "daily-wellness"
      }`,
      
      personal: `Generate a DIFFERENT personalized health insight for today (${today}) focused on lifestyle optimization. Topics: exercise, mental health, productivity, or preventive care. Include:
      1. A specific lifestyle improvement tip
      2. Scientific reasoning
      3. Motivational quote about personal growth
      4. 3 actionable steps

      Format as JSON:
      {
        "tip": "Lifestyle optimization tip",
        "explanation": "Scientific benefits",
        "quote": "Personal growth quote",
        "steps": ["Action 1", "Action 2", "Action 3"],
        "category": "lifestyle",
        "personalNote": "Encouraging message"
      }`
    }

    const prompt = prompts[type as keyof typeof prompts] || prompts.general

    const aiResponse = await callAI([{ role: 'user', content: prompt }], 'medical', language)
    
    if (!aiResponse || aiResponse.includes('technical difficulties')) {
      // Fallback tips
      const fallbackTips = {
        general: {
          tip: "Practice the 20-20-20 rule for eye health",
          explanation: "Every 20 minutes, look at something 20 feet away for 20 seconds to reduce eye strain and prevent digital fatigue.",
          quote: "The eyes are the window to the soul, take care of them. - Anonymous",
          steps: [
            "Set a timer for every 20 minutes",
            "Look at something 20 feet away",
            "Hold your gaze for 20 seconds"
          ],
          category: "eye-health"
        },
        personal: {
          tip: "Create a 5-minute morning mindfulness routine",
          explanation: "Morning mindfulness reduces cortisol levels, improves focus, and sets a positive tone for your entire day.",
          quote: "Peace comes from within. Do not seek it without. - Buddha",
          steps: [
            "Wake up 5 minutes earlier",
            "Sit quietly and focus on breathing",
            "Set daily intentions"
          ],
          category: "mindfulness",
          personalNote: "Your mental health is just as important as your physical health!"
        }
      }

      const tip = fallbackTips[type as keyof typeof fallbackTips] || fallbackTips.general
      
      // Cache the fallback tip
      if (!global.healthTipsCache) global.healthTipsCache = {}
      global.healthTipsCache[cacheKey] = tip

      return NextResponse.json(tip)
    }

    try {
      // Extract JSON from AI response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response')
      }

      const healthTip = JSON.parse(jsonMatch[0])
      
      // Cache the tip for today
      if (!global.healthTipsCache) global.healthTipsCache = {}
      global.healthTipsCache[cacheKey] = healthTip

      return NextResponse.json(healthTip)
    } catch (parseError) {
      console.error('Failed to parse AI health tip:', parseError)
      
      // Return a structured fallback
      const fallbackTip = type === 'personal' ? {
        tip: "Take micro-breaks every hour",
        explanation: "Short breaks improve productivity, reduce muscle tension, and prevent mental fatigue throughout your day.",
        quote: "Rest when you're weary. Refresh and renew yourself. - Ralph Marston",
        steps: [
          "Set hourly reminders",
          "Stand and stretch for 2 minutes",
          "Take 3 deep breaths"
        ],
        category: "productivity",
        personalNote: "Small breaks create big improvements!"
      } : {
        tip: "Eat a rainbow of fruits and vegetables",
        explanation: "Different colored produce provides various vitamins, minerals, and antioxidants essential for optimal health.",
        quote: "Let food be thy medicine and medicine be thy food. - Hippocrates",
        steps: [
          "Add one new colored fruit/vegetable daily",
          "Aim for 5 different colors per day",
          "Try seasonal produce for variety"
        ],
        category: "nutrition"
      }

      // Cache the fallback
      if (!global.healthTipsCache) global.healthTipsCache = {}
      global.healthTipsCache[cacheKey] = fallbackTip

      return NextResponse.json(fallbackTip)
    }
  } catch (error) {
    console.error('Health tips error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Declare global cache type
declare global {
  var healthTipsCache: { [key: string]: any } | undefined
}