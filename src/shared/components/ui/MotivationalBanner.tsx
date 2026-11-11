import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Sparkles, X } from 'lucide-react'
import { useLanguage } from '@/core/hooks/useLanguage'

const TIPS: { en: string; ar: string }[] = [
  { en: 'A clear, recent photo gets 3x more interest — worth the extra minute.', ar: 'صورة واضحة وحديثة بتجيب اهتمام أكتر بـ 3 مرات — تستاهل الدقيقة الزيادة.' },
  { en: 'Members who finish the Getting to Know You section get better-matched recommendations.', ar: 'الأعضاء اللي بيكملوا قسم "تعرف عليك أكثر" بيوصلهم ترشيحات أدق.' },
  { en: 'Take your time — a thoughtful profile is worth more than a fast one.', ar: 'خد وقتك — بروفايل مدروس يستاهل أكتر من واحد سريع.' },
  { en: 'You can always come back and finish later — your progress is saved automatically.', ar: 'تقدر ترجع تكمل في أي وقت — تقدمك بيتحفظ تلقائي.' },
  { en: 'Honesty in the Health section helps build real trust from the start.', ar: 'الصدق في قسم الصحة بيبني ثقة حقيقية من البداية.' },
  { en: "Every member is verified — you're in a safe, serious community.", ar: 'كل عضو موثّق — إنت في مجتمع آمن وجاد.' },
]

/**
 * A calm, rotating tip that surfaces between sections rather than a
 * one-off toast that's easy to miss and never see again. Auto-advances,
 * dismissible, and never blocks the page.
 */
export function MotivationalBanner({ intervalMs = 6000 }: { intervalMs?: number }) {
  const { language } = useLanguage()
  const [index, setIndex] = useState(() => Math.floor(Math.random() * TIPS.length))
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (dismissed) return
    const timer = setInterval(() => setIndex((i) => (i + 1) % TIPS.length), intervalMs)
    return () => clearInterval(timer)
  }, [dismissed, intervalMs])

  if (dismissed) return null

  return (
    <div className="relative overflow-hidden rounded-[var(--r-md)] border border-gold-200 bg-gold-50 px-4 py-3">
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-2 right-2 rtl:right-auto rtl:left-2 text-gold-600/60 hover:text-gold-700"
        aria-label="dismiss"
      >
        <X size={13} />
      </button>
      <div className="flex items-start gap-2.5 pe-4">
        <Sparkles size={15} className="text-gold-600 shrink-0 mt-0.5" />
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.4 }}
            className="text-xs text-gold-700 leading-relaxed"
          >
            {language === 'ar' ? TIPS[index].ar : TIPS[index].en}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  )
}
