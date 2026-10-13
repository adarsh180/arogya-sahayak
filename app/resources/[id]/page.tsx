import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, BookOpen, ExternalLink, FileCheck2, ShieldCheck } from 'lucide-react'
import AppShell from '@/components/shell/AppShell'
import { PageHeader } from '@/components/ui/kit'
import { getMedicalSource } from '@/lib/rag'

const levelLabels = {
  'patient-fact-sheet': 'Patient fact sheet',
  'clinical-guideline-index': 'Guideline directory',
  'education-framework': 'Education framework',
  'service-directory': 'Public service',
} as const

export default async function ResourceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const source = getMedicalSource(id)
  if (!source) notFound()
  const level = levelLabels[source.evidenceLevel || 'patient-fact-sheet']

  return (
    <AppShell>
      <Link href="/resources" className="ui-link ev-back"><ArrowLeft /> Evidence library</Link>
      <PageHeader kicker={level} title={source.title} description={source.publisher} />
      <div className="ev-detail">
        <div className="ev-detail-meta">
          <div className="ui-stat"><span><FileCheck2 />Last reviewed</span><strong className="ev-meta-value">{source.reviewedAt}</strong></div>
          <div className="ui-stat"><span><BookOpen />Source type</span><strong className="ev-meta-value">{level}</strong></div>
        </div>
        <section className="ui-card ev-excerpt">
          <span className="ui-kicker">Why this source may appear</span>
          <p>{source.excerpt}</p>
        </section>
        {source.tags.length > 0 && <div className="ev-tags">{source.tags.map(tag => <span key={tag} className="ui-badge is-bare">{tag}</span>)}</div>}
        <div className="ui-alert"><ShieldCheck /><span>This is a reviewed orientation source, not a diagnosis or an instruction to start, stop or change treatment. Confirm decisions with a qualified clinician and the current original publication.</span></div>
        <a className="ui-btn ui-btn-lg ev-open" href={source.url} target="_blank" rel="noopener noreferrer">Open original publication <ExternalLink /></a>
      </div>
    </AppShell>
  )
}
