import { cn } from '@/shared/utils/cn'

export function ProgressBar({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn('h-1.5 w-full overflow-hidden rounded-full bg-ink-100', className)}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-gold-400 to-gold-300 transition-all duration-500 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}
