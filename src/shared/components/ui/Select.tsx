import { forwardRef, type SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  placeholder?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, placeholder, id, children, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-bold on-photo-text">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={inputId}
            ref={ref}
            className={cn(
              'h-12 w-full appearance-none rounded-[var(--radius-md)] border border-ink-200 bg-parchment-0 px-4 pr-10 text-[16px] text-ink-900 transition-colors',
              'focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-200',
              error && 'border-danger-500',
              className
            )}
            {...props}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {children}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
        </div>
        {error && <span className="text-xs text-danger-500">{error}</span>}
      </div>
    )
  }
)
Select.displayName = 'Select'
