import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getMockCandidates } from '@/services/mock/candidates.mock'
import { getRankedMatches } from '@/services/matching/compatibility'

interface MatchesState {
  savedIds: string[]
  passedIds: string[]
  dailyPick: string | null
  toggleSave: (id: string) => void
  pass: (id: string) => void
  pickDaily: (id: string) => void
  isSaved: (id: string) => boolean
}

export const useMatchesStore = create<MatchesState>()(
  persist(
    (set, get) => ({
      savedIds: [],
      passedIds: [],
      dailyPick: null,
      toggleSave: (id) =>
        set((s) => ({ savedIds: s.savedIds.includes(id) ? s.savedIds.filter((x) => x !== id) : [...s.savedIds, id] })),
      pass: (id) => set((s) => ({ passedIds: [...s.passedIds, id] })),
      pickDaily: (id) => set({ dailyPick: id }),
      isSaved: (id) => get().savedIds.includes(id),
    }),
    { name: 'koinonia-matches' }
  )
)

/**
 * Matching runs mandatory filters (gender, age range, country, church
 * verification, profile verification) then ranks survivors by a weighted
 * compatibility score built from optional factors (children, marriage
 * history, education, smoking, alcohol, financial stability). See
 * services/matching/compatibility.ts for the full engine.
 */
export const getDailyMatches = () => getRankedMatches(getMockCandidates()).slice(0, 3)
export const getDiscoverList = () => getRankedMatches(getMockCandidates())
