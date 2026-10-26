import { useNavigate } from 'react-router-dom'
import { Check, X, Ban, HeartHandshake, Clock, XCircle, MessageCircle } from 'lucide-react'
import { TopBar } from '@/shared/components/layout/TopBar'
import { Button } from '@/shared/components/ui/Button'
import { Badge } from '@/shared/components/ui/Badge'
import { EmptyState } from '@/shared/components/feedback/StateScreens'
import { useRequestsStore } from '@/store/requests.store'
import { findCandidate } from '@/services/mock/candidates.mock'
import { useToast } from '@/shared/components/feedback/Toast'
import { useCelebration } from '@/shared/components/feedback/Celebration'
import { useLanguage } from '@/core/hooks/useLanguage'
import { useJourneyStore } from '@/store/journey.store'

/**
 * Reflects the "one thing at a time" rule visually, not just in blocking
 * logic: a member sees exactly one card — their single pending or active
 * item — never a growing list. A resolved (rejected/cancelled/expired)
 * request is shown once as a brief notice, then it's gone for good.
 */
export function RequestsScreen() {
  const { respond, cancel, getCurrentState, getLastResolved } = useRequestsStore()
  const { show } = useToast()
  const guidelinesDone = useJourneyStore((s) => s.guidelinesAcceptedFor)
  const { celebrate } = useCelebration()
  const navigate = useNavigate()
  const { t } = useLanguage()

  const current = getCurrentState()
  const lastResolved = !current ? getLastResolved() : null

  const otherId = current ? (current.fromUserId === 'me' ? current.toUserId : current.fromUserId) : lastResolved ? (lastResolved.fromUserId === 'me' ? lastResolved.toUserId : lastResolved.fromUserId) : null
  const candidate = otherId ? findCandidate(otherId) : null

  const resolvedLabel = (status: string) =>
    ({
      rejected: t('was declined', 'كان مرفوض'),
      cancelled: t('was cancelled', 'اتلغى'),
      expired: t('expired with no response', 'انتهى من غير رد'),
    })[status] ?? ''

  return (
    <div>
      <TopBar title={t('Connections', 'ارتباطاتك')} />
      <div className="px-5 pt-2 pb-6">
        {!current && !candidate && (
          <EmptyState
            icon={<HeartHandshake size={24} />}
            title={t('No requests right now', 'مفيش طلبات دلوقتي')}
            description={t('Send a connection request from any profile to get started.', 'ابعت طلب ارتباط من أي بروفايل عشان تبدأ.')}
          />
        )}

        {!current && lastResolved && candidate && (
          <>
            <div className="mb-5 flex items-center gap-3 rounded-[var(--radius-md)] bg-ink-50 px-4 py-3">
              <img src={candidate.personal.profilePhotoUrl} className="h-10 w-10 rounded-full object-cover bg-ink-100" />
              <p className="text-xs text-ink-500 flex-1">
                <span className="font-medium text-ink-700">{candidate.personal.displayName}</span> {resolvedLabel(lastResolved.status)}
              </p>
              <XCircle size={16} className="text-ink-300 shrink-0" />
            </div>
            <EmptyState
              icon={<HeartHandshake size={24} />}
              title={t("You're free to send a new request", 'إنت متاح تبعت طلب جديد')}
              description={t('Browse Discover to find your next match.', 'روح لصفحة اكتشف عشان تلاقي ترشيح جديد.')}
            />
          </>
        )}

        {current && candidate && (
          <div className="rounded-[var(--radius-lg)] border border-ink-100 bg-parchment-0 p-4 shadow-[var(--shadow-soft-sm)] space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={candidate.personal.profilePhotoUrl}
                className="h-16 w-16 rounded-xl object-cover bg-ink-100 cursor-pointer"
                onClick={() => navigate(`/app/profile/${candidate.id}`)}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ink-900">{candidate.personal.displayName}</p>
                {current.status === 'pending' && current.fromUserId === 'me' && (
                  <Badge variant="warning" className="mt-1">
                    <Clock size={11} /> {t('Waiting for their response', 'مستني الرد منه')}
                  </Badge>
                )}
                {current.status === 'pending' && current.toUserId === 'me' && (
                  <Badge variant="info" className="mt-1">
                    {t('Wants to connect with you', 'عايز يرتبط بيك')}
                  </Badge>
                )}
                {current.status === 'accepted' && (
                  <Badge variant="success" className="mt-1">
                    {t('Connected', 'متصلين')}
                  </Badge>
                )}
              </div>
            </div>

            {current.status === 'pending' && current.toUserId === 'me' && (
              <div className="flex gap-2">
                <Button
                  variant="gold"
                  className="flex-1"
                  onClick={() => {
                    respond(current.id, 'accepted')
                    celebrate('confetti')
                    show(t('Request accepted', 'تم قبول الطلب'), 'success')
                  }}
                >
                  <Check size={15} /> {t('Accept', 'قبول')}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    respond(current.id, 'rejected')
                    show(t('Request declined', 'تم رفض الطلب'), 'info')
                  }}
                >
                  <X size={15} /> {t('Decline', 'رفض')}
                </Button>
              </div>
            )}

            {current.status === 'pending' && current.fromUserId === 'me' && (
              <>
                <p className="text-[11px] text-ink-400">{t('Expires automatically after 3 days if there is no response.', 'بينتهي تلقائيًا بعد 3 أيام لو محدش رد.')}</p>
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => {
                    cancel(current.id)
                    show(t('Request cancelled', 'تم إلغاء الطلب'), 'info')
                  }}
                >
                  <Ban size={15} /> {t('Cancel Request', 'إلغاء الطلب')}
                </Button>
              </>
            )}

            {current.status === 'accepted' && (
              <Button
                variant="gold"
                size="lg"
                className="w-full"
                onClick={() => navigate(guidelinesDone.includes(candidate.id) ? `/app/chat/${candidate.id}` : `/app/guidelines/${candidate.id}`)}
              >
                <MessageCircle size={16} /> {t('Start Chatting', 'ابدأ المحادثة')}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
