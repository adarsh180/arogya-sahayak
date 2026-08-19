import test from 'node:test'
import assert from 'node:assert/strict'
import { evidenceContext, retrieveMedicalEvidence } from '../lib/rag'

test('retrieves a relevant blood-pressure source before unrelated sources', () => {
  const results = retrieveMedicalEvidence('What does a high blood pressure reading mean?')
  assert.ok(results.length > 0)
  assert.equal(results[0].id, 'who-hypertension')
})

test('returns no invented evidence for an unrelated query', () => {
  const results = retrieveMedicalEvidence('quantum compiler architecture')
  assert.deepEqual(results, [])
  assert.match(evidenceContext(results), /No relevant curated source/)
})

test('evidence context preserves publisher and direct source URL', () => {
  const context = evidenceContext(retrieveMedicalEvidence('medicine dose interaction', 1))
  assert.match(context, /World Health Organization/)
  assert.match(context, /https:\/\//)
})

test('routes specialty queries to an authoritative Indian guideline index', () => {
  const evidence = retrieveMedicalEvidence('paediatric dengue fever guidance')
  assert.equal(evidence.some(source => source.id === 'icmr-standard-treatment-workflows'), true)
  assert.equal(evidence.some(source => source.publisher.includes('Government of India')), true)
})
