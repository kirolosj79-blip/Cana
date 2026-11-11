import { useNavigate } from 'react-router-dom'
import { MapPin, BookOpen, HeartHandshake, Hourglass, Heart, ShieldCheck } from 'lucide-react'
import { FigmaHeader } from '@/shared/components/layout/FigmaHeader'
import { FCard, IconTile } from '@/shared/components/ui/figma'
import { EmptyState } from '@/shared/components/feedback/StateScreens'
import { useRequestsStore } from '@/store/requests.store'
import { findCandidate } from '@/services/mock/candidates.mock'
import { useToast } from '@/shared/components/feedback/Toast'
import { useCelebration } from '@/shared/components/feedback/Celebration'
import { useMe } from '@/core/hooks/useMe'
import { useJourneyStore } from '@/store/journey.store'
import { verseOfDay } from '@/constants/verses'
import type { UserProfile } from '@/types/profile.types'

const NAVY_BTN = 'w-full rounded-xl bg-cta-bg py-3.5 text-sm font-bold text-cta-text'
const SOFT_BTN = 'w-full rounded-xl border border-ink-100 bg-parchment-0 py-3.5 text-sm font-bold text-ink-800'

function PersonCard({ c, onView, label }: { c: UserProfile; onView: () => void; label: string }) {
  const { t } = useMe()
  const age = new Date().getFullYear() - new Date(c.personal.dateOfBirth).getFullYear()
  return (
    <FCard className="flex items-center gap-3">
      <img src={c.personal.profilePhotoUrl} alt="" className="h-16 w-16 shrink-0 rounded-xl bg-ink-100 object-cover" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-ink-900">{c.personal.firstName}, {age}</p>
        <p className="mt-0.5 flex items-center gap-1 text-[11px] text-ink-500"><MapPin size={11} /> {c.personal.cityState}</p>
        <p className="text-[11px] text-ink-500">{t('Coptic Orthodox', 'قبطي أرثوذكسي')} · {c.employment.occupation}</p>
        <button onClick={onView} className="mt-1.5 text-[11px] font-bold text-ink-900 underline underline-offset-2">{label}</button>
      </div>
    </FCard>
  )
}

/**
 * Figma "If there are matches" board — one state at a time:
 * request sent · request received · accepted · declined.
 */
