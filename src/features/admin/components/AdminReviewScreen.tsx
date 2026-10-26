import { useAdminReviewStore } from '@/store/adminReview.store'
import { useAuthStore } from '@/store/auth.store'
import { useNotificationsStore } from '@/store/notifications.store'
import { usePendingChangesStore } from '@/store/pendingChanges.store'
import { useToast } from '@/shared/components/feedback/Toast'
import { useLanguage } from '@/core/hooks/useLanguage'
import { TopBar } from '@/shared/components/layout/TopBar'
import { UploadField } from '@/shared/components/ui/UploadField'
import { Badge } from '@/shared/components/ui/Badge'
import { Button } from '@/shared/components/ui/Button'
import { Clock, CheckCircle2, XCircle, FileWarning, Sparkles, Mail, MessageCircle, Check, X } from 'lucide-react'
import type { AdminReviewState } from '@/types/app.types'

const stateMeta: Record<AdminReviewState, { icon: any; color: 'warning' | 'success' | 'danger' | 'info'; en: string; ar: string }> = {
  waiting_review: { icon: Clock, color: 'info', en: 'Waiting Review', ar: 'قيد المراجعة' },
  approved: { icon: CheckCircle2, color: 'success', en: 'Approved', ar: 'مقبول' },
  rejected: { icon: XCircle, color: 'danger', en: 'Rejected', ar: 'مرفوض' },
  needs_more_documents: { icon: FileWarning, color: 'warning', en: 'Needs More Documents', ar: 'محتاج مستندات إضافية' },
}

const sectionLabels: Record<string, string> = {
  'Identity Verification': 'التحقق من الهوية',
  'Church & Faith Verification': 'التحقق من الكنيسة والإيمان',
  'Marriage Eligibility': 'أهلية الجواز',
  'Medical Verification': 'التحقق الطبي',
}

const fieldLabels: Record<string, string> = {
  'Full Legal Name': 'الاسم القانوني الكامل',
  'Date of Birth': 'تاريخ الميلاد',
  'Marital Status': 'الحالة الاجتماعية',
  Church: 'الكنيسة',
  'Priest Recommendation Letter': 'خطاب إثبات الأهلية للزواج من الكنيسة',
  'Medical Documents': 'المستندات الطبية',
  'Identity Verification': 'التحقق من الهوية',
}

const sampleIssuesAr: Record<string, string> = {
  'Identity Verification': 'صورة إثبات الهوية غير واضحة — حاول ترفع صورة أوضح.',
  'Church & Faith Verification': 'مقدرناش نأكد كنيستك من خطاب التوصية — ارفع نسخة موقعة ومؤرخة.',
  'Marriage Eligibility': 'ارفع صورة أوضح من وثيقة الطلاق.',
  'Medical Verification': 'المستند الطبي اللي رفعته يبدو ناقص — ارفع التقرير كامل.',
}
const sampleIssuesEn: Record<string, string> = {
  'Identity Verification': 'Your government ID photo is blurry — please re-upload a clearer scan.',
  'Church & Faith Verification': "We couldn't confirm your parish from the recommendation letter — please re-upload a signed, dated copy.",
  'Marriage Eligibility': 'Please re-upload a clearer scan of your divorce certificate.',
  'Medical Verification': 'The medical document you uploaded appears incomplete — please re-upload the full report.',
}

