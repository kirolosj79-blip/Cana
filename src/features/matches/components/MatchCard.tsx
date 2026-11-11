import { useNavigate } from 'react-router-dom'
import { MapPin, BadgeCheck, Briefcase, Church, Clock, ArrowRight, ArrowLeft } from 'lucide-react'
import type { UserProfile } from '@/types/profile.types'
import { useLanguage } from '@/core/hooks/useLanguage'

const DEGREE = { doctorate: ['Ph.D / M.D.', 'دكتوراه'], masters: ['M.Sc.', 'ماجستير'], bachelors: ['B.Sc.', 'بكالوريوس'] } as Record<string, string[]>
const TIMELINE = { within_6_months: ['0–6 mos', '0–6 شهور'], within_1_year: ['6–12 mos', '6–12 شهر'], within_1_2_years: ['1–2 yrs', '1–2 سنة'] } as Record<string, string[]>

/** Figma Home grid card: photo + verified badge, name/age, city, work • degree, church, timeline, View Profile. */
export function MatchCard({ candidate }: { candidate: UserProfile }) {
  const navigate = useNavigate()
  const { t, isRtl } = useLanguage()
  const age = new Date().getFullYear() - new Date(candidate.personal.dateOfBirth).getFullYear()
  const Arrow = isRtl ? ArrowLeft : ArrowRight
  const open = () => navigate(`/app/profile/${candidate.id}`)
  const deg = DEGREE[candidate.education.level ?? 'bachelors'] ?? DEGREE.bachelors
  const tl = TIMELINE[candidate.gettingToKnowYou.marriageTimeline ?? 'within_1_year'] ?? TIMELINE.within_1_year

  return (
    <div className="rounded-[18px] border border-ink-100 bg-parchment-0 p-2 shadow-[var(--shadow-soft-sm)]">
      <button onClick={open} className="relative block w-full overflow-hidden rounded-xl">
        <img src={candidate.personal.profilePhotoUrl} alt="" className="aspect-[4/3] w-full bg-ink-100 object-cover object-top" />
        {candidate.verification.church === 'verified' && (
          <span className="absolute bottom-1.5 end-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#0C1D3A] text-white">
            <BadgeCheck size={12} />
          </span>
        )}
      </button>
      <p className="mt-2 truncate px-0.5 text-[13px] font-bold text-ink-900">{candidate.personal.firstName}, {age}</p>
      <div className="mt-1 space-y-1 px-0.5 text-[10.5px] text-ink-500">
        <p className="flex items-center gap-1 truncate"><MapPin size={10} className="shrink-0" /> {candidate.personal.cityState}</p>
        <p className="flex items-start gap-1 font-semibold leading-snug text-ink-800"><Briefcase size={10} className="mt-0.5 shrink-0 text-ink-400" /> <span><bdi>{candidate.employment.occupation}</bdi> • <bdi>{t(deg[0], deg[1])}</bdi></span></p>
        <p className="flex items-center gap-1 truncate"><Church size={10} className="shrink-0" /> {t('Coptic Orthodox', 'قبطي أرثوذكسي')}</p>
        <p className="flex items-center gap-1 truncate"><Clock size={10} className="shrink-0" /> {t(tl[0], tl[1])}</p>
      </div>
      <button onClick={open} className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg bg-cta-bg py-2 text-[11px] font-bold text-cta-text">
        {t('View Profile', 'عرض الملف الشخصي')} <Arrow size={11} />
      </button>
    </div>
  )
}
