import { cn } from '@/shared/utils/cn'
import { useLanguage } from '@/core/hooks/useLanguage'

interface YesNoToggleProps {
  value: boolean | undefined
  onChange: (value: boolean) => void
  label?: string
  yesLabel?: string
  noLabel?: string
  labelExtra?: React.ReactNode
}

export function YesNoToggle({ value, onChange, label, yesLabel, noLabel, labelExtra }: YesNoToggleProps) {
  const { t } = useLanguage()
  return (
    <div className="flex flex-col gap-2">
      {(label || labelExtra) && (
        <div className="flex items-center justify-between">
          {label && <span className="text-sm font-bold on-photo-text">{label}</span>}
          {labelExtra}
        </div>
      )}
      <div className="inline-flex w-fit rounded-full border border-ink-200 p-1 bg-parchment-0 shadow-[var(--shadow-soft-sm)]">
        {[
          { v: true, l: yesLabel ?? t('Yes', 'أيوه') },
          { v: false, l: noLabel ?? t('No', 'لأ') },
        ].map((opt) => (
          <button
            key={String(opt.v)}
            type="button"
            onClick={() => onChange(opt.v)}
            className={cn(
              'rounded-full px-5 py-1.5 text-sm font-medium transition-colors',
              value === opt.v ? 'bg-ink-900 text-parchment-0 shadow-sm' : 'text-emphasis-text font-bold hover:opacity-80'
            )}
          >
            {opt.l}
          </button>
        ))}
      </div>
    </div>
  )
}

export function Switch({ checked, onChange, id }: { checked: boolean; onChange: (v: boolean) => void; id?: string }) {
  return (
    <button
      id={id}
      type="button"
      dir="ltr"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative h-7 w-12 shrink-0 rounded-full transition-colors',
        checked ? 'bg-gold-400' : 'bg-ink-200'
      )}
    >
      <span
        className={cn(
          'absolute left-0 top-1 h-5 w-5 rounded-full bg-white shadow transition-transform',
          checked ? 'translate-x-6' : 'translate-x-1'
        )}
      />
    </button>
  )
}
