import type { ReactNode, ElementType } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

/** Soft white card used across the post-registration screens (Figma "premium" look). */
export function FCard({ children, className, tone = 'default' }: { children: ReactNode; className?: string; tone?: 'default' | 'warm' | 'danger' | 'gold' | 'navy' }) {
  const tones = {
    default: 'bg-parchment-0 border-ink-100',
    warm: 'bg-parchment-100 border-ink-100',
    danger: 'bg-danger-100 border-danger-500/25',
    gold: 'bg-gold-50 border-gold-300/50',
    navy: 'bg-[#0C1D3A] border-[#0C1D3A] text-white',
  }
  return <div className={cn('rounded-[20px] border border-opacity-60 p-4 shadow-[var(--shadow-soft-sm)]', tones[tone], className)}>{children}</div>
}

/** Small rounded icon tile, optionally tinted. */
export function IconTile({ icon: Icon, tint = 'gold', size = 36 }: { icon: ElementType; tint?: 'gold' | 'navy' | 'red' | 'green' | 'purple'; size?: number }) {
  const tints = {
    gold: 'bg-gold-100 text-gold-700',
    navy: 'bg-[var(--tile-navy-bg)] text-ink-800',
    red: 'bg-danger-100 text-danger-700',
    green: 'bg-success-100 text-success-500',
    purple: 'bg-[#F1E8FB] text-[#7A3FD1]',
  }
  return (
    <span className={cn('flex shrink-0 items-center justify-center rounded-[9px]', tints[tint])} style={{ width: size, height: size }}>
      <Icon size={size * 0.5} />
    </span>
  )
}

export function PageHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="px-5 pt-5 pb-3">
      <h1 className="text-[23px] leading-tight font-semibold tracking-tight text-ink-900">{title}</h1>
      {subtitle && <p className="mt-1.5 text-[11.5px] text-ink-500 leading-relaxed">{subtitle}</p>}
    </div>
  )
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn('text-[11px] font-bold uppercase tracking-[0.14em] text-ink-500', className)}>{children}</p>
}

/** Centered dialog with a round icon on top — the Figma "Report / Block / Continue outside CANA" style. */
export function CenterDialog({
  open,
  onClose,
  icon,
  title,
  pill,
  children,
  actions,
  closable = false,
  iconTone = 'gold',
}: {
  open: boolean
  onClose?: () => void
  icon?: ReactNode
  title: string
  pill?: string
  children?: ReactNode
  actions?: ReactNode
  closable?: boolean
  iconTone?: 'gold' | 'red'
}) {
  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-[#0C1D3A]/60 backdrop-blur-[3px]" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="relative z-10 w-full max-w-[340px] max-h-[88vh] overflow-y-auto rounded-[28px] bg-parchment-0 px-5 pb-5 pt-6 text-center shadow-[var(--shadow-soft-lg)]"
          >
            {closable && (
              <button onClick={onClose} className="absolute end-3 top-3 rounded-full bg-ink-50 p-1.5 text-ink-500" aria-label="Close">
                <X size={15} />
              </button>
            )}
            {icon && <div className={cn('mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full ring-4', iconTone === 'red' ? 'bg-[#FBE0E0] text-[#C0262D] ring-[#FDF0F0]' : 'bg-gold-100 text-gold-700 ring-gold-50')}>{icon}</div>}
            <h3 className="text-xl font-bold tracking-tight text-ink-900 leading-snug">{title}</h3>
            {pill && (
              <span className="mt-2 inline-flex rounded-full bg-gold-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gold-700">{pill}</span>
            )}
            <div className="mt-3 text-[13px] leading-relaxed text-ink-600">{children}</div>
            {actions && <div className="mt-5 space-y-2">{actions}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}

/** Secondary full-width dialog button (beige) used under the navy primary. */
export function SoftButton({ children, onClick, tone = 'beige' }: { children: ReactNode; onClick?: () => void; tone?: 'beige' | 'red' | 'redText' }) {
  const tones = {
    beige: 'bg-parchment-200 text-ink-800',
    red: 'bg-danger-500 text-white',
    redText: 'bg-danger-100 text-danger-700',
  }
  return (
    <button onClick={onClick} className={cn('w-full rounded-full py-3 text-sm font-semibold transition active:scale-[0.98]', tones[tone])}>
      {children}
    </button>
  )
}

export function CheckRow({ checked, onChange, children }: { checked: boolean; onChange: (v: boolean) => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center gap-3 rounded-2xl border border-ink-100 bg-parchment-0 px-4 py-3.5 text-start shadow-[var(--shadow-soft-sm)]"
    >
      <span className={cn('flex h-5 w-5 shrink-0 items-center justify-center rounded-[5px] border-2', checked ? 'border-ink-900 bg-ink-900 text-parchment-0' : 'border-ink-300')}>
        {checked && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12l5 5L20 7" />
          </svg>
        )}
      </span>
      <span className="text-[11.5px] leading-snug text-ink-600">{children}</span>
    </button>
  )
}

/** Renders **bold** markup inside a translated string (words stay exactly as translated). */
export function Rich({ children }: { children: string }) {
  return (
    <>
      {children.split('**').map((part, i) => (i % 2 ? <b key={i} className="text-ink-900" style={{ fontWeight: 700 }}>{part}</b> : <span key={i}>{part}</span>))}
    </>
  )
}
