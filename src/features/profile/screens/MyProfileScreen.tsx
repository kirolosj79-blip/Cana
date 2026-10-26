import { useNavigate } from 'react-router-dom'
import { ChevronRight, ShieldCheck, CreditCard, Flag, Settings, Pencil, LogOut, Eye, ListChecks, ClipboardCheck } from 'lucide-react'
import { TopBar } from '@/shared/components/layout/TopBar'
import { TrustSeal } from '@/shared/components/ui/TrustSeal'
import { Card } from '@/shared/components/ui/Card'
import { useAuthStore } from '@/store/auth.store'
import { useAdminReviewStore } from '@/store/adminReview.store'
import { useLanguage } from '@/core/hooks/useLanguage'
import type { AdminReviewState } from '@/types/app.types'
import type { VerificationStatus } from '@/types/profile.types'

const toSealStatus: Record<AdminReviewState, VerificationStatus> = {
  waiting_review: 'pending',
  approved: 'verified',
  rejected: 'rejected',
  needs_more_documents: 'needs_documents',
}

const sectionSeal: Record<string, { kind: 'identity' | 'church' | 'marriageEligibility' | 'medical'; labelEn: string; labelAr: string }> = {
  'Identity Verification': { kind: 'identity', labelEn: 'Identity', labelAr: 'الهوية' },
  'Church & Faith Verification': { kind: 'church', labelEn: 'Church', labelAr: 'الكنيسة' },
  'Marriage Eligibility': { kind: 'marriageEligibility', labelEn: 'Eligible', labelAr: 'الأهلية' },
  'Medical Verification': { kind: 'medical', labelEn: 'Medical', labelAr: 'الطبي' },
}

export function MyProfileScreen() {
  const navigate = useNavigate()
  const logout = useAuthStore((s) => s.logout)
  const { reviews, overallStatus } = useAdminReviewStore()
  const status = overallStatus()
  const { t } = useLanguage()

  const menuItems = [
    { icon: ListChecks, label: t('Registration Checklist', 'قائمة التسجيل'), to: '/registration-checklist' },
    { icon: Eye, label: t('Profile Visibility', 'ظهور بياناتك'), to: '/app/settings/visibility' },
    { icon: ShieldCheck, label: t('Verification Status', 'حالة التوثيق'), to: '/app/settings/verification' },
    { icon: CreditCard, label: t('Membership & Payment', 'العضوية والدفع'), to: '/payment/subscription' },
    { icon: ClipboardCheck, label: t('Payment Review (Admin)', 'مراجعة المدفوعات (إدارة)'), to: '/app/settings/payment-review' },
    { icon: Flag, label: t('Complaints', 'الشكاوى'), to: '/app/complaints' },
    { icon: Settings, label: t('Settings & Privacy', 'الإعدادات والخصوصية'), to: '/app/settings' },
  ]

  return (
    <div>
      <TopBar title={t('My Profile', 'ملفي الشخصي')} />
      <div className="px-5 pt-2 pb-8 space-y-6">
        <Card className="p-5 flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-ink-100 flex items-center justify-center text-ink-400 text-xl font-display">M</div>
          <div className="flex-1">
            <p className="font-display text-lg text-ink-900">{t('My Profile', 'ملفي الشخصي')}</p>
            <p className="text-xs text-ink-500">
              {status === 'approved'
                ? t('Fully verified member', 'عضو موثّق بالكامل')
                : status === 'needs_action'
                ? t('Action needed on your verification', 'محتاجين إجراء منك بخصوص التوثيق')
                : t('Status: Pending review', 'الحالة: قيد المراجعة')}
            </p>
          </div>
          <button onClick={() => navigate('/app/profile/edit')} className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-50 text-ink-600">
            <Pencil size={15} />
          </button>
        </Card>

        <div className="flex items-center justify-around rounded-[var(--radius-md)] bg-ink-50/70 py-4">
          {reviews.map((r) => {
            const seal = sectionSeal[r.section]
            if (!seal) return null
            return <TrustSeal key={r.section} kind={seal.kind} status={toSealStatus[r.state]} label={t(seal.labelEn, seal.labelAr)} />
          })}
        </div>

        <div className="space-y-1">
          {menuItems.map((item) => (
            <button key={item.label} onClick={() => navigate(item.to)} className="w-full flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-3.5 hover:bg-ink-50 text-left">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-50 text-ink-600">
                <item.icon size={16} />
              </span>
              <span className="flex-1 text-sm font-medium text-ink-800">{item.label}</span>
              <ChevronRight size={16} className="text-ink-300" />
            </button>
          ))}
          <button
            onClick={() => {
              logout()
              navigate('/welcome')
            }}
            className="w-full flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-3.5 hover:bg-danger-100 text-left"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-danger-100 text-danger-500">
              <LogOut size={16} />
            </span>
            <span className="flex-1 text-sm font-medium text-danger-500">{t('Log Out', 'تسجيل خروج')}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
