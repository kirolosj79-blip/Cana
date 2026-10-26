import { useRef, useState } from 'react'
import { Plus, X } from 'lucide-react'
import { useLanguage } from '@/core/hooks/useLanguage'

interface PickedPhoto {
  id: string
  url: string
  name: string
}

interface MultiPhotoUploadFieldProps {
  label: string
  hint?: string
  optional?: boolean
  max?: number
  onChange?: (count: number) => void
}

/**
 * Real multi-file photo picker — lets the member add photos one at a time
 * up to `max`, each shown as an actual thumbnail with its own remove
 * button, plus an "add more" tile while under the limit. This is what
 * "up to 6 total" actually needs; a single-file `UploadField` can only
 * ever hold one photo no matter what its label says.
 */
export function MultiPhotoUploadField({ label, hint, optional, max = 5, onChange }: MultiPhotoUploadFieldProps) {
  const { t } = useLanguage()
  const inputRef = useRef<HTMLInputElement>(null)
  const [photos, setPhotos] = useState<PickedPhoto[]>([])

  const addFiles = (files: FileList) => {
    const room = max - photos.length
    const picked = Array.from(files).slice(0, room)
    const next = picked.map((file) => ({ id: `${Date.now()}-${Math.random()}`, url: URL.createObjectURL(file), name: file.name }))
    const updated = [...photos, ...next]
    setPhotos(updated)
    onChange?.(updated.length)
  }

  const removePhoto = (id: string) => {
    setPhotos((prev) => {
      const photo = prev.find((p) => p.id === id)
      if (photo) URL.revokeObjectURL(photo.url)
      const updated = prev.filter((p) => p.id !== id)
      onChange?.(updated.length)
      return updated
    })
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold on-photo-text">{label}</span>
        {optional && <span className="text-xs field-hint">{t('Optional', 'اختياري')}</span>}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) addFiles(e.target.files)
          e.target.value = ''
        }}
      />

      <div className="grid grid-cols-3 gap-2">
        {photos.map((photo) => (
          <div key={photo.id} className="relative aspect-square rounded-[var(--radius-md)] overflow-hidden border border-ink-100">
            <img src={photo.url} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removePhoto(photo.id)}
              className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-ink-950/60 text-white"
            >
              <X size={13} />
            </button>
          </div>
        ))}
        {photos.length < max && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="aspect-square flex flex-col items-center justify-center gap-1 rounded-[var(--radius-md)] border-2 border-dashed border-ink-200 bg-parchment-0 field-hint transition-colors hover:border-gold-400 hover:bg-gold-50/50"
          >
            <Plus size={20} />
            <span className="text-[11px]">{t('Add', 'إضافة')}</span>
          </button>
        )}
      </div>

      <span className="text-xs text-ink-400">
        {photos.length}/{max} {t('added', 'مضافة')}
      </span>
      {hint && <span className="field-hint text-xs">{hint}</span>}
    </div>
  )
}
