export interface AIMessage {
  role: 'user' | 'assistant'
  content: string
}

export type AIUseCase =
  | 'medical'
  | 'student'
  | 'symptom'
  | 'study-mode'
  | 'guided-learning'
  | 'health-analysis'

export interface AIOptions {
  evidence?: string
  temperature?: number
  maxTokens?: number
  reasoningEffort?: 'minimal' | 'low' | 'medium' | 'high'
}

type Provider = 'local' | 'groq' | 'openrouter' | 'google'
const PROVIDER_TIMEOUT_MS = 28_000
const PROVIDERS = new Set<Provider>(['local', 'groq', 'openrouter', 'google'])

export const INDIAN_LANGUAGES = {
  en: 'English', hi: 'हिंदी', bn: 'বাংলা', te: 'తెలుగు', mr: 'मराठी', ta: 'தமிழ்',
  gu: 'ગુજરાતી', kn: 'ಕನ್ನಡ', ml: 'മലയാളം', pa: 'ਪੰਜਾਬੀ', or: 'ଓଡ଼ିଆ', as: 'অসমীয়া',
  ur: 'اردو', sa: 'संस्कृतम्', ne: 'नेपाली', kok: 'कोंकणी', mni: 'মৈতৈলোন্',
  sd: 'سنڌي', ks: 'कॉशुर', doi: 'डोगरी', mai: 'मैथिली', sat: 'ᱥᱟᱱᱛᱟᱲᱤ', brx: 'बड़ो'
} as const

export const MEDICAL_EXAMS = {
  'neet-ug': 'NEET UG', 'neet-pg': 'NEET PG', inicet: 'INI-CET', fmge: 'FMGE',
  'neet-ss': 'NEET SS', 'neet-mds': 'NEET MDS', 'aiims-nursing': 'AIIMS Nursing'
}

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

export const MEDICAL_YEARS = {
  'pre-medical': 'Pre-medical', '1st-year': '1st Year MBBS', '2nd-year': '2nd Year MBBS',
  '3rd-year': '3rd Year MBBS', '4th-year': 'Final Year MBBS', intern: 'Internship',
  'pg-1': 'PG 1st Year', 'pg-2': 'PG 2nd Year', 'pg-3': 'PG 3rd Year', resident: 'Resident'
}

export function buildSystemPrompt(type: AIUseCase, language: string, studyContext: unknown, evidence?: string) {
  const languageName = INDIAN_LANGUAGES[language as keyof typeof INDIAN_LANGUAGES] || 'English'
  const workspaceContext = JSON.stringify(studyContext || {})
  const common = `You are Arogya Sahayak, a calm Indian health and medical-learning assistant created by Adarsh. If asked who created or built you, answer "Arogya Sahayak was created by Adarsh." Do not invent a surname, credential, institution, endorsement or government affiliation for Adarsh. Respond in ${languageName}. Use plain, respectful language and adapt depth to the user's apparent expertise. Never claim to be a doctor, diagnose with certainty, invent a clinician or facility, or imply that the product is government-approved. Clearly separate established facts, reasonable possibilities and unknowns. Before answering, silently check whether the request is ambiguous, whether newer evidence may be required, and whether the proposed answer could cause harm. Workspace context may be incomplete or stale; use it only to personalize and ask the user to confirm safety-critical details: ${workspaceContext}`

  if (type === 'student' || type === 'study-mode' || type === 'guided-learning') {
    return `${common}\nYou are in medical education mode. Align depth to the learner context and teach with: learning objective; foundational mechanism; clinically relevant connection; one worked example; retrieval question; and next step. Prefer active recall, causal reasoning, differential comparison and explicit uncertainty. Give the direct answer first, then explain. Distinguish established teaching from evolving guidance. Never present generated questions as official exam questions, and never turn a learning case into advice for a real patient.`
  }

  return `${common}
You are in health-information mode. Follow this safety protocol:
1. First determine whether the user is asking for general education, interpretation of their own data, or action for current symptoms.
2. For current symptoms, ask only the missing high-value context: age group, duration, severity, relevant conditions/medicines, pregnancy where relevant, and red flags. Do not produce a long differential from weak context.
3. Never prescribe, select a drug, calculate an individual dose, change an existing dose, or tell someone to delay care. Extra caution is required for children, pregnancy, older adults, kidney/liver disease, drug interactions and abnormal test results.
4. If symptoms could be urgent, say what makes them concerning and direct the user to 112 or immediate in-person emergency care.
5. Use only supplied curated evidence for factual patient-facing claims. A source labelled clinical-guideline-index is a discovery route, not support for a specific treatment recommendation. If condition-level evidence is absent, say so and limit the answer to safe general orientation and the next appropriate professional.
6. Structure a non-urgent response as: what the information may mean; what cannot be concluded; safe next steps; when to seek urgent care. End with the reminder that this is educational guidance, not a diagnosis.

Curated evidence:
${evidence || 'No curated evidence was supplied. State uncertainty and do not create citations.'}`
}

