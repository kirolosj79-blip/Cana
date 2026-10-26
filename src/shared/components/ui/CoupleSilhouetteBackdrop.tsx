import { motion } from 'framer-motion'

/**
 * Warm decorative background — simple line-art couple silhouettes drifting
 * down one at a time, continuously. Deliberately illustration-based rather
 * than real photography: embedding real photos of real people (even stock
 * photos) raises copyright and privacy issues, so this gives the same warm
 * "married couples" feeling through original, simple artwork instead.
 * Sits behind page content, very low opacity, non-distracting.
 */

function CoupleSilhouette({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 80" className={className} fill="none">
      {/* groom */}
      <circle cx="24" cy="14" r="7" fill="currentColor" />
      <path d="M11 52c0-11 6-20 13-20s13 9 13 20v6H11v-6z" fill="currentColor" />
      {/* bride */}
      <circle cx="42" cy="12" r="7" fill="currentColor" />
      <path d="M27 58c0-16 7-28 15-28s15 12 15 28v4H27v-4z" fill="currentColor" />
      {/* joined hands hint */}
      <path d="M30 48c2-3 5-3 6 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* small cross above */}
      <path d="M33 2v6M30.5 5h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

interface FallingItem {
  id: number
  left: number
  delay: number
  duration: number
  size: number
  rotate: number
}

const ITEMS: FallingItem[] = Array.from({ length: 7 }, (_, i) => ({
  id: i,
  left: 4 + i * 13.5 + (i % 2 === 0 ? 2 : -2),
  delay: i * 1.6,
  duration: 16 + (i % 3) * 4,
  size: 34 + (i % 3) * 14,
  rotate: i % 2 === 0 ? -6 : 6,
}))

export function CoupleSilhouetteBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {ITEMS.map((item) => (
        <motion.div
          key={item.id}
          className="absolute text-gold-300/25"
          style={{ left: `${item.left}%`, top: '-15%', width: item.size, rotate: item.rotate }}
          initial={{ y: '-15vh', opacity: 0 }}
          animate={{ y: '115vh', opacity: [0, 1, 1, 0] }}
          transition={{ duration: item.duration, delay: item.delay, repeat: Infinity, ease: 'linear' }}
        >
          <CoupleSilhouette className="w-full h-auto" />
        </motion.div>
      ))}
    </div>
  )
}
