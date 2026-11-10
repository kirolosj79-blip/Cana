import { useNavigate, useParams, Navigate } from 'react-router-dom'
import { ShieldAlert, Sun, ShieldCheck, Info, Clock, CreditCard } from 'lucide-react'
import type { ElementType } from 'react'
import { FigmaHeader } from '@/shared/components/layout/FigmaHeader'
import { useJourneyStore } from '@/store/journey.store'
import { useLanguage } from '@/core/hooks/useLanguage'
import { cn } from '@/shared/utils/cn'

export type ProfileStatusKind = 'suspended' | 'closed' | 'rejected' | 'approved' | 'info' | 'review' | 'payment' | 'paymentPending'

const NAVY = 'bg-cta-bg text-cta-text'
const SOFT_RED = 'bg-[#FBE9EA] text-[#C42B35]'
const SOFT_BEIGE = 'bg-[#EDE6DB] text-[#0C1D3A]'
const SOFT_BLUE = 'bg-[#E9ECFB] text-[#0C1D3A]'

/** Figma "5 Status to your profile": a single centered card inside the Home shell. */
export function ProfileStatusCard({ kind }: { kind: ProfileStatusKind }) {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const reactivate = useJourneyStore((s) => s.reactivate)
  const feedbackOwed = useJourneyStore((s) => s.feedbackOwed)

  const cfg: Record<ProfileStatusKind, {
    icon: ElementType; tile: string; title: string; body: string
    buttons: { label: string; cls: string; fn: () => void }[]
  }> = {
    suspended: {
      icon: ShieldAlert, tile: 'bg-[#FBE9EA] text-[#C42B35]',
      title: t('Account Temporarily Suspended', 'الحساب موقوف مؤقتًا'),
      body: t('Your CANA account has been temporarily suspended. Please check your notifications for more information or contact CANA Support if you need assistance.', 'حسابك في CANA موقوف مؤقتًا. راجع الإشعارات لمزيد من المعلومات أو تواصل مع دعم CANA لو محتاج مساعدة.'),
      buttons: [
        { label: t('Contact CANA Support', 'تواصل مع دعم CANA'), cls: SOFT_RED, fn: () => navigate('/app/complaints/new') },
        { label: t('Check Notifications', 'شوف الإشعارات'), cls: SOFT_BEIGE, fn: () => navigate('/app/notifications') },
      ],
    },
    closed: {
      icon: Sun, tile: 'bg-[#E9ECFB] text-[#4A5BD0]',
      title: t('Profile Temporarily Closed', 'الملف مغلق مؤقتًا'),
      body: t('Your CANA profile is temporarily closed, and you will not receive new introductions at this time. You’re welcome to return and reactivate your account in the future.', 'ملفك في CANA مغلق مؤقتًا ومش هتستقبل تعارفات جديدة دلوقتي. مرحّب بيك ترجع وتفعّل حسابك في أي وقت.'),
      buttons: [
        { label: t('Reactivate Profile', 'إعادة تفعيل الملف'), cls: NAVY, fn: () => (feedbackOwed ? navigate('/app/feedback') : reactivate()) },
        { label: t('Account Settings', 'إعدادات الحساب'), cls: SOFT_BLUE, fn: () => navigate('/app/settings') },
      ],
    },
    rejected: {
      icon: ShieldAlert, tile: 'bg-[#FBE9EA] text-[#C42B35]',
      title: t('Application Not Approved', 'الطلب غير موافق عليه'),
      body: t('Thank you for your interest in CANA. Unfortunately, your application has not been approved. Please check your notifications for more information.', 'شكرًا لاهتمامك بـ CANA. للأسف طلبك لم تتم الموافقة عليه. راجع الإشعارات لمزيد من المعلومات.'),
      buttons: [
        { label: t('Contact CANA Support', 'تواصل مع دعم CANA'), cls: SOFT_RED, fn: () => navigate('/app/complaints/new') },
        { label: t('Check Notifications', 'شوف الإشعارات'), cls: SOFT_BEIGE, fn: () => navigate('/app/notifications') },
      ],
    },
    approved: {
      icon: ShieldCheck, tile: 'bg-[#E6F6EC] text-[#2E9E5B]',
      title: t('Profile Approved', 'تمت الموافقة على الملف'),
      body: t('Good news! Your CANA profile has been approved. We’ll now begin looking for suitable introductions based on your preferences. Finding the right introduction may take time, and we’ll notify you when a suitable introduction is available.', 'أخبار سارة! تمت الموافقة على ملفك في CANA. هنبدأ دلوقتي ندوّر على تعارفات مناسبة حسب تفضيلاتك. إيجاد التعارف المناسب ممكن ياخد وقت، وهنبلّغك أول ما يتوفر.'),
      buttons: [{ label: t('View Matching Status', 'شوف حالة الترشيح'), cls: NAVY, fn: () => navigate('/app/home?nomatches=1') }],
    },
    review: {
      icon: Clock, tile: 'bg-[#E9ECFB] text-[#4A5BD0]',
      title: t('Profile Under Review', 'الملف قيد المراجعة'),
      body: t('Your profile is with our team for review. Introductions unlock automatically once it is approved.', 'ملفك مع فريقنا للمراجعة. التعارفات هتتفتح تلقائي أول ما تتم الموافقة.'),
      buttons: [{ label: t('View Review Status', 'شوف حالة المراجعة'), cls: NAVY, fn: () => navigate('/app/settings/verification') }],
    },
    payment: {
      icon: CreditCard, tile: 'bg-[#FFF4DB] text-[#C9871A]',
      title: t('Membership Required', 'مطلوب تفعيل العضوية'),
      body: t('Your profile is approved. Complete your subscription payment to start receiving introductions.', 'تمت الموافقة على ملفك. كمّل دفع الاشتراك عشان تبدأ تستقبل التعارفات.'),
      buttons: [{ label: t('Complete Payment', 'كمّل الدفع'), cls: NAVY, fn: () => navigate('/payment/subscription') }],
    },
    paymentPending: {
      icon: Clock, tile: 'bg-[#FFF4DB] text-[#C9871A]',
      title: t('Payment Pending', 'الدفع قيد المراجعة'),
      body: t('Your payment proof is with our team for review. Full access unlocks automatically once approved.', 'إثبات الدفع بتاعك مع فريقنا للمراجعة. هيتفتح الوصول الكامل تلقائي أول ما يتوافق عليه.'),
      buttons: [{ label: t('Track Payment Status', 'متابعة حالة الطلب'), cls: NAVY, fn: () => navigate('/payment/subscription') }],
    },
    info: {
      icon: Info, tile: 'bg-[#FFF4DB] text-[#C9871A]',
      title: t('Additional Information Required', 'مطلوب معلومات إضافية'),
      body: t('We need a little more information to complete the review of your CANA application. Please check your notifications for details and update your application so we can continue the review.', 'محتاجين شوية معلومات إضافية لاستكمال مراجعة طلبك في CANA. راجع الإشعارات للتفاصيل وحدّث طلبك عشان نكمل المراجعة.'),
      buttons: [{ label: t('Complete Application', 'استكمل الطلب'), cls: NAVY, fn: () => navigate('/app/settings/verification') }],
    },
  }
  const c = cfg[kind]
  return (
    <div className="flex min-h-[60vh] items-center">
      <div className="w-full rounded-[22px] bg-parchment-0 px-5 py-6 text-center shadow-[var(--shadow-soft-sm)]">
        <span className={cn('mx-auto flex h-11 w-11 items-center justify-center rounded-xl', c.tile)}><c.icon size={20} /></span>
        <h2 className="mt-3 text-[15px] font-bold text-ink-900">{c.title}</h2>
        <p className="mt-2 text-[12px] leading-relaxed text-ink-500">{c.body}</p>
        <div className="mt-4 space-y-2">
          {c.buttons.map((b) => (
            <button key={b.label} onClick={b.fn} className={cn('w-full rounded-xl py-3 text-[13px] font-bold transition active:scale-[0.98]', b.cls)}>{b.label}</button>
          ))}
        </div>
      </div>
    </div>
  )
}

/** Preview route for all five states: /app/status/:kind */
export function ProfileStatusScreen() {
  const { kind } = useParams()
  const ok = ['suspended', 'closed', 'rejected', 'approved', 'info', 'review', 'payment', 'paymentPending']
  if (!kind || !ok.includes(kind)) return <Navigate to="/app/home" replace />
  return <div><FigmaHeader /><div className="px-5"><ProfileStatusCard kind={kind as ProfileStatusKind} /></div></div>
}
