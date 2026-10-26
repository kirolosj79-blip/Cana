import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Language } from '@/types/app.types'

export type ThemeMode = 'system' | 'light' | 'dark'

interface AppState {
  language: Language
  themeMode: ThemeMode
  setLanguage: (lang: Language) => void
  setThemeMode: (mode: ThemeMode) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      language: 'ar',
      themeMode: 'system',
      setLanguage: (language) => set({ language }),
      setThemeMode: (themeMode) => set({ themeMode }),
    }),
    { name: 'koinonia-app' }
  )
)
