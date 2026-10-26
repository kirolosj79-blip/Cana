import { useRef, useState } from 'react'
import { UploadCloud, FileCheck2, X } from 'lucide-react'
import { useLanguage } from '@/core/hooks/useLanguage'

interface UploadFieldProps {
  label: string
  hint?: string
  optional?: boolean
  accept?: string
  onUploaded?: (uploaded: boolean) => void
  defaultUploaded?: boolean
}

/**
 * A real device file picker — opens the actual native file/photo chooser
 * and shows the file the member genuinely selected (name, size, and a real
 * thumbnail for images), rather than auto-generating a fake filename.
 * There's no backend/storage to actually send the file to yet, so nothing
 * is uploaded anywhere — but the picking itself is real, not simulated.
 */
export function UploadField({ label, hint, optional, accept = 'image/*,.pdf', onUploaded, defaultUploaded }: UploadFieldProps) {
  const { t } = useLanguage()
  const inputRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState<string>(defaultUploaded ? 'document.pdf' : '')
  const [fileSize, setFileSize] = useState<string>('')
  const [preview, setPreview] = useState<string | null>(null)
  const [hasFile, setHasFile] = useState(!!defaultUploaded)

  const formatSize = (bytes: number) => (bytes < 1024 * 1024 ? `${Math.round(bytes / 1024)} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`)

  const handleFile = (file: File) => {
    setFileName(file.name)
    setFileSize(formatSize(file.size))
    setHasFile(true)
    if (file.type.startsWith('image/')) {
      setPreview(URL.createObjectURL(file))
    } else {
      setPreview(null)
    }
    onUploaded?.(true)
  }

  const clear = () => {
    if (preview) URL.revokeObjectURL(preview)
    setFileName('')
    setFileSize('')
    setPreview(null)
    setHasFile(false)
    if (inputRef.current) inputRef.current.value = ''
    onUploaded?.(false)
  }

  return (
    <div className="flex flex-col gap-1.5">
      {(label || optional) && (
        <div className="flex items-center justify-between">
          {label && <span className="text-sm font-bold on-photo-text">{label}</span>}
          {optional && <span className="text-xs field-hint">{t('Optional', 'اختياري')}</span>}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
        }}
      />

      {hasFile ? (
        <div className="flex items-center justify-between gap-3 rounded-[var(--radius-md)] border border-success-500/30 bg-success-100 px-4 py-3">
          <div className="flex items-center gap-2.5 min-w-0">
            {preview ? (
              <img src={preview} className="h-9 w-9 rounded-md object-cover shrink-0" />
            ) : (
              <FileCheck2 size={18} className="text-success-500 shrink-0" />
            )}
            <span className="text-sm text-inkfixed-900 truncate">
              {fileName}
              {fileSize && <span className="text-inkfixed-900/60"> · {fileSize}</span>}
            </span>
          </div>
          <button type="button" onClick={clear} className="text-ink-400 hover:text-ink-600 shrink-0">
            <X size={16} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex items-center justify-center gap-2.5 rounded-[var(--radius-md)] border-2 border-dashed border-ink-200 bg-parchment-0 px-4 py-4 text-sm field-hint transition-colors hover:border-gold-400 hover:bg-gold-50/50"
        >
          <UploadCloud size={18} />
          {t('Tap to choose a file', 'اضغط تختار ملف')}
        </button>
      )}
      {hint && <span className="field-hint text-xs">{hint}</span>}
    </div>
  )
}
