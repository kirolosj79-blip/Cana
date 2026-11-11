import { FigmaHeader } from '@/shared/components/layout/FigmaHeader'
import { MatchesGrid, VerseBanner } from '@/features/matches/screens/HomeScreen'
import { useMe } from '@/core/hooks/useMe'

/** Same card grid as Home, listing every verified profile. */
export function DiscoverScreen() {
  const { t } = useMe()
  return (
    <div>
      <FigmaHeader />
      <div className="space-y-4 px-5 pb-6 pt-2">
        <VerseBanner salt={5} />
        <h1 className="text-[22px] font-bold tracking-tight text-ink-900">{t('Discover', 'اكتشف')}</h1>
        <MatchesGrid />
      </div>
    </div>
  )
}
