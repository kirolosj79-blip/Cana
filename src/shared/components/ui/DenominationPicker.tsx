import { ChoiceGroup } from '@/shared/components/ui/ChoiceGroup'
import { Input } from '@/shared/components/ui/Input'
import { denominationGroups, isOtherDenomination } from '@/features/registration/data/options'
import { useLanguage } from '@/core/hooks/useLanguage'

interface Props {
  value: string
  other?: string
  onChange: (v: string) => void
  onOtherChange?: (v: string) => void
}

/** Single-choice denomination list in three groups; "other" opens a free-text box. */
export function DenominationPicker({ value, other, onChange, onOtherChange }: Props) {
  const { language, t } = useLanguage()
  return (
    <div className="space-y-4">
      {denominationGroups.map((g) => (
        <div key={g.key} className="space-y-2">
          <p className="text-[13px] font-bold text-ink-900">{language === 'ar' ? g.ar : g.en}</p>
          <ChoiceGroup
            value={value}
            onChange={onChange}
            options={g.options.map((o) => ({ value: o.value, label: language === 'ar' ? o.ar : o.en }))}
          />
        </div>
      ))}
      {isOtherDenomination(value) && onOtherChange && (
        <Input
          label={t('Write your denomination', 'اكتب طائفتك')}
          value={other ?? ''}
          onChange={(e) => onOtherChange(e.target.value)}
        />
      )}
    </div>
  )
}

/** Multi-choice variant (partner preference). */
export function DenominationMultiPicker({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const { language } = useLanguage()
  return (
    <div className="space-y-4">
      {denominationGroups.map((g) => {
        const ids = g.options.map((o) => o.value as string)
        return (
          <div key={g.key} className="space-y-2">
            <p className="text-[13px] font-bold text-ink-900">{language === 'ar' ? g.ar : g.en}</p>
            <ChoiceGroup
              multi
              value={value.filter((v) => ids.includes(v))}
              onChange={(v: string[]) => onChange([...value.filter((x) => !ids.includes(x)), ...v])}
              options={g.options.map((o) => ({ value: o.value, label: language === 'ar' ? o.ar : o.en }))}
            />
          </div>
        )
      })}
    </div>
  )
}
