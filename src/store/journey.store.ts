import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface ChatMessage {
  id: string
  from: 'me' | 'them'
  text: string
  at: string
}

interface JourneyState {
  /** The member has seen the "Congratulations / Awaiting verification" step. */
  submittedSeen: boolean
  safetyAccepted: boolean
  /** The member has seen the post-approval "profile is ready" welcome — never shown the pre-approval pages again. */
  approvalSeen: boolean
  setApprovalSeen: () => void
  contactPolicyAccepted: boolean
  /** Chat guidelines are accepted once per introduction. */
  guidelinesAcceptedFor: string[]
  messages: Record<string, ChatMessage[]>
  /** Intro ids where the member confirmed they are ready to continue outside CANA. */
  readyOutside: string[]
  /** Intro ids that are complete (contact details exchanged). */
  completed: string[]
  blocked: string[]
  reports: { userId: string; reason: string; note: string; at: string }[]
  /** Which intro still needs the "Previous Introduction Feedback" form. */
  lastActiveAt: string | null
  touch: () => void
  feedbackOwed: boolean
  /** Account state shown by the 5 Figma status screens. */
  accountStatus: 'active' | 'suspended' | 'closed'
  reactivate: () => void
  feedbackAnswers: Record<string, string>
  setSubmittedSeen: () => void
  acceptSafety: () => void
  acceptContactPolicy: () => void
  acceptGuidelines: (id: string) => void
  send: (id: string, from: 'me' | 'them', text: string) => void
  markReadyOutside: (id: string) => void
  unmarkReadyOutside: (id: string) => void
  complete: (id: string) => void
  block: (id: string) => void
  report: (userId: string, reason: string, note: string) => void
  oweFeedback: () => void
  saveFeedback: (answers: Record<string, string>) => void
}

const mk = (from: 'me' | 'them', text: string): ChatMessage => ({ id: `${Date.now()}-${Math.random()}`, from, text, at: new Date().toISOString() })

export const useJourneyStore = create<JourneyState>()(
  persist(
    (set) => ({
      submittedSeen: false,
      safetyAccepted: false,
      approvalSeen: false,
      setApprovalSeen: () => set({ approvalSeen: true }),
      contactPolicyAccepted: false,
      guidelinesAcceptedFor: [],
      messages: {},
      readyOutside: [],
      completed: [],
      blocked: [],
      reports: [],
      lastActiveAt: null,
      touch: () => set({ lastActiveAt: new Date().toISOString() }),
      feedbackOwed: false,
      accountStatus: 'active',
      reactivate: () => set({ accountStatus: 'active' }),
      feedbackAnswers: {},
      setSubmittedSeen: () => set({ submittedSeen: true }),
      acceptSafety: () => set({ safetyAccepted: true }),
      acceptContactPolicy: () => set({ contactPolicyAccepted: true }),
      acceptGuidelines: (id) => set((s) => ({ guidelinesAcceptedFor: [...new Set([...s.guidelinesAcceptedFor, id])] })),
      send: (id, from, text) => set((s) => ({ messages: { ...s.messages, [id]: [...(s.messages[id] ?? []), mk(from, text)] } })),
      markReadyOutside: (id) => set((s) => ({ readyOutside: [...new Set([...s.readyOutside, id])] })),
      unmarkReadyOutside: (id) => set((s) => ({ readyOutside: s.readyOutside.filter((x) => x !== id) })),
      complete: (id) => set((s) => ({ completed: [...new Set([...s.completed, id])], accountStatus: 'closed' })),
      block: (id) => set((s) => ({ blocked: [...new Set([...s.blocked, id])], feedbackOwed: true })),
      report: (userId, reason, note) => set((s) => ({ reports: [...s.reports, { userId, reason, note, at: new Date().toISOString() }] })),
      oweFeedback: () => set({ feedbackOwed: true }),
      saveFeedback: (answers) => set({ feedbackAnswers: answers, feedbackOwed: false, accountStatus: 'active' }),
    }),
    { name: 'cana-journey' }
  )
)

/** Where the post-registration journey should send the member next. */
export function nextJourneyStep(): string {
  const j = useJourneyStore.getState()
  if (j.approvalSeen) return '/app/home'
  if (!j.submittedSeen) return '/registration-submitted'
  if (!j.safetyAccepted) return '/safety-first'
  if (!j.contactPolicyAccepted) return '/contact-policy'
  return '/app/home'
}
