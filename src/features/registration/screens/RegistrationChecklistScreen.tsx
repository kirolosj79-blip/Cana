import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Circle, ChevronRight } from 'lucide-react'
import { TopBar } from '@/shared/components/layout/TopBar'
import { ProgressBar } from '@/shared/components/ui/Progress'
import { REGISTRATION_STEPS, useRegistrationStore } from '@/store/registration.store'
import { useLanguage } from '@/core/hooks/useLanguage'
import { cn } from '@/shared/utils/cn'
import { HeartsBackdrop } from '@/shared/components/ui/HeartsBackdrop'

/**
 * All 13 registration items in one place, each with a real route (jumps
 * straight into that step of the wizard) and a persisted completion state
 * (backed by `registration.store`'s `completedSteps`, which survives a
 * refresh since the store is persisted to localStorage).
 */
export function RegistrationChecklistScreen() {
  const navigate = useNavigate()
  const { completedSteps, setStep } = useRegistrationStore()
  const { language, t } = useLanguage()

  const doneCount = REGISTRATION_STEPS.filter((s) => completedSteps.includes(s.key)).length
  const progress = (doneCount / REGISTRATION_STEPS.length) * 100

  const openStep = (index: number) => {
    setStep(index)
    navigate('/registration')
  }

  return (
    <div>
      <HeartsBackdrop />
      <TopBar showBack title={t('Registration Checklist', 'قائمة التسجيل')} />
      <div className="px-5 pt-2 pb-8 space-y-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-ink-800">
              {doneCount} / {REGISTRATION_STEPS.length} {t('completed', 'مكتملة')}
            </span>
            <span className="text-gold-600 font-medium">{Math.round(progress)}%</span>
          </div>
          <ProgressBar value={progress} />
        </div>

        <div className="space-y-2">
          {REGISTRATION_STEPS.map((step, index) => {
            const done = completedSteps.includes(step.key)
            return (
              <button
                key={step.key}
                onClick={() => openStep(index)}
                className={cn(
                  'w-full flex items-center gap-3 rounded-[var(--radius-md)] border px-4 py-3.5 text-left transition-colors',
                  done ? 'border-success-500/30 bg-success-100' : 'border-ink-100 bg-parchment-0 hover:border-gold-300'
                )}
              >
                {done ? (
                  <CheckCircle2 size={20} className="text-success-500 shrink-0" />
                ) : (
                  <Circle size={20} className="text-ink-300 shrink-0" />
                )}
                <span className="flex-1 min-w-0">
                  <span className={cn('block text-sm font-medium', done ? 'text-success-500' : 'text-ink-800')}>
                    {index + 1}. {language === 'ar' ? step.labelAr : step.labelEn}
                  </span>
                </span>
                <ChevronRight size={16} className={cn('shrink-0', language === 'ar' && 'rotate-180', done ? 'text-success-500' : 'text-ink-300')} />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
