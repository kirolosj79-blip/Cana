import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowRight, ArrowLeft, Clock, Sparkles, Hourglass, ShieldCheck, Church } from 'lucide-react'
import { FigmaHeader } from '@/shared/components/layout/FigmaHeader'
import { FCard, IconTile, CheckRow } from '@/shared/components/ui/figma'
import { Button } from '@/shared/components/ui/Button'
import { findCandidate } from '@/services/mock/candidates.mock'
import { useRegistrationStore } from '@/store/registration.store'
import { useJourneyStore } from '@/store/journey.store'
import { useMe } from '@/core/hooks/useMe'

/** Figma: "Before You Start Chatting" — three pillars, final thought, agree checkbox. */
export function GuidelinesScreen() {
  const { id = '' } = useParams()
  const { t, isRtl, g } = useMe()
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
        <p className={`text-[12px] font-bold ${dark ? 'text-white' : 'text-ink-900'}`}>{title}</p>
        <p className={`mt-0.5 text-[11.5px] leading-relaxed ${dark ? 'text-white/70' : 'text-ink-500'}`}>{body}</p>
      </div>
    </div>
  )

  return (
    <div>
      <FigmaHeader />
      <div className="space-y-4 px-5 pb-6 pt-2">
        <div className="text-center">
          <span className="inline-flex rounded-full bg-[#0C1D3A] px-3 py-1 text-[11px] font-bold text-white">
            {(myName || t('You', 'إنت'))} & {other?.personal.firstName}
          </span>
          <div>
            <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-[#0C1D3A] px-3 py-1 text-[10px] font-semibold text-white">
              <ShieldCheck size={11} /> {t('Mutual Introduction Confirmed', 'تم تأكيد الموافقة المتبادلة على التعارف')}
            </span>
          </div>
          <h1 className="mt-4 font-bold tracking-tight text-[28px] font-semibold leading-tight text-ink-900">{t('Before You Start Chatting', 'قبل ما تبدأوا المحادثة')}</h1>
          <p className="mx-auto mt-2 max-w-xs text-[11.5px] leading-relaxed text-ink-500">
            {t(
              'You have both accepted this introduction. CANA provides a protected sanctuary to discern marriage in purity, reverence, and spiritual peace.',
              'كلاكما وافق على بدء التعارف. CANA بتوفر لكم بيئة آمنة ومحترمة تساعدكم على التعارف بهدف الزواج، في إطار من الصدق والاحترام والراحة الروحية، وبما يتوافق مع المبادئ المسيحية.'
            )}
          </p>
          <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-parchment-200 px-3 py-1 text-[11px] text-ink-600">
            <Clock size={11} /> {t('2 min read • Covenant & Code of Conduct', 'مدة القراءة: دقيقتان • العهد وقواعد السلوك')}
          </span>
        </div>

        <FCard className="space-y-4">
          <div className="flex items-center gap-3">
            <IconTile icon={Sparkles} tint="gold" size={34} />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gold-700">{t('Pillar 01', 'الركيزة الأولى')}</p>
              <p className="font-bold tracking-tight text-lg font-semibold text-ink-900">{t('Respect & Authenticity', 'الاحترام والصدق في التعامل')}</p>
            </div>
          </div>
          <Item n={1} title={t('Kindness & Purity', 'الاحترام والالتزام بالأخلاق')} body={t('Treat each other with kindness, dignity, and honor. Offensive, inappropriate, or sexually explicit content has zero place in this dialogue.', 'لازم يكون التعامل بينكم قائم على اللطف والاحترام وحفظ كرامة كل طرف. ويُمنع تمامًا إرسال أو مشاركة أي محتوى مسيء أو غير لائق أو فيه إيحاءات أو محتوى جنسي صريح.')} />
          <Item n={2} title={t('Truth & Sincerity', 'الصدق والوضوح')} body={t('Communicate truthfully and represent yourself accurately with genuine intention toward Holy Matrimony.', 'لازم يكون التواصل بينكم مبني على الصراحة والصدق، وإن كل طرف يقدّم نفسه ومعلوماته بشكل حقيقي وواضح، مع وجود نية جادة وصادقة للزواج المقدس.')} />
          <Item n={3} title={t('Zero Financial Inquiries', 'ممنوع تمامًا طلب أو تبادل أي أموال')} body={t('Never ask for, offer, or send money, financial support, gifts, or cryptocurrency. Requests result in immediate account revocation.', 'ممنوع طلب أو عرض أو إرسال أي مبالغ مالية أو مساعدات مادية أو هدايا أو عملات رقمية بين الأعضاء، لأي سبب من الأسباب. أي مخالفة للقاعدة دي هتؤدي إلى إلغاء الحساب فورًا.')} />
        </FCard>

        <div className="rounded-[22px] bg-[#0C1D3A] p-4 text-white shadow-[var(--shadow-soft-sm)]">
          <span className="block w-full rounded-[6px] bg-[#F6DDB0] py-1 text-center text-[10px] font-bold uppercase tracking-wider text-[#6B4A0F]">{t('Critical', 'مهم جدًا')}</span>
          <div className="mt-3 flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10"><ShieldCheck size={18} /></span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/60">{t('Pillar 02 • Protected Zone', 'الركيزة الثانية')}</p>
              <p className="font-bold tracking-tight text-lg font-semibold">{t('Privacy & Contact Safety', 'بيئة آمنة وحماية الخصوصية')}</p>
            </div>
          </div>
          <div className="mt-4 space-y-4">
            <Item dark n={4} title={t('Keep Handles & Numbers Private', 'الاحتفاظ بأرقام وبيانات التواصل بشكل خاص')} body={t('Do not send personal phone numbers, emails, WhatsApp handles, or social media links inside the dialogue.', 'ممنوع مشاركة أرقام التليفونات الشخصية أو عناوين البريد الإلكتروني أو أسماء حسابات الواتساب أو روابط حسابات التواصل الاجتماعي داخل المحادثة.')} />
            <Item dark n={5} title={t('Automated Shield Active', 'نظام الحماية التلقائي مفعل')} body={t('CANA automatically filters and masks contact handles to protect both of you from impersonation, pressure, or unverified contact.', 'CANA بيستخدم نظام تلقائي لاكتشاف وإخفاء بيانات التواصل الشخصية داخل المحادثات، بهدف حماية الطرفين من انتحال الشخصية أو الضغط أو التواصل مع أشخاص لم يتم التحقق منهم.')} />
            <Item dark n={6} title={t('Structured Mutual Exit', 'الانتقال للتواصل خارج CANA بموافقة الطرفين')} body={t('When both are prayerfully ready to connect outside CANA, select “Continue Outside CANA”. This option appears after 14 days of chatting. Both must confirm before exchanging contact info. Once exchanged, the CANA introduction is complete, and accounts become temporarily inactive.', 'لما تكونوا الاتنين مستعدين، وبعد الصلاة وطلب إرشاد ربنا، للانتقال بالتواصل خارج CANA، تقدروا تختاروا خاصية: «استكمال التواصل خارج CANA». الاختيار ده بيظهر بعد مرور 14 يوم من بدء المحادثة. لازم الطرفين يوافقوا بشكل واضح قبل تبادل أي بيانات للتواصل الشخصي. وبمجرد تبادل بيانات التواصل، بتكون مرحلة التعارف من خلال CANA انتهت، وبيتم إيقاف الحسابين مؤقتًا، وبالتالي مش هتكون فيه ترشيحات جديدة خلال الفترة دي.')} />
          </div>
        </div>

        <FCard className="space-y-4">
          <div className="flex items-center gap-3">
            <IconTile icon={Hourglass} tint="gold" size={34} />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gold-700">{t('Pillar 03', 'الركيزة الثالثة')}</p>
              <p className="font-bold tracking-tight text-lg font-semibold text-ink-900">{t('Discernment & Peace', 'التروي والراحة الروحية')}</p>
            </div>
          </div>
          <Item n={7} title={t('Unhurried Pace', 'خُدوا وقتكم من غير استعجال')} body={t('There is no rush. Take time to prayerfully listen, share aspirations, and discover common ground without societal hurry.', 'مفيش أي داعي للاستعجال أو الإحساس بالضغط. خُدوا وقتكم في التعارف، والصلاة، ومشاركة طموحاتكم، واكتشاف القيم والأهداف المشتركة بينكم، من غير ما تتأثروا بأي ضغوط اجتماعية أو استعجال من الآخرين.')} />
          <Item n={8} title={t('End Gracefully at Any Time', 'من حق أي طرف إنه ينهي التعارف باحترام')} body={t('If either of you discerns that values do not align, either party may close the introduction respectfully with a single tap. No justification required.', 'لو أي طرف حس إن فيه اختلاف في القيم أو إن التعارف مش مناسب، فمن حقه إنه ينهي التعارف في أي وقت وبكل احترام، من خلال ضغطة واحدة. ومش مطلوب منه تقديم أي مبررات أو توضيحات لقراره.')} />
          <Item n={9} title={t('Spiritual Sanctity & Privacy', 'احترام قدسية العلاقة والخصوصية')} body={t('CANA does not monitor private dialogue to judge your courtship. Safeguards exist strictly to protect personal security and uphold holy conduct.', 'CANA مش بيراقب المحادثات الخاصة بينكم علشان يحكم على طبيعة علاقتكم أو طريقة تعارفكم. إجراءات الحماية الموجودة في التطبيق هدفها الأساسي هو الحفاظ على أمانكم الشخصي، وحماية خصوصيتكم، والتأكد من الالتزام بقواعد السلوك المسيحي.')} />
        </FCard>

        <FCard tone="warm" className="text-center">
          <Church size={16} className="mx-auto text-gold-700" />
          <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-gold-700">{t('A Final Thought', 'كلمة أخيرة')}</p>
          <p className="mt-2 font-normal text-lg italic leading-snug text-ink-900">
            {t('“May this introduction be a meaningful step toward the future God has prepared for you.”', '«بنصلي إن بداية التعارف دي تكون خطوة لها معنى في طريق المستقبل اللي ربنا محضّره ليكم.»')}
          </p>
          <p className="mt-2 text-[11px] text-ink-500">{t('Take your time, be genuine, and treat each other with reverence. What happens next is between the two of you and God.', 'خُدوا وقتكم، وكونوا صادقين مع بعض، وتعاملوا باحترام وتقدير متبادل. الخطوة الجاية في رحلتكم هي مسؤوليتكم أنتم الاتنين أمام ربنا.')}</p>
        </FCard>

        <CheckRow checked={agreed} onChange={setAgreed}>
          <b className="text-ink-900">{t('I have read and agree to follow these guidelines.', 'قرأت وفهمت، وأوافق على الالتزام بالقواعد والإرشادات دي.')}</b>
          <br />
          {t('By continuing, you commit to mutual kindness and honor CANA’s community safeguards.', g('باستمرارك في استخدام المحادثة، أنت بتتعهد بالتعامل مع الطرف الآخر بلطف واحترام متبادل، والالتزام بإجراءات وقواعد الأمان المعتمدة في مجتمع CANA.', 'باستمرارك في استخدام المحادثة، أنتِ بتتعهدي بالتعامل مع الطرف الآخر بلطف واحترام متبادل، والالتزام بإجراءات وقواعد الأمان المعتمدة في مجتمع CANA.'))}
        </CheckRow>
        <Button
          variant="gold"
          size="lg"
          className="!rounded-[12px] w-full"
          disabled={!agreed}
          onClick={() => {
            accept(id)
            navigate(`/app/chat/${id}`, { replace: true })
          }}
        >
          {t('Start Chatting', g('ابدأ المحادثة', 'ابدأي المحادثة'))} <Arrow size={16} />
        </Button>
      </div>
    </div>
  )
}
