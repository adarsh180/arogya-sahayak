import { NextRequest, NextResponse } from 'next/server'
import { callAI } from '@/lib/ai'

// Comprehensive medical terms database
const medicalTermsDatabase = {
  'hypertension': {
    id: 'hypertension',
    term: 'Hypertension',
    pronunciation: 'hahy-per-TEN-shuhn',
    definition: 'A condition in which blood pressure in the arteries is persistently elevated, typically 140/90 mmHg or higher.',
    category: 'cardiology',
    synonyms: ['High Blood Pressure', 'Arterial Hypertension'],
    relatedTerms: ['Hypotension', 'Blood Pressure', 'Systolic', 'Diastolic'],
    examples: ['Essential hypertension affects 90% of hypertensive patients', 'Secondary hypertension is caused by underlying conditions'],
    difficulty: 'basic'
  },
  'diabetes': {
    id: 'diabetes',
    term: 'Diabetes Mellitus',
    pronunciation: 'dahy-uh-BEE-teez mel-AY-tuhs',
    definition: 'A group of metabolic disorders characterized by high blood sugar levels over a prolonged period.',
    category: 'endocrinology',
    synonyms: ['Diabetes', 'DM'],
    relatedTerms: ['Insulin', 'Glucose', 'Hyperglycemia', 'Hypoglycemia'],
    examples: ['Type 1 diabetes is autoimmune', 'Type 2 diabetes is insulin resistant'],
    difficulty: 'basic'
  },
  'myocardial infarction': {
    id: 'myocardial-infarction',
    term: 'Myocardial Infarction',
    pronunciation: 'mahy-uh-KAHR-dee-uhl in-FAHRK-shuhn',
    definition: 'Death of heart muscle tissue due to insufficient blood supply, commonly known as a heart attack.',
    category: 'cardiology',
    synonyms: ['Heart Attack', 'MI', 'Coronary Thrombosis'],
    relatedTerms: ['Angina', 'Coronary Artery Disease', 'Atherosclerosis', 'Ischemia'],
    examples: ['STEMI is ST-elevation myocardial infarction', 'NSTEMI is non-ST-elevation myocardial infarction'],
    difficulty: 'intermediate'
  },
  'pneumonia': {
    id: 'pneumonia',
    term: 'Pneumonia',
    pronunciation: 'noo-MOHN-yuh',
    definition: 'Infection that inflames air sacs in one or both lungs, which may fill with fluid or pus.',
    category: 'pulmonology',
    synonyms: ['Lung Infection', 'Pneumonitis'],
    relatedTerms: ['Bronchitis', 'Pleuritis', 'Respiratory Infection', 'Alveoli'],
    examples: ['Bacterial pneumonia is often caused by Streptococcus pneumoniae', 'Viral pneumonia is usually milder'],
    difficulty: 'basic'
  },
  'stroke': {
    id: 'stroke',
    term: 'Cerebrovascular Accident',
    pronunciation: 'ser-uh-broh-VAS-kyuh-ler AK-si-duhnt',
    definition: 'Sudden loss of brain function due to disturbance in blood supply to the brain.',
    category: 'neurology',
    synonyms: ['Stroke', 'CVA', 'Brain Attack'],
    relatedTerms: ['Ischemia', 'Hemorrhage', 'TIA', 'Hemiplegia'],
    examples: ['Ischemic stroke accounts for 87% of all strokes', 'Hemorrhagic stroke has higher mortality'],
    difficulty: 'intermediate'
  },
  'asthma': {
    id: 'asthma',
    term: 'Asthma',
    pronunciation: 'AZ-muh',
    definition: 'A respiratory condition marked by attacks of spasm in the bronchi, causing difficulty breathing.',
    category: 'pulmonology',
    synonyms: ['Bronchial Asthma'],
    relatedTerms: ['Bronchospasm', 'Wheeze', 'Dyspnea', 'Inhaler'],
    examples: ['Allergic asthma is triggered by allergens', 'Exercise-induced asthma occurs during physical activity'],
    difficulty: 'basic'
  },
  'anemia': {
    id: 'anemia',
    term: 'Anemia',
    pronunciation: 'uh-NEE-mee-uh',
    definition: 'A condition in which the blood lacks adequate healthy red blood cells or hemoglobin.',
    category: 'hematology',
    synonyms: ['Anaemia'],
    relatedTerms: ['Hemoglobin', 'Iron Deficiency', 'Pallor', 'Fatigue'],
    examples: ['Iron deficiency anemia is the most common type', 'Pernicious anemia is caused by B12 deficiency'],
    difficulty: 'basic'
  },
  'arthritis': {
    id: 'arthritis',
    term: 'Arthritis',
    pronunciation: 'ahr-THRAHY-tis',
    definition: 'Inflammation of one or more joints, causing pain and stiffness that can worsen with age.',
    category: 'rheumatology',
    synonyms: ['Joint Inflammation'],
    relatedTerms: ['Osteoarthritis', 'Rheumatoid Arthritis', 'Synovitis', 'Joint Pain'],
    examples: ['Osteoarthritis affects weight-bearing joints', 'Rheumatoid arthritis is an autoimmune condition'],
    difficulty: 'basic'
  }
}

