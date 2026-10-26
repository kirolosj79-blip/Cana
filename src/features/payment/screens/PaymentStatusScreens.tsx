import { useJourneyStore } from '@/store/journey.store'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle2, XCircle, RotateCcw } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { PageContainer } from '@/shared/components/layout/PageContainer'
import { useLanguage } from '@/core/hooks/useLanguage'

export function PaymentSuccessScreen() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  return (
    <PageContainer className="justify-center items-center text-center gap-5 py-10">
      <motion.span
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 14 }}
        className="flex h-20 w-20 items-center justify-center rounded-full bg-success-100 text-success-500"
      >
        <CheckCircle2 size={36} />
      </motion.span>
      <div>
        <h1 className="font-display text-2xl font-medium text-ink-900">{t('Payment successful', 'الدفع تم بنجاح')}</h1>
        <p className="text-sm text-ink-500 mt-2 max-w-xs mx-auto">{t('Your membership is now active. Welcome to the Cana community.', 'عضويتك بقت فعّالة. أهلًا بيك في مجتمع Cana ❤️')}</p>
      </div>
      <Button variant="gold" size="lg" className="w-full mt-4" onClick={() => navigate(useJourneyStore.getState().safetyAccepted ? '/app/home' : '/registration-submitted')}>
        {t('Go to Home', 'روح للرئيسية')}
      </Button>
    </PageContainer>
  )
}

export function PaymentFailedScreen() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  return (
    <PageContainer className="justify-center items-center text-center gap-5 py-10">
      <span className="flex h-20 w-20 items-center justify-center rounded-full bg-danger-100 text-danger-500">
        <XCircle size={36} />
      </span>
      <div>
        <h1 className="font-display text-2xl font-medium text-ink-900">{t('Payment failed', 'الدفع فشل')}</h1>
        <p className="text-sm text-ink-500 mt-2 max-w-xs mx-auto">{t("We couldn't process your payment. No charge was made — you can try again.", 'مقدرناش نعالج الدفع. مفيش خصم حصل، تقدر تحاول تاني.')}</p>
      </div>
      <div className="w-full space-y-3 mt-4">
        <Button variant="gold" size="lg" className="w-full" onClick={() => navigate('/payment/subscription')}>
          <RotateCcw size={16} /> {t('Try Again', 'حاول تاني')}
        </Button>
        <Button variant="ghost" size="lg" className="w-full" onClick={() => navigate('/app/home')}>
          {t('Do This Later', 'هعملها بعدين')}
        </Button>
      </div>
    </PageContainer>
  )
}

export function ResumePaymentScreen() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  return (
    <PageContainer className="justify-center items-center text-center gap-5 py-10">
      <span className="flex h-20 w-20 items-center justify-center rounded-full bg-warning-100 text-warning-500">
        <RotateCcw size={32} />
      </span>
      <div>
        <h1 className="font-display text-2xl font-medium text-ink-900">{t('Resume your payment', 'كمّل عملية الدفع')}</h1>
        <p className="text-sm text-ink-500 mt-2 max-w-xs mx-auto">
          {t(
            "You started the subscription payment but didn't finish. Pick up right where you left off — no need to start over.",
            'بدأت تدفع اشتراكك بس ما خلصتش. كمّل من نفس المكان، من غير ما تبدأ من الأول.'
          )}
        </p>
      </div>
      <Button variant="gold" size="lg" className="w-full mt-4" onClick={() => navigate('/payment/subscription')}>
        {t('Resume Payment', 'كمّل الدفع')}
      </Button>
    </PageContainer>
  )
}
