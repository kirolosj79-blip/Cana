import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Save } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { PageContainer } from '@/shared/components/layout/PageContainer'
import { MotivationalBanner } from '@/shared/components/ui/MotivationalBanner'
import { useLanguage } from '@/core/hooks/useLanguage'

export function RegistrationIntroScreen() {
  const navigate = useNavigate()
  const { t } = useLanguage()

  return (
    <PageContainer className="justify-between py-10">
      <div className="flex-1 flex flex-col items-center justify-center text-center gap-6">
        <motion.span
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 14 }}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-gold-100 text-gold-600"
        >
          <Heart size={32} />
        </motion.span>
        <div>
          <h1 className="font-display text-2xl font-medium text-ink-900">{t('Welcome to Cana ❤️', 'أهلًا بيك في Cana ❤️')}</h1>
          <p className="text-sm text-ink-500 mt-3 max-w-xs mx-auto leading-relaxed">
            {t(
              "We're happy you've started this journey with us.",
              'إحنا مبسوطين إنك بدأت الرحلة معانا.'
            )}
          </p>
        </div>

        <div className="w-full rounded-[var(--radius-md)] bg-parchment-0 border border-ink-100 px-5 py-4 space-y-2 text-center">
          <p className="text-sm text-ink-700 leading-relaxed">
            {t(
              'Registration takes about 15 to 20 minutes.',
              'التسجيل بياخد تقريبًا من 15 لـ 20 دقيقة.'
            )}
          </p>
          <p className="text-sm text-ink-700 leading-relaxed">
            {t(
              "You don't have to finish it all now — you can save your progress and come back anytime.",
              'ومش لازم تخلصه كله دلوقتي، تقدر تحفظ تقدمك وترجع تكمل في أي وقت.'
            )}
          </p>
        </div>

        <MotivationalBanner />
      </div>

      <div className="space-y-3 pt-6">
        <Button variant="gold" size="lg" className="w-full" onClick={() => navigate('/registration')}>
          {t('Continue', 'كمّل')}
        </Button>
        <Button variant="ghost" size="lg" className="w-full" onClick={() => navigate('/app/home')}>
          <Save size={15} /> {t('Save and Exit', 'احفظ واخرج')}
        </Button>
      </div>
    </PageContainer>
  )
}
