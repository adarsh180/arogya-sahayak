const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY

if (!OPENROUTER_API_KEY) {
  console.error('OPENROUTER_API_KEY is not configured')
}

export interface AIMessage {
  role: 'user' | 'assistant'
  content: string
}

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function formatResponse(text: string): string {
  // Check if text contains tables (lines with multiple | characters)
  const hasTable = text.split('\n').some(line => 
    (line.match(/\|/g) || []).length >= 2
  )
  
  if (hasTable) {
    // Preserve table formatting but clean other markdown
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
      .replace(/\*(.*?)\*/g, '$1') // Remove italic markdown
      .replace(/#{1,6}\s/g, '') // Remove headers
      .replace(/```[\s\S]*?```/g, '') // Remove code blocks
      .replace(/`([^`]+)`/g, '$1') // Remove inline code
      .replace(/\n\s*[-*+]\s/g, '\n• ') // Convert lists to bullet points
      .trim()
  } else {
    // Original formatting for non-table content
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
      .replace(/\*(.*?)\*/g, '$1') // Remove italic markdown
      .replace(/#{1,6}\s/g, '') // Remove headers
      .replace(/\|/g, '') // Remove table separators
      .replace(/```[\s\S]*?```/g, '') // Remove code blocks
      .replace(/`([^`]+)`/g, '$1') // Remove inline code
      .replace(/\n\s*[-*+]\s/g, '\n• ') // Convert lists to bullet points
      .replace(/\n\s*\d+\.\s/g, '\n') // Remove numbered lists
      .trim()
  }
}

export async function callAI(messages: AIMessage[], type: 'medical' | 'student' = 'medical', language = 'en', retries = 3) {
  const systemPrompts = {
    medical: `You are Arogya Sahayak, an AI medical assistant created by Adarsh Tiwari. Provide clear, helpful medical information with structured formatting. Use tables when presenting comparative data or structured information.

Guidelines:
- Provide clear explanations with proper structure
- Use tables for comparisons, symptoms, medications (format: | Column | Data |)
- Use bullet points for lists
- Always recommend consulting healthcare professionals
- Keep responses focused and informative

Example table:
| Symptom | Mild | Severe |
|---------|------|--------|
| Fever | 99-100°F | 103°F+ |

If asked about your creator: "I am Arogya Sahayak, created by Adarsh Tiwari to make medical information accessible across India in 29+ languages."

${language !== 'en' ? `Always respond in ${INDIAN_LANGUAGES[language as keyof typeof INDIAN_LANGUAGES]} language only.` : ''}`,
    student: `You are an AI medical tutor created by Adarsh Tiwari. Help students with medical concepts and exam preparation using structured formatting and tables.

Guidelines:
- Explain concepts clearly with proper structure
- Use tables for classifications, comparisons (format: | Column | Data |)
- Include exam-focused content when relevant
- Use bullet points and numbered lists

Example table:
| System | Function | Disease |
|--------|----------|--------|
| Heart | Circulation | CAD |

If asked about creator: "I was developed by Adarsh Tiwari to help medical students prepare for NEET, AIIMS, and other medical exams."

${language !== 'en' ? `Always respond in ${INDIAN_LANGUAGES[language as keyof typeof INDIAN_LANGUAGES]} language only.` : ''}`
  }

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      if (attempt > 0) {
        await delay(Math.pow(2, attempt) * 1000) // Exponential backoff
      }

      if (!OPENROUTER_API_KEY) {
        return "AI service is not properly configured. Please check the API key configuration."
      }

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": "https://arogya-sahayakl.netlify.app",
          "X-Title": "Arogya Sahayak",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "microsoft/wizardlm-2-8x22b",
          "messages": [
            {
              "role": "system",
              "content": systemPrompts[type]
            },
            ...messages
          ],
          "temperature": 0.7,
          "max_tokens": 1000
        })
      })

      if (response.status === 401) {
        return "AI service authentication failed. Please check API configuration and try again."
      }

      if (response.status === 402) {
        return "AI service is temporarily unavailable due to billing limits. Please try again later or contact support."
      }

      if (response.status === 429) {
        if (attempt === retries - 1) {
          return "I'm currently experiencing high demand. Please try again in a few moments."
        }
        continue // Retry
      }

      if (response.status === 502 || response.status === 503) {
        if (attempt === retries - 1) {
          return "The AI service is temporarily unavailable. Please try again in a few moments."
        }
        continue // Retry
      }

      if (!response.ok) {
        throw new Error(`AI API error: ${response.status}`)
      }

      const data = await response.json()
      const content = data.choices[0]?.message?.content || "I apologize, but I couldn't process your request. Please try again."
      return formatResponse(content)
    } catch (error) {
      console.error(`AI API Error (attempt ${attempt + 1}):`, error)
      if (attempt === retries - 1) {
        return "I'm experiencing technical difficulties. Please try again later."
      }
    }
  }
}

