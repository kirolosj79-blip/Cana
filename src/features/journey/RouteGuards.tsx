import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useJourneyStore } from '@/store/journey.store'
import { useAdminReviewStore } from '@/store/adminReview.store'

/** True once the profile is approved (the prototype treats new profiles as approved from the start). */
export function useIsFullyApproved() {
  const profileApproved = useAdminReviewStore((s) => s.overallStatus() === 'approved')
  return profileApproved
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
