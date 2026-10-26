import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Complaint, ComplaintCategory } from '@/types/app.types'

interface ComplaintsState {
  complaints: Complaint[]
  submit: (category: ComplaintCategory, description: string, againstUserId?: string, screenshotUploaded?: boolean) => void
}

export const useComplaintsStore = create<ComplaintsState>()(
  persist(
    (set) => ({
      complaints: [
        { id: 'cp1', category: 'other', description: 'التطبيق قفل وانا برفع خطاب الكنيسة.', status: 'resolved', createdAt: '2026-07-15T10:00:00Z' },
      ],
      submit: (category, description, againstUserId, screenshotUploaded) =>
        set((s) => ({
          complaints: [
            { id: `cp${Date.now()}`, category, description, againstUserId, screenshotUploaded, status: 'submitted', createdAt: new Date().toISOString() },
            ...s.complaints,
          ],
        })),
    }),
    { name: 'koinonia-complaints' }
  )
)
