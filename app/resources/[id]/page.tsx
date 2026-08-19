import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, BookOpen, ExternalLink, FileCheck2, ShieldCheck } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { getMedicalSource } from '@/lib/rag'

const levelLabels = {
  'patient-fact-sheet': 'Patient fact sheet',
  'clinical-guideline-index': 'Guideline directory',
  'education-framework': 'Education framework',
  'service-directory': 'Public service directory'
}

export default async function ResourceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const source = getMedicalSource(id)
  if (!source) notFound()

  return (
    <div className="as-resource-page">
      <Navbar />
      <main id="main-content" className="as-resource-detail as-container">
        <Link href="/resources" className="as-resource-back"><ArrowLeft /> Evidence library</Link>

        <article>
          <header>
            <span>{levelLabels[source.evidenceLevel || 'patient-fact-sheet']}</span>
            <h1>{source.title}</h1>
            <p>{source.publisher}</p>
          </header>

          <div className="as-resource-meta">
            <span><FileCheck2 /><small>Last reviewed</small><strong>{source.reviewedAt}</strong></span>
            <span><BookOpen /><small>Source type</small><strong>{levelLabels[source.evidenceLevel || 'patient-fact-sheet']}</strong></span>
          </div>

          <section>
            <span className="as-kicker">Why this source may appear</span>
            <p>{source.excerpt}</p>
          </section>

          <aside><ShieldCheck /><p>This is a reviewed orientation source, not a diagnosis or an instruction to start, stop or change treatment. Confirm medical decisions with a qualified clinician and the current original publication.</p></aside>

          <a className="as-button" href={source.url} target="_blank" rel="noopener noreferrer">Open original publication <ExternalLink /></a>
        </article>
      </main>
    </div>
  )
}
