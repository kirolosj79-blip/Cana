import { useState } from 'react'
import { TopBar } from '@/shared/components/layout/TopBar'
import { Switch } from '@/shared/components/ui/Toggle'
import { useLanguage } from '@/core/hooks/useLanguage'

const rows = [
  { key: 'income', en: 'Show income range after mutual interest', ar: 'اظهار الدخل بعد الاهتمام المتبادل', default: true },
  { key: 'medical', en: 'Share medical information after mutual interest', ar: 'مشاركة المعلومات الطبية بعد الاهتمام المتبادل', default: true },
  { key: 'family', en: 'Share full family details after mutual interest', ar: 'مشاركة تفاصيل العائلة كاملة بعد الاهتمام المتبادل', default: true },
  { key: 'previousMarriage', en: 'Share previous marriage details after mutual interest', ar: 'مشاركة تفاصيل الجواز السابق بعد الاهتمام المتبادل', default: false },
  { key: 'letter', en: "Share church verification & marriage recommendation letter on request", ar: 'مشاركة خطاب إثبات الأهلية للزواج من الكنيسة عند الطلب', default: false },
  { key: 'discoverable', en: 'Appear in Discover for new members', ar: 'الظهور في صفحة الاكتشاف للأعضاء الجدد', default: true },
]

export function PrivacySettingsScreen() {
  const [state, setState] = useState(Object.fromEntries(rows.map((r) => [r.key, r.default])))
  const { t } = useLanguage()

  return (
    <div>
      <TopBar showBack title={t('Privacy Settings', 'إعدادات الخصوصية')} />
      <div className="px-5 pt-2 pb-8 space-y-1">
        <p className="text-sm text-ink-500 px-1 pb-3">{t("Control what's shared, and when, with your matches.", 'تحكم في إيه اللي بيتشارك، وإمتى، مع ترشيحاتك.')}</p>
        {rows.map((r) => (
          <div key={r.key} className="flex items-center justify-between rounded-[var(--radius-md)] px-3 py-3.5">
            <span className="text-sm font-medium text-ink-800 pr-4">{t(r.en, r.ar)}</span>
            <Switch checked={state[r.key]} onChange={(v) => setState((s) => ({ ...s, [r.key]: v }))} />
          </div>
        ))}
      </div>
    </div>
  )
}
