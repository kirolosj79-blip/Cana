export type Language = 'en' | 'ar'

export interface AuthUser {
  id: string
  /** Real Supabase auth user id (set once signed in through Supabase). */
  authId?: string
  email?: string
  phone: string
  isOnboarded: boolean
}

export type RequestStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'expired'

export interface ConnectionRequest {
  id: string
  fromUserId: string
  toUserId: string
  status: RequestStatus
  createdAt: string
  respondedAt?: string
}

export type NotificationType =
  | 'new_match'
  | 'request_received'
  | 'request_accepted'
  | 'request_rejected'
  | 'verification_update'
  | 'payment_update'
  | 'system'
  | 'message_unlocked'

export interface AppNotification {
  id: string
  type: NotificationType
  title: string
  body: string
  createdAt: string
  read: boolean
  relatedUserId?: string
  /** Explicit route to open on click; falls back to type-based defaults when omitted. */
  target?: string
}

export type PaymentStatus = 'idle' | 'processing' | 'success' | 'failed' | 'resumable'

export type PaymentMethod = 'paypal' | 'instapay'
export type PaymentRequestStatus = 'pending_review' | 'approved' | 'rejected'

export interface PaymentRequest {
  id: string
  method: PaymentMethod
  screenshotUploaded: boolean
  status: PaymentRequestStatus
  submittedAt: string
  reviewedAt?: string
  reviewNote?: string
}

export interface PaymentPlan {
  id: string
  name: string
  priceUSD: number
  priceEGP: number
  billingPeriod: 'one_time' | 'monthly' | 'yearly'
  features: string[]
  highlighted?: boolean
}

export type AdminReviewState = 'waiting_review' | 'approved' | 'rejected' | 'needs_more_documents'

export interface AdminReview {
  section: string
  state: AdminReviewState
  note?: string
  updatedAt: string
}

export type ComplaintCategory =
  | 'fake_profile'
  | 'inappropriate_behavior'
  | 'harassment'
  | 'offensive_language'
  | 'false_information'
  | 'suspicious_activity'
  | 'other'

export type ComplaintStatus = 'submitted' | 'in_review' | 'resolved'

export interface Complaint {
  id: string
  category: ComplaintCategory
  againstUserId?: string
  description: string
  screenshotUploaded?: boolean
  status: ComplaintStatus
  createdAt: string
}
