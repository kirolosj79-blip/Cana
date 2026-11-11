import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { MessageSquare, Phone, Mail, AtSign, Check, BadgeCheck, Lock, Hash } from 'lucide-react'
import { FigmaHeader } from '@/shared/components/layout/FigmaHeader'
import { Button } from '@/shared/components/ui/Button'
import { FCard, IconTile } from '@/shared/components/ui/figma'
import { findCandidate } from '@/services/mock/candidates.mock'
import { useAuthStore } from '@/store/auth.store'
import { useRegistrationStore } from '@/store/registration.store'
import { useJourneyStore } from '@/store/journey.store'
import { useMe } from '@/core/hooks/useMe'
import { cn } from '@/shared/utils/cn'

/** Figma: "Contact Exchange Policy — Select which details you would like to share with Michael". */
export function ContactShareScreen() {
  const { id = '' } = useParams()
  const { t, g } = useMe()
  const navigate = useNavigate()
  const other = findCandidate(id)
  const phone = useAuthStore((s) => s.user?.phone) ?? ''
  const email = useRegistrationStore((s) => s.draft.personal.email) || useAuthStore.getState().user?.email || ''
  const complete = useJourneyStore((s) => s.complete)
  const [sel, setSel] = useState({ whatsapp: true, call: true, email: true, extra: false })
  const [extra, setExtra] = useState('')
  const toggle = (k: keyof typeof sel) => setSel((s) => ({ ...s, [k]: !s[k] }))
  const anySelected = (sel.whatsapp && phone) || (sel.call && phone) || (sel.email && email) || (sel.extra && extra.trim())

  const Check_ = ({ on }: { on: boolean }) => (
    <span className={cn('flex h-6 w-6 items-center justify-center rounded-full', on ? 'bg-[#0C1D3A] text-white' : 'bg-parchment-200 text-transparent')}><Check size={13} /></span>
  )
  const Chip = ({ children, tone = 'gold' }: { children: React.ReactNode; tone?: 'gold' | 'green' }) => (
    <span className={cn('inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase', tone === 'green' ? 'bg-success-100 text-success-500' : 'bg-gold-100 text-gold-700')}>{children}</span>
  )

  return (
    <div className="pb-10">
      <FigmaHeader />
      <div className="space-y-3 px-5 pt-3">
        <h1 className="font-bold tracking-tight text-[26px] font-semibold text-ink-900">{t('Contact Exchange Policy', 'سياسة مشاركة بيانات التواصل')}</h1>
        <p className="text-sm text-ink-500">{t(`Select which details you would like to share with ${other?.personal.firstName ?? ''}.`, g(`اختار بيانات التواصل اللي حابب تشاركها مع ${other?.personal.firstName ?? ''}`, `اختاري بيانات التواصل اللي حابة تشاركيها مع ${other?.personal.firstName ?? ''}`))}</p>

        <FCard className="flex items-center gap-3 !p-3">
          <img src={other?.personal.profilePhotoUrl} alt="" className="h-10 w-10 rounded-full bg-ink-100 object-cover" />
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1 text-sm font-bold text-ink-900"><bdi>{other?.personal.firstName} {other?.personal.lastName?.[0]}.</bdi> <BadgeCheck size={13} className="text-gold-700" /></p>
            <p className="truncate text-[11px] text-ink-500">{other?.church.churchName}</p>
          </div>
          <Chip>{t('Simultaneous reveal', 'كشف متزامن')}</Chip>
        </FCard>

        <p className="pt-2 font-bold tracking-tight text-base font-semibold tracking-wide text-ink-700">{t('Communication Channels', 'قنوات التواصل')}</p>

        <button onClick={() => toggle('whatsapp')} className="w-full text-start">
          <FCard className={cn('space-y-3', sel.whatsapp && '!border-success-500/50')}>
            <div className="flex items-center gap-3">
              <IconTile icon={MessageSquare} tint="green" size={34} />
              <div className="flex-1">
                <p className="text-sm font-bold text-ink-900">WhatsApp <Chip tone="green">{t('Recommended', 'مُوصى به')}</Chip></p>
                <p className="text-[11px] text-ink-500">{t('Private courtship & voice notes', 'تعارف خاص ورسائل صوتية')}</p>
              </div>
              <Check_ on={sel.whatsapp} />
            </div>
            <div className="flex items-center justify-between rounded-xl bg-parchment-100 px-3 py-2 text-xs text-ink-700"><span dir="ltr">{phone || '—'}</span><Chip tone="green">{t('Verified', 'موثّق')}</Chip></div>
          </FCard>
        </button>

        <button onClick={() => toggle('call')} className="w-full text-start">
          <FCard className="space-y-3">
            <div className="flex items-center gap-3">
              <IconTile icon={Phone} tint="navy" size={34} />
              <div className="flex-1">
                <p className="text-sm font-bold text-ink-900">{t('Direct Phone Call', 'مكالمة تليفون مباشرة')}</p>
                <p className="text-[11px] text-ink-500">{t('Direct audio conversations', 'محادثات صوتية مباشرة')}</p>
              </div>
              <Check_ on={sel.call} />
            </div>
            <div className="flex items-center justify-between rounded-xl bg-parchment-100 px-3 py-2 text-xs text-ink-700"><span dir="ltr"><Hash size={11} className="me-1 inline" />{phone || '—'}</span><Chip>{t('Default line', 'الخط الأساسي')}</Chip></div>
          </FCard>
        </button>

        <button onClick={() => toggle('email')} className="w-full text-start">
          <FCard className="space-y-3">
            <div className="flex items-center gap-3">
              <IconTile icon={Mail} tint="navy" size={34} />
              <div className="flex-1">
                <p className="text-sm font-bold text-ink-900">{t('Email Address', 'البريد الإلكتروني')}</p>
                <p className="text-[11px] text-ink-500">{t('Letters, reflections & schedules', 'رسائل وتأملات ومواعيد')}</p>
              </div>
              <Check_ on={sel.email} />
            </div>
            <div className="flex items-center justify-between rounded-xl bg-parchment-100 px-3 py-2 text-xs text-ink-700"><span dir="ltr" className="truncate">{email || '—'}</span><Chip>{t('Primary', 'أساسي')}</Chip></div>
          </FCard>
        </button>

        <FCard className="space-y-3">
          <button onClick={() => toggle('extra')} className="flex w-full items-center gap-3 text-start">
            <IconTile icon={AtSign} tint="navy" size={34} />
            <div className="flex-1">
              <p className="text-sm font-bold text-ink-900">{t('Additional Channel', 'قناة إضافية')}</p>
              <p className="text-[11px] text-ink-500">{t('Instagram, Telegram, or meeting link', 'إنستجرام أو تيليجرام أو لينك اجتماع')}</p>
            </div>
            <Check_ on={sel.extra} />
          </button>
          {sel.extra && (
            <input value={extra} onChange={(e) => setExtra(e.target.value)} dir="ltr" placeholder="@username / link"
              className="w-full rounded-xl border border-ink-200 bg-parchment-0 px-3 py-2 text-ink-900 outline-none" style={{ fontSize: 16 }} />
          )}
        </FCard>

        <p className="flex items-center justify-center gap-1.5 pt-1 text-[11px] text-ink-500"><Lock size={11} /> {t(`Encrypted covenant • Only shared with ${other?.personal.firstName ?? ''}`, `عهد مشفّر • بيتشارك مع ${other?.personal.firstName ?? ''} بس`)}</p>
        <Button variant="gold" size="lg" className="!rounded-[14px] w-full" disabled={!anySelected} onClick={() => { complete(id); navigate(`/app/intro-complete/${id}`, { replace: true }) }}>
          {t('Share Contact Details', 'مشاركة بيانات التواصل')}
        </Button>
        <div className="flex justify-center gap-4 text-[11px] font-semibold text-gold-700">
          <button onClick={() => navigate('/app/settings/privacy-policy')}>{t('Privacy Covenant', 'اتفاقية الخصوصية')}</button>
          <button onClick={() => navigate(`/app/chat/${id}`)} className="text-ink-500">{t('Cancel', 'إلغاء')}</button>
        </div>
      </div>
    </div>
  )
}
