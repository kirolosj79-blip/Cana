import type { HTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/shared/utils/cn'

const badgeVariants = cva('inline-flex items-center gap-1 rounded-full font-medium', {
  variants: {
    variant: {
      neutral: 'bg-ink-50 text-ink-700',
      gold: 'bg-gold-100 text-gold-700',
      success: 'bg-success-100 text-success-500',
      warning: 'bg-warning-100 text-warning-500',
      danger: 'bg-danger-100 text-danger-500',
      info: 'bg-info-100 text-info-500',
      wine: 'bg-wine-100 text-wine-700',
      outline: 'border border-ink-200 text-ink-600',
    },
    size: {
      sm: 'text-[11px] px-2 py-0.5',
      md: 'text-xs px-2.5 py-1',
    },
  },
  defaultVariants: { variant: 'neutral', size: 'sm' },
})

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, size }), className)} {...props} />
}
