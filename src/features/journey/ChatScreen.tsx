import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams, Navigate } from 'react-router-dom'
import { Paperclip, X as XIcon, ChevronLeft, ChevronRight, MoreVertical, User, Flag, Ban, Handshake, Hourglass, Send, ArrowRight, ArrowLeft, ShieldCheck, Plus } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { CenterDialog, SoftButton } from '@/shared/components/ui/figma'
import { findCandidate } from '@/services/mock/candidates.mock'
import { useJourneyStore } from '@/store/journey.store'
import { useRequestsStore } from '@/store/requests.store'
import { useToast } from '@/shared/components/feedback/Toast'
import { useLanguage } from '@/core/hooks/useLanguage'
import { cn } from '@/shared/utils/cn'

const REPLIES = [
  { en: 'Thank you for reaching out. May God bless this conversation.', ar: 'شكرًا إنك بدأت. ربنا يبارك الحوار ده.' },
  { en: 'I love serving in church. What does your week usually look like?', ar: 'بحب الخدمة في الكنيسة. أسبوعك بيبقى عامل إزاي؟' },
  { en: 'That sounds lovely. Family is very important to me too.', ar: 'ده جميل. العيلة مهمة عندي جدًا برضه.' },
  { en: 'I feel we share many of the same values.', ar: 'حاسس إن بيننا قيم كتير مشتركة.' },
]

const REASONS = [
  { k: 'inappropriate', en: 'Inappropriate content', ar: 'محتوى غير لائق' },
  { k: 'misleading', en: 'Misleading profile', ar: 'بروفايل مضلّل' },
  { k: 'safety', en: 'Safety concern', ar: 'مخاوف تخص السلامة' },
  { k: 'unsolicited', en: 'Unsolicited requests', ar: 'طلبات غير مرغوبة' },
]

