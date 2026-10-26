import { useNavigate } from 'react-router-dom'
import { Bookmark, MapPin, BadgeCheck, GraduationCap, Briefcase, ArrowRight, ArrowLeft } from 'lucide-react'
import type { UserProfile } from '@/types/profile.types'
import { useMatchesStore } from '@/store/matches.store'
import { useLanguage } from '@/core/hooks/useLanguage'

/** Figma Home grid card: photo + verified badge, name/age, city, occupation, chips, View Profile. */
export function MatchCard({ candidate }: { candidate: UserProfile }) {
  const navigate = useNavigate()
  const { t, isRtl } = useLanguage()
  const { toggleSave, isSaved } = useMatchesStore()
  const saved = isSaved(candidate.id)
  const age = new Date().getFullYear() - new Date(candidate.personal.dateOfBirth).getFullYear()
  const Arrow = isRtl ? ArrowLeft : ArrowRight
  const open = () => navigate(`/app/profile/${candidate.id}`)

  return (
    <div className="rounded-[20px] border border-ink-100 bg-parchment-0 p-2.5 shadow-[var(--shadow-soft-sm)]">
      <button onClick={open} className="relative block w-full overflow-hidden rounded-2xl">
        <img src={candidate.personal.profilePhotoUrl} alt="" className="aspect-[4/3] w-full bg-ink-100 object-cover" />
        {candidate.verification.church === 'verified' && (
          <span className="absolute bottom-1.5 end-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#0C1D3A] text-white">
            <BadgeCheck size={14} />
          </span>
        )}
      </button>
      <div className="mt-2.5 flex items-start justify-between gap-1 px-0.5">
        <p className="text-sm font-bold text-ink-900 truncate">
          {candidate.personal.firstName}, {age}
        </p>
        <button onClick={() => toggleSave(candidate.id)} aria-label="Save" className="shrink-0 text-ink-400">
          <Bookmark size={15} className={saved ? 'fill-ink-900 text-ink-900' : ''} />
        </button>
      </div>
      <div className="mt-1 space-y-1 px-0.5 text-[11px] text-ink-500">
        <p className="flex items-center gap-1 truncate"><MapPin size={11} className="shrink-0" /> {candidate.personal.cityState}</p>
        <p className="flex items-center gap-1 truncate font-semibold text-ink-800"><Briefcase size={11} className="shrink-0 text-ink-400" /> {candidate.employment.occupation}</p>
        <p className="flex items-center gap-1 truncate"><GraduationCap size={11} className="shrink-0" /> {candidate.education.level === 'doctorate' ? t('Doctorate', 'دكتوراه') : candidate.education.level === 'masters' ? t("Master's", 'ماجستير') : t("Bachelor's", 'بكالوريوس')}</p>
      </div>
      <div className="mt-2 flex flex-wrap gap-1 px-0.5">
        <span className="rounded-md bg-parchment-200 px-1.5 py-0.5 text-[10px] text-ink-600">{t('Coptic', 'قبطي')}</span>
        <span className="rounded-md bg-parchment-200 px-1.5 py-0.5 text-[10px] text-ink-600">{candidate.compatibilityScore}%</span>
      </div>
      <button onClick={open} className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-xl bg-cta-bg py-2 text-xs font-semibold text-cta-text">
        {t('View Profile', 'شوف البروفايل')} <Arrow size={12} />
      </button>
    </div>
  )
}
