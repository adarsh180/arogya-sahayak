'use client'

import DocPage from '@/components/DocPage'

export default function TermsPage() {
  return (
    <DocPage
      kicker="Terms of use · updated 13 October 2026"
      title="Use Arogya as support, not authority."
      description="These product-level terms are a transparent starting point, not a substitute for deployment-specific legal terms."
      sections={[
        { id: 'scope', title: 'Scope', body: <p>Arogya Sahayak provides health information, personal organisation and medical-learning tools. Features and providers may change as the product is evaluated and improved.</p> },
        { id: 'medical', title: 'Medical boundary', body: <p>Do not use this product to diagnose, prescribe, change treatment or delay professional care. For an emergency in India call 112. Always involve a qualified clinician in decisions about symptoms, medicines, pregnancy, children, serious conditions or urgent changes.</p> },
        { id: 'learning', title: 'Learning content', body: <p>Questions and explanations may be AI-generated and are not official past papers. Verify disputed facts against current primary sources, textbooks, clinical guidelines and the relevant official syllabus.</p> },
        { id: 'use', title: 'Acceptable use', body: <p>Do not attempt to access another person’s records, submit content you have no right to process, misuse emergency information, or present generated material as professional medical advice.</p> },
        { id: 'availability', title: 'Availability and errors', body: <p>AI providers, browser speech and connected services can be unavailable or wrong. The interface reports these limits rather than substituting fabricated answers, contacts, questions or locations.</p> },
      ]}
    />
  )
}
