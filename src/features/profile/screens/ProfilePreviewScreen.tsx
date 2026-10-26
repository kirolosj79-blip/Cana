import { MapPin, GraduationCap, Briefcase, Sparkles, Church, EyeOff } from 'lucide-react'
import { TopBar } from '@/shared/components/layout/TopBar'
import { Badge } from '@/shared/components/ui/Badge'
import { useRegistrationStore } from '@/store/registration.store'
import { useFieldVisibilityStore } from '@/store/fieldVisibility.store'
import { denominationOptions, educationLevelOptions } from '@/features/registration/data/options'
import { useLanguage } from '@/core/hooks/useLanguage'

function HiddenNote({ label }: { label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-xs text-ink-400 italic">
      <EyeOff size={12} /> {label}
    </span>
  )
}

/**
 * Shows the current member's own profile exactly as other members would see
 * it — i.e. with the field-visibility toggles from Edit Profile applied.
 * This is the honest way to demonstrate the visibility system in a
 * single-user prototype, since there's no second account to view it from.
 */
export function ProfilePreviewScreen() {
  const { draft } = useRegistrationStore()
  const { isVisible } = useFieldVisibilityStore()
  const { language, t } = useLanguage()

  const age = draft.personal.dateOfBirth ? new Date().getFullYear() - new Date(draft.personal.dateOfBirth).getFullYear() : null
  const denomination = denominationOptions.find((d) => d.value === draft.church.denomination)
  const education = educationLevelOptions.find((e) => e.value === draft.education.level)

  return (
    <div>
      <TopBar showBack title={t('Profile Preview', 'معاينة البروفايل')} />
      <div className="px-5 pt-2 pb-8 space-y-5">
        <div className="rounded-[var(--radius-md)] bg-info-100 border border-info-500/20 px-4 py-3 text-xs text-info-500">
          {t('This is how other verified members see your profile.', 'كده هيبان بروفايلك لباقي الأعضاء الموثّقين.')}
        </div>

        <div className="h-40 rounded-[var(--radius-lg)] bg-ink-100 flex items-center justify-center text-ink-400 text-sm">
          {draft.personal.profilePhotoUrl ? t('Photo uploaded', 'الصورة اترفعت') : t('No photo uploaded yet', 'لسه مفيش صورة')}
        </div>

        <div>
          {isVisible('personal.displayName') ? (
            <h1 className="font-display text-2xl font-medium text-ink-900">
              {draft.personal.displayName || draft.personal.firstName || t('Your name', 'اسمك')}
              {isVisible('personal.dateOfBirth') && age ? `, ${age}` : ''}
            </h1>
          ) : (
            <HiddenNote label={t('Name hidden', 'الاسم مخفي')} />
          )}
          {isVisible('personal.cityState') ? (
            <p className="text-sm text-ink-500 flex items-center gap-1 mt-1">
              <MapPin size={13} /> {draft.personal.cityState || t('Not set', 'لسه ماتحددتش')}
            </p>
          ) : (
            <HiddenNote label={t('City hidden', 'المدينة مخفية')} />
          )}
        </div>

        <div className="space-y-2.5">
          <div className="flex items-center gap-2 text-ink-800">
            <Church size={16} className="text-gold-600" />
            <p className="text-sm font-semibold">{t('Denomination', 'الطائفة')}</p>
          </div>
          {isVisible('church.denomination') ? (
            <p className="text-sm text-ink-700">{denomination ? (language === 'ar' ? denomination.ar : denomination.en) : t('Not set', 'لسه ماتحددتش')}</p>
          ) : (
            <HiddenNote label={t('Denomination hidden', 'الطائفة مخفية')} />
          )}
        </div>

        <div className="space-y-2.5">
          <div className="flex items-center gap-2 text-ink-800">
            <Briefcase size={16} className="text-gold-600" />
            <p className="text-sm font-semibold">{t('Occupation', 'الوظيفة')}</p>
          </div>
          {isVisible('employment.occupation') ? (
            <p className="text-sm text-ink-700">{draft.employment.occupation || t('Not set', 'لسه ماتحددتش')}</p>
          ) : (
            <HiddenNote label={t('Occupation hidden', 'الوظيفة مخفية')} />
          )}
        </div>

        <div className="space-y-2.5">
          <div className="flex items-center gap-2 text-ink-800">
            <GraduationCap size={16} className="text-gold-600" />
            <p className="text-sm font-semibold">{t('Education level', 'المستوى التعليمي')}</p>
          </div>
          {isVisible('education.level') ? (
            <p className="text-sm text-ink-700">{education ? (language === 'ar' ? education.ar : education.en) : t('Not set', 'لسه ماتحددتش')}</p>
          ) : (
            <HiddenNote label={t('Education hidden', 'التعليم مخفي')} />
          )}
        </div>

        <div className="space-y-2.5">
          <div className="flex items-center gap-2 text-ink-800">
            <Sparkles size={16} className="text-gold-600" />
            <p className="text-sm font-semibold">{t('Hobbies & interests', 'الهوايات والاهتمامات')}</p>
          </div>
          {isVisible('lifestyle.freeTimeActivities') ? (
            <div className="flex flex-wrap gap-1.5">
              {(draft.lifestyle.freeTimeActivities ?? []).length > 0 ? (
                draft.lifestyle.freeTimeActivities!.map((f) => (
                  <Badge key={f} variant="neutral">
                    {f}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-ink-400">{t('Not set', 'لسه ماتحددتش')}</span>
              )}
            </div>
          ) : (
            <HiddenNote label={t('Hobbies hidden', 'الهوايات مخفية')} />
          )}
        </div>
      </div>
    </div>
  )
}
