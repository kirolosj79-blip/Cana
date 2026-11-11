import { TopBar } from '@/shared/components/layout/TopBar'
import { CandidateCard } from '@/features/matches/components/CandidateCard'
import { EmptyState } from '@/shared/components/feedback/StateScreens'
import { useMatchesStore } from '@/store/matches.store'
import { getMockCandidates } from '@/services/mock/candidates.mock'
import { Heart } from 'lucide-react'
import { useLanguage } from '@/core/hooks/useLanguage'

export function SavedScreen() {
  const savedIds = useMatchesStore((s) => s.savedIds)
  const saved = getMockCandidates().filter((c) => savedIds.includes(c.id))
  const { t } = useLanguage()

  return (
    <div>
      <TopBar title={t('Saved Profiles', 'الملفات المحفوظة')} showBack />
      <div className="px-5 py-4">
        {saved.length === 0 ? (
          <EmptyState
            icon={<Heart size={24} />}
            title={t('No saved profiles yet', 'لسه مفيش ملفات محفوظة')}
            description={t('Tap the heart on any profile to save it here.', 'دوس على القلب في أي ملف عشان تحفظه هنا.')}
          />
        ) : (
          <div className="space-y-3">
            {saved.map((c) => (
              <CandidateCard key={c.id} candidate={c} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
