import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, ChevronDown, Lock, Check, ArrowRight, ArrowLeft } from 'lucide-react'
import { FigmaHeader } from '@/shared/components/layout/FigmaHeader'
import { FCard } from '@/shared/components/ui/figma'
import { useJourneyStore } from '@/store/journey.store'
import { useToast } from '@/shared/components/feedback/Toast'
import { useLanguage } from '@/core/hooks/useLanguage'
import { cn } from '@/shared/utils/cn'

type Opt = { k: string; en: string; ar: string; other?: boolean }
interface Q { id: string; en: string; ar: string; layout: 'list' | 'select' | 'tri'; opts: Opt[]; hintEn?: string; hintAr?: string; text?: boolean }

const YNU: Opt[] = [
  { k: 'no', en: 'No', ar: 'لا.' },
  { k: 'yes', en: 'Yes', ar: 'أيوه.' },
  { k: 'unsure', en: "I'm not sure", ar: 'مش متأكد.' },
]

const PART1: Q[] = [
  { id: 'q1', layout: 'select', en: 'How did your previous introduction end?', ar: 'إزاي انتهت تجربة التعارف السابقة؟', opts: [
    { k: 'both', en: 'We both agreed to end it.', ar: 'اتفقنا إحنا الاتنين على إنهاء التعارف.' },
    { k: 'me', en: 'I decided to end it.', ar: 'أنا اللي قررت أنهي التعارف.' },
    { k: 'them', en: 'The other person decided to end it.', ar: 'الطرف التاني هو اللي قرر ينهي التعارف.' },
    { k: 'faded', en: 'We gradually stopped communicating.', ar: 'التواصل بيننا قلّ تدريجيًا لحد ما وقف تمامًا.' },
    { k: 'outside', en: 'We continued our relationship outside CANA, but it later ended.', ar: 'كمّلنا علاقتنا خارج تطبيق CANA، لكن العلاقة انتهت بعد كده.' },
    { k: 'other', en: 'Other: Please Specify', ar: 'سبب تاني: ياريت توضح...', other: true }] },
  { id: 'q2', layout: 'select', en: 'How long did you communicate with the other person?', ar: 'قد إيه استمر التواصل بينك وبين الطرف التاني؟', opts: [
    { k: 'days', en: 'Less than a few days', ar: 'أقل من كام يوم.' },
    { k: '2w', en: 'Less than 2 weeks', ar: 'أقل من أسبوعين.' },
    { k: '2-4w', en: '2–4 weeks', ar: 'من أسبوعين لـ 4 أسابيع.' },
    { k: '1-3m', en: '1–3 months', ar: 'من شهر لـ 3 شهور.' },
    { k: '3m+', en: 'More than 3 months', ar: 'أكتر من 3 شهور.' }] },
  { id: 'q3', layout: 'select', en: 'What was the main reason the introduction did not continue?', ar: 'إيه السبب الرئيسي اللي خلّى التعارف ما يكملش؟', opts: [
    { k: 'compat', en: 'We did not feel we were compatible.', ar: 'محسيناش إننا مناسبين لبعض.' },
    { k: 'marriage', en: 'Our expectations about marriage were different.', ar: 'كانت توقعاتنا بخصوص الجواز مختلفة.' },
    { k: 'location', en: 'Differences in location or future living arrangements.', ar: 'كان فيه اختلاف في مكان الإقامة أو ترتيبات السكن في المستقبل.' },
    { k: 'family', en: 'Differences in family expectations.', ar: 'كان فيه اختلاف في التوقعات المتعلقة بالعيلة.' },
    { k: 'faith', en: 'Differences in religious/church expectations.', ar: 'كان فيه اختلاف في التوقعات الدينية أو الأمور الخاصة بالكنيسة.' },
    { k: 'edu', en: 'Differences in education or career plans.', ar: 'كان فيه اختلاف في المستوى التعليمي أو الخطط المهنية والعملية.' },
    { k: 'connection', en: 'We did not feel a sufficient connection.', ar: 'محسيناش بوجود توافق أو ارتباط كافي بيننا.' },
    { k: 'comm', en: 'Communication did not work well.', ar: 'التواصل بيننا ماكانش بالشكل المناسب.' },
    { k: 'info', en: 'We discovered information that changed our decision.', ar: 'عرفنا معلومات جديدة أثّرت على قرارنا بالاستمرار.' },
    { k: 'other', en: 'Other: Please Specify', ar: 'سبب تاني:', other: true }] },
  { id: 'q4', layout: 'select', en: 'Was the decision to end the introduction mutual?', ar: 'هل قرار إنهاء التعارف كان بالاتفاق بين الطرفين؟', opts: [
    { k: 'yes', en: 'Yes, we both agreed', ar: 'أيوه، إحنا الاتنين اتفقنا على إنهاء التعارف.' },
    { k: 'me', en: 'No, I wanted to continue', ar: 'لا، أنا كنت حابب نكمّل التعارف.' },
    { k: 'them', en: 'No, the other person wanted to continue', ar: 'لا، الطرف التاني كان حابب يكمّل التعارف.' },
    { k: 'unclear', en: 'We did not have a clear conversation about ending it', ar: 'ماحصلش بيننا كلام واضح أو اتفاق صريح بخصوص إنهاء التعارف.' },
    { k: 'other', en: 'Other: Please Specify', ar: 'سبب تاني: ياريت توضح...', other: true }] },
  { id: 'q5', layout: 'list', en: 'Did anything concerning or inappropriate happen during the introduction?', ar: 'هل حصل أي موقف مقلق أو تصرّف غير مناسب أثناء فترة التعارف؟', opts: [
    { k: 'no', en: 'No.', ar: 'لا.' },
    { k: 'minor', en: 'Yes, but it was minor.', ar: 'أيوه، بس كانت بسيطة.' },
    { k: 'aware', en: 'Yes, and I believe CANA should be aware of it.', ar: 'أيوه، وأعتقد إن CANA لازم يعرف.' },
    { k: 'unsure', en: "I'm not sure.", ar: 'مش متأكد.' }] },
]
const PART2: Q[] = [
  { id: 'q6', layout: 'tri', en: 'Did the other person ever make you feel pressured, uncomfortable, threatened, or unsafe?', ar: 'هل حصل إن الطرف التاني ضغط عليك، أو خلاك تحس بعدم الراحة أو بالتهديد أو إنك مش في أمان؟', opts: YNU },
  { id: 'q7', layout: 'tri', en: 'Did the other person ask you for money, financial assistance, passwords, personal documents, or other sensitive information?', ar: 'هل طلب منك الطرف التاني فلوس، أو مساعدة مالية، أو كلمات مرور، أو مستندات شخصية، أو أي معلومات تانية خاصة وحساسة؟', opts: YNU },
  { id: 'q8', layout: 'tri', en: 'Did the other person provide information that you later discovered was inaccurate or misleading?', ar: 'هل قدّم الطرف التاني أي معلومات اكتشفت بعد كده إنها غير صحيحة أو مضللة؟', opts: YNU },
  { id: 'q9', layout: 'tri', en: 'After communication moved outside CANA, did anything happen that you believe CANA should know about?', ar: 'بعد ما التواصل بينكم انتقل خارج تطبيق CANA، هل حصل أي موقف شايف إنه من المهم إن CANA تكون على علم بيه؟', opts: [
    { k: 'no', en: 'No', ar: 'لا.' },
    { k: 'yes', en: 'Yes', ar: 'أيوه.' },
    { k: 'na', en: 'Not applicable — we never exchanged contact information.', ar: 'لا ينطبق – إحنا ما تبادلناش بيانات التواصل من الأساس.' }] },
  { id: 'q10', layout: 'list', text: true, en: 'Is there anything else about your previous introduction that you would like CANA to know?', ar: 'هل فيه أي حاجة تانية بخصوص تجربة التعارف السابقة حابب إن CANA تعرفها؟', hintEn: 'Please share any additional information that may help us understand what happened.', hintAr: 'ياريت تشاركنا أي تفاصيل أو معلومات إضافية ممكن تساعدنا نفهم اللي حصل بشكل أفضل.', opts: [] },
]

