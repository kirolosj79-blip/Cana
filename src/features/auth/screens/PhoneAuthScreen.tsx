import { supabase } from '@/services/supabase'
import { useToast } from '@/shared/components/feedback/Toast'
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Phone } from 'lucide-react'
import { Input } from '@/shared/components/ui/Input'
import { Select } from '@/shared/components/ui/Select'
import { Button } from '@/shared/components/ui/Button'
import { PageContainer } from '@/shared/components/layout/PageContainer'
import { TopBar } from '@/shared/components/layout/TopBar'
import { useLanguage } from '@/core/hooks/useLanguage'
import { useAuthStore } from '@/store/auth.store'
import { countryDialCode, isValidPhoneForCountry } from '@/shared/utils/phone'

const countries = [
  { value: 'egypt', labelEn: 'Egypt (+20)', labelAr: 'مصر (+20)' },
  { value: 'usa', labelEn: 'USA (+1)', labelAr: 'أمريكا (+1)' },
  { value: 'canada', labelEn: 'Canada (+1)', labelAr: 'كندا (+1)' },
]

export function PhoneAuthScreen() {
  const { show } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useLanguage()
  const isLoginMode = (location.state as { mode?: string } | null)?.mode === 'login'
  const { markPhoneVerified, loginWithPhone, isKnownPhone } = useAuthStore()
  const [country, setCountry] = useState('egypt')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const dialCode = countryDialCode(country) || '+'
  const valid = isValidPhoneForCountry(country, phone)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!valid) return
    const full = `${dialCode}${phone.replace(/\D/g, '')}`
    setLoading(true)
    // No OTP step: the number is taken as entered. With Supabase on, we open an
    // anonymous session (Authentication -> Anonymous sign-ins must be enabled) so
    // the registration can still be saved to the member's profile row.
    let authId: string | undefined
    if (supabase) {
      const { data: s } = await supabase.auth.getSession()
      authId = s.session?.user.id
      if (!authId) {
        const { data, error } = await supabase.auth.signInAnonymously()
        if (error || !data.user) {
          console.error('[Supabase anonymous sign-in]', error)
          setLoading(false)
          show(`${t('Could not start your session. Please try again.', 'مقدرناش نبدأ الجلسة. جرّب تاني.')} (${error?.message ?? ''})`, 'error')
          return
        }
        authId = data.user.id
      }
      const { error: upErr } = await supabase.from('profiles').update({ phone: full }).eq('id', authId)
      if (upErr && upErr.code !== '23505') console.error('[Supabase phone save]', upErr)
    }
    const known = isKnownPhone(full)
    markPhoneVerified(full)
    loginWithPhone(full, { authId, isOnboarded: known })
    navigate(known ? '/app/home' : '/registration-intro')
    setLoading(false)
  }

  return (
    <PageContainer noPadding photoBackground hideHearts>
      <TopBar showBack hideNotifications title={isLoginMode ? t('Log In', 'تسجيل الدخول') : undefined} />
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col px-5 pt-2">
        <div className="rounded-[var(--r-lg)] bg-parchment-0 border border-ink-100 shadow-[var(--shadow-soft-sm)] px-4 py-4 mb-6">
          <h1 className="font-display text-2xl font-medium text-ink-900 mb-1">
            {isLoginMode ? t('Welcome back — enter your number', 'أهلًا بيك تاني — دخّل رقمك') : t('Enter your phone number', 'دخّل رقم موبايلك')}
          </h1>
          <p className="text-sm text-ink-500 leading-relaxed">
            {isLoginMode
              ? t("Enter the same number you registered with — we'll log you straight in.", 'دخّل نفس الرقم اللي سجّلت بيه — وهندخّلك على طول.')
              : t('Enter your phone number to start your registration.', 'دخّل رقم موبايلك وابدأ التسجيل.')}
          </p>
        </div>

        <div className="grid grid-cols-[minmax(0,155px)_1fr] gap-3">
          <Select
            value={country}
            onChange={(e) => {
              setCountry(e.target.value)
              setPhone('')
            }}
            label={t('Country', 'الدولة')}
          >
            {countries.map((c) => (
              <option key={c.value} value={c.value}>
                {t(c.labelEn, c.labelAr)}
              </option>
            ))}
          </Select>
          <Input
            label={t('Mobile phone number', 'رقم الموبايل')}
            hint={dialCode !== '+' ? t(`Starts with ${dialCode}`, `يبدأ بـ ${dialCode}`) : undefined}
            type="tel"
            leftIcon={<Phone size={17} />}
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
            error={
              phone && !valid
                ? country === 'egypt'
                  ? t('Egyptian numbers are 11 digits starting with 01', 'الرقم المصري 11 رقم ويبدأ بـ 01')
                  : t('Please enter a valid phone number', 'اكتب رقم موبايل صحيح')
                : undefined
            }
            required
          />
        </div>

        <p className="text-xs on-photo-text mt-5 leading-relaxed">
          {t(
            'By continuing you agree to our Terms and confirm you are sincerely seeking Orthodox Christian marriage, not casual dating.',
            'بالمتابعة إنت موافق على الشروط وبتأكد إنك بجد بتدور على جواز أرثوذكسي، مش تعارف عابر.'
          )}
        </p>

        <div className="mt-auto pt-8 pb-6">
          <Button type="submit" variant="gold" size="lg" className="w-full" loading={loading} disabled={!valid}>
            {t('Continue', 'كمّل')}
          </Button>
        </div>
      </form>
    </PageContainer>
  )
}
