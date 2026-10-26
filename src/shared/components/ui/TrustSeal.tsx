import { Check, Clock, X, FileWarning, ShieldCheck, Fingerprint, Church, HeartHandshake, Stethoscope, Crown } from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import type { VerificationStatus } from '@/types/profile.types'

/**
 * Signature element: a circular "wax seal" badge used everywhere trust and
 * verification is communicated — profile cards, badge grids, admin review,
 * document upload confirmations. Gold ring = verified, hollow ring = pending,
 * broken ring = rejected. Ties visually to the church-letter / seal-of-approval
 * concept that is the emotional core of the product.
 */

const ICONS = {
  identity: Fingerprint,
  church: Church,
  marriageEligibility: HeartHandshake,
  medical: Stethoscope,
  premium: Crown,
  generic: ShieldCheck,
} as const

type SealKind = keyof typeof ICONS

interface TrustSealProps {
  kind: SealKind
  status: VerificationStatus
  label: string
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

const sizeMap = {
  sm: { ring: 'h-8 w-8', icon: 12, text: 'text-[10px]' },
  md: { ring: 'h-11 w-11', icon: 16, text: 'text-xs' },
  lg: { ring: 'h-16 w-16', icon: 22, text: 'text-sm' },
}

const statusStyle: Record<VerificationStatus, { ring: string; bg: string; fg: string; overlay?: React.ReactNode }> = {
  verified: { ring: 'ring-2 ring-gold-400', bg: 'bg-gradient-to-br from-gold-100 to-gold-200', fg: 'text-gold-700' },
  pending: { ring: 'ring-2 ring-ink-200 border-dashed', bg: 'bg-ink-50', fg: 'text-ink-400' },
  not_started: { ring: 'ring-1 ring-ink-100', bg: 'bg-ink-50', fg: 'text-ink-300' },
  rejected: { ring: 'ring-2 ring-danger-500/40', bg: 'bg-danger-100', fg: 'text-danger-500' },
  needs_documents: { ring: 'ring-2 ring-warning-500/50', bg: 'bg-warning-100', fg: 'text-warning-500' },
}

const statusIcon: Record<VerificationStatus, React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>> = {
  verified: Check,
  pending: Clock,
  not_started: Clock,
  rejected: X,
  needs_documents: FileWarning,
}

export function TrustSeal({ kind, status, label, size = 'md', showLabel = true, className }: TrustSealProps) {
  const Icon = ICONS[kind]
  const StatusIcon = statusIcon[status]
  const s = sizeMap[size]
  const style = statusStyle[status]

  return (
    <div className={cn('flex flex-col items-center gap-1.5', className)}>
      <div className={cn('relative flex items-center justify-center rounded-full', s.ring, style.ring, style.bg)}>
        <Icon size={s.icon} className={style.fg} strokeWidth={2} />
        {status === 'verified' && (
          <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold-400 ring-2 ring-parchment-0">
            <StatusIcon size={9} className="text-inkfixed-950" strokeWidth={3} />
          </span>
        )}
        {status !== 'verified' && status !== 'not_started' && (
          <span className={cn('absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full ring-2 ring-parchment-0',
            status === 'rejected' ? 'bg-danger-500' : status === 'needs_documents' ? 'bg-warning-500' : 'bg-ink-300')}>
            <StatusIcon size={9} className="text-white" strokeWidth={3} />
          </span>
        )}
      </div>
      {showLabel && <span className={cn('font-medium text-center leading-tight', s.text, 'text-ink-600')}>{label}</span>}
    </div>
  )
}
