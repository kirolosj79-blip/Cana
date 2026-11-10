import { BottomNav } from '@/shared/components/layout/BottomNav'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, TriangleAlert, LogOut, Lock, ShieldCheck, RotateCcw } from 'lucide-react'
import { FigmaHeader } from '@/shared/components/layout/FigmaHeader'
import { Button } from '@/shared/components/ui/Button'
import { FCard, IconTile, PageHeading, Eyebrow, CheckRow } from '@/shared/components/ui/figma'
import { useLanguage } from '@/core/hooks/useLanguage'
import { useJourneyStore } from '@/store/journey.store'

/** Figma: "Contact Exchange Policy". `readOnly` is used when opened later from Settings. */
export function ContactPolicyScreen() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const accept = useJourneyStore((s) => s.acceptContactPolicy)
  const [agreed, setAgreed] = useState(false)

  const terms = [
    { icon: LogOut, tint: 'navy' as const,
      en: ['‎CANA’s role ends at this point', 'Once communication moves outside the CANA application, CANA will no longer be responsible for, manage, monitor, or facilitate communication between you and the other person.'],
      ar: ['دور CANA بينتهي عند النقطة دي', 'أول ما التواصل ينتقل برّه تطبيق CANA، CANA مش هيبقى مسؤول عن التواصل بينك وبين الشخص التاني ولا هيديره ولا يراقبه ولا ييسّره.'] },
    { icon: Lock, tint: 'red' as const,
      en: ['Both profiles will be Temporary-closed', "Once contact information is exchanged, both your profile and the other person's profile will be temporarily closed. This means you will no longer be able to participate in CANA, and your account will become inactive."],
      ar: ['الملفين هيتقفلوا مؤقتًا', 'أول ما بيانات التواصل تتبادل، ملفك وملف الشخص التاني هيتقفلوا مؤقتًا. ده معناه إنك مش هتقدر تشارك في CANA، وحسابك هيبقى غير نشط.'] },
    { icon: ShieldCheck, tint: 'navy' as const,
      en: ['Your future communication is your responsibility', 'Any communication, meetings, decisions, or relationship that takes place after leaving CANA is solely between you and the other person.'],
      ar: ['تواصلك بعد كده مسؤوليتك', 'أي تواصل أو لقاءات أو قرارات أو علاقة بتحصل بعد ما تسيب CANA هي بينك وبين الشخص التاني بس.'] },
    { icon: RotateCcw, tint: 'purple' as const,
      en: ['Returning to CANA', 'If you decide to return to CANA after your previous introduction has ended, your previous profile will not be automatically reactivated or restored. You will need to reactivate your account by completing the "Previous Introduction Feedback", and paying 50% of the registration fees to reactivate your account.'],
      ar: ['الرجوع لـ CANA', 'لو قررت ترجع لـ CANA بعد ما التعارف السابق ينتهي، ملفك القديم مش هيتفعّل أو يرجع تلقائيًا. هتحتاج تفعّل حسابك بإنك تكمّل "تقييم التعارف السابق" وتدفع 50% من رسوم التسجيل.'] },
  ]

  return (
    <div className="min-h-screen bg-parchment-50">
      <div className="mx-auto max-w-md pb-28">
        <FigmaHeader />
        <PageHeading
          title={t('Contact Exchange Policy', 'سياسة تبادل بيانات التواصل')}
          subtitle={t('Protect Your Privacy and Stay Safe During the Early Stages of Getting to Know Someone', 'احمِ خصوصيتك وخلّيك آمن في أول مراحل التعارف')}
        />
        <div className="space-y-3 px-5">
          <FCard className="flex gap-3">
            <IconTile icon={TriangleAlert} tint="gold" size={34} />
            <p className="text-[13px] leading-relaxed text-ink-700">
              {t(
                'Once you and your match decide to exchange personal contact information by sharing your phone number, email address, WhatsApp information, or any other personal contact information, you acknowledge and agree that:',
                'أول ما إنت والشخص المرشّح ليك تقرروا تتبادلوا بيانات التواصل الشخصية بمشاركة رقم التليفون أو الإيميل أو بيانات الواتساب أو أي بيانات تواصل تانية، فإنت بتقرّ وتوافق على إن:'
              )}
            </p>
          </FCard>

          <Eyebrow className="pt-3">{t('Terms of Contact Exchange', 'شروط تبادل بيانات التواصل')}</Eyebrow>
          {terms.map((x) => (
            <FCard key={x.en[0]} className="flex gap-3">
              <IconTile icon={x.icon} tint={x.tint} size={34} />
              <div>
                <p className="text-sm font-bold text-ink-900">{t(x.en[0], x.ar[0])}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-ink-500">{t(x.en[1], x.ar[1])}</p>
              </div>
            </FCard>
          ))}

          <CheckRow checked={agreed} onChange={setAgreed}>
            {t("I agree to uphold CANA's community safety principles and report suspicious behavior.", 'أوافق ألتزم بمبادئ السلامة في مجتمع CANA وأبلّغ عن أي سلوك مريب.')}
          </CheckRow>
          <Button
            variant="gold"
            size="lg"
            className="!rounded-[14px] w-full"
            disabled={!agreed}
            onClick={() => {
              accept()
              navigate('/app/home')
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
