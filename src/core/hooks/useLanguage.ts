import { useEffect, useState } from 'react'
import { useAppStore } from '@/store/app.store'

/** Resolves 'system' theme mode against the OS preference, live. */
export function useEffectiveTheme() {
  const themeMode = useAppStore((s) => s.themeMode)
  const [systemDark, setSystemDark] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
  )

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => setSystemDark(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return themeMode === 'system' ? (systemDark ? 'dark' : 'light') : themeMode
}

export function useLanguageSync() {
  const language = useAppStore((s) => s.language)
  const effectiveTheme = useEffectiveTheme()

  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
  }, [language])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', effectiveTheme === 'dark')
  }, [effectiveTheme])
}

export function useLanguage() {
  const language = useAppStore((s) => s.language)
  const setLanguage = useAppStore((s) => s.setLanguage)
  const t = (en: string, ar: string) => (language === 'ar' ? ar : en)
  return { language, setLanguage, t, isRtl: language === 'ar' }
}
