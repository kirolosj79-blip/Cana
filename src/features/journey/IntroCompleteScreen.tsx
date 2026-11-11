import { useNavigate } from 'react-router-dom'
import { Lock, Quote } from 'lucide-react'
import { FigmaHeader } from '@/shared/components/layout/FigmaHeader'
import { FCard } from '@/shared/components/ui/figma'
import { useMe } from '@/core/hooks/useMe'

/** Figma: "Introduction Complete". */
export function IntroCompleteScreen() {
  const { t, name } = useMe()
  const navigate = useNavigate()
  return (
    <div className="pb-10">
      <FigmaHeader />
      <div className="space-y-4 px-5 pt-5 text-center">
        <h1 className="text-[28px] font-bold tracking-tight text-ink-900">{t('Introduction Complete', 'تم التعارف بنجاح')}</h1>
        <p className="text-sm text-ink-500">{t('Your introduction through CANA is now complete.', 'اكتملت الآن مرحلة التعارف بينكم من خلال تطبيق CANA.')}</p>
        <img src="/images/united-in-christ.png" alt="United in Christ" className="mx-auto h-28 w-auto" />
        <p className="text-[13px] text-ink-500">{t('We pray that this next step will be a meaningful one for both of you', 'بنصلي إن الخطوة الجديدة دي تكون بداية طيبة ومليانة خير وبركة ليكم أنتم الاتنين. ❤️')}</p>

        <FCard className="text-start">
          <p className="flex items-center gap-2 text-sm font-bold text-ink-900"><Lock size={14} className="text-ink-400" /> {t('Account Status', 'حالة الحساب')}</p>
          <p className="mt-2 text-xs leading-relaxed text-ink-500">
            {t(
              `${name}, Your CANA profiles will be temporarily closed, and you will no longer participate in new introductions.`,
              `${name}، هيتم إيقاف ملفك الشخصي وملف الطرف الآخر مؤقتًا، وبالتالي مش هتكونوا متاحين لتلقي أي ترشيحات أو الدخول في تعارف جديد من خلال CANA خلال الفترة دي.`
            )}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-ink-500">
            {t('You are always welcome to return to CANA in the future if you wish to reactivate your account.', 'ويسعدنا دايمًا نرحّب بعودتكم إلى CANA في أي وقت في المستقبل، لو حبيتوا تعيدوا تفعيل حساباتكم.')}
          </p>
        </FCard>

        <FCard className="relative flex items-start gap-3 text-start">
          <Quote size={14} className="mt-0.5 shrink-0 text-ink-700" />
          <div>
            <p className="text-[13px] leading-snug text-ink-800">{t('Above all, put on love, which binds everything together in perfect harmony.', '«وعلى جميع هذه، البسوا المحبة التي هي رباط الكمال.»')}</p>
            <p className="mt-1.5 text-[10px] font-bold uppercase tracking-wider text-ink-500">— {t('Colossians 3:14', 'كولوسي ٣: ١٤')}</p>
          </div>
        </FCard>

        <button onClick={() => navigate('/app/home')} className="w-full rounded-xl bg-cta-bg py-3.5 text-sm font-bold text-cta-text">{t('Done', 'تم')}</button>
      </div>
    </div>
  )
}
