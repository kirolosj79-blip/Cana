import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Heart, MapPin, ChevronLeft, ChevronRight, User, Info, Calendar, Church, GraduationCap, Ruler, Briefcase, HeartHandshake, Globe, Cross, Flag } from 'lucide-react'
import { findCandidate } from '@/services/mock/candidates.mock'
import { Button } from '@/shared/components/ui/Button'
import { Modal } from '@/shared/components/ui/Modal'
import { EmptyState } from '@/shared/components/feedback/StateScreens'
import { FCard } from '@/shared/components/ui/figma'
import { useMatchesStore } from '@/store/matches.store'
import { useRequestsStore } from '@/store/requests.store'
import { useJourneyStore } from '@/store/journey.store'
import { useToast } from '@/shared/components/feedback/Toast'
import { PageContainer } from '@/shared/components/layout/PageContainer'
import { FigmaHeader } from '@/shared/components/layout/FigmaHeader'
import { useLanguage } from '@/core/hooks/useLanguage'
import { useCelebration } from '@/shared/components/feedback/Celebration'
import { usePaymentStore } from '@/store/payment.store'
import { educationLevelOptions } from '@/features/registration/data/options'

function Block({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) {
  return (
    <FCard className="!p-4">
      <div className="mb-2.5 flex items-center gap-2 text-ink-900">
        <Icon size={15} />
        <p className="text-sm font-bold">{title}</p>
      </div>
      {children}
    </FCard>
  )
}

function Fact({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <Icon size={14} className="mt-0.5 shrink-0 text-ink-400" />
      <div className="min-w-0">
        <p className="text-[10px] text-ink-400">{label}</p>
        <p className="text-[13px] font-semibold text-ink-900 break-words">{value}</p>
      </div>
    </div>
  )
}

/** Figma: profile detail — About Me, Basic Information, My Faith, What I'm Looking For. */
export function ProfileDetailScreen() {
  const { id } = useParams()
  const { t, isRtl } = useLanguage()
  const navigate = useNavigate()
  const candidate = findCandidate(id ?? '')
  const { toggleSave, isSaved, pass } = useMatchesStore()
  const { sendRequest, getStatusFor, hasPendingIncoming, hasPendingOutgoing, hasActiveConnection } = useRequestsStore()
  const guidelinesDone = useJourneyStore((s) => s.guidelinesAcceptedFor)
  const { show } = useToast()
  const { celebrate } = useCelebration()
  const isPaidMember = usePaymentStore((s) => s.isPaidMember)
  const [reportOpen, setReportOpen] = useState(false)
  const Back = isRtl ? ChevronRight : ChevronLeft

  if (!candidate) {
    return (
      <PageContainer>
        <EmptyState title={t('Profile not found', 'البروفايل غير موجود')} description={t('This member may have deactivated their account.', 'ممكن يكون العضو ده عطّل حسابه.')} />
      </PageContainer>
    )
  }

  const p = candidate.personal
  const age = new Date().getFullYear() - new Date(p.dateOfBirth).getFullYear()
  const status = getStatusFor(candidate.id)
  const saved = isSaved(candidate.id)
  const blockedByIncoming = status === 'none' && hasPendingIncoming()
  const blockedByOutgoing = status === 'none' && !blockedByIncoming && hasPendingOutgoing()
  const blockedByActive = status === 'none' && !blockedByIncoming && !blockedByOutgoing && hasActiveConnection()
  const canRequest = status === 'none' && !blockedByIncoming && !blockedByOutgoing && !blockedByActive

  const edu = educationLevelOptions.find((e) => e.value === candidate.education.level)
  const values = [...(candidate.gettingToKnowYou.desiredMarriageValues ?? []), ...candidate.church.churchActivities.split(',').map((x) => x.trim())].filter(Boolean).slice(0, 6)
  const looking = (candidate.gettingToKnowYou.goodPartnerQualities ?? []).join(' · ')

  const interested = () => {
    if (!isPaidMember) {
      show(t('Complete your subscription payment first.', 'كمّل دفع اشتراكك الأول.'), 'error')
      navigate('/payment/subscription')
      return
    }
    sendRequest(candidate.id)
    celebrate('hearts')
    show(t('Introduction request sent', 'اتبعت طلب التعارف'), 'success')
  }

  return (
    <div className="pb-44">
      <FigmaHeader />
      <div className="space-y-4 px-5 pt-3">
        <div className="relative overflow-hidden rounded-[26px]">
          <img src={p.profilePhotoUrl} alt="" className="aspect-[4/5] w-full bg-ink-100 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C1D3A]/80 via-transparent to-transparent" />
          <button onClick={() => navigate(-1)} className="absolute start-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#0C1D3A]" aria-label="Back">
            <Back size={18} />
          </button>
          <button onClick={() => setReportOpen(true)} className="absolute end-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#0C1D3A]" aria-label="Report">
            <Flag size={15} />
          </button>
          <div className="absolute inset-x-4 bottom-4 flex items-end justify-between text-white">
            <div>
              <h1 className="font-bold tracking-tight text-[26px] font-semibold leading-tight">{p.firstName}, {age}</h1>
              <p className="text-sm opacity-90">{candidate.church.churchName}</p>
              <p className="flex items-center gap-1 text-sm opacity-90"><MapPin size={12} /> {p.cityState}</p>
            </div>
            <button
              onClick={() => {
                toggleSave(candidate.id)
                show(saved ? t('Removed from saved', 'اتشال من المحفوظات') : t('Saved', 'اتحفظ'), 'info')
              }}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0C1D3A] ring-2 ring-white/20"
              aria-label="Save"
            >
              <Heart size={18} className={saved ? 'fill-gold-300 text-gold-300' : 'text-gold-100'} />
            </button>
          </div>
        </div>

        <Block icon={User} title={t('About Me', 'نبذة عني')}>
          <p className="text-[13px] leading-relaxed text-ink-600">{p.bio}</p>
        </Block>

        <Block icon={Info} title={t('Basic Information', 'معلومات أساسية')}>
          <div className="grid grid-cols-2 gap-x-4 gap-y-3.5">
            <Fact icon={Calendar} label={t('Age', 'السن')} value={String(age)} />
            <Fact icon={MapPin} label={t('Location', 'المكان')} value={p.cityState} />
            <Fact icon={Church} label={t('Denomination', 'الطائفة')} value={t('Coptic Orthodox', 'قبطي أرثوذكسي')} />
            <Fact icon={GraduationCap} label={t('Education', 'التعليم')} value={edu ? t(edu.en, edu.ar) : '—'} />
            <Fact icon={Ruler} label={t('Height', 'الطول')} value={p.heightCm ? t(`${p.heightCm} cm`, `${p.heightCm} سم`) : '—'} />
            <Fact icon={Briefcase} label={t('Occupation', 'الوظيفة')} value={candidate.employment.occupation} />
            <Fact icon={HeartHandshake} label={t('Marital Status', 'الحالة الاجتماعية')} value={candidate.eligibility.everMarried ? t('Previously Married', 'اتجوز قبل كده') : t('Never Married', 'عمره ما اتجوز')} />
            <Fact icon={Globe} label={t('Nationality', 'الجنسية')} value={p.nationality?.[0] ?? '—'} />
          </div>
        </Block>

        <Block icon={Cross} title={t('My Faith', 'إيماني')}>
          <div className="flex flex-wrap gap-1.5">
            {values.map((v) => (
              <span key={v} className="rounded-full bg-gold-100 px-3 py-1 text-xs font-medium text-gold-700">{v}</span>
            ))}
          </div>
        </Block>

        <Block icon={Heart} title={t("What I'm Looking For", 'اللي بدوّر عليه')}>
          <p className="text-[13px] leading-relaxed text-ink-600">{looking || t('A God-fearing partner ready to build a Christ-centered home.', 'شريك بيخاف ربنا ومستعد يبني بيت محوره المسيح.')}</p>
        </Block>
      </div>

      <div className="fixed inset-x-0 bottom-[68px] z-30 border-t border-ink-100 bg-parchment-50/95 px-5 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-md gap-3">
          {canRequest && (
            <>
              <Button
                variant="outline"
                size="lg"
                className="!rounded-[14px] flex-1 !px-3 text-sm"
                onClick={() => {
                  pass(candidate.id)
                  show(t('Removed from your matches', 'اتشال من ترشيحاتك'), 'info')
                  navigate('/app/home')
                }}
              >
                {t('Not the Right Match', 'مش مناسب ليا')}
              </Button>
              <Button variant="gold" size="lg" className="!rounded-[14px] flex-1 !px-3 text-sm" onClick={interested}>
                {t('Interested in an Introduction', 'مهتم بتعارف')}
              </Button>
            </>
          )}
          {status === 'pending' && (
            <Button variant="subtle" size="lg" className="flex-1" onClick={() => navigate('/app/requests')}>
              {t('Request Pending — View', 'الطلب مستني الرد — شوفه')}
            </Button>
          )}
          {status === 'accepted' && (
            <Button variant="gold" size="lg" className="!rounded-[14px] flex-1" onClick={() => navigate(guidelinesDone.includes(candidate.id) ? `/app/chat/${candidate.id}` : `/app/guidelines/${candidate.id}`)}>
              {t('Start Chatting', 'ابدأ المحادثة')}
            </Button>
          )}
          {(blockedByIncoming || blockedByOutgoing) && (
            <Button variant="subtle" size="lg" className="flex-1" onClick={() => navigate('/app/requests')}>
              {t('You have a pending introduction — view it', 'عندك تعارف معلّق — شوفه')}
            </Button>
          )}
          {blockedByActive && (
            <Button variant="subtle" size="lg" className="flex-1" onClick={() => navigate('/app/messages')}>
              {t('You already have an active introduction', 'عندك تعارف نشط بالفعل')}
            </Button>
          )}
          {(status === 'rejected' || status === 'expired' || status === 'cancelled') && (
            <Button variant="subtle" size="lg" className="flex-1" disabled>
              {t('Not Available', 'غير متاح')}
            </Button>
          )}
        </div>
      </div>

      <Modal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        title={t('Report this profile', 'الإبلاغ عن هذا البروفايل')}
        footer={
          <Button
            variant="danger"
            className="flex-1"
            onClick={() => {
              setReportOpen(false)
              navigate('/app/complaints/new', { state: { againstUserId: candidate.id } })
            }}
          >
            <Flag size={15} /> {t('Continue to Complaint Form', 'كمّل لنموذج الشكوى')}
          </Button>
        }
      >
        <p className="text-sm text-ink-600">{t('If something about this profile feels wrong or unsafe, let us know and our team will review it.', 'لو حاجة في البروفايل ده مش مريحة أو مش آمنة، قولّنا وفريقنا هيراجعها.')}</p>
      </Modal>
    </div>
  )
}
