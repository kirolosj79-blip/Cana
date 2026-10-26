import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Generic profile-field visibility system.
 *
 * Design: a single flat map of `fieldKey -> boolean`, not a bespoke
 * `is_visible` column per field/table. Any new field or feature added later
 * just needs a `fieldKey` string — no new logic, no schema change, no
 * per-field branching. Default is "visible" for any key not present in the
 * map (see `isVisible`), matching "default = ON" from the spec. Turning a
 * field off only affects what's rendered on the public profile; the
 * underlying data (in the registration draft) is untouched.
 *
 * In a real backend this would be a single `profile_field_visibility`
 * table keyed by (user_id, field_key) — the same flat-map shape translates
 * directly, which is the point.
 */
interface FieldVisibilityState {
  hidden: Record<string, boolean>
  setVisible: (fieldKey: string, visible: boolean) => void
  isVisible: (fieldKey: string) => boolean
}

export const useFieldVisibilityStore = create<FieldVisibilityState>()(
  persist(
    (set, get) => ({
      hidden: {},
      setVisible: (fieldKey, visible) =>
        set((s) => ({ hidden: { ...s.hidden, [fieldKey]: !visible } })),
      isVisible: (fieldKey) => !get().hidden[fieldKey],
    }),
    { name: 'cana-field-visibility' }
  )
)

/** Registry of fields the visibility system currently covers, with display
 * labels — used to render the toggle list in Edit Profile. Add an entry
 * here to extend the system to a new field; no other code needs to change.
 * Grouped loosely by registration section for a more organized toggle list. */
export const VISIBILITY_CONTROLLED_FIELDS: { key: string; en: string; ar: string; groupEn: string; groupAr: string }[] = [
  { key: 'personal.displayName', en: 'Name', ar: 'الاسم', groupEn: 'Personal', groupAr: 'شخصي' },
  { key: 'personal.dateOfBirth', en: 'Age', ar: 'العمر', groupEn: 'Personal', groupAr: 'شخصي' },
  { key: 'personal.cityState', en: 'City', ar: 'المدينة', groupEn: 'Personal', groupAr: 'شخصي' },
  { key: 'personal.nationality', en: 'Nationality', ar: 'الجنسية', groupEn: 'Personal', groupAr: 'شخصي' },
  { key: 'personal.languagesSpoken', en: 'Languages', ar: 'اللغات', groupEn: 'Personal', groupAr: 'شخصي' },
  { key: 'church.denomination', en: 'Denomination', ar: 'الطائفة', groupEn: 'Faith', groupAr: 'الإيمان' },
  { key: 'church.churchName', en: 'Church name', ar: 'اسم الكنيسة', groupEn: 'Faith', groupAr: 'الإيمان' },
  { key: 'eligibility.everMarried', en: 'Marital history', ar: 'الحالة الاجتماعية السابقة', groupEn: 'Eligibility', groupAr: 'الأهلية' },
  { key: 'family.numberOfBrothers', en: 'Number of brothers', ar: 'عدد الإخوة', groupEn: 'Family', groupAr: 'العائلة' },
  { key: 'education.level', en: 'Education level', ar: 'المستوى التعليمي', groupEn: 'Education', groupAr: 'التعليم' },
  { key: 'employment.occupation', en: 'Occupation', ar: 'الوظيفة', groupEn: 'Employment', groupAr: 'الوظيفة' },
  { key: 'employment.monthlyIncomeRange', en: 'Income range', ar: 'نطاق الدخل', groupEn: 'Employment', groupAr: 'الوظيفة' },
  { key: 'lifestyle.freeTimeActivities', en: 'Hobbies & interests', ar: 'الهوايات والاهتمامات', groupEn: 'Lifestyle', groupAr: 'نمط الحياة' },
  { key: 'lifestyle.smoking', en: 'Smoking habits', ar: 'عادات التدخين', groupEn: 'Lifestyle', groupAr: 'نمط الحياة' },
  { key: 'gettingToKnowYou.desiredMarriageValues', en: 'Values you look for', ar: 'القيم اللي بتدور عليها', groupEn: 'Getting to Know You', groupAr: 'تعرف عليك أكثر' },
  { key: 'gettingToKnowYou.marriageTimeline', en: 'Marriage timeline', ar: 'استعداد الجواز', groupEn: 'Getting to Know You', groupAr: 'تعرف عليك أكثر' },
  { key: 'compatibilityPreferences.ageRangeMin', en: 'Age preference range', ar: 'نطاق السن المفضل', groupEn: 'Compatibility', groupAr: 'التوافق' },
  { key: 'health.chronicConditions', en: 'Chronic medical conditions', ar: 'الحالات الصحية المزمنة', groupEn: 'Health', groupAr: 'الصحة' },
  { key: 'health.physicalDisabilities', en: 'Physical disabilities', ar: 'الإعاقات الجسدية', groupEn: 'Health', groupAr: 'الصحة' },
  { key: 'health.dailyLifeImpact', en: 'Daily-life impact', ar: 'تأثير الحالة على الحياة اليومية', groupEn: 'Health', groupAr: 'الصحة' },
]
