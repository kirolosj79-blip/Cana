import { useNavigate } from 'react-router-dom'
import { Star, Lock, Quote } from 'lucide-react'
import { TopBar } from '@/shared/components/layout/TopBar'
import { Button } from '@/shared/components/ui/Button'
import { FCard } from '@/shared/components/ui/figma'
import { useLanguage } from '@/core/hooks/useLanguage'
import { BrandMark } from '@/shared/components/ui/BrandMark'

/** Figma: "Introduction Complete". */
export function IntroCompleteScreen() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  return (
    <div className="pb-10">
      <TopBar showLogo />
      <div className="space-y-4 px-5 pt-5 text-center">
        <span className="inline-flex items-center gap-1 rounded-full bg-gold-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gold-700"><Star size={10} /> {t('CANA Covenant Blessing', 'بركة عهد CANA')}</span>
        <h1 className="font-display text-[28px] font-semibold text-ink-900">{t('Introduction Complete', 'التعارف اكتمل')}</h1>
        <p className="text-sm text-ink-500">{t('Your introduction through CANA is now complete.', 'تعارفك من خلال CANA اكتمل.')}</p>
        <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-parchment-100 text-wine-700 ring-8 ring-gold-50"><BrandMark size={54} /></div>
        <p className="text-[13px] text-ink-500">{t('We pray that this next step will be a meaningful one for both of you.', 'بنصلّي إن الخطوة الجاية تكون ذات معنى للاتنين.')}</p>

        <FCard className="text-start">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-2 text-sm font-bold text-ink-900"><Lock size={14} className="text-ink-400" /> {t('Account Status', 'حالة الحساب')}</p>
            <span className="rounded-md bg-gold-100 px-2 py-0.5 text-[10px] font-bold text-gold-700">{t('Profiles Paused', 'الملفات متوقفة')}</span>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-ink-500">{t('Your profiles are now hidden from matching. You can return and reactivate at any time.', 'ملفاتك دلوقتي مخفية من الترشيح. تقدر ترجع وتفعّل في أي وقت.')}</p>
        </FCard>

        <FCard tone="warm" className="relative text-start">
          <Quote size={14} className="text-gold-700" />
          <p className="mt-1 font-display text-[15px] italic leading-snug text-ink-800">{t('“Above all, put on love, which binds everything together in perfect harmony.”', '"وَعَلَى جَمِيعِ هذِهِ ٱلْبَسُوا ٱلْمَحَبَّةَ ٱلَّتِي هِيَ رِبَاطُ ٱلْكَمَالِ."')}</p>
          <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-gold-700">— {t('Colossians 3:14', 'كولوسي 3: 14')}</p>
        </FCard>

        <Button variant="gold" size="lg" className="w-full" onClick={() => navigate('/app/home')}>{t('Done', 'تم')}</Button>
      </div>
    </div>
  )
}
