import { useState } from 'react'
import { emailDomainOptions } from '@/features/registration/data/emailDomains'
import { useLanguage } from '@/core/hooks/useLanguage'

interface EmailFieldProps {
  label?: string
  optional?: boolean
  value: string // full "local@domain" value
  onChange: (value: string) => void
  labelExtra?: React.ReactNode
}

/**
 * Splits an email into "local part" (free text) + "domain" (a dropdown of
 * known real domains) instead of one free-text field — this makes a typo'd
 * or fake domain (like "hjikjhjh.com") structurally impossible, rather
 * than relying on a regex that can't tell a real domain from a
 * syntactically-valid fake one. An "Other" option still lets someone type
 * a domain that isn't in the list, so no real email is ever blocked.
 */
export function EmailField({ label, optional, value, onChange, labelExtra }: EmailFieldProps) {
  const { t } = useLanguage()
  const atIndex = value.indexOf('@')
  const local = atIndex >= 0 ? value.slice(0, atIndex) : value
  const domain = atIndex >= 0 ? value.slice(atIndex + 1) : ''
  const isKnownDomain = domain === '' || emailDomainOptions.includes(domain)
  const [showOther, setShowOther] = useState(!isKnownDomain && domain !== '')

  const setLocal = (v: string) => onChange(domain ? `${v}@${domain}` : v)
  const setDomain = (v: string) => onChange(`${local}@${v}`)

  return (
    <div className="flex flex-col gap-1.5">
      {(label || optional) && (
        <div className="flex items-center justify-between">
          {label && <span className="text-sm font-bold on-photo-text">{label}</span>}
          <span className="flex items-center gap-2">
            {optional && <span className="text-xs font-normal field-hint">{t('Optional', 'اختياري')}</span>}
            {labelExtra}
          </span>
        </div>
      )}
      <div className="flex items-stretch gap-1.5" dir="ltr">
        <input
          type="text"
          value={local}
          onChange={(e) => setLocal(e.target.value.replace(/[^a-zA-Z0-9._%+-]/g, ''))}
          placeholder="name"
          className="h-12 flex-1 min-w-0 rounded-[var(--radius-md)] border border-ink-200 bg-parchment-0 px-3 text-[16px] text-ink-900 text-left focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-200"
        />
        <span className="flex items-center text-ink-400 text-sm shrink-0">@</span>
        <select
          value={showOther ? '__other__' : domain}
          onChange={(e) => {
            if (e.target.value === '__other__') {
              setShowOther(true)
              setDomain('')
            } else {
              setShowOther(false)
              setDomain(e.target.value)
            }
          }}
          className="h-12 flex-1 min-w-0 rounded-[var(--radius-md)] border border-ink-200 bg-parchment-0 px-2 text-[15px] text-ink-900 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-200"
        >
          <option value="">{t('Select', 'اختار')}</option>
          {emailDomainOptions.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
          <option value="__other__">{t('Other', 'أخرى')}</option>
        </select>
      </div>
      {showOther && (
        <input
          type="text"
          value={domain}
          onChange={(e) => setDomain(e.target.value.replace(/[^a-zA-Z0-9.-]/g, ''))}
          placeholder={t('yourdomain.com', 'الدومين بتاعك.com')}
          dir="ltr"
          className="h-12 w-full rounded-[var(--radius-md)] border border-ink-200 bg-parchment-0 px-3 text-[16px] text-ink-900 text-left focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-200"
        />
      )}
    </div>
  )
}
