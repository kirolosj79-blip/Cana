import { Link } from 'react-router-dom'
import { Bell, Globe, Church } from 'lucide-react'
import { useAppStore } from '@/store/app.store'
import { useNotificationsStore } from '@/store/notifications.store'
import { MusicControl } from '@/shared/components/ui/MusicControl'
import { useLanguage } from '@/core/hooks/useLanguage'

/** Figma header: bell on one side, serif "CANA" wordmark centred, globe on the other. */
export function FigmaHeader() {
  const language = useAppStore((s) => s.language)
  const setLanguage = useAppStore((s) => s.setLanguage)
  const unread = useNotificationsStore((s) => s.unreadCount())
  const { t } = useLanguage()
  return (
    <header className="sticky top-0 z-30 grid grid-cols-[1fr_auto_1fr] items-center border-b border-ink-100 bg-parchment-50/95 px-5 py-3.5 backdrop-blur">
      <div className="flex">
        <Link to="/app/notifications" className="relative rounded-full p-1.5 text-ink-900" aria-label={t('Notifications', 'الإشعارات')}>
          <Bell size={20} />
          {unread > 0 && <span className="absolute right-0.5 top-0.5 h-2 w-2 rounded-full bg-gold-500" />}
        </Link>
      </div>
      <h1 dir="ltr" className="flex items-center gap-1 font-display text-[27px] font-normal tracking-[0.14em] text-ink-900">
        CANA <Church size={15} className="mb-1 text-ink-900" />
      </h1>
      <div className="flex items-center justify-end gap-1">
        <MusicControl />
        <button onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')} className="rounded-full p-1.5 text-ink-900" aria-label={t('Switch language', 'تبديل اللغة')}>
          <Globe size={20} />
        </button>
      </div>
    </header>
  )
}
