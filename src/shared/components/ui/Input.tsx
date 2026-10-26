import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/shared/utils/cn'
import { useLanguage } from '@/core/hooks/useLanguage'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leftIcon?: React.ReactNode
  optional?: boolean
  labelExtra?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, leftIcon, id, optional, labelExtra, type, ...props }, ref) => {
    const { t } = useLanguage()
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    // Digit-based fields (dates, phone numbers, plain numbers) always read
    // left-to-right, even in an Arabic/RTL page — forcing this explicitly
    // is what keeps the native date-picker's day/month/year segments and
    // calendar icon from being reflowed/misplaced by the browser's RTL
    // handling, which is what caused the date field to render broken.
    const isDigitField = type === 'date' || type === 'tel' || type === 'number' || type === 'time'
    // Previously rendered a custom overlay placeholder for date fields
    // (since iOS Safari shows no native placeholder there) — but on
    // browsers that DO render their own native "mm/dd/yyyy" text, the two
    // overlapped and rendered as garbled, doubled-up text. A hint shown
    // below the field (never overlapping the input itself) solves the
    // original iOS problem without that risk on any other platform.
    const effectiveHint = hint ?? (type === 'date' ? t('Tap to select a date', 'اضغط تختار تاريخ') : undefined)
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-bold on-photo-text flex items-center justify-between">
            <span>{label}</span>
            <span className="flex items-center gap-2">
              {optional && <span className="text-xs font-normal field-hint">{t('Optional', 'اختياري')}</span>}
              {labelExtra}
            </span>
          </label>
        )}
        <div className="relative">
          {leftIcon && <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400">{leftIcon}</span>}
          <input
            id={inputId}
            ref={ref}
            type={type}
            dir={isDigitField ? 'ltr' : undefined}
            className={cn(
              'h-12 w-full min-w-0 rounded-[var(--radius-md)] border border-ink-200 bg-parchment-0 px-4 text-[16px] text-ink-900 placeholder:text-ink-400 transition-colors',
              'focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-200',
              isDigitField && 'text-left',
              // Hides the native up/down spinner arrows — on a scrollable
              // page, hovering one of these while scrolling lets the mouse
              // wheel silently change the number instead of scrolling the
              // page (a real, confirmed bug: a graduation year of 2013
              // became -13 this way). Combined with the onWheel blur
              // below, the value can no longer change via scroll at all.
              type === 'number' && '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
              leftIcon && 'pl-10',
              error && 'border-danger-500 focus:border-danger-500 focus:ring-danger-100',
              className
            )}
            {...props}
            onWheel={type === 'number' ? (e) => e.currentTarget.blur() : props.onWheel}
            onKeyDown={
              type === 'number'
                ? (e) => {
                    // Every number field in this app (age, weight, height,
                    // years, counts) is inherently non-negative — block the
                    // minus key outright rather than relying on error text
                    // after the fact, which still lets a bad value sit in
                    // the field until the person notices.
                    if (e.key === '-' || e.key === 'Subtract') e.preventDefault()
                    props.onKeyDown?.(e)
                  }
                : props.onKeyDown
            }
          />
        </div>
        {effectiveHint && !error && <span className="field-hint text-xs">{effectiveHint}</span>}
        {error && (
          <span className="inline-flex w-fit items-center rounded-[var(--radius-sm)] bg-danger-100 px-2 py-1 text-xs font-bold text-danger-700">
            {error}
          </span>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'