/** Figma: chat with Sacred Milestone, overflow menu, Report / Block / Continue-outside dialogs. */
export function ChatScreen() {
  const { id = '' } = useParams()
  const { t, isRtl } = useLanguage()
  const navigate = useNavigate()
  const { show } = useToast()
  const other = findCandidate(id)
  const j = useJourneyStore()
  const { requests, respond } = useRequestsStore()
  const msgs = j.messages[id] ?? []
  const [text, setText] = useState('')
  const [menu, setMenu] = useState(false)
  const [dlg, setDlg] = useState<null | 'report' | 'block' | 'confirm' | 'safety' | 'partner' | 'ended' | 'takeTime'>(null)
  const [reason, setReason] = useState<string[]>([])
  const [note, setNote] = useState('')
  const [proof, setProof] = useState<File[]>([])
  const [agree, setAgree] = useState(true)
  const endRef = useRef<HTMLDivElement>(null)
  const partnerAsked = useRef(false)
  const Back = isRtl ? ChevronRight : ChevronLeft
  const Arrow = isRtl ? ArrowLeft : ArrowRight

  const req = requests.find((r) => r.status === 'accepted' && (r.fromUserId === id || r.toUserId === id))

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [msgs.length])

  // Partner reaches the milestone after a few exchanges (prototype simulation).
  const mine = msgs.filter((m) => m.from === 'me').length
  useEffect(() => {
    if (mine >= 4 && !partnerAsked.current && !j.readyOutside.includes(id)) {
      partnerAsked.current = true
      const timer = setTimeout(() => setDlg('partner'), 1600)
      return () => clearTimeout(timer)
    }
  }, [mine, id, j.readyOutside])

  if (!other || !req || j.blocked.includes(id)) return <Navigate to="/app/messages" replace />
  if (!j.guidelinesAcceptedFor.includes(id)) return <Navigate to={`/app/guidelines/${id}`} replace />

  const name = other.personal.firstName
  const waiting = j.readyOutside.includes(id)
  const notYet = () => {
    j.unmarkReadyOutside(id)
    setDlg('takeTime')
  }

  const send = () => {
    const v = text.trim()
    if (!v) return
    j.send(id, 'me', v)
    setText('')
    const reply = REPLIES[Math.min(mine, REPLIES.length - 1)]
    setTimeout(() => j.send(id, 'them', t(reply.en, reply.ar)), 1400)
  }

  const goOutside = () => {
    j.markReadyOutside(id)
    navigate(`/app/contact-share/${id}`)
  }

  const endIntro = () => {
    respond(req.id, 'cancelled')
    j.oweFeedback()
    navigate('/app/feedback')
  }

  const doBlock = () => {
    j.block(id)
    respond(req.id, 'cancelled')
    setDlg(null)
    navigate('/app/feedback')
  }

  return (
    <div className="flex min-h-[calc(100vh-6rem)] flex-col">
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-ink-100 bg-parchment-50/95 px-4 py-3 backdrop-blur">
        <button onClick={() => navigate('/app/messages')} className="text-ink-700" aria-label="Back"><Back size={20} /></button>
        <img src={other.personal.profilePhotoUrl} alt="" className="h-10 w-10 rounded-full bg-ink-100 object-cover" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-ink-900">{other.personal.displayName}</p>
          <p className="flex items-center gap-1 text-[11px] text-success-500"><span className="h-1.5 w-1.5 rounded-full bg-success-500" /> {t('Intentional Discernment', 'تمييز مقصود')}</p>
        </div>
        <div className="relative">
          <button onClick={() => setMenu((v) => !v)} className="rounded-full p-1.5 text-ink-600" aria-label="Menu"><MoreVertical size={18} /></button>
          {menu && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setMenu(false)} />
              <div className="absolute end-0 top-9 z-40 w-60 overflow-hidden rounded-2xl border border-ink-100 bg-parchment-0 shadow-[var(--shadow-soft-lg)]">
                {[
                  { icon: User, en: ['View Profile', 'Bio, Deaconate & Family Values'], ar: ['شوف البروفايل', 'النبذة والقيم العائلية'], fn: () => navigate(`/app/profile/${id}`), red: false },
                  { icon: Flag, en: ['Report Concern', 'Confidential pastoral review'], ar: ['بلّغ عن مشكلة', 'مراجعة رعوية سرّية'], fn: () => setDlg('report'), red: false },
                  { icon: Ban, en: ['Block & Conclude', 'End contact permanently'], ar: ['احظر وأنهِ', 'إنهاء التواصل نهائيًا'], fn: () => setDlg('block'), red: true },
                ].map((m) => (
                  <button key={m.en[0]} onClick={() => { setMenu(false); m.fn() }} className="flex w-full items-center gap-3 border-b border-ink-100 px-4 py-3 text-start last:border-0">
                    <span className={cn('flex h-8 w-8 items-center justify-center rounded-full', m.red ? 'bg-danger-100 text-danger-700' : 'bg-parchment-200 text-ink-700')}><m.icon size={14} /></span>
                    <span>
                      <span className={cn('block text-[13px] font-bold', m.red ? 'text-danger-700' : 'text-ink-900')}>{t(m.en[0], m.ar[0])}</span>
                      <span className="block text-[11px] text-ink-500">{t(m.en[1], m.ar[1])}</span>
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </header>

      {waiting && (
        <div className="space-y-2 border-b border-ink-100 bg-gold-50 px-4 py-3">
          <p className="flex items-center gap-2 text-xs font-semibold text-ink-900">
            <Hourglass size={14} className="text-gold-700" /> {t(`Waiting for ${name} to respond…`, `في انتظار رد ${name}…`)}
          </p>
          <p className="text-[11px] text-ink-500">{t('Prototype: choose how they respond', 'نسخة تجريبية: اختار رد الطرف التاني')}</p>
          <div className="grid grid-cols-3 gap-2">
            <button onClick={() => navigate(`/app/contact-share/${id}`)} className="rounded-lg bg-[#0C1D3A] py-2 text-[11px] font-semibold text-white">{t('Continue', 'موافق')}</button>
            <button onClick={notYet} className="rounded-lg bg-parchment-200 py-2 text-[11px] font-semibold text-ink-800">{t('Not Yet', 'مش دلوقتي')}</button>
            <button onClick={() => setDlg('ended')} className="rounded-lg bg-danger-100 py-2 text-[11px] font-semibold text-danger-700">{t('End', 'إنهاء')}</button>
          </div>
        </div>
      )}
      <div className={cn('flex items-center gap-2 border-b border-ink-100 bg-gold-50 px-4 py-2.5', waiting && 'hidden')}>
        <Handshake size={16} className="text-gold-700" />
        <div className="min-w-0 flex-1">
          <p className="text-[9px] font-bold uppercase tracking-wider text-gold-700">{t('Sacred Milestone', 'محطة مقدسة')}</p>
          <p className="truncate text-xs font-semibold text-ink-900">{t('Ready to continue outside CANA?', 'جاهزين تكمّلوا برّه CANA؟')}</p>
        </div>
        <button onClick={() => setDlg('confirm')} className="flex items-center gap-1 rounded-lg bg-[#0C1D3A] px-3 py-1.5 text-xs font-semibold text-white">
          {t('Proceed', 'تابع')} <Arrow size={11} />
        </button>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        <p className="text-center text-[11px] text-ink-400">{t('Today', 'النهارده')}</p>
        {msgs.length === 0 && (
          <div className="mx-auto max-w-[260px] rounded-2xl border border-dashed border-ink-200 p-4 text-center text-xs leading-relaxed text-ink-500">
            <ShieldCheck size={16} className="mx-auto mb-1 text-gold-700" />
            {t(`Say hello to ${name}. Be kind, take your time, and keep contact details private for now.`, `سلّم على ${name}. كون لطيف وخد وقتك وخلّي بيانات التواصل خاصة دلوقتي.`)}
          </div>
        )}
        {msgs.map((m) => (
          <div key={m.id} className={cn('flex', m.from === 'me' ? 'justify-end' : 'justify-start')}>
            <div className={cn('max-w-[78%] rounded-2xl px-4 py-3 text-[14px] leading-relaxed', m.from === 'me' ? 'rounded-ee-md bg-[#0C1D3A] text-white' : 'rounded-es-md border border-ink-100 bg-parchment-0 text-ink-800')}>
              {m.text}
              <p className={cn('mt-1 text-[10px]', m.from === 'me' ? 'text-white/60' : 'text-ink-400')}>{new Date(m.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div className="space-y-2 px-4 pb-3">
        <button onClick={() => setDlg('confirm')} className="flex w-full items-center gap-3 rounded-2xl bg-[#0C1D3A] px-4 py-3 text-start text-white">
          <span className="min-w-0 flex-1">
            <span className="block text-[10px] text-gold-300">♥ {t('Sacred Milestone', 'محطة مقدسة')}</span>
            <span className="block text-sm font-bold">{t('Ready to continue outside CANA?', 'جاهزين تكمّلوا برّه CANA؟')}</span>
          </span>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10"><Arrow size={14} /></span>
        </button>
        <div className="flex items-center gap-2 rounded-2xl border border-ink-100 bg-parchment-0 px-3 py-2 shadow-[var(--shadow-soft-sm)]">
          <Plus size={18} className="text-ink-400" />
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder={t('Write a respectful message…', 'اكتب رسالة محترمة…')}
            className="min-w-0 flex-1 bg-transparent text-ink-900 outline-none placeholder:text-ink-400"
            style={{ fontSize: 16 }}
          />
          <button onClick={send} aria-label="Send" className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0C1D3A] text-white">
            <Send size={15} className={isRtl ? '-scale-x-100' : ''} />
          </button>
        </div>
      </div>

      {/* Report a Concern */}
      <CenterDialog open={dlg === 'report'} onClose={() => setDlg(null)} icon={<ShieldCheck size={24} />} title={t('Report a Concern', 'بلّغ عن مشكلة')} pill={t('Confidential Pastoral Review', 'مراجعة رعوية سرّية')}
        actions={<>
          <Button variant="gold" size="lg" className="!rounded-[14px] w-full" disabled={reason.length === 0} onClick={() => { j.report(id, reason.join(','), note); setDlg(null); setReason([]); setNote(''); setProof([]); show(t('Report sent confidentially', 'البلاغ اتبعت بسرّية'), 'success') }}>{t('Submit Report', 'ابعت البلاغ')}</Button>
          <SoftButton onClick={() => setDlg(null)}>{t('Cancel', 'إلغاء')}</SoftButton>
        </>}>
        <p>{t('Help us keep CANA safe, respectful, and faithful to our values. Please select the reason for reporting this member.', 'ساعدنا نحافظ على CANA آمن ومحترم ومخلص لقيمنا. اختار سبب الإبلاغ عن العضو ده.')}</p>
        <div className="mt-3 flex items-start gap-2 rounded-xl bg-parchment-100 px-3 py-2.5 text-start text-xs">
          <ShieldCheck size={14} className="mt-0.5 shrink-0 text-ink-500" />
          <span>{t('Your report will be handled confidentially and reviewed by the CANA team.', 'بلاغك هيتعامل معاه بسرّية وهيتراجع من فريق CANA.')}</span>
        </div>
        <p className="mt-3 text-start text-[10px] font-bold uppercase tracking-wider text-gold-700">{t('Reason for report', 'سبب البلاغ')}</p>
        <div className="mt-2 flex flex-wrap gap-2 text-start">
          {REASONS.map((r) => {
            const on = reason.includes(r.k)
            return (
              <button key={r.k} onClick={() => setReason((x) => (on ? x.filter((i) => i !== r.k) : [...x, r.k]))}
                className={cn('rounded-lg border px-3 py-2 text-[11px] font-semibold', on ? 'border-[#0C1D3A] bg-parchment-200 text-ink-900' : 'border-ink-200 bg-parchment-0 text-ink-700')}>
                {t(r.en, r.ar)}
              </button>
            )
          })}
        </div>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder={t('Provide any additional context for our review team (optional)…', 'اكتب أي تفاصيل إضافية لفريق المراجعة (اختياري)…')}
          className="mt-3 w-full rounded-xl border border-ink-200 bg-parchment-0 p-3 text-ink-900 outline-none placeholder:text-ink-400" style={{ fontSize: 16 }} />
        <p className="mt-3 text-start text-[10px] font-bold uppercase tracking-wider text-gold-700">{t('Attach proof / screenshot (optional)', 'أرفق إثبات / لقطة شاشة (اختياري)')}</p>
        <div className="mt-2 space-y-2 text-start">
          {proof.map((f, i) => (
            <div key={i} className="flex items-center gap-2 rounded-xl border border-ink-100 bg-parchment-0 px-3 py-2 text-xs">
              <Paperclip size={13} className="text-ink-400" />
              <span className="min-w-0 flex-1 truncate font-semibold text-ink-900">{f.name}<span className="block text-[10px] font-normal text-success-500">✓ {t('Attached', 'مرفق')} • {(f.size / 1048576).toFixed(1)} MB</span></span>
              <button onClick={() => setProof((p) => p.filter((_, k) => k !== i))} aria-label="Remove"><XIcon size={13} className="text-ink-400" /></button>
            </div>
          ))}
          <label className="flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-dashed border-ink-200 px-3 py-2.5 text-xs text-ink-500">
            <Plus size={13} /> {proof.length ? t('Add another screenshot or chat log', 'أضف لقطة أو سجل محادثة تاني') : t('Add screenshot or chat log', 'أضف لقطة أو سجل محادثة')}
            <input type="file" accept="image/*,.txt,.pdf" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) setProof((p) => [...p, f]); e.target.value = '' }} />
          </label>
        </div>
      </CenterDialog>

      {/* Block This Member */}
      <CenterDialog open={dlg === 'block'} onClose={() => setDlg(null)} icon={<Ban size={24} className="text-danger-700" />} title={t('Block This Member', 'حظر العضو ده')} pill={t('Boundary Protection', 'حماية الحدود')}
        actions={<>
          <SoftButton tone="red" onClick={doBlock}>{t(`Block ${name}`, `احظر ${name}`)}</SoftButton>
          <SoftButton onClick={() => setDlg(null)}>{t('Cancel', 'إلغاء')}</SoftButton>
        </>}>
        <p>{t(`Are you sure you want to block ${name}? You will no longer be able to message each other or view each other’s profiles on CANA.`, `متأكد إنك عايز تحظر ${name}؟ مش هتقدروا تبعتوا رسايل لبعض ولا تشوفوا بروفايلات بعض على CANA.`)}</p>
        <div className="mt-3 flex items-start gap-2 rounded-xl bg-parchment-100 px-3 py-2.5 text-start text-xs">
          <ShieldCheck size={14} className="mt-0.5 shrink-0 text-ink-500" />
          <span>{t(`Blocking ${name} will end your current introduction and notify the CANA pastoral review team so they can address any privacy or safety concerns.`, `حظر ${name} هينهي تعارفك الحالي ويبلّغ الفريق الرعوي في CANA عشان يتعاملوا مع أي مخاوف خصوصية أو سلامة.`)}</span>
        </div>
      </CenterDialog>

      {/* Ready for the next step? (sender) */}
      <CenterDialog open={dlg === 'confirm'} onClose={() => setDlg(null)} icon={<Handshake size={24} />} title={t(`Ready for the next step?`, 'جاهز للخطوة الجاية؟')}
        actions={<>
          <Button variant="gold" size="lg" className="!rounded-[14px] w-full" onClick={() => setDlg('safety')}>{t('Yes, I agree', 'أيوه، أوافق')}</Button>
          <SoftButton onClick={() => setDlg(null)}>{t('Not Yet', 'مش دلوقتي')}</SoftButton>
        </>}>
        <div className="space-y-3 text-start">
          <p>{t(`You’re considering an important next step in getting to know ${name} by continuing your conversations outside CANA.`, `إنت بتفكر في خطوة مهمة للتعرف على ${name} بإنكم تكمّلوا محادثاتكم برّه CANA.`)}</p>
          <p>{t(`If you choose to proceed, we can send ${name} a request to see if they are also comfortable taking this step and exchanging contact information with you.`, `لو اخترت تكمّل، هنبعت لـ ${name} طلب نشوف لو هو كمان مرتاح للخطوة دي وتبادل بيانات التواصل معاك.`)}</p>
          <p>{t('Before continuing, please take a moment to read our Privacy Guidelines for Sharing Contact Information and make sure you feel comfortable with your decision.', 'قبل ما تكمّل، خد لحظة تقرا إرشادات الخصوصية لمشاركة بيانات التواصل وتتأكد إنك مرتاح لقرارك.')}</p>
          <p>{t('Remember, this step is entirely your choice. We encourage you to take your time, protect your personal information, and move forward at a pace that feels right for you.', 'افتكر إن الخطوة دي قرارك بالكامل. بنشجعك تاخد وقتك وتحمي بياناتك الشخصية وتتقدم بالسرعة اللي تريحك.')}</p>
          <p>{t(`Would you like us to send your request to ${name}?`, `تحب نبعت طلبك لـ ${name}؟`)}</p>
        </div>
      </CenterDialog>

      {/* Safety reminder */}
      <CenterDialog open={dlg === 'safety'} icon={<ShieldCheck size={24} />} title={t('Safety Reminder', 'تذكير بالسلامة')}
        actions={<Button variant="gold" size="lg" className="!rounded-[14px] w-full" disabled={!agree} onClick={() => {
          setDlg(null)
          j.markReadyOutside(id)
        }}>{t('I’ve Read & Understood', 'قرأت وفهمت')}</Button>}>
        <p>{t(`For your privacy and safety, please keep all communication within CANA until both you and ${name} agree to exchange contact information and continue communicating outside the platform.`, `لخصوصيتك وسلامتك، خلّي كل التواصل جوّه CANA لحد ما إنت و${name} توافقوا تتبادلوا بيانات التواصل وتكمّلوا برّه المنصة.`)}</p>
        <button onClick={() => setAgree((v) => !v)} className="mt-3 flex w-full items-center gap-2 rounded-xl border border-ink-100 px-3 py-2.5 text-start text-[11px] text-ink-600">
          <span className={cn('flex h-4 w-4 shrink-0 items-center justify-center rounded border', agree ? 'border-[#0C1D3A] bg-[#0C1D3A] text-white' : 'border-ink-300')}>{agree && '✓'}</span>
          {t('I agree to uphold CANA’s community safety principles and report suspicious behavior.', 'أوافق على الالتزام بمبادئ سلامة مجتمع CANA والإبلاغ عن أي سلوك مشبوه.')}
        </button>
      </CenterDialog>

      {/* If the other person said "Not Yet" — shown to the sender */}
      <CenterDialog open={dlg === 'takeTime'} icon={<Hourglass size={24} />} title={t(`It’s Okay to Take Your Time`, 'عادي تاخد وقتك')}
        actions={<>
          <Button variant="gold" size="lg" className="!rounded-[14px] w-full" onClick={() => { j.unmarkReadyOutside(id); setDlg(null) }}>{t('Back to chat', 'ارجع للمحادثة')}</Button>
          <SoftButton onClick={() => { j.unmarkReadyOutside(id); setDlg(null) }}>{t('Cancel', 'إلغاء')}</SoftButton>
        </>}>
        <div className="space-y-3 text-start">
          <p>{t(`${name} may not feel ready to exchange contact information just yet and might prefer to spend more time getting to know you through the chat window inside CANA.`, `${name} ممكن مايكونش جاهز يتبادل بيانات التواصل دلوقتي وممكن يفضّل يقضي وقت أكتر في التعرف عليك من خلال المحادثة جوّه CANA.`)}</p>
          <p>{t('Please don’t feel discouraged. Everyone has their own pace when building trust and getting to know someone. ♥', 'متتضايقش. كل واحد ليه إيقاعه في بناء الثقة والتعرف على حد. ♥')}</p>
          <p>{t(`You can continue chatting with ${name} inside CANA and give your connection more time to grow naturally. There’s no need to rush an important step like this.`, `تقدر تكمّل محادثتك مع ${name} جوّه CANA وتدي علاقتكم وقت أكتر تكبر بشكل طبيعي. مفيش داعي تستعجل خطوة مهمة زي دي.`)}</p>
          <p>{t('We wish you both the best as you continue getting to know each other!', 'بنتمنى لكم الاتنين كل خير وإنتم بتكمّلوا التعارف!')}</p>
        </div>
      </CenterDialog>

      {/* Other person ended the introduction */}
      <CenterDialog open={dlg === 'ended'} icon={<Ban size={24} />} title={t('Introduction ended', 'التعارف انتهى')}
        actions={<Button variant="gold" size="lg" className="!rounded-[14px] w-full" onClick={() => { setDlg(null); endIntro() }}>{t('Continue', 'كمّل')}</Button>}>
        <p>{t(`${name} has chosen to end this introduction. The chat is now closed. You can look for a new introduction after sharing a short feedback.`, `${name} اختار ينهي التعارف ده. المحادثة اتقفلت. تقدر تدوّر على تعارف جديد بعد ما تشاركنا ملاحظات سريعة.`)}</p>
      </CenterDialog>

      {/* What the recipient sees */}
      <CenterDialog open={dlg === 'partner'} icon={<Handshake size={24} />} title={t(`${name} wants to take the next step!`, `${name} عايز ياخد الخطوة الجاية!`)}
        actions={<>
          <Button variant="gold" size="lg" className="!rounded-[14px] w-full" onClick={goOutside}>{t('Yes, I agree', 'أيوه، أوافق')}</Button>
          <SoftButton onClick={() => setDlg(null)}>{t('Not Yet', 'مش دلوقتي')}</SoftButton>
        </>}>
        <div className="space-y-3 text-start">
          <p>{t(`${name} would like to continue getting to know you by communicating directly outside CANA. This would involve mutually agreeing to exchange contact information, such as phone numbers, email addresses, or social media accounts.`, `${name} عايز يكمّل التعارف معاك بالتواصل المباشر برّه CANA. ده معناه الاتفاق المتبادل على تبادل بيانات التواصل زي أرقام التليفون أو الإيميل أو حسابات السوشيال ميديا.`)}</p>
          <p>{t(`Before proceeding, please consider whether you feel comfortable taking this step and sharing your contact information with ${name}.`, `قبل ما تكمّل، فكّر لو إنت مرتاح للخطوة دي ولمشاركة بيانات التواصل بتاعتك مع ${name}.`)}</p>
          <p>{t('For your privacy and safety, we encourage you to read our Privacy Guidelines for Sharing Contact Information before making your decision.', 'لخصوصيتك وسلامتك، بنشجعك تقرا إرشادات الخصوصية لمشاركة بيانات التواصل قبل ما تقرر.')}</p>
          <p>{t('There is no pressure to proceed. The decision is entirely yours, and you should only share your information if you feel ready and comfortable doing so.', 'مفيش أي ضغط. القرار قرارك بالكامل، وماتشاركش بياناتك غير لو حاسس إنك جاهز ومرتاح.')}</p>
          <p>{t(`Are you ready to take this next step with ${name}?`, `جاهز تاخد الخطوة الجاية مع ${name}؟`)}</p>
        </div>
      </CenterDialog>
    </div>
  )
}
