import { useState } from 'react'
import { toOptionalNumber } from '@/shared/utils/number'
import { TopBar } from '@/shared/components/layout/TopBar'
import { Input } from '@/shared/components/ui/Input'
import { Textarea } from '@/shared/components/ui/Textarea'
import { ChoiceGroup } from '@/shared/components/ui/ChoiceGroup'
import { UploadField } from '@/shared/components/ui/UploadField'
import { PhotoUploadField } from '@/shared/components/ui/PhotoUploadField'
import { Button } from '@/shared/components/ui/Button'
import { Badge } from '@/shared/components/ui/Badge'
import { Switch } from '@/shared/components/ui/Toggle'
import { useRegistrationStore } from '@/store/registration.store'
import { usePendingChangesStore } from '@/store/pendingChanges.store'
import { useFieldVisibilityStore, VISIBILITY_CONTROLLED_FIELDS } from '@/store/fieldVisibility.store'
import { useToast } from '@/shared/components/feedback/Toast'
import { denominationOptions } from '@/features/registration/data/options'
import { useLanguage } from '@/core/hooks/useLanguage'
import { Lock, Clock, ShieldCheck, Eye } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function SectionCard({ title, children, hint }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[var(--radius-md)] border border-ink-100 p-4 space-y-4">
      <div>
        <p className="text-sm font-semibold text-ink-900">{title}</p>
        {hint && <p className="text-xs text-ink-400 mt-0.5">{hint}</p>}
      </div>
      {children}
    </div>
  )
}

