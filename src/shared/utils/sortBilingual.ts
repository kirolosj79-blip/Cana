/**
 * Sorts a list of bilingual options by whichever language is currently
 * active — English alphabetical order (Alexandria, Aswan, Asyut...) and
 * Arabic alphabetical order (الإسكندرية، أسوان، أسيوط...) are unrelated,
 * so a list hard-sorted in one language reads as completely unsorted to
 * a reader of the other. Sorting happens at render time instead of
 * baking in one fixed order.
 */
export function sortBilingual<T extends { en: string; ar: string }>(options: readonly T[], language: 'en' | 'ar'): T[] {
  const collator = new Intl.Collator(language === 'ar' ? 'ar' : 'en')
  return [...options].sort((a, b) => collator.compare(language === 'ar' ? a.ar : a.en, language === 'ar' ? b.ar : b.en))
}
