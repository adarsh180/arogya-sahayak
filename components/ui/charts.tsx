'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react'

const pad = { top: 16, right: 18, bottom: 28, left: 40 }

export type TrendPoint = { date: string; value: number; secondary?: number; note?: string }

function extent(values: number[], pad = 0.12): [number, number] {
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min || Math.max(1, Math.abs(max) * 0.1)
  return [min - span * pad, max + span * pad]
}

export function Sparkline({ values, height = 34, width = 120, label }: { values: number[]; height?: number; width?: number; label: string }) {
  if (values.length < 2) return <svg className="ui-sparkline" width={width} height={height} aria-hidden="true" />
  const [lo, hi] = extent(values, 0.2)
  const step = width / (values.length - 1)
  const y = (value: number) => height - 3 - ((value - lo) / (hi - lo)) * (height - 6)
  const d = values.map((value, index) => `${index ? 'L' : 'M'}${(index * step).toFixed(1)} ${y(value).toFixed(1)}`).join(' ')
  const last = values[values.length - 1]
  return (
    <svg className="ui-sparkline" width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={label}>
      <path d={d} />
      <circle cx={width - 0.5} cy={y(last)} r="3" />
    </svg>
  )
}

/**
 * Single-series trend with an optional reference band, crosshair and tooltip.
 * `secondary` draws a dashed second line (e.g. diastolic) on the same scale.
 */
export function TrendChart({ points, unit, band, label, height = 220, format = (value: number) => String(value) }: {
  points: TrendPoint[]
  unit: string
  band?: [number, number]
  label: string
  height?: number
  format?: (value: number) => string
}) {
  const id = useId()
  const box = useRef<HTMLDivElement>(null)
  const [hover, setHover] = useState<number | null>(null)
  const [width, setWidth] = useState(640)

  useEffect(() => {
    const element = box.current
    if (!element) return
    const observer = new ResizeObserver(entries => setWidth(Math.max(260, Math.round(entries[0].contentRect.width))))
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const geometry = useMemo(() => {
    const all = points.flatMap(point => [point.value, ...(point.secondary !== undefined ? [point.secondary] : [])]).concat(band || [])
    const [lo, hi] = extent(all)
    const innerW = width - pad.left - pad.right
    const innerH = height - pad.top - pad.bottom
    const x = (index: number) => pad.left + (points.length === 1 ? innerW / 2 : (index / (points.length - 1)) * innerW)
    const y = (value: number) => pad.top + innerH - ((value - lo) / (hi - lo)) * innerH
    const ticks = Array.from({ length: 4 }, (_, index) => lo + ((hi - lo) * (index + 0.5)) / 4)
    return { x, y, ticks, innerW, innerH }
  }, [band, height, points, width])

  if (!points.length) return null
  const { x, y, ticks } = geometry
  const line = (key: 'value' | 'secondary') => points
    .map((point, index) => (point[key] === undefined ? null : `${x(index).toFixed(1)} ${y(point[key] as number).toFixed(1)}`))
    .filter(Boolean)
    .map((segment, index) => `${index ? 'L' : 'M'}${segment}`)
    .join(' ')
  const area = `${line('value')} L${x(points.length - 1).toFixed(1)} ${height - pad.bottom} L${x(0).toFixed(1)} ${height - pad.bottom} Z`
  const hasSecondary = points.some(point => point.secondary !== undefined)
  const labelEvery = Math.max(1, Math.ceil(points.length / Math.max(2, Math.floor(width / 110))))
  const active = hover === null ? null : points[hover]
  const sameDay = new Date(points[0].date).toDateString() === new Date(points[points.length - 1].date).toDateString()

  function onMove(event: React.PointerEvent) {
    const rect = box.current?.getBoundingClientRect()
    if (!rect) return
    const ratio = (event.clientX - rect.left) / rect.width
    const svgX = ratio * width
    let nearest = 0
    let distance = Infinity
    points.forEach((_, index) => {
      const gap = Math.abs(x(index) - svgX)
      if (gap < distance) { distance = gap; nearest = index }
    })
    setHover(nearest)
  }

  return (
    <div className="ui-chart" ref={box} onPointerMove={onMove} onPointerLeave={() => setHover(null)}>
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={label}>
        <defs>
          <linearGradient id={`${id}-fill`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="var(--accent)" stopOpacity="0.18" />
            <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {band && <rect className="ui-chart-band" x={pad.left} width={width - pad.left - pad.right} y={y(band[1])} height={Math.max(0, y(band[0]) - y(band[1]))} />}
        {ticks.map(tick => (
          <g key={tick} className="ui-chart-grid">
            <line x1={pad.left} x2={width - pad.right} y1={y(tick)} y2={y(tick)} />
            <text x={pad.left - 8} y={y(tick) + 4} textAnchor="end">{format(Math.round(tick))}</text>
          </g>
        ))}
        {points.map((point, index) => index % labelEvery === 0 || index === points.length - 1 ? (
          <text key={point.date + index} className="ui-chart-x" x={x(index)} y={height - 8} textAnchor="middle">
            {sameDay ? new Date(point.date).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }) : new Date(point.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
          </text>
        ) : null)}
        {points.length > 1 && <path d={area} fill={`url(#${id}-fill)`} />}
        {hasSecondary && <path className="ui-chart-line is-secondary" d={line('secondary')} />}
        {points.length > 1 && <path className="ui-chart-line" d={line('value')} />}
        {points.map((point, index) => <circle key={index} className="ui-chart-dot" cx={x(index)} cy={y(point.value)} r={hover === index ? 5 : 3.5} />)}
        {hasSecondary && points.map((point, index) => point.secondary === undefined ? null : <circle key={`s${index}`} className="ui-chart-dot is-secondary" cx={x(index)} cy={y(point.secondary)} r={hover === index ? 4.5 : 3} />)}
        {active && <line className="ui-chart-cross" x1={x(hover!)} x2={x(hover!)} y1={pad.top} y2={height - pad.bottom} />}
      </svg>
      {active && (
        <div className="ui-chart-tip" style={{ left: `${(x(hover!) / width) * 100}%` }}>
          <small>{new Date(active.date).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</small>
          <strong>{format(active.value)}{active.secondary !== undefined ? `/${format(active.secondary)}` : ''} <span>{unit}</span></strong>
          {active.note && <em>{active.note}</em>}
        </div>
      )}
    </div>
  )
}

export function ScoreBars({ items }: { items: Array<{ label: string; value: number; meta?: string }> }) {
  return (
    <div className="ui-bars">
      {items.map(item => (
        <div key={item.label} className="ui-bar-row">
          <div className="ui-bar-label"><strong>{item.label}</strong>{item.meta && <small>{item.meta}</small>}</div>
          <div className="ui-bar-track" title={`${item.label}: ${item.value}%`}><i style={{ width: `${Math.max(2, Math.min(100, item.value))}%` }} /></div>
          <span className="ui-bar-value">{item.value}%</span>
        </div>
      ))}
    </div>
  )
}
