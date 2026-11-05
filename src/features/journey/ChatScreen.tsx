import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams, Navigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, MoreVertical, User, Flag, Ban, Handshake, Hourglass, Send, ArrowRight, ArrowLeft, ShieldCheck, Plus } from 'lucide-react'
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
  const [dlg, setDlg] = useState<null | 'report' | 'block' | 'confirm' | 'safety' | 'partner' | 'ended'>(null)
  const [reason, setReason] = useState<string[]>([])
  const [note, setNote] = useState('')
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
    j.send(id, 'them', t(`I'm not ready yet — let's keep getting to know each other first.`, 'لسه مش جاهز — خلينا نكمل نتعرف على بعض الأول.'))
    show(t(`${name} isn't ready yet. You're back in the chat.`, `${name} لسه مش جاهز. رجعت للمحادثة.`), 'info')
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

      {/* Report Concern */}
      <CenterDialog open={dlg === 'report'} onClose={() => setDlg(null)} icon={<ShieldCheck size={24} />} title={t('Report Concern', 'بلّغ عن مشكلة')} pill={t('Confidential Pastoral Review', 'مراجعة رعوية سرّية')}
        actions={<>
          <Button variant="gold" size="lg" className="!rounded-[14px] w-full" disabled={reason.length === 0} onClick={() => { j.report(id, reason.join(','), note); setDlg(null); setReason([]); setNote(''); show(t('Report sent confidentially', 'البلاغ اتبعت بسرّية'), 'success') }}>{t('Report', 'ابعت البلاغ')}</Button>
          <SoftButton onClick={() => setDlg(null)}>{t('Cancel', 'إلغاء')}</SoftButton>
        </>}>
        <p>{t('Help us keep CANA safe and honoring. Please select a reason for reporting this member.', 'ساعدنا نحافظ على CANA آمن ومُكرِم. اختار سبب الإبلاغ عن العضو ده.')}</p>
        <div className="mt-3 rounded-xl bg-parchment-100 px-3 py-2 text-start text-xs">
          <b className="text-ink-900">{t('Your report is confidential.', 'بلاغك سرّي.')}</b> {t('Moderators review concerns carefully.', 'المشرفين بيراجعوا الملاحظات بعناية.')}
        </div>
        <p className="mt-3 text-start text-[10px] font-bold uppercase tracking-wider text-ink-500">{t('Reason for report', 'سبب البلاغ')}</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {REASONS.map((r) => {
            const on = reason.includes(r.k)
            return (
              <button key={r.k} onClick={() => setReason((x) => (on ? x.filter((i) => i !== r.k) : [...x, r.k]))}
                className={cn('rounded-lg border px-2 py-2 text-[11px] font-semibold', on ? 'border-[#0C1D3A] bg-[#0C1D3A] text-white' : 'border-ink-200 bg-parchment-0 text-ink-700')}>
                {t(r.en, r.ar)}
              </button>
            )
          })}
        </div>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder={t('Provide any additional context for our review team (optional)…', 'اكتب أي تفاصيل إضافية لفريق المراجعة (اختياري)…')}
          className="mt-3 w-full rounded-xl border border-ink-200 bg-parchment-0 p-3 text-ink-900 outline-none placeholder:text-ink-400" style={{ fontSize: 16 }} />
      </CenterDialog>

      {/* Block */}
      <CenterDialog open={dlg === 'block'} onClose={() => setDlg(null)} icon={<Ban size={24} className="text-danger-700" />} title={t('Block User', 'حظر المستخدم')} pill={t('Boundary Protection', 'حماية الحدود')}
        actions={<>
          <SoftButton tone="red" onClick={doBlock}>{t('Block', 'احظر')}</SoftButton>
          <SoftButton onClick={() => setDlg(null)}>{t('Cancel', 'إلغاء')}</SoftButton>
        </>}>
        <p>{t('Are you sure you want to block this person? You will no longer be able to message each other or see each other’s profiles.', 'متأكد إنك عايز تحظر الشخص ده؟ مش هتقدروا تبعتوا رسايل لبعض ولا تشوفوا بروفايلات بعض تاني.')}</p>
        <div className="mt-3 rounded-xl bg-parchment-100 px-3 py-2 text-start text-xs">{t('This will immediately terminate the introduction and notify pastoral administrators for privacy protection.', 'ده هينهي التعارف فورًا ويبلّغ المسؤولين الرعويين لحماية الخصوصية.')}</div>
      </CenterDialog>

      {/* Continue outside CANA — confirm */}
      <CenterDialog open={dlg === 'confirm'} onClose={() => setDlg(null)} icon={<Handshake size={24} />} title={t('Are you ready to continue getting to know each other outside CANA?', 'جاهز تكمّلوا تتعرفوا على بعض برّه CANA؟')}
        actions={<>
          <Button variant="gold" size="lg" className="!rounded-[14px] w-full" onClick={() => setDlg('safety')}>{t('Yes, I’m ready to continue outside CANA', 'أيوه، جاهز أكمّل برّه CANA')}</Button>
          <SoftButton onClick={() => setDlg(null)}>{t('No', 'لأ')}</SoftButton>
        </>}>
        <p>{t('This means you may exchange contact information and continue your communication through WhatsApp, email, phone, or in person. CANA will no longer be part of your private communication once you leave the platform.', 'ده معناه إنك ممكن تتبادلوا بيانات التواصل وتكمّلوا عن طريق واتساب أو إيميل أو تليفون أو وجهًا لوجه. CANA مش هيبقى جزء من تواصلكم الخاص أول ما تسيبوا المنصة.')}</p>
      </CenterDialog>

      {/* Safety reminder */}
      <CenterDialog open={dlg === 'safety'} icon={<ShieldCheck size={24} />} title={t('Safety Reminder', 'تذكير بالسلامة')}
        actions={<Button variant="gold" size="lg" className="!rounded-[14px] w-full" onClick={() => {
          setDlg(null)
          j.markReadyOutside(id)
        }}>{t('I Understand & Agree', 'فهمت وأوافق')}</Button>}>
        <p>{t('For your privacy and safety, please keep communication within CANA until both of you agree to continue outside the platform.', 'لخصوصيتك وسلامتك، خلّي التواصل جوّه CANA لحد ما الاتنين توافقوا تكمّلوا برّه المنصة.')}</p>
      </CenterDialog>

      {/* Other person ended the introduction */}
      <CenterDialog open={dlg === 'ended'} icon={<Ban size={24} />} title={t('Introduction ended', 'التعارف انتهى')}
        actions={<Button variant="gold" size="lg" className="!rounded-[14px] w-full" onClick={() => { setDlg(null); endIntro() }}>{t('Continue', 'كمّل')}</Button>}>
        <p>{t(`${name} has chosen to end this introduction. The chat is now closed. You can look for a new introduction after sharing a short feedback.`, `${name} اختار ينهي التعارف ده. المحادثة اتقفلت. تقدر تدوّر على تعارف جديد بعد ما تشاركنا ملاحظات سريعة.`)}</p>
      </CenterDialog>

      {/* Partner is ready */}
      <CenterDialog open={dlg === 'partner'} icon={<Hourglass size={24} />} title={t('Take your time', 'خد وقتك')}
        actions={<>
          <Button variant="gold" size="lg" className="!rounded-[14px] w-full" onClick={goOutside}>{t('Continue Outside CANA', 'كمّل برّه CANA')}</Button>
          <SoftButton onClick={() => setDlg(null)}>{t('Not Yet', 'مش دلوقتي')}</SoftButton>
          <SoftButton tone="redText" onClick={endIntro}>{t('End This Introduction', 'أنهِ التعارف ده')}</SoftButton>
        </>}>
        <p>{t(`${name} has indicated that they are ready to continue getting to know you outside CANA. If you feel the same way, you can choose to exchange contact information and continue your communication outside CANA.`, `${name} أشار إنه جاهز يكمّل التعارف معاك برّه CANA. لو حاسس بنفس الشعور، تقدر تختار تتبادلوا بيانات التواصل وتكمّلوا برّه CANA.`)}</p>
      </CenterDialog>
    </div>
  )
}
