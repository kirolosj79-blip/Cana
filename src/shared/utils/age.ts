export function calculateAge(dob: string): number {
  const birth = new Date(dob)
  if (Number.isNaN(birth.getTime())) return 0
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--
  return Math.max(age, 0)
}

/**
 * Whether someone born on `dob` is genuinely past their 20th birthday —
 * not just "20" by whole-year count, which would still be true on the
 * exact day they turn 20. Someone who turns 20 today must wait until
 * tomorrow to pass this check.
 */
export function isPast20thBirthday(dob: string): boolean {
  const birth = new Date(dob)
  if (Number.isNaN(birth.getTime())) return false
  const twentyYearsAgo = new Date()
  twentyYearsAgo.setFullYear(twentyYearsAgo.getFullYear() - 20)
  twentyYearsAgo.setHours(0, 0, 0, 0)
  return birth.getTime() < twentyYearsAgo.getTime()
}
