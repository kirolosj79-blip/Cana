import { forwardRef, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/shared/utils/cn'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-ink-700">
            {label}
          </label>
        )}
        <textarea
          id={inputId}
          ref={ref}
          rows={3}
          className={cn(
            'w-full rounded-[var(--r-md)] border border-ink-200 bg-parchment-0 px-4 py-3 text-[16px] text-ink-900 placeholder:text-ink-400 transition-colors resize-none',
            'focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-200',
            error && 'border-danger-500 focus:border-danger-500 focus:ring-danger-100',
            className
          )}
          {...props}
        />
        {hint && !error && <span className="text-xs text-ink-400">{hint}</span>}
        {error && <span className="text-xs text-danger-500">{error}</span>}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'
