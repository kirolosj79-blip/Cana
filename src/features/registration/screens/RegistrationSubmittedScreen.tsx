import { BottomNav } from '@/shared/components/layout/BottomNav'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, ChevronRight, ChevronLeft, Clock, Heart, Target, Lock, Church } from 'lucide-react'
import { FigmaHeader } from '@/shared/components/layout/FigmaHeader'
import { Button } from '@/shared/components/ui/Button'
import { FCard, IconTile, CenterDialog } from '@/shared/components/ui/figma'
import { useLanguage } from '@/core/hooks/useLanguage'
import { useJourneyStore } from '@/store/journey.store'

/** Figma: "Congratulations! Your Marriage Profile Is Ready" → "Awaiting Verification" dialog. */
export function RegistrationSubmittedScreen() {
  const navigate = useNavigate()
  const { t, isRtl } = useLanguage()
  const setSubmittedSeen = useJourneyStore((s) => s.setSubmittedSeen)
  const safetyAccepted = useJourneyStore((s) => s.safetyAccepted)
  const [open, setOpen] = useState(false)
  const Arrow = isRtl ? ChevronLeft : ChevronRight

  const features = [
    {
      icon: Heart,
      en: ['Intentional Christian Matching', 'Curated around orthodox faith, mutual values & life vision.'],
      ar: ['ترشيح مسيحي مقصود', 'ترشيحات مبنية على الإيمان الأرثوذكسي والقيم المشتركة ورؤية الحياة.'],
    },
    {
      icon: Target,
      en: ['One Introduction at a Time', 'Designed for genuine prayerful discernment without endless swiping.'],
      ar: ['تعارف واحد في كل مرة', 'مصمّم لاختيار حقيقي بصلاة وتمييز، من غير سواي لا نهائي.'],
    },
    {
      icon: Lock,
      en: ['Confidential Directory', 'No public browsing or indexable profiles. Strict verified privacy.'],
      ar: ['دليل سرّي', 'مفيش تصفّح عام ولا بروفايلات بتظهر في محركات البحث. خصوصية موثّقة وصارمة.'],
    },
  ]

  const done = () => {
    setSubmittedSeen()
    setOpen(false)
    navigate(safetyAccepted ? '/app/home' : '/safety-first')
  }

  return (
    <div className="min-h-screen bg-parchment-50">
      <div className="mx-auto max-w-md pb-28">
        <FigmaHeader />
        <div className="px-5 pt-4 space-y-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <FCard className="py-6 text-center">
              <h1 className="font-bold tracking-tight text-[28px] font-semibold text-ink-900">{t('Congratulations!', 'مبروك!')}</h1>
              <p className="mt-1 font-normal text-base italic text-gold-700">{t('Your Marriage Profile Is Ready', 'ملف الجواز بتاعك جاهز')}</p>
            </FCard>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <FCard className="px-5 py-6">
              <h2 className="text-center font-bold tracking-tight text-xl font-semibold leading-snug text-ink-900">
                {t('Thank you for completing your CANA profile.', 'شكرًا إنك كمّلت ملفك في CANA.')}
              </h2>
              <p className="mt-3 text-center text-[13px] leading-relaxed text-ink-500">
                {t(
                  'Your information will be reviewed within 24 hours. CANA will find someone compatible with your preferences. You will receive one introduction at a time.',
                  'معلوماتك هتتراجع خلال 24 ساعة. CANA هيدوّر على شخص مناسب لتفضيلاتك. هيوصلك تعارف واحد في كل مرة.'
                )}
              </p>
              <div className="mt-5 space-y-4 border-t border-ink-100 pt-5">
                {features.map((f) => (
                  <div key={f.en[0]} className="flex items-start gap-3">
                    <IconTile icon={f.icon} tint="gold" size={32} />
                    <div>
                      <p className="text-sm font-bold text-ink-900">{t(f.en[0], f.ar[0])}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-ink-500">{t(f.en[1], f.ar[1])}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="gold" size="lg" className="!rounded-[14px] mt-6 w-full" onClick={() => setOpen(true)}>
                {t('Submit For Verification', 'ابعت للتوثيق')} <Arrow size={16} />
              </Button>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-ink-500">
                <Check size={12} className="text-success-500" /> {t('Estimated review turnaround: within 24 hours', 'مدة المراجعة المتوقعة: خلال 24 ساعة')}
              </p>
            </FCard>
          </motion.div>
        </div>
      </div>

      <CenterDialog
        open={open}
        closable
        onClose={() => setOpen(false)}
        title={t('Awaiting Verification', 'في انتظار التوثيق')}
        actions={
          <>
            <Button variant="gold" size="lg" className="!rounded-[14px] w-full" onClick={done}>
              <Check size={16} /> {t('Understood & Got It', 'تمام، فهمت')}
            </Button>
            <button onClick={() => navigate('/app/settings/verification')} className="mx-auto flex items-center gap-1 pt-1 text-xs font-bold text-wine-700">
              {t('View submitted church document', 'شوف مستند الكنيسة اللي اتبعت')} <Arrow size={12} />
            </button>
          </>
        }
      >
        <p className="font-semibold text-ink-900">{t('Thank you. Your profile has been submitted and is awaiting verification.', 'شكرًا. ملفك اتبعت وبانتظار التوثيق.')}</p>
        <FCard tone="warm" className="mt-4 text-start !rounded-2xl">
          <div className="flex gap-2.5">
            <Church size={15} className="mt-0.5 shrink-0 text-gold-700" />
            <p className="text-xs leading-relaxed text-ink-600">
              {t(
                "Our team reviews every profile and church verification document before introductions begin. You'll be able to receive an introduction once your profile is verified.",
                'فريقنا بيراجع كل ملف ومستند توثيق الكنيسة قبل ما التعارفات تبدأ. هتقدر تستقبل تعارف أول ما ملفك يتوثّق.'
              )}
            </p>
          </div>
          <div className="mt-3 flex items-center gap-1.5 border-t border-ink-100 pt-3 text-xs text-ink-500">
            <Clock size={12} /> {t('Estimated turnaround:', 'المدة المتوقعة:')} <b className="text-ink-900">{t('Within 24 hours', 'خلال 24 ساعة')}</b>
          </div>
        </FCard>
      </CenterDialog>
      <BottomNav disabled />
    </div>
  )
}
