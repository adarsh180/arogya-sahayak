export interface MedicalSource {
  id: string
  title: string
  publisher: string
  url: string
  reviewedAt: string
  excerpt: string
  tags: string[]
  evidenceLevel?: 'patient-fact-sheet' | 'clinical-guideline-index' | 'education-framework' | 'service-directory'
}

export interface RetrievedEvidence extends MedicalSource {
  score: number
}

const sources: MedicalSource[] = [
  {
    id: 'who-hypertension',
    title: 'Hypertension fact sheet',
    publisher: 'World Health Organization',
    url: 'https://www.who.int/news-room/fact-sheets/detail/hypertension',
    reviewedAt: '2026-08-19',
    excerpt: 'Blood pressure should be measured correctly and repeated; persistent elevation needs assessment by a health professional. Lifestyle measures and prescribed treatment can reduce risk.',
    tags: ['blood pressure', 'hypertension', 'bp', 'heart', 'salt'],
    evidenceLevel: 'patient-fact-sheet'
  },
  {
    id: 'who-diabetes',
    title: 'Diabetes fact sheet',
    publisher: 'World Health Organization',
    url: 'https://www.who.int/news-room/fact-sheets/detail/diabetes',
    reviewedAt: '2026-08-19',
    excerpt: 'Diabetes is diagnosed by a health professional using blood glucose testing. Healthy diet, physical activity and prescribed medicines are central to prevention and management.',
    tags: ['diabetes', 'glucose', 'blood sugar', 'insulin'],
    evidenceLevel: 'patient-fact-sheet'
  },
  {
    id: 'who-medication-safety',
    title: 'Medication Without Harm',
    publisher: 'World Health Organization',
    url: 'https://www.who.int/initiatives/medication-without-harm',
    reviewedAt: '2026-08-19',
    excerpt: 'Medication safety depends on accurate medicine information, communication and checking for potential harm. Do not start, stop or change a prescription based only on AI output.',
    tags: ['medicine', 'medication', 'dose', 'drug', 'interaction', 'prescription'],
    evidenceLevel: 'patient-fact-sheet'
  },
  {
    id: 'mohfw-mental-health',
    title: 'National Tele Mental Health Programme',
    publisher: 'Ministry of Health and Family Welfare, India',
    url: 'https://mohfw.gov.in/?q=press-info/7892',
    reviewedAt: '2026-08-19',
    excerpt: 'Tele-MANAS provides tele-mental-health support in India. Immediate danger or self-harm risk requires emergency help rather than a conversational assistant.',
    tags: ['mental health', 'anxiety', 'depression', 'stress', 'self harm', 'suicide'],
    evidenceLevel: 'service-directory'
  },
  {
    id: 'india-emergency-112',
    title: 'Emergency Response Support System',
    publisher: 'Government of India',
    url: 'https://112.gov.in/',
    reviewedAt: '2026-08-19',
    excerpt: '112 is India’s single emergency response number. Suspected life-threatening symptoms should be escalated immediately.',
    tags: ['emergency', 'ambulance', 'chest pain', 'stroke', 'bleeding', 'unconscious', 'breathing'],
    evidenceLevel: 'service-directory'
  },
  {
    id: 'icmr-standard-treatment-workflows',
    title: 'Standard Treatment Workflows',
    publisher: 'Indian Council of Medical Research, Government of India',
    url: 'https://www.icmr.gov.in/standard-treatment-workflows-stws',
    reviewedAt: '2026-08-19',
    excerpt: 'Official Indian clinical workflow index spanning common conditions across major specialties. The index routes reviewers to condition-specific documents; it is not itself evidence for a patient-specific treatment recommendation.',
    tags: [
      'cardiology', 'heart failure', 'arrhythmia', 'ent', 'sinusitis', 'kidney', 'nephrology',
      'neurology', 'stroke', 'headache', 'epilepsy', 'obstetrics', 'gynaecology', 'pregnancy',
      'paediatric', 'pediatric', 'paediatrics', 'pediatrics', 'child', 'dengue', 'fever', 'neonatal', 'psychiatry', 'pulmonology', 'asthma',
      'copd', 'urology', 'gastroenterology', 'surgery', 'anaemia', 'infertility', 'dermatology'
    ],
    evidenceLevel: 'clinical-guideline-index'
  },
  {
    id: 'mohfw-standard-treatment-guidelines',
    title: 'Standard Treatment Guidelines',
    publisher: 'Ministry of Health and Family Welfare, Government of India',
    url: 'https://clinicalestablishments.mohfw.gov.in/en/standard-treatment-guidelines',
    reviewedAt: '2026-08-19',
    excerpt: 'Official Indian guideline directory covering critical care, medicine, surgery, paediatrics, obstetrics, oncology, endocrinology, trauma and national health programmes. A condition-specific guideline must be reviewed before making a clinical claim.',
    tags: [
      'critical care', 'respiratory', 'medicine', 'surgery', 'paediatrics', 'obstetrics', 'gynaecology',
      'oncology', 'cancer', 'endocrinology', 'diabetes', 'trauma', 'orthopaedics', 'ophthalmology',
      'laboratory', 'transplant', 'tuberculosis', 'tb', 'hiv', 'malaria', 'dengue', 'rabies', 'snake bite'
    ],
    evidenceLevel: 'clinical-guideline-index'
  },
  {
    id: 'nmc-cbme-2024',
    title: 'Competency Based Medical Education Curriculum 2024',
    publisher: 'National Medical Commission',
    url: 'https://www.nmc.org.in/rules-regulations-nmc/',
    reviewedAt: '2026-08-19',
    excerpt: 'The current Indian undergraduate medical curriculum defines competency-oriented learning across medical disciplines. It is an education framework, not a patient treatment source or an official exam question bank.',
    tags: [
      'mbbs', 'medical student', 'curriculum', 'competency', 'anatomy', 'physiology', 'biochemistry',
      'pathology', 'pharmacology', 'microbiology', 'forensic', 'community medicine', 'clinical reasoning',
      'internship', 'neet pg', 'inicet'
    ],
    evidenceLevel: 'education-framework'
  },
  {
    id: 'who-health-topics',
    title: 'Health topics',
    publisher: 'World Health Organization',
    url: 'https://www.who.int/health-topics',
    reviewedAt: '2026-08-19',
    excerpt: 'WHO’s health topic index provides routes to public-health and patient information across communicable diseases, noncommunicable diseases, populations, interventions and health systems.',
    tags: [
      'public health', 'infection', 'communicable', 'noncommunicable', 'cancer', 'maternal', 'child',
      'adolescent', 'ageing', 'nutrition', 'mental health', 'vaccination', 'environment', 'prevention'
    ],
    evidenceLevel: 'clinical-guideline-index'
  }
]

