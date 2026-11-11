import { BottomNav } from '@/shared/components/layout/BottomNav'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, UserCheck, Hourglass, ShieldCheck } from 'lucide-react'
import { FigmaHeader } from '@/shared/components/layout/FigmaHeader'
import { FCard, IconTile, CenterDialog } from '@/shared/components/ui/figma'
import { useMe } from '@/core/hooks/useMe'
import { nextJourneyStep, useJourneyStore } from '@/store/journey.store'

const B = ({ children }: { children: React.ReactNode }) => <b className="font-bold text-ink-900">{children}</b>

/** Figma "First Step": Congratulations {name}! → Awaiting Verification dialog. */
export function RegistrationSubmittedScreen() {
  const navigate = useNavigate()
  const { t, name, g } = useMe()
  const setSubmittedSeen = useJourneyStore((s) => s.setSubmittedSeen)
  const [open, setOpen] = useState(false)

  const done = () => {
    setSubmittedSeen()
    setOpen(false)
    navigate(nextJourneyStep())
  }

  const items = [
    {
      icon: Heart,
      title: t('Curated Matches', 'ترشيحات مناسبة ليك'),
      body: (
        <>
          {t(
            'Once your profile is verified, CANA will begin looking for up to four suitable introductions based on your preferences and the people who are open to an introduction.',
            'بعد مراجعة بروفايلك والتأكد من بياناتك، هتبدأ CANA في البحث عن أشخاص مناسبين ليك بهدف الزواج، بناءً على تفضيلاتك ومعاييرك، وكمان الأشخاص اللي عندهم استعداد للتعارف.'
          )}
          {' '}
          {t('', 'ممكن تستقبل لحد 4 ترشيحات مناسبة، حسب مدى توافر الأشخاص المناسبين.')}
        </>
      ),
    },
    {
      icon: UserCheck,
      title: t('Exclusive Decision', 'اختيار شخص واحد فقط'),
      body: (
        <>
          {t('You may choose ', 'من بين الترشيحات اللي هتوصلك، تقدر تختار ')}
          <B>{t('only one person', 'شخص واحد بس')}</B>
          {t('. Once you make your choice, the other introductions will disappear.', ' علشان تبدأوا مرحلة التعارف. بمجرد ما تختار شخص، باقي الترشيحات هتختفي من حسابك، علشان تركز على فرصة واحدة في كل مرة.')}
        </>
      ),
    },
    {
      icon: Hourglass,
      title: t('Intentional Timing', 'التعارف في الوقت المناسب'),
      body: (
        <>
          {t('Please remember that finding the right introduction may take time. ', 'اختيار الشخص المناسب ممكن ياخد وقت، وده طبيعي. ')}
          <B>{t("We don't introduce you simply because someone is available.", 'CANA مش بتقدم ترشيحات لمجرد إن فيه أشخاص متاحين،')}</B>
          {t(' We wait for an introduction that makes sense for both of you.', ' لكن بنحرص إن كل ترشيح يكون مناسب للطرفين، ويكون فيه توافق حقيقي وفرصة جدية للتعارف بهدف الزواج.')}
        </>
      ),
    },
    {
      icon: ShieldCheck,
      title: t('Private & Confidential', 'الخصوصية والسرية'),
      body: (
        <>
          {t(
            'Your profile will remain private and will not be available for public browsing.',
            'بروفايلك وبياناتك الشخصية هيفضلوا خاصين وسريين، ومش هيكونوا متاحين للتصفح العام أو لأي شخص غير مصرح له بالاطلاع عليهم.'
          )}
          {t('', ' خصوصيتك وثقتك في CANA من أهم أولوياتنا.')}
        </>
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-parchment-50">
      <div className="mx-auto max-w-md pb-28">
        <FigmaHeader />
        <div className="space-y-3 px-5 pt-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <FCard className="py-5 text-center">
              <h1 className="text-[22px] font-bold leading-tight tracking-tight text-ink-900">
                {t(`Congratulations ${name}!`, `مبروك يا ${name}! 🎉`)}
              </h1>
              <p className="mt-1 text-sm italic text-ink-500">{t('Your Marriage Profile Is Ready', 'بروفايل الزواج بتاعك بقى جاهز')}</p>
            </FCard>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <FCard className="px-4 py-5">
              <h2 className="text-center text-[17px] font-bold leading-snug text-ink-900">
                {t('Thank you for completing your CANA profile.', 'شكرًا لاستكمال بروفايل CANA الخاص بيك!')}
              </h2>
              <p className="mt-2 text-center text-xs leading-relaxed text-ink-500">
                {t('Your information has been received and will be reviewed within 24 hours.', 'تم استلام بياناتك بنجاح، وهتتم مراجعتها خلال 24 ساعة.')}
              </p>
              <div className="mt-4 space-y-4 border-t border-ink-100 pt-4">
                {items.map((it) => (
                  <div key={it.title} className="flex items-start gap-3">
                    <IconTile icon={it.icon} tint="navy" size={30} />
                    <div className="min-w-0">
                      <p className="text-[13px] font-bold text-ink-900">{it.title}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-ink-500">{it.body}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => setOpen(true)} className="mt-5 w-full rounded-xl bg-cta-bg py-3.5 text-sm font-bold text-cta-text">
                {t('Submit For Verification', 'إرسال للتحقق')}
              </button>
              <p className="mt-3 text-center text-[11px] text-ink-500">{t('Estimated review turnaround: within 24 hours', 'الوقت المتوقع للمراجعة: خلال 24 ساعة.')}</p>
            </FCard>
          </motion.div>
        </div>
      </div>

      <CenterDialog
        open={open}
        closable
        onClose={() => setOpen(false)}
        title={t('Awaiting Verification', 'في انتظار التحقق من البيانات')}
        actions={
          <button onClick={done} className="w-full rounded-xl bg-cta-bg py-3.5 text-sm font-bold text-cta-text">
            {t('Got it', 'تمام، فهمت.')}
          </button>
        }
      >
        <p>
          {t(
            `Thank you ${name}. Your profile has been submitted and is awaiting verification.`,
            `${g('شكرًا ليك', 'شكرًا ليكي')} يا ${name}. تم إرسال ملفك الشخصي، وحاليًا في انتظار مراجعته والتأكد من صحة البيانات.`
          )}
        </p>
      </CenterDialog>
      <BottomNav disabled />
    </div>
  )
}
