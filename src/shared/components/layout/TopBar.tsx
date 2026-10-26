import { Link, useNavigate } from 'react-router-dom'
import { Bell, Globe, ChevronLeft, Sun, Moon } from 'lucide-react'
import { useAppStore } from '@/store/app.store'
import { useNotificationsStore } from '@/store/notifications.store'
import { useLanguage, useEffectiveTheme } from '@/core/hooks/useLanguage'
import { cn } from '@/shared/utils/cn'
import { MusicControl } from '@/shared/components/ui/MusicControl'
import { AnimatedLogo } from '@/shared/components/ui/AnimatedLogo'

interface TopBarProps {
  title?: string
  showBack?: boolean
  showLogo?: boolean
  transparent?: boolean
  /** Hides the notification bell — for pre-account screens (phone entry,
   *  OTP) where showing a notification count makes no sense since the
   *  person doesn't have an account yet. */
  hideNotifications?: boolean
}

export function TopBar({ title, showBack, showLogo, transparent, hideNotifications }: TopBarProps) {
  const language = useAppStore((s) => s.language)
  const setLanguage = useAppStore((s) => s.setLanguage)
  const setThemeMode = useAppStore((s) => s.setThemeMode)
  const effectiveTheme = useEffectiveTheme()
  const unread = useNotificationsStore((s) => s.unreadCount())
  const navigate = useNavigate()
  const { isRtl, t } = useLanguage()

  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex items-center justify-between px-5 py-4',
        transparent ? 'bg-transparent' : 'bg-parchment-50/90 backdrop-blur-lg border-b border-ink-100'
      )}
    >
      <div className="flex items-center gap-2">
        {showBack && (
          <button onClick={() => navigate(-1)} className="rounded-full p-1.5 -ms-1.5 text-ink-700 hover:bg-ink-100">
            <ChevronLeft size={22} className={isRtl ? 'rotate-180' : ''} />
          </button>
        )}
        {showLogo && (
          <Link to="/app/home" className="flex items-center gap-2">
            <AnimatedLogo size={32} />
            <span className="font-display text-lg font-medium text-ink-900">Cana</span>
          </Link>
        )}
        {title && <h1 className="font-display text-lg font-medium text-ink-900">{title}</h1>}
      </div>
      <div className="flex items-center gap-1.5">
        <MusicControl />
        <button
          onClick={() => setThemeMode(effectiveTheme === 'dark' ? 'light' : 'dark')}
          className="flex items-center justify-center rounded-full p-2 text-ink-600 hover:bg-ink-100"
          aria-label={t('Toggle light/dark', 'تبديل الوضع الفاتح/الغامق')}
        >
          {effectiveTheme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>
        <button
          onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
          className="flex items-center justify-center h-9 w-9 rounded-full text-ink-600 hover:bg-ink-100"
          aria-label={t('Switch language', 'تبديل اللغة')}
        >
          <Globe size={18} />
        </button>
        {!hideNotifications && (
          <Link to="/app/notifications" className="relative rounded-full p-2 text-ink-700 hover:bg-ink-100">
            <Bell size={20} />
            {unread > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-wine-600 text-[9px] font-bold text-white">
                {unread}
              </span>
            )}
          </Link>
        )}
      </div>
    </header>
  )
}
