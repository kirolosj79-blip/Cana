import { Check } from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { useLanguage } from '@/core/hooks/useLanguage'

export interface ChoiceOption {
  value: string
  label: string
  description?: string
}

interface ChoiceGroupProps {
  options: ChoiceOption[]
  value: string | string[]
  onChange: (value: any) => void
  multi?: boolean
  maxSelections?: number
  label?: string
  hint?: string
  columns?: 1 | 2 | 3 | 4
  labelExtra?: React.ReactNode
}

export function ChoiceGroup({ options, value, onChange, multi = false, maxSelections, label, hint, columns = 1, labelExtra }: ChoiceGroupProps) {
  const { t } = useLanguage()
  const selected = Array.isArray(value) ? value : value ? [value] : []
  const hasDescriptions = options.some((o) => o.description)
  const compact = columns >= 3 && !hasDescriptions

  const handleClick = (val: string) => {
    if (multi) {
      const isSelected = selected.includes(val)
      if (isSelected) {
        onChange(selected.filter((v) => v !== val))
      } else {
        if (maxSelections && selected.length >= maxSelections) return
        onChange([...selected, val])
      }
    } else {
      onChange(val)
    }
  }

  return (
    <div className="flex flex-col gap-2 min-w-0">
      {(label || labelExtra) && (
        <div className="flex items-center justify-between">
          {label && <span className="text-sm font-bold on-photo-text">{label}</span>}
          {labelExtra}
        </div>
      )}
      <div className={cn('grid gap-2.5 min-w-0', columns === 1 && 'grid-cols-1', columns === 2 && 'grid-cols-2', columns === 3 && 'grid-cols-3', columns === 4 && 'grid-cols-4')}>
        {options.map((opt) => {
          const isSelected = selected.includes(opt.value)

          if (compact) {
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleClick(opt.value)}
                style={isSelected ? { borderColor: 'var(--color-selected-border)', backgroundColor: 'var(--color-selected-bg)', color: 'var(--color-selected-text)' } : undefined}
                className={cn(
                  'flex items-center justify-center min-w-0 w-full rounded-[var(--radius-md)] border px-2 py-3 text-center text-sm font-medium leading-snug transition-all break-words',
                  isSelected ? 'shadow-[var(--shadow-soft-sm)]' : 'border-ink-200 bg-parchment-0 text-ink-700 hover:border-ink-300 hover:bg-ink-50'
                )}
              >
                {opt.label}
              </button>
            )
          }

          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleClick(opt.value)}
              style={isSelected ? { borderColor: 'var(--color-selected-border)', backgroundColor: 'var(--color-selected-bg)', color: 'var(--color-selected-text)' } : undefined}
              className={cn(
                'flex items-center gap-3 min-w-0 rounded-[var(--radius-md)] border px-4 py-3 text-left text-sm transition-all',
                isSelected ? 'shadow-[var(--shadow-soft-sm)]' : 'border-ink-200 bg-parchment-0 text-ink-700 hover:border-ink-300 hover:bg-ink-50'
              )}
            >
              <span
                className={cn('flex h-5 w-5 shrink-0 items-center justify-center border transition-colors', multi ? 'rounded-[6px]' : 'rounded-full')}
                style={
                  isSelected
                    ? { borderColor: 'var(--color-selected-icon-bg)', backgroundColor: 'var(--color-selected-icon-bg)' }
                    : undefined
                }
              >
                {isSelected && <Check size={12} strokeWidth={3} style={{ color: 'var(--color-selected-icon-text)' }} />}
              </span>
              <span className="flex-1 min-w-0">
                <span className="block font-medium leading-tight break-words">{opt.label}</span>
                {opt.description && (
                  <span className={cn('block text-xs mt-0.5 break-words', !isSelected && 'text-ink-500')} style={isSelected ? { color: 'var(--color-selected-text)', opacity: 0.75 } : undefined}>
                    {opt.description}
                  </span>
                )}
              </span>
            </button>
          )
        })}
      </div>
      {hint && <span className="field-hint text-xs">{hint}</span>}
      {maxSelections && multi && (
        <span className="text-xs text-ink-400">
          {selected.length}/{maxSelections} {t('selected', 'متاختار')}
        </span>
      )}
    </div>
  )
}
