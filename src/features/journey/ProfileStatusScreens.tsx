import { useNavigate, useParams, Navigate } from 'react-router-dom'
import { ShieldAlert, Sun, ShieldCheck, Info, Clock, CreditCard } from 'lucide-react'
import type { ElementType } from 'react'
import { FigmaHeader } from '@/shared/components/layout/FigmaHeader'
import { useJourneyStore } from '@/store/journey.store'
import { useLanguage } from '@/core/hooks/useLanguage'
import { cn } from '@/shared/utils/cn'

export type ProfileStatusKind = 'suspended' | 'closed' | 'rejected' | 'approved' | 'info'

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
      title: t('Account Temporarily Suspended', 'تم إيقاف حسابك مؤقتًا'),
      body: t('Your CANA account has been temporarily suspended. Please check your notifications for more information or contact CANA Support if you need assistance.', 'تم إيقاف حسابك على CANA مؤقتًا. من فضلك راجع الإشعارات لمعرفة المزيد من التفاصيل، أو تواصل مع فريق دعم CANA لو محتاج أي مساعدة.'),
      buttons: [
        { label: t('Contact CANA Support', 'التواصل مع دعم CANA'), cls: SOFT_RED, fn: () => navigate('/app/complaints/new') },
        { label: t('Check Notifications', 'مراجعة الإشعارات'), cls: SOFT_BEIGE, fn: () => navigate('/app/notifications') },
      ],
    },
    closed: {
      icon: Sun, tile: 'bg-[#E9ECFB] text-[#4A5BD0]',
      title: t('Profile Temporarily Closed', 'تم إيقاف ملفك الشخصي مؤقتًا'),
      body: t('Your CANA profile is temporarily closed, and you will not receive new introductions at this time. You’re welcome to return and reactivate your account in the future.', 'ملفك الشخصي على CANA متوقف مؤقتًا، وبالتالي مش هتستقبل أي ترشيحات جديدة للتعارف في الوقت الحالي. تقدر ترجع في أي وقت في المستقبل وتعيد تفعيل حسابك.'),
      buttons: [
        { label: t('Reactivate Profile', 'إعادة تفعيل الملف الشخصي'), cls: NAVY, fn: () => (feedbackOwed ? navigate('/app/feedback') : reactivate()) },
        { label: t('Account Settings', 'إعدادات الحساب'), cls: SOFT_BLUE, fn: () => navigate('/app/settings') },
      ],
    },
    rejected: {
      icon: ShieldAlert, tile: 'bg-[#FBE9EA] text-[#C42B35]',
      title: t('Application Not Approved', 'للأسف، لم تتم الموافقة على طلب التسجيل'),
      body: t('Thank you for your interest in CANA. Unfortunately, your application has not been approved. Please check your notifications for more information.', 'شكرًا لاهتمامك بالانضمام إلى CANA. نأسف لإبلاغك إنه لم تتم الموافقة على طلب تسجيلك في الوقت الحالي. من فضلك راجع الإشعارات لمعرفة المزيد من التفاصيل.'),
      buttons: [
        { label: t('Contact CANA Support', 'التواصل مع دعم CANA'), cls: SOFT_RED, fn: () => navigate('/app/complaints/new') },
        { label: t('Check Notifications', 'مراجعة الإشعارات'), cls: SOFT_BEIGE, fn: () => navigate('/app/notifications') },
      ],
    },
    approved: {
      icon: ShieldCheck, tile: 'bg-[#E6F6EC] text-[#2E9E5B]',
      title: t('Profile Approved', 'تمت الموافقة على ملفك الشخصي'),
      body: t('Your CANA profile has been approved. We’ll now begin looking for suitable introductions based on your preferences. Finding the right introduction may take time, and we’ll notify you when a suitable introduction is available.', 'تمت الموافقة على ملفك الشخصي في CANA. هنبدأ دلوقتي ندور لك على ترشيحات مناسبة، بناءً على المواصفات والتفضيلات اللي اخترتها. العثور على الشخص المناسب ممكن ياخد بعض الوقت، وهنبعت لك إشعار أول ما يتوفر ترشيح مناسب ليك.'),
      buttons: [{ label: t('View Matching Status', 'عرض حالة الترشيحات'), cls: NAVY, fn: () => navigate('/app/home?nomatches=1') }],
    },
    info: {
      icon: Info, tile: 'bg-[#FFF4DB] text-[#C9871A]',
      title: t('Additional Information Required', 'مطلوب استكمال بعض البيانات'),
      body: t('We need a little more information to complete the review of your CANA application. Please check your notifications for details and update your application so we can continue the review.', 'محتاجين منك شوية معلومات إضافية علشان نقدر نكمل مراجعة طلبك في CANA. من فضلك راجع الإشعارات لمعرفة التفاصيل، وحدّث بيانات طلبك علشان نقدر نكمل المراجعة.'),
      buttons: [{ label: t('Complete Application', 'استكمال بيانات الطلب'), cls: NAVY, fn: () => navigate('/app/settings/verification') }],
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
  const ok = ['suspended', 'closed', 'rejected', 'approved', 'info']
  if (!kind || !ok.includes(kind)) return <Navigate to="/app/home" replace />
  return <div><FigmaHeader /><div className="px-5"><ProfileStatusCard kind={kind as ProfileStatusKind} /></div></div>
}
