'use client'

import DocPage from '@/components/DocPage'

export default function PrivacyPage() {
  return (
    <DocPage
      kicker="Privacy notice · updated 13 October 2026"
      title="Plain language before fine print."
      description="How information moves through Arogya Sahayak. The operator of a deployed instance must identify subprocessors and obtain legal review for that deployment."
      sections={[
        { id: 'collected', title: 'What is collected', body: <p>Account details, profile preferences and the information you choose to enter into health, medicine, learning and conversation features. Each feature collects only what it needs; health background fields in your profile are optional.</p> },
        { id: 'ai', title: 'AI providers', body: <p>When you ask an AI-backed question, bounded conversation text and retrieved source context are sent to the server-side provider configured by the operator (local, Groq, Google or OpenRouter). Provider terms, retention and data location depend on that configuration. API keys are never exposed to your browser.</p> },
        { id: 'voice', title: 'Voice and uploads', body: <p>Browser speech recognition and read-aloud need no app speech key, but browser or operating-system vendors may process speech remotely. Microphone access begins only when you tap the microphone. Text extracted from an uploaded PDF or text file may be sent to the AI provider when you include it in a question — remove unnecessary identifiers first.</p> },
        { id: 'device', title: 'Stored on your device', body: <p>Your colour theme, dictionary search history and medicine check-offs are kept in your browser’s local storage only. Clearing site data removes them.</p> },
        { id: 'control', title: 'Your control', body: <ul><li>Delete individual readings, medicines, emergency contacts, study sessions and conversations from the interface.</li><li>Edit or clear any optional profile field at any time.</li><li>For access, export or full account deletion, contact the operator through the <a className="ui-link" href="/contact">contact page</a>.</li></ul> },
        { id: 'limits', title: 'Current limits', body: <p>This product does not claim HIPAA, ABDM or DPDP certification, end-to-end encryption, institutional approval or a completed security audit. Those require deployment-specific controls, contracts and governance beyond application code.</p> },
      ]}
    />
  )
}
