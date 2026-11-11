import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { HeartHandshake } from 'lucide-react'
import { CenterDialog, SoftButton } from '@/shared/components/ui/figma'
import { Button } from '@/shared/components/ui/Button'
import { useJourneyStore } from '@/store/journey.store'
import { useToast } from '@/shared/components/feedback/Toast'
import { useLanguage } from '@/core/hooks/useLanguage'

const AWAY_DAYS = 10

/**
 * After 10+ days away, ask (choices only) whether the member had a
 * relationship in the meantime, and whether it came through CANA, and route
 * to the Previous Introduction Feedback form when relevant.
 * Add ?welcomeback=1 to any /app URL to preview it.
 */
export function WelcomeBackGate() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const { search } = useLocation()
  const { show } = useToast()
  const touch = useJourneyStore((s) => s.touch)
  const [step, setStep] = useState<null | 'q1' | 'q2' | 'q3'>(null)
  const ran = useRef(false)

  useEffect(() => {
    if (ran.current) return
    ran.current = true
    const last = useJourneyStore.getState().lastActiveAt
    const forced = new URLSearchParams(search).get('welcomeback') === '1'
    const away = last ? Date.now() - new Date(last).getTime() >= AWAY_DAYS * 24 * 60 * 60 * 1000 : false
    if (forced || away) setStep('q1')
    touch()
  }, [search, touch])

  const close = () => setStep(null)
  const welcome = () => {
    close()
    show(t('Welcome back! Glad to see you again.', 'أهلًا بيك تاني! سعداء إنك رجعت.'), 'success')
  }
  const toFeedback = () => {
    close()
    navigate('/app/feedback')
  }

  return (
    <>
      <CenterDialog
        open={step === 'q1'}
        icon={<HeartHandshake size={24} />}
        title={t('Welcome back', 'أهلًا بيك تاني')}
        actions={
          <>
            <Button variant="gold" size="lg" className="!rounded-[12px] w-full" onClick={() => setStep('q2')}>{t('Yes', 'أيوه')}</Button>
            <SoftButton onClick={welcome}>{t('No', 'لأ')}</SoftButton>
          </>
        }
      >
        <p className="font-semibold text-ink-900">{t('Was there a relationship during the time you were away?', 'هل كان في علاقة خلال الفترة اللي غيبتها؟')}</p>
      </CenterDialog>

      <CenterDialog
        open={step === 'q2'}
        icon={<HeartHandshake size={24} />}
        title={t('One more question', 'سؤال كمان')}
        actions={
          <>
            <Button variant="gold" size="lg" className="!rounded-[12px] w-full" onClick={toFeedback}>{t('Yes, through CANA', 'أيوه، من خلال CANA')}</Button>
            <SoftButton onClick={() => setStep('q3')}>{t('No, not through CANA', 'لأ، مش من خلال CANA')}</SoftButton>
          </>
        }
      >
        <p className="font-semibold text-ink-900">{t('Did this relationship begin through the CANA app?', 'هل العلاقة دي بدأت من خلال تطبيق CANA؟')}</p>
      </CenterDialog>

      <CenterDialog
        open={step === 'q3'}
        icon={<HeartHandshake size={24} />}
        title={t('Your feedback', 'ملاحظاتك')}
        actions={
          <>
            <Button variant="gold" size="lg" className="!rounded-[12px] w-full" onClick={toFeedback}>{t('Yes, I’ll share', 'أيوه، هشارك')}</Button>
            <SoftButton onClick={welcome}>{t('No, continue', 'لأ، كمّل')}</SoftButton>
          </>
        }
      >
        <p className="font-semibold text-ink-900">{t('Would you like to give us feedback about what happened?', 'تحب تدّينا ملاحظاتك عن اللي حصل؟')}</p>
      </CenterDialog>
    </>
  )
}
