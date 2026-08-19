import Link from 'next/link'
import { ArrowRight, BookOpen, FileCheck2, ShieldCheck } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { listMedicalSources } from '@/lib/rag'

const levelLabels = {
  'patient-fact-sheet': 'Patient fact sheet',
  'clinical-guideline-index': 'Guideline directory',
  'education-framework': 'Education framework',
  'service-directory': 'Public service directory'
}

export default function ResourcesPage() {
  const sources = listMedicalSources()

  return (
    <div className="as-resource-page">
      <Navbar />
      <main id="main-content" className="as-resource-shell as-container">
        <header className="as-resource-hero">
          <span className="as-kicker">Reviewed evidence library</span>
          <h1>See what Arogya can—and cannot—support.</h1>
          <p>These references are used as a small, transparent retrieval layer. They do not turn generated information into a diagnosis or patient-specific treatment plan.</p>
          <div><span><FileCheck2 /> Named publishers</span><span><BookOpen /> Visible source boundaries</span><span><ShieldCheck /> Human review still required</span></div>
        </header>

        <section className="as-resource-grid" aria-label="Available evidence sources">
          {sources.map(source => (
            <Link href={`/resources/${source.id}`} key={source.id}>
              <span>{levelLabels[source.evidenceLevel || 'patient-fact-sheet']}</span>
              <h2>{source.title}</h2>
              <p>{source.publisher}</p>
              <small>Reviewed {source.reviewedAt}</small>
              <ArrowRight aria-hidden="true" />
            </Link>
          ))}
        </section>
      </main>
    </div>
  )
}
