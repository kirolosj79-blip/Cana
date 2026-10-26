/**
 * Phone number rules per country — used everywhere a phone field appears
 * (login, spiritual father's number, etc.) so the same country automatically
 * shows the right dialing code and the same length/prefix rule is enforced
 * consistently, instead of every field re-implementing it slightly
 * differently.
 */
export interface PhoneRule {
  code: string
  digits: number
  /** Required leading digits, if any (e.g. Egyptian mobiles always start with 01). */
  startsWith?: string
}

export const PHONE_RULES: Record<string, PhoneRule> = {
  egypt: { code: '+20', digits: 11, startsWith: '01' },
  usa: { code: '+1', digits: 10 },
  canada: { code: '+1', digits: 10 },
}

/** Dialing code for a given country, or '' if unknown/"other" — used to
 *  auto-fill the prefix once the member has picked their country. */
export function countryDialCode(country: string | undefined): string {
  return (country && PHONE_RULES[country]?.code) || ''
}

export function isValidPhoneForCountry(country: string | undefined, rawDigits: string): boolean {
  const digits = rawDigits.replace(/\D/g, '')
  const rule = country ? PHONE_RULES[country] : undefined
  if (!rule) return digits.length >= 7 // "Other" / unknown country — just a sane minimum
  if (digits.length !== rule.digits) return false
  if (rule.startsWith && !digits.startsWith(rule.startsWith)) return false
  return true
}
