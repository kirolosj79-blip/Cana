import { nextJourneyStep } from '@/store/journey.store'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Copy, ShieldCheck, Clock, CheckCircle2, XCircle, ExternalLink } from 'lucide-react'
import { TopBar } from '@/shared/components/layout/TopBar'
import { Button } from '@/shared/components/ui/Button'
import { Card } from '@/shared/components/ui/Card'
import { Badge } from '@/shared/components/ui/Badge'
import { UploadField } from '@/shared/components/ui/UploadField'
import { ProgressBar } from '@/shared/components/ui/Progress'
import { usePaymentStore } from '@/store/payment.store'
import { usePaymentRequestsStore } from '@/store/paymentRequests.store'
import { useAuthStore } from '@/store/auth.store'
import { useAdminReviewStore } from '@/store/adminReview.store'
import { useToast } from '@/shared/components/feedback/Toast'
import { useLanguage } from '@/core/hooks/useLanguage'
import { useCelebration } from '@/shared/components/feedback/Celebration'
import { HeartsBackdrop } from '@/shared/components/ui/HeartsBackdrop'
import type { PaymentMethod } from '@/types/app.types'

const SUBSCRIPTION_PRICE = 50
const INSTAPAY_HANDLE = 'cana.membership@instapay'

type Step = 1 | 2 | 3

