/**
 * Dynamic encouragement messages shown after each registration step.
 * Warm, respectful, and spiritually-toned — deliberately not overly casual
 * ("تمام جدًا، استمر" reads as something you'd say to a friend, not the
 * tone appropriate for a Christian marriage platform). Personalized with
 * the member's first name where available, and a different phrase every
 * time so consecutive steps never repeat the same line. Arabic phrasing
 * is gender-correct — addressed as "أنت/معاك" for a man and "أنتِ/معاكِ"
 * for a woman, not one fixed masculine default.
 */

type Gender = 'male' | 'female' | undefined

const FIRST_STEP: { ar: (isFemale: boolean) => string[]; en: string[] } = {
  ar: (isFemale) => [
    'يلا بينا! بداية جميلة لرحلتك',
    `أهلًا بيك${isFemale ? 'ي' : ''} في الخطوة الأولى، ربنا معاك${isFemale ? 'ي' : ''}`,
    'بداية مباركة لرحلة حلوة',
  ],
  en: ["Let's begin — a beautiful start to your journey", 'Welcome to your first step, God bless your journey', 'A blessed beginning to a beautiful journey'],
}

const GENERAL: { ar: (name: string, isFemale: boolean) => string[]; en: (name: string) => string[] } = {
  ar: (name, isFemale) => [
    `تمام يا ${name}، كده بياناتك اكتملت. يلا نكمل الخطوة الجاية.`,
    `أحسنت${isFemale ? 'ي' : ''} يا ${name}، كده خلصت${isFemale ? 'ي' : ''} الخطوة دي بنجاح. يلا نكمل مع بعض.`,
    `تمام يا ${name}، بياناتك اكتملت بنجاح. نكمل الخطوة الجاية؟`,
    `شكرًا يا ${name}، كده خلصنا الخطوة دي. نكمل مع بعض؟`,
    `رائع يا ${name}، كده أنت${isFemale ? 'ِ' : ''} جاهز${isFemale ? 'ة' : ''} للخطوة الجاية. يلا نكمل مع بعض.`,
    `ممتاز يا ${name}، كده خلصت${isFemale ? 'ي' : ''} الخطوة دي. نبدأ الخطوة الجاية مع بعض.`,
    `الرب يبارك خطواتك يا ${name}. يلا نكمل الرحلة.`,
  ],
  en: (name) => [
    `Great, ${name}! Your information is complete. Let's continue.`,
    `Thank you, ${name}. Your information has been completed successfully. Let's continue.`,
    `Wonderful, ${name}! You're ready for the next step.`,
    `Thank you for completing your information, ${name}. Let's continue to the next step.`,
    `Your information is complete, ${name}. Let's take the next step together.`,
    `Thank you, ${name}. You're all set for the next step.`,
    `Wonderful, ${name}. Your registration is progressing successfully. Let's continue.`,
  ],
}

export function getEncouragement(stepIndex: number, language: 'en' | 'ar', name: string, seed = 0, gender?: Gender): string {
  const isFemale = gender === 'female'
  const displayName = name?.trim() || (language === 'ar' ? (isFemale ? 'صديقتي' : 'صديقي') : 'friend')

  if (stepIndex === 0) {
    const list = language === 'ar' ? FIRST_STEP.ar(isFemale) : FIRST_STEP.en
    return list[seed % list.length]
  }

  const list = language === 'ar' ? GENERAL.ar(displayName, isFemale) : GENERAL.en(displayName)
  return list[seed % list.length]
}
