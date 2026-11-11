import { Link } from 'react-router-dom'
import { Bell, Globe, Church, Sun, Moon } from 'lucide-react'
import { useAppStore } from '@/store/app.store'
import { useNotificationsStore } from '@/store/notifications.store'
import { MusicControl } from '@/shared/components/ui/MusicControl'
import { useLanguage, useEffectiveTheme } from '@/core/hooks/useLanguage'

/** Figma header: bell on one side, serif "CANA" wordmark centred, globe on the other. */
export function FigmaHeader() {
  const language = useAppStore((s) => s.language)
  const setLanguage = useAppStore((s) => s.setLanguage)
  const unread = useNotificationsStore((s) => s.unreadCount())
  const setThemeMode = useAppStore((s) => s.setThemeMode)
  const theme = useEffectiveTheme()
  const { t } = useLanguage()
  return (
    <header className="sticky top-0 z-30 grid grid-cols-[1fr_auto_1fr] items-center border-b border-ink-100 bg-parchment-50/95 px-4 py-3 backdrop-blur">
      <div className="flex">
        <Link to="/app/notifications" className="relative rounded-full p-1.5 text-ink-900" aria-label={t('Notifications', 'الإشعارات')}>
          <Bell size={20} />
          {unread > 0 && <span className="absolute right-0.5 top-0.5 h-2 w-2 rounded-full bg-gold-500" />}
        </Link>
      </div>
      <h1 dir="ltr" className="flex items-center gap-1 font-display text-[24px] font-normal tracking-[0.1em] text-ink-900">
        CANA <Church size={13} className="mb-1 text-ink-900" />
      </h1>
      <div className="flex items-center justify-end gap-0">
        <MusicControl />
        <button onClick={() => setThemeMode(theme === 'dark' ? 'light' : 'dark')} className="rounded-full p-1 text-ink-900" aria-label={t('Toggle light/dark', 'تبديل الوضع الفاتح/الغامق')}>
          {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
        </button>
        <button onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')} className="rounded-full p-1 text-ink-900" aria-label={t('Switch language', 'تبديل اللغة')}>
          <Globe size={20} />
        </button>
      </div>
    </header>
  )
}