export function SubscriptionPaymentScreen() {
  const navigate = useNavigate()
  const { isPaidMember } = usePaymentStore()
  const { submit, approve, getLatest } = usePaymentRequestsStore()
  const completeOnboarding = useAuthStore((s) => s.completeOnboarding)
  const resetForNewSubmission = useAdminReviewStore((s) => s.resetForNewSubmission)
  const { show } = useToast()
  const { celebrate } = useCelebration()
  const { t } = useLanguage()

  const latest = getLatest()
  const [step, setStep] = useState<Step>(1)
  const [method, setMethod] = useState<PaymentMethod | null>(null)
  const [screenshotUploaded, setScreenshotUploaded] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // No pending state: anything still waiting is approved straight away.
  useEffect(() => {
    if (latest && latest.status === 'pending_review') {
      approve(latest.id)
      navigate(nextJourneyStep(), { replace: true })
    }
  }, [latest, approve, navigate])

  const copyHandle = () => {
    navigator.clipboard?.writeText(INSTAPAY_HANDLE).catch(() => {})
    show(t('Copied', 'اتنسخ'), 'success')
  }

  const submitProof = () => {
    if (!method) return
    setSubmitting(true)
    setTimeout(() => {
      const id = submit(method)
      approve(id)
      completeOnboarding()
      resetForNewSubmission()
      celebrate('confetti')
      show(t('Payment received — your membership is active', 'تم استلام الدفع — عضويتك بقت فعّالة'), 'success')
      setSubmitting(false)
      navigate(nextJourneyStep(), { replace: true })
    }, 700)
  }

  // ---- Already-resolved states ----
  if (isPaidMember) {
    return (
      <div>
        <HeartsBackdrop />
        <TopBar showBack title={t('Subscription', 'الاشتراك')} />
        <div className="px-5 pt-2 pb-8">
          <div className="rounded-[var(--radius-md)] bg-success-100 border border-success-500/20 px-4 py-4 flex items-start gap-3">
            <CheckCircle2 size={20} className="text-success-500 shrink-0 mt-0.5" />
            <p className="text-sm text-success-500">{t('You already have an active subscription.', 'عندك اشتراك فعّال بالفعل.')}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <HeartsBackdrop />
      <TopBar showBack title={t('Subscription', 'الاشتراك')} />
      <div className="px-5 pt-2 pb-8 space-y-5">
        {latest && latest.status === 'rejected' && (
          <div className="rounded-[var(--radius-md)] bg-danger-100 border border-danger-500/20 px-4 py-3 flex items-start gap-2.5">
            <XCircle size={16} className="text-danger-500 shrink-0 mt-0.5" />
            <p className="text-xs text-danger-500">
              {latest.reviewNote || t("We couldn't verify your last payment — please try again.", 'ما قدرناش نتأكد من آخر عملية دفع — حاول تاني.')}
            </p>
          </div>
        )}

        <ProgressBar value={(step / 3) * 100} />

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-display text-lg text-ink-900">{t('Cana Membership', 'عضوية Cana')}</p>
              <p className="text-xs text-ink-500 mt-0.5">{t('One-time subscription', 'اشتراك لمرة واحدة')}</p>
            </div>
            <p className="font-display text-3xl text-ink-900">${SUBSCRIPTION_PRICE}</p>
          </div>
        </Card>

        {step === 1 && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-ink-700">{t('Choose a payment method', 'اختار وسيلة الدفع')}</p>
            {(['paypal', 'instapay'] as PaymentMethod[]).map((m) => (
              <button
                key={m}
                onClick={() => setMethod(m)}
                className={`w-full flex items-center justify-between rounded-[var(--radius-md)] border px-5 py-4 transition-colors ${
                  method === m ? 'border-gold-400 bg-gold-50' : 'border-ink-200 bg-parchment-0'
                }`}
              >
                <span className={`font-medium ${method === m ? 'text-inkfixed-900' : 'text-ink-800'}`}>{m === 'paypal' ? 'PayPal' : 'InstaPay'}</span>
                {method === m && <ShieldCheck size={18} className="text-inkfixed-900" />}
              </button>
            ))}
            <Button variant="gold" size="lg" className="w-full" disabled={!method} onClick={() => setStep(2)}>
              {t('Continue', 'كمّل')}
            </Button>
          </div>
        )}

        {step === 2 && method === 'paypal' && (
          <div className="space-y-4">
            <p className="text-sm text-ink-700 leading-relaxed">
              {t(
                'Send your payment via PayPal to the address below, then continue to upload your proof of payment.',
                'ابعت الدفع عبر PayPal للعنوان اللي تحت، وبعدين كمّل عشان ترفع إثبات الدفع.'
              )}
            </p>
            <Card className="p-4 flex items-center justify-between">
              <span className="text-sm font-mono text-ink-800" dir="ltr">
                payments@cana.app
              </span>
              <button onClick={copyHandle} className="text-ink-500 hover:text-ink-800">
                <Copy size={16} />
              </button>
            </Card>
            <a
              href="https://www.paypal.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-full border border-ink-200 py-2.5 text-sm font-medium text-ink-700"
            >
              {t('Open PayPal', 'افتح PayPal')} <ExternalLink size={14} />
            </a>
            <div className="flex gap-3">
              <Button variant="ghost" className="flex-1" onClick={() => setStep(1)}>
                {t('Back', 'رجوع')}
              </Button>
              <Button variant="gold" className="flex-1" onClick={() => setStep(3)}>
                {t("I've Paid — Continue", 'دفعت — كمّل')}
              </Button>
            </div>
          </div>
        )}

        {step === 2 && method === 'instapay' && (
          <div className="space-y-4">
            <p className="text-sm text-ink-700 leading-relaxed">
              {t(
                'Send your payment via InstaPay to the handle below, then continue to upload your proof of payment.',
                'ابعت الدفع عبر InstaPay للعنوان اللي تحت، وبعدين كمّل عشان ترفع إثبات الدفع.'
              )}
            </p>
            <Card className="p-4 flex items-center justify-between">
              <span className="text-sm font-mono text-ink-800" dir="ltr">
                {INSTAPAY_HANDLE}
              </span>
              <button onClick={copyHandle} className="text-ink-500 hover:text-ink-800">
                <Copy size={16} />
              </button>
            </Card>
            <div className="flex gap-3">
              <Button variant="ghost" className="flex-1" onClick={() => setStep(1)}>
                {t('Back', 'رجوع')}
              </Button>
              <Button variant="gold" className="flex-1" onClick={() => setStep(3)}>
                {t("I've Paid — Continue", 'دفعت — كمّل')}
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <UploadField
              label={t('Upload payment screenshot', 'ارفع صورة إثبات الدفع')}
              hint={t('A screenshot of the completed transfer', 'صورة من عملية التحويل بعد ما تخلص')}
              onUploaded={setScreenshotUploaded}
            />
            <p className="text-[11px] text-ink-400 text-center">
              {t(
                'Your profile is sent for review once you submit. Payment is verified separately by our team.',
                'ملفك بيتبعت للمراجعة أول ما تبعت. الدفع بيتراجع بشكل منفصل من فريقنا.'
              )}
            </p>
            <div className="flex gap-3">
              <Button variant="ghost" className="flex-1" onClick={() => setStep(2)}>
                {t('Back', 'رجوع')}
              </Button>
              <Button variant="gold" className="flex-1" loading={submitting} disabled={!screenshotUploaded} onClick={submitProof}>
                {t('Submit Payment Request', 'إرسال طلب الدفع')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
