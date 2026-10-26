import { useNavigate } from 'react-router-dom'
import { Flag, Plus } from 'lucide-react'
import { TopBar } from '@/shared/components/layout/TopBar'
import { Button } from '@/shared/components/ui/Button'
import { Badge } from '@/shared/components/ui/Badge'
import { EmptyState } from '@/shared/components/feedback/StateScreens'
import { useComplaintsStore } from '@/store/complaints.store'
import { complaintCategoryLabels } from '@/services/mock/app.mock'
import { useLanguage } from '@/core/hooks/useLanguage'

const statusVariant = { submitted: 'warning', in_review: 'info', resolved: 'success' } as const
const statusLabelsAr: Record<string, string> = { submitted: 'اتبعتت', in_review: 'قيد المراجعة', resolved: 'اتحلت' }

export function ComplaintsListScreen() {
  const navigate = useNavigate()
  const complaints = useComplaintsStore((s) => s.complaints)
  const { language, t } = useLanguage()

  return (
    <div>
      <TopBar showBack title={t('Complaints', 'الشكاوى')} />
      <div className="px-5 pt-2 pb-8">
        <Button variant="outline" className="w-full mb-5" onClick={() => navigate('/app/complaints/new')}>
          <Plus size={16} /> {t('Report a New Concern', 'بلّغ عن مشكلة جديدة')}
        </Button>
        {complaints.length === 0 ? (
          <EmptyState icon={<Flag size={22} />} title={t('No complaints filed', 'مفيش شكاوى متسجلة')} description={t('Anything you report will be tracked here.', 'أي بلاغ تعمله هيتسجل هنا.')} />
        ) : (
          <div className="space-y-3">
            {complaints.map((c) => (
              <div key={c.id} className="rounded-[var(--radius-md)] border border-ink-100 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-ink-900">{language === 'ar' ? complaintCategoryLabels[c.category].ar : complaintCategoryLabels[c.category].en}</p>
                  <Badge variant={statusVariant[c.status]}>{language === 'ar' ? statusLabelsAr[c.status] : c.status.replace('_', ' ')}</Badge>
                </div>
                <p className="text-xs text-ink-500 mt-1.5">{c.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
