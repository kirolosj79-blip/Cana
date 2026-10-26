import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useRegistrationStore } from '@/store/registration.store'
import { useNotificationsStore } from '@/store/notifications.store'

type SensitiveSection = 'personal' | 'church' | 'eligibility' | 'health'

export interface PendingChange {
  id: string
  fieldLabel: string
  section: SensitiveSection
  patch: Record<string, unknown>
  oldSummary: string
  newSummary: string
  submittedAt: string
}

interface PendingChangesState {
  changes: PendingChange[]
  submit: (change: Omit<PendingChange, 'id' | 'submittedAt'>) => void
  approve: (id: string) => void
  reject: (id: string, reason?: string) => void
}

export const usePendingChangesStore = create<PendingChangesState>()(
  persist(
    (set, get) => ({
      changes: [],
      submit: (change) =>
        set((s) => ({
          changes: [...s.changes, { ...change, id: `pc${Date.now()}`, submittedAt: new Date().toISOString() }],
        })),
      approve: (id) => {
        const change = get().changes.find((c) => c.id === id)
        if (!change) return
        useRegistrationStore.getState().updateSection(change.section as any, change.patch as any)
        set((s) => ({ changes: s.changes.filter((c) => c.id !== id) }))
        useNotificationsStore.getState().push({
          type: 'verification_update',
          title: 'Profile change approved',
          body: `Your update to ${change.fieldLabel} is now live on your profile.`,
          target: '/app/profile',
        })
      },
      reject: (id, reason) => {
        const change = get().changes.find((c) => c.id === id)
        if (!change) return
        set((s) => ({ changes: s.changes.filter((c) => c.id !== id) }))
        useNotificationsStore.getState().push({
          type: 'verification_update',
          title: 'Profile change needs revisiting',
          body: reason ?? `Your update to ${change.fieldLabel} wasn't approved. Your previous verified information stays visible.`,
          target: '/app/profile/edit',
        })
      },
    }),
    { name: 'koinonia-pending-changes' }
  )
)
