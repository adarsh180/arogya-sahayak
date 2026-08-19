const emergencyPatterns = [
  /chest pain/i,
  /difficulty breathing|cannot breathe|can't breathe|breathless/i,
  /unconscious|not responding|fainted/i,
  /severe bleeding|won't stop bleeding/i,
  /stroke|face droop|slurred speech|one.?sided weakness/i,
  /suicide|kill myself|self harm/i,
  /seizure|convulsion/i,
  /poison|overdose/i,
  /सीने में दर्द|सांस नहीं|बेहोश|खून नहीं रुक|आत्महत्या/i
]

export const MEDICAL_DISCLAIMER =
  'Educational guidance only — not a diagnosis or a substitute for a qualified clinician.'

export function detectEmergency(text: string) {
  return emergencyPatterns.some(pattern => pattern.test(text))
}

export function emergencyResponse() {
  return {
    urgent: true,
    title: 'This may need immediate help',
    message:
      'Call India emergency number 112 now or go to the nearest emergency department. If it is safe, stay with the person and follow the dispatcher’s instructions. Do not wait for an AI response.',
    emergencyNumber: '112'
  }
}
