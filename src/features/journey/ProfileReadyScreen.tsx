import { BottomNav } from '@/shared/components/layout/BottomNav'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, Heart, Info, Users, UserCheck, Clock, Search, ChevronRight, ChevronLeft } from 'lucide-react'
import { FigmaHeader } from '@/shared/components/layout/FigmaHeader'
import { Button } from '@/shared/components/ui/Button'
import { FCard, IconTile } from '@/shared/components/ui/figma'
import { useLanguage } from '@/core/hooks/useLanguage'

/** Figma: "Your Marriage Profile Is Ready" (approved) with "Find My Future Spouse". */
export function ProfileReadyScreen() {
  const { t, isRtl } = useLanguage()
  const navigate = useNavigate()
  const Arrow = isRtl ? ChevronLeft : ChevronRight
  return (
    <div className="min-h-screen bg-parchment-50">
      <div className="mx-auto max-w-md pb-28">
        <FigmaHeader />
        <div className="space-y-4 px-5 pt-4">
          <FCard className="p-5">
            <div className="flex items-start gap-3">
              <IconTile icon={ShieldCheck} tint="green" size={46} />
              <div>
                <h1 className="font-bold tracking-tight text-xl font-semibold leading-snug text-ink-900">{t('Your Marriage Profile Is Ready', 'ملف الجواز بتاعك جاهز')}</h1>
                <p className="mt-0.5 text-xs text-ink-500">{t('Approved, authenticated & verified for covenant introductions.', 'معتمد وموثّق ومتحقق منه لتعارفات الارتباط.')}</p>
              </div>
            </div>
            <p className="mt-4 border-t border-ink-100 pt-4 text-[13px] leading-relaxed text-ink-600">
              {t('We’re happy to let you know that your CANA profile has been ', 'يسعدنا نبلّغك إن ملفك في CANA اتم ')}
              <b className="text-ink-900">{t('personally reviewed, approved, and verified', 'مراجعته واعتماده والتحقق منه شخصيًا')}</b>
              {t('. Everything is complete, and your account is now ', '. كل حاجة مكتملة، وحسابك دلوقتي ')}
              <span className="rounded-md bg-success-100 px-1.5 py-0.5 text-xs font-semibold text-success-500">{t('Verified & Active', 'موثّق ونشط')}</span>.
            </p>
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-ink-100 bg-parchment-100 px-3 py-2.5 text-xs">
              <Heart size={15} className="shrink-0 fill-ink-900 text-ink-900" />
              <span className="font-semibold text-wine-700 underline underline-offset-2">
                {t("You're now ready to take the next step — begin looking for your future Partner.", 'إنت دلوقتي جاهز للخطوة الجاية — ابدأ دوّر على شريك حياتك.')}
              </span>
            </div>
          </FCard>

          <FCard className="p-4">
            <div className="mb-3 flex items-center gap-2">
              <Info size={15} className="text-ink-400" />
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-ink-500">{t('Introduction Process', 'خطوات التعارف')}</p>
            </div>
            <div className="space-y-3">
              <FCard tone="warm" className="flex gap-3 !rounded-2xl">
                <IconTile icon={Users} tint="navy" size={30} />
                <p className="text-[13px] leading-relaxed text-ink-600">
                  {t('When you click “Find My Future Spouse,” CANA will look for up to ', 'لما تضغط "دوّر على شريك حياتي"، CANA هيدوّر على لحد ')}
                  <b className="text-ink-900">{t('three suitable introductions', 'ثلاث تعارفات مناسبة')}</b>
                  {t(' based on your preferences and the people who are open to an introduction.', ' على حسب تفضيلاتك والناس المفتوحين لتعارف.')}
                </p>
              </FCard>
              <FCard tone="warm" className="flex gap-3 !rounded-2xl">
                <IconTile icon={UserCheck} tint="red" size={30} />
                <p className="text-[13px] leading-relaxed text-ink-600">
                  {t('You may choose ', 'تقدر تختار ')}
                  <b className="text-wine-700">{t('only one person.', 'شخص واحد بس.')}</b>
                  {t(' Once you choose, the other introductions will disappear.', ' أول ما تختار، باقي التعارفات هتختفي.')}
                </p>
              </FCard>
              <FCard tone="gold" className="flex gap-3 !rounded-2xl">
                <IconTile icon={Clock} tint="gold" size={30} />
                <p className="text-[13px] leading-relaxed text-ink-700">
                  {t('Please remember, your next introduction may take some time. ', 'افتكر إن تعارفك الجاي ممكن ياخد وقت. ')}
                  <b className="text-gold-700">
                    {t("We don't introduce you simply because someone is available", 'إحنا مبنقدّمش حد ليك بس عشان هو متاح')}
                  </b>
                  {t(' — we wait for an introduction that makes sense for both of you.', ' — بنستنى تعارف منطقي للطرفين.')}
                </p>
              </FCard>
            </div>
          </FCard>

          <Button variant="gold" size="lg" className="!rounded-[14px] w-full" onClick={() => navigate('/app/home')}>
            <Search size={16} className="text-gold-300" /> {t('Find My Future Spouse', 'دوّر على شريك حياتي')} <Arrow size={16} />
          </Button>
          <p className="text-center text-[11px] text-ink-500">{t('Personalized covenant matchmaking adhering to your preferences', 'ترشيح مخصّص للارتباط يحترم تفضيلاتك')}</p>
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
