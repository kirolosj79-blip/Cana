import { useRegistrationStore } from '@/store/registration.store'
import { Textarea } from '@/shared/components/ui/Textarea'
import { ChoiceGroup } from '@/shared/components/ui/ChoiceGroup'
import { YesNoToggle } from '@/shared/components/ui/Toggle'
import { chronicMedicalConditionOptions, physicalDisabilityOptions } from '@/features/registration/data/options'
import { FieldVisibilityToggle } from '@/shared/components/ui/FieldVisibilityToggle'
import { useLanguage } from '@/core/hooks/useLanguage'

export function HealthStep() {
  const { draft, updateSection } = useRegistrationStore()
  const h = draft.health
  const set = (data: Partial<typeof h>) => updateSection('health', data)
  const isFemale = draft.gender === 'female'
  const { t } = useLanguage()

  const chronicConditions = h.chronicConditions ?? []
  const physicalDisabilities = h.physicalDisabilities ?? []

  return (
    <div className="space-y-6">
      <div className="rounded-[var(--r-md)] bg-info-100 border border-info-500/20 px-4 py-3 text-xs text-info-500">
        {t(
          'This section is voluntary and treated with care — your privacy is respected and shared only according to your permission.',
          'القسم ده اختياري وبيتعامل معاه بحرص — خصوصيتك محترمة، ومش هيتشارك إلا بموافقتك.'
        )}
      </div>

      <p className="text-sm font-medium text-ink-800">
        {t(
          'Do you currently have any chronic medical conditions or physical disabilities that you believe a potential spouse should be aware of?',
          'هل عندك أي حالات صحية مزمنة أو إعاقات جسدية تحس إنه يستاهل شريك حياتك يعرفها؟'
        )}
      </p>

      <ChoiceGroup
        label={t('Chronic Medical Conditions', 'الحالات الصحية المزمنة')}
        hint={t('Select all that apply', 'اختار كل اللي ينطبق')}
        multi
        columns={2}
        value={chronicConditions}
        onChange={(v) => set({ chronicConditions: v })}
        options={chronicMedicalConditionOptions.map((o) => ({ value: o.value, label: t(o.en, o.ar) }))}
        labelExtra={<FieldVisibilityToggle fieldKey="health.chronicConditions" />}
      />
      {chronicConditions.includes('other') && (
        <Textarea
          label={t('Please specify', 'وضّح من فضلك')}
          value={h.chronicConditionOther ?? ''}
          onChange={(e) => set({ chronicConditionOther: e.target.value })}
        />
      )}

      <ChoiceGroup
        label={t('Physical Disabilities', 'الإعاقات الجسدية')}
        hint={t('Select all that apply', 'اختار كل اللي ينطبق')}
        multi
        columns={2}
        value={physicalDisabilities}
        onChange={(v) => set({ physicalDisabilities: v })}
        options={physicalDisabilityOptions.map((o) => ({ value: o.value, label: t(o.en, o.ar) }))}
        labelExtra={<FieldVisibilityToggle fieldKey="health.physicalDisabilities" />}
      />
      {physicalDisabilities.includes('other') && (
        <Textarea
          label={t('Please specify', 'وضّح من فضلك')}
          value={h.physicalDisabilityOther ?? ''}
          onChange={(e) => set({ physicalDisabilityOther: e.target.value })}
        />
      )}

      <ChoiceGroup
        label={t(
          'Does your condition or disability currently affect your daily life or your ability to participate in a marriage or family life?',
          'الحالة أو الإعاقة بتأثر على حياتك اليومية أو قدرتك على المشاركة في حياة زوجية وأسرية؟'
        )}
        value={h.dailyLifeImpact ?? ''}
        onChange={(v) => set({ dailyLifeImpact: v })}
        options={[
          { value: 'no', label: t('No', 'لأ') },
          { value: 'mild', label: t('Yes — Mildly', 'أيوه — بشكل بسيط') },
          { value: 'moderate', label: t('Yes — Moderately', 'أيوه — بشكل متوسط') },
          { value: 'significant', label: t('Yes — Significantly', 'أيوه — بشكل كبير') },
          { value: 'prefer_not_to_disclose', label: t('Prefer not to disclose', 'بفضّل مايتشاركش') },
        ]}
        labelExtra={<FieldVisibilityToggle fieldKey="health.dailyLifeImpact" />}
      />

      {h.dailyLifeImpact && h.dailyLifeImpact !== 'no' && h.dailyLifeImpact !== 'prefer_not_to_disclose' && (
        <>
          <YesNoToggle
            label={t(
              'Would you like to provide additional information that you believe would be important for a potential spouse to know?',
              `حابب${isFemale ? 'ة' : ''} تضيف${isFemale ? 'ي' : ''} أي معلومة إضافية تحس إنها مهمة إن شريك حياتك يعرفها؟`
            )}
            value={h.wantsToShareAdditionalInfo}
            onChange={(v) => set({ wantsToShareAdditionalInfo: v })}
          />
          {h.wantsToShareAdditionalInfo && (
            <Textarea
              label={t('Additional information', 'معلومات إضافية')}
              value={h.additionalInfo ?? ''}
              onChange={(e) => set({ additionalInfo: e.target.value })}
              rows={4}
            />
          )}
        </>
      )}
    </div>
  )
}
