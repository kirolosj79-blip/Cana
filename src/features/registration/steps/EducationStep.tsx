import { useRegistrationStore } from '@/store/registration.store'
import { toOptionalNumber } from '@/shared/utils/number'
import { Input } from '@/shared/components/ui/Input'
import { Select } from '@/shared/components/ui/Select'
import { ChoiceGroup } from '@/shared/components/ui/ChoiceGroup'
import { UploadField } from '@/shared/components/ui/UploadField'
import { educationLevelOptions } from '@/features/registration/data/options'
import { fieldOfStudyOptions, egyptUniversityOptions, usaUniversityOptions, canadaUniversityOptions } from '@/features/registration/data/education'
import { sortBilingual } from '@/shared/utils/sortBilingual'
import { useLanguage } from '@/core/hooks/useLanguage'
import { FieldVisibilityToggle } from '@/shared/components/ui/FieldVisibilityToggle'

export function EducationStep() {
  const { draft, updateSection } = useRegistrationStore()
  const ed = draft.education
  const set = (data: Partial<typeof ed>) => updateSection('education', data)
  const { language, t } = useLanguage()

  const universityList: 'egypt' | 'usa' | 'canada' | null =
    draft.personal.countryOfResidence === 'usa' ? 'usa' : draft.personal.countryOfResidence === 'egypt' ? 'egypt' : draft.personal.countryOfResidence === 'canada' ? 'canada' : null

  return (
    <div className="space-y-6">
      <ChoiceGroup
        label={t('Highest education level', 'أعلى مؤهل دراسي')}
        columns={2}
        value={ed.level ?? ''}
        onChange={(v) => set({ level: v })}
        options={educationLevelOptions.map((o) => ({ value: o.value, label: language === 'ar' ? o.ar : o.en }))}
        labelExtra={<FieldVisibilityToggle fieldKey="education.level" />}
      />

      <Select
        label={t('Field of study', 'مجال الدراسة')}
        placeholder={t('Select field of study', 'اختار مجال الدراسة')}
        value={ed.fieldOfStudy ?? ''}
        onChange={(e) => set({ fieldOfStudy: e.target.value })}
      >
        {sortBilingual(fieldOfStudyOptions, language).map((f) => (
          <option key={f.en} value={f.en}>
            {language === 'ar' ? f.ar : f.en}
          </option>
        ))}
      </Select>
      {ed.fieldOfStudy === 'Other' && (
        <Input
          label={t('Please specify', 'وضّح من فضلك')}
          value={ed.fieldOfStudyOther ?? ''}
          onChange={(e) => set({ fieldOfStudyOther: e.target.value })}
        />
      )}

      {universityList === 'egypt' ? (
        <>
          <Select
            label={t('University / school', 'الجامعة / المدرسة')}
            placeholder={t('Select university', 'اختار الجامعة')}
            value={ed.institution ?? ''}
            onChange={(e) => set({ institution: e.target.value })}
          >
            {sortBilingual(
              egyptUniversityOptions.filter((u) => u.en !== 'Other'),
              language
            ).map((u) => (
              <option key={u.en} value={u.en}>
                {language === 'ar' ? u.ar : u.en}
              </option>
            ))}
            <option value="Other">{t('Other', 'أخرى')}</option>
          </Select>
          {ed.institution === 'Other' && (
            <Input
              label={t('Please specify', 'وضّح من فضلك')}
              value={ed.institutionOther ?? ''}
              onChange={(e) => set({ institutionOther: e.target.value })}
            />
          )}
        </>
      ) : universityList === 'usa' || universityList === 'canada' ? (
        <>
          <Select
            label={t('University / school', 'الجامعة / المدرسة')}
            placeholder={t('Select university', 'اختار الجامعة')}
            value={ed.institution ?? ''}
            onChange={(e) => set({ institution: e.target.value })}
          >
            {[...(universityList === 'usa' ? usaUniversityOptions : canadaUniversityOptions)]
              .sort((a, b) => (a === 'Other' ? 1 : b === 'Other' ? -1 : a.localeCompare(b)))
              .map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
          </Select>
          {ed.institution === 'Other' && (
            <Input
              label={t('Please specify', 'وضّح من فضلك')}
              value={ed.institutionOther ?? ''}
              onChange={(e) => set({ institutionOther: e.target.value })}
            />
          )}
        </>
      ) : (
        <Input label={t('University / school', 'الجامعة / المدرسة')} value={ed.institution ?? ''} onChange={(e) => set({ institution: e.target.value })} />
      )}

      <Input
        label={t('Year graduated', 'سنة التخرج')}
        type="number"
        value={ed.yearGraduated ?? ''}
        onChange={(e) => set({ yearGraduated: toOptionalNumber(e.target.value.replace('-', '')) })}
        error={ed.yearGraduated !== undefined && (ed.yearGraduated < 1950 || ed.yearGraduated > new Date().getFullYear()) ? t('Please enter a valid year', 'اكتب سنة صحيحة') : undefined}
      />
      <UploadField
        label={t('Degree certificate', 'شهادة التخرج')}
        optional
        defaultUploaded={ed.degreeCertificateUploaded}
        onUploaded={(v) => set({ degreeCertificateUploaded: v })}
      />
    </div>
  )
}
