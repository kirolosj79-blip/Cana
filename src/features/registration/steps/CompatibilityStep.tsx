import { useRegistrationStore } from '@/store/registration.store'
import { toOptionalNumber } from '@/shared/utils/number'
import { Input } from '@/shared/components/ui/Input'
import { ChoiceGroup } from '@/shared/components/ui/ChoiceGroup'
import { denominationOptions, residenceCountryOptions } from '@/features/registration/data/options'
import { sortBilingual } from '@/shared/utils/sortBilingual'
import { useLanguage } from '@/core/hooks/useLanguage'
import { FieldVisibilityToggle } from '@/shared/components/ui/FieldVisibilityToggle'

export function CompatibilityStep() {
  const { draft, updateSection } = useRegistrationStore()
  const c = draft.compatibilityPreferences
  const set = (data: Partial<typeof c>) => updateSection('compatibilityPreferences', data)
  const { language, t } = useLanguage()

  // The desired partner is the opposite of the member's own gender —
  // Arabic needs the correct grammatical gender throughout ("شريك حياتك"
  // vs "شريكة حياتك", "سنه" vs "سنها"), so every question is built from
  // this rather than a fixed neutral phrase.
  const isMale = draft.gender === 'male' // partner is female
  const isFemale = draft.gender === 'female'
  const partner = isMale ? 'شريكة حياتك' : 'شريك حياتك'
  const suf = isMale ? 'ها' : 'ه' // possessive suffix: -ha (her) / -o (his)
  const tHb = isFemale ? 'تحبي' : 'تحب' // "you like/want" — member's own gender
  const tHbh = isFemale ? 'تحبيه' : 'تحبه' // same + "it" object suffix
  const name = draft.personal.firstName?.trim()
  const greet = (ar: string) => (name ? `يا ${name}، ${ar}` : ar)

  return (
    <div className="space-y-6">
      <p className="text-sm on-photo-text">
        {t("Tell us who you're looking for. This powers your daily recommended matches.", greet(`قولنا ${tHb} شريك حياتك يبقى إزاي؟ ده بيحدد ترشيحاتك اليومية.`))}
      </p>

      <div className="flex items-center justify-between">
        <span className="text-sm font-bold on-photo-text">
          {t(`What age would you like your partner to be?`, `${tHb} سن ${partner} يبقى كام؟`)}
        </span>
        <FieldVisibilityToggle fieldKey="compatibilityPreferences.ageRangeMin" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input
          label={t('Min age', 'أقل سن')}
          type="number"
          value={c.ageRangeMin ?? ''}
          onChange={(e) => set({ ageRangeMin: toOptionalNumber(e.target.value) })}
          error={
            c.ageRangeMin !== undefined && c.ageRangeMin < 20
              ? t('Must be 20 or older', 'لازم يكون 20 سنة أو أكتر')
              : c.ageRangeMin !== undefined && c.ageRangeMax !== undefined && c.ageRangeMin > c.ageRangeMax
              ? t('Min age must not be greater than max age', 'أقل سن لازم يكون أصغر من أو يساوي أعلى سن')
              : undefined
          }
        />
        <Input
          label={t('Max age', 'أعلى سن')}
          type="number"
          value={c.ageRangeMax ?? ''}
          onChange={(e) => set({ ageRangeMax: toOptionalNumber(e.target.value) })}
          error={
            c.ageRangeMax !== undefined && c.ageRangeMax < 20
              ? t('Must be 20 or older', 'لازم يكون 20 سنة أو أكتر')
              : c.ageRangeMin !== undefined && c.ageRangeMax !== undefined && c.ageRangeMax < c.ageRangeMin
              ? t('Max age must not be less than min age', 'أعلى سن لازم يكون أكبر من أو يساوي أقل سن')
              : undefined
          }
        />
      </div>

      <ChoiceGroup
        label={t('Where would you like your partner to be from?', `${partner} ${tHb} يكون منين؟`)}
        multi
        columns={2}
        value={c.countryPreference ?? []}
        onChange={(v) => set({ countryPreference: v })}
        options={sortBilingual(residenceCountryOptions, language).map((o) => ({ value: o.value, label: language === 'ar' ? o.ar : o.en }))}
      />

      <ChoiceGroup
        label={t('How would you like your partner\'s height to compare to yours?', `طول ${partner} ${tHbh} يبقى إزاي بالنسبة لطولك؟`)}
        columns={2}
        value={c.heightPreference ?? ''}
        onChange={(v) => set({ heightPreference: v })}
        options={[
          { value: 'no_preference', label: t('No preference', 'مفيش تفضيل معين') },
          { value: 'shorter_than_me', label: t('Shorter than me', 'أقصر مني') },
          { value: 'similar_height', label: t('Similar height', 'قريب من طولي') },
          { value: 'taller_than_me', label: t('Taller than me', 'أطول مني') },
        ]}
      />
      <ChoiceGroup
        label={t("What level of education would you like your partner to have?", `${tHb} ${partner} يكون مستوا${suf} التعليمي إيه؟`)}
        columns={2}
        value={c.educationPreference ?? ''}
        onChange={(v) => set({ educationPreference: v })}
        options={[
          { value: 'no_preference', label: t('No preference', 'مفيش تفضيل معين') },
          { value: 'bachelors', label: t("Bachelor's or higher", 'بكالوريوس فأعلى') },
          { value: 'masters', label: t("Master's or higher", 'ماجستير فأعلى') },
          { value: 'doctorate', label: t('Doctorate', 'دكتوراه') },
        ]}
      />
      <ChoiceGroup
        label={t("What would you like your partner's work life to look like?", `${tHb} شغل ${partner} يبقى شكله إيه؟`)}
        columns={2}
        value={c.occupationPreference ?? ''}
        onChange={(v) => set({ occupationPreference: v })}
        options={[
          { value: 'no_preference', label: t('No preference', 'مفيش تفضيل معين') },
          { value: 'stable_income', label: t('Stable, steady income', 'دخل ثابت ومستقر') },
          { value: 'career_driven', label: t('Career-driven / ambitious', 'طموح/ة مهنيًا') },
          { value: 'flexible_schedule', label: t('Flexible schedule / more family time', 'وقت مرن / وقت أكتر للأسرة') },
        ]}
      />

      <ChoiceGroup
        label={t("Which church/denomination would you like your partner to belong to?", `${tHb} ${partner} يكون من أي طائفة؟`)}
        multi
        columns={2}
        value={c.churchPreference ?? []}
        onChange={(v) => set({ churchPreference: v })}
        options={denominationOptions.map((d) => ({ value: d.value, label: language === 'ar' ? d.ar : d.en }))}
      />

      <ChoiceGroup
        label={t("What's your partner's view on having children?", `رأي ${partner} في الأطفال ${tHbh} يكون إيه؟`)}
        columns={2}
        value={c.childrenPreference ?? ''}
        onChange={(v) => set({ childrenPreference: v })}
        options={[
          { value: 'no_preference', label: t('No preference', 'مفيش تفضيل معين') },
          { value: 'wants_children', label: t('Wants children', 'عايز/ة أطفال') },
          { value: 'open_to_discussion', label: t('Open to discussion', 'مفتوح للنقاش') },
          { value: 'prefers_no_children', label: t('Prefers no children', 'يفضّل من غير أطفال') },
        ]}
      />
      <ChoiceGroup
        label={t('What languages would you like your partner to speak?', `${tHb} ${partner} يتكلم إيه؟`)}
        multi
        columns={3}
        value={c.languagePreference ?? []}
        onChange={(v) => set({ languagePreference: v })}
        options={[
          { value: 'Arabic', label: t('Arabic', 'عربي') },
          { value: 'English', label: t('English', 'إنجليزي') },
          { value: 'French', label: t('French', 'فرنساوي') },
        ]}
      />
    </div>
  )
}
