import { Church, HeartHandshake, User, Users, GraduationCap, Briefcase, Sparkles, MessageCircleHeart, Sliders, ShieldCheck, Stethoscope, Pencil, CheckCircle2, AlertCircle } from 'lucide-react'
import { useRegistrationStore, type RegistrationStepKey } from '@/store/registration.store'
import { useLanguage } from '@/core/hooks/useLanguage'
import { cn } from '@/shared/utils/cn'

function summaryRows(draft: ReturnType<typeof useRegistrationStore.getState>['draft'], t: (en: string, ar: string) => string): { icon: any; title: string; stepIndex: number; stepKey: RegistrationStepKey; value: string }[] {
  const notCompleted = t('Not completed', 'لسه ما كملتوش')
  return [
    { icon: User, title: t('Personal Information', 'المعلومات الشخصية'), stepIndex: 0, stepKey: 'personal', value: [draft.personal.firstName, draft.personal.lastName].filter(Boolean).join(' ') || notCompleted },
    { icon: Church, title: t('Church & Faith', 'الكنيسة والإيمان'), stepIndex: 1, stepKey: 'church', value: draft.church.churchName || notCompleted },
    {
      icon: HeartHandshake,
      title: t('Marriage Eligibility', 'أهلية الجواز'),
      stepIndex: 2,
      stepKey: 'eligibility',
      value: draft.eligibility.everMarried === undefined ? notCompleted : draft.eligibility.everMarried ? t('Previously married', 'متجوز قبل كده') : t('Never married', 'لسه ما اتجوزش'),
    },
    { icon: Users, title: t('Family Background', 'الخلفية العائلية'), stepIndex: 3, stepKey: 'family', value: draft.family.livesWith || notCompleted },
    { icon: GraduationCap, title: t('Education', 'التعليم'), stepIndex: 4, stepKey: 'education', value: draft.education.institution || notCompleted },
    { icon: Briefcase, title: t('Employment & Financial', 'الوظيفة والمالية'), stepIndex: 5, stepKey: 'employment', value: draft.employment.occupation || notCompleted },
    {
      icon: Sparkles,
      title: t('Lifestyle & Habits', 'نمط الحياة والعادات'),
      stepIndex: 6,
      stepKey: 'lifestyle',
      value: (draft.lifestyle.freeTimeActivities?.length ?? 0) > 0 ? t(`${draft.lifestyle.freeTimeActivities!.length} interests selected`, `${draft.lifestyle.freeTimeActivities!.length} اهتمامات مختارة`) : notCompleted,
    },
    { icon: MessageCircleHeart, title: t('Getting to Know You', 'تعرف عليك أكتر'), stepIndex: 7, stepKey: 'gettingToKnowYou', value: draft.gettingToKnowYou.threeWordsDescription?.length ? draft.gettingToKnowYou.threeWordsDescription.join(', ') : notCompleted },
    {
      icon: Sliders,
      title: t('Compatibility Preferences', 'تفضيلات التوافق'),
      stepIndex: 9,
      stepKey: 'compatibility',
      value: draft.compatibilityPreferences.ageRangeMin ? t(`Ages ${draft.compatibilityPreferences.ageRangeMin}–${draft.compatibilityPreferences.ageRangeMax}`, `الأعمار ${draft.compatibilityPreferences.ageRangeMin}–${draft.compatibilityPreferences.ageRangeMax}`) : notCompleted,
    },
    { icon: ShieldCheck, title: t('Safety Declaration', 'إقرار السلامة'), stepIndex: 10, stepKey: 'safety', value: draft.safetyDeclaration.agreedToTruthfulness ? t('Agreed', 'موافق') : t('Not agreed', 'مش موافق') },
    { icon: Stethoscope, title: t('Health & Medical', 'الصحة والمعلومات الطبية'), stepIndex: 11, stepKey: 'health', value: draft.health.disclosurePreference || draft.health.chronicConditions?.length ? t('Completed', 'اكتمل') : notCompleted },
  ]
}

export function ReviewStep() {
  const { draft, jumpToStepForEdit, completedSteps } = useRegistrationStore()
  const { t } = useLanguage()
  const rows = summaryRows(draft, t)
  const remaining = rows.filter((r) => !completedSteps.includes(r.stepKey)).length

  return (
    <div className="space-y-5">
      <p className="text-sm on-photo-text">
        {t(
          'Review your answers below. You can edit any section before submitting for church and identity verification.',
          'راجع إجاباتك تحت. تقدر تعدّل أي قسم قبل ما تبعت للتحقق من الكنيسة والهوية.'
        )}
      </p>

      {remaining > 0 && (
        <div className="flex items-center gap-2.5 rounded-[var(--radius-md)] bg-warning-100 border border-warning-500/20 px-4 py-3 text-xs text-warning-500">
          <AlertCircle size={15} className="shrink-0" />
          {t(`${remaining} section${remaining > 1 ? 's' : ''} still need to be completed before you can continue.`, `لسه ${remaining} قسم محتاج يتكمل قبل ما تقدر تكمل.`)}
        </div>
      )}

      <div className="space-y-2.5">
        {rows.map((r) => {
          const done = completedSteps.includes(r.stepKey)
          return (
            <button
              key={r.title}
              onClick={() => jumpToStepForEdit(r.stepIndex)}
              className={cn(
                'w-full flex items-center gap-3 rounded-[var(--radius-md)] border px-4 py-3.5 text-left transition-colors',
                done ? 'border-success-500/30 bg-success-100' : 'border-ink-100 bg-parchment-0 hover:border-gold-300'
              )}
            >
              <span className={cn('relative flex h-9 w-9 items-center justify-center rounded-full shrink-0', done ? 'bg-success-500/15 text-success-500' : 'bg-ink-50 text-ink-600')}>
                <r.icon size={16} />
                {done && (
                  <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-success-500 ring-2 ring-parchment-0">
                    <CheckCircle2 size={10} className="text-white" strokeWidth={3} />
                  </span>
                )}
              </span>
              <span className="flex-1 min-w-0">
                <span className={cn('block text-sm font-medium', done ? 'text-success-500' : 'text-ink-800')}>{r.title}</span>
                <span className="block text-xs text-ink-500 truncate">{r.value}</span>
              </span>
              <Pencil size={14} className="text-ink-300 shrink-0" />
            </button>
          )
        })}
      </div>
      <div className="rounded-[var(--radius-md)] bg-wine-50 border border-wine-200 px-4 py-3 text-xs text-wine-700">
        {t(
          "After you submit, our team will review your church recommendation letter and identity documents. This typically takes 1–3 business days.",
          'بعد ما تبعت، فريقنا هيراجع خطاب توصية الكنيسة ومستندات الهوية. غالبًا بتاخد من يوم لـ 3 أيام عمل.'
        )}
      </div>
    </div>
  )
}
