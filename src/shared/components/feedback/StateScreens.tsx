import type { ReactNode } from 'react'
import { WifiOff, AlertTriangle, Inbox } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'

interface StateScreenProps {
  icon?: ReactNode
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}

function StateScreen({ icon, title, description, actionLabel, onAction }: StateScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 px-8 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-ink-50 text-ink-400">{icon}</div>
      <div className="space-y-1.5">
        <h3 className="font-display text-lg font-medium text-ink-900">{title}</h3>
        {description && <p className="text-sm text-ink-500 max-w-xs">{description}</p>}
      </div>
      {actionLabel && onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

export function EmptyState(props: Omit<StateScreenProps, 'icon'> & { icon?: ReactNode }) {
  return <StateScreen icon={props.icon ?? <Inbox size={26} />} {...props} />
}

export function ErrorScreen(props: Omit<StateScreenProps, 'icon'>) {
  return <StateScreen icon={<AlertTriangle size={26} className="text-danger-500" />} {...props} />
}

export function OfflineScreen(props: Omit<StateScreenProps, 'icon' | 'title'> & { title?: string }) {
  return (
    <StateScreen
      icon={<WifiOff size={26} />}
      title={props.title ?? "You're offline"}
      description={props.description ?? 'Check your connection and try again.'}
      actionLabel={props.actionLabel ?? 'Retry'}
      onAction={props.onAction}
    />
  )
}
