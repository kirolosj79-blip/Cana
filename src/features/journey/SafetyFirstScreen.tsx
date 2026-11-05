import { BottomNav } from '@/shared/components/layout/BottomNav'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, ShieldCheck, ImageOff, BanknoteX, Landmark, Clock, TriangleAlert } from 'lucide-react'
import { FigmaHeader } from '@/shared/components/layout/FigmaHeader'
import { Button } from '@/shared/components/ui/Button'
import { FCard, IconTile, PageHeading, Eyebrow, CheckRow } from '@/shared/components/ui/figma'
import { useLanguage } from '@/core/hooks/useLanguage'
import { useJourneyStore } from '@/store/journey.store'

/** Figma: "Your Safety Comes First". */
export function SafetyFirstScreen() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const accept = useJourneyStore((s) => s.acceptSafety)
  const [agreed, setAgreed] = useState(false)

  const rules = [
    { icon: ShieldCheck, tint: 'navy' as const, danger: false,
      en: ['Do not share personal or sensitive information,', ' such as your phone number, home address, workplace location, financial information, passwords, or other private information.'],
      ar: ['متشاركش معلومات شخصية أو حساسة،', ' زي رقم تليفونك أو عنوان البيت أو مكان الشغل أو معلوماتك المالية أو الباسوردات أو أي معلومة خاصة.'] },
    { icon: ImageOff, tint: 'navy' as const, danger: false,
      en: ['Do not send personal photos or documents', ' that could be misused.'],
      ar: ['متبعتش صور شخصية أو مستندات', ' ممكن حد يسيء استخدامها.'] },
    { icon: BanknoteX, tint: 'red' as const, danger: true,
      en: ['Never send or transfer money to', ' another member for any reason.'],
      ar: ['متبعتش ولا تحوّل فلوس أبدًا', ' لأي عضو تاني لأي سبب.'] },
    { icon: Landmark, tint: 'navy' as const, danger: false,
      en: ['Do not share your bank account information,', ' credit card information, or financial account details.'],
      ar: ['متشاركش بيانات حسابك البنكي', ' ولا بطاقتك الائتمانية ولا أي تفاصيل حساب مالي.'] },
    { icon: Clock, tint: 'navy' as const, danger: false,
      en: ['Take your time getting to know the other person.', ' Never feel pressured to take any step before you are comfortable.'],
      ar: ['خد وقتك وإنت بتتعرّف على الشخص التاني.', ' ماتحسش إنك مضغوط تاخد أي خطوة قبل ما تكون مرتاح.'] },
  ]

  return (
    <div className="min-h-screen bg-parchment-50">
      <div className="mx-auto max-w-md pb-28">
        <FigmaHeader />
        <PageHeading
          title={t('Your Safety Comes First', 'سلامتك أولًا')}
          subtitle={t('Protect Your Privacy and Stay Safe During the Early Stages of Getting to Know Someone', 'احمِ خصوصيتك وخلّيك آمن في أول مراحل التعارف')}
        />
        <div className="space-y-3 px-5">
          <FCard className="flex gap-3">
            <IconTile icon={TriangleAlert} tint="gold" size={34} />
            <p className="text-[13px] leading-relaxed text-ink-700">
              {t(
                'Your safety and privacy are important to us. Please use caution when communicating with anyone you meet through CANA, especially during the early stages of getting to know each other.',
                'سلامتك وخصوصيتك مهمين عندنا. خد بالك وإنت بتتواصل مع أي حد تقابله من خلال CANA، خصوصًا في أول مراحل التعارف.'
              )}
            </p>
          </FCard>

          <Eyebrow className="pt-3">{t('Essential Safety Rules', 'قواعد السلامة الأساسية')}</Eyebrow>

          {rules.map((r) => (
            <FCard key={r.en[0]} tone={r.danger ? 'danger' : 'default'} className="flex gap-3">
              <IconTile icon={r.icon} tint={r.tint} size={34} />
              <p className="text-[13px] leading-relaxed text-ink-500">
                <b className={r.danger ? 'text-danger-700' : 'text-ink-900'}>{t(r.en[0], r.ar[0])}</b>
                {t(r.en[1], r.ar[1])}
              </p>
            </FCard>
          ))}

          <div className="pt-1">
            <CheckRow checked={agreed} onChange={setAgreed}>
              {t("I agree to uphold CANA's community safety principles and report suspicious behavior.", 'أوافق ألتزم بمبادئ السلامة في مجتمع CANA وأبلّغ عن أي سلوك مريب.')}
            </CheckRow>
          </div>
          <Button
            variant="gold"
            size="lg"
            className="!rounded-[14px] w-full"
            disabled={!agreed}
            onClick={() => {
              accept()
              navigate('/contact-policy')
            }}
          >
            {t("I've Read & Understood", 'قرأت وفهمت')} <Check size={16} className="text-success-500" />
          </Button>
        </div>
      </div>
      <BottomNav disabled />
    </div>
  )
}
