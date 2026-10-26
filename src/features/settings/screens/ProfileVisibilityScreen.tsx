import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { TopBar } from '@/shared/components/layout/TopBar'
import { Switch } from '@/shared/components/ui/Toggle'
import { Button } from '@/shared/components/ui/Button'
import { useFieldVisibilityStore, VISIBILITY_CONTROLLED_FIELDS } from '@/store/fieldVisibility.store'
import { useLanguage } from '@/core/hooks/useLanguage'

/**
 * Standalone entry point for "what shows on my public profile" — the same
 * toggles also live inside Edit Profile, but they were easy to miss buried
 * among the sensitive-approval fields there, so this gives them their own
 * dedicated, easy-to-find screen too.
 */
export function ProfileVisibilityScreen() {
  const navigate = useNavigate()
  const { isVisible, setVisible } = useFieldVisibilityStore()
  const { t } = useLanguage()

  return (
    <div>
      <TopBar showBack title={t('Profile Visibility', 'ظهور بياناتك')} />
      <div className="px-5 pt-2 pb-8 space-y-1">
        <p className="text-sm text-ink-500 px-1 pb-4 leading-relaxed">
          {t(
            "Choose what other members can see on your profile. Turning something off only hides it — your information stays saved either way.",
            'اختار إيه اللي باقي الأعضاء يقدروا يشوفوه في بروفايلك. إيقاف أي حاجة بيخفيها بس — بياناتك بتفضل محفوظة في الحالتين.'
          )}
        </p>
        {Object.entries(
          VISIBILITY_CONTROLLED_FIELDS.reduce<Record<string, typeof VISIBILITY_CONTROLLED_FIELDS>>((acc, f) => {
            const groupKey = t(f.groupEn, f.groupAr)
            acc[groupKey] = acc[groupKey] ? [...acc[groupKey], f] : [f]
            return acc
          }, {})
        ).map(([group, fields]) => (
          <div key={group} className="mb-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-400 px-3 pt-3 pb-1">{group}</p>
            {fields.map((f) => {
              const visible = isVisible(f.key)
              return (
                <div key={f.key} className="flex items-center justify-between rounded-[var(--radius-md)] px-3 py-3.5">
                  <span className="flex items-center gap-2.5 text-sm font-medium text-ink-800">
                    {visible ? <Eye size={16} className="text-success-500" /> : <EyeOff size={16} className="text-ink-400" />}
                    {t(f.en, f.ar)}
                  </span>
                  <Switch checked={visible} onChange={(v) => setVisible(f.key, v)} />
                </div>
              )
            })}
          </div>
        ))}

        <Button variant="outline" className="w-full mt-6" onClick={() => navigate('/app/profile/preview')}>
          {t('Preview how others see your profile', 'شوف بروفايلك زي ما هيبان لغيرك')}
        </Button>
      </div>
    </div>
  )
}
