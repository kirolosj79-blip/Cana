import { supabase } from '@/services/supabase'
import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/shared/components/ui/Button'
import { PageContainer } from '@/shared/components/layout/PageContainer'
import { TopBar } from '@/shared/components/layout/TopBar'
import { useToast } from '@/shared/components/feedback/Toast'
import { useAuthStore } from '@/store/auth.store'
import { useLanguage } from '@/core/hooks/useLanguage'

const RESEND_SECONDS = 45
const MAX_ATTEMPTS = 5

export function OtpVerificationScreen() {
  const navigate = useNavigate()
  const location = useLocation() as { state?: { phone?: string } }
  const { show } = useToast()
  const { t } = useLanguage()
  const { markPhoneVerified, loginWithPhone, isKnownPhone } = useAuthStore()

  const phone = location.state?.phone ?? ''

  const [digits, setDigits] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS)
  const refs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (secondsLeft <= 0) return
    const timer = setInterval(() => setSecondsLeft((s) => s - 1), 1000)
    return () => clearInterval(timer)
  }, [secondsLeft])

  const handleChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return
    const next = [...digits]
    next[i] = val
    setDigits(next)
    if (val && i < 5) refs.current[i + 1]?.focus()
  }

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) refs.current[i - 1]?.focus()
  }

  const resend = async () => {
    if (supabase) {
      const { error } = await supabase.auth.signInWithOtp({ phone })
      if (error) {
        show(t('Could not resend the code. Try again shortly.', 'مقدرناش نبعت الكود تاني. حاول بعد شوية.'), 'error')
        return
      }
    }
    setSecondsLeft(RESEND_SECONDS)
    setDigits(['', '', '', '', '', ''])
    show(t('Code resent', 'اتبعت الكود تاني'), 'info')
  }

  const verify = async () => {
    if (attempts >= MAX_ATTEMPTS) {
      show(t('Too many attempts — please request a new code.', 'حاولت كتير، اطلب كود جديد.'), 'error')
      return
    }
    setLoading(true)
    if (supabase) {
      setAttempts((a) => a + 1)
      const { data, error } = await supabase.auth.verifyOtp({ phone, token: digits.join(''), type: 'sms' })
      if (error || !data.user) {
        setLoading(false)
        setDigits(['', '', '', '', '', ''])
        refs.current[0]?.focus()
        show(t('That code is not correct or has expired.', 'الكود غلط أو انتهت مدته.'), 'error')
        return
      }
      const { data: row } = await supabase.from('profiles').select('is_onboarded').eq('id', data.user.id).maybeSingle()
      const onboarded = Boolean(row?.is_onboarded)
      markPhoneVerified(phone)
      loginWithPhone(phone, { authId: data.user.id, isOnboarded: onboarded })
      show(t('Verified!', 'اتوثق بنجاح!'), 'success')
      navigate(onboarded ? '/app/home' : '/registration-intro')
      setLoading(false)
      return
    }
    setTimeout(() => {
      setAttempts((a) => a + 1)
      markPhoneVerified(phone)
      loginWithPhone(phone)
      show(t('Verified!', 'اتوثق بنجاح!'), 'success')
      navigate(isKnownPhone(phone) ? '/app/home' : '/registration-intro')
      setLoading(false)
    }, 700)
  }

  return (
    <PageContainer noPadding photoBackground hideHearts>
      <TopBar showBack hideNotifications />
      <div className="flex-1 flex flex-col px-5 pt-2">
        <div className="rounded-[var(--radius-lg)] bg-parchment-0 border border-ink-100 shadow-[var(--shadow-soft-sm)] px-4 py-4 mb-6">
          <h1 className="font-display text-2xl font-medium text-ink-900 mb-1">{t('Verify your phone', 'وثّق رقمك')}</h1>
          <p className="text-sm text-ink-500 leading-relaxed">
            {t('Enter the 6-digit code we sent to', 'دخّل الكود المكون من 6 أرقام اللي بعتناهولك على')}{' '}
            <span className="font-medium text-ink-700" dir="ltr">
              {phone}
            </span>
          </p>
        </div>

        <div className="flex justify-between gap-2" dir="ltr">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => {
                refs.current[i] = el
              }}
              value={d}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              inputMode="numeric"
              maxLength={1}
              className="h-14 w-12 rounded-[var(--radius-md)] border border-ink-200 bg-parchment-0 text-center text-xl font-semibold text-ink-900 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-200"
            />
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between rounded-[var(--radius-md)] bg-parchment-0 border border-ink-100 px-4 py-3">
          <button
            disabled={secondsLeft > 0}
            className="text-sm font-bold text-emphasis-text hover:underline disabled:opacity-40 disabled:no-underline"
            onClick={resend}
          >
            {t('Resend code', 'ابعت الكود تاني')}
          </button>
          {secondsLeft > 0 && (
            <span className="text-xs font-bold text-emphasis-text" dir="ltr">
              00:{String(secondsLeft).padStart(2, '0')}
            </span>
          )}
        </div>

        <div className="mt-auto pt-8 pb-6">
          <Button variant="gold" size="lg" className="w-full" loading={loading} disabled={digits.some((d) => !d)} onClick={verify}>
            {t('Verify', 'تحقق')}
          </Button>
        </div>
      </div>
    </PageContainer>
  )
}
