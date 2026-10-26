import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { TopBar } from '@/shared/components/layout/TopBar'
import { ChoiceGroup } from '@/shared/components/ui/ChoiceGroup'
import { Textarea } from '@/shared/components/ui/Textarea'
import { UploadField } from '@/shared/components/ui/UploadField'
import { Button } from '@/shared/components/ui/Button'
import { useComplaintsStore } from '@/store/complaints.store'
import { complaintCategoryLabels } from '@/services/mock/app.mock'
import { findCandidate } from '@/services/mock/candidates.mock'
import { useToast } from '@/shared/components/feedback/Toast'
import { useLanguage } from '@/core/hooks/useLanguage'
import type { ComplaintCategory } from '@/types/app.types'
import { LayoutDashboard } from 'lucide-react'

export function ComplaintFormScreen() {
  const location = useLocation() as { state?: { againstUserId?: string } }
  const navigate = useNavigate()
  const submit = useComplaintsStore((s) => s.submit)
  const { show } = useToast()
  const { language, t } = useLanguage()
  const [category, setCategory] = useState<ComplaintCategory | ''>('')
  const [description, setDescription] = useState('')
  const [screenshotUploaded, setScreenshotUploaded] = useState(false)
  const [loading, setLoading] = useState(false)
  const reportedUser = location.state?.againstUserId ? findCandidate(location.state.againstUserId) : undefined

  const handleSubmit = () => {
    if (!category || !description.trim()) return
    setLoading(true)
    setTimeout(() => {
      submit(category as ComplaintCategory, description, location.state?.againstUserId, screenshotUploaded)
      show(t('Complaint submitted to our Administrator Dashboard for review', 'الشكوى اتبعتت للوحة تحكم الإدارة للمراجعة'), 'success')
      navigate('/app/complaints')
      setLoading(false)
    }, 700)
  }

  return (
    <div>
      <TopBar showBack title={t('Report a Concern', 'الإبلاغ عن مشكلة')} />
      <div className="px-5 pt-2 pb-8 space-y-6">
        {reportedUser && (
          <div className="flex items-center gap-3 rounded-[var(--radius-md)] border border-ink-100 px-4 py-3">
            <img src={reportedUser.personal.profilePhotoUrl} className="h-10 w-10 rounded-full object-cover bg-ink-100" />
            <div>
              <p className="text-xs text-ink-400">{t('Reporting', 'الإبلاغ عن')}</p>
              <p className="text-sm font-medium text-ink-800">{reportedUser.personal.displayName}</p>
            </div>
          </div>
        )}

        <div className="flex items-start gap-2.5 rounded-[var(--radius-md)] bg-info-100 border border-info-500/20 px-4 py-3">
          <LayoutDashboard size={15} className="text-info-500 shrink-0 mt-0.5" />
          <p className="text-xs text-info-500">
            {t(
              'Your report goes to our Administrator Dashboard for review — not to a public chat or WhatsApp thread. False reports may affect your account standing.',
              'بلاغك بيروح للوحة تحكم الإدارة للمراجعة — مش لشات عام أو واتساب. البلاغات الكاذبة ممكن تأثر على حسابك.'
            )}
          </p>
        </div>

        <ChoiceGroup
          label={t('Category', 'الفئة')}
          value={category}
          onChange={(v) => setCategory(v)}
          options={Object.entries(complaintCategoryLabels).map(([value, label]) => ({ value, label: language === 'ar' ? label.ar : label.en }))}
        />
        <Textarea
          label={t('Describe what happened', 'وصف اللي حصل')}
          hint={t('Please include as much detail as possible, including date and time if relevant', 'اديني أكبر قدر من التفاصيل، بما فيها التاريخ والوقت لو له علاقة')}
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <UploadField label={t('Screenshot', 'صورة شاشة')} optional onUploaded={setScreenshotUploaded} />
        <Button variant="danger" size="lg" className="w-full" loading={loading} disabled={!category || !description.trim()} onClick={handleSubmit}>
          {t('Submit Complaint', 'إرسال الشكوى')}
        </Button>
      </div>
    </div>
  )
}
