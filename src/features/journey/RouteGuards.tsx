import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useJourneyStore } from '@/store/journey.store'
import { useAdminReviewStore } from '@/store/adminReview.store'
import { usePaymentStore } from '@/store/payment.store'

/** True once the admin approved the profile AND the membership payment is done. */
export function useIsFullyApproved() {
  const profileApproved = useAdminReviewStore((s) => s.overallStatus() === 'approved')
  const paid = usePaymentStore((s) => s.isPaidMember)
  return profileApproved && paid
}

/** Pre-approval pages (Congratulations, Safety, Contact Policy): never shown again after the welcome. */
export function PreApprovalOnly({ children }: { children: ReactNode }) {
  const seen = useJourneyStore((s) => s.approvalSeen)
  return seen ? <Navigate to="/app/home" replace /> : <>{children}</>
}

/** "Your profile is ready" welcome: only once, only after approval + payment. */
export function ApprovalWelcomeOnly({ children }: { children: ReactNode }) {
  const seen = useJourneyStore((s) => s.approvalSeen)
  const approved = useIsFullyApproved()
  return seen || !approved ? <Navigate to="/app/home" replace /> : <>{children}</>
}
