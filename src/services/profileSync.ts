import { supabase } from '@/services/supabase'
import type { RegistrationDraft } from '@/store/registration.store'

// Local-only values (blob:/data: URLs) mean nothing to another device, so they
// are not stored in the database. Uploading photos/documents to the Storage
// buckets is a separate step.
function cleanUrls<T>(value: T): T {
  if (typeof value === 'string') return (/^(blob:|data:)/.test(value) ? '' : value) as unknown as T
  if (Array.isArray(value)) return value.map(cleanUrls).filter((v) => v !== '') as unknown as T
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, cleanUrls(v)])) as T
  }
  return value
}

export type SaveResult = { ok: true } | { ok: false; reason: 'duplicate_email' | 'not_signed_in' | 'error' }

/** Saves the finished registration to the member's profile row (no-op without Supabase). */
export async function saveRegistration(draft: RegistrationDraft): Promise<SaveResult> {
  if (!supabase) return { ok: true }
  const { data } = await supabase.auth.getUser()
  if (!data.user) return { ok: false, reason: 'not_signed_in' }
  const { error } = await supabase
    .from('profiles')
    .update({
      gender: draft.gender ?? null,
      email: draft.personal.email?.trim() || null,
      personal: cleanUrls(draft.personal),
      church: cleanUrls(draft.church),
      eligibility: draft.eligibility,
      family: draft.family,
      education: draft.education,
      employment: draft.employment,
      lifestyle: draft.lifestyle,
      getting_to_know_you: draft.gettingToKnowYou,
      men_specific: draft.menSpecific,
      women_specific: draft.womenSpecific,
      compatibility_preferences: draft.compatibilityPreferences,
      safety_declaration: draft.safetyDeclaration,
      health: draft.health,
      is_onboarded: true,
    })
    .eq('id', data.user.id)
  if (!error) return { ok: true }
  // 23505 = unique_violation (profiles_email_unique)
  return { ok: false, reason: error.code === '23505' ? 'duplicate_email' : 'error' }
}
