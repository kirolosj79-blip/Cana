import { useRegistrationStore } from '@/store/registration.store'
import { ChoiceGroup } from '@/shared/components/ui/ChoiceGroup'
import {
  menFamilyGoalsOptions, menCareerExpectationOptions,
  womenPriorityQualitiesOptions, womenFeelLovedOptions,
} from '@/features/registration/data/options'
import { useLanguage } from '@/core/hooks/useLanguage'

const menFamilyGoalsAr: Record<string, string> = {
  'Building a Christ-centered family': 'بناء عائلة محورها المسيح',
  'Creating a loving and supportive home': 'بيت مليان حب ودعم',
  'Providing stability and security': 'توفير استقرار وأمان',
  'Growing together as a couple': 'النمو مع بعض كزوجين',
}
const menCareerAr: Record<string, string> = {
  'I support my wife working full-time': 'بشجع مراتي تشتغل دوام كامل',
  'I support my wife working part-time': 'بشجع مراتي تشتغل دوام جزئي',
  'I prefer my wife to focus on the home and family': 'بفضّل مراتي تركز على البيت والعيلة',
  'I am open to discussing what works best for both of us': 'مفتوح نتناقش إيه الأنسب لينا الاتنين',
}
const womenQualitiesAr: Record<string, string> = {
  'A God-fearing man': 'رجل يخاف الله',
  'Responsible and committed': 'مسؤول وملتزم',
  'Calm and composed': 'هادئ ومتزن',
  'Kind and affectionate': 'حنون وطيب',
  'Honest and clear': 'صادق وواضح',
  'Respects women': 'يحترم المرأة',
  'Good at dialogue and communication': 'عنده قدرة على الحوار',
  'Has a vision for his life': 'عنده رؤية لحياته',
  'Psychologically stable': 'مستقر نفسيًا',
  'Financially stable': 'مستقر ماليًا',
  'Loves children': 'يحب الأطفال',
  'Supportive and encouraging': 'داعم ومشجع',
  'Has a leadership spirit': 'عنده روح القيادة',
  'Has a spirit of partnership': 'عنده روح المشاركة',
  'Values family life': 'يقدّر الحياة الأسرية',
}
const womenFeelLovedAr: Record<string, string> = {
  'Open and honest communication': 'تواصل صريح وصادق',
  'Quality time together': 'وقت مميز مع بعض',
  'Emotional support': 'دعم عاطفي',
  'Affection and appreciation': 'حنان وتقدير',
  'Faith and prayer together': 'إيمان وصلاة مع بعض',
  'Trust and commitment': 'ثقة والتزام',
}

function MenSection() {
  const { draft, updateSection } = useRegistrationStore()
  const m = draft.menSpecific
  const set = (data: Partial<typeof m>) => updateSection('menSpecific', data)
  const { t } = useLanguage()

  return (
    <div className="space-y-6">
      <p className="text-sm on-photo-text">{t('Questions for Men Seeking a Wife', 'أسئلة للرجال الباحثين عن زوجة')}</p>
      <ChoiceGroup
        label={t('What are your expectations and goals for your future family?', 'إيه توقعاتك وأهدافك لعائلتك المستقبلية؟')}
        multi
        value={m.familyGoals ?? []}
        onChange={(v) => set({ familyGoals: v })}
        options={menFamilyGoalsOptions.map((o) => ({ value: o, label: t(o, menFamilyGoalsAr[o] ?? o) }))}
      />
      <ChoiceGroup
        label={t("What are your expectations regarding your future wife's career?", 'توقعاتك بخصوص شغل زوجة المستقبل؟')}
        value={m.wifeCareerExpectation ?? ''}
        onChange={(v) => set({ wifeCareerExpectation: v })}
        options={menCareerExpectationOptions.map((o) => ({ value: o, label: t(o, menCareerAr[o] ?? o) }))}
      />
      <ChoiceGroup
        label={t('What is your housing plan after marriage?', 'خطتك للسكن بعد الجواز؟')}
        value={m.housingPlan ?? ''}
        onChange={(v) => set({ housingPlan: v })}
        options={[
          { value: 'Continue living in my current home', label: t('Continue living in my current home', 'أكمل في سكني الحالي') },
          { value: 'Purchase a new home', label: t('Purchase a new home', 'أشتري بيت جديد') },
          { value: 'Rent a home together', label: t('Rent a home together', 'نأجر بيت مع بعض') },
          { value: 'Move closer to family', label: t('Move closer to family', 'أقرب من العيلة') },
          { value: 'Open to discussing options together', label: t('Open to discussing options together', 'مفتوح نتناقش في الخيارات') },
        ]}
      />
    </div>
  )
}

