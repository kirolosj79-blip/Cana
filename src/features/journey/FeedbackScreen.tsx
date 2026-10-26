import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Lock, Check, ArrowRight, ArrowLeft, ShieldAlert } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { FCard } from '@/shared/components/ui/figma'
import { useJourneyStore } from '@/store/journey.store'
import { useToast } from '@/shared/components/feedback/Toast'
import { useLanguage } from '@/core/hooks/useLanguage'
import { cn } from '@/shared/utils/cn'

type Opt = { k: string; en: string; ar: string; other?: boolean }
interface Q { id: string; en: string; ar: string; layout: 'list' | 'grid' | 'tri'; opts: Opt[]; hintEn?: string; hintAr?: string; text?: boolean }

const YNU: Opt[] = [
  { k: 'no', en: 'No', ar: 'لأ' },
  { k: 'yes', en: 'Yes', ar: 'أيوه' },
  { k: 'unsure', en: "I'm not sure", ar: 'مش متأكد' },
]
const OTHER: Opt = { k: 'other', en: 'Other:', ar: 'غير ذلك:', other: true }

const PART1: Q[] = [
  { id: 'q1', layout: 'list', en: 'How did your previous introduction end?', ar: 'التعارف السابق انتهى إزاي؟', opts: [
    { k: 'both', en: 'We both agreed to end it.', ar: 'اتفقنا الاتنين ننهيه.' },
    { k: 'me', en: 'I decided to end it.', ar: 'أنا قررت أنهيه.' },
    { k: 'them', en: 'The other person decided to end it.', ar: 'الشخص التاني قرر ينهيه.' },
    { k: 'faded', en: 'We gradually stopped communicating.', ar: 'قلّ التواصل بينا تدريجيًا لحد ما وقف.' },
    { k: 'outside', en: 'We continued our relationship outside CANA, but it later ended.', ar: 'كمّلنا علاقتنا برّه CANA لكنها انتهت بعد كده.' },
    OTHER] },
  { id: 'q2', layout: 'grid', en: 'How long did you communicate with the other person?', ar: 'اتواصلت مع الشخص التاني قد إيه؟', opts: [
    { k: 'days', en: 'Less than a few days', ar: 'أقل من كام يوم' },
    { k: '2w', en: 'Less than 2 weeks', ar: 'أقل من أسبوعين' },
    { k: '2-4w', en: '2–4 weeks', ar: 'من 2 لـ 4 أسابيع' },
    { k: '1-3m', en: '1–3 months', ar: 'من شهر لـ 3 شهور' },
    { k: '3m+', en: 'More than 3 months', ar: 'أكتر من 3 شهور' }] },
  { id: 'q3', layout: 'list', en: 'What was the main reason the introduction did not continue?', ar: 'إيه السبب الرئيسي إن التعارف مكملش؟', opts: [
    { k: 'compat', en: 'We did not feel we were compatible.', ar: 'ماحسيناش إننا متوافقين.' },
    { k: 'marriage', en: 'Our expectations about marriage were different.', ar: 'توقعاتنا عن الجواز كانت مختلفة.' },
    { k: 'location', en: 'Differences in location or future living arrangements.', ar: 'اختلاف في المكان أو ترتيبات السكن مستقبلًا.' },
    { k: 'family', en: 'Differences in family expectations.', ar: 'اختلاف في توقعات العيلة.' },
    { k: 'faith', en: 'Differences in religious/church expectations.', ar: 'اختلاف في التوقعات الدينية/الكنسية.' },
    { k: 'edu', en: 'Differences in education or career plans.', ar: 'اختلاف في التعليم أو خطط الشغل.' },
    { k: 'connection', en: 'We did not feel a sufficient connection.', ar: 'ماحسيناش بارتباط كافي.' },
    { k: 'comm', en: 'Communication did not work well.', ar: 'التواصل ماكانش ماشي كويس.' },
    { k: 'info', en: 'We discovered information that changed our decision.', ar: 'اكتشفنا معلومات غيّرت قرارنا.' },
    OTHER] },
  { id: 'q4', layout: 'list', en: 'Was the decision to end the introduction mutual?', ar: 'قرار إنهاء التعارف كان متبادل؟', opts: [
    { k: 'yes', en: 'Yes, we both agreed.', ar: 'أيوه، اتفقنا الاتنين.' },
    { k: 'me', en: 'No, I wanted to continue.', ar: 'لأ، أنا كنت عايز أكمّل.' },
    { k: 'them', en: 'No, the other person wanted to continue.', ar: 'لأ، الشخص التاني كان عايز يكمّل.' },
    { k: 'unclear', en: 'We did not have a clear conversation about ending it.', ar: 'ماكانش بينا حوار واضح عن إنهائه.' },
    OTHER] },
  { id: 'q5', layout: 'list', en: 'Did anything concerning or inappropriate happen during the introduction?', ar: 'حصل أي حاجة مقلقة أو غير لائقة خلال التعارف؟', opts: [
    { k: 'no', en: 'No.', ar: 'لأ.' },
    { k: 'minor', en: 'Yes, but it was minor.', ar: 'أيوه، بس كانت بسيطة.' },
    { k: 'aware', en: 'Yes, and I believe CANA should be aware of it.', ar: 'أيوه، وأعتقد إن CANA لازم يعرف.' },
    { k: 'unsure', en: "I'm not sure.", ar: 'مش متأكد.' }] },
]
const PART2: Q[] = [
  { id: 'q6', layout: 'tri', en: 'Did the other person ever make you feel pressured, uncomfortable, threatened, or unsafe?', ar: 'الشخص التاني خلّاك تحس بضغط أو عدم ارتياح أو تهديد أو عدم أمان؟', opts: YNU },
  { id: 'q7', layout: 'tri', en: 'Did the other person ask you for money, financial assistance, passwords, personal documents, or other sensitive information?', ar: 'الشخص التاني طلب منك فلوس أو مساعدة مالية أو باسوردات أو مستندات شخصية أو معلومات حساسة؟', opts: YNU },
  { id: 'q8', layout: 'tri', en: 'Did the other person provide information that you later discovered was inaccurate or misleading?', ar: 'الشخص التاني قدّم معلومات اكتشفت بعدين إنها مش دقيقة أو مضلّلة؟', opts: YNU },
  { id: 'q9', layout: 'list', en: 'After communication moved outside CANA, did anything happen that you believe CANA should know about?', ar: 'بعد ما التواصل انتقل برّه CANA، حصل أي حاجة تعتقد إن CANA لازم يعرفها؟', opts: [
    { k: 'no', en: 'No.', ar: 'لأ.' },
    { k: 'yes', en: 'Yes.', ar: 'أيوه.' },
    { k: 'na', en: 'Not applicable — we never exchanged contact information.', ar: 'مش ينطبق — ما تبادلناش بيانات تواصل.' }] },
  { id: 'q10', layout: 'list', text: true, en: 'Is there anything else about your previous introduction that you would like CANA to know?', ar: 'في أي حاجة تانية عن التعارف السابق عايز CANA يعرفها؟', hintEn: 'Please share any additional information that may help us understand what happened.', hintAr: 'شاركنا أي معلومات إضافية ممكن تساعدنا نفهم اللي حصل.', opts: [] },
]

