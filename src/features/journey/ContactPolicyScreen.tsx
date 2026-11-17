import { BottomNav } from '@/shared/components/layout/BottomNav'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Handshake, TriangleAlert, LogOut, Lock, ShieldCheck, RotateCcw } from 'lucide-react'
import { FigmaHeader } from '@/shared/components/layout/FigmaHeader'
import { BoldHero, BoldNote, BoldPill, BoldRow, BoldCTA } from '@/shared/components/ui/bold'
import { Rich } from '@/shared/components/ui/figma'
import { useMe } from '@/core/hooks/useMe'
import { useJourneyStore } from '@/store/journey.store'

/** Figma: "Contact Exchange Policy". `readOnly` is used when opened later from Settings. */
export function ContactPolicyScreen() {
  const { t, g } = useMe()
  const navigate = useNavigate()
  const accept = useJourneyStore((s) => s.acceptContactPolicy)
  const [agreed, setAgreed] = useState(true)

  const terms = [
    { icon: LogOut, tint: 'navy' as const,
      en: ['CANA’s Role Ends Here', 'Once you and the other person agree to continue communicating outside CANA, the platform will no longer manage, monitor, or facilitate your conversations or interactions.'],
      ar: ['1. دور CANA بينتهي عند المرحلة دي', 'بمجرد ما تتفق إنت والطرف التاني على استكمال التواصل خارج تطبيق CANA، بيكون دور التطبيق انتهى. ومش هيكون مسؤول عن متابعة أو مراقبة أو إدارة أي محادثات أو تواصل بينكم بعد كده.'] },
    { icon: Lock, tint: 'red' as const,
      en: ['Both Profiles Will Be Temporarily Closed', "Once you exchange contact information, both your profile and the other person's profile will be temporarily closed. You will no longer be eligible for new introductions through CANA."],
      ar: ['2. هيتم إيقاف الملفين الشخصيين مؤقتًا', 'بمجرد تبادل بيانات التواصل، هيتم إيقاف ملفك الشخصي وملف الطرف التاني مؤقتًا، ومش هيكون متاح ليكم الحصول على ترشيحات جديدة من خلال CANA خلال الفترة دي.'] },
    { icon: ShieldCheck, tint: 'navy' as const,
      en: ['Future Communication Is Your Responsibility', 'After you move your communication outside CANA, all conversations, meetings, decisions, and any relationship that develops will be your responsibility and that of the other person. CANA will no longer manage or facilitate your communication.'],
      ar: ['3. التواصل بعد كده مسؤوليتكم', 'بعد ما تنتقلوا للتواصل خارج CANA، بتكون مسؤولية كل المحادثات والمقابلات والقرارات وأي علاقة ممكن تتطور بينكم مسؤوليتكم إنتوا الاتنين. ومش هيكون لـ CANA أي دور في إدارة أو متابعة أو تسهيل التواصل بينكم.'] },
    { icon: RotateCcw, tint: 'purple' as const,
      en: ['Returning to CANA', 'If you decide to return after your current introduction has ended, your previous profile will not be automatically restored. To reactivate your account, you must complete the **Previous Introduction Feedback** form and pay **50% of the standard registration fee.**'],
      ar: ['4. الرجوع لاستخدام CANA مرة تانية', 'لو قررت ترجع تستخدم CANA بعد انتهاء التعارف الحالي، ملفك الشخصي القديم مش هيتفعّل تلقائيًا. علشان تقدر تفعّل حسابك من جديد، لازم: **تملأ نموذج تقييم تجربة التعارف السابقة.** **تدفع 50% من رسوم التسجيل الأساسية.**'] },
  ]

  return (
    <div className="bp-page min-h-screen">
      <div className="mx-auto max-w-md pb-28">
        <FigmaHeader />
        <div className="space-y-3 px-4 pt-3">
          <BoldHero
            icon={Handshake}
            title={t('Contact Exchange Policy', 'سياسة تبادل بيانات التواصل')}
            subtitle={t('Protect Your Privacy and Stay Safe During the Early Stages of Getting to Know Someone', g('حافظ على خصوصيتك وخليك حريص في المراحل الأولى من التعارف.', 'حافظي على خصوصيتك وخليكي حريصة في المراحل الأولى من التعارف.'))}
          />
          <BoldNote icon={TriangleAlert}>
            {t(
              'Once you and your match decide to exchange personal contact information by sharing your phone number, email address, WhatsApp information, or any other personal contact information, you acknowledge and agree that:',
              g('لما تتفق إنت والشخص اللي تم ترشيحه ليك على تبادل بيانات التواصل الشخصية، زي رقم التليفون، البريد الإلكتروني، بيانات الواتساب، أو أي وسيلة تواصل شخصية تانية، فده معناه إنك موافق وفاهم الشروط التالية:', 'لما تتفقي إنتي والشخص اللي تم ترشيحه ليكي على تبادل بيانات التواصل الشخصية، زي رقم التليفون، البريد الإلكتروني، بيانات الواتساب، أو أي وسيلة تواصل شخصية تانية، فده معناه إنك موافقة وفاهمة الشروط التالية:')
            )}
          </BoldNote>

          <BoldPill>{t('Terms of Contact Exchange', 'شروط تبادل بيانات التواصل :')}</BoldPill>
          {terms.map((x) => (
            <BoldRow key={x.en[0]} icon={x.icon} danger={x.tint === 'red'}>
              <p className="bp-row-title text-[11px]">{t(x.en[0], x.ar[0])}</p>
              <p className="mt-1"><Rich>{t(x.en[1], x.ar[1])}</Rich></p>
            </BoldRow>
          ))}

          <BoldRow icon={ShieldCheck} checked={agreed} onToggle={setAgreed}>
            <b className="bp-row-title">{t("I agree to uphold CANA's community safety principles and report suspicious behavior.", 'أوافق على الالتزام بمبادئ CANA للحفاظ على أمان جميع الأعضاء، وأتعهد بالإبلاغ عن أي تصرف مريب أو غير مناسب.')}</b>
          </BoldRow>
          <BoldCTA
            disabled={!agreed}
            onClick={() => {
              accept()
              navigate('/app/home')
            }}
          >
            {t("I've Read & Understood", 'قرأتُ وفهمتُ وأوافق.')}
          </BoldCTA>
        </div>
      </div>
      <BottomNav disabled />
    </div>
  )
}
