const points = [
  { x: 18, y: 74 }, { x: 72, y: 62 }, { x: 126, y: 68 },
  { x: 180, y: 43 }, { x: 234, y: 50 }, { x: 288, y: 29 }, { x: 342, y: 36 },
]

export default function AnimatedHealthTrend() {
  return (
    <div className="as-health-trend">
      <svg viewBox="0 0 360 108" role="img" aria-label="Illustrative weekly health record trend">
        <defs>
          <linearGradient id="trend-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="currentColor" stopOpacity=".28" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
          <filter id="trend-glow" x="-20%" y="-40%" width="140%" height="180%">
            <feGaussianBlur stdDeviation="2.4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <g className="as-trend-grid" aria-hidden="true">
          <path d="M18 20H342M18 50H342M18 80H342" />
        </g>
        <path
          className="as-trend-area"
          d="M18 74 C42 74 51 62 72 62 S105 68 126 68 S158 43 180 43 S212 50 234 50 S266 29 288 29 S320 36 342 36 L342 92 L18 92 Z"
        />
        <path
          className="as-trend-line"
          pathLength="1"
          d="M18 74 C42 74 51 62 72 62 S105 68 126 68 S158 43 180 43 S212 50 234 50 S266 29 288 29 S320 36 342 36"
        />
        <g className="as-trend-points" aria-hidden="true">
          {points.map((point, index) => (
            <circle key={point.x} cx={point.x} cy={point.y} r="3.2" style={{ '--point-delay': `${650 + index * 90}ms` } as React.CSSProperties} />
          ))}
        </g>
        <g className="as-trend-cursor" aria-hidden="true">
          <line x1="0" y1="14" x2="0" y2="92" />
          <circle cx="0" cy="43" r="4" />
        </g>
      </svg>
      <div className="as-trend-labels" aria-hidden="true">
        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
      </div>
    </div>
  )
}
