import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface MusicPrefState {
  enabled: boolean
  volume: number // 0..1
  setEnabled: (v: boolean) => void
  setVolume: (v: number) => void
}

export const useMusicPrefStore = create<MusicPrefState>()(
  persist(
    (set) => ({
      enabled: true, // plays automatically from the moment the site opens
      volume: 0.35,
      setEnabled: (enabled) => set({ enabled }),
      setVolume: (volume) => set({ volume }),
    }),
    { name: 'cana-music-pref' }
  )
)