function WomenSection() {
  const { draft, updateSection } = useRegistrationStore()
  const w = draft.womenSpecific
  const set = (data: Partial<typeof w>) => updateSection('womenSpecific', data)
  const { t } = useLanguage()

  return (
    <div className="space-y-6">
      <p className="text-sm on-photo-text">{t('Questions for Women Seeking a Husband', 'أسئلة للسيدات الباحثات عن زوج')}</p>
      <ChoiceGroup
        label={t('What qualities are most important to you in a future husband?', 'إيه أهم الصفات اللي عايزاها في زوج المستقبل؟')}
        multi
        value={w.priorityHusbandQualities ?? []}
        onChange={(v) => set({ priorityHusbandQualities: v })}
        options={womenPriorityQualitiesOptions.map((o) => ({ value: o, label: t(o, womenQualitiesAr[o] ?? o) }))}
      />
      <ChoiceGroup
        label={t('How do you view the role and responsibilities of a wife in marriage?', 'إزاي شايفة دور ومسؤوليات الزوجة في الجواز؟')}
        hint={t('Select all that apply', 'اختار كل اللي ينطبق')}
        multi
        value={w.wifeRoleAspects ?? []}
        onChange={(v) => set({ wifeRoleAspects: v })}
        options={[
          { value: 'Supporting her husband', label: t('Supporting her husband', 'دعم الزوج') },
          { value: 'Building a loving home', label: t('Building a loving home', 'بناء بيت مليان حب') },
          { value: 'Spiritual partnership', label: t('Spiritual partnership', 'شراكة روحية') },
          { value: 'Open communication', label: t('Open communication', 'تواصل مفتوح') },
          { value: "Supporting each other's goals", label: t("Supporting each other's goals", 'دعم أهداف بعض') },
        ]}
      />
      <ChoiceGroup
        label={t("What are your expectations regarding your future husband's career and financial goals?", 'توقعاتك بخصوص شغل وأهداف زوج المستقبل المالية؟')}
        value={w.husbandCareerExpectation ?? ''}
        onChange={(v) => set({ husbandCareerExpectation: v })}
        options={[
          { value: 'Career growth is very important', label: t('Career growth is very important', 'التطور المهني مهم جدًا') },
          { value: 'Stability and responsibility are most important', label: t('Stability and responsibility are most important', 'الاستقرار والمسؤولية أهم حاجة') },
          { value: 'Flexible depending on family needs', label: t('Flexible depending on family needs', 'مرن حسب احتياجات العيلة') },
          { value: 'Open to discussing together', label: t('Open to discussing together', 'مفتوح نتناقش مع بعض') },
        ]}
      />
      <ChoiceGroup
        label={t('Are you willing to relocate after marriage?', 'مستعدة تنتقلي بعد الجواز؟')}
        columns={3}
        value={w.willingToRelocate ?? ''}
        onChange={(v) => set({ willingToRelocate: v })}
        options={[
          { value: 'yes', label: t('Yes', 'أيوه') },
          { value: 'no', label: t('No', 'لأ') },
          { value: 'maybe', label: t('Maybe', 'ممكن') },
        ]}
      />
      <ChoiceGroup
        label={t('What are your expectations regarding family life?', 'توقعاتك بخصوص حياة الأسرة؟')}
        hint={t('Select all that apply', 'اختار كل اللي ينطبق')}
        multi
        columns={2}
        value={w.familyLifeExpectationAspects ?? []}
        onChange={(v) => set({ familyLifeExpectationAspects: v })}
        options={[
          { value: 'Having and raising children', label: t('Having and raising children', 'إنجاب وتربية أطفال') },
          { value: 'Close relationship with extended family', label: t('Close relationship with extended family', 'علاقة قريبة بالعيلة الكبيرة') },
          { value: 'Keeping traditions and celebrations', label: t('Keeping traditions and celebrations', 'الحفاظ على التقاليد والاحتفالات') },
          { value: 'Shared household responsibilities', label: t('Shared household responsibilities', 'مسؤوليات البيت مشتركة') },
          { value: 'Joint financial decisions', label: t('Joint financial decisions', 'قرارات مالية مشتركة') },
        ]}
      />
      <ChoiceGroup
        label={t('What helps you feel loved, respected, and secure in a marriage?', 'إيه اللي بيخليكي حاسة بالحب والاحترام والأمان؟')}
        multi
        value={w.feelLovedFactors ?? []}
        onChange={(v) => set({ feelLovedFactors: v })}
        options={womenFeelLovedOptions.map((o) => ({ value: o, label: t(o, womenFeelLovedAr[o] ?? o) }))}
      />
      <ChoiceGroup
        label={t('How do you prefer to handle disagreements?', 'إزاي بتفضّلي تتعاملي مع الخلافات؟')}
        value={w.conflictHandlingPreference ?? ''}
        onChange={(v) => set({ conflictHandlingPreference: v })}
        options={[
          { value: 'Discuss calmly and seek solutions together', label: t('Discuss calmly and seek solutions together', 'نتكلم بهدوء ونلاقي حل مع بعض') },
          { value: 'Need time before discussing', label: t('Need time before discussing', 'محتاجة وقت قبل ما نتكلم') },
          { value: 'Prefer guidance from trusted family/spiritual advisors', label: t('Prefer guidance from trusted family/spiritual advisors', 'بفضّل نصيحة من عيلة أو مرشد روحي') },
        ]}
      />
    </div>
  )
}

export function GenderSpecificStep() {
  const gender = useRegistrationStore((s) => s.draft.gender)
  if (gender === 'female') return <WomenSection />
  return <MenSection />
}
