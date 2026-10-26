/**
 * Converts a number-input's raw string value for storage, without the
 * classic controlled-input bug where `Number('') === 0` makes an emptied
 * field immediately snap back to showing "0" — which makes the field feel
 * impossible to actually clear. Empty input stays empty (undefined) until
 * the user types a real digit.
 */
export function toOptionalNumber(raw: string): number | undefined {
  if (raw === '') return undefined
  const n = Number(raw)
  return Number.isNaN(n) ? undefined : n
}
