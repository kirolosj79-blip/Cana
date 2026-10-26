import { useNavigate } from 'react-router-dom'
import { ChevronRight, Moon, Languages, Bell, Lock, ShieldQuestion, FileText, Trash2, Monitor, Sun } from 'lucide-react'
import { TopBar } from '@/shared/components/layout/TopBar'
import { Switch } from '@/shared/components/ui/Toggle'
import { useAppStore, type ThemeMode } from '@/store/app.store'
import { useState } from 'react'
import { Modal } from '@/shared/components/ui/Modal'
import { Button } from '@/shared/components/ui/Button'
import { useAuthStore } from '@/store/auth.store'
import { useLanguage } from '@/core/hooks/useLanguage'
import { cn } from '@/shared/utils/cn'

function Row({ icon: Icon, label, right, onClick }: { icon: any; label: string; right?: React.ReactNode; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-3.5 hover:bg-ink-50 text-left">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-50 text-ink-600">
        <Icon size={16} />
      </span>
      <span className="flex-1 text-sm font-medium text-ink-800">{label}</span>
      {right ?? <ChevronRight size={16} className="text-ink-300" />}
    </button>
  )
}

const themeOptions: { value: ThemeMode; icon: any }[] = [
  { value: 'system', icon: Monitor },
  { value: 'light', icon: Sun },
  { value: 'dark', icon: Moon },
]

export function SettingsScreen() {
  const navigate = useNavigate()
  const { themeMode, setThemeMode, language, setLanguage } = useAppStore()
  const [notifOn, setNotifOn] = useState(true)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const logout = useAuthStore((s) => s.logout)
  const { t } = useLanguage()

  return (
    <div>
      <TopBar showBack title={t('Settings & Privacy', 'الإعدادات والخصوصية')} />
      <div className="px-5 pt-2 pb-8 space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-400 px-3 pt-3 pb-1">{t('Preferences', 'التفضيلات')}</p>

        <div className="flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-3.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-50 text-ink-600">
            <Moon size={16} />
          </span>
          <span className="flex-1 text-sm font-medium text-ink-800">{t('Appearance', 'المظهر')}</span>
          <div className="flex rounded-full border border-ink-200 p-0.5 bg-ink-50">
            {themeOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setThemeMode(opt.value)}
                className={cn(
                  'flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-medium transition-colors',
                  themeMode === opt.value ? 'bg-ink-900 text-parchment-0' : 'text-ink-500'
                )}
              >
                <opt.icon size={12} />
              </button>
            ))}
          </div>
        </div>
        <p className="px-3 -mt-1 text-[11px] text-ink-400">{t("System follows your device's Light/Dark setting automatically.", 'وضع النظام بيتبع إعدادات جهازك تلقائيًا.')}</p>

        <Row
          icon={Languages}
          label={t('Language', 'اللغة')}
          right={<span className="text-sm text-ink-500">{language === 'ar' ? 'العربية' : 'English'}</span>}
          onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
        />
        <Row icon={Bell} label={t('Notifications', 'الإشعارات')} right={<Switch checked={notifOn} onChange={setNotifOn} />} />

        <p className="text-xs font-semibold uppercase tracking-wide text-ink-400 px-3 pt-5 pb-1">{t('Account & Safety', 'الحساب والأمان')}</p>
        <Row icon={ShieldQuestion} label={t('Verification Status', 'حالة التوثيق')} onClick={() => navigate('/app/settings/verification')} />
        <Row icon={Lock} label={t('Privacy Settings', 'إعدادات الخصوصية')} onClick={() => navigate('/app/settings/privacy')} />
        <Row icon={FileText} label={t('Privacy Policy', 'سياسة الخصوصية')} onClick={() => navigate('/app/settings/privacy-policy')} />

        <p className="text-xs font-semibold uppercase tracking-wide text-ink-400 px-3 pt-5 pb-1">{t('Danger Zone', 'منطقة الخطر')}</p>
        <Row icon={Trash2} label={t('Delete Account', 'حذف الحساب')} onClick={() => setDeleteOpen(true)} />
      </div>

      <Modal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title={t('Delete your account?', 'تحذف حسابك؟')}
        footer={
          <>
            <Button variant="outline" className="flex-1" onClick={() => setDeleteOpen(false)}>
              {t('Cancel', 'إلغاء')}
            </Button>
            <Button
              variant="danger"
              className="flex-1"
              onClick={() => {
                logout()
                navigate('/welcome')
              }}
            >
              {t('Delete', 'حذف')}
            </Button>
          </>
        }
      >
        <p className="text-sm text-ink-600">{t('This permanently removes your profile, matches, and messages. This cannot be undone.', 'ده هيمسح ملفك وترشيحاتك ورسايلك نهائيًا. مفيش رجوع بعد كده.')}</p>
      </Modal>
    </div>
  )
}
