import { motion } from 'framer-motion'

/**
 * A permanent, continuous ambient backdrop of drifting hearts — loops
 * forever for as long as any page is mounted. Rendered globally from
 * AppShell/PageContainer so it's present on every screen, not just one.
 * Opacity is theme-reactive (brighter in dark mode specifically) via CSS
 * variables, since the same fixed opacity reads much dimmer against a
 * dark navy background than a light cream one.
 */

function HeartShape({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 22" className={className} fill="currentColor">
      <path d="M12 21.3C5.4 16.6 1 12.7 1 8.3 1 4.8 3.7 2 7.1 2c2 0 3.9 1 5 2.6C13.1 3 15 2 17 2c3.3 0 6 2.8 6 6.3 0 4.4-4.4 8.3-11 13z" />
    </svg>
  )
}

interface FloatingHeart {
  id: number
  left: number
  delay: number
  duration: number
  size: number
  sway: number
  tone: 'gold' | 'wine'
}

const HEARTS: FloatingHeart[] = Array.from({ length: 9 }, (_, i) => ({
  id: i,
  left: 4 + i * 11 + (i % 2 === 0 ? 3 : -3),
  delay: i * 1.7,
  duration: 13 + (i % 3) * 5,
  size: 14 + (i % 3) * 10,
  sway: 18 + (i % 2) * 12,
  tone: i % 2 === 0 ? 'gold' : 'wine',
}))

export function HeartsBackdrop({ className }: { className?: string }) {
  return (
    <div className={`pointer-events-none fixed inset-0 overflow-hidden z-0 ${className ?? ''}`} aria-hidden="true">
      {HEARTS.map((h) => (
        <motion.div
          key={h.id}
          className="absolute"
          style={{ left: `${h.left}%`, top: '-8%', width: h.size }}
          initial={{ y: '-8vh', opacity: 0, x: 0, scale: 0.8, rotate: -6 }}
          animate={{
            y: '112vh',
            opacity: [0, 1, 1, 0],
            x: [0, h.sway, -h.sway, 0],
            scale: [0.8, 1.1, 0.9, 1],
            rotate: [-6, 6, -4, 6],
          }}
          transition={{ duration: h.duration, delay: h.delay, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className={h.tone === 'gold' ? 'text-gold-400' : 'text-wine-400'} style={{ opacity: `var(--heart-opacity-${h.tone})` }}>
            <HeartShape className="w-full h-auto" />
          </div>
        </motion.div>
      ))}
    </div>
  )
}
