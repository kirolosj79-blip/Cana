import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, XCircle, Info } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

type ToastVariant = 'success' | 'error' | 'info'
interface ToastItem {
  id: number
  message: string
  variant: ToastVariant
}

const ToastContext = createContext<{ show: (message: string, variant?: ToastVariant) => void } | null>(null)

const icons: Record<ToastVariant, ReactNode> = {
  success: <CheckCircle2 size={18} className="text-success-500" />,
  error: <XCircle size={18} className="text-danger-500" />,
  info: <Info size={18} className="text-info-500" />,
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const show = useCallback((message: string, variant: ToastVariant = 'success') => {
    const id = Date.now()
    setToasts((t) => [...t, { id, message, variant }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200)
  }, [])

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="fixed bottom-24 left-1/2 z-[100] flex -translate-x-1/2 flex-col gap-2 sm:bottom-6">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={cn(
                'flex items-center gap-2.5 rounded-full bg-ink-900 px-4 py-3 text-sm text-parchment-0 shadow-[var(--shadow-soft-lg)] min-w-[240px] justify-center'
              )}
            >
              {icons[t.variant]}
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
