import { useRegistrationStore } from '@/store/registration.store'
import { Input } from '@/shared/components/ui/Input'
import { ChoiceGroup } from '@/shared/components/ui/ChoiceGroup'
import { loveLanguageOptions, timelineOptions, personalityTraitOptions, areasOfGrowthOptions } from '@/features/registration/data/options'
import { useLanguage } from '@/core/hooks/useLanguage'
import { FieldVisibilityToggle } from '@/shared/components/ui/FieldVisibilityToggle'

const loveLanguagesAr: Record<string, string> = {
  'Spending quality time together': 'قضاء وقت مميز مع بعض',
  'Words of encouragement and appreciation': 'كلمات تشجيع وتقدير',
  'Acts of kindness and service': 'أفعال لطف وخدمة',
  'Thoughtful gifts': 'هدايا معبّرة',
  'Physical affection (within the commitment of marriage)': 'حنان جسدي (في إطار الجواز)',
  "Supporting their goals and dreams": 'دعم أهدافه/ا وأحلامه/ا',
}

function Q({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink-100 text-[11px] font-semibold text-ink-500 mt-0.5">
        {n}
      </span>
      <div className="flex-1">{children}</div>
    </div>
  )
}

export function GettingToKnowYouStep() {
  const { draft, updateSection } = useRegistrationStore()
  const g = draft.gettingToKnowYou
  const set = (data: Partial<typeof g>) => updateSection('gettingToKnowYou', data)
  const { language, t } = useLanguage()
  const isFemale = draft.gender === 'female'
  const traitOptions = personalityTraitOptions.map((o) => ({ value: o.en, label: t(o.en, isFemale ? o.arF : o.arM) }))

  return (
    <div className="space-y-6">
      <Q n={1}>
        <ChoiceGroup
          label={t('If someone who knows you well described you in three words, what would they say?', 'لو حد بيعرفك كويس هيوصفك بـ 3 كلمات، هيقول إيه؟')}
          hint={t('Choose up to 3', 'اختار لحد 3')}
          multi
          maxSelections={3}
          columns={2}
          value={g.threeWordsDescription ?? []}
          onChange={(v) => set({ threeWordsDescription: v })}
          options={traitOptions}
        />
      </Q>
      <Q n={2}>
        <ChoiceGroup
          label={t('What qualities make you a good life partner?', `إيه الصفات اللي بتخليك${isFemale ? 'ي' : ''} شريك${isFemale ? 'ة' : ''} حياة كويس${isFemale ? 'ة' : ''}؟`)}
          multi
          columns={2}
          value={g.goodPartnerQualities ?? []}
          onChange={(v) => set({ goodPartnerQualities: v })}
          options={traitOptions}
        />
      </Q>
      <Q n={3}>
        <ChoiceGroup
          label={t("Is there anything about yourself you're currently working to improve?", `فيه حاجة في نفسك بتشتغل${isFemale ? 'ي' : ''} عليها تتحسن؟`)}
          multi
          columns={2}
          value={g.areasOfGrowth ?? []}
          onChange={(v) => set({ areasOfGrowth: v })}
          options={areasOfGrowthOptions.map((o) => ({ value: o.en, label: t(o.en, o.ar) }))}
        />
        {g.areasOfGrowth?.includes('Other') && (
          <Input
            label={t('Please specify', 'وضّح من فضلك')}
            value={g.areasOfGrowthOther ?? ''}
            onChange={(e) => set({ areasOfGrowthOther: e.target.value })}
            className="mt-3"
          />
        )}
      </Q>
      <Q n={4}>
        <ChoiceGroup
          label={t('How do you naturally express love and care?', `إزاي بتعبّر${isFemale ? 'ي' : ''} عن حبك واهتمامك؟`)}
          multi
          columns={1}
          value={g.loveLanguages ?? []}
          onChange={(v) => set({ loveLanguages: v })}
          options={loveLanguageOptions.map((o) => ({ value: o, label: t(o, loveLanguagesAr[o] ?? o) }))}
        />
      </Q>
      <Q n={5}>
        <ChoiceGroup
          label={t('What is your preferred timeline for marriage?', `إمتى تحب${isFemale ? 'ي' : ''} تكون${isFemale ? 'ي' : ''} جاهز${isFemale ? 'ة' : ''} للجواز؟`)}
          value={g.marriageTimeline ?? ''}
          onChange={(v) => set({ marriageTimeline: v })}
          options={timelineOptions.map((o) => ({ value: o.value, label: language === 'ar' ? o.ar : o.en }))}
          labelExtra={<FieldVisibilityToggle fieldKey="gettingToKnowYou.marriageTimeline" />}
        />
      </Q>
      <Q n={6}>
        <ChoiceGroup
          label={t('Do you desire to have children in the future?', `عايز${isFemale ? 'ة' : ''} أطفال في المستقبل؟`)}
          columns={3}
          value={g.desireChildren ?? ''}
          onChange={(v) => set({ desireChildren: v })}
          options={[
            { value: 'yes', label: t('Yes', 'أيوه') },
            { value: 'no', label: t('No', 'لأ') },
            { value: 'unsure', label: t('Unsure', 'مش متأكد') },
          ]}
        />
      </Q>
      {g.desireChildren === 'yes' && (
        <Q n={7}>
          <ChoiceGroup
            label={t('If you desire children, how many would you ideally like?', `كام طفل تحب${isFemale ? 'ي' : ''} يكون عندك؟`)}
            columns={3}
            value={g.idealNumberOfChildren ?? ''}
            onChange={(v) => set({ idealNumberOfChildren: v })}
            options={[
              { value: '1', label: '1' },
              { value: '2', label: '2' },
              { value: '3', label: '3' },
              { value: '4_plus', label: t('4 or more', '4 أو أكتر') },
              { value: 'open', label: t('Open to discussion', 'مفتوح للنقاش') },
            ]}
          />
        </Q>
      )}
      <Q n={8}>
        <ChoiceGroup
          label={t("Where would you like your life partner to live?", `تحب${isFemale ? 'ي' : ''} شريك حياتك يبقى ساكن فين؟`)}
          hint={t('This is about where your match lives — not your own housing plan after marriage.', 'ده عن مكان سكن الطرف التاني، مش خطة سكنك انت بعد الجواز.')}
          value={g.locationPreference ?? ''}
          onChange={(v) => set({ locationPreference: v })}
          options={[
            { value: 'Same city or nearby area', label: t('Same city or nearby area', 'نفس المدينة أو قريب') },
            { value: 'Same state/province', label: t('Same state/province', 'نفس المحافظة أو الولاية') },
            { value: 'Same country', label: t('Same country', 'نفس البلد') },
            { value: 'Any place / no preference', label: t("Any place — I don't mind", 'أي مكان — مش فارق معايا') },
          ]}
        />
      </Q>
      <Q n={9}>
        <ChoiceGroup
          label={t('Are you willing to relocate internationally if needed?', `مستعد${isFemale ? 'ة' : ''} تسافر${isFemale ? 'ي' : ''} لبلد تانية لو احتاج الأمر؟`)}
          columns={3}
          value={g.willingToRelocateInternationally ?? ''}
          onChange={(v) => set({ willingToRelocateInternationally: v })}
          options={[
            { value: 'yes', label: t('Yes', 'أيوه') },
            { value: 'no', label: t('No', 'لأ') },
            { value: 'maybe', label: t('Maybe', 'ممكن') },
          ]}
        />
      </Q>
    </div>
  )
}
