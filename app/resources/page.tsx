import Link from 'next/link'
import { ArrowRight, BookOpen, FileCheck2, ShieldCheck } from 'lucide-react'
import AppShell from '@/components/shell/AppShell'
import { PageHeader } from '@/components/ui/kit'
import { listMedicalSources } from '@/lib/rag'

const levelLabels = {
  'patient-fact-sheet': 'Patient fact sheet',
  'clinical-guideline-index': 'Guideline directory',
  'education-framework': 'Education framework',
  'service-directory': 'Public service',
} as const

export default function ResourcesPage() {
  const sources = listMedicalSources()
  return (
    <AppShell>
      <PageHeader kicker="Evidence library" title="See what Arogya relies on." description="A small, reviewed set of sources used to ground health answers. Each one is named, dated and linked to the original publication." />
      <div className="ui-stats ev-facts">
        <article className="ui-stat"><span><FileCheck2 />Reviewed sources</span><strong>{sources.length}</strong></article>
        <article className="ui-stat"><span><BookOpen />Publishers</span><strong>{new Set(sources.map(source => source.publisher)).size}</strong></article>
        <article className="ui-stat ev-fact-wide"><span><ShieldCheck />Boundary</span><p>Sources support general orientation — not a diagnosis or a treatment decision.</p></article>
      </div>
      <section className="ev-grid" aria-label="Sources">
        {sources.map(source => (
          <Link key={source.id} href={`/resources/${source.id}`} className="ui-card ev-card is-interactive">
            <span className="ui-badge is-bare is-saffron">{levelLabels[source.evidenceLevel || 'patient-fact-sheet']}</span>
            <h2>{source.title}</h2>
            <p>{source.publisher}</p>
            <small>Reviewed {source.reviewedAt}</small>
            <span className="ui-link">Read summary <ArrowRight /></span>
          </Link>
        ))}
      </section>
    </AppShell>
  )
}
