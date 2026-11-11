import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { BookOpen, Check, ShieldCheck, Search, SlidersHorizontal, Clock, ShieldHalf, Heart } from 'lucide-react'
import { FigmaHeader } from '@/shared/components/layout/FigmaHeader'
import { FCard, IconTile } from '@/shared/components/ui/figma'
import { MatchCard } from '@/features/matches/components/MatchCard'
import { ProfileStatusCard } from '@/features/journey/ProfileStatusScreens'
import { useAdminReviewStore } from '@/store/adminReview.store'
import { useJourneyStore } from '@/store/journey.store'
import { getDiscoverList } from '@/store/matches.store'
import { verseOfDay } from '@/constants/verses'
import { useMe } from '@/core/hooks/useMe'
import { cn } from '@/shared/utils/cn'

export function VerseBanner({ salt = 0 }: { salt?: number }) {
  const { t } = useMe()
  const v = verseOfDay(salt)
  return (
    <div className="flex items-start gap-3 rounded-2xl verse-banner border border-white/10 bg-[#0C1D3A] px-4 py-3 text-white">
      <BookOpen size={16} className="mt-0.5 shrink-0 text-gold-300" />
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-white/80">{t(v.refEn, v.refAr)}</p>
        <p className="mt-0.5 text-[11.5px] italic leading-snug">{t(v.en, `«${v.ar}»`)}</p>
      </div>
    </div>
  )
}

/** Search + chips + 2-column match grid, shared by Home and Discover. */
export function MatchesGrid({ limit }: { limit?: number }) {
  const navigate = useNavigate()
  const { t } = useMe()
  const [query, setQuery] = useState('')
  const [chips, setChips] = useState<string[]>(['coptic', 'church'])
  const blockedIds = useJourneyStore((s) => s.blocked)
  const list = getDiscoverList()
    .filter((c) => !blockedIds.includes(c.id))
    .filter((c) => (chips.includes('church') ? c.verification.church === 'verified' : true))
    .filter((c) => !query.trim() || `${c.personal.displayName} ${c.personal.cityState} ${c.employment.occupation}`.toLowerCase().includes(query.trim().toLowerCase()))
    .slice(0, limit ?? 99)
  return (
    <>
      <div className="flex items-center gap-2 rounded-2xl border border-ink-100 bg-parchment-0 px-3.5 py-2.5 shadow-[var(--shadow-soft-sm)]">
        <Search size={16} className="text-ink-400" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t('Search by city, vocation,…', 'دوّر بالمدينة أو الوظيفة…')}
          className="min-w-0 flex-1 bg-transparent text-[12px] text-ink-900 outline-none placeholder:text-ink-400" style={{ fontSize: 16 }} />
        <button onClick={() => navigate('/app/discover')} className="rounded-lg bg-parchment-200 p-1.5 text-ink-600" aria-label="Filters"><SlidersHorizontal size={14} /></button>
      </div>
      <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {[
          { k: 'coptic', en: 'Coptic Orthodox', ar: 'قبطي أرثوذكسي', icon: Check },
          { k: 'church', en: 'Church Verified', ar: 'كنيسة موثّقة', icon: ShieldCheck },
          { k: 'serious', en: 'Serious Intent', ar: 'نية جدية', icon: null },
        ].map((c) => {
          const on = chips.includes(c.k)
          return (
            <button key={c.k} onClick={() => setChips((x) => (on ? x.filter((i) => i !== c.k) : [...x, c.k]))}
              className={cn('flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-[11px] font-semibold transition-colors', on ? 'border-[#0C1D3A] bg-[#0C1D3A] text-white' : 'border-ink-100 bg-parchment-0 text-ink-600')}>
              {on && c.icon && <c.icon size={12} />} {t(c.en, c.ar)}
            </button>
          )
        })}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {list.map((c) => <MatchCard key={c.id} candidate={c} />)}
        {list.length === 0 && <p className="col-span-2 py-6 text-center text-[11px] text-ink-400">{t('No matches found.', 'مفيش ترشيحات.')}</p>}
      </div>
    </>
  )
}

