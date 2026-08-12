import { cn } from '../../lib/utils'

interface BrandMarkProps {
  /** Baris utama, mis. "Mekarjaya". */
  title: string
  /** Baris kecil di bawahnya, mis. "WebGIS Portal". */
  subtitle?: string
  /** Ukuran lambang dalam px. */
  size?: number
  className?: string
  titleClassName?: string
}

/**
 * Lambang desa + nama. Sebelumnya blok ini disalin di tiga tempat (Navbar,
 * Footer, sidebar Admin) dengan ikon MapPin generik di dalam kotak hitam —
 * terlihat seperti placeholder. Sekarang memakai lambang resmi dan hanya ada
 * satu sumber, jadi perubahan berikutnya cukup di sini.
 */
export function BrandMark({
  title,
  subtitle,
  size = 36,
  className,
  titleClassName,
}: BrandMarkProps) {
  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      <img
        src="/images/logo.png"
        alt=""
        aria-hidden="true"
        width={size}
        height={size}
        // object-contain: lambangnya tidak persegi (274x300), jadi tanpa ini
        // gambarnya akan gepeng saat dipaksa masuk kotak persegi.
        className="shrink-0 object-contain"
        style={{ width: size, height: size }}
      />
      <span className="min-w-0">
        <span
          className={cn(
            'font-heading font-bold text-neutral-900 text-sm tracking-tight block truncate',
            titleClassName
          )}
        >
          {title}
        </span>
        {subtitle && (
          <span className="block text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-medium -mt-0.5 truncate">
            {subtitle}
          </span>
        )}
      </span>
    </span>
  )
}
