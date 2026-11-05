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
    // Real OTP when Supabase is configured; otherwise the prototype's mock flow.
    if (supabase) {
      const { error } = await supabase.auth.signInWithOtp({ phone: full })
            if (error) {
        console.error('[Supabase OTP]', error)
        setLoading(false)
        show(`${t('Could not send the code.', 'مقدرناش نبعت الكود.')} (${error.message})`, 'error')
        return
      }
    }
    navigate('/otp-verification', { state: { phone: full } })
    setLoading(false)
  }

  return (
    <PageContainer noPadding photoBackground hideHearts>
      <TopBar showBack hideNotifications title={isLoginMode ? t('Log In', 'تسجيل الدخول') : undefined} />
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col px-5 pt-2">
        <div className="rounded-[var(--radius-lg)] bg-parchment-0 border border-ink-100 shadow-[var(--shadow-soft-sm)] px-4 py-4 mb-6">
          <h1 className="font-display text-2xl font-medium text-ink-900 mb-1">
            {isLoginMode ? t('Welcome back — enter your number', 'أهلًا بيك تاني — دخّل رقمك') : t('Enter your phone number', 'دخّل رقم موبايلك')}
          </h1>
          <p className="text-sm text-ink-500 leading-relaxed">
            {isLoginMode
              ? t("Enter the same number you registered with — we'll send you a code and log you straight in.", 'دخّل نفس الرقم اللي سجّلت بيه — هنبعتلك كود وندخّلك على طول.')
              : t("We'll send you a verification code by WhatsApp or SMS.", 'هنبعتلك كود تحقق على واتساب أو رسالة نصية.')}
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
            {t('Send Code', 'ابعت الكود')}
          </Button>
        </div>
      </form>
    </PageContainer>
  )
}
