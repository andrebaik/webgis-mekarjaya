import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ImagePlus, Loader2, Trash2, ArrowLeft, ArrowRight } from 'lucide-react'
import { adminUpload } from '../../services/adminApi'
import { cn } from '../../lib/utils'

interface ImageGalleryFieldProps {
  value: string[]
  onChange: (urls: string[]) => void
  label?: string
}

/**
 * Unggah banyak gambar untuk satu lokasi. Kolom `locations.images` bertipe array
 * dan halaman detail merendernya sebagai galeri, jadi ImageUploadField (satu
 * gambar) tidak cukup di sini.
 *
 * Urutan gambar berarti: yang pertama dipakai sebagai gambar utama di kartu
 * lokasi, karena itu ada tombol geser kiri/kanan.
 */
export function ImageGalleryField({ value, onChange, label }: ImageGalleryFieldProps) {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setUploading(true)
    setError(null)
    const terunggah: string[] = []
    try {
      // Berurutan, bukan paralel: endpoint upload menulis ke disk dan
      // batching besar dari HP gampang bikin request gagal separuh jalan.
      for (const file of Array.from(files)) {
        const res = await adminUpload(file)
        terunggah.push(res.imageUrl)
      }
      onChange([...value, ...terunggah])
    } catch {
      // Yang sempat berhasil tetap dipakai supaya kerja pengguna tidak hilang.
      if (terunggah.length > 0) onChange([...value, ...terunggah])
      setError(t('admin.upload_error'))
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const hapus = (i: number) => onChange(value.filter((_, k) => k !== i))

  const geser = (i: number, arah: -1 | 1) => {
    const tujuan = i + arah
    if (tujuan < 0 || tujuan >= value.length) return
    const salinan = [...value]
    ;[salinan[i], salinan[tujuan]] = [salinan[tujuan], salinan[i]]
    onChange(salinan)
  }

  const btn =
    'min-h-9 px-2 inline-flex items-center justify-center gap-1 rounded-lg text-xs font-medium ' +
    'transition-colors motion-reduce:transition-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'

  return (
    <div>
      {label && (
        <span className="block text-sm font-medium text-foreground mb-1.5">
          {label}
          {value.length > 0 && (
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              {t('admin.image_count', { count: value.length })}
            </span>
          )}
        </span>
      )}

      {value.length > 0 && (
        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
          {value.map((url, i) => (
            <li key={`${url}-${i}`} className="rounded-xl border border-border bg-surface-card overflow-hidden">
              <div className="relative aspect-video bg-muted">
                <img src={url} alt="" className="w-full h-full object-cover" loading="lazy" />
                {i === 0 && (
                  <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-foreground/85 text-white text-[10px] font-bold uppercase tracking-wider">
                    {t('admin.image_primary')}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 p-1.5">
                <button
                  type="button"
                  onClick={() => geser(i, -1)}
                  disabled={i === 0}
                  aria-label={t('admin.image_move_left')}
                  className={cn(btn, 'text-muted-foreground hover:bg-muted')}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => geser(i, 1)}
                  disabled={i === value.length - 1}
                  aria-label={t('admin.image_move_right')}
                  className={cn(btn, 'text-muted-foreground hover:bg-muted')}
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => hapus(i)}
                  aria-label={t('admin.remove_image')}
                  className={cn(btn, 'ml-auto text-red-600 hover:bg-red-50')}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className={cn(
          'w-full min-h-11 rounded-xl border border-dashed border-border bg-muted/20',
          'flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground',
          'hover:text-foreground hover:border-neutral-400 transition-colors motion-reduce:transition-none',
          'cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
        )}
      >
        {uploading ? (
          <Loader2 className="w-4 h-4 animate-spin motion-reduce:animate-none" />
        ) : (
          <ImagePlus className="w-4 h-4" />
        )}
        {uploading ? t('admin.uploading') : t('admin.upload_image')}
      </button>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {error && (
        <p role="alert" className="text-xs text-red-600 mt-1.5">
          {error}
        </p>
      )}
    </div>
  )
}