function providerConfig(provider: Provider) {
  if (provider === 'local') {
    const baseUrl = process.env.LOCAL_LLM_BASE_URL?.replace(/\/$/, '')
    return {
      endpoint: `${baseUrl || 'http://127.0.0.1:1234/v1'}/chat/completions`,
      apiKey: baseUrl ? process.env.LOCAL_LLM_API_KEY || 'local' : undefined,
      model: process.env.LOCAL_LLM_MODEL || 'local-model'
    }
  }
  if (provider === 'groq') {
    return { endpoint: 'https://api.groq.com/openai/v1/chat/completions', apiKey: process.env.GROQ_API_KEY, model: process.env.GROQ_MODEL || 'llama-3.1-8b-instant' }
  }
  if (provider === 'google') {
    return { endpoint: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', apiKey: process.env.GOOGLE_AI_API_KEY, model: process.env.GOOGLE_AI_MODEL || 'gemini-2.5-flash-lite' }
  }
  return {
    endpoint: 'https://openrouter.ai/api/v1/chat/completions',
    apiKey: process.env.OPENROUTER_API_KEY || process.env.OPEN_ROUTER,
    model: process.env.OPENROUTER_MODEL || 'google/gemini-3-flash-preview'
  }
}

function configuredProviders(): Provider[] {
  const selected = process.env.AI_PROVIDER?.trim().toLowerCase() as Provider | undefined
  if (selected) return PROVIDERS.has(selected) ? [selected] : []
  const hasLegacyOpenRouterKey = Boolean(process.env.OPEN_ROUTER && !process.env.OPENROUTER_API_KEY)
  return [
    ...(hasLegacyOpenRouterKey ? ['openrouter' as const] : []),
    ...(process.env.GROQ_API_KEY ? ['groq' as const] : []),
    ...(process.env.GOOGLE_AI_API_KEY ? ['google' as const] : []),
    ...(!hasLegacyOpenRouterKey && process.env.OPENROUTER_API_KEY ? ['openrouter' as const] : []),
    ...(process.env.LOCAL_LLM_BASE_URL ? ['local' as const] : [])
  ]
}

export function getAIConfiguration() {
  const provider = configuredProviders()[0]
  if (!provider) return { provider: null, model: null, configured: false }
  const config = providerConfig(provider)
  return { provider, model: config.model, configured: Boolean(config.apiKey) }
}

function providerErrorMessage(provider: Provider, status: number, payload: unknown) {
  const message = typeof payload === 'object' && payload && 'error' in payload
    ? typeof (payload as { error?: { message?: unknown } }).error?.message === 'string'
      ? (payload as { error: { message: string } }).error.message
      : ''
    : ''
  const safe = message.replace(/sk-[A-Za-z0-9_-]+/g, '[redacted]').slice(0, 180)
  return `${provider} returned ${status}${safe ? `: ${safe}` : ''}`
}

async function callProvider(provider: Provider, messages: AIMessage[], prompt: string, options: AIOptions) {
  const config = providerConfig(provider)
  if (!config.apiKey) return null
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), PROVIDER_TIMEOUT_MS)

  try {
    const response = await fetch(config.endpoint, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
        ...(provider === 'openrouter'
          ? { 'HTTP-Referer': process.env.NEXTAUTH_URL || process.env.URL || 'http://localhost:3000', 'X-Title': 'Arogya Sahayak' }
          : {})
      },
      body: JSON.stringify({
        model: config.model,
        messages: [{ role: 'system', content: prompt }, ...messages],
        temperature: options.temperature ?? 0.25,
        max_tokens: options.maxTokens ?? 900,
        ...(provider === 'openrouter' && config.model.includes('gemini-3')
          ? { reasoning: { effort: options.reasoningEffort || 'low', exclude: true } }
          : {})
      })
    })

    const data = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(providerErrorMessage(provider, response.status, data))
    return data.choices?.[0]?.message?.content?.trim() || null
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown provider error'
    console.error(`AI provider ${provider} failed`, message)
    throw error instanceof Error ? error : new Error(`${provider} request failed`)
  } finally {
    clearTimeout(timeout)
  }
}

export async function callAI(
  messages: AIMessage[],
  type: AIUseCase = 'medical',
  language = 'en',
  retries = 1,
  studyContext?: unknown,
  options: AIOptions = {}
) {
  if (!Array.isArray(messages) || messages.length === 0) throw new Error('At least one message is required')
  const prompt = buildSystemPrompt(type, language, studyContext, options.evidence)
  const failures: string[] = []

  for (const provider of configuredProviders()) {
    for (let attempt = 0; attempt < Math.max(1, Math.min(retries, 2)); attempt += 1) {
      try {
        const answer = await callProvider(provider, messages, prompt, options)
        if (answer) return answer
      } catch (error) {
        failures.push(error instanceof Error ? error.message : `${provider} request failed`)
      }
    }
  }
  if (failures.length) throw new Error(`AI provider unavailable. ${failures[0]}`)
  throw new Error('No AI provider is configured. Add a supported server-side key and provider model.')
}

export async function translateText(text: string, targetLanguage: string) {
  if (targetLanguage === 'en') return text
  const language = INDIAN_LANGUAGES[targetLanguage as keyof typeof INDIAN_LANGUAGES]
  if (!language) return text
  return callAI(
    [{ role: 'user', content: `Translate this text accurately into ${language}. Preserve clinical caution and do not add facts:\n\n${text}` }],
    'student', targetLanguage, 1, undefined, { temperature: 0.1, maxTokens: 1000 }
  )
}
