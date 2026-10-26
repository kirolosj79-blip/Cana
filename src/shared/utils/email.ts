// A pragmatic (not fully RFC-5322) email check — good enough to catch
// obviously invalid entries like "name.domain.com" (missing @) without
// being so strict it rejects legitimate addresses.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim())
}
