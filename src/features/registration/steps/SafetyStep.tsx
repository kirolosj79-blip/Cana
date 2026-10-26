import { useRef, useState } from 'react'
import { ShieldCheck, FileText, Lock } from 'lucide-react'
import { useRegistrationStore } from '@/store/registration.store'
import { Modal } from '@/shared/components/ui/Modal'
import { Button } from '@/shared/components/ui/Button'
import { PRIVACY_POLICY_SECTIONS } from '@/features/settings/data/privacyPolicy'
import { cn } from '@/shared/utils/cn'
import { useLanguage } from '@/core/hooks/useLanguage'

export function SafetyStep() {
  const { draft, updateSection } = useRegistrationStore()
  const agreed = draft.safetyDeclaration.agreedToTruthfulness ?? false
  const privacyAgreed = draft.safetyDeclaration.agreedToPrivacyPolicy ?? false
  const isFemale = draft.gender === 'female'
  const { t, language } = useLanguage()
  const isAr = language === 'ar'
  const [policyOpen, setPolicyOpen] = useState(false)
  const [reachedEnd, setReachedEnd] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const toggle = () => {
    if (!privacyAgreed) return // can't agree to the declaration before the privacy policy
    updateSection('safetyDeclaration', {
      agreedToTruthfulness: !agreed,
      agreedAt: !agreed ? new Date().toISOString() : undefined,
    })
  }

  const handlePolicyScroll = () => {
    const el = scrollRef.current
    if (!el) return
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 16) setReachedEnd(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-center py-4">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gold-100 text-gold-600">
          <ShieldCheck size={28} />
        </span>
      </div>

      {/* Privacy Policy comes first — reading it fully is required before
          the declaration below can even be agreed to. */}
      <div className={cn('rounded-[var(--radius-md)] border p-4', privacyAgreed ? 'border-success-500/40 bg-success-100' : 'border-ink-200 bg-parchment-0')}>
        <div className="flex items-center gap-2.5">
          <span className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-full', privacyAgreed ? 'bg-success-500/15 text-success-500' : 'bg-ink-100 text-ink-500')}>
            {privacyAgreed ? <ShieldCheck size={17} /> : <FileText size={17} />}
          </span>
          <div className="flex-1 min-w-0">
            <p className={cn('text-sm font-medium', privacyAgreed ? 'text-inkfixed-900' : 'text-ink-800')}>
              {privacyAgreed ? t('Privacy Policy — agreed', 'سياسة الخصوصية — تمت الموافقة') : t('Step 1: Read our Privacy Policy', 'الخطوة 1: اقرأ سياسة الخصوصية')}
            </p>
            {!privacyAgreed && (
              <p className="text-xs text-ink-400 mt-0.5">{t('Required before you can agree to the declaration below', 'مطلوبة قبل ما تقدر توافق على الإقرار اللي تحت')}</p>
            )}
          </div>
          <Button
            variant={privacyAgreed ? 'outline' : 'gold'}
            size="sm"
            onClick={() => setPolicyOpen(true)}
            className={privacyAgreed ? 'border-inkfixed-950/25 text-inkfixed-950 bg-transparent' : undefined}
          >
            {privacyAgreed ? t('Review', 'مراجعة') : t('Read', 'اقرأ')}
          </Button>
        </div>
      </div>

      <div className="rounded-[var(--radius-md)] border border-ink-200 bg-parchment-0 p-5">
        <p className="text-sm leading-relaxed text-ink-700 declaration-text">
          {t(
            '"I confirm that all information provided is accurate and truthful. I understand that this platform is intended only for individuals sincerely seeking Orthodox Christian marriage and that false information may result in account removal."',
            `"بأكد إن كل المعلومات اللي دخّلتها صحيحة وحقيقية. وفاهم${isFemale ? 'ة' : ''} إن المنصة دي مخصصة بس للي بجد بيدوروا على جواز أرثوذكسي، وإن أي معلومة غلط ممكن تؤدي لحذف الحساب."`
          )}
        </p>
      </div>
      <button
        type="button"
        onClick={toggle}
        disabled={!privacyAgreed}
        className={cn(
          'flex w-full items-center gap-3 rounded-[var(--radius-md)] border px-4 py-4 text-left transition-colors',
          agreed ? 'border-gold-400 bg-gold-50' : 'border-ink-200 bg-parchment-0',
          !privacyAgreed && 'opacity-50 cursor-not-allowed'
        )}
      >
        <span
          className={cn(
            'flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px] border',
            agreed ? 'border-gold-400 bg-gold-400' : 'border-ink-300'
          )}
        >
          {agreed ? <ShieldCheck size={12} className="text-inkfixed-950" /> : !privacyAgreed && <Lock size={10} className="text-ink-300" />}
        </span>
        <span className={cn('text-sm font-medium', agreed ? 'text-inkfixed-900' : 'text-ink-800')}>
          {t('I agree to this declaration', `موافق${isFemale ? 'ة' : ''} على الإقرار ده`)}
          {!privacyAgreed && <span className="block text-xs font-normal text-ink-400 mt-0.5">{t('Read the Privacy Policy first', 'اقرأ سياسة الخصوصية الأول')}</span>}
        </span>
      </button>

      <Modal
        open={policyOpen}
        onClose={() => setPolicyOpen(false)}
        title={t('Privacy Policy', 'سياسة الخصوصية')}
      >
        <div ref={scrollRef} onScroll={handlePolicyScroll} className="max-h-[50vh] overflow-y-auto space-y-4 pr-1" dir={isAr ? 'rtl' : 'ltr'}>
          {PRIVACY_POLICY_SECTIONS.map((section) => (
            <div key={section.headingEn} className="space-y-1.5">
              <h3 className="text-xs font-semibold text-ink-900">{isAr ? section.headingAr : section.headingEn}</h3>
              {(isAr ? section.bodyAr : section.bodyEn).map((p, i) => (
                <p key={i} className="text-[11px] text-ink-500 leading-relaxed">
                  {p}
                </p>
              ))}
            </div>
          ))}
          <p className="text-[11px] text-ink-400 italic pt-2 border-t border-ink-100">
            {t('— End of Privacy Policy —', '— نهاية سياسة الخصوصية —')}
          </p>
        </div>
        {!reachedEnd && !privacyAgreed && (
          <p className="text-xs text-ink-400 mt-3 text-center">{t('Scroll to the end to continue', 'انزل لآخر الصفحة عشان تكمل')}</p>
        )}
        <Button
          variant="gold"
          size="sm"
          className="w-full mt-3"
          disabled={!reachedEnd && !privacyAgreed}
          onClick={() => {
            updateSection('safetyDeclaration', { agreedToPrivacyPolicy: true })
            setPolicyOpen(false)
          }}
        >
          {t('I Agree', 'موافق')}
        </Button>
      </Modal>
    </div>
  )
}
