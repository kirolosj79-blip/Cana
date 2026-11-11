import { useRegistrationStore } from '@/store/registration.store'
import { Input } from '@/shared/components/ui/Input'
import { Select } from '@/shared/components/ui/Select'
import { ChoiceGroup } from '@/shared/components/ui/ChoiceGroup'
import { PhotoUploadField } from '@/shared/components/ui/PhotoUploadField'
import { MultiPhotoUploadField } from '@/shared/components/ui/MultiPhotoUploadField'
import { QuestionCard } from '@/shared/components/ui/QuestionCard'
import { EmailField } from '@/shared/components/ui/EmailField'
import { DocumentUploadCard } from '@/shared/components/ui/DocumentUploadCard'
import { residenceCountryOptions, usStateOptions, canadaProvinceOptions, egyptGovernorateOptions, nationalityOptions } from '@/features/registration/data/options'
import { sortBilingual } from '@/shared/utils/sortBilingual'
import { toOptionalNumber } from '@/shared/utils/number'
import { calculateAge, isPast20thBirthday } from '@/shared/utils/age'
import { useLanguage } from '@/core/hooks/useLanguage'
import { useAuthStore } from '@/store/auth.store'
import { useEffect } from 'react'
import { ShieldCheck, IdCard } from 'lucide-react'
import { FieldVisibilityToggle } from '@/shared/components/ui/FieldVisibilityToggle'

