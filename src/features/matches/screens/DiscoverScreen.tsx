import { useState } from 'react'
import { SlidersHorizontal, LayoutGrid, LayoutList, Users } from 'lucide-react'
import { TopBar } from '@/shared/components/layout/TopBar'
import { CandidateCard } from '@/features/matches/components/CandidateCard'
import { getDiscoverList } from '@/store/matches.store'
import { useRegistrationStore } from '@/store/registration.store'
import { Modal } from '@/shared/components/ui/Modal'
import { ChoiceGroup } from '@/shared/components/ui/ChoiceGroup'
import { Button } from '@/shared/components/ui/Button'
import { EmptyState } from '@/shared/components/feedback/StateScreens'
import { useLanguage } from '@/core/hooks/useLanguage'
import { cn } from '@/shared/utils/cn'

const tabs = [
  { key: 'All', en: 'All', ar: 'الكل' },
  { key: 'New', en: 'New', ar: 'جديد' },
  { key: 'Nearby', en: 'Nearby', ar: 'قريب منك' },
] as const

export function DiscoverScreen() {
  const [tab, setTab] = useState<(typeof tabs)[number]['key']>('All')
  const [view, setView] = useState<'list' | 'grid'>('list')
  const [filterOpen, setFilterOpen] = useState(false)
  const [country, setCountry] = useState<string[]>([])
  const myGender = useRegistrationStore((s) => s.draft.gender)
  const candidates = getDiscoverList()
  const { t } = useLanguage()

  return (
    <div>
      <TopBar title={t('Discover', 'اكتشف')} />
      <div className="px-5 pt-2 pb-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-2">
            {tabs.map((tabItem) => (
              <button
                key={tabItem.key}
                onClick={() => setTab(tabItem.key)}
                className={cn(
                  'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                  tab === tabItem.key ? 'bg-ink-900 text-parchment-0' : 'bg-ink-50 text-ink-500'
                )}
              >
                {t(tabItem.en, tabItem.ar)}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={() => setView(view === 'list' ? 'grid' : 'list')} className="rounded-full p-2 text-ink-600 hover:bg-ink-100">
              {view === 'list' ? <LayoutGrid size={18} /> : <LayoutList size={18} />}
            </button>
            <button onClick={() => setFilterOpen(true)} className="rounded-full p-2 text-ink-600 hover:bg-ink-100">
              <SlidersHorizontal size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="px-5 pb-6">
        {!myGender ? (
          <EmptyState
            icon={<Users size={22} />}
            title={t('Finish your profile first', 'كمّل بياناتك الأول')}
            description={t(
              'We show matches once we know a little about you — complete Personal Information to start browsing.',
              'هنعرضلك ترشيحات لما نعرف عنك شوية — كمّل المعلومات الشخصية عشان تبدأ تتصفح.'
            )}
          />
        ) : view === 'list' ? (
          <div className="space-y-3">
            {candidates.map((c) => (
              <CandidateCard key={c.id} candidate={c} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {candidates.map((c) => (
              <CandidateCard key={c.id} candidate={c} variant="grid" />
            ))}
          </div>
        )}
      </div>

      <div className="px-5 pb-8">
        <div className="rounded-[var(--radius-md)] bg-ink-50 px-4 py-3 text-center">
          <p className="text-xs text-ink-500">{t('All profiles are reviewed and verified to maintain a safe and serious community.', 'كل الملفات بتتراجع وتتوثق عشان نحافظ على مجتمع آمن وجاد.')}</p>
        </div>
      </div>

      <Modal
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        title={t('Filter matches', 'فلترة الترشيحات')}
        footer={
          <>
            <Button variant="outline" className="flex-1" onClick={() => setCountry([])}>
              {t('Clear', 'مسح')}
            </Button>
            <Button variant="gold" className="flex-1" onClick={() => setFilterOpen(false)}>
              {t('Apply', 'تطبيق')}
            </Button>
          </>
        }
      >
        <ChoiceGroup
          label={t('Country', 'البلد')}
          multi
          columns={2}
          value={country}
          onChange={setCountry}
          options={[
            { value: 'egypt', label: t('Egypt', 'مصر') },
            { value: 'usa', label: t('USA', 'أمريكا') },
            { value: 'canada', label: t('Canada', 'كندا') },
          ]}
        />
      </Modal>
    </div>
  )
}