export function RequestsScreen() {
  const { respond, cancel, getCurrentState, getLastResolved } = useRequestsStore()
  const { show } = useToast()
  const guidelinesDone = useJourneyStore((s) => s.guidelinesAcceptedFor)
  const { celebrate } = useCelebration()
  const navigate = useNavigate()
  const { t, name, g } = useMe()
  const verse = verseOfDay(3)

  const current = getCurrentState()
  const lastResolved = !current ? getLastResolved() : null
  const row = current ?? lastResolved
  const otherId = row ? (row.fromUserId === 'me' ? row.toUserId : row.fromUserId) : null
  const c = otherId ? findCandidate(otherId) : null
  const first = c?.personal.firstName ?? ''
  /** Arabic gender helper for the OTHER person: o(masculine, feminine). */
  const o = (m: string, f: string) => (c?.personal.gender === 'female' ? f : m)
  const greet = t(`Good evening, ${name}`, `مساء الخير يا ${name} ${g('🌙', '🌷')}`)
  const viewProfile = () => c && navigate(`/app/profile/${c.id}`)

  const Banner = (
    <div className="flex items-start gap-3 rounded-2xl bg-[#0C1D3A] px-4 py-3 text-white">
      <BookOpen size={16} className="mt-0.5 shrink-0 text-gold-300" />
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-white/80">{t(verse.refEn, verse.refAr)}</p>
        <p className="mt-0.5 text-[13px] italic">{t(verse.en, `«${verse.ar}»`)}</p>
      </div>
    </div>
  )

  const Shell = ({ children }: { children: React.ReactNode }) => (
    <div>
      <FigmaHeader />
      <div className="space-y-4 px-5 pb-8 pt-2">
        {Banner}
        <p className="text-xs text-ink-500">{greet}</p>
        {children}
      </div>
    </div>
  )

  // Nothing yet
  if (!row || !c) {
    return (
      <Shell>
        <EmptyState
          icon={<HeartHandshake size={24} />}
          title={t('No requests right now', 'مفيش طلبات دلوقتي')}
          description={t('Send an introduction request from any profile to get started.', 'ابعت طلب تعارف من أي بروفايل عشان تبدأ.')}
        />
      </Shell>
    )
  }

  // Declined — "An Update on Your Introduction Request"
  if (!current && lastResolved?.status === 'rejected') {
    return (
      <Shell>
        <h1 className="text-[22px] font-bold leading-tight text-ink-900">{t('An Update on Your Introduction Request', 'تحديث بخصوص طلب التعارف')}</h1>
        <p className="text-[13px] leading-relaxed text-ink-600">
          {t(
            `${first} has decided not to continue with the introduction request at this time.`,
            `${first} ${o('قرر إنه مش هيكمل', 'قررت إنها مش هتكمل')} في طلب التعارف في الوقت الحالي.`
          )}
        </p>
        <p className="text-[13px] leading-relaxed text-ink-600">
          {t(
            'We understand this news may be disappointing, but please do not lose hope. Sometimes finding the right person takes a little time, and everything has its right time. ❤️',
            g('إحنا متفهمين إن الخبر ده ممكن يكون محبط بالنسبة لك، لكن من فضلك ما تفقدش الأمل. ❤️ أحيانًا الوصول للشخص المناسب بيحتاج شوية وقت، وكل حاجة ليها وقتها المناسب.', 'إحنا متفهمين إن الخبر ده ممكن يكون محبط بالنسبة لك، لكن من فضلك ما تفقديش الأمل. ❤️ أحيانًا الوصول للشخص المناسب بيحتاج شوية وقت، وكل حاجة ليها وقتها المناسب.')
          )}
        </p>
        <FCard tone="warm">
          <p className="flex items-center gap-2 text-sm font-bold text-ink-900"><ShieldCheck size={15} /> {t('Our Commitment To You', 'التزام CANA تجاهك')}</p>
          <p className="mt-1.5 text-xs leading-relaxed text-ink-600">
            {t(
              'CANA will continue helping you find someone who shares your values and principles and is looking for a serious relationship with Christ as its foundation.',
              'CANA هتفضل تساعدك في البحث عن شخص يشاركك نفس القيم والمبادئ، ويكون بيدور على علاقة جادة يكون المسيح هو أساسها.'
            )}
          </p>
        </FCard>
        <p className="text-xs italic text-ink-500">{t('Your journey is still ongoing, and the right introduction may be closer than you think.', 'رحلتك لسه مستمرة، وممكن يكون الترشيح المناسب ليك أقرب مما تتخيل.')}</p>
        <button onClick={() => navigate('/app/home')} className={NAVY_BTN}>{t('Continue Your Journey', 'كمّل رحلتك مع CANA')}</button>
      </Shell>
    )
  }

  // Cancelled / expired — brief notice then free again
  if (!current) {
    return (
      <Shell>
        <EmptyState
          icon={<HeartHandshake size={24} />}
          title={t("You're free to send a new request", 'تقدر تبعت طلب جديد')}
          description={t('Go back to Home to see your introductions.', 'ارجع للرئيسية عشان تشوف ترشيحاتك.')}
        />
        <button onClick={() => navigate('/app/home')} className={NAVY_BTN}>{t('Continue Your Journey', 'كمّل رحلتك مع CANA')}</button>
      </Shell>
    )
  }

  // Accepted — "Great News!"
  if (current.status === 'accepted') {
    return (
      <Shell>
        <h1 className="text-[22px] font-bold leading-tight text-ink-900">{t('Great News! Your Introduction Request Was Accepted ❤️', 'خبر جميل! تم قبول طلب التعارف! ❤️')}</h1>
        <p className="text-[13px] leading-relaxed text-ink-600">
          {t(
            `${first} accepted the introduction request you sent! This is a lovely first step to start getting to know each other through CANA. We wish you a good start and a beautiful journey as you take the next step in the search for the right life partner.`,
            `${first} ${o('وافق', 'وافقت')} على طلب التعارف اللي اتبعت ${o('له', 'لها')}! دي خطوة أولى جميلة علشان تبدأوا تتعرفوا على بعض من خلال CANA. بنتمنالكم بداية موفقة ورحلة جميلة، وإنتوا بتاخدوا الخطوة الجاية في طريق البحث عن شريك الحياة المناسب.`
          )}
        </p>
        <PersonCard c={c} onView={viewProfile} label={t(`View ${first}'s Profile`, `عرض الملف الشخصي لـ${first}`)} />
        <button onClick={() => navigate(guidelinesDone.includes(c.id) ? `/app/chat/${c.id}` : `/app/guidelines/${c.id}`)} className={NAVY_BTN}>
          {t(`Start Conversation with ${first}`, g(`ابدأ المحادثة مع ${first}`, `ابدئي المحادثة مع ${first}`))}
        </button>
        <button onClick={viewProfile} className={SOFT_BTN}>{t(`View ${first}'s Profile`, `عرض الملف الشخصي لـ${first}`)}</button>
      </Shell>
    )
  }

  // Received — "You Have a New Introduction Request!"
  if (current.status === 'pending' && current.toUserId === 'me') {
    return (
      <Shell>
        <h1 className="text-[22px] font-bold leading-tight text-ink-900">{t('You Have a New Introduction Request! 💌', 'عندك طلب تعارف جديد! 💌')}</h1>
        <p className="text-[13px] leading-relaxed text-ink-600">
          {t(
            `${first} sent you an introduction request through CANA and would like the chance to get to know you better. You can review the request and view the profile, then choose to accept the introduction or politely decline. ${first} will be notified once you decide. We wish you both the best on your journey to find the right life partner.`,
            `${first} ${o('بعت', 'بعتت')} لك طلب تعارف من خلال CANA، و${o('حابّ ياخد', 'حابة تاخد')} فرصة ${o('إنه يتعرف', 'إنها تتعرف')} عليك بشكل أفضل. تقدر تراجع ${o('طلبه وتشوف ملفه', 'طلبها وتشوف ملفها')} الشخصي، وبعدها تختار إما الموافقة على التعارف أو الاعتذار. ${first} ${o('هيوصله', 'هيوصلها')} إشعار بمجرد ما تاخد قرارك. بنتمنالكم كل التوفيق في رحلتكم للبحث عن شريك الحياة المناسب.`
          )}
        </p>
        <PersonCard c={c} onView={viewProfile} label={t(`View ${first}'s Profile`, `عرض الملف الشخصي لـ${first}`)} />
        <FCard tone="gold">
          <p className="flex items-center gap-2 text-sm font-bold text-ink-900"><Heart size={14} /> {t('Potential Marriage Match', 'ترشيح محتمل للزواج')}</p>
          <p className="mt-1 text-xs leading-relaxed text-ink-600">
            {t(
              `${first} viewed your information card and saw shared values and principles, and would like to start the introduction steps through CANA, within the principles and rules our community is built on.`,
              `${first} ${o('اطّلع', 'اطّلعت')} على بطاقة معلوماتك، و${o('شاف', 'شافت')} إن فيه قيم ومبادئ مشتركة بينكم، و${o('عنده', 'عندها')} رغبة تبدأوا خطوات التعارف من خلال CANA، وفي إطار المبادئ والقواعد اللي المجتمع قائم عليها.`
            )}
          </p>
        </FCard>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => { respond(current.id, 'rejected'); show(t('Request declined', 'تم الاعتذار عن التعارف'), 'info') }} className={SOFT_BTN}>{t('Politely Decline', 'الاعتذار عن التعارف')}</button>
          <button onClick={() => { respond(current.id, 'accepted'); celebrate('confetti') }} className={NAVY_BTN}>{t('Accept Introduction', 'الموافقة على التعارف')}</button>
        </div>
      </Shell>
    )
  }

  // Sent — "Your Introduction Request Has Been Sent!"
  return (
    <Shell>
      <h1 className="text-[22px] font-bold leading-tight text-ink-900">{t('Your Introduction Request Has Been Sent! 💌', 'تم إرسال طلب التعارف بنجاح! 💌')}</h1>
      <p className="text-[13px] leading-relaxed text-ink-600">
        {t(
          `Your introduction request to ${first} has been sent successfully! We'll notify you as soon as ${first} accepts or declines. Thank you for your trust in CANA, and we're glad you took this step with us.`,
          `طلب التعارف اللي ${g('بعتّه', 'بعتّيه')} ل${first} تم إرساله بنجاح! هنبعت لك إشعار أول ما ${first} ${o('يوافق أو يعتذر', 'توافق أو تعتذر')} عن قبول طلب التعارف. شكرًا لثقتك في CANA، وسعيدين إنك ${g('أخدت', 'أخدتي')} الخطوة دي معانا.`
        )}
      </p>
      <PersonCard c={c} onView={viewProfile} label={t(`View ${first}'s Profile`, `عرض الملف الشخصي لـ${first}`)} />
      <FCard>
        <p className="flex items-center gap-2 text-sm font-bold text-ink-900"><Hourglass size={14} /> {t('One Introduction at a Time', 'تعارف مع شخص واحد في كل مرة')}</p>
        <div className="mt-2 flex gap-2.5">
          <IconTile icon={Hourglass} tint="gold" size={28} />
          <div>
            <p className="text-xs font-bold text-ink-900">{t('The other 3 introductions are temporarily paused', 'تم إيقاف الـ 3 ترشيحات التانية مؤقتًا')}</p>
            <p className="mt-0.5 text-xs leading-relaxed text-ink-500">{t(`Until ${first} responds to your request, the other three introductions will remain paused.`, `لحد ما ${first} ${o('يرد', 'ترد')} على طلبك، الترشيحات التلاتة التانية هتكون متوقفة مؤقتًا.`)}</p>
          </div>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-ink-500">
          <b className="text-ink-900">{t(`If ${first} accepts:`, `لو ${first} ${o('وافق', 'وافقت')}:`)}</b> {t('you will be able to start a private and secure conversation through the app.', 'هتقدروا تبدأوا محادثة خاصة وآمنة من خلال التطبيق.')}
        </p>
        <p className="mt-1.5 text-xs leading-relaxed text-ink-500">
          <b className="text-ink-900">{t(`If ${first} declines:`, `لو ${first} ${o('اعتذر', 'اعتذرت')}:`)}</b> {t('the other three introductions will become available to you again immediately.', g('الترشيحات التلاتة التانية هترجع متاحة ليك فورًا.', 'الترشيحات التلاتة التانية هترجع متاحة ليكي فورًا.'))}
        </p>
      </FCard>
      <button onClick={() => { cancel(current.id); show(t('Request withdrawn', 'تم سحب طلب التعارف'), 'info') }} className={SOFT_BTN}>
        {t('Withdraw Introduction Request', 'سحب طلب التعارف')}
      </button>
      <div className="rounded-xl border border-dashed border-ink-200 p-3 text-center text-[11px] text-ink-400">
        <p>{t('Prototype: simulate the other person’s answer', 'نسخة تجريبية: محاكاة رد الطرف التاني')}</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <button onClick={() => { respond(current.id, 'accepted'); celebrate('confetti') }} className="rounded-lg bg-ink-100 py-2 font-semibold text-ink-800">{t('Accepted', 'وافق')}</button>
          <button onClick={() => respond(current.id, 'rejected')} className="rounded-lg bg-ink-100 py-2 font-semibold text-ink-800">{t('Declined', 'اعتذر')}</button>
        </div>
      </div>
    </Shell>
  )
}
