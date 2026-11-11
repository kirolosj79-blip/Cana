import { useState } from 'react'
import { Clock, CheckCircle2, XCircle, User, Calendar, CreditCard } from 'lucide-react'
import { TopBar } from '@/shared/components/layout/TopBar'
import { Badge } from '@/shared/components/ui/Badge'
import { Button } from '@/shared/components/ui/Button'
import { Card } from '@/shared/components/ui/Card'
import { EmptyState } from '@/shared/components/feedback/StateScreens'
import { Textarea } from '@/shared/components/ui/Textarea'
import { usePaymentRequestsStore } from '@/store/paymentRequests.store'
import { useAuthStore } from '@/store/auth.store'
import { useRegistrationStore } from '@/store/registration.store'
import { useToast } from '@/shared/components/feedback/Toast'
import { useLanguage } from '@/core/hooks/useLanguage'
import type { PaymentRequestStatus } from '@/types/app.types'

const statusMeta: Record<PaymentRequestStatus, { icon: any; color: 'warning' | 'success' | 'danger'; en: string; ar: string }> = {
  pending_review: { icon: Clock, color: 'warning', en: 'Pending Review', ar: 'قيد المراجعة' },
  approved: { icon: CheckCircle2, color: 'success', en: 'Approved', ar: 'مقبول' },
  rejected: { icon: XCircle, color: 'danger', en: 'Rejected', ar: 'مرفوض' },
}

/**
 * Dedicated review page for the person responsible for approving payments —
 * not just a notification. This is the only place a reviewer needs to check;
 * it's always available regardless of whether a notification was seen or
 * dismissed. In this prototype there's no separate admin login/session, so
 * this page and the member-facing app share the same session — but the data
 * model (a real list of requests with user/plan/method/proof/status) is the
 * same shape a real admin panel would use.
 */
export function PaymentReviewScreen() {
  const { requests, approve, reject } = usePaymentRequestsStore()
  const user = useAuthStore((s) => s.user)
  const { draft } = useRegistrationStore()
  const { show } = useToast()
  const { language, t } = useLanguage()
  const [noteDraft, setNoteDraft] = useState<Record<string, string>>({})

  const memberName = [draft.personal.firstName, draft.personal.lastName].filter(Boolean).join(' ') || t('Member', 'العضو')

  return (
    <div>
      <TopBar showBack title={t('Payment Review', 'مراجعة المدفوعات')} />
      <div className="px-5 pt-2 pb-8 space-y-4">
        <p className="text-sm text-ink-500">
          {t(
            'Review submitted payment proofs and approve or reject each request.',
            'راجع إثباتات الدفع المرسلة ووافق أو ارفض كل طلب.'
          )}
        </p>

        {requests.length === 0 ? (
          <EmptyState icon={<CreditCard size={22} />} title={t('No payment requests yet', 'لسه مفيش طلبات دفع')} />
        ) : (
          <div className="space-y-4">
            {requests.map((r) => {
              const meta = statusMeta[r.status]
              return (
                <Card key={r.id} className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm font-medium text-ink-900">
                      <User size={14} className="text-ink-400" /> {memberName}
                    </span>
                    <Badge variant={meta.color}>
                      <meta.icon size={11} /> {language === 'ar' ? meta.ar : meta.en}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-y-1.5 text-xs text-ink-500">
                    <span className="flex items-center gap-1.5">
                      <CreditCard size={12} /> {r.method === 'paypal' ? 'PayPal' : 'InstaPay'}
                    </span>
                    <span className="flex items-center gap-1.5 justify-self-end">
                      <Calendar size={12} /> {new Date(r.submittedAt).toLocaleDateString()}
                    </span>
                    <span>{t('Plan', 'الخطة')}: Cana Membership — $50</span>
                    <span className="justify-self-end">
                      {t('Phone', 'الرقم')}: {user?.phone ?? '—'}
                    </span>
                  </div>

                  <div className="rounded-[var(--r-md)] border border-dashed border-ink-200 h-28 flex items-center justify-center text-xs text-ink-400">
                    {r.screenshotUploaded ? t('Payment screenshot on file', 'صورة إثبات الدفع مرفوعة') : t('No screenshot uploaded', 'مفيش صورة مرفوعة')}
                  </div>

                  {r.status === 'pending_review' && (
                    <>
                      <Textarea
                        placeholder={t('Optional note (shown to the member if rejected)', 'ملاحظة اختيارية (بتتبعت للعضو لو اتراجع)')}
                        rows={2}
                        value={noteDraft[r.id] ?? ''}
                        onChange={(e) => setNoteDraft((s) => ({ ...s, [r.id]: e.target.value }))}
                      />
                      <div className="flex gap-2">
                        <Button
                          variant="gold"
                          className="flex-1"
                          onClick={() => {
                            approve(r.id, noteDraft[r.id])
                            show(t('Payment approved', 'تم قبول الدفع'), 'success')
                          }}
                        >
                          <CheckCircle2 size={15} /> {t('Approve', 'قبول')}
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => {
                            reject(r.id, noteDraft[r.id])
                            show(t('Payment rejected', 'تم رفض الدفع'), 'info')
                          }}
                        >
                          <XCircle size={15} /> {t('Reject', 'رفض')}
                        </Button>
                      </div>
                    </>
                  )}

                  {r.status !== 'pending_review' && r.reviewNote && (
                    <p className="text-xs text-ink-500 italic">
                      {t('Note:', 'ملاحظة:')} {r.reviewNote}
                    </p>
                  )}
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
