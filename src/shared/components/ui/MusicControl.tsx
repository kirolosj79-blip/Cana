import { useState } from 'react'
import { Music, Pause, Play } from 'lucide-react'
import { useMusicPrefStore } from '@/store/musicPref.store'
import { cn } from '@/shared/utils/cn'
import { useLanguage } from '@/core/hooks/useLanguage'

/**
 * Pure UI control — the actual playback lives in `GlobalBackgroundMusic`,
 * mounted once at the app root so music starts from the very first screen
 * regardless of whether this button (which only appears on screens with a
 * TopBar) is on-screen yet.
 */
export function MusicControl() {
  const { enabled, volume, setEnabled, setVolume } = useMusicPrefStore()
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'flex h-9 w-9 items-center justify-center rounded-full transition-colors',
          enabled ? 'bg-gold-100 text-gold-600' : 'bg-ink-50 text-ink-400'
        )}
        aria-label={t('Background music', 'موسيقى خلفية')}
      >
        <Music size={16} />
      </button>
      {open && (
        <div className="absolute right-0 top-11 z-30 w-56 rounded-[var(--radius-md)] border border-ink-100 bg-parchment-0 p-4 shadow-[var(--shadow-soft-md)]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-ink-700">{t('Background music', 'موسيقى الخلفية')}</span>
            <button onClick={() => setEnabled(!enabled)} className="flex h-7 w-7 items-center justify-center rounded-full bg-ink-50 text-ink-600">
              {enabled ? <Pause size={13} /> : <Play size={13} />}
            </button>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-full accent-gold-500"
          />
          <p className="text-[10px] text-ink-400 mt-2 leading-relaxed">{t('Plays automatically — pause it anytime.', 'بتشتغل تلقائي — وقّفها في أي وقت.')}</p>
        </div>
      )}
    </div>
  )
}
