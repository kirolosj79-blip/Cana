import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { PageContainer } from '@/shared/components/layout/PageContainer'
import { Button } from '@/shared/components/ui/Button'
import { useLanguage, useEffectiveTheme } from '@/core/hooks/useLanguage'
import { useAppStore } from '@/store/app.store'
import { Globe, Sun, Moon } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

const slides = [
  {
    image: '/onboarding/church.png',
    titleEn: "Faith comes first. Love follows God's plan.",
    titleAr: 'الإيمان الأول، والحب بيمشي على خطة ربنا.',
    subtitleEn: 'We help Egyptian Christians build Christ-centered marriages.',
    subtitleAr: 'بنساعد المسيحيين المصريين يبنوا جواز محوره المسيح.',
  },
  {
    image: '/onboarding/blessing.png',
    titleEn: "More than a match, it's a God-blessed marriage.",
    titleAr: 'أكتر من ترشيح، ده جواز مبارك من ربنا.',
    subtitleEn: 'We are here to support you in finding a partner and building a life rooted in Christ.',
    subtitleAr: 'بندعمك تلاقي شريك حياتك وتبني حياة أساسها الإيمان.',
  },
  {
    image: '/onboarding/rings.png',
    titleEn: 'Serious Commitment. A beautiful journey.',
    titleAr: 'التزام حقيقي، ورحلة جميلة.',
    subtitleEn: 'Every profile is created for marriage, built on faith, respect and trust.',
    subtitleAr: 'كل بروفايل هنا اتبنى للجواز، على أساس الإيمان والاحترام والثقة.',
  },
]

export function OnboardingCarouselScreen() {
  const navigate = useNavigate()
  const { t, isRtl, language } = useLanguage()
  const setLanguage = useAppStore((s) => s.setLanguage)
  const setThemeMode = useAppStore((s) => s.setThemeMode)
  const effectiveTheme = useEffectiveTheme()
  const [index, setIndex] = useState(0)
  const slide = slides[index]
  const isLast = index === slides.length - 1

  const goNext = () => {
    if (isLast) navigate('/language')
    else setIndex((i) => i + 1)
  }

  return (
    <PageContainer noPadding className="justify-between py-6" hideHearts fullHeight>
      <div className="flex items-center justify-between px-5">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setThemeMode(effectiveTheme === 'dark' ? 'light' : 'dark')}
            className="flex items-center justify-center rounded-full p-1.5 text-ink-500 bg-ink-50 hover:bg-ink-100"
            aria-label={t('Toggle light/dark', 'تبديل الوضع الفاتح/الغامق')}
          >
            {effectiveTheme === 'dark' ? <Sun size={13} /> : <Moon size={13} />}
          </button>
          <button
            onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
            className="flex items-center justify-center h-7 w-7 rounded-full text-ink-500 bg-ink-50 hover:bg-ink-100"
            aria-label={t('Switch language', 'تبديل اللغة')}
          >
            <Globe size={14} />
          </button>
        </div>
        <button onClick={() => navigate('/language')} className="text-sm font-medium text-ink-400 hover:text-ink-600">
          {t('Skip', 'تخطي')}
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-8 overflow-y-auto min-h-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: isRtl ? -40 : 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isRtl ? 40 : -40 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col items-center gap-8"
          >
            <div className="w-full max-w-xs rounded-[var(--r-lg)] overflow-hidden border border-gold-200 shadow-[var(--shadow-soft-md)]">
              <motion.img
                src={slide.image}
                alt=""
                className="w-full h-auto object-cover"
                initial={{ scale: 1.06 }}
                animate={{ scale: 1 }}
                transition={{ duration: 6, ease: 'easeOut' }}
              />
            </div>
            <div className="space-y-2">
              <h1 className="font-display text-2xl font-medium text-ink-900 text-balance">{t(slide.titleEn, slide.titleAr)}</h1>
              <p className="text-sm text-ink-500 max-w-xs mx-auto leading-relaxed">{t(slide.subtitleEn, slide.subtitleAr)}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="px-5 space-y-4 relative z-10">
        <div className="flex items-center justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className={cn('h-1.5 rounded-full transition-all', i === index ? 'w-6 bg-gold-400' : 'w-1.5 bg-ink-200')}
              aria-label={`slide ${i + 1}`}
            />
          ))}
        </div>
        <Button variant="gold" size="lg" className="w-full" onClick={goNext} type="button">
          {isLast ? t('Get Started', 'يلا نبدأ') : t('Continue', 'كمّل')}
        </Button>
        <button type="button" onClick={() => navigate('/phone-auth', { state: { mode: 'login' } })} className="w-full text-center text-sm text-ink-500 py-1">
          {t('Already have an account?', 'عندك حساب بالفعل؟')} <span className="text-gold-600 font-semibold">{t('Log In', 'سجّل دخول')}</span>
        </button>
      </div>
    </PageContainer>
  )
}
