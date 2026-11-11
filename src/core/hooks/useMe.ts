import { useRegistrationStore } from '@/store/registration.store'
import { useLanguage } from '@/core/hooks/useLanguage'

/** The signed-in member: registered first name + gender-aware Arabic helper. */
export function useMe() {
  const { t, isRtl } = useLanguage()
  const draft = useRegistrationStore((s) => s.draft)
  const firstName = (draft.personal.firstName ?? '').trim()
  const isFemale = draft.gender === 'female'
  /** Name to greet with; falls back to a friendly word when registration has no name. */
  const name = firstName || t('friend', 'يا صديقي')
  /** Arabic gender helper: g(masculine, feminine). */
  const g = (m: string, f: string) => (isFemale ? f : m)
  return { name, firstName, isFemale, g, t, isRtl }
}
