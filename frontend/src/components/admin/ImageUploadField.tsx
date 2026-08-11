import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ImagePlus, Loader2, Trash2 } from 'lucide-react'
import { Button } from '../ui/button'
import { adminUpload } from '../../services/adminApi'
import { cn } from '../../lib/utils'

interface ImageUploadFieldProps {
  value?: string | null
  onChange: (url: string | null) => void
  label?: string
}

export function ImageUploadField({ value, onChange, label }: ImageUploadFieldProps) {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFile = async (file?: File | null) => {
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      const res = await adminUpload(file)
      onChange(res.imageUrl)
    } catch {
      setError(t('admin.upload_error'))
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div>
      {label && <span className="block text-sm font-medium text-foreground mb-1.5">{label}</span>}
      <div
        className={cn(
          'rounded-xl border flex items-center gap-3 p-3 transition-colors',
          value ? 'border-border bg-surface-card' : 'border-dashed border-border bg-muted/20'
        )}
      >
        {value ? (
          <>
            <img
              src={value}
              alt={label ?? ''}
              className="w-16 h-16 rounded-lg object-cover border border-border/60 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground truncate">{value}</p>
              <div className="flex gap-2 mt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => inputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}
                  {t('admin.replace_image')}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onChange(null)}
                  className="text-red-600 dark:text-red-400 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" /> {t('admin.remove_image')}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}
            {uploading ? t('admin.uploading') : t('admin.upload_image')}
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      {error && <p className="text-xs text-red-600 dark:text-red-400 mt-1.5">{error}</p>}
    </div>
  )
}
