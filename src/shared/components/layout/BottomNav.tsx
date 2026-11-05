import { NavLink } from 'react-router-dom'
import { Home, Compass, Heart, MessageCircle, User } from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { useLanguage } from '@/core/hooks/useLanguage'

const items = [
  { to: '/app/home', icon: Home, en: 'Home', ar: 'الرئيسية' },
  { to: '/app/discover', icon: Compass, en: 'Discover', ar: 'اكتشف' },
  { to: '/app/connections', icon: Heart, en: 'Connections', ar: 'ارتباطاتك' },
  { to: '/app/messages', icon: MessageCircle, en: 'Messages', ar: 'الرسائل' },
  { to: '/app/profile', icon: User, en: 'Profile', ar: 'ملفي' },
]

export function BottomNav({ disabled = false }: { disabled?: boolean }) {
  const { t } = useLanguage()
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-ink-100 bg-parchment-0/90 backdrop-blur-lg pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex max-w-md items-stretch justify-between px-2">
        {items.map((item) =>
          disabled ? (
            <div key={item.to} aria-disabled className="flex flex-1 cursor-not-allowed flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-ink-300 opacity-70">
              <item.icon size={22} strokeWidth={1.8} />
              {t(item.en, item.ar)}
            </div>
          ) : (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors',
                isActive ? 'text-ink-900' : 'text-ink-400'
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={22} strokeWidth={isActive ? 2.4 : 1.8} className={isActive ? 'text-gold-500' : ''} />
                {t(item.en, item.ar)}
              </>
            )}
          </NavLink>
          )
        )}
      </div>
    </nav>
  )
}
