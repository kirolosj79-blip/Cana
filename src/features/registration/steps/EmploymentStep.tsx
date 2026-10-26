import { useRegistrationStore } from '@/store/registration.store'
import { toOptionalNumber } from '@/shared/utils/number'
import { Input } from '@/shared/components/ui/Input'
import { ChoiceGroup } from '@/shared/components/ui/ChoiceGroup'
import { UploadField } from '@/shared/components/ui/UploadField'
import { incomeRangesEgypt, incomeRangesUSA } from '@/features/registration/data/options'
import { useLanguage } from '@/core/hooks/useLanguage'
import { FieldVisibilityToggle } from '@/shared/components/ui/FieldVisibilityToggle'

export function EmploymentStep() {
  const { draft, updateSection } = useRegistrationStore()
  const em = draft.employment
  const set = (data: Partial<typeof em>) => updateSection('employment', data)
  const { t } = useLanguage()
  const incomeOptions = draft.personal.countryOfResidence === 'egypt' ? incomeRangesEgypt : incomeRangesUSA

  return (
    <div className="space-y-6">
      <Input
        label={t('Occupation', 'الوظيفة')}
        value={em.occupation ?? ''}
        onChange={(e) => set({ occupation: e.target.value })}
        labelExtra={<FieldVisibilityToggle fieldKey="employment.occupation" />}
      />
      <Input
        label={t('Employer / company name', 'اسم جهة العمل')}
        optional
        value={em.employerName ?? ''}
        onChange={(e) => set({ employerName: e.target.value })}
      />
      <Input label={t('Years in current career', 'سنين الخبرة في مجالك')} type="number" value={em.yearsInCareer ?? ''} onChange={(e) => set({ yearsInCareer: toOptionalNumber(e.target.value) })} />

      <ChoiceGroup
        label={t('Work arrangement', 'طبيعة الشغل')}
        columns={2}
        value={em.workArrangement ?? ''}
        onChange={(v) => set({ workArrangement: v })}
        options={[
          { value: 'on_site', label: t('On-site', 'العمل من مقر العمل') },
          { value: 'remote', label: t('Remote', 'العمل عن بُعد') },
          { value: 'hybrid', label: t('Hybrid', 'العمل بنظام هجين (مقر العمل + عن بُعد)') },
          { value: 'not_working', label: t('No job', 'من غير عمل حاليًا') },
        ]}
      />

      <ChoiceGroup
        label={t('Monthly income range', 'الدخل الشهري')}
        value={em.monthlyIncomeRange ?? ''}
        onChange={(v) => set({ monthlyIncomeRange: v })}
        options={incomeOptions.map((r) => ({ value: r, label: r }))}
        hint={t('Kept private until mutual interest is expressed', 'بيفضل سري لحد ما يبقى في اهتمام متبادل')}
        labelExtra={<FieldVisibilityToggle fieldKey="employment.monthlyIncomeRange" />}
      />

      <UploadField
        label={t('Employment letter / business registration / professional license', 'خطاب عمل / سجل تجاري / رخصة مزاولة مهنة')}
        optional
        defaultUploaded={em.proofUploaded}
        onUploaded={(v) => set({ proofUploaded: v })}
      />
    </div>
  )
}
