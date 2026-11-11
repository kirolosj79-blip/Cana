import { BottomNav } from '@/shared/components/layout/BottomNav'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, Heart, Info, Users, UserCheck, Clock, Search } from 'lucide-react'
import { FigmaHeader } from '@/shared/components/layout/FigmaHeader'
import { FCard, IconTile } from '@/shared/components/ui/figma'
import { useJourneyStore } from '@/store/journey.store'
import { useMe } from '@/core/hooks/useMe'

/** Figma: "{Name}, we are happy to let you know, your marriage profile is ready" — shown once, after approval. */
export function ProfileReadyScreen() {
  const { t, name, g } = useMe()
  const navigate = useNavigate()
  const go = () => {
    useJourneyStore.getState().setApprovalSeen()
    navigate('/app/home')
  }
  return (
    <div className="min-h-screen bg-parchment-50">
      <div className="mx-auto max-w-md pb-28">
        <FigmaHeader />
        <div className="space-y-3 px-5 pt-4">
          <FCard className="p-4">
            <div className="flex justify-center">
              <IconTile icon={ShieldCheck} tint="green" size={38} />
            </div>
            <h1 className="mt-3 text-center text-[17px] font-bold leading-snug text-ink-900">
              {t(`${name}, We are happy to let you know, your marriage profile is ready`, `${name}، مبسوطين نقولك إن ملفك الشخصي للزواج بقى جاهز!`)}
            </h1>
            <p className="mt-3 text-[13px] leading-relaxed text-ink-600">
              {t('We’re happy to let you know that your CANA profile has been ', 'يسعدنا نبلغك إن فريق CANA راجع ملفك الشخصي بنفسه، ووافق عليه، واتأكد من صحة بياناتك. ')}
              <b className="text-ink-900">{t('personally reviewed, approved, and verified', '')}</b>
              {t('. Everything is complete, and your account is now ', 'كل حاجة بقت مكتملة، وحسابك دلوقتي ')}
              <b className="text-ink-900">{t('Verified & Active', 'موثّق ونشِط')}</b>
              {t('.', ' ❤️')}
            </p>
            <div className="mt-3 flex items-center gap-2 rounded-xl border border-ink-100 bg-parchment-100 px-3 py-2.5 text-xs">
              <Heart size={14} className="shrink-0 fill-ink-900 text-ink-900" />
              <span className="font-bold text-ink-900">
                {t("You're now ready to take the next step, begin looking for your future Partner.", g('دلوقتي تقدر تبدأ الخطوة الجاية وتدور على شريك حياتك المستقبلي.', 'دلوقتي تقدري تبدأي الخطوة الجاية وتدوري على شريك حياتك المستقبلي.'))}
              </span>
            </div>
          </FCard>

          <FCard className="p-4">
            <div className="mb-3 flex items-center gap-2">
              <Info size={14} className="text-ink-400" />
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-ink-500">{t('Introduction Process', 'خطوات الحصول على ترشيح للتعارف:')}</p>
            </div>
            <div className="space-y-2.5">
              <FCard tone="gold" className="flex gap-3 !rounded-2xl !p-3">
                <IconTile icon={Clock} tint="gold" size={28} />
                <p className="text-xs leading-relaxed text-ink-700">
                  {t(
                    'When you click “Find My Future Spouse,” CANA will look for up to four suitable introductions based on your preferences and the people who are open to an introduction.',
                    'لما تضغط على زر «ابحث عن شريك حياتي المستقبلي»، CANA هيبحث لك عن ترشيحات مناسبة، بناءً على المواصفات والتفضيلات اللي اخترتها، وكمان الأشخاص اللي عندهم استعداد لبدء التعارف.'
                  )}
                </p>
              </FCard>
              <FCard tone="warm" className="flex gap-3 !rounded-2xl !p-3">
                <IconTile icon={Users} tint="navy" size={28} />
                <p className="text-xs leading-relaxed text-ink-700">
                  {t('Up to ', 'ممكن يظهر لك لحد ')}<b className="text-ink-900">{t('four suitable introductions', '4 ترشيحات مناسبة.')}</b>{t(' may appear, based on who is available.', '')}
                </p>
              </FCard>
              <FCard tone="warm" className="flex gap-3 !rounded-2xl !p-3">
                <IconTile icon={UserCheck} tint="navy" size={28} />
                <p className="text-xs leading-relaxed text-ink-700">
                  {t('You may choose ', 'تقدر تختار ')}
                  <b className="text-ink-900">{t('only one person.', 'شخص واحد بس')}</b>
                  {t(' Once you choose, the other introductions will disappear.', ' من بين الترشيحات المتاحة. بمجرد ما تختار شخص، باقي الترشيحات هتختفي من حسابك، علشان تركز على فرصة واحدة في كل مرة.')}
                </p>
              </FCard>
              <FCard tone="gold" className="flex gap-3 !rounded-2xl !p-3">
                <IconTile icon={Clock} tint="gold" size={28} />
                <p className="text-xs leading-relaxed text-ink-700">
                  {t('Please remember, your next introduction may take some time. ', 'خلي بالك : ممكن الترشيح التالي ياخد بعض الوقت، وده لأننا مش بنرشّح لك أي شخص لمجرد إنه متاح. ')}
                  <b className="text-ink-900">{t("We don't introduce you simply because someone is available.", '')}</b>
                  {t(' We wait for an introduction that makes sense for both of you.', 'إحنا بنحرص إن كل ترشيح يكون مناسب للطرفين، وإن تكون فيه فرصة حقيقية لبداية تعارف جاد ومناسب ليكم أنتم الاتنين.')}
                </p>
              </FCard>
            </div>
          </FCard>

          <button onClick={go} className="flex w-full items-center justify-center gap-2 rounded-xl bg-cta-bg py-3.5 text-sm font-bold text-cta-text">
            <Search size={15} /> {t('Find My Future Spouse', 'ابحث عن شريك حياتي المستقبلي')}
          </button>
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