/** Figma: "Previous Introduction Feedback" — Part 1 (overview) and Part 2 (safety). */
export function FeedbackScreen() {
  const { t, isRtl } = useLanguage()
  const navigate = useNavigate()
  const { show } = useToast()
  const save = useJourneyStore((s) => s.saveFeedback)
  const [part, setPart] = useState<1 | 2>(1)
  const [openQ, setOpenQ] = useState<string | null>(null)
  const [a, setA] = useState<Record<string, string>>({})
  const [otherTxt, setOtherTxt] = useState<Record<string, string>>({})
  const Back = isRtl ? ChevronRight : ChevronLeft
  const Next = isRtl ? ArrowLeft : ArrowRight
  const qs = part === 1 ? PART1 : PART2

  const answered = (q: Q) => (q.text ? true : q.layout === 'select' ? (a[q.id] ?? q.opts[0].k) !== 'other' || !!otherTxt[q.id]?.trim() : !!a[q.id])
  const ok = qs.every(answered)

  const Radio = ({ on }: { on: boolean }) => (
    <span className={cn('flex h-4 w-4 shrink-0 items-center justify-center rounded-full border', on ? 'border-[#0C1D3A] bg-[#0C1D3A]' : 'border-ink-300')}>{on && <span className="h-1.5 w-1.5 rounded-full bg-white" />}</span>
  )

  const finish = () => {
    save({ ...Object.fromEntries(PART1.filter((q) => q.layout === 'select').map((q) => [q.id, q.opts[0].k])), ...a, ...Object.fromEntries(Object.entries(otherTxt).map(([k, v]) => [`${k}_other`, v])) })
    show(t('Thank you — your feedback was received.', 'شكرًا — وصلتنا ملاحظاتك.'), 'success')
    navigate('/app/home', { replace: true })
  }

  return (
    <div className="pb-10">
      <FigmaHeader />
      <div className="space-y-3 px-5 pt-4">
        <h1 className="text-[22px] font-bold leading-tight text-ink-900">{t('Previous Introduction Feedback', 'تقييم تجربة التعارف السابقة')}</h1>
        <p className="-mt-1 text-xs text-ink-500">{t('Help us cultivate thoughtful, grace-centered pairings.', 'ساعدنا في توفير فرص تعارف مناسبة، مبنية على الاحترام والمحبة والقيم المسيحية.')}</p>

        <FCard className="flex gap-3 !p-3.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gold-100 text-gold-700"><Lock size={14} /></span>
          <p className="text-[11px] leading-relaxed text-ink-600">
            {part === 1
              ? t("Before we introduce you to someone new, we'd like to understand a little about your previous introduction. Your answers are confidential and will help us improve future matches and uphold community integrity.", 'قبل ما نرشّح لك شخص جديد، حابين نفهم شوية تفاصيل عن تجربة التعارف السابقة. إجاباتك هتكون سرية، وهتساعدنا نحسّن الترشيحات المستقبلية، ونحافظ على الثقة والاحترام داخل مجتمع CANA.')
              : t('Your honest feedback protects the Covenant community. All sensitive reports are handled privately by our pastoral & care team.', 'ملاحظاتك الصريحة بتساعدنا نحافظ على أمان وثقة مجتمع CANA. بنأكد لك إن أي بلاغ أو معلومات حساسة بتشاركها معانا هتتعامل بسرية تامة، وهيتم مراجعتها من خلال فريق الرعاية والإشراف الروحي المسؤول عن متابعة الأعضاء.')}
          </p>
        </FCard>

        {qs.map((q) => (
          <FCard key={q.id} className="!p-4">
            <p className="text-[13px] font-bold leading-snug text-ink-900">{t(q.en, q.ar)}</p>
            {q.hintEn && <p className="mt-1 text-[11px] text-ink-500">{t(q.hintEn, q.hintAr ?? '')}</p>}
            {q.text ? (
              <textarea value={otherTxt[q.id] ?? ''} onChange={(e) => setOtherTxt((x) => ({ ...x, [q.id]: e.target.value }))} rows={4}
                placeholder={t('Your reflections or comments (optional)…', 'ملاحظاتك أو أي تفاصيل تحب تضيفها …..اختياري')}
                className="mt-3 w-full rounded-xl border border-ink-200 bg-parchment-100 p-3 text-ink-900 outline-none placeholder:text-ink-400" style={{ fontSize: 16 }} />
            ) : q.layout === 'select' ? (
              <div className="mt-3">
                <button onClick={() => setOpenQ(openQ === q.id ? null : q.id)} className="flex w-full items-center justify-between rounded-xl border border-ink-100 bg-parchment-100 px-3 py-3 text-start text-[13px] text-ink-800">
                  <span>{t(q.opts.find((o) => o.k === (a[q.id] ?? q.opts[0].k))!.en, q.opts.find((o) => o.k === (a[q.id] ?? q.opts[0].k))!.ar)}</span>
                  <ChevronDown size={15} className={cn('shrink-0 text-ink-500 transition-transform', openQ === q.id && 'rotate-180')} />
                </button>
                {openQ === q.id && (
                  <div className="mt-1 overflow-hidden rounded-xl border border-ink-100 bg-parchment-0 shadow-[var(--shadow-soft-sm)]">
                    {q.opts.map((o) => (
                      <button key={o.k} onClick={() => { setA((x) => ({ ...x, [q.id]: o.k })); setOpenQ(null) }}
                        className={cn('block w-full border-b border-ink-100 px-3 py-3 text-start text-[13px] last:border-0', (a[q.id] ?? q.opts[0].k) === o.k ? 'bg-parchment-100 font-semibold text-ink-900' : 'text-ink-700')}>
                        {t(o.en, o.ar)}
                      </button>
                    ))}
                  </div>
                )}
                {(a[q.id] ?? q.opts[0].k) === 'other' && (
                  <input value={otherTxt[q.id] ?? ''} onChange={(e) => setOtherTxt((x) => ({ ...x, [q.id]: e.target.value }))} placeholder={q.id === 'q3' ? t('Please specify…', 'ياريت توضح السبب...') : t('Please specify…', 'ياريت توضح...')}
                    className="mt-2 w-full rounded-xl border border-ink-200 bg-parchment-0 px-3 py-2.5 text-ink-900 outline-none placeholder:text-ink-400" style={{ fontSize: 16 }} />
                )}
              </div>
            ) : (
              <div className={cn('mt-3', q.layout === 'list' ? 'space-y-2' : 'space-y-2')}>
                {q.opts.map((o) => {
                  const on = a[q.id] === o.k
                  return (
                    <button key={o.k} onClick={() => setA((x) => ({ ...x, [q.id]: o.k }))}
                      className={cn('flex w-full items-center gap-2 rounded-xl border px-3 py-3 text-start text-[13px] transition-colors',
                        on ? 'border-[#0C1D3A] bg-ink-50 font-semibold text-ink-900' : 'border-ink-100 bg-parchment-0 text-ink-700')}>
                      {q.layout === 'list' && <Radio on={on} />} <span>{t(o.en, o.ar)}</span>
                    </button>
                  )
                })}
              </div>
            )}
          </FCard>
        ))}

        {part === 1 ? (
          <>
            <button disabled={!ok} className="flex w-full items-center justify-center gap-2 rounded-xl bg-cta-bg py-3.5 text-sm font-bold text-cta-text disabled:opacity-50" onClick={() => { setPart(2); window.scrollTo(0, 0) }}>
              {t('Continue to Part 2', 'متابعة إلى الجزء التاني')} <Next size={15} />
            </button>
            <p className="text-center text-[11px] text-ink-400">{t('Part 2 covers remaining safety verification & final notes', 'الجزء التاني بيشمل استكمال مراجعة إجراءات الأمان والتحقق، بالإضافة إلى أي ملاحظات أخيرة.')}</p>
          </>
        ) : (
          <>
            <button disabled={!ok} className="flex w-full items-center justify-center gap-2 rounded-xl bg-cta-bg py-3.5 text-sm font-bold text-cta-text disabled:opacity-50" onClick={finish}>
              {t('Submit & Complete', 'إرسال التقييم وإنهاء الخطوات')} <Check size={15} />
            </button>
            <button onClick={() => { setPart(1); window.scrollTo(0, 0) }} className="mx-auto flex items-center gap-1 text-[11px] text-ink-500"><Back size={12} /> {t('Back to Part 1', 'الرجوع للجزء الأول')}</button>
          </>
        )}
      </div>
    </div>
  )
}
