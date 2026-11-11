import { Outlet, useLocation } from 'react-router-dom'
import { Globe, Sun, Moon } from 'lucide-react'
import { useAppStore } from '@/store/app.store'
import { useLanguage, useEffectiveTheme } from '@/core/hooks/useLanguage'

/** Language + light/dark toggles pinned to the top corner (screens without their own header). */
export function QuickToggles() {
  const language = useAppStore((s) => s.language)
  const setLanguage = useAppStore((s) => s.setLanguage)
  const setThemeMode = useAppStore((s) => s.setThemeMode)
  const theme = useEffectiveTheme()
  const { t } = useLanguage()
  return (
    <div dir="ltr" className="fixed right-3 top-3 z-50 flex items-center gap-1 rounded-full border border-ink-100 bg-parchment-0/90 px-1.5 py-1 shadow-[var(--shadow-soft-sm)] backdrop-blur">
      <button onClick={() => setThemeMode(theme === 'dark' ? 'light' : 'dark')} className="rounded-full p-1.5 text-ink-700" aria-label={t('Toggle light/dark', 'تبديل الوضع الفاتح/الغامق')}>
        {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
      </button>
      <button onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')} className="rounded-full p-1.5 text-ink-700" aria-label={t('Switch language', 'تبديل اللغة')}>
        <Globe size={17} />
      </button>
    </div>
  )
}

const WITH_OWN_HEADER = [/^\/app\/(?!chat)/, /^\/registration-(submitted|checklist)/, /^\/safety-first/, /^\/contact-policy/, /^\/profile-ready/, /^\/profile-pending/, /^\/payment\/subscription/, /^\/phone-auth/, /^\/otp-verification/]

/** Root layout: adds QuickToggles on every route that has no header with its own toggles. Chat has them in its header. */
export function RootLayout() {
  const { pathname } = useLocation()
  const hasOwn = WITH_OWN_HEADER.some((r) => r.test(pathname)) || pathname.startsWith('/app/chat')
  return (
    <>
      {!hasOwn && <QuickToggles />}
      <Outlet />
    </>
  )
}
