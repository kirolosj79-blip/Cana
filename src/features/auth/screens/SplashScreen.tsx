import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useLanguage } from '@/core/hooks/useLanguage'

import { useAuthStore } from '@/store/auth.store'

export function SplashScreen() {
  const navigate = useNavigate()
  const { isRtl } = useLanguage()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  useEffect(() => {
    // A returning member who's already signed in shouldn't have to click
    // back through onboarding/language/phone-login every time they open
    // the app — straight into the app, same as any normal "stay logged in"
    // session.
    const timer = setTimeout(() => navigate(isAuthenticated ? '/app/home' : '/onboarding', { replace: true }), 1800)
    return () => clearTimeout(timer)
  }, [navigate, isAuthenticated])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center" style={{ backgroundColor: '#0C1D3A', color: '#FFFDF9' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center gap-6"
      >
        <motion.svg initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }} width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="#C9A24A" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
          <path d="M10 56V30C10 17 19.5 8 32 8s22 9 22 22v26" />
          <path d="M32 24v24M22 36h20" />
        </motion.svg>
        <div className="text-center" dir="ltr">
          <h1 className="font-display text-[40px] font-normal tracking-[0.18em]">CANA</h1>
          <p className="mt-3 text-[13px] leading-relaxed" style={{ color: '#C9A24A' }}>
            {isRtl ? (
              <>حيث يلتقي الإيمان والثقافة<br />والحب.</>
            ) : (
              <>Where faith, culture<br />&amp; love connect.</>
            )}
          </p>
        </div>
      </motion.div>
    </div>
  )
}