export function HomeScreen() {
  const { t, name, g } = useMe()
  const [params] = useSearchParams()
  const blockedIds = useJourneyStore((s) => s.blocked)
  const account = useJourneyStore((s) => s.accountStatus)
  const reviews = useAdminReviewStore((s) => s.reviews)
  const total = getDiscoverList().filter((c) => !blockedIds.includes(c.id)).length
  const count = Math.min(total, 4)

  const hasRejected = reviews.some((r) => r.state === 'rejected')
  const hasInfo = reviews.some((r) => r.state === 'needs_more_documents')
  const statusKind = account === 'suspended' ? 'suspended' : account === 'closed' ? 'closed' : hasRejected ? 'rejected' : hasInfo ? 'info' : null
  if (statusKind) {
    return (
      <div>
        <FigmaHeader />
        <div className="px-5"><ProfileStatusCard kind={statusKind} /></div>
      </div>
    )
  }

  if (params.get('nomatches') === '1' || total === 0) {
    const items = [
      { icon: Clock, en: 'Search in progress', ar: 'البحث مستمر', be: "At the moment, we haven't found a suitable match that aligns with your preferences.", ba: 'لحد دلوقتي، لسه ما لقيناش ترشيح مناسب يتوافق مع المواصفات والتفضيلات اللي اخترتها.' },
      { icon: ShieldHalf, en: 'Active monitoring', ar: 'متابعة مستمرة', be: "Please be assured that we'll notify you as soon as someone who meets your criteria becomes available.", ba: 'اطمّن، إحنا مستمرين في البحث والمتابعة، وهنبعت لك إشعار أول ما يتوفر شخص مناسب ويكون عنده نفس الاستعداد للتعارف.' },
      { icon: Heart, en: 'Our prayer for you', ar: 'صلاتنا من أجلك', be: 'Thank you for your patience and trust in CANA. We pray that the right introduction comes at the right time.', ba: 'شكرًا لصبرك وثقتك في CANA. بنصلي إن ربنا يوجّه خطواتك، ويرزقك بالشخص المناسب، ويجمعكم في الوقت المناسب، حسب مشيئته الصالحة.' },
    ]
    return (
      <div>
        <FigmaHeader />
        <div className="space-y-4 px-5 pb-6 pt-2">
          <VerseBanner />
          <div>
            <p className="text-[11px] text-ink-500">{t(`Good evening, ${name}`, `مساء الخير يا ${name} 🌙`)}</p>
            <h1 className="text-[22px] font-bold tracking-tight text-ink-900">{t('Your Perfect Match Takes Time', 'اختيار شريك حياتك المناسب محتاج وقت')}</h1>
          </div>
          {items.map((i) => (
            <FCard key={i.en} className="flex items-start gap-3">
              <IconTile icon={i.icon} tint="navy" size={34} />
              <div>
                <p className="text-[12px] font-bold text-ink-900">{t(i.en, i.ar)}</p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-ink-500">{t(i.be, i.ba)}</p>
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
      <div className="space-y-4 px-5 pb-6 pt-2">
        <VerseBanner />
        <div>
          <p className="text-[11px] text-ink-500">{t(`Good evening, ${name}`, `مساء الخير يا ${name} ${g('🌙', '🌷')}`)}</p>
          <h1 className="text-[22px] font-bold tracking-tight text-ink-900">{t(`You have ${count} matches`, `عندك ${count} ترشيحات مناسبة`)}</h1>
          <p className="mt-1 text-[11px] leading-relaxed text-ink-500">
            {t(
              'Review prayerfully and choose one person to connect with. Take your time—the other matches stay reserved for your decision.',
              g('خد وقتك في مراجعة الملفات الشخصية، وصلي واطلب إرشاد ربنا قبل ما تختار شخص واحد لبدء التعارف معاه. مفيش داعي للاستعجال، الترشيحات دي هتفضل متاحة ليك لحد ما تاخد قرارك.', 'خدي وقتك في مراجعة الملفات الشخصية، وصلي واطلبي إرشاد ربنا قبل ما تختاري شخص واحد لبدء التعارف معاه. مفيش داعي للاستعجال، الترشيحات دي هتفضل متاحة ليكي لحد ما تاخدي قرارك.')
            )}
          </p>
        </div>
        <MatchesGrid limit={4} />
      </div>
    </div>
  )
}
