import { TopBar } from '@/shared/components/layout/TopBar'
import { PRIVACY_POLICY_SECTIONS, PRIVACY_POLICY_EFFECTIVE_DATE, PRIVACY_POLICY_UPDATED_DATE } from '@/features/settings/data/privacyPolicy'
import { useLanguage } from '@/core/hooks/useLanguage'

export function PrivacyPolicyScreen() {
  const { t, language } = useLanguage()
  const isAr = language === 'ar'

  return (
    <div>
      <TopBar showBack title={t('Privacy Policy', 'سياسة الخصوصية')} />
      <div className="px-5 pt-2 pb-10 space-y-6" dir={isAr ? 'rtl' : 'ltr'}>
        <div className={isAr ? 'text-right' : 'text-left'}>
          <h1 className="font-display text-xl font-medium text-ink-900">
            {isAr ? 'CANA LLC — سياسة الخصوصية' : 'CANA LLC — Privacy Policy'}
          </h1>
          <p className="text-xs text-ink-400 mt-1">{isAr ? `تاريخ السريان: ${PRIVACY_POLICY_EFFECTIVE_DATE}` : `Effective Date: ${PRIVACY_POLICY_EFFECTIVE_DATE}`}</p>
          <p className="text-xs text-ink-400">{isAr ? `آخر تحديث: ${PRIVACY_POLICY_UPDATED_DATE}` : `Last Updated: ${PRIVACY_POLICY_UPDATED_DATE}`}</p>
        </div>

        {PRIVACY_POLICY_SECTIONS.map((section) => (
          <div key={section.headingEn} className="space-y-2">
            <h2 className="text-sm font-semibold text-ink-900">{isAr ? section.headingAr : section.headingEn}</h2>
            {(isAr ? section.bodyAr : section.bodyEn).map((p, i) => (
              <p key={i} className="text-xs text-ink-600 leading-relaxed">
                {p}
              </p>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
