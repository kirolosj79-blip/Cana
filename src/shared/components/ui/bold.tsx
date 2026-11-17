import type { ComponentType, ElementType, ReactNode } from 'react'
import { ChevronRight, ChevronLeft, Check } from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { useMe } from '@/core/hooks/useMe'

/** Navy hero banner: big icon, vertical divider, bold title + italic subtitle. */
export function BoldHero({ icon: Icon, title, subtitle }: { icon: ComponentType<{ size?: number; strokeWidth?: number }>; title: ReactNode; subtitle?: ReactNode }) {
  return (
    <div className="bp-hero flex items-center gap-3 p-3">
      <span className="bp-hero-icon flex h-11 w-11 shrink-0 items-center justify-center"><Icon size={22} strokeWidth={2} /></span>
      <span className="w-px self-stretch bg-white/25" />
      <div className="min-w-0">
        <h1 className="text-[14.5px] font-bold leading-snug">{title}</h1>
        {subtitle && <p className="bp-hero-sub mt-0.5 text-[10px] italic leading-snug">{subtitle}</p>}
      </div>
    </div>
  )
}

/** Light-blue (gold-tinted in dark) intro note with a big icon. */
export function BoldNote({ icon: Icon, children }: { icon: ComponentType<{ size?: number; strokeWidth?: number }>; children: ReactNode }) {
  return (
    <div className="bp-note flex items-center gap-3 p-3">
      <span className="bp-icon flex h-10 w-10 shrink-0 items-center justify-center"><Icon size={20} strokeWidth={2} /></span>
      <p className="text-[10.5px] font-medium leading-relaxed">{children}</p>
    </div>
  )
}

/** Centered navy pill title flanked by fading lines. */
export function BoldPill({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3 py-1">
      <span className="bp-line" />
      <span className="bp-pill px-4 py-1.5 text-[10px] font-bold uppercase">{children}</span>
      <span className="bp-line" />
    </div>
  )
}

/** Row card: big gradient icon at the start side (right in Arabic), divider, bold text. */
export function BoldRow({
  icon: Icon, num, danger, chevron, checked, onToggle, children,
}: { icon?: ComponentType<{ size?: number; strokeWidth?: number }>; num?: number; danger?: boolean; chevron?: boolean; checked?: boolean; onToggle?: (v: boolean) => void; children: ReactNode }) {
  const { isRtl } = useMe()
  const Chev = isRtl ? ChevronLeft : ChevronRight
  return (
    <div
      role={onToggle ? 'checkbox' : undefined}
      aria-checked={onToggle ? checked : undefined}
      tabIndex={onToggle ? 0 : undefined}
      onClick={onToggle ? () => onToggle(!checked) : undefined}
      className={cn('bp-row flex items-center gap-2.5 p-2.5', danger && 'is-danger', onToggle && 'cursor-pointer')}
    >
      {Icon && (
        <span className="bp-icon relative flex h-11 w-11 shrink-0 items-center justify-center">
          <Icon size={22} strokeWidth={2} />
          {num !== undefined && (
            <span className="bp-num absolute -top-1.5 -start-1.5 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold">{num}</span>
          )}
        </span>
      )}
      <span className="bp-divider" />
      <div className="bp-row-body min-w-0 flex-1 text-[10.5px] leading-relaxed">{children}</div>
      {onToggle && (
        <span className={cn('bp-chev flex h-6 w-6 shrink-0 items-center justify-center !rounded-[6px]', !checked && 'opacity-50')}>{checked ? <Check size={16} strokeWidth={3} /> : null}</span>
      )}
      {chevron && <span className="bp-chev flex h-6 w-6 shrink-0 items-center justify-center"><Chev size={14} /></span>}
    </div>
  )
}

export function BoldCTA({ children, onClick, disabled, icon: Icon }: { children: ReactNode; onClick: () => void; disabled?: boolean; icon?: ElementType }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} className="bp-cta flex min-h-12 w-full items-center justify-center gap-2.5 px-6 text-[12px]">
      {Icon && <Icon size={15} />}
      {children}
    </button>
  )
}
