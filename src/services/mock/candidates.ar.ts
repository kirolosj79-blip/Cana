import type { UserProfile } from '@/types/profile.types'
import { useAppStore } from '@/store/app.store'

const AR: Record<string, string> = {
  // names
  Mariam: 'مريم', Mina: 'مينا', Maggie: 'ماجي', Michael: 'مايكل', David: 'ديفيد', Sarah: 'سارة', Peter: 'بيتر', Marina: 'مارينا',
  Fahmy: 'فهمي', Hanna: 'حنا', Ibrahim: 'إبراهيم', Youssef: 'يوسف', Samir: 'سمير', Kamel: 'كامل', Nassif: 'نصيف', Fouad: 'فؤاد',
  'Mariam Fahmy': 'مريم فهمي', 'Mina Hanna': 'مينا حنا', 'Maggie Ibrahim': 'ماجي إبراهيم', 'Michael Youssef': 'مايكل يوسف', 'David Samir': 'ديفيد سمير', 'Sarah Kamel': 'سارة كامل', 'Peter Nassif': 'بيتر نصيف', 'Marina Fouad': 'مارينا فؤاد',
  // places
  'New York, NY': 'نيويورك، أمريكا', 'Cairo, Egypt': 'القاهرة، مصر', 'Toronto, ON': 'تورنتو، كندا', 'New Jersey, NJ': 'نيو جيرسي، أمريكا', 'Alexandria, Egypt': 'الإسكندرية، مصر',
  // work
  Pharmacist: 'صيدلي', Cardiologist: 'دكتور قلب', 'Civil Engineer': 'مهندس مدني', 'Systems Architect': 'مهندس أنظمة', Teacher: 'مدرّسة', Dentist: 'طبيبة أسنان',
  Egyptian: 'مصري', American: 'أمريكي',
  // church
  'Coptic Orthodox Parish': 'كنيسة قبطية أرثوذكسية',
  // faith chips
  Choir: 'الكورال', 'Sunday school teaching': 'خدمة مدارس الأحد', 'community service': 'الخدمة المجتمعية', 'Choir, Sunday school teaching, community service': 'الكورال، خدمة مدارس الأحد، الخدمة المجتمعية',
  'Faith in God': 'الإيمان بالله', 'Honesty and Trust': 'الصدق والثقة', 'Family Commitment': 'الالتزام الأسري', 'Love and Respect': 'المحبة والاحترام',
  Patient: 'صبور', Supportive: 'داعم', 'A good listener': 'مستمع جيد',
  // bios
  'I love serving in church, spending time with family, reading, and enjoying simple things in life. Looking for a God-fearing man who is kind, loyal, and ready to build a Christ-centered family.': 'بحب الخدمة في الكنيسة وقضاء الوقت مع أسرتي والقراءة والاستمتاع بالحاجات البسيطة في الحياة. بدوّر على شخص بيخاف ربنا، طيب ووفي، ومستعد يبني أسرة محورها المسيح.',
  'St. Mark Coptic Church member. Looking for a God-fearing wife and life partner to build a home rooted in faith and mutual respect.': 'عضو في كنيسة مار مرقس القبطية. بدوّر على زوجة وشريكة حياة بتخاف ربنا، عشان نبني بيت متأسس على الإيمان والاحترام المتبادل.',
  'St. George Coptic Church. Looking for a God-fearing husband and life partner who values faith, honesty, and family.': 'كنيسة مارجرجس القبطية. بدوّر على زوج وشريك حياة بيخاف ربنا، وبيقدّر الإيمان والصدق والأسرة.',
  'St. Mary Coptic Church. Looking for a God-fearing wife and life partner to share a lifelong journey of faith.': 'كنيسة السيدة العذراء القبطية. بدوّر على زوجة وشريكة حياة بتخاف ربنا، نشارك رحلة إيمان طول العمر.',
  'Serving at St. Antonious. Seeking a partner who shares a heart for family, service, and spiritual growth.': 'بخدم في كنيسة الأنبا أنطونيوس. بدوّر على شريكة بتشاركني الاهتمام بالأسرة والخدمة والنمو الروحي.',
  'Deeply rooted in faith and family. Looking for a partner who values tradition, kindness, and a shared spiritual life.': 'متأصلة في الإيمان والأسرة. بدوّر على شريك بيقدّر التقاليد والطيبة وحياة روحية مشتركة.',
  'Established and ready for marriage. Looking for a wife who shares the same values of faith and family commitment.': 'مستقر ومستعد للجواز. بدوّر على زوجة بتشاركني نفس قيم الإيمان والالتزام بالأسرة.',
  'A woman of faith looking to build a loving home. Family, church, and lifelong companionship matter most to me.': 'سيدة مؤمنة بتدوّر على بناء بيت مليان محبة. الأسرة والكنيسة والرفقة مدى الحياة هي أهم حاجة عندي.',
}

/** Arabic text for a candidate data value; unknown strings fall back to the original. */
export const arData = (s: string | undefined) => (s && AR[s]) || s || ''
export const isArabicUi = () => useAppStore.getState().language === 'ar'

/** Returns a copy of a mock candidate with its display text in Arabic when the UI is Arabic. */
export function localizeCandidate(c: UserProfile): UserProfile {
  if (!isArabicUi()) return c
  const p = c.personal
  const tr = (s: string) => AR[s] ?? s
  return {
    ...c,
    personal: { ...p, firstName: tr(p.firstName), lastName: tr(p.lastName), displayName: tr(p.displayName), cityState: tr(p.cityState), bio: tr(p.bio), nationality: (p.nationality ?? []).map(tr) },
    church: { ...c.church, churchName: tr(c.church.churchName), churchActivities: c.church.churchActivities.split(',').map((x) => tr(x.trim())).join('، ') },
    employment: { ...c.employment, occupation: tr(c.employment.occupation) },
    gettingToKnowYou: {
      ...c.gettingToKnowYou,
      desiredMarriageValues: (c.gettingToKnowYou.desiredMarriageValues ?? []).map(tr),
      goodPartnerQualities: (c.gettingToKnowYou.goodPartnerQualities ?? []).map(tr),
    },
  } as UserProfile
}
