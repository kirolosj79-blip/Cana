import { useNavigate } from 'react-router-dom'
import { WizardShell } from '@/features/registration/components/WizardShell'
import { REGISTRATION_STEPS, useRegistrationStore } from '@/store/registration.store'
import { useLanguage } from '@/core/hooks/useLanguage'
import { useCelebration } from '@/shared/components/feedback/Celebration'
import { useEncouragement } from '@/shared/components/feedback/EncouragementOverlay'
import { useToast } from '@/shared/components/feedback/Toast'
import { getEncouragement } from '@/core/constants/encouragement'
import { isStepValid } from '@/features/registration/utils/stepValidation'

import { PersonalInfoStep } from '@/features/registration/steps/PersonalInfoStep'
import { ChurchStep } from '@/features/registration/steps/ChurchStep'
import { EligibilityStep } from '@/features/registration/steps/EligibilityStep'
import { FamilyStep } from '@/features/registration/steps/FamilyStep'
import { EducationStep } from '@/features/registration/steps/EducationStep'
import { EmploymentStep } from '@/features/registration/steps/EmploymentStep'
import { LifestyleStep } from '@/features/registration/steps/LifestyleStep'
import { GettingToKnowYouStep } from '@/features/registration/steps/GettingToKnowYouStep'
import { GenderSpecificStep } from '@/features/registration/steps/GenderSpecificStep'
import { CompatibilityStep } from '@/features/registration/steps/CompatibilityStep'
import { SafetyStep } from '@/features/registration/steps/SafetyStep'
import { HealthStep } from '@/features/registration/steps/HealthStep'
import { ReviewStep } from '@/features/registration/steps/ReviewStep'

const stepComponents: Record<string, React.ComponentType> = {
  personal: PersonalInfoStep,
  church: ChurchStep,
  eligibility: EligibilityStep,
  family: FamilyStep,
  education: EducationStep,
  employment: EmploymentStep,
  lifestyle: LifestyleStep,
  gettingToKnowYou: GettingToKnowYouStep,
  genderSpecific: GenderSpecificStep,
  compatibility: CompatibilityStep,
  safety: SafetyStep,
  health: HealthStep,
  review: ReviewStep,
}

export function RegistrationWizardScreen() {
  const navigate = useNavigate()
  const { currentStepIndex, nextStep, markStepComplete, completedSteps, setStep, draft, editReturnIndex, clearEditReturn } = useRegistrationStore()
  const { language, t } = useLanguage()
  const { celebrate } = useCelebration()
  const { showEncouragement } = useEncouragement()
  const { show } = useToast()

  const step = REGISTRATION_STEPS[currentStepIndex]
  const StepComponent = stepComponents[step.key]
  const isLast = currentStepIndex === REGISTRATION_STEPS.length - 1
  const stepValid = isStepValid(step.key, draft)

  const handleNext = () => {
    markStepComplete(step.key)

    // Came here from an "edit" link on Review — save this one page, then go straight back.
    if (editReturnIndex !== null) {
      const returnTo = editReturnIndex
      clearEditReturn()
      setStep(returnTo)
      show(t('Updated', 'اتحدّث'), 'success')
      return
    }

    if (isLast) {
      // Don't let the member reach payment until every other section is done.
      const stillMissing = REGISTRATION_STEPS.filter((s) => s.key !== 'review' && !([...completedSteps, step.key].includes(s.key)))
      if (stillMissing.length > 0) {
        const firstMissing = REGISTRATION_STEPS.findIndex((s) => s.key === stillMissing[0].key)
        show(
          t('Please finish every section before continuing to payment.', 'كمّل كل الأقسام الأول قبل ما تكمل للدفع.'),
          'error'
        )
        setStep(firstMissing === -1 ? 0 : firstMissing)
        return
      }
      celebrate('confetti')
      navigate('/payment/subscription')
      return
    }

    celebrate('hearts')
    showEncouragement(getEncouragement(currentStepIndex, language, draft.personal.firstName ?? '', currentStepIndex + 1, draft.gender), {
      onContinue: nextStep,
      onSaveAndExit: () => navigate('/app/home'),
      continueLabel: t('Continue', draft.gender === 'female' ? 'كمّلي' : 'كمّل'),
      saveExitLabel: t('Save & Exit', 'احفظ واخرج'),
    })
  }

  return (
    <WizardShell onNext={handleNext} nextLabel={isLast ? t('Continue to Subscription', draft.gender === 'female' ? 'كمّلي للاشتراك' : 'كمّل للاشتراك') : undefined} nextDisabled={!stepValid}>
      <StepComponent />
    </WizardShell>
  )
}
