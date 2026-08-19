import Image from 'next/image'

export default function Loading() {
  return (
    <div className="as-segment-loader" role="status" aria-label="Loading page">
      <div className="as-loader-stage">
        <span className="as-loader-orbit" aria-hidden="true" />
        <Image src="/arogya-mark.png" alt="" width={54} height={54} priority />
      </div>
      <span>Preparing your space</span>
    </div>
  )
}
