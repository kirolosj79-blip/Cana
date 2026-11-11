import { useRegistrationStore } from '@/store/registration.store'
import { toOptionalNumber } from '@/shared/utils/number'
import { Input } from '@/shared/components/ui/Input'
import { ChoiceGroup } from '@/shared/components/ui/ChoiceGroup'
import { YesNoToggle } from '@/shared/components/ui/Toggle'
import { UploadField } from '@/shared/components/ui/UploadField'
import { FieldVisibilityToggle } from '@/shared/components/ui/FieldVisibilityToggle'
import { useLanguage } from '@/core/hooks/useLanguage'

export function EligibilityStep() {
  const { draft, updateSection } = useRegistrationStore()
  const e = draft.eligibility
  const set = (data: Partial<typeof e>) => updateSection('eligibility', data)
  const isFemale = draft.gender === 'female'
  const { t } = useLanguage()

  return (
    <div className="space-y-6">
      <YesNoToggle
        label={t('Have you ever been married before?', `اتجوزت${isFemale ? 'ي' : ''} قبل كده؟`)}
        value={e.everMarried}
        onChange={(v) => set({ everMarried: v })}
        labelExtra={<FieldVisibilityToggle fieldKey="eligibility.everMarried" />}
      />

      {e.everMarried && (
        <div className="space-y-5 rounded-[var(--r-md)] border border-ink-100 bg-parchment-0 p-4">
          <Input
            label={t('Date of previous marriage', 'تاريخ الجواز السابق')}
            type="date"
            value={e.previousMarriage?.date ?? ''}
            onChange={(ev) => set({ previousMarriage: { ...(e.previousMarriage as any), date: ev.target.value } })}
          />
          <ChoiceGroup
            label={t('Was the marriage:', 'كان الجواز:')}
            columns={2}
            value={e.previousMarriage?.type ?? ''}
            onChange={(v) => set({ previousMarriage: { ...(e.previousMarriage as any), type: v } })}
            options={[
              { value: 'church', label: t('Church marriage', 'جواز كنسي') },
              { value: 'civil', label: t('Civil marriage only', 'جواز مدني بس') },
            ]}
          />
          <ChoiceGroup
            label={t('Current marital status', 'حالتك الاجتماعية دلوقتي')}
            value={e.currentMaritalStatus ?? ''}
            onChange={(v) => set({ currentMaritalStatus: v })}
            options={[
              { value: 'divorced', label: t('Divorced', `مطلّق${isFemale ? 'ة' : ''}`) },
              { value: 'widowed', label: t('Widowed', `أرمل${isFemale ? 'ة' : ''}`) },
            ]}
          />

          {e.currentMaritalStatus === 'divorced' && (
            <UploadField label={t('Divorce certificate', 'وثيقة الطلاق')} defaultUploaded={e.divorceCertificateUploaded} onUploaded={(v) => set({ divorceCertificateUploaded: v })} />
          )}
          {e.currentMaritalStatus === 'widowed' && (
            <UploadField label={t('Death certificate of spouse', 'شهادة وفاة الزوج/الزوجة')} defaultUploaded={e.deathCertificateUploaded} onUploaded={(v) => set({ deathCertificateUploaded: v })} />
          )}
          <UploadField
            label={t('Church approval / permission (if required)', 'موافقة الكنيسة (لو مطلوبة)')}
            optional
            defaultUploaded={e.churchApprovalUploaded}
            onUploaded={(v) => set({ churchApprovalUploaded: v })}
          />

          <YesNoToggle
            label={t('Do you have children from previous relationships?', 'عندك أطفال من جواز سابق؟')}
            value={e.hasChildrenFromPrevious}
            onChange={(v) => set({ hasChildrenFromPrevious: v })}
          />
          {e.hasChildrenFromPrevious && (
            <div className="space-y-4">
              <Input
                label={t('Number of children', 'عدد الأطفال')}
                type="number"
                value={e.numberOfChildren ?? ''}
                onChange={(ev) => set({ numberOfChildren: toOptionalNumber(ev.target.value) })}
              />
              <Input
                label={t('Ages (comma separated)', 'أعمارهم (افصل بفاصلة)')}
                value={(e.childrenAges ?? []).join(', ')}
                onChange={(ev) => set({ childrenAges: ev.target.value.split(',').map((s) => Number(s.trim())).filter((n) => !isNaN(n)) })}
              />
              <ChoiceGroup
                label={t('Living arrangement', 'ترتيبات السكن')}
                value={e.livingArrangement ?? ''}
                onChange={(v) => set({ livingArrangement: v })}
                options={[
                  { value: 'Full-time with me', label: t('Full-time with me', 'بيعيشوا معايا طول الوقت') },
                  { value: 'Full-time with the other parent', label: t('Full-time with the other parent', 'بيعيشوا مع الوالد/ة التاني/ة') },
                  { value: 'Shared custody', label: t('Shared custody', 'حضانة مشتركة') },
                  { value: 'Other', label: t('Other', 'أخرى') },
                ]}
              />
              <ChoiceGroup
                label={t('Relationship with children', 'علاقتك بأطفالك')}
                value={e.relationshipWithChildren ?? ''}
                onChange={(v) => set({ relationshipWithChildren: v })}
                options={[
                  { value: 'Close and involved', label: t('Close and involved', 'قريب ومتابع') },
                  { value: 'Regular contact', label: t('Regular contact', 'تواصل منتظم') },
                  { value: 'Limited contact', label: t('Limited contact', 'تواصل محدود') },
                  { value: 'Working on the relationship', label: t('Working on the relationship', 'بشتغل على تحسين العلاقة') },
                ]}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
