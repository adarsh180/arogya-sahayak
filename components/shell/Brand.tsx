import Image from 'next/image'
import Link from 'next/link'

export default function Brand({ href = '/', tagline = 'Health clarity for India' }: { href?: string; tagline?: string | null }) {
  return (
    <Link href={href} className="ui-brand" aria-label="Arogya Sahayak home">
      <span className="ui-brand-mark"><Image src="/arogya-mark.png" alt="" width={28} height={28} priority /></span>
      <span className="ui-brand-word"><strong>Arogya Sahayak</strong>{tagline && <small>{tagline}</small>}</span>
    </Link>
  )
}
