import { useNavigate } from 'react-router-dom'
import { Check } from 'lucide-react'
import { useAppStore } from '@/store/app.store'
import { Button } from '@/shared/components/ui/Button'
import { PageContainer } from '@/shared/components/layout/PageContainer'
import { cn } from '@/shared/utils/cn'

export function ChooseLanguageScreen() {
  const navigate = useNavigate()
  const language = useAppStore((s) => s.language)
  const setLanguage = useAppStore((s) => s.setLanguage)

  return (
    <PageContainer className="justify-between py-10">
      <div className="flex-1 flex flex-col justify-center gap-8">
        <div className="text-center">
          <h1 className="font-display text-2xl font-medium text-ink-900">اختر لغتك</h1>
          <p className="text-sm text-ink-500 mt-1">Choose your language</p>
        </div>
        <div className="space-y-3">
          {[
            { code: 'ar' as const, label: 'العربية', sub: 'المتابعة باللغة العربية' },
            { code: 'en' as const, label: 'English', sub: 'Continue in English' },
          ].map((opt) => (
            <button
              key={opt.code}
              onClick={() => setLanguage(opt.code)}
              className={cn(
                'w-full flex items-center justify-between rounded-[var(--radius-md)] border px-5 py-4 transition-colors',
                language === opt.code ? 'border-gold-400 bg-parchment-100' : 'border-ink-200 bg-parchment-0'
              )}
            >
              <div className="text-start">
                <div className={cn('font-display text-lg', 'text-ink-900')}>{opt.label}</div>
                <div className={cn('text-xs', 'text-ink-500')}>{opt.sub}</div>
              </div>
              {language === opt.code && (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold-400 text-inkfixed-950">
                  <Check size={14} strokeWidth={3} />
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
      <Button variant="gold" size="lg" className="w-full" onClick={() => navigate('/welcome')}>
        {language === 'en' ? 'Continue' : 'كمّل'}
      </Button>
    </PageContainer>
  )
}
