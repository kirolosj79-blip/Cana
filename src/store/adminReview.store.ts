import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AdminReview, AdminReviewState } from '@/types/app.types'

interface AdminReviewStoreState {
  reviews: AdminReview[]
  resetForNewSubmission: () => void
  setSectionState: (section: string, state: AdminReviewState, note?: string) => void
  overallStatus: () => 'pending' | 'needs_action' | 'approved'
}

const sectionNames = ['Identity Verification', 'Church & Faith Verification', 'Marriage Eligibility', 'Medical Verification']

const freshReviews = (): AdminReview[] =>
  sectionNames.map((section) => ({ section, state: 'approved' as AdminReviewState, updatedAt: new Date().toISOString() }))

export const useAdminReviewStore = create<AdminReviewStoreState>()(
  persist(
    (set, get) => ({
      reviews: freshReviews(),
      resetForNewSubmission: () => set({ reviews: freshReviews() }),
      setSectionState: (section, state, note) =>
        set((s) => ({
          reviews: s.reviews.map((r) => (r.section === section ? { ...r, state, note, updatedAt: new Date().toISOString() } : r)),
        })),
      overallStatus: () => {
        const { reviews } = get()
        if (reviews.some((r) => r.state === 'needs_more_documents' || r.state === 'rejected')) return 'needs_action'
        if (reviews.every((r) => r.state === 'approved')) return 'approved'
        return 'pending'
      },
    }),
    { name: 'koinonia-admin-review' }
  )
)
