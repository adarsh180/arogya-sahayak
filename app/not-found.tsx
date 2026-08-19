import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return <main id="main-content" className="as-error-page"><span className="as-error-code">404</span><span className="as-kicker">Page not found</span><h1>This path doesn’t lead anywhere yet.</h1><p>The link may be old or the feature may have moved.</p><Link href="/" className="as-button"><ArrowLeft /> Return home</Link></main>
}
