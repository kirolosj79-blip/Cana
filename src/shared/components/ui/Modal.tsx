import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { createPortal } from 'react-dom'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  footer?: ReactNode
}

export function Modal({ open, onClose, title, children, footer }: ModalProps) {
  if (typeof document === 'undefined') return null
  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-ink-950/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="relative z-10 w-full max-w-md rounded-t-[var(--radius-xl)] sm:rounded-[var(--radius-xl)] bg-parchment-0 p-6 shadow-[var(--shadow-soft-lg)] max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              {title && <h3 className="font-display text-lg font-medium text-ink-900">{title}</h3>}
              <button onClick={onClose} className="ml-auto rounded-full p-1.5 text-ink-400 hover:bg-ink-50 hover:text-ink-600">
                <X size={18} />
              </button>
            </div>
            {children}
            {footer && <div className="mt-5 flex gap-3">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}
