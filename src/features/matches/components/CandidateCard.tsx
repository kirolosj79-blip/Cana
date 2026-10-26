import { useNavigate } from 'react-router-dom'
import { Heart, MapPin } from 'lucide-react'
import type { UserProfile } from '@/types/profile.types'
import { Card } from '@/shared/components/ui/Card'
import { Badge } from '@/shared/components/ui/Badge'
import { TrustSeal } from '@/shared/components/ui/TrustSeal'
import { useMatchesStore } from '@/store/matches.store'
import { useLanguage } from '@/core/hooks/useLanguage'
import { cn } from '@/shared/utils/cn'

export function CandidateCard({ candidate, variant = 'row' }: { candidate: UserProfile; variant?: 'row' | 'grid' }) {
  const navigate = useNavigate()
  const { toggleSave, isSaved } = useMatchesStore()
  const { t } = useLanguage()
  const saved = isSaved(candidate.id)
  const age = new Date().getFullYear() - new Date(candidate.personal.dateOfBirth).getFullYear()

  if (variant === 'grid') {
    return (
      <Card className="overflow-hidden cursor-pointer" onClick={() => navigate(`/app/profile/${candidate.id}`)}>
        <div className="relative aspect-[4/5]">
          <img src={candidate.personal.profilePhotoUrl} alt={candidate.personal.displayName} className="h-full w-full object-cover bg-ink-100" />
          <button
            onClick={(e) => {
              e.stopPropagation()
              toggleSave(candidate.id)
            }}
            className="absolute top-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-parchment-0/90 backdrop-blur"
          >
            <Heart size={15} className={saved ? 'fill-wine-600 text-wine-600' : 'text-ink-600'} />
          </button>
          <div className="absolute bottom-2 left-2 rounded-full bg-ink-950/70 px-2 py-0.5 text-[10px] font-semibold text-gold-300 backdrop-blur">
            {t(`${candidate.compatibilityScore}% Match`, `توافق ${candidate.compatibilityScore}%`)}
          </div>
        </div>
        <div className="p-3">
          <p className="text-sm font-semibold text-ink-900 truncate">
            {candidate.personal.firstName}, {age}
          </p>
          <p className="text-xs text-ink-500 truncate flex items-center gap-1 mt-0.5">
            <MapPin size={11} /> {candidate.personal.cityState}
          </p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-4 cursor-pointer" onClick={() => navigate(`/app/profile/${candidate.id}`)}>
      <div className="flex gap-4">
        <div className="relative shrink-0">
          <img src={candidate.personal.profilePhotoUrl} alt="" className="h-20 w-20 rounded-2xl object-cover bg-ink-100" />
          {candidate.verification.church === 'verified' && (
            <span className="absolute -bottom-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-gold-400 ring-2 ring-parchment-0">
              <span className="text-[10px] font-bold text-inkfixed-950">✓</span>
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-display text-base font-medium text-ink-900 truncate">
                {candidate.personal.displayName}, {age}
              </p>
              <p className="text-xs text-ink-500 flex items-center gap-1 mt-0.5">
                <MapPin size={11} /> {candidate.personal.cityState}
              </p>
            </div>
            <Badge variant="gold" className="shrink-0">
              {candidate.compatibilityScore}%
            </Badge>
          </div>
          <p className="text-xs text-ink-600 mt-1.5">
            {candidate.church.churchName} · {candidate.employment.occupation}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {candidate.gettingToKnowYou.desiredMarriageValues?.slice(0, 2).map((v) => (
              <Badge key={v} variant="neutral">
                {v}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}

export function VerificationRow({ candidate }: { candidate: UserProfile }) {
  const { t } = useLanguage()
  return (
    <div className={cn('flex items-center justify-around rounded-[var(--radius-md)] bg-ink-50/60 py-3')}>
      <TrustSeal kind="identity" status={candidate.verification.identity} label={t('Identity', 'الهوية')} size="sm" />
      <TrustSeal kind="church" status={candidate.verification.church} label={t('Church', 'الكنيسة')} size="sm" />
      <TrustSeal kind="marriageEligibility" status={candidate.verification.marriageEligibility} label={t('Eligible', 'الأهلية')} size="sm" />
      <TrustSeal kind="medical" status={candidate.verification.medical} label={t('Medical', 'الطبي')} size="sm" />
    </div>
  )
}
