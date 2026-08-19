import assert from 'node:assert/strict'
import test from 'node:test'
import { buildSystemPrompt, getAIConfiguration } from '../lib/ai'

test('assistant identity credits Adarsh without inventing authority', () => {
  const prompt = buildSystemPrompt('medical', 'en', {}, 'No condition-level evidence.')
  assert.match(prompt, /created by Adarsh/i)
  assert.match(prompt, /Do not invent a surname, credential, institution, endorsement or government affiliation/i)
})

test('legacy OPEN_ROUTER configuration selects the verified Gemini 3 Flash slug', () => {
  const previousLegacy = process.env.OPEN_ROUTER
  const previousCanonical = process.env.OPENROUTER_API_KEY
  const previousProvider = process.env.AI_PROVIDER
  const previousModel = process.env.OPENROUTER_MODEL

  process.env.OPEN_ROUTER = 'test-key'
  delete process.env.OPENROUTER_API_KEY
  delete process.env.AI_PROVIDER
  delete process.env.OPENROUTER_MODEL

  assert.deepEqual(getAIConfiguration(), {
    provider: 'openrouter', model: 'google/gemini-3-flash-preview', configured: true
  })

  if (previousLegacy === undefined) delete process.env.OPEN_ROUTER
  else process.env.OPEN_ROUTER = previousLegacy
  if (previousCanonical === undefined) delete process.env.OPENROUTER_API_KEY
  else process.env.OPENROUTER_API_KEY = previousCanonical
  if (previousProvider === undefined) delete process.env.AI_PROVIDER
  else process.env.AI_PROVIDER = previousProvider
  if (previousModel === undefined) delete process.env.OPENROUTER_MODEL
  else process.env.OPENROUTER_MODEL = previousModel
})

test('an invalid explicit provider fails closed instead of silently using OpenRouter', () => {
  const previousProvider = process.env.AI_PROVIDER
  process.env.AI_PROVIDER = 'unsupported-provider'

  assert.deepEqual(getAIConfiguration(), {
    provider: null, model: null, configured: false
  })

  if (previousProvider === undefined) delete process.env.AI_PROVIDER
  else process.env.AI_PROVIDER = previousProvider
})

test('local provider is not reported ready without an explicit reachable base URL', () => {
  const previousProvider = process.env.AI_PROVIDER
  const previousBaseUrl = process.env.LOCAL_LLM_BASE_URL
  process.env.AI_PROVIDER = 'local'
  delete process.env.LOCAL_LLM_BASE_URL

  assert.deepEqual(getAIConfiguration(), {
    provider: 'local', model: 'local-model', configured: false
  })

  if (previousProvider === undefined) delete process.env.AI_PROVIDER
  else process.env.AI_PROVIDER = previousProvider
  if (previousBaseUrl === undefined) delete process.env.LOCAL_LLM_BASE_URL
  else process.env.LOCAL_LLM_BASE_URL = previousBaseUrl
})
