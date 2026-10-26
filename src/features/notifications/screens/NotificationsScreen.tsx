import { useNavigate } from 'react-router-dom'
import { Heart, HeartHandshake, CheckCircle2, XCircle, ShieldCheck, CreditCard, MessageSquareText, Bell } from 'lucide-react'
import { TopBar } from '@/shared/components/layout/TopBar'
import { Button } from '@/shared/components/ui/Button'
import { EmptyState } from '@/shared/components/feedback/StateScreens'
import { useNotificationsStore } from '@/store/notifications.store'
import { useLanguage } from '@/core/hooks/useLanguage'
import { cn } from '@/shared/utils/cn'
import type { NotificationType } from '@/types/app.types'

const iconMap: Record<NotificationType, any> = {
  new_match: Heart,
  request_received: HeartHandshake,
  request_accepted: CheckCircle2,
  request_rejected: XCircle,
  verification_update: ShieldCheck,
  payment_update: CreditCard,
  system: Bell,
  message_unlocked: MessageSquareText,
}

function timeAgo(iso: string, t: (en: string, ar: string) => string) {
  const diff = Date.now() - new Date(iso).getTime()
  const hrs = Math.floor(diff / 3600000)
  if (hrs < 1) return t('Just now', 'دلوقتي')
  if (hrs < 24) return t(`${hrs}h ago`, `من ${hrs} ساعة`)
  return t(`${Math.floor(hrs / 24)}d ago`, `من ${Math.floor(hrs / 24)} يوم`)
}

export function NotificationsScreen() {
  const navigate = useNavigate()
  const { items, markRead, markAllRead } = useNotificationsStore()
  const { t } = useLanguage()

  return (
    <div>
      <TopBar showBack title={t('Notifications', 'الإشعارات')} />
      <div className="px-5 pt-2 pb-3 flex justify-end">
        <Button variant="link" size="sm" onClick={markAllRead}>
          {t('Mark all as read', 'علّم الكل كمقروء')}
        </Button>
      </div>
      <div className="px-5 pb-6">
        {items.length === 0 ? (
          <EmptyState icon={<Bell size={24} />} title={t("You're all caught up", 'مفيش جديد')} description={t('New notifications will appear here.', 'الإشعارات الجديدة هتظهر هنا.')} />
        ) : (
          <div className="space-y-1.5">
            {items.map((n) => {
              const Icon = iconMap[n.type]
              return (
                <button
                  key={n.id}
                  onClick={() => {
                    markRead(n.id)
                    if (n.target) navigate(n.target)
                    else if (n.relatedUserId) navigate(`/app/profile/${n.relatedUserId}`)
                  }}
                  className={cn('w-full flex items-start gap-3 rounded-[var(--radius-md)] px-3 py-3 text-left', !n.read && 'bg-gold-50')}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink-50 text-ink-600">
                    <Icon size={16} />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="flex items-center gap-2">
                      <span className={cn('text-sm font-medium', !n.read ? 'text-inkfixed-900' : 'text-ink-900')}>{n.title}</span>
                      {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-wine-600 shrink-0" />}
                    </span>
                    <span className={cn('block text-xs mt-0.5', !n.read ? 'text-inkfixed-900/70' : 'text-ink-500')}>{n.body}</span>
                    <span className={cn('block text-[11px] mt-1', !n.read ? 'text-inkfixed-900/50' : 'text-ink-400')}>{timeAgo(n.createdAt, t)}</span>
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
