import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Clock, AlertCircle, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { FigmaHeader } from '@/shared/components/layout/FigmaHeader'
import { Button } from '@/shared/components/ui/Button'
import { useRegistrationStore } from '@/store/registration.store'
import { useAdminReviewStore } from '@/store/adminReview.store'
import { usePaymentStore } from '@/store/payment.store'
import { usePaymentRequestsStore } from '@/store/paymentRequests.store'
import { useJourneyStore } from '@/store/journey.store'
import { useLanguage } from '@/core/hooks/useLanguage'
import { MatchCard } from '@/features/matches/components/MatchCard'
import { getDiscoverList } from '@/store/matches.store'
import { Search, SlidersHorizontal, BookOpen, Check, ShieldCheck, Hourglass, ShieldHalf, Heart } from 'lucide-react'
import { ProfileStatusCard } from '@/features/journey/ProfileStatusScreens'
import { FCard, IconTile } from '@/shared/components/ui/figma'
import { cn } from '@/shared/utils/cn'

export function HomeScreen() {
  const navigate = useNavigate()
  const firstName = useRegistrationStore((s) => s.draft.personal.firstName)
  const { t } = useLanguage()
  const [query, setQuery] = useState('')
  const [chips, setChips] = useState<string[]>([])

  const blockedIds = useJourneyStore((s) => s.blocked)
  const account = useJourneyStore((s) => s.accountStatus)
  const reviews = useAdminReviewStore((s) => s.reviews)
  const [params] = useSearchParams()
  const status = useAdminReviewStore((s) => s.overallStatus())
  const profileApproved = status === 'approved'
  const isPaidMember = usePaymentStore((s) => s.isPaidMember)
  const latestPayment = usePaymentRequestsStore((s) => s.getLatest())
  const paymentPending = !isPaidMember && latestPayment?.status === 'pending_review'
  const paymentNotStarted = !isPaidMember && !latestPayment
  const approved = profileApproved && isPaidMember
  const list = getDiscoverList()
    .filter((c) => !blockedIds.includes(c.id))
    .filter((c) => (chips.includes('church') ? c.verification.church === 'verified' : true))
    .filter((c) => !query.trim() || `${c.personal.displayName} ${c.personal.cityState} ${c.employment.occupation}`.toLowerCase().includes(query.trim().toLowerCase()))
    .slice(0, 4)

  const hasRejected = reviews.some((r) => r.state === 'rejected')
  const hasInfo = reviews.some((r) => r.state === 'needs_more_documents')
  const statusKind = account === 'suspended' ? 'suspended' : account === 'closed' ? 'closed' : hasRejected ? 'rejected' : hasInfo ? 'info' : !profileApproved ? 'review' : paymentPending ? 'paymentPending' : paymentNotStarted ? 'payment' : null
  if (statusKind) {
    return (
      <div>
        <FigmaHeader />
        <div className="px-5"><ProfileStatusCard kind={statusKind} /></div>
      </div>
    )
  }

  const noMatches = approved && (params.get('nomatches') === '1' || getDiscoverList().filter((c) => !blockedIds.includes(c.id)).length === 0)
  if (noMatches) {
    const items = [
      { icon: Clock, en: 'Search in progress', ar: 'البحث جارٍ', be: "At the moment, we haven't found a suitable match that aligns with your preferences.", ba: 'دلوقتي لسه ملقيناش ترشيح مناسب يتماشى مع تفضيلاتك.' },
      { icon: ShieldHalf, en: 'Active monitoring', ar: 'متابعة مستمرة', be: "Please be assured that we'll notify you as soon as someone who meets your criteria becomes available.", ba: 'اطمّن، هنبلّغك أول ما يتوفر حد يناسب معاييرك.' },
      { icon: Heart, en: 'Our prayer for you', ar: 'صلاتنا من أجلك', be: 'Thank you for your patience and trust in CANA. We pray that the right introduction comes at the right time.', ba: 'شكرًا لصبرك وثقتك في CANA. بنصلّي إن التعارف المناسب ييجي في الوقت المناسب.' },
    ]
    return (
      <div>
        <FigmaHeader />
        <div className="space-y-4 px-5 pb-6 pt-2">
          <div className="flex items-start gap-3 rounded-2xl bg-[#0C1D3A] px-4 py-3 text-white">
            <BookOpen size={16} className="mt-0.5 shrink-0 text-gold-300" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/80">{t('1 Corinthians 13:4', '1 كورنثوس 13: 4')}</p>
              <p className="mt-0.5 text-[13px] italic">{t('Love is patient, love is kind.', 'الْمَحَبَّةُ تَتَأَنَّى وَتَرْفُقُ.')}</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-ink-500">{t('Good evening', 'مساء الخير')}، {firstName || t('friend', 'صديقي')}</p>
            <h1 className="text-[22px] font-bold tracking-tight text-ink-900">{t('Your Perfect Match Takes Time', 'الشريك المناسب يحتاج وقت')}</h1>
          </div>
          {items.map((i) => (
            <FCard key={i.en} className="flex items-start gap-3">
              <IconTile icon={i.icon} tint="navy" size={34} />
              <div>
                <p className="text-sm font-bold text-ink-900">{t(i.en, i.ar)}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-ink-500">{t(i.be, i.ba)}</p>
              </div>
            </FCard>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <FigmaHeader />
      <div className="px-5 pt-2 pb-6 space-y-6">
        {!approved && (
        <div>
          <h1 className="font-bold tracking-tight text-xl font-medium text-ink-900">
            {t('Hello', 'أهلًا')}، {firstName || t('friend', 'صديقي')} 👋
          </h1>
          <p className="text-sm text-ink-500">{t("Let's find God's best for you.", 'يلا نلاقي أفضل اختيار ليك ❤️')}</p>
        </div>
        )}

        {!approved && profileApproved && (paymentPending || paymentNotStarted) && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[var(--radius-lg)] border border-gold-300/40 bg-gold-50 px-6 py-8 text-center space-y-3"
          >
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold-400/20 text-gold-600">
              <Clock size={30} />
            </span>
            <p className="font-bold tracking-tight text-3xl font-semibold text-gold-700">
              {paymentPending ? t('Payment Pending', 'الدفع قيد المراجعة') : t('Membership Required', 'محتاج تفعّل عضويتك')}
            </p>
            <p className="text-sm text-gold-700 max-w-xs mx-auto">
              {paymentPending
                ? t('Your payment proof is with our team for review. Full access unlocks automatically once approved.', 'إثبات الدفع بتاعك مع فريقنا للمراجعة. هيتفتح الوصول الكامل تلقائي أول ما يتوافق عليه.')
                : t('Complete your subscription payment to unlock matches and connections.', 'كمّل دفع اشتراكك عشان تقدر توصل للترشيحات والارتباطات.')}
            </p>
            <Button variant="gold" size="sm" onClick={() => navigate('/payment/subscription')} className="mx-auto">
              {paymentPending ? t('Track Payment Status', 'متابعة حالة الطلب') : t('Complete Payment', 'كمّل الدفع')} <ChevronRight size={14} />
            </Button>
          </motion.div>
        )}

        {!profileApproved && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={
              status === 'needs_action'
                ? 'rounded-[var(--radius-lg)] border border-warning-500/30 bg-warning-100 px-6 py-8 text-center space-y-3'
                : 'rounded-[var(--radius-lg)] border border-info-500/30 bg-info-100 px-6 py-8 text-center space-y-3'
            }
          >
            <span
              className={
                status === 'needs_action'
                  ? 'mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-warning-500/15 text-warning-500'
                  : 'mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-info-500/15 text-info-500'
              }
            >
              {status === 'needs_action' ? <AlertCircle size={30} /> : <Clock size={30} />}
            </span>
            <p className={status === 'needs_action' ? 'font-bold tracking-tight text-3xl font-semibold text-warning-500' : 'font-bold tracking-tight text-3xl font-semibold text-info-500'}>
              {status === 'needs_action' ? t('Action Needed', 'محتاجين إجراء') : t('Pending', 'قيد المراجعة')}
            </p>
            <p className={status === 'needs_action' ? 'text-sm text-warning-500 max-w-xs mx-auto' : 'text-sm text-info-500 max-w-xs mx-auto'}>
              {status === 'needs_action'
                ? t('One or more sections need your attention before we can continue.', 'محتاجين منك تراجع قسم أو أكتر قبل ما نكمل.')
                : t('Your profile is with our team for review. This unlocks automatically once approved.', 'ملفك مع فريقنا للمراجعة. هيتفتح تلقائي أول ما يوافقوا عليه.')}
            </p>
            <Button
              variant={status === 'needs_action' ? 'outline' : 'ghost'}
              size="sm"
              onClick={() => navigate('/app/settings/verification')}
              className="mx-auto"
            >
              {t('View Status', 'شوف الحالة')} <ChevronRight size={14} />
            </Button>
          </motion.div>
        )}

        <div className="flex items-start gap-3 rounded-2xl bg-gold-100 px-4 py-3 text-gold-700">
          <BookOpen size={17} className="mt-0.5 shrink-0" />
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider">{t('Ecclesiastes 4:12', 'جامعة 4:12')}</p>
            <p className="mt-0.5 text-[13px] italic leading-snug">{t('“A cord of three strands is not quickly broken.”', '"الْخَيْطُ الْمَثْلُوثُ لاَ يَنْقَطِعُ سَرِيعًا."')}</p>
          </div>
        </div>

        {approved && (
          <>
            <div>
              <p className="text-sm text-ink-500">{t('Good evening', 'مساء الخير')}، {firstName || t('friend', 'صديقي')}</p>
              <h2 className="font-bold tracking-tight text-[26px] font-semibold text-ink-900">{t('Your Daily Discernment', 'تمييزك اليومي')}</h2>
              <span className="mt-2 inline-flex rounded-full bg-gold-100 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-gold-700">
                {t(`${list.length} Curated Matches`, `${list.length} ترشيحات مختارة`)}
              </span>
            </div>

            <div className="flex items-center gap-2 rounded-2xl border border-ink-100 bg-parchment-0 px-3.5 py-2.5 shadow-[var(--shadow-soft-sm)]">
              <Search size={16} className="text-ink-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('Search by city, vocation,…', 'دوّر بالمدينة أو الوظيفة…')}
                className="min-w-0 flex-1 bg-transparent text-sm text-ink-900 outline-none placeholder:text-ink-400"
                style={{ fontSize: 16 }}
              />
              <button onClick={() => navigate('/app/discover')} className="rounded-lg bg-parchment-200 p-1.5 text-ink-600" aria-label="Filters">
                <SlidersHorizontal size={14} />
              </button>
            </div>

            <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1">
              {[
                { k: 'coptic', en: 'Coptic Orthodox', ar: 'قبطي أرثوذكسي', icon: Check },
                { k: 'church', en: 'Church Verified', ar: 'كنيسة موثّقة', icon: ShieldCheck },
                { k: 'serious', en: 'Serious Intent', ar: 'نية جدية', icon: null },
              ].map((c) => {
                const on = chips.includes(c.k)
                return (
                  <button
                    key={c.k}
                    onClick={() => setChips((x) => (on ? x.filter((i) => i !== c.k) : [...x, c.k]))}
                    className={cn(
                      'flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors',
                      on ? 'border-[#0C1D3A] bg-[#0C1D3A] text-white' : 'border-ink-100 bg-parchment-0 text-ink-600'
                    )}
                  >
                    {on && c.icon && <c.icon size={12} />} {t(c.en, c.ar)}
                  </button>
                )
              })}
            </div>
          </>
        )}

        {!approved ? (
          <div className="rounded-[var(--radius-md)] border border-dashed border-ink-200 px-4 py-6 text-center">
            <Clock size={20} className="mx-auto text-ink-300 mb-2" />
            <p className="text-xs text-ink-400">{t('Recommended matches unlock once your profile is approved.', 'الترشيحات هتتفتح أول ما ملفك يتوافق عليه.')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {list.map((c) => (
              <MatchCard key={c.id} candidate={c} />
            ))}
            {list.length === 0 && <p className="col-span-2 py-6 text-center text-xs text-ink-400">{t('No matches found.', 'مفيش ترشيحات.')}</p>}
          </div>
        )}

        {approved && (
          <div className="space-y-3">
            <div className="rounded-[22px] bg-parchment-200 px-5 py-6 text-center">
              <Hourglass size={20} className="mx-auto text-gold-700" />
              <p className="mt-2 text-sm font-bold text-ink-900">{t('Sacred Pacing & Intentionality', 'إيقاع مقدّس ونية واضحة')}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-ink-500">
                {t('Curated daily batch refreshes at 6:00 AM EET. No infinite scrolling — discerning in prayer, patience, and mutual respect.', 'الترشيحات اليومية بتتجدد الساعة 6:00 صباحًا بتوقيت القاهرة. مفيش سكرول لا نهائي — تمييز بصلاة وصبر واحترام متبادل.')}
              </p>
            </div>
          </div>
        )}

        <div className="rounded-[var(--radius-md)] bg-parchment-100 border border-ink-100 px-4 py-4 text-center">
          <p className="text-sm text-ink-600">{t('Built on Faith. Focused on Family.', 'أساسها الإيمان، وهدفها الأسرة.')}</p>
          <p className="text-xs text-ink-400 mt-1">
            {t("Our goal isn't just to match you — it's to help you build a God-honoring family.", 'هدفنا مش بس نرشحلك حد، إحنا بنساعدك تبني عيلة ترضي ربنا.')}
          </p>
        </div>
      </div>
    </div>
  )
}