/** Figma: "Previous Introduction Feedback" — Part 1 (overview) and Part 2 (safety). */
export function FeedbackScreen() {
  const { t, isRtl } = useLanguage()
  const navigate = useNavigate()
  const { show } = useToast()
  const save = useJourneyStore((s) => s.saveFeedback)
  const [part, setPart] = useState<1 | 2>(1)
  const [a, setA] = useState<Record<string, string>>({})
  const [otherTxt, setOtherTxt] = useState<Record<string, string>>({})
  const Back = isRtl ? ChevronRight : ChevronLeft
  const Next = isRtl ? ArrowLeft : ArrowRight
  const qs = part === 1 ? PART1 : PART2
  const base = part === 1 ? 0 : 5

  const answered = (q: Q) => (q.text ? true : !!a[q.id] && (a[q.id] !== 'other' || !!otherTxt[q.id]?.trim()))
  const ok = qs.every(answered)

  const Radio = ({ on }: { on: boolean }) => (
    <span className={cn('flex h-4 w-4 shrink-0 items-center justify-center rounded-full border', on ? 'border-[#0C1D3A] bg-[#0C1D3A]' : 'border-ink-300')}>{on && <span className="h-1.5 w-1.5 rounded-full bg-white" />}</span>
  )

  const finish = () => {
    save({ ...a, ...Object.fromEntries(Object.entries(otherTxt).map(([k, v]) => [`${k}_other`, v])) })
    show(t('Thank you — your feedback was received.', 'شكرًا — وصلتنا ملاحظاتك.'), 'success')
    navigate('/app/home', { replace: true })
  }

  return (
    <div className="pb-10">
      <header className="flex items-center justify-between px-5 pt-4">
        <button onClick={() => (part === 2 ? setPart(1) : navigate(-1))} className="text-ink-700" aria-label="Back"><Back size={20} /></button>
        <p className="text-center font-display text-base tracking-[0.3em] text-ink-900">+ CANA</p>
        <span className="w-5" />
      </header>
      <div className="space-y-4 px-5 pt-4">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gold-700">
          <ShieldAlert size={11} /> {part === 1 ? t('Private feedback • Step 1 of 2', 'ملاحظات خاصة • خطوة 1 من 2') : t('Safety & Community Standards • Step 2 of 2', 'السلامة ومعايير المجتمع • خطوة 2 من 2')}
        </span>
        <h1 className="font-display text-[26px] font-semibold leading-tight text-ink-900">{t('Previous Introduction Feedback', 'ملاحظات عن التعارف السابق')}</h1>
        <p className="-mt-2 text-sm text-ink-500">{t('Help us cultivate thoughtful, grace-centered pairings.', 'ساعدنا نبني ترشيحات مدروسة ومبنية على النعمة.')}</p>
        <div>
          <div className="h-1.5 overflow-hidden rounded-full bg-parchment-200"><div className="h-full rounded-full bg-[#0C1D3A] transition-all" style={{ width: part === 1 ? '50%' : '100%' }} /></div>
          <p className="mt-1 text-end text-[11px] text-ink-500">{part === 1 ? t('Part 1 of 2: Overview & Experience — 50%', 'جزء 1 من 2: نظرة عامة وتجربة — 50%') : t('Step 2 of 2 (100%)', 'خطوة 2 من 2 (100%)')}</p>
        </div>

        <FCard tone="gold" className="flex gap-3 !p-3.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-100 text-gold-700"><Lock size={15} /></span>
          <p className="text-xs leading-relaxed text-ink-600">
            {part === 1
              ? t("Before we introduce you to someone new, we'd like to understand a little about your previous introduction. Your answers are confidential and will help us improve future matches and uphold community integrity.", 'قبل ما نقدّمك لحد جديد، عايزين نفهم حاجة بسيطة عن تعارفك السابق. إجاباتك سرّية وهتساعدنا نحسّن الترشيحات الجاية ونحافظ على نزاهة المجتمع.')
              : t('Your honest feedback protects the Covenant community. All sensitive reports are handled privately by our pastoral & care team.', 'ملاحظاتك الصادقة بتحمي مجتمع العهد. كل البلاغات الحساسة بيتعامل معاها فريقنا الرعوي بسرّية.')}
          </p>
        </FCard>

        {qs.map((q, i) => (
          <FCard key={q.id} className="!p-4">
            <p className="flex gap-2 text-sm font-bold leading-snug text-ink-900">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0C1D3A] text-[10px] text-white">{base + i + 1}</span>
              {t(q.en, q.ar)}
            </p>
            {q.hintEn && <p className="mt-1 ps-7 text-[11px] text-ink-500">{t(q.hintEn, q.hintAr ?? '')}</p>}
            {q.text ? (
              <textarea value={otherTxt[q.id] ?? ''} onChange={(e) => setOtherTxt((x) => ({ ...x, [q.id]: e.target.value }))} rows={4}
                placeholder={t('Your reflections or comments (optional)…', 'تأملاتك أو تعليقاتك (اختياري)…')}
                className="mt-3 w-full rounded-xl border border-ink-200 bg-parchment-100 p-3 text-ink-900 outline-none placeholder:text-ink-400" style={{ fontSize: 16 }} />
            ) : (
              <div className={cn('mt-3', q.layout === 'list' && 'space-y-2', q.layout === 'grid' && 'grid grid-cols-2 gap-2', q.layout === 'tri' && 'grid grid-cols-3 gap-2')}>
                {q.opts.map((o) => {
                  const on = a[q.id] === o.k
                  return (
                    <div key={o.k} className={cn(o.k === 'm3' && 'col-span-2')}>
                      <button onClick={() => setA((x) => ({ ...x, [q.id]: o.k }))}
                        className={cn('flex w-full items-center gap-2 rounded-xl border px-3 py-3 text-start text-[13px] transition-colors',
                          q.layout === 'tri' && 'flex-col gap-1.5 text-center',
                          on ? 'border-[#0C1D3A] bg-ink-50 font-semibold text-ink-900' : 'border-ink-100 bg-parchment-0 text-ink-700')}>
                        <Radio on={on} /> <span className={cn(o.other && 'font-semibold')}>{t(o.en, o.ar)}</span>
                      </button>
                      {o.other && on && (
                        <input value={otherTxt[q.id] ?? ''} onChange={(e) => setOtherTxt((x) => ({ ...x, [q.id]: e.target.value }))} placeholder={t('Please specify…', 'من فضلك حدّد…')}
                          className="mt-2 w-full rounded-xl border border-ink-200 bg-parchment-0 px-3 py-2.5 text-ink-900 outline-none placeholder:text-ink-400" style={{ fontSize: 16 }} />
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </FCard>
        ))}

        {part === 1 ? (
          <>
            <Button variant="gold" size="lg" className="w-full" disabled={!ok} onClick={() => { setPart(2); window.scrollTo(0, 0) }}>
              {t('Continue to Part 2', 'كمّل للجزء 2')} <Next size={15} />
            </Button>
            <p className="text-center text-[11px] text-ink-400">{t('Part 2 covers remaining safety verification & final notes', 'الجزء 2 بيغطي التحقق من السلامة والملاحظات الأخيرة')}</p>
          </>
        ) : (
          <>
            <Button variant="gold" size="lg" className="w-full" disabled={!ok} onClick={finish}>
              {t('Submit & Complete', 'ابعت وأنهِ')} <Check size={15} className="text-success-500" />
            </Button>
            <button onClick={() => { setPart(1); window.scrollTo(0, 0) }} className="mx-auto flex items-center gap-1 text-[11px] text-ink-500"><Back size={12} /> {t('Back to Part 1', 'ارجع للجزء 1')}</button>
          </>
        )}
      </div>
    </div>
  )
}
