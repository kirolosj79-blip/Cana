import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { createPortal } from 'react-dom'

type CelebrationKind = 'hearts' | 'sparkle' | 'confetti' | 'laugh'

const EMOJI_SETS: Record<CelebrationKind, string[]> = {
  hearts: ['❤️', '💕', '💛', '💖'],
  sparkle: ['✨', '🌟', '💫', '⭐'],
  confetti: ['🎉', '🎊', '✨', '❤️'],
  laugh: ['😄', '😂', '🥳', '✨'],
}

interface CelebrationContextValue {
  celebrate: (kind?: CelebrationKind) => void
}

const CelebrationContext = createContext<CelebrationContextValue | null>(null)

interface Particle {
  id: number
  emoji: string
  left: number
  delay: number
  duration: number
  size: number
  drift: number
}

/**
 * A short, joyful burst of floating hearts/emoji — not a real image asset
 * (nothing licensed to source), but genuine animated feedback rather than a
 * static/no-op button. Kept brief (~1.6s) and only fired on clearly positive
 * moments so it stays delightful instead of noisy.
 */
export function CelebrationProvider({ children }: { children: ReactNode }) {
  const [particles, setParticles] = useState<Particle[]>([])

  const celebrate = useCallback((kind: CelebrationKind = 'hearts') => {
    const set = EMOJI_SETS[kind]
    const batch: Particle[] = Array.from({ length: 14 }, (_, i) => ({
      id: Date.now() + i,
      emoji: set[Math.floor(Math.random() * set.length)],
      left: 8 + Math.random() * 84,
      delay: Math.random() * 0.5,
      duration: 2.2 + Math.random() * 1.1,
      size: 18 + Math.random() * 18,
      drift: (Math.random() - 0.5) * 60,
    }))
    setParticles(batch)
    setTimeout(() => setParticles([]), 4000)
  }, [])

  return (
    <CelebrationContext.Provider value={{ celebrate }}>
      {children}
      {typeof document !== 'undefined' &&
        createPortal(
          <div className="pointer-events-none fixed inset-0 z-[200] overflow-hidden">
            <AnimatePresence>
              {particles.map((p) => (
                <motion.span
                  key={p.id}
                  initial={{ opacity: 0, y: '-4vh', x: 0, scale: 0.5, rotate: 0 }}
                  animate={{ opacity: [0, 1, 1, 0], y: '32vh', x: p.drift, scale: 1, rotate: p.drift }}
                  transition={{ duration: p.duration, delay: p.delay, ease: 'easeInOut' }}
                  style={{ position: 'absolute', left: `${p.left}%`, fontSize: p.size, top: 0 }}
                >
                  {p.emoji}
                </motion.span>
              ))}
            </AnimatePresence>
          </div>,
          document.body
        )}
    </CelebrationContext.Provider>
  )
}

export function useCelebration() {
  const ctx = useContext(CelebrationContext)
  if (!ctx) throw new Error('useCelebration must be used within CelebrationProvider')
  return ctx
}