export function listMedicalSources() {
  return sources.map(source => ({ ...source }))
}

export function getMedicalSource(id: string) {
  const source = sources.find(item => item.id === id)
  return source ? { ...source } : undefined
}

function tokens(value: string) {
  return new Set(
    value.toLocaleLowerCase().split(/[\s,.;:!?()[\]{}"'\/\\|]+/).filter(token => token.length > 2)
  )
}

export function retrieveMedicalEvidence(query: string, limit = 3): RetrievedEvidence[] {
  const queryTokens = tokens(query)
  if (queryTokens.size === 0) return []

  return sources
    .map(source => {
      const haystack = tokens(`${source.title} ${source.excerpt} ${source.tags.join(' ')}`)
      let overlap = 0
      queryTokens.forEach(token => {
        if (haystack.has(token)) overlap += source.tags.includes(token) ? 3 : 1
      })
      return { ...source, score: overlap / Math.max(1, queryTokens.size) }
    })
    .filter(source => source.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

export function evidenceContext(evidence: RetrievedEvidence[]) {
  if (evidence.length === 0) return 'No relevant curated source was retrieved. State uncertainty and do not invent a citation.'
  return evidence.map((source, index) =>
    `[${index + 1}] ${source.publisher} (${source.evidenceLevel || 'patient-fact-sheet'}): ${source.excerpt} Source: ${source.url}`
  ).join('\n')
}