export function EditProfileScreen() {
  const navigate = useNavigate()
  const { draft, updateSection } = useRegistrationStore()
  const { changes, submit } = usePendingChangesStore()
  const { isVisible, setVisible } = useFieldVisibilityStore()
  const { show } = useToast()
  const { language, t } = useLanguage()

  // ---- Freely editable (applies immediately) ----
  const p = draft.personal
  const em = draft.employment
  const ed = draft.education
  const l = draft.lifestyle
  const cp = draft.compatibilityPreferences

  // ---- Sensitive fields (require admin approval) — local draft state ----
  const [name, setName] = useState({ first: p.firstName ?? '', last: p.lastName ?? '' })
  const [dob, setDob] = useState(p.dateOfBirth ?? '')
  const [maritalEverMarried, setMaritalEverMarried] = useState<boolean | undefined>(draft.eligibility.everMarried)
  const [churchName, setChurchName] = useState(draft.church.churchName ?? '')
  const [diocese, setDiocese] = useState(draft.church.diocese ?? '')

  const pendingFor = (label: string) => changes.find((c) => c.fieldLabel === label)

  const submitSensitive = (fieldLabel: string, section: 'personal' | 'church' | 'eligibility', patch: Record<string, unknown>, oldSummary: string, newSummary: string) => {
    if (oldSummary === newSummary) {
      show(t('No changes to submit', 'مفيش تعديلات تتبعت'), 'info')
      return
    }
    submit({ fieldLabel, section, patch, oldSummary, newSummary })
    show(t('Saved', 'اتحفظ'), 'success')
  }

  return (
    <div>
      <TopBar showBack title={t('Edit Profile', 'تعديل الملف الشخصي')} />
      <div className="px-5 pt-2 pb-8 space-y-6">
        <p className="text-xs text-ink-400 flex items-center gap-1.5">
          <ShieldCheck size={13} /> {t('All changes are saved instantly.', 'كل التعديلات بتتحفظ فورًا.')}
        </p>

        <p className="text-xs font-semibold uppercase tracking-wide text-ink-400 pt-2">{t('Editable anytime', 'تقدر تعدّلها في أي وقت')}</p>

        <SectionCard title={t('Biography', 'نبذة عنك')}>
          <Textarea placeholder={t('Tell your matches about yourself…', 'قول لترشيحاتك حاجة عن نفسك…')} value={p.bio ?? ''} onChange={(e) => updateSection('personal', { bio: e.target.value })} rows={4} />
        </SectionCard>

        <SectionCard
          title={t('Photos', 'الصور')}
          hint={t('Up to 6 photos. No sunglasses or group shots as your main photo; keep them recent (within 12 months).', '6 صور كحد أقصى. من غير نظارة شمس أو صورة جماعية كصورة رئيسية، وتكون حديثة (خلال آخر 12 شهر).')}
        >
          <PhotoUploadField label={t('Main photo', 'الصورة الرئيسية')} />
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <UploadField key={i} label={t(`Photo ${i + 2}`, `صورة ${i + 2}`)} optional />
            ))}
          </div>
        </SectionCard>

        <SectionCard title={t('Occupation & Education', 'الوظيفة والتعليم')}>
          <Input label={t('Occupation', 'الوظيفة')} value={em.occupation ?? ''} onChange={(e) => updateSection('employment', { occupation: e.target.value })} />
          <Input label={t('Institution', 'الجامعة / المدرسة')} value={ed.institution ?? ''} onChange={(e) => updateSection('education', { institution: e.target.value })} />
        </SectionCard>

        <SectionCard title={t('Languages', 'اللغات')}>
          <ChoiceGroup
            multi
            columns={3}
            value={p.languagesSpoken ?? []}
            onChange={(v) => updateSection('personal', { languagesSpoken: v })}
            options={[
              { value: 'Arabic', label: t('Arabic', 'عربي') },
              { value: 'English', label: t('English', 'إنجليزي') },
              { value: 'French', label: t('French', 'فرنساوي') },
            ]}
          />
        </SectionCard>

        <SectionCard title={t('Interests', 'الاهتمامات')}>
          <ChoiceGroup
            multi
            columns={2}
            value={l.freeTimeActivities ?? []}
            onChange={(v) => updateSection('lifestyle', { freeTimeActivities: v })}
            options={[
              { value: 'Spending time with family', label: t('Spending time with family', 'قضاء وقت مع العائلة') },
              { value: 'Church activities or volunteering', label: t('Church activities or volunteering', 'أنشطة كنسية أو تطوع') },
              { value: 'Reading', label: t('Reading', 'القراءة') },
              { value: 'Sports or fitness', label: t('Sports or fitness', 'رياضة') },
              { value: 'Traveling', label: t('Traveling', 'السفر') },
              { value: 'Cooking or baking', label: t('Cooking or baking', 'طبخ أو بيكري') },
            ]}
          />
        </SectionCard>

        <SectionCard title={t('Lifestyle', 'نمط الحياة')}>
          <ChoiceGroup
            label={t('Smoking', 'التدخين')}
            columns={2}
            value={l.smoking ?? ''}
            onChange={(v) => updateSection('lifestyle', { smoking: v })}
            options={[
              { value: 'never', label: t('Never', 'أبدًا') },
              { value: 'occasional', label: t('Occasionally', 'أحيانًا') },
              { value: 'regular', label: t('Regularly', 'بانتظام') },
              { value: 'prefer_not_to_say', label: t('Prefer not to answer', 'أفضّل عدم الإجابة') },
            ]}
          />
        </SectionCard>

        <SectionCard title={t('Preferences', 'التفضيلات')} hint={t('Powers your daily recommended matches', 'بيحدد ترشيحاتك اليومية')}>
          <div className="grid grid-cols-2 gap-3">
            <Input label={t('Min age', 'أقل سن')} type="number" value={cp.ageRangeMin ?? ''} onChange={(e) => updateSection('compatibilityPreferences', { ageRangeMin: toOptionalNumber(e.target.value) })} />
            <Input label={t('Max age', 'أعلى سن')} type="number" value={cp.ageRangeMax ?? ''} onChange={(e) => updateSection('compatibilityPreferences', { ageRangeMax: toOptionalNumber(e.target.value) })} />
          </div>
        </SectionCard>

        <SectionCard title={t('Availability', 'الاستعداد للجواز')}>
          <ChoiceGroup
            label={t('Marriage timeline', 'إمتى تحب تكون جاهز للجواز')}
            value={draft.gettingToKnowYou.marriageTimeline ?? ''}
            onChange={(v) => updateSection('gettingToKnowYou', { marriageTimeline: v })}
            options={[
              { value: 'within_6_months', label: t('Within the next 6 months', 'خلال 6 أشهر') },
              { value: 'within_1_year', label: t('Within 1 year', 'خلال سنة') },
              { value: 'within_1_2_years', label: t('Within 1–2 years', 'خلال 1-2 سنة') },
              { value: 'open', label: t('Open to the right timing', 'مرن حسب الظروف') },
            ]}
          />
        </SectionCard>

        <p className="text-xs font-semibold uppercase tracking-wide text-ink-400 pt-4">{t('Profile visibility', 'ظهور بياناتك في البروفايل')}</p>
        <SectionCard
          title={t('Show or hide on your public profile', 'اظهار أو إخفاء من بروفايلك العام')}
          hint={t('Turning something off only hides it from other members — your data stays saved.', 'إيقاف أي معلومة بيخفيها عن باقي الأعضاء بس، وبياناتك بتفضل محفوظة.')}
        >
          {VISIBILITY_CONTROLLED_FIELDS.map((f) => (
            <div key={f.key} className="flex items-center justify-between py-1">
              <span className="flex items-center gap-2 text-sm text-ink-800">
                <Eye size={14} className="text-ink-400" /> {t(f.en, f.ar)}
              </span>
              <Switch checked={isVisible(f.key)} onChange={(v) => setVisible(f.key, v)} />
            </div>
          ))}
          <Button variant="ghost" size="sm" className="w-full mt-2" onClick={() => navigate('/app/profile/preview')}>
            {t('Preview how others see your profile', 'شوف بروفايلك زي ما هيبان لغيرك')}
          </Button>
        </SectionCard>

        <p className="text-xs font-semibold uppercase tracking-wide text-ink-400 pt-4">{t('Requires admin approval', 'محتاجة موافقة الإدارة')}</p>

        <SectionCard title={t('Full Legal Name', 'الاسم القانوني الكامل')}>
          {pendingFor('Full Legal Name') && <PendingBadge t={t} />}
          <div className="grid grid-cols-2 gap-3">
            <Input label={t('First name', 'الاسم الأول')} value={name.first} onChange={(e) => setName({ ...name, first: e.target.value })} />
            <Input label={t('Last name', 'اسم العائلة')} value={name.last} onChange={(e) => setName({ ...name, last: e.target.value })} />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              submitSensitive(
                'Full Legal Name',
                'personal',
                { firstName: name.first, lastName: name.last },
                `${p.firstName} ${p.lastName}`,
                `${name.first} ${name.last}`
              )
            }
          >
            <Lock size={13} /> {t('Submit for Approval', 'ابعت للموافقة')}
          </Button>
        </SectionCard>

        <SectionCard title={t('Date of Birth', 'تاريخ الميلاد')}>
          {pendingFor('Date of Birth') && <PendingBadge t={t} />}
          <Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
          <Button variant="outline" size="sm" onClick={() => submitSensitive('Date of Birth', 'personal', { dateOfBirth: dob }, p.dateOfBirth ?? '', dob)}>
            <Lock size={13} /> {t('Submit for Approval', 'ابعت للموافقة')}
          </Button>
        </SectionCard>

        <SectionCard title={t('Marital Status', 'الحالة الاجتماعية')}>
          {pendingFor('Marital Status') && <PendingBadge t={t} />}
          <ChoiceGroup
            columns={2}
            value={maritalEverMarried === undefined ? '' : String(maritalEverMarried)}
            onChange={(v) => setMaritalEverMarried(v === 'true')}
            options={[
              { value: 'false', label: t('Never married', 'لسه ما اتجوزش') },
              { value: 'true', label: t('Previously married', 'متجوز قبل كده') },
            ]}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              submitSensitive(
                'Marital Status',
                'eligibility',
                { everMarried: maritalEverMarried },
                String(draft.eligibility.everMarried),
                String(maritalEverMarried)
              )
            }
          >
            <Lock size={13} /> {t('Submit for Approval', 'ابعت للموافقة')}
          </Button>
        </SectionCard>

        <SectionCard title={t('Church & Diocese', 'الكنيسة والإيبارشية')}>
          {(pendingFor('Church') || pendingFor('Diocese')) && <PendingBadge t={t} />}
          <ChoiceGroup
            value={draft.church.denomination ?? ''}
            onChange={(v) => updateSection('church', { denomination: v })}
            options={denominationOptions.map((d) => ({ value: d.value, label: language === 'ar' ? d.ar : d.en }))}
          />
          <Input label={t('Church / parish name', 'اسم الكنيسة')} value={churchName} onChange={(e) => setChurchName(e.target.value)} />
          <Input label={t('Diocese', 'الإيبارشية')} value={diocese} onChange={(e) => setDiocese(e.target.value)} />
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              submitSensitive('Church', 'church', { churchName, diocese }, `${draft.church.churchName} / ${draft.church.diocese}`, `${churchName} / ${diocese}`)
            }
          >
            <Lock size={13} /> {t('Submit for Approval', 'ابعت للموافقة')}
          </Button>
        </SectionCard>

        <SectionCard title={t('Church Verification & Marriage Recommendation Letter', 'خطاب إثبات الأهلية للزواج من الكنيسة')}>
          {pendingFor('Priest Recommendation Letter') && <PendingBadge t={t} />}
          <UploadField
            label={t('Re-upload recommendation letter', 'ارفع الخطاب تاني')}
            onUploaded={(v) =>
              v &&
              submitSensitive('Priest Recommendation Letter', 'church', { recommendationLetterUploaded: true }, t('previous letter', 'الخطاب القديم'), t('new letter uploaded', 'خطاب جديد اترفع'))
            }
          />
        </SectionCard>

        <SectionCard title={t('Medical Documents', 'المستندات الطبية')}>
          {pendingFor('Medical Documents') && <PendingBadge t={t} />}
          <UploadField
            label={t('Re-upload medical verification document', 'ارفع مستند التحقق الطبي تاني')}
            onUploaded={(v) => v && submitSensitive('Medical Documents', 'personal', {}, t('previous document', 'المستند القديم'), t('new document uploaded', 'مستند جديد اترفع'))}
          />
        </SectionCard>

        <SectionCard title={t('Identity Verification', 'التحقق من الهوية')}>
          {pendingFor('Identity Verification') && <PendingBadge t={t} />}
          <UploadField
            label={t('Re-upload government ID', 'ارفع إثبات الهوية تاني')}
            onUploaded={(v) => v && submitSensitive('Identity Verification', 'personal', { governmentIdUploaded: true }, t('previous ID', 'الإثبات القديم'), t('new ID uploaded', 'إثبات جديد اترفع'))}
          />
        </SectionCard>
      </div>
    </div>
  )
}

function PendingBadge({ t }: { t: (en: string, ar: string) => string }) {
  return (
    <Badge variant="warning">
      <Clock size={11} /> {t('Pending Approval', 'قيد الموافقة')}
    </Badge>
  )
}
