import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion, type Variants } from 'framer-motion'
import { createPortal } from 'react-dom'
import { Save, ArrowRight } from 'lucide-react'

interface EncouragementActions {
  onContinue: () => void
  onSaveAndExit: () => void
  continueLabel: string
  saveExitLabel: string
}

interface EncouragementContextValue {
  showEncouragement: (message: string, actions: EncouragementActions) => void
}

const EncouragementContext = createContext<EncouragementContextValue | null>(null)

/** A handful of distinct entrance/exit styles — cycled through in order so
 *  two consecutive registration steps never play the exact same motion.
 *  Deliberately no `scale` transforms on any of these — only opacity and
 *  position shift — so the card always appears at one consistent size and
 *  never reads as the page "zooming" in or out. */
const VARIANTS: Variants[] = [
  { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0, transition: { type: 'spring', damping: 16, stiffness: 260 } }, exit: { opacity: 0, y: -16 } },
  { initial: { opacity: 0, y: 60 }, animate: { opacity: 1, y: 0, transition: { type: 'spring', damping: 14, stiffness: 200 } }, exit: { opacity: 0, y: -30 } },
  { initial: { opacity: 0, x: -50 }, animate: { opacity: 1, x: 0, transition: { type: 'spring', damping: 15, stiffness: 220 } }, exit: { opacity: 0, x: 40 } },
  { initial: { opacity: 0, y: -30 }, animate: { opacity: 1, y: 0, transition: { type: 'spring', damping: 16, stiffness: 240 } }, exit: { opacity: 0, y: 20 } },
  { initial: { opacity: 0, x: 50 }, animate: { opacity: 1, x: 0, transition: { type: 'spring', damping: 15, stiffness: 220 } }, exit: { opacity: 0, x: -40 } },
]

const EMOJI_SETS = ['❤️', '🎉', '✨', '👏', '🥳', '💪', '🌟']

interface EncouragementState {
  message: string
  key: number
  variant: Variants
  emoji: string
  actions: EncouragementActions
}

/**
 * Shown after finishing a page, before moving to the next one — a real
 * confirmation with two explicit actions ("Save & Exit" / "Continue"),
 * not a toast that quietly auto-advances or vanishes on its own. The
 * member decides what happens next; nothing proceeds until they tap one.
 */
export function EncouragementProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<EncouragementState | null>(null)
  const counter = useRef(0)

  const showEncouragement = useCallback((msg: string, actions: EncouragementActions) => {
    const i = counter.current
    counter.current += 1
    setState({ message: msg, key: i, variant: VARIANTS[i % VARIANTS.length], emoji: EMOJI_SETS[i % EMOJI_SETS.length], actions })
  }, [])

  const handleContinue = () => {
    state?.actions.onContinue()
    setState(null)
  }
  const handleSaveExit = () => {
    state?.actions.onSaveAndExit()
    setState(null)
  }

  return (
    <EncouragementContext.Provider value={{ showEncouragement }}>
      {children}
      {typeof document !== 'undefined' &&
        createPortal(
          <div
            className={`fixed inset-0 z-[190] flex items-center justify-center px-8 transition-colors ${state ? 'bg-ink-950/50 backdrop-blur-sm pointer-events-auto' : 'pointer-events-none'}`}
            style={{ perspective: 800 }}
          >
            <AnimatePresence>
              {state && (
                <motion.div
                  key={state.key}
                  variants={state.variant}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="flex flex-col items-center gap-4 rounded-[var(--r-lg)] bg-parchment-0 px-8 py-7 shadow-[var(--shadow-soft-lg)] text-center max-w-xs w-full"
                >
                  <motion.span
                    className="text-5xl"
                    animate={{ rotate: [0, -8, 8, 0] }}
                    transition={{ duration: 0.9, repeat: 1, ease: 'easeInOut' }}
                  >
                    {state.emoji}
                  </motion.span>
                  <p className="font-display text-2xl font-medium text-emphasis-text leading-snug">{state.message}</p>

                  <div className="w-full flex flex-col gap-2.5 pt-2">
                    <button
                      onClick={handleContinue}
                      className="w-full flex items-center justify-center gap-2 rounded-[var(--radius-full)] bg-emphasis-text text-parchment-50 font-medium text-sm py-3 transition-opacity hover:opacity-90"
                    >
                      {state.actions.continueLabel} <ArrowRight size={16} />
                    </button>
                    <button
                      onClick={handleSaveExit}
                      className="w-full flex items-center justify-center gap-2 rounded-[var(--radius-full)] border border-emphasis-text/30 text-emphasis-text font-medium text-sm py-3 hover:bg-emphasis-text/5"
                    >
                      <Save size={15} /> {state.actions.saveExitLabel}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>,
          document.body
        )}
    </EncouragementContext.Provider>
  )
}

export function useEncouragement() {
  const ctx = useContext(EncouragementContext)
  if (!ctx) throw new Error('useEncouragement must be used within EncouragementProvider')
  return ctx
}
