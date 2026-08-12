import { useTranslation } from 'react-i18next'
import { cn } from '../lib/utils'
import { categoryColor } from '../lib/leafletIcons'

interface CategoryBadgeProps {
  slug: string
  name?: string
  className?: string
  active?: boolean
  onClick?: () => void
}

/**
 * Chip kategori bergaya editorial: permukaan netral, satu titik kecil berwarna.
 *
 * Sebelumnya tiap kategori punya latar pastelnya sendiri (12 warna: biru, merah,
 * amber, emerald, ungu, oranye, ...). Berbaris bersama, itu menjadi pelangi yang
 * bertabrakan dengan palet krem/terracotta. Warnanya kini menyusut jadi titik
 * saja — cukup untuk mencocokkan chip dengan penanda peta, tanpa mendominasi.
 *
 * Warna diambil dari `categoryColor()` di lib/leafletIcons — sumber yang sama
 * dengan penanda peta. Sebelumnya komponen ini punya tabel warnanya sendiri,
 * sehingga ada dua daftar yang harus diubah bersamaan setiap kali kategori baru
 * ditambahkan, dan diam-diam bisa berbeda.
 */
export function CategoryBadge({ slug, name, className, active, onClick }: CategoryBadgeProps) {
  const { t } = useTranslation()
  const label = name || t(`category.${slug}`, slug)
  const Component = onClick ? 'button' : 'span'

  return (
    <Component
      onClick={onClick}
      {...(onClick ? { type: 'button' as const, 'aria-pressed': Boolean(active) } : {})}
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border',
        'transition-colors duration-200 motion-reduce:transition-none',
        active
          ? 'bg-foreground text-white border-foreground'
          : 'bg-surface-card text-foreground border-border',
        onClick &&
          'cursor-pointer hover:border-foreground/40 ' +
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground',
        className
      )}
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ backgroundColor: categoryColor(slug) }}
      />
      {label}
    </Component>
  )
}
