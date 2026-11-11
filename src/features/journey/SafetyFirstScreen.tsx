import { BottomNav } from '@/shared/components/layout/BottomNav'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, ImageOff, BanknoteX, Landmark, Clock, TriangleAlert } from 'lucide-react'
import { FigmaHeader } from '@/shared/components/layout/FigmaHeader'
import { Button } from '@/shared/components/ui/Button'
import { FCard, IconTile, PageHeading, Eyebrow, CheckRow } from '@/shared/components/ui/figma'
import { useMe } from '@/core/hooks/useMe'
import { useJourneyStore } from '@/store/journey.store'

/** Figma: "Your Safety Comes First". */
export function SafetyFirstScreen() {
  const { t, name, g } = useMe()
  const navigate = useNavigate()
  const accept = useJourneyStore((s) => s.acceptSafety)
  const [agreed, setAgreed] = useState(true)

  const rules = [
    { icon: ShieldCheck, tint: 'navy' as const, danger: false,
      en: ['Do not share personal or sensitive information,', ' such as your phone number, home address, workplace location, financial information, passwords, or other private information.'],
      ar: ['ما تشاركش معلوماتك الشخصية أو الخاصة،', ' زي رقم تليفونك، عنوان بيتك، مكان شغلك، بياناتك المالية، كلمات المرور، أو أي معلومات خاصة تانية.'] },
    { icon: ImageOff, tint: 'navy' as const, danger: false,
      en: ['Do not send personal photos or documents', ' that could be misused.'],
      ar: ['ما تبعتش صور شخصية أو مستندات خاصة', ' ممكن حد يستخدمها بطريقة تضرّك.'] },
    { icon: BanknoteX, tint: 'red' as const, danger: true,
      en: ['Never send or transfer money to', ' another member for any reason.'],
      ar: ['ممنوع تبعت أو تحوّل فلوس', ' لأي عضو تاني لأي سبب من الأسباب'] },
    { icon: Landmark, tint: 'navy' as const, danger: false,
      en: ['Do not share your bank account information,', ' credit card information, or financial account details.'],
      ar: ['ما تشاركش بيانات حسابك البنكي', ' أو بطاقات الائتمان أو أي تفاصيل خاصة بحساباتك المالية.'] },
    { icon: Clock, tint: 'navy' as const, danger: false,
      en: ['Take your time getting to know the other person.', ' Never feel pressured to take any step before you are comfortable.'],
      ar: ['خد وقتك في التعارف،', ' وما تحسش إنك مضطر تاخد أي خطوة قبل ما تكون مرتاح ومستعد ليها.'] },
  ]

  return (
    <div className="min-h-screen bg-parchment-50">
      <div className="mx-auto max-w-md pb-28">
        <FigmaHeader />
        <PageHeading
          title={t(`${name}, your Safety Comes First`, `${name}، سلامتك وأمانك يهمونا ❤️`)}
          subtitle={t(
            'Protect Your Privacy and Stay Safe During the Early Stages of Getting to Know Someone',
            g('حافظ على خصوصيتك وخليك حريص وإنت بتتعرف على شخص جديد في بداية التواصل.', 'حافظي على خصوصيتك وخليكي حريصة وإنتي بتتعرفي على شخص جديد في بداية التواصل.')
          )}
        />
        <div className="space-y-3 px-5">
          <FCard className="flex gap-3">
            <IconTile icon={TriangleAlert} tint="gold" size={34} />
            <p className="text-[11.5px] leading-relaxed text-ink-700">
              {t(
                'Your safety and privacy are important to us. Please use caution when communicating with anyone you meet through CANA, especially during the early stages of getting to know each other.',
                g('سلامتك وخصوصيتك من أهم أولوياتنا في CANA. بننصحك تكون حريص في التعامل مع أي شخص تتعرف عليه من خلال التطبيق، خصوصًا في المراحل الأولى من التعارف.', 'سلامتك وخصوصيتك من أهم أولوياتنا في CANA. بننصحك تكوني حريصة في التعامل مع أي شخص تتعرفي عليه من خلال التطبيق، خصوصًا في المراحل الأولى من التعارف.')
              )}
            </p>
          </FCard>

          <Eyebrow className="pt-3">{t('Essential Safety Rules', 'قواعد أساسية للحفاظ على سلامتك')}</Eyebrow>

          {rules.map((r) => (
            <FCard key={r.en[0]} tone={r.danger ? 'danger' : 'default'} className="flex gap-3">
              <IconTile icon={r.icon} tint={r.tint} size={34} />
              <p className="text-[11.5px] leading-relaxed text-ink-500">
                <b className={r.danger ? 'text-danger-700' : 'text-ink-900'}>{t(r.en[0], r.ar[0])}</b>
                {t(r.en[1], r.ar[1])}
              </p>
            </FCard>
          ))}

          <div className="pt-1">
            <CheckRow checked={agreed} onChange={setAgreed}>
              {t("I agree to uphold CANA's community safety principles and report suspicious behavior.", 'أوافق على الالتزام بقواعد CANA للحفاظ على أمان جميع الأعضاء، وهبلغ عن أي تصرف مريب أو غير مناسب.')}
            </CheckRow>
          </div>
          <Button
            variant="gold"
            size="lg"
            className="!rounded-[12px] w-full"
            disabled={!agreed}
            onClick={() => {
              accept()
              navigate('/contact-policy')
            }}
          >
            {t("I've Read & Understood", 'قرأتُ وفهمتُ وأوافق.')}
          </Button>
        </div>
      </div>
      <BottomNav disabled />
    </div>
  )
}
