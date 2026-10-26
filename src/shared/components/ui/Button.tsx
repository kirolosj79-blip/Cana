import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 text-center rounded-[var(--radius-full)] font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        primary: 'bg-ink-900 text-parchment-0 hover:bg-ink-800 shadow-[var(--shadow-soft-sm)]',
        gold: 'bg-cta-bg text-cta-text hover:opacity-90 shadow-[var(--shadow-gold-glow)]',
        wine: 'bg-wine-600 text-parchment-0 hover:bg-wine-700',
        outline: 'border border-ink-200 text-ink-800 bg-transparent hover:bg-ink-50',
        ghost: 'text-ink-700 hover:bg-ink-50',
        subtle: 'bg-ink-50 text-ink-800 hover:bg-ink-100',
        danger: 'bg-danger-500 text-white hover:bg-danger-500/90',
        link: 'text-ink-700 underline-offset-4 hover:underline p-0 h-auto rounded-none whitespace-nowrap',
      },
      size: {
        sm: 'min-h-9 px-4 py-1.5 text-sm',
        md: 'min-h-11 px-6 py-2 text-sm',
        lg: 'min-h-13 px-8 py-2.5 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
)

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, disabled, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} disabled={disabled || loading} {...props}>
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  )
)
Button.displayName = 'Button'
