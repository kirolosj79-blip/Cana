import { cn } from '@/shared/utils/cn'

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-[var(--radius-md)] bg-ink-100', className)} />
}

export function CandidateCardSkeleton() {
  return (
    <div className="rounded-[var(--radius-lg)] border border-ink-100 bg-parchment-0 p-4 shadow-[var(--shadow-soft-sm)]">
      <div className="flex gap-4">
        <Skeleton className="h-20 w-20 rounded-2xl shrink-0" />
        <div className="flex-1 space-y-2 py-1">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
    </div>
  )
}

export function ProfileHeaderSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-64 w-full rounded-none" />
      <div className="px-5 space-y-3">
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
        <div className="flex gap-2">
          <Skeleton className="h-16 w-16 rounded-full" />
          <Skeleton className="h-16 w-16 rounded-full" />
          <Skeleton className="h-16 w-16 rounded-full" />
        </div>
      </div>
    </div>
  )
}