export async function POST(request: NextRequest) {
  try {
    const { query, language = 'en', category = 'all', difficulty = 'all' } = await request.json()

    if (!query || query.trim().length < 2) {
      return NextResponse.json([])
    }

    const searchQuery = query.toLowerCase().trim()
    
    // Search in local database first
    let results = Object.values(medicalTermsDatabase).filter(term => {
      const matchesTerm = term.term.toLowerCase().includes(searchQuery) ||
                         term.definition.toLowerCase().includes(searchQuery) ||
                         term.synonyms.some(syn => syn.toLowerCase().includes(searchQuery))
      
      const matchesCategory = category === 'all' || term.category === category
      const matchesDifficulty = difficulty === 'all' || term.difficulty === difficulty
      
      return matchesTerm && matchesCategory && matchesDifficulty
    })

    // If no results in local database, use AI to generate comprehensive medical information
    if (results.length === 0) {
      try {
        const aiPrompt = `Provide comprehensive medical information for the term "${query}" in the following JSON format:
        {
          "term": "Medical Term",
          "pronunciation": "phonetic pronunciation",
          "definition": "detailed medical definition",
          "category": "medical specialty (e.g., cardiology, neurology)",
          "synonyms": ["synonym1", "synonym2"],
          "relatedTerms": ["related1", "related2"],
          "examples": ["example1", "example2"],
          "difficulty": "basic/intermediate/advanced"
        }
        
        If the term is not medical, return empty object {}. Provide accurate, professional medical information only.`

        const aiResponse = await callAI([{ role: 'user', content: aiPrompt }], 'medical', language)
        
        if (!aiResponse) {
          return NextResponse.json([])
        }
        
        try {
          const aiResult = JSON.parse(aiResponse)
          if (aiResult.term) {
            results = [{
              id: query.toLowerCase().replace(/\s+/g, '-'),
              ...aiResult,
              language
            }]
          }
        } catch (parseError) {
          console.error('AI response parsing error:', parseError)
        }
      } catch (aiError) {
        console.error('AI search error:', aiError)
      }
    } else {
      // Translate results if language is not English
      if (language !== 'en') {
        try {
          for (let result of results) {
            const translatePrompt = `Translate this medical term information to ${language}:
            Term: ${result.term}
            Definition: ${result.definition}
            Keep medical accuracy. Return in same JSON format.`
            
            const translation = await callAI([{ role: 'user', content: translatePrompt }], 'medical', language)
            if (!translation) continue
            
            try {
              const translatedResult = JSON.parse(translation)
              if (translatedResult.term && translatedResult.definition) {
                result.term = translatedResult.term
                result.definition = translatedResult.definition
              }
            } catch (e) {
              // Keep original if translation fails
            }
          }
        } catch (translationError) {
          console.error('Translation error:', translationError)
        }
      }
      
      // Add language to results
      results = results.map(result => ({ ...result, language }))
    }

    return NextResponse.json(results.slice(0, 10)) // Limit to 10 results
  } catch (error) {
    console.error('Medical dictionary search error:', error)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}