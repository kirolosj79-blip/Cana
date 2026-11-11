import type { UserProfile } from '@/types/profile.types'
import { useRegistrationStore } from '@/store/registration.store'

import { calculateAge } from '@/shared/utils/age'
import { useMatchesStore } from '@/store/matches.store'
import { useJourneyStore } from '@/store/journey.store'

const age = calculateAge

/**
 * Mandatory filters — a candidate must pass every one of these to appear
 * anywhere in Discover or Daily Matches at all:
 * gender (opposite only), age range, country, church-recommendation
 * approval, and profile verification / membership standing.
 */
export function passesMandatoryFilters(candidate: UserProfile, strict = true): boolean {
  const draft = useRegistrationStore.getState().draft
  const myGender = draft.gender
  // No gender chosen yet (fresh prototype session): behave like the Figma example (a woman viewing men) so there are always matches.
  if (candidate.personal.gender === (myGender ?? 'female')) return false

  // Never resurface someone the member passed on or blocked.
  if (useMatchesStore.getState().passedIds.includes(candidate.id)) return false
  if (useJourneyStore.getState().blocked.includes(candidate.id)) return false

  // Profile verification & church-recommendation approval must both be granted
  // before a member becomes visible to others.
  if (candidate.verification.identity !== 'verified') return false
  if (candidate.verification.church !== 'verified') return false

  if (!strict) return true

  if (!strict) return true

  const prefs = draft.compatibilityPreferences
  const candidateAge = age(candidate.personal.dateOfBirth)
  if (prefs.ageRangeMin && candidateAge < prefs.ageRangeMin) return false
  if (prefs.ageRangeMax && candidateAge > prefs.ageRangeMax) return false

  if (prefs.countryPreference?.length && !prefs.countryPreference.includes(candidate.personal.countryOfResidence)) return false

  // Two-way check: the candidate's own age range and country preference must
  // also accept this member, otherwise one side would be introduced to
  // someone who already said "not for me".
  const myDob = draft.personal.dateOfBirth
  if (myDob) {
    const myAge = age(myDob)
    const theirs = candidate.compatibilityPreferences
    if (theirs?.ageRangeMin && myAge < theirs.ageRangeMin) return false
    if (theirs?.ageRangeMax && myAge > theirs.ageRangeMax) return false
  }
  const myCountry = draft.personal.countryOfResidence
  const theirCountries = candidate.compatibilityPreferences?.countryPreference
  if (myCountry && theirCountries?.length && !theirCountries.includes(myCountry)) return false

  return true
}

/**
 * Optional factors — nudge the compatibility score up or down but never
 * exclude a candidate outright: desire for children, previous marriage
 * status, education, smoking, alcohol, financial responsibility/stability.
 */
export function computeCompatibilityScore(candidate: UserProfile): number {
  const draft = useRegistrationStore.getState().draft
  let score = 58
  let signalsUsed = 0

  const prefs = draft.compatibilityPreferences
  if (prefs.churchPreference?.length) {
    signalsUsed++
    if (prefs.churchPreference.includes(candidate.church.denomination)) score += 14
  }
  if (draft.gettingToKnowYou.desireChildren) {
    signalsUsed++
    if (draft.gettingToKnowYou.desireChildren === candidate.gettingToKnowYou.desireChildren) score += 10
  }
  if (draft.eligibility.everMarried !== undefined) {
    signalsUsed++
    if (draft.eligibility.everMarried === candidate.eligibility.everMarried) score += 6
  }
  if (draft.education.level) {
    signalsUsed++
    if (draft.education.level === candidate.education.level) score += 5
  }
  if (draft.lifestyle.smoking) {
    signalsUsed++
    if (draft.lifestyle.smoking === candidate.lifestyle.smoking) score += 5
  }
  if (draft.lifestyle.alcohol) {
    signalsUsed++
    if (draft.lifestyle.alcohol === candidate.lifestyle.alcohol) score += 5
  }
  if (draft.employment.status) {
    signalsUsed++
    if (draft.employment.status === candidate.employment.status) score += 4
  }

  // If we don't have enough signal yet (early in registration), fall back to
  // the candidate's baseline appeal rather than an uninformative flat score.
  if (signalsUsed === 0) return candidate.compatibilityScore ?? 70

  return Math.max(40, Math.min(99, score))
}

export function getRankedMatches(list: UserProfile[]): UserProfile[] {
  // Prototype default: there should always be matches to look at. If the member's age/country
  // preferences exclude everyone, fall back to the verified opposite-gender profiles.
  const strictList = list.filter((c) => passesMandatoryFilters(c))
  const pool = strictList.length ? strictList : list.filter((c) => passesMandatoryFilters(c, false))
  return pool
    .map((c) => ({ ...c, compatibilityScore: computeCompatibilityScore(c) }))
    .sort((a, b) => (b.compatibilityScore ?? 0) - (a.compatibilityScore ?? 0))
}
