import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthUser } from '@/types/app.types'

interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  verifiedPhone: boolean
  verifiedPhoneNumber: string | null
  /** Phones that have completed a full registration before — lets OTP verification
   *  route a returning member straight to the app instead of registration. There's
   *  no real backend here, so this list is the prototype's stand-in for "this
   *  number already has an account." */
  knownPhones: string[]
  loginWithPhone: (phone: string, opts?: { authId?: string; isOnboarded?: boolean }) => void
  completeOnboarding: () => void
  logout: () => void
  markPhoneVerified: (phone: string) => void
  registerKnownPhone: (phone: string) => void
  isKnownPhone: (phone: string) => boolean
  setEmail: (email: string) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      verifiedPhone: false,
      verifiedPhoneNumber: null,
      knownPhones: [],
      loginWithPhone: (phone, opts) =>
        set((s) => ({
          user: { id: 'me', authId: opts?.authId, phone, email: s.user?.email, isOnboarded: opts?.isOnboarded ?? get().isKnownPhone(phone) },
          isAuthenticated: true,
        })),
      completeOnboarding: () =>
        set((s) => ({ user: s.user ? { ...s.user, isOnboarded: true } : s.user })),
      logout: () => set({ user: null, isAuthenticated: false }),
      markPhoneVerified: (phone) => set({ verifiedPhone: true, verifiedPhoneNumber: phone }),
      registerKnownPhone: (phone) => set((s) => ({ knownPhones: s.knownPhones.includes(phone) ? s.knownPhones : [...s.knownPhones, phone] })),
      isKnownPhone: (phone) => get().knownPhones.includes(phone),
      setEmail: (email) => set((s) => ({ user: s.user ? { ...s.user, email } : s.user })),
    }),
    { name: 'koinonia-auth' }
  )
)