export const INDIAN_LANGUAGES = {
  'en': 'English',
  'hi': 'हिंदी (Hindi)',
  'bn': 'বাংলা (Bengali)',
  'te': 'తెలుగు (Telugu)',
  'mr': 'मराठी (Marathi)',
  'ta': 'தமிழ் (Tamil)',
  'gu': 'ગુજરાતી (Gujarati)',
  'kn': 'ಕನ್ನಡ (Kannada)',
  'ml': 'മലയാളം (Malayalam)',
  'pa': 'ਪੰਜਾਬੀ (Punjabi)',
  'or': 'ଓଡ଼ିଆ (Odia)',
  'as': 'অসমীয়া (Assamese)',
  'ur': 'اردو (Urdu)',
  'sa': 'संस्कृत (Sanskrit)',
  'ne': 'नेपाली (Nepali)',
  'si': 'සිංහල (Sinhala)',
  'my': 'မြန်မာ (Myanmar)',
  'dz': 'རྫོང་ཁ (Dzongkha)',
  'kok': 'कोंकणी (Konkani)',
  'mni': 'মৈতৈলোন্ (Manipuri)',
  'sd': 'سنڌي (Sindhi)',
  'ks': 'कॉशुर (Kashmiri)',
  'doi': 'डोगरी (Dogri)',
  'mai': 'मैथिली (Maithili)',
  'sat': 'ᱥᱟᱱᱛᱟᱲᱤ (Santali)',
  'bo': 'བོད་སྐད (Tibetan)',
  'brx': 'बड़ो (Bodo)',
  'lus': 'Mizo ṭawng (Mizo)',
  'raj': 'राजस्थानी (Rajasthani)',
  'bh': 'भोजपुरी (Bhojpuri)'
}

export const MEDICAL_EXAMS = {
  'neet-ug': 'NEET UG (Undergraduate)',
  'neet-pg': 'NEET PG (Postgraduate)',
  'aiims-ug': 'AIIMS UG',
  'aiims-pg': 'AIIMS PG',
  'jipmer-ug': 'JIPMER UG',
  'jipmer-pg': 'JIPMER PG',
  'fmge': 'FMGE (Foreign Medical Graduate Examination)',
  'inicet': 'INI CET (Institute of National Importance Combined Entrance Test)',
  'neet-ss': 'NEET SS (Super Specialty)',
  'dnb-cet': 'DNB CET (Diplomate of National Board)',
  'fet': 'FET (Fellowship Entrance Test)',
  'pgimer': 'PGIMER Entrance',
  'bhu-pmt': 'BHU PMT',
  'comedk': 'COMEDK UGET',
  'keam': 'KEAM (Kerala Engineering Architecture Medical)',
  'neet-mds': 'NEET MDS (Master of Dental Surgery)',
  'aiims-nursing': 'AIIMS Nursing',
  'jipmer-nursing': 'JIPMER Nursing',
  'esic': 'ESIC Medical College Entrance',
  'afmc': 'AFMC (Armed Forces Medical College)',
  'state-pmt': 'State PMT/CET'
}

export const BLOOD_GROUPS = [
  'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
]

export const MEDICAL_YEARS = {
  'pre-medical': 'Pre-Medical (12th/Preparation)',
  '1st-year': '1st Year MBBS',
  '2nd-year': '2nd Year MBBS',
  '3rd-year': '3rd Year MBBS',
  '4th-year': '4th Year MBBS',
  'intern': 'Internship',
  'pg-1': 'PG 1st Year',
  'pg-2': 'PG 2nd Year',
  'pg-3': 'PG 3rd Year',
  'resident': 'Resident Doctor',
  'fellow': 'Fellowship',
  'consultant': 'Consultant'
}

export async function translateText(text: string, targetLanguage: string) {
  if (!targetLanguage || targetLanguage === 'en') return text

  const languageName = INDIAN_LANGUAGES[targetLanguage as keyof typeof INDIAN_LANGUAGES]
  if (!languageName) return text

  const translatePrompt = `Translate the following medical text to ${languageName} language. Maintain medical accuracy and terminology:\n\n${text}`

  try {
    const response = await callAI([{ role: 'user', content: translatePrompt }], 'medical', targetLanguage)
    return response
  } catch (error) {
    console.error('Translation error:', error)
    return text
  }
}