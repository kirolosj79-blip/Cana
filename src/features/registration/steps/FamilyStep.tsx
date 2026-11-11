import { useEffect } from 'react'
import { useRegistrationStore } from '@/store/registration.store'
import { toOptionalNumber } from '@/shared/utils/number'
import { Input } from '@/shared/components/ui/Input'
import { ChoiceGroup } from '@/shared/components/ui/ChoiceGroup'
import { YesNoToggle } from '@/shared/components/ui/Toggle'
import { FieldVisibilityToggle } from '@/shared/components/ui/FieldVisibilityToggle'
import { useLanguage } from '@/core/hooks/useLanguage'

export function FamilyStep() {
  const { draft, updateSection } = useRegistrationStore()
  const f = draft.family
  const set = (data: Partial<typeof f>) => updateSection('family', data)
  const isFemale = draft.gender === 'female'
  const { t } = useLanguage()

  // If exactly one parent has passed away, "one widowed" is the only
  // logically correct answer — no need to ask separately, and letting it
  // be picked independently allowed contradictions (e.g. mother marked
  // alive but status set to "widowed" anyway). If both have passed away,
  // that's "Other" (widowed describes one spouse outliving the other, not
  // both being deceased). Only when both parents are alive does the
  // member actually need to choose between Married/Divorced/Other.
  const bothAlive = f.fatherLiving === true && f.motherLiving === true
  const exactlyOneDeceased = (f.fatherLiving === false) !== (f.motherLiving === false) && (f.fatherLiving !== undefined && f.motherLiving !== undefined)
  const bothDeceased = f.fatherLiving === false && f.motherLiving === false

  useEffect(() => {
    if (exactlyOneDeceased && f.parentsMaritalStatus !== 'widowed') set({ parentsMaritalStatus: 'widowed' })
    else if (bothDeceased && f.parentsMaritalStatus !== 'other') set({ parentsMaritalStatus: 'other' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [f.fatherLiving, f.motherLiving])


  return (
    <div className="space-y-6">
      <div className="space-y-3 rounded-[var(--r-md)] border border-ink-100 bg-parchment-0 p-4">
        <p className="text-sm font-medium text-ink-700">{t("Father's Information", 'بيانات الأب')}</p>
        <Input label={t("Father's name", 'اسم الأب')} value={f.fatherName ?? ''} onChange={(e) => set({ fatherName: e.target.value })} />
        <Input label={t("Father's occupation", 'وظيفة الأب')} value={f.fatherOccupation ?? ''} onChange={(e) => set({ fatherOccupation: e.target.value })} />
        <YesNoToggle label={t('Is your father living?', 'الوالد على قيد الحياة؟')} value={f.fatherLiving} onChange={(v) => set({ fatherLiving: v })} />
      </div>

      <div className="space-y-3 rounded-[var(--r-md)] border border-ink-100 bg-parchment-0 p-4">
        <p className="text-sm font-medium text-ink-700">{t("Mother's Information", 'بيانات الأم')}</p>
        <Input label={t("Mother's name", 'اسم الأم')} value={f.motherName ?? ''} onChange={(e) => set({ motherName: e.target.value })} />
        <Input label={t("Mother's occupation", 'وظيفة الأم')} value={f.motherOccupation ?? ''} onChange={(e) => set({ motherOccupation: e.target.value })} />
        <YesNoToggle label={t('Is your mother living?', 'الوالدة على قيد الحياة؟')} value={f.motherLiving} onChange={(v) => set({ motherLiving: v })} />
      </div>

      {bothAlive ? (
        <ChoiceGroup
          label={t("Parents' marital status", 'الحالة الاجتماعية للوالدين')}
          columns={2}
          value={f.parentsMaritalStatus ?? ''}
          onChange={(v) => set({ parentsMaritalStatus: v })}
          options={[
            { value: 'married', label: t('Married', 'متزوجين') },
            { value: 'divorced', label: t('Divorced', 'منفصلين') },
            { value: 'other', label: t('Other', 'أخرى') },
          ]}
        />
      ) : (exactlyOneDeceased || bothDeceased) ? (
        <div className="rounded-[var(--r-md)] border border-ink-100 bg-ink-50 px-4 py-3">
          <p className="text-xs text-ink-500">{t("Parents' marital status", 'الحالة الاجتماعية للوالدين')}</p>
          <p className="text-sm font-medium text-ink-800 mt-0.5">
            {exactlyOneDeceased ? t('One parent has passed away', 'ترمّل أحد الوالدين') : t('Both parents have passed away', 'توفي الوالدان')}
          </p>
        </div>
      ) : null}

      <div className="flex items-center justify-between">
        <span className="text-sm font-bold on-photo-text">{t('Siblings', 'الإخوة والأخوات')}</span>
        <FieldVisibilityToggle fieldKey="family.numberOfBrothers" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input
          label={t('How many brothers?', 'عندك كام أخ؟')}
          type="number"
          value={f.numberOfBrothers ?? ''}
          onChange={(e) => set({ numberOfBrothers: toOptionalNumber(e.target.value) })}
        />
        <Input
          label={t('How many sisters?', 'عندك كام أخت؟')}
          type="number"
          value={f.numberOfSisters ?? ''}
          onChange={(e) => set({ numberOfSisters: toOptionalNumber(e.target.value) })}
        />
      </div>

      <ChoiceGroup
        label={t('Your birth order among siblings', 'ترتيبك بين إخوتك')}
        columns={2}
        value={f.birthOrder ?? ''}
        onChange={(v) => set({ birthOrder: v })}
        options={[
          { value: 'oldest', label: t('Oldest', 'الأكبر') },
          { value: 'middle', label: t('Middle', 'في النص') },
          { value: 'youngest', label: t('Youngest', 'الأصغر') },
          { value: 'only_child', label: t('Only child', 'ابن وحيد') },
        ]}
      />

      <ChoiceGroup
        label={t('Who do you currently live with?', `عايش${isFemale ? 'ة' : ''} مع مين دلوقتي؟`)}
        value={f.livesWith ?? ''}
        onChange={(v) => set({ livesWith: v })}
        options={[
          { value: 'Parents or family members', label: t('Parents or family members', 'الأهل أو أفراد العائلة') },
          { value: 'Alone', label: t('Alone', 'لوحدي') },
          { value: 'Roommate(s)', label: t('Roommate(s)', 'مع زميل/زملاء سكن') },
          { value: 'Spouse and/or children', label: t('Spouse and/or children', 'الزوج/ة والأطفال') },
          { value: 'Other', label: t('Other', 'أخرى') },
        ]}
      />
    </div>
  )
}
