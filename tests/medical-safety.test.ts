import test from 'node:test'
import assert from 'node:assert/strict'
import { detectEmergency, emergencyResponse } from '../lib/medical-safety'

test('detects high-risk emergency language in English and Hindi', () => {
  assert.equal(detectEmergency('I have sudden chest pain and feel faint'), true)
  assert.equal(detectEmergency('वह बेहोश है और सांस नहीं ले रहा'), true)
})

test('does not flag ordinary educational questions as an emergency', () => {
  assert.equal(detectEmergency('Explain how blood pressure is measured'), false)
  assert.equal(detectEmergency('Help me revise the cardiac cycle'), false)
})

test('emergency response routes to the national emergency number', () => {
  const response = emergencyResponse()
  assert.equal(response.urgent, true)
  assert.equal(response.emergencyNumber, '112')
  assert.match(response.message, /Do not wait/i)
})
