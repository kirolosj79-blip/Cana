import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { BottomNav } from './BottomNav'
import { WelcomeBackGate } from '@/shared/components/feedback/WelcomeBackGate'
import { HeartsBackdrop } from '@/shared/components/ui/HeartsBackdrop'

export function AppShell() {
  const { pathname } = useLocation()

  // Every navigation between app screens (Home → Discover → Profile, etc.)
  // should land at the top of the new page, not wherever the previous
  // screen happened to be scrolled to.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="min-h-screen bg-parchment-50">
      <HeartsBackdrop />
      <div className="mx-auto max-w-md min-h-screen bg-transparent pb-24 relative z-10">
        <Outlet />
      </div>
      <WelcomeBackGate />
      <BottomNav />
    </div>
  )
}
