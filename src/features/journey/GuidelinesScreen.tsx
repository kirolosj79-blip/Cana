import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowRight, ArrowLeft, Clock, Sparkles, Hourglass, ShieldCheck, Church } from 'lucide-react'
import { TopBar } from '@/shared/components/layout/TopBar'
import { FCard, IconTile, CheckRow } from '@/shared/components/ui/figma'
import { Button } from '@/shared/components/ui/Button'
import { findCandidate } from '@/services/mock/candidates.mock'
import { useRegistrationStore } from '@/store/registration.store'
import { useJourneyStore } from '@/store/journey.store'
import { useLanguage } from '@/core/hooks/useLanguage'

/** Figma: "Before You Start Chatting" — three pillars, final thought, agree checkbox. */
export function GuidelinesScreen() {
  const { id = '' } = useParams()
  const { t, isRtl } = useLanguage()
  const navigate = useNavigate()
  const accept = useJourneyStore((s) => s.acceptGuidelines)
  const myName = useRegistrationStore((s) => s.draft.personal.firstName)
  const other = findCandidate(id)
  const [agreed, setAgreed] = useState(false)
  const Arrow = isRtl ? ArrowLeft : ArrowRight

  const Item = ({ n, title, body, dark }: { n: number; title: string; body: string; dark?: boolean }) => (
    <div className="flex gap-3">
      <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${dark ? 'bg-white/15 text-white' : 'bg-parchment-200 text-ink-800'}`}>{n}</span>
      <div>
        <p className={`text-sm font-bold ${dark ? 'text-white' : 'text-ink-900'}`}>{title}</p>
        <p className={`mt-0.5 text-[13px] leading-relaxed ${dark ? 'text-white/70' : 'text-ink-500'}`}>{body}</p>
      </div>
    </div>
  )

  return (
    <div>
      <TopBar showBack />
      <div className="space-y-4 px-5 pb-6 pt-2">
        <div className="text-center">
          <span className="inline-flex rounded-full bg-[#0C1D3A] px-3 py-1 text-[11px] font-bold text-white">
            {(myName || t('You', 'إنت'))} & {other?.personal.firstName}
          </span>
          <div>
            <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-[#0C1D3A] px-3 py-1 text-[10px] font-semibold text-white">
              <ShieldCheck size={11} /> {t('Mutual Introduction Confirmed', 'التعارف المتبادل اتأكد')}
            </span>
          </div>
          <h1 className="mt-4 font-display text-[28px] font-semibold leading-tight text-ink-900">{t('Before You Start Chatting', 'قبل ما تبدأ المحادثة')}</h1>
          <p className="mx-auto mt-2 max-w-xs text-[13px] leading-relaxed text-ink-500">
            {t(
              'You have both accepted this introduction. CANA provides a protected sanctuary to discern marriage in purity, reverence, and spiritual peace.',
              'إنتوا الاتنين وافقتوا على التعارف ده. CANA بيوفّر مساحة محمية لتمييز الجواز بنقاء ووقار وسلام روحي.'
            )}
          </p>
          <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-parchment-200 px-3 py-1 text-[11px] text-ink-600">
            <Clock size={11} /> {t('2 min read • Covenant & Code of Conduct', 'قراءة دقيقتين • العهد وآداب السلوك')}
          </span>
        </div>

        <FCard className="space-y-4">
          <div className="flex items-center gap-3">
            <IconTile icon={Sparkles} tint="gold" size={34} />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gold-700">{t('Pillar 01', 'الركن 01')}</p>
              <p className="font-display text-lg font-semibold text-ink-900">{t('Respect & Authenticity', 'الاحترام والأصالة')}</p>
            </div>
          </div>
          <Item n={1} title={t('Kindness & Purity', 'اللطف والنقاء')} body={t('Treat each other with kindness, dignity, and honor. Offensive, inappropriate, or sexually explicit content has zero place in this dialogue.', 'عامِلوا بعض بلطف وكرامة واحترام. أي محتوى مسيء أو غير لائق أو جنسي مالوش أي مكان في الحوار ده.')} />
          <Item n={2} title={t('Truth & Sincerity', 'الصدق والإخلاص')} body={t('Communicate truthfully and represent yourself accurately with genuine intention toward Holy Matrimony.', 'تواصل بصدق وقدّم نفسك بدقة بنية حقيقية نحو سرّ الزيجة المقدس.')} />
          <Item n={3} title={t('Zero Financial Inquiries', 'ممنوع أي طلبات مالية')} body={t('Never ask for, offer, or send money, financial support, gifts, or cryptocurrency. Requests result in immediate account revocation.', 'ممنوع تطلب أو تعرض أو تبعت فلوس أو دعم مالي أو هدايا أو عملات رقمية. أي طلب بيؤدي لإلغاء الحساب فورًا.')} />
        </FCard>

        <div className="rounded-[22px] bg-[#0C1D3A] p-4 text-white shadow-[var(--shadow-soft-sm)]">
          <span className="inline-flex rounded-md bg-gold-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gold-700">{t('Critical', 'مهم جدًا')}</span>
          <div className="mt-3 flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10"><ShieldCheck size={18} /></span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/60">{t('Pillar 02 • Protected Zone', 'الركن 02 • منطقة محمية')}</p>
              <p className="font-display text-lg font-semibold">{t('Privacy & Contact Safety', 'الخصوصية وأمان التواصل')}</p>
            </div>
          </div>
          <div className="mt-4 space-y-4">
            <Item dark n={4} title={t('Keep Handles & Numbers Private', 'خلّي الحسابات والأرقام خاصة')} body={t('Do not send personal phone numbers, emails, WhatsApp handles, or social media links inside the dialogue.', 'متبعتش أرقام تليفون شخصية أو إيميلات أو حسابات واتساب أو لينكات سوشيال ميديا داخل المحادثة.')} />
            <Item dark n={5} title={t('Automated Shield Active', 'درع الحماية التلقائي شغّال')} body={t('CANA automatically filters and masks contact handles to protect both of you from impersonation, pressure, or unverified contact.', 'CANA بيفلتر ويخفي بيانات التواصل تلقائيًا عشان يحميكم من الانتحال والضغط والتواصل غير الموثّق.')} />
            <Item dark n={6} title={t('Structured Mutual Exit', 'خروج منظّم ومتبادل')} body={t('When you are both prayerfully ready to connect outside CANA, select “Continue Outside CANA”. Once both confirm, contact info is securely shared and your introduction is completed.', 'لما تكونوا الاتنين جاهزين بصلاة تتواصلوا برّه CANA، اختاروا "كمّل برّه CANA". أول ما الاتنين يأكدوا، بيانات التواصل بتتشارك بأمان والتعارف بيكتمل.')} />
          </div>
        </div>

        <FCard className="space-y-4">
          <div className="flex items-center gap-3">
            <IconTile icon={Hourglass} tint="gold" size={34} />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gold-700">{t('Pillar 03', 'الركن 03')}</p>
              <p className="font-display text-lg font-semibold text-ink-900">{t('Discernment & Peace', 'التمييز والسلام')}</p>
            </div>
          </div>
          <Item n={7} title={t('Unhurried Pace', 'من غير استعجال')} body={t('There is no rush. Take time to prayerfully listen, share aspirations, and discover common ground without societal hurry.', 'مفيش استعجال. خد وقتك تسمع بصلاة وتشارك طموحاتك وتكتشف المشترك بعيد عن ضغط المجتمع.')} />
          <Item n={8} title={t('End Gracefully at Any Time', 'انهِ بلُطف في أي وقت')} body={t('If either of you discerns that values do not align, either party may close the introduction respectfully with a single tap. No justification required.', 'لو أي طرف حسّ إن القيم مش متوافقة، يقدر يقفل التعارف باحترام بضغطة واحدة. من غير ما يبرّر.')} />
          <Item n={9} title={t('Spiritual Sanctity & Privacy', 'قدسية روحية وخصوصية')} body={t('CANA does not monitor private dialogue to judge your courtship. Safeguards exist strictly to protect personal security and uphold holy conduct.', 'CANA مش بيراقب حوارك الخاص عشان يحكم على فترة التعارف. الضمانات موجودة بس لحماية الأمان الشخصي والحفاظ على السلوك المقدس.')} />
        </FCard>

        <FCard tone="warm" className="text-center">
          <Church size={16} className="mx-auto text-gold-700" />
          <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-gold-700">{t('A Final Thought', 'خاطرة أخيرة')}</p>
          <p className="mt-2 font-display text-lg italic leading-snug text-ink-900">
            {t('“May this introduction be a meaningful step toward the future God has prepared for you.”', '"ليكن هذا التعارف خطوة ذات معنى نحو المستقبل الذي أعدّه الله لك."')}
          </p>
          <p className="mt-2 text-xs text-ink-500">{t('Take your time, be genuine, and treat each other with reverence. What happens next is between the two of you and God.', 'خدوا وقتكم، كونوا حقيقيين، وعامِلوا بعض بوقار. اللي هيحصل بعد كده بينكم وبين ربنا.')}</p>
        </FCard>

        <CheckRow checked={agreed} onChange={setAgreed}>
          <b className="text-ink-900">{t('I have read and agree to follow these guidelines.', 'قرأت وأوافق ألتزم بالإرشادات دي.')}</b>
          <br />
          {t('By continuing, you commit to mutual kindness and honor CANA’s community safeguards.', 'بالمتابعة، إنت بتلتزم باللطف المتبادل وباحترام ضمانات مجتمع CANA.')}
        </CheckRow>
        <Button
          variant="gold"
          size="lg"
          className="w-full"
          disabled={!agreed}
          onClick={() => {
            accept(id)
            navigate(`/app/chat/${id}`, { replace: true })
          }}
        >
          {t('Start Chatting', 'ابدأ المحادثة')} <Arrow size={16} />
        </Button>
      </div>
    </div>
  )
}