export function PersonalInfoStep() {
  const { draft, updateSection, setGender } = useRegistrationStore()
  const setAuthEmail = useAuthStore((s) => s.setEmail)
  const authPhone = useAuthStore((s) => s.user?.phone)
  const p = draft.personal
  const set = (data: Partial<typeof p>) => updateSection('personal', data)
  const { language, t } = useLanguage()

  // The phone number is already verified during sign-in — reuse it instead of asking again.
  useEffect(() => {
    if (authPhone && !p.phone) set({ phone: authPhone })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authPhone])

  return (
    <div className="space-y-4">
      <QuestionCard question={t('Your full name', 'اسمك بالكامل')}>
        <div className="grid grid-cols-3 gap-2.5">
          <Input
            placeholder={t('First', 'الأول')}
            value={p.firstName ?? ''}
            onChange={(e) => set({ firstName: e.target.value, displayName: e.target.value })}
          />
          <Input placeholder={t('Middle', 'الأب')} value={p.middleName ?? ''} onChange={(e) => set({ middleName: e.target.value })} />
          <Input placeholder={t('Last', 'العائلة')} value={p.lastName ?? ''} onChange={(e) => set({ lastName: e.target.value })} />
        </div>
      </QuestionCard>

      <QuestionCard question={t('Cellphone number', 'رقم الموبايل')}>
        <div className="h-12 w-full min-w-0 flex items-center justify-between rounded-[var(--r-md)] border border-ink-100 bg-parchment-0 px-4 text-[15px] text-ink-600">
          <span dir="ltr">{p.phone || authPhone}</span>
          <span className="flex items-center gap-1 text-xs font-normal text-success-500 shrink-0">
            <ShieldCheck size={12} /> {t('Verified', 'موثّق')}
          </span>
        </div>
      </QuestionCard>

      <QuestionCard question={t('Email address', 'الإيميل')}>
        <EmailField
          optional
          value={p.email ?? ''}
          onChange={(v) => {
            set({ email: v })
            setAuthEmail(v)
          }}
        />
      </QuestionCard>

      <QuestionCard question={t('Gender', 'النوع')}>
        <ChoiceGroup
          columns={2}
          value={draft.gender ?? ''}
          onChange={(v) => setGender(v)}
          options={[
            { value: 'male', label: t('Male', 'ذكر') },
            { value: 'female', label: t('Female', 'أنثى') },
          ]}
        />
      </QuestionCard>

      <QuestionCard question={t('Date of birth', 'تاريخ الميلاد')} labelExtra={<FieldVisibilityToggle fieldKey="personal.dateOfBirth" />}>
        <Input
          type="date"
          value={p.dateOfBirth ?? ''}
          onChange={(e) => set({ dateOfBirth: e.target.value })}
          error={p.dateOfBirth && !isPast20thBirthday(p.dateOfBirth) ? t('You must be at least 20 years old', 'لازم يكون سنك 20 سنة على الأقل') : undefined}
        />
        {p.dateOfBirth && isPast20thBirthday(p.dateOfBirth) && (
          <p className="text-xs text-ink-500 mt-1">{t(`Age: ${calculateAge(p.dateOfBirth)}`, `سنك: ${calculateAge(p.dateOfBirth)}`)}</p>
        )}
      </QuestionCard>

      <QuestionCard question={t('Weight & height', 'الوزن والطول')}>
        <div className="grid grid-cols-2 gap-2.5">
          <Input
            placeholder={t('Weight (kg)', 'الوزن (كجم)')}
            type="number"
            value={p.weightKg ?? ''}
            onChange={(e) => set({ weightKg: toOptionalNumber(e.target.value) })}
            error={p.weightKg !== undefined && p.weightKg < 46 ? t('Must be at least 46 kg', 'لازم يكون 46 كجم على الأقل') : undefined}
          />
          <Input
            placeholder={t('Height (cm)', 'الطول (سم)')}
            type="number"
            value={p.heightCm ?? ''}
            onChange={(e) => set({ heightCm: toOptionalNumber(e.target.value) })}
            error={p.heightCm !== undefined && p.heightCm < 100 ? t('Must be at least 100 cm', 'لازم يكون 100 سم على الأقل') : undefined}
          />
        </div>
      </QuestionCard>

      <QuestionCard question={t('Country of residence', 'بلد الإقامة')}>
        <Select
          placeholder={t('Select country', 'اختار البلد')}
          value={p.countryOfResidence ?? ''}
          onChange={(e) => set({ countryOfResidence: e.target.value as any })}
        >
          {sortBilingual(residenceCountryOptions, language).map((c) => (
            <option key={c.value} value={c.value}>
              {language === 'ar' ? c.ar : c.en}
            </option>
          ))}
        </Select>
      </QuestionCard>

      {p.countryOfResidence === 'usa' ? (
        <QuestionCard question={t('State & city', 'الولاية والمدينة')} labelExtra={<FieldVisibilityToggle fieldKey="personal.cityState" />}>
          <div className="space-y-2.5">
            <Select placeholder={t('Select state', 'اختار الولاية')} value={p.usState ?? ''} onChange={(e) => set({ usState: e.target.value })}>
              {usStateOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
            <Input placeholder={t('City', 'المدينة')} value={p.cityState ?? ''} onChange={(e) => set({ cityState: e.target.value })} />
          </div>
        </QuestionCard>
      ) : p.countryOfResidence === 'canada' ? (
        <QuestionCard question={t('Province & city', 'المقاطعة والمدينة')} labelExtra={<FieldVisibilityToggle fieldKey="personal.cityState" />}>
          <div className="space-y-2.5">
            <Select placeholder={t('Select province', 'اختار المقاطعة')} value={p.usState ?? ''} onChange={(e) => set({ usState: e.target.value })}>
              {canadaProvinceOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
            <Input placeholder={t('City', 'المدينة')} value={p.cityState ?? ''} onChange={(e) => set({ cityState: e.target.value })} />
          </div>
        </QuestionCard>
      ) : p.countryOfResidence === 'egypt' ? (
        <QuestionCard question={t('Governorate & city', 'المحافظة والمدينة')} labelExtra={<FieldVisibilityToggle fieldKey="personal.cityState" />}>
          <div className="space-y-2.5">
            <Select placeholder={t('Select governorate', 'اختار المحافظة')} value={p.usState ?? ''} onChange={(e) => set({ usState: e.target.value })}>
              {sortBilingual(egyptGovernorateOptions, language).map((g) => (
                <option key={g.en} value={g.en}>
                  {language === 'ar' ? g.ar : g.en}
                </option>
              ))}
            </Select>
            <Input placeholder={t('City', 'المدينة')} value={p.cityState ?? ''} onChange={(e) => set({ cityState: e.target.value })} />
          </div>
        </QuestionCard>
      ) : (
        <QuestionCard question={t('City / Governorate', 'المدينة / المحافظة')} labelExtra={<FieldVisibilityToggle fieldKey="personal.cityState" />}>
          <Input value={p.cityState ?? ''} onChange={(e) => set({ cityState: e.target.value })} />
        </QuestionCard>
      )}

      <QuestionCard question={t('Original nationality', 'الجنسية الأصلية')} labelExtra={<FieldVisibilityToggle fieldKey="personal.nationality" />}>
        <NationalityField
          value={p.nationality?.[0] ?? ''}
          otherValue={p.nationalityOtherOriginal ?? ''}
          onChange={(v) => set({ nationality: [v, p.nationality?.[1] ?? ''] })}
          onOtherChange={(v) => set({ nationalityOtherOriginal: v })}
        />
      </QuestionCard>
      <QuestionCard question={t('Acquired nationality', 'جنسية مكتسبة')}>
        <NationalityField
          optional
          allowNone
          value={p.nationality?.[1] ?? ''}
          otherValue={p.nationalityOtherAcquired ?? ''}
          onChange={(v) => set({ nationality: [p.nationality?.[0] ?? '', v] })}
          onOtherChange={(v) => set({ nationalityOtherAcquired: v })}
        />
      </QuestionCard>

      <QuestionCard question={t('Languages spoken', 'اللغات اللي بتتكلمها')} labelExtra={<FieldVisibilityToggle fieldKey="personal.languagesSpoken" />}>
        <ChoiceGroup
          multi
          columns={3}
          value={p.languagesSpoken ?? []}
          onChange={(v) => set({ languagesSpoken: v })}
          options={[
            { value: 'Arabic', label: t('Arabic', 'عربي') },
            { value: 'English', label: t('English', 'إنجليزي') },
            { value: 'French', label: t('French', 'فرنساوي') },
          ]}
        />
      </QuestionCard>

      <QuestionCard question={t('Profile photo', 'صورتك الشخصية')}>
        <PhotoUploadField label="" onUploaded={(v) => set({ profilePhotoUrl: v ? 'uploaded' : '' })} />
      </QuestionCard>
      <QuestionCard question={t('Additional photos (up to 6 total)', 'صور إضافية (6 كحد أقصى)')}>
        <MultiPhotoUploadField
          label=""
          hint={t('No group photos as your main picture — administrators may remove inappropriate photos', 'من غير صور جماعية كصورة رئيسية — الإدارة ممكن تشيل أي صورة غير مناسبة')}
          optional
          max={5}
        />
      </QuestionCard>
      <DocumentUploadCard
        icon={<IdCard size={18} />}
        title={t('Government ID', 'إثبات الهوية')}
        subtitle={t("Passport or Driver's License", 'باسبور أو رخصة قيادة')}
        defaultUploaded={p.governmentIdUploaded}
        onUploaded={(v) => set({ governmentIdUploaded: v })}
      />
    </div>
  )
}

function NationalityField({
  value,
  otherValue,
  onChange,
  onOtherChange,
  optional,
  allowNone,
}: {
  value: string
  otherValue: string
  onChange: (v: string) => void
  onOtherChange: (v: string) => void
  optional?: boolean
  allowNone?: boolean
}) {
  const { t } = useLanguage()
  const options = [
    ...(allowNone ? [{ value: 'none', label: t('None', 'لا يوجد') }] : []),
    ...nationalityOptions.map((n) => ({ value: n.value, label: t(n.en, n.ar) })),
  ]
  return (
    <div className="space-y-3">
      <ChoiceGroup columns={4} value={value} onChange={onChange} options={options} />
      {optional && !value && <p className="text-xs field-hint">{t('Optional', 'اختياري')}</p>}
      {value === 'other' && (
        <Input
          label={t('Please specify', 'وضّح من فضلك (مطلوب)')}
          value={otherValue}
          onChange={(e) => onOtherChange(e.target.value)}
          required
          error={!otherValue.trim() ? t('Required — please tell us your nationality', 'مطلوب — قولنا جنسيتك إيه') : undefined}
        />
      )}
    </div>
  )
}
