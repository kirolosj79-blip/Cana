import { useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import { supabase } from '@/services/supabase'

export function RequireAuth() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const logout = useAuthStore((s) => s.logout)
  const authId = useAuthStore((s) => s.user?.authId)

  // With Supabase on, the real session is the source of truth: if it has
  // expired or been revoked, drop the local "signed in" flag too.
  useEffect(() => {
    if (!supabase || !authId) return
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) logout()
    })
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') logout()
    })
    return () => sub.subscription.unsubscribe()
  }, [logout, authId])

  if (!isAuthenticated) return <Navigate to="/welcome" replace />
  return <Outlet />
}
