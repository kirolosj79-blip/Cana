import { useRef, useState } from 'react'
import { Download, Check } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

interface DocumentUploadCardProps {
  icon: React.ReactNode
  title: string
  subtitle: string
  accept?: string
  onUploaded?: (uploaded: boolean) => void
  defaultUploaded?: boolean
}

/**
 * A compact, single-row document upload card — icon, title/subtitle, and
 * an action icon, all in one clickable white card — matching the
 * reference design's "Priest's Letter / Government ID / Profile Photo"
 * style, as opposed to the dashed-box `UploadField` used elsewhere. Same
 * real device file picker underneath, just a different visual treatment.
 */
export function DocumentUploadCard({ icon, title, subtitle, accept = 'image/*,.pdf', onUploaded, defaultUploaded }: DocumentUploadCardProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [hasFile, setHasFile] = useState(!!defaultUploaded)
  const [fileName, setFileName] = useState('')

  const handleFile = (file: File) => {
    setFileName(file.name)
    setHasFile(true)
    onUploaded?.(true)
  }

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      className="w-full flex items-center gap-3 rounded-[var(--radius-lg)] bg-parchment-0 border border-ink-100 px-4 py-3.5 shadow-[var(--shadow-soft-sm)] text-left transition-colors hover:border-gold-300"
    >
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
      <span
        className={cn(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
          hasFile ? 'bg-success-500/15 text-success-500' : 'bg-emphasis-text/10 text-emphasis-text'
        )}
      >
        {icon}
      </span>
      <span className="flex-1 min-w-0">
        <span className="block text-sm font-semibold text-ink-900">{title}</span>
        <span className="block text-xs text-ink-500 truncate">{hasFile ? fileName : subtitle}</span>
      </span>
      <span className={cn('shrink-0', hasFile ? 'text-success-500' : 'text-ink-400')}>
        {hasFile ? <Check size={18} /> : <Download size={18} />}
      </span>
    </button>
  )
}
