import { BottomNav } from '@/shared/components/layout/BottomNav'
import { useNavigate } from 'react-router-dom'
import { Mail, BadgeCheck, Heart, Users, UserCheck, Clock, Search } from 'lucide-react'
import { FigmaHeader } from '@/shared/components/layout/FigmaHeader'
import { BoldHero, BoldNote, BoldPill, BoldRow, BoldCTA } from '@/shared/components/ui/bold'
import { Rich } from '@/shared/components/ui/figma'
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
    <div className="bp-page min-h-screen">
      <div className="mx-auto max-w-md pb-28">
        <FigmaHeader />
        <div className="space-y-3 px-4 pt-3">
          <BoldHero
            icon={Mail}
            title={t(`${name}, We are happy to let you know, your marriage profile is ready`, `${name}، مبسوطين نقولك إن ملفك الشخصي للزواج بقى جاهز!`)}
          />
          <BoldNote icon={BadgeCheck}>
            {t('We’re happy to let you know that your CANA profile has been ', 'يسعدنا نبلغك إن فريق CANA راجع ملفك الشخصي بنفسه، ووافق عليه، واتأكد من صحة بياناتك. ')}
            <b className="font-bold">{t('personally reviewed, approved, and verified', '')}</b>
            {t('. Everything is complete, and your account is now ', 'كل حاجة بقت مكتملة، وحسابك دلوقتي ')}
            <b className="font-bold text-success-500">{t('Verified & Active', 'موثّق ونشِط')}</b>
            {t('.', ' ❤️')}
          </BoldNote>
          <BoldNote icon={Heart}>
            <b className="font-bold">
              {t("You're now ready to take the next step, begin looking for your future Partner.", g('دلوقتي تقدر تبدأ الخطوة الجاية وتدور على شريك حياتك المستقبلي.', 'دلوقتي تقدري تبدأي الخطوة الجاية وتدوري على شريك حياتك المستقبلي.'))}
            </b>
          </BoldNote>

          <BoldPill>{t('Introduction Process', 'خطوات الحصول على ترشيح للتعارف:')}</BoldPill>

          <BoldRow icon={Search}>
            <Rich>{t(
              'When you click **“Find My Future Spouse,”** CANA will look for up to **four suitable introductions** based on your preferences and the people who are open to an introduction.',
              'لما تضغط على زر **«ابحث عن شريك حياتي المستقبلي»**، CANA هيبحث لك عن **ترشيحات مناسبة**، بناءً على المواصفات والتفضيلات اللي اخترتها، وكمان الأشخاص اللي عندهم استعداد لبدء التعارف.'
            )}</Rich>
          </BoldRow>
          <BoldRow icon={Users}>
            {t('Up to ', 'ممكن يظهر لك لحد ')}<b className="bp-row-title">{t('four suitable introductions', '4 ترشيحات مناسبة.')}</b>{t(' may appear, based on who is available.', '')}
          </BoldRow>
          <BoldRow icon={UserCheck}>
            {t('You may choose ', 'تقدر تختار ')}
            <b className="bp-row-title">{t('only one person.', 'شخص واحد بس')}</b>
            {t(' Once you choose, the other introductions will disappear.', ' من بين الترشيحات المتاحة. بمجرد ما تختار شخص، باقي الترشيحات هتختفي من حسابك، علشان تركز على فرصة واحدة في كل مرة.')}
          </BoldRow>
          <BoldRow icon={Clock}>
            {t('Please remember, your next introduction may take some time. ', 'خلي بالك : ممكن الترشيح التالي ياخد بعض الوقت، وده لأننا مش بنرشّح لك أي شخص لمجرد إنه متاح. ')}
            <b className="bp-row-title">{t("We don't introduce you simply because someone is available.", '')}</b>
            {t(' We wait for an introduction that makes sense for both of you.', 'إحنا بنحرص إن كل ترشيح يكون مناسب للطرفين، وإن تكون فيه فرصة حقيقية لبداية تعارف جاد ومناسب ليكم أنتم الاتنين.')}
          </BoldRow>

          <BoldCTA icon={Search} onClick={go}>{t('Find My Future Spouse', 'ابحث عن شريك حياتي المستقبلي')}</BoldCTA>
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
