import { Eye, EyeOff } from 'lucide-react'
import { useFieldVisibilityStore } from '@/store/fieldVisibility.store'
import { useLanguage } from '@/core/hooks/useLanguage'
import { cn } from '@/shared/utils/cn'

interface FieldVisibilityToggleProps {
  fieldKey: string
  className?: string
}

/**
 * Small inline control placed right next to a field as the member fills it
 * in — lets them decide right there whether that answer shows on their
 * public profile or stays private, instead of only being configurable
 * later in a separate settings screen. Reads/writes the same
 * `fieldVisibility` store used everywhere else, so it's always in sync
 * with Edit Profile / Profile Visibility / the profile preview.
 */
export function FieldVisibilityToggle({ fieldKey, className }: FieldVisibilityToggleProps) {
  const { isVisible, setVisible } = useFieldVisibilityStore()
  const { t } = useLanguage()
  const visible = isVisible(fieldKey)

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        setVisible(fieldKey, !visible)
      }}
      className={cn(
        'flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium transition-colors',
        visible ? 'text-success-500 hover:bg-success-100' : 'text-ink-400 hover:bg-ink-100',
        className
      )}
      title={visible ? t('Visible on your profile', 'ظاهر في بروفايلك') : t('Hidden from your profile', 'مخفي من بروفايلك')}
    >
      {visible ? <Eye size={12} /> : <EyeOff size={12} />}
      {visible ? t('Shown to others', 'يظهر للناس') : t('Hidden', 'مخفي')}
    </button>
  )
}
