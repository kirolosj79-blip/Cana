import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { PaymentRequest, PaymentMethod, PaymentRequestStatus } from '@/types/app.types'
import { useNotificationsStore } from '@/store/notifications.store'
import { usePaymentStore } from '@/store/payment.store'
import { useAuthStore } from '@/store/auth.store'

interface PaymentRequestsState {
  requests: PaymentRequest[]
  submit: (method: PaymentMethod) => string
  approve: (id: string, note?: string) => void
  reject: (id: string, note?: string) => void
  getLatest: () => PaymentRequest | null
  pendingCount: () => number
}

export const usePaymentRequestsStore = create<PaymentRequestsState>()(
  persist(
    (set, get) => ({
      requests: [],
      submit: (method) => {
        const id = `pr${Date.now()}`
        set((s) => ({
          requests: [
            { id, method, screenshotUploaded: true, status: 'pending_review', submittedAt: new Date().toISOString() },
            ...s.requests,
          ],
        }))
        // Register the phone as "known" as soon as a payment is submitted
        // (not only once approved) — otherwise a returning member whose
        // payment is still pending_review would be treated as brand new on
        // their next OTP login and sent back into registration, instead of
        // landing on the tracking screen where they belong.
        const phone = useAuthStore.getState().user?.phone
        if (phone) useAuthStore.getState().registerKnownPhone(phone)
        // Stand-in for "notify the responsible admin" — this prototype has no
        // separate admin session, so the Payment Review screen's own pending
        // badge is the real signal; this notification also confirms receipt
        // to the member who submitted it.
        useNotificationsStore.getState().push({
          type: 'payment_update',
          title: 'Payment submitted for review',
          body: `Your ${method === 'paypal' ? 'PayPal' : 'InstaPay'} payment proof was submitted and is pending review.`,
          target: '/payment/subscription',
        })
        return id
      },
      approve: (id, note) => {
        set((s) => ({
          requests: s.requests.map((r) => (r.id === id ? { ...r, status: 'approved' as PaymentRequestStatus, reviewedAt: new Date().toISOString(), reviewNote: note } : r)),
        }))
        usePaymentStore.getState().setStatus('success')
        const phone = useAuthStore.getState().user?.phone
        if (phone) useAuthStore.getState().registerKnownPhone(phone)
        useNotificationsStore.getState().push({
          type: 'payment_update',
          title: 'Payment approved',
          body: 'Your payment was approved — your membership is now active.',
          target: '/app/home',
        })
      },
      reject: (id, note) => {
        set((s) => ({
          requests: s.requests.map((r) => (r.id === id ? { ...r, status: 'rejected' as PaymentRequestStatus, reviewedAt: new Date().toISOString(), reviewNote: note } : r)),
        }))
        usePaymentStore.getState().setStatus('failed')
        useNotificationsStore.getState().push({
          type: 'payment_update',
          title: 'Payment needs another look',
          body: note || "We couldn't verify this payment — please resubmit with a clearer screenshot.",
          target: '/payment/subscription',
        })
      },
      getLatest: () => {
        const { requests } = get()
        return requests.length ? requests[0] : null
      },
      pendingCount: () => get().requests.filter((r) => r.status === 'pending_review').length,
    }),
    { name: 'cana-payment-requests' }
  )
)
