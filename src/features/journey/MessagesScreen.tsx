import { useNavigate } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'
import { TopBar } from '@/shared/components/layout/TopBar'
import { EmptyState } from '@/shared/components/feedback/StateScreens'
import { FCard } from '@/shared/components/ui/figma'
import { useRequestsStore } from '@/store/requests.store'
import { useJourneyStore } from '@/store/journey.store'
import { findCandidate } from '@/services/mock/candidates.mock'
import { useLanguage } from '@/core/hooks/useLanguage'

export function MessagesScreen() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const requests = useRequestsStore((s) => s.requests)
  const j = useJourneyStore()
  const active = requests.find((r) => r.status === 'accepted' && (r.fromUserId === 'me' || r.toUserId === 'me'))
  const otherId = active ? (active.fromUserId === 'me' ? active.toUserId : active.fromUserId) : null
  const other = otherId ? findCandidate(otherId) : null
  const last = otherId ? (j.messages[otherId] ?? []).slice(-1)[0] : undefined

  return (
    <div>
      <TopBar title={t('Messages', 'الرسائل')} />
      <div className="px-5 pt-3">
        {!other || !otherId || j.completed.includes(otherId) || j.blocked.includes(otherId) ? (
          <EmptyState icon={<MessageCircle size={24} />} title={t('No active conversation', 'مفيش محادثة نشطة')} description={t('Once an introduction is mutually accepted, your private conversation appears here.', 'أول ما التعارف يتقبل من الطرفين، محادثتك الخاصة هتظهر هنا.')} />
        ) : (
          <button className="w-full text-start" onClick={() => navigate(j.guidelinesAcceptedFor.includes(otherId) ? `/app/chat/${otherId}` : `/app/guidelines/${otherId}`)}>
            <FCard className="flex items-center gap-3">
              <img src={other.personal.profilePhotoUrl} alt="" className="h-12 w-12 rounded-full bg-ink-100 object-cover" />
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-bold text-ink-900">{other.personal.displayName}</p>
                <p className="truncate text-[11px] text-ink-500">{last?.text ?? t('Start the conversation', 'ابدأ المحادثة')}</p>
              </div>
              <span className="h-2 w-2 rounded-full bg-success-500" />
            </FCard>
          </button>
        )}
      </div>
    </div>
  )
}
