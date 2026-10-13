'use client'

import Image from 'next/image'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

export function cx(...names: Array<string | false | null | undefined>) {
  return names.filter(Boolean).join(' ')
}

export function BrandLoader({ label = 'Preparing your space', size = 88, screen = false }: { label?: string; size?: number; screen?: boolean }) {
  const loader = (
    <div className="ui-loader" role="status" aria-live="polite">
      <div className="ui-loader-mark" style={{ '--loader-size': `${size}px` } as React.CSSProperties}>
        <span className="ui-loader-ring is-jade" aria-hidden="true" />
        <span className="ui-loader-ring is-saffron" aria-hidden="true" />
        <Image src="/arogya-mark.png" alt="" width={64} height={64} priority />
      </div>
      <svg className="ui-loader-pulse" viewBox="0 0 120 22" aria-hidden="true">
        <path d="M2 12h34l6-9 8 17 7-13 5 5h56" />
      </svg>
      {label && <span>{label}</span>}
    </div>
  )
  return screen ? <div className="ui-loader-screen">{loader}</div> : <div className="ui-loader-block">{loader}</div>
}

export function PageHeader({ kicker, title, description, actions }: { kicker?: string; title: ReactNode; description?: ReactNode; actions?: ReactNode }) {
  return (
    <header className="ui-page-head">
      <div>
        {kicker && <span className="ui-kicker">{kicker}</span>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {actions && <div className="ui-page-actions">{actions}</div>}
    </header>
  )
}

export function EmptyState({ icon: Icon, title, children, action }: { icon: LucideIcon; title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="ui-empty">
      <div className="ui-empty-icon"><Icon aria-hidden="true" /></div>
      <strong>{title}</strong>
      {children && <p>{children}</p>}
      {action}
    </div>
  )
}

export function Modal({ open, onOpenChange, title, description, children, footer }: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: ReactNode
  footer?: ReactNode
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="ui-overlay" />
        <Dialog.Content className="ui-modal" {...(description ? {} : { 'aria-describedby': undefined })}>
          <div className="ui-modal-head">
            <div>
              <Dialog.Title>{title}</Dialog.Title>
              {description ? <Dialog.Description>{description}</Dialog.Description> : null}
            </div>
            <Dialog.Close className="ui-icon-btn is-outlined" aria-label="Close"><X /></Dialog.Close>
          </div>
          {children}
          {footer && <div className="ui-modal-foot">{footer}</div>}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export function Segmented<T extends string>({ options, value, onChange, label }: {
  options: Array<{ value: T; label: string; icon?: LucideIcon }>
  value: T
  onChange: (value: T) => void
  label: string
}) {
  return (
    <div className="ui-segmented" role="group" aria-label={label}>
      {options.map(({ value: optionValue, label: optionLabel, icon: Icon }) => (
        <button key={optionValue} type="button" aria-pressed={value === optionValue} onClick={() => onChange(optionValue)}>
          {Icon && <Icon aria-hidden="true" />}{optionLabel}
        </button>
      ))}
    </div>
  )
}

export function Tabs<T extends string>({ tabs, value, onChange, label }: {
  tabs: Array<{ value: T; label: string; icon?: LucideIcon; count?: number }>
  value: T
  onChange: (value: T) => void
  label: string
}) {
  return (
    <div className="ui-tabs" role="tablist" aria-label={label}>
      {tabs.map(({ value: tabValue, label: tabLabel, icon: Icon, count }) => (
        <button key={tabValue} type="button" role="tab" aria-selected={value === tabValue} onClick={() => onChange(tabValue)}>
          {Icon && <Icon aria-hidden="true" />}{tabLabel}{typeof count === 'number' && <span className="ui-count">{count}</span>}
        </button>
      ))}
    </div>
  )
}

export type Status = 'normal' | 'warning' | 'danger'

export function StatusBadge({ status, children }: { status?: Status | string; children?: ReactNode }) {
  const tone = status === 'danger' ? 'is-danger' : status === 'warning' ? 'is-warn' : status === 'normal' ? 'is-ok' : ''
  const label = status === 'danger' ? 'Needs attention' : status === 'warning' ? 'Outside usual range' : status === 'normal' ? 'Within usual range' : 'No reading'
  return <span className={cx('ui-badge', tone)}>{children || label}</span>
}

export function Skeleton({ height = 16, width = '100%', radius }: { height?: number | string; width?: number | string; radius?: number }) {
  return <span className="ui-skeleton" style={{ display: 'block', height, width, borderRadius: radius }} aria-hidden="true" />
}

export function Spinner() {
  return <span className="ui-spinner" aria-hidden="true" />
}
