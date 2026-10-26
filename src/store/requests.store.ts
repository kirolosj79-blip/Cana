import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ConnectionRequest, RequestStatus } from '@/types/app.types'

/** An unanswered request expires after this many days. Once a request is
 *  accepted, the connection stays active — it does NOT auto-expire. (Earlier
 *  versions auto-expired accepted connections too, but that silently
 *  removed a member's WhatsApp access to someone they were genuinely
 *  connected with, which is confusing and not what anyone actually wants.
 *  Only unanswered *pending* requests time out.) */
const PENDING_EXPIRY_DAYS = 3

function daysAgo(n: number, hours = 0) {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000 - hours * 60 * 60 * 1000).toISOString()
}

interface RequestsState {
  requests: ConnectionRequest[]
  sendRequest: (toUserId: string) => void
  respond: (id: string, status: RequestStatus) => void
  cancel: (id: string) => void
  effectiveStatus: (r: ConnectionRequest) => RequestStatus
  hasPendingOutgoing: () => boolean
  hasPendingIncoming: () => boolean
  hasActiveConnection: () => boolean
  canSendNewRequest: () => boolean
  getStatusFor: (userId: string) => RequestStatus | 'none'
  /** The single request/connection representing the member's current state,
   *  or null if they're fully available. Powers the "one thing at a time"
   *  UI on the Requests screen. */
  getCurrentState: () => ConnectionRequest | null
  /** Most recently resolved (rejected/cancelled/expired) request, shown once
   *  as a brief notice and then not surfaced again. */
  getLastResolved: () => ConnectionRequest | null
}

const initial: ConnectionRequest[] = [
  // A ready-to-try incoming request so the connect → accept → WhatsApp flow
  // is visible immediately without needing to send one manually first.
  { id: 'r1', fromUserId: 'c2', toUserId: 'me', status: 'pending', createdAt: daysAgo(0, 4) },
  { id: 'r4', fromUserId: 'c6', toUserId: 'me', status: 'rejected', createdAt: daysAgo(10), respondedAt: daysAgo(9) },
]

export const useRequestsStore = create<RequestsState>()(
  persist(
    (set, get) => ({
      requests: initial,
      sendRequest: (toUserId) =>
        set((s) => ({
          requests: [
            ...s.requests,
            { id: `r${Date.now()}`, fromUserId: 'me', toUserId, status: 'pending', createdAt: new Date().toISOString() },
          ],
        })),
      respond: (id, status) =>
        set((s) => ({
          requests: s.requests.map((r) => (r.id === id ? { ...r, status, respondedAt: new Date().toISOString() } : r)),
        })),
      cancel: (id) =>
        set((s) => ({ requests: s.requests.map((r) => (r.id === id ? { ...r, status: 'cancelled' as RequestStatus } : r)) })),

      effectiveStatus: (r) => {
        if (r.status === 'pending') {
          const ageMs = Date.now() - new Date(r.createdAt).getTime()
          return ageMs > PENDING_EXPIRY_DAYS * 24 * 60 * 60 * 1000 ? 'expired' : 'pending'
        }
        return r.status
      },

      hasPendingOutgoing: () => {
        const { requests, effectiveStatus } = get()
        return requests.some((r) => r.fromUserId === 'me' && effectiveStatus(r) === 'pending')
      },
      hasPendingIncoming: () => {
        const { requests, effectiveStatus } = get()
        return requests.some((r) => r.toUserId === 'me' && effectiveStatus(r) === 'pending')
      },
      hasActiveConnection: () => {
        const { requests } = get()
        return requests.some((r) => (r.fromUserId === 'me' || r.toUserId === 'me') && r.status === 'accepted')
      },
      canSendNewRequest: () => {
        const s = get()
        return !s.hasPendingOutgoing() && !s.hasPendingIncoming() && !s.hasActiveConnection()
      },

      getStatusFor: (userId) => {
        const { requests, effectiveStatus } = get()
        const r = requests.find((r) => r.fromUserId === userId || r.toUserId === userId)
        return r ? effectiveStatus(r) : 'none'
      },

      getCurrentState: () => {
        const { requests, effectiveStatus } = get()
        const mine = requests.filter((r) => r.fromUserId === 'me' || r.toUserId === 'me')
        return (
          mine.find((r) => r.status === 'accepted') ??
          mine.find((r) => effectiveStatus(r) === 'pending') ??
          null
        )
      },

      getLastResolved: () => {
        const { requests, effectiveStatus } = get()
        const mine = requests.filter((r) => r.fromUserId === 'me' || r.toUserId === 'me')
        const resolved = mine.filter((r) => ['rejected', 'cancelled', 'expired'].includes(effectiveStatus(r)))
        if (resolved.length === 0) return null
        return resolved.sort((a, b) => new Date(b.respondedAt ?? b.createdAt).getTime() - new Date(a.respondedAt ?? a.createdAt).getTime())[0]
      },
    }),
    { name: 'koinonia-requests' }
  )
)
