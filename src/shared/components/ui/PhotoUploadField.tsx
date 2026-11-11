import { useRef, useState } from 'react'
import { UploadCloud, X, HelpCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { Modal } from '@/shared/components/ui/Modal'
import { checkImageHasFace } from '@/core/utils/faceDetection'
import { useLanguage } from '@/core/hooks/useLanguage'

interface PhotoUploadFieldProps {
  label: string
  optional?: boolean
  onUploaded?: (uploaded: boolean, previewUrl?: string) => void
}

type Status = 'idle' | 'checking' | 'accepted' | 'rejected_no_face' | 'needs_manual_review'

export function PhotoUploadField({ label, optional, onUploaded }: PhotoUploadFieldProps) {
  const { t } = useLanguage()
  const inputRef = useRef<HTMLInputElement>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [preview, setPreview] = useState<string | null>(null)
  const [helpOpen, setHelpOpen] = useState(false)

  const handleFile = async (file: File) => {
    const url = URL.createObjectURL(file)
    setPreview(url)
    setStatus('checking')

    const result = await checkImageHasFace(file)

    if (!result.supported) {
      // Browser can't verify locally — accept the photo but flag it for manual review, rather than faking a pass.
      setStatus('needs_manual_review')
      onUploaded?.(true, url)
      return
    }

    if (!result.hasFace) {
      setStatus('rejected_no_face')
      onUploaded?.(false)
      return
    }

    setStatus('accepted')
    onUploaded?.(true, url)
  }

  const clear = () => {
    setPreview(null)
    setStatus('idle')
    onUploaded?.(false)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold on-photo-text flex items-center gap-1.5">
          {label}
          <button type="button" onClick={() => setHelpOpen(true)} className="text-ink-400 hover:text-gold-600">
            <HelpCircle size={14} />
          </button>
        </span>
        {optional && <span className="text-xs field-hint">{t('Optional', 'اختياري')}</span>}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
        }}
      />

      {preview ? (
        <div className="relative">
          <img src={preview} className={cn('h-40 w-full rounded-[var(--r-md)] object-cover', status === 'rejected_no_face' && 'opacity-50')} />
          <button
            type="button"
            onClick={clear}
            className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-ink-950/60 text-white"
          >
            <X size={14} />
          </button>
          {status === 'checking' && (
            <div className="absolute inset-0 flex items-center justify-center rounded-[var(--r-md)] bg-ink-950/40">
              <span className="flex items-center gap-2 rounded-full bg-parchment-0 px-3 py-1.5 text-xs font-medium text-ink-700">
                <Loader2 size={13} className="animate-spin" /> {t('Checking the photo…', 'بنتأكد من الصورة…')}
              </span>
            </div>
          )}
          {status === 'accepted' && (
            <span className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-success-500 px-2.5 py-1 text-[10px] font-medium text-white">
              <CheckCircle2 size={11} /> {t('Face verified', 'الوجه اتوثق')}
            </span>
          )}
          {status === 'needs_manual_review' && (
            <span className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-success-500 px-2.5 py-1 text-[10px] font-medium text-white">
              <CheckCircle2 size={11} /> {t('Photo uploaded', 'الصورة اترفعت')}
            </span>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex items-center justify-center gap-2.5 rounded-[var(--r-md)] border-2 border-dashed border-ink-200 bg-parchment-0 px-4 py-6 text-sm field-hint transition-colors hover:border-gold-400 hover:bg-gold-50/50"
        >
          <UploadCloud size={18} />
          {t('Tap to upload', 'اضغط لرفع الصورة')}
        </button>
      )}

      {status === 'rejected_no_face' && (
        <p className="text-xs text-danger-500 leading-relaxed">
          {t(
            "This photo doesn't clearly show a face 😊 Please choose a photo where your face is clearly visible so we can verify it.",
            'الصورة دي مش باين فيها وش واضح 😊 حاول تختار صورة يكون وشك ظاهر فيها بشكل واضح علشان نقدر نتحقق منها.'
          )}
        </p>
      )}
      {status === 'needs_manual_review' && (
        <p className="text-xs text-ink-400 leading-relaxed">
          {t(
            "Your browser can't auto-verify faces — our team will check this photo manually before approval.",
            'المتصفح عندك مش بيدعم التحقق التلقائي من الوجه، فريقنا هيراجع الصورة يدويًا قبل الموافقة.'
          )}
        </p>
      )}

      <Modal open={helpOpen} onClose={() => setHelpOpen(false)} title={t('Photo instructions', 'تعليمات الصورة الشخصية')}>
        <ul className="space-y-2.5 text-sm text-ink-700">
          {[
            t('The photo should be recent', 'الصورة تكون حديثة'),
            t('Your face should be clear', 'الوجه يكون واضح'),
            t('Good lighting', 'الإضاءة تكون كويسة'),
            t('No group photos', 'عدم استخدام صور جماعية'),
            t('No heavy filters', 'عدم استخدام فلاتر قوية'),
            t("Don't cover your face", 'عدم تغطية الوجه'),
            t('Look at the camera if possible', 'يفضل النظر للكاميرا'),
            t('Only one person in the photo', 'الصورة تكون لشخص واحد فقط'),
          ].map((line) => (
            <li key={line} className="flex items-start gap-2">
              <span className="text-gold-500 mt-0.5">•</span> {line}
            </li>
          ))}
        </ul>
      </Modal>
    </div>
  )
}
