import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/shared/utils/cn'
import { BrandMark } from '@/shared/components/ui/BrandMark'

interface AnimatedLogoProps {
  size?: number
  className?: string
}

/**
 * The brand mark (arch + cross), now with a permanent, gentle floating
 * motion — like a balloon drifting slowly, not bouncing. Runs continuously
 * and infinitely for as long as the component is mounted. Respects
 * prefers-reduced-motion by simply not animating.
 */
export function AnimatedLogo({ size = 32, className }: AnimatedLogoProps) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.span
      className={cn('flex items-center justify-center rounded-full bg-ink-900 text-gold-300', className)}
      style={{ width: size, height: size }}
      animate={
        reduceMotion
          ? undefined
          : {
              y: [0, -5, 0, 3, 0],
              rotate: [0, -2, 0, 2, 0],
            }
      }
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <BrandMark size={size * 0.56} />
    </motion.span>
  )
}
