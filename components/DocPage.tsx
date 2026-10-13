import AdaptiveShell from '@/components/shell/AdaptiveShell'
import { PageHeader } from '@/components/ui/kit'

export type DocSection = { id: string; title: string; body: React.ReactNode }

export default function DocPage({ kicker, title, description, sections }: { kicker: string; title: string; description: string; sections: DocSection[] }) {
  return (
    <AdaptiveShell>
      <PageHeader kicker={kicker} title={title} description={description} />
      <div className="doc-layout">
        <nav className="doc-toc" aria-label="On this page">
          {sections.map(section => <a key={section.id} href={`#${section.id}`}>{section.title}</a>)}
        </nav>
        <div className="doc-body">
          {sections.map((section, index) => (
            <section key={section.id} id={section.id} className="ui-card doc-section">
              <h2><span>0{index + 1}</span>{section.title}</h2>
              {section.body}
            </section>
          ))}
        </div>
      </div>
    </AdaptiveShell>
  )
}