export function AdminReviewScreen() {
  const { reviews, setSectionState, overallStatus } = useAdminReviewStore()
  const { changes, approve, reject } = usePendingChangesStore()
  const user = useAuthStore((s) => s.user)
  const { show } = useToast()
  const { language, t } = useLanguage()
  const status = overallStatus()

  const notifyIssue = (section: string, note: string) => {
    setSectionState(section, 'needs_more_documents', note)
    useNotificationsStore.getState().push({
      type: 'verification_update',
      title: t(`Action needed: ${section}`, `محتاجين إجراء: ${sectionLabels[section] ?? section}`),
      body: note,
      target: '/app/settings/verification',
    })
    show(
      t(
        `Email sent to ${user?.email ?? 'your inbox'} and WhatsApp sent to ${user?.phone ?? 'your number'} about ${section}`,
        `اتبعت إيميل لـ ${user?.email ?? 'إيميلك'} ورسالة واتساب لـ ${user?.phone ?? 'رقمك'} بخصوص ${sectionLabels[section] ?? section}`
      ),
      'error'
    )
  }

  const simulateAdminReview = () => {
    const pending = reviews.filter((r) => r.state === 'waiting_review')
    if (pending.length === 0) {
      show(t('No sections waiting on review right now', 'مفيش أقسام مستنية مراجعة دلوقتي'), 'info')
      return
    }
    pending.forEach((r) => {
      const flagIt = Math.random() < 0.4
      if (flagIt) {
        const note = language === 'ar' ? sampleIssuesAr[r.section] ?? 'راجع وارفع المستند المطلوب تاني.' : sampleIssuesEn[r.section] ?? 'Please review and re-upload the required document.'
        notifyIssue(r.section, note)
      } else {
        setSectionState(r.section, 'approved')
      }
    })
    show(t('Admin review simulated', 'تمت محاكاة مراجعة الأدمن'), 'success')
  }

  return (
    <div>
      <TopBar showBack title={t('Verification Status', 'حالة التوثيق')} />
      <div className="px-5 pt-2 pb-8 space-y-4">
        <div
          className={
            status === 'approved'
              ? 'rounded-[var(--radius-md)] bg-success-100 border border-success-500/20 px-4 py-3 text-sm text-success-500 font-medium'
              : status === 'needs_action'
              ? 'rounded-[var(--radius-md)] bg-warning-100 border border-warning-500/20 px-4 py-3 text-sm text-warning-500 font-medium'
              : 'rounded-[var(--radius-md)] bg-info-100 border border-info-500/20 px-4 py-3 text-sm text-info-500 font-medium'
          }
        >
          {status === 'approved' && t("You're fully verified — welcome to the community.", 'إنت موثّق بالكامل — أهلًا بيك في المجتمع.')}
          {status === 'pending' && t('Your profile is Pending review until our team approves every section.', 'ملفك قيد المراجعة لحد ما فريقنا يوافق على كل قسم.')}
          {status === 'needs_action' && t('Action needed on one or more sections — see below.', 'محتاجين إجراء منك في قسم أو أكتر — شوف تحت.')}
        </div>

        <p className="text-sm text-ink-500">{t('Our team manually reviews sensitive documents to keep this community trustworthy.', 'فريقنا بيراجع المستندات الحساسة يدويًا عشان نحافظ على مصداقية المجتمع.')}</p>

        {reviews.map((review) => {
          const meta = stateMeta[review.state]
          return (
            <div key={review.section} className="rounded-[var(--radius-md)] border border-ink-100 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-ink-900">{t(review.section, sectionLabels[review.section] ?? review.section)}</p>
                <Badge variant={meta.color}>
                  <meta.icon size={11} /> {t(meta.en, meta.ar)}
                </Badge>
              </div>
              {review.note && (
                <div className="space-y-1.5">
                  <p className="text-xs text-warning-500 bg-warning-100 rounded-md px-3 py-2">{review.note}</p>
                  <p className="flex items-center gap-3 text-[11px] text-ink-400">
                    <span className="flex items-center gap-1">
                      <Mail size={11} /> {t('Sent to', 'اتبعت لـ')} {user?.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle size={11} /> {t('Sent to', 'اتبعت لـ')} {user?.phone}
                    </span>
                  </p>
                </div>
              )}
              {review.state === 'needs_more_documents' && (
                <UploadField
                  label={t('Re-upload document', 'ارفع المستند تاني')}
                  onUploaded={(v) => {
                    if (v) {
                      setSectionState(review.section, 'waiting_review')
                      show(t('Resubmitted for review', 'اتبعت للمراجعة تاني'), 'success')
                    }
                  }}
                />
              )}
              <p className="text-[11px] text-ink-400">
                {t('Updated', 'آخر تحديث')} {new Date(review.updatedAt).toLocaleDateString()}
              </p>
            </div>
          )
        })}

        <div className="pt-2">
          <Button variant="outline" size="sm" className="w-full" onClick={simulateAdminReview}>
            <Sparkles size={14} /> {t('Simulate Admin Review (demo only)', 'محاكاة مراجعة الأدمن (للتجربة فقط)')}
          </Button>
          <p className="text-[11px] text-ink-400 text-center mt-2">
            {t(
              'This button stands in for the real admin dashboard so you can preview the approve / flag-with-issue flow.',
              'الزرار ده بديل مؤقت للوحة تحكم الأدمن الحقيقية عشان تقدر تجرب فلو الموافقة/التنبيه بمشكلة.'
            )}
          </p>
        </div>

        {changes.length > 0 && (
          <div className="pt-4 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">{t('Pending Profile Changes', 'تعديلات مستنية موافقة')}</p>
            {changes.map((c) => (
              <div key={c.id} className="rounded-[var(--radius-md)] border border-ink-100 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-ink-900">{t(c.fieldLabel, fieldLabels[c.fieldLabel] ?? c.fieldLabel)}</p>
                  <Badge variant="warning">
                    <Clock size={11} /> {t('Pending', 'قيد الانتظار')}
                  </Badge>
                </div>
                <div className="text-xs text-ink-500 space-y-0.5">
                  <p>
                    <span className="text-ink-400">{t('Current:', 'الحالي:')}</span> {c.oldSummary}
                  </p>
                  <p>
                    <span className="text-ink-400">{t('Requested:', 'المطلوب:')}</span> {c.newSummary}
                  </p>
                </div>
                <div className="flex gap-2 pt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      approve(c.id)
                      show(t(`Approved: ${c.fieldLabel}`, `تمت الموافقة: ${fieldLabels[c.fieldLabel] ?? c.fieldLabel}`), 'success')
                    }}
                  >
                    <Check size={13} /> {t('Approve', 'موافقة')}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      reject(c.id)
                      show(t(`Rejected: ${c.fieldLabel}`, `تم الرفض: ${fieldLabels[c.fieldLabel] ?? c.fieldLabel}`), 'info')
                    }}
                  >
                    <X size={13} /> {t('Reject', 'رفض')}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
