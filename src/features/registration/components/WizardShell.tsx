import { useEffect, useRef, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Save, Globe, Sun, Moon } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { ProgressBar } from '@/shared/components/ui/Progress'
import { PageContainer } from '@/shared/components/layout/PageContainer'
import { REGISTRATION_STEPS, useRegistrationStore } from '@/store/registration.store'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage, useEffectiveTheme } from '@/core/hooks/useLanguage'
import { useAppStore } from '@/store/app.store'

interface WizardShellProps {
  children: ReactNode
  onNext: () => void
  onBack?: () => void
  nextLabel?: string
  nextDisabled?: boolean
  hideFooter?: boolean
}

export function WizardShell({ children, onNext, onBack, nextLabel, nextDisabled, hideFooter }: WizardShellProps) {
  const navigate = useNavigate()
  const { currentStepIndex, prevStep, setStep, editReturnIndex, clearEditReturn, lastSavedAt, draft } = useRegistrationStore()
  const { language, isRtl, t } = useLanguage()
  const setLanguage = useAppStore((s) => s.setLanguage)
  const setThemeMode = useAppStore((s) => s.setThemeMode)
  const effectiveTheme = useEffectiveTheme()
  const step = REGISTRATION_STEPS[currentStepIndex]
  const progress = ((currentStepIndex + 1) / REGISTRATION_STEPS.length) * 100
  const BackIcon = isRtl ? ChevronRight : ChevronLeft
  const scrollRef = useRef<HTMLDivElement>(null)

  // Every step change (Continue, Back, or an edit-jump) should land the
  // member at the top of the new page, not wherever they'd scrolled to on
  // the previous one — this scrolls the actual scrollable content area
  // (not the window; with `fullHeight` on PageContainer this element is
  // genuinely the scroll container now, not just a plain div inside a
  // page that scrolls at the window level instead).
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'auto' })
    window.scrollTo(0, 0)
  }, [currentStepIndex])

  const handleBack = () => {
    if (onBack) return onBack()
    if (editReturnIndex !== null) {
      setStep(editReturnIndex)
      clearEditReturn()
      return
    }
    if (currentStepIndex === 0) return navigate(-1)
    prevStep()
  }

  return (
    <PageContainer noPadding className="pb-0" fullHeight photoBackground hideHearts>
      <div className="px-5 pt-4 pb-5 sticky top-0 z-20">
        <div className="flex items-center justify-between mb-3 gap-2">
          <button onClick={handleBack} className="shrink-0 rounded-full p-1.5 -ms-1.5 text-white hover:bg-white/10">
            <BackIcon size={22} />
          </button>
          <div className="flex items-center gap-2 min-w-0">
            {lastSavedAt && (
              <span className="hidden sm:flex text-xs font-medium text-white/70 items-center gap-1.5 whitespace-nowrap shrink-0">
                <Save size={12} /> {t('Progress saved', 'تم حفظ تقدمك')}
              </span>
            )}
            <button
              onClick={() => setThemeMode(effectiveTheme === 'dark' ? 'light' : 'dark')}
              className="shrink-0 flex items-center justify-center rounded-full p-1.5 text-white bg-white/15 hover:bg-white/25"
              aria-label={t('Toggle light/dark', 'تبديل الوضع الفاتح/الغامق')}
            >
              {effectiveTheme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            </button>
            <button
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              className="shrink-0 flex items-center justify-center h-7 w-7 rounded-full text-white bg-white/15 hover:bg-white/25"
              aria-label={t('Switch language', 'تبديل اللغة')}
            >
              <Globe size={15} />
            </button>
          </div>
        </div>
        <ProgressBar value={progress} className="bg-white/25" />
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-white/70">
            {t(`Step ${currentStepIndex + 1} of ${REGISTRATION_STEPS.length}`, `خطوة ${currentStepIndex + 1} من ${REGISTRATION_STEPS.length}`)}
          </span>
        </div>
        <h1 className="font-display text-2xl font-semibold text-white mt-2 drop-shadow-sm">{language === 'ar' ? step.labelAr : step.labelEn}</h1>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 pt-5 pb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step.key}
            initial={{ opacity: 0, x: isRtl ? -16 : 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isRtl ? 16 : -16 }}
            transition={{ duration: 0.25 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>

      {!hideFooter && (
        <div className="sticky bottom-0 px-5 pt-4 bg-parchment-50/95 backdrop-blur-lg border-t border-ink-100/70 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <Button variant="gold" size="lg" className="w-full" onClick={onNext} disabled={nextDisabled}>
            {nextLabel ?? t('Continue', draft.gender === 'female' ? 'كمّلي' : 'كمّل')}
          </Button>
        </div>
      )}
    </PageContainer>
  )
}
