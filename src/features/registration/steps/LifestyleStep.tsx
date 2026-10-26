import { useRegistrationStore } from '@/store/registration.store'
import { ChoiceGroup } from '@/shared/components/ui/ChoiceGroup'
import { habitFrequencyOptions, freeTimeOptions } from '@/features/registration/data/options'
import { useLanguage } from '@/core/hooks/useLanguage'
import { FieldVisibilityToggle } from '@/shared/components/ui/FieldVisibilityToggle'

const freeTimeLabelsAr: Record<string, string> = {
  'Spending time with family': 'قضاء وقت مع العائلة',
  'Church activities or volunteering': 'أنشطة كنسية أو تطوع',
  'Reading': 'القراءة',
  'Sports or fitness': 'رياضة',
  'Traveling': 'السفر',
  'Movies or TV': 'أفلام أو مسلسلات',
  'Music': 'موسيقى',
  'Outdoor activities': 'أنشطة في الهواء الطلق',
  'Cooking or baking': 'طبخ أو بيكري',
  'Arts and crafts': 'فنون وأشغال يدوية',
  'Gaming': 'ألعاب',
  'Learning new skills': 'تعلم مهارات جديدة',
}

const petLabelsAr: Record<string, string> = {
  'I love pets.': 'بحب الحيوانات الأليفة جدًا.',
  'I like pets.': 'بحب الحيوانات الأليفة.',
  "I don't mind either way.": 'مش فارقة معايا.',
  'I prefer not to have pets.': 'بفضّل معنديش حيوانات أليفة.',
  'I have pet allergies.': 'عندي حساسية من الحيوانات.',
}

export function LifestyleStep() {
  const { draft, updateSection } = useRegistrationStore()
  const l = draft.lifestyle
  const isFemale = draft.gender === 'female'
  const set = (data: Partial<typeof l>) => updateSection('lifestyle', data)
  const { language, t } = useLanguage()

  return (
    <div className="space-y-6">
      <ChoiceGroup
        label={t('Do you smoke?', `بتدخن${isFemale ? 'ي' : ''}؟`)}
        columns={2}
        value={l.smoking ?? ''}
        onChange={(v) => set({ smoking: v })}
        options={habitFrequencyOptions.map((o) => ({ value: o.value, label: language === 'ar' ? o.ar : o.en }))}
        labelExtra={<FieldVisibilityToggle fieldKey="lifestyle.smoking" />}
      />
      <ChoiceGroup
        label={t('Do you consume alcoholic beverages?', `بتشرب${isFemale ? 'ي' : ''} كحوليات؟`)}
        columns={2}
        value={l.alcohol ?? ''}
        onChange={(v) => set({ alcohol: v })}
        options={habitFrequencyOptions.map((o) => ({ value: o.value, label: language === 'ar' ? o.ar : o.en }))}
      />
      <ChoiceGroup
        label={t('How do you feel about pets?', 'رأيك في الحيوانات الأليفة؟')}
        value={l.petPreference ?? ''}
        onChange={(v) => set({ petPreference: v })}
        options={Object.keys(petLabelsAr).map((key) => ({ value: key, label: t(key, petLabelsAr[key]) }))}
      />

      <ChoiceGroup
        label={t('Which best describes your personality in social situations?', `إزاي توصف${isFemale ? 'ي' : ''} شخصيتك في المواقف الاجتماعية؟`)}
        value={l.socialPersonality ?? ''}
        onChange={(v) => set({ socialPersonality: v })}
        options={[
          { value: 'introvert', label: t('Mostly introverted', `انطوائي${isFemale ? 'ة' : ''} غالبًا`), description: t('I enjoy quiet, smaller settings.', 'بحب الأماكن الهادية والصغيرة.') },
          { value: 'extrovert', label: t('Mostly extroverted', `اجتماعي${isFemale ? 'ة' : ''} غالبًا`), description: t('I enjoy meeting people and social activities.', 'بحب مقابلة الناس والأنشطة الاجتماعية.') },
          { value: 'balanced', label: t('A balance of both', 'على حسب الموقف'), description: t('Depends on the situation, not fixed either way.', 'مش ثابتة على حالة واحدة، بتختلف حسب الظرف.') },
        ]}
      />

      <ChoiceGroup
        label={t('How do you usually enjoy spending your free time?', `إزاي بتحب${isFemale ? 'ي' : ''} تقضي وقت فراغك؟`)}
        multi
        columns={2}
        value={l.freeTimeActivities ?? []}
        onChange={(v) => set({ freeTimeActivities: v })}
        options={freeTimeOptions.map((f) => ({ value: f, label: t(f, freeTimeLabelsAr[f] ?? f) }))}
        labelExtra={<FieldVisibilityToggle fieldKey="lifestyle.freeTimeActivities" />}
      />
    </div>
  )
}
