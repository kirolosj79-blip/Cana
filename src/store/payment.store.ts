import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { PaymentStatus } from '@/types/app.types'

interface PaymentState {
  selectedPlanId: string | null
  status: PaymentStatus
  lastAttemptAt: string | null
  /** Payment is charged once; this flags an active, already-paid membership so we never prompt to pay twice. */
  isPaidMember: boolean
  paidAt: string | null
  selectPlan: (id: string) => void
  setStatus: (status: PaymentStatus) => void
}

export const usePaymentStore = create<PaymentState>()(
  persist(
    (set) => ({
      selectedPlanId: null,
      status: 'idle',
      lastAttemptAt: null,
      isPaidMember: false,
      paidAt: null,
      selectPlan: (id) => set({ selectedPlanId: id }),
      setStatus: (status) =>
        set({
          status,
          lastAttemptAt: new Date().toISOString(),
          ...(status === 'success' ? { isPaidMember: true, paidAt: new Date().toISOString() } : {}),
        }),
    }),
    { name: 'koinonia-payment' }
  )
)
