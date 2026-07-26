import { useTranslation } from 'react-i18next'
import { cn } from '../lib/utils'

const categoryColors: Record<string, { bg: string; text: string; dot: string }> = {
  sekolah: { bg: 'bg-blue-50 dark:bg-blue-950/30', text: 'text-blue-700 dark:text-blue-300', dot: 'bg-blue-500' },
  puskesmas: { bg: 'bg-red-50 dark:bg-red-950/30', text: 'text-red-700 dark:text-red-300', dot: 'bg-red-500' },
  desa: { bg: 'bg-amber-50 dark:bg-amber-950/30', text: 'text-amber-700 dark:text-amber-300', dot: 'bg-amber-500' },
  ibadah: { bg: 'bg-emerald-50 dark:bg-emerald-950/30', text: 'text-emerald-700 dark:text-emerald-300', dot: 'bg-emerald-500' },
  wisata: { bg: 'bg-purple-50 dark:bg-purple-950/30', text: 'text-purple-700 dark:text-purple-300', dot: 'bg-purple-500' },
  umkm: { bg: 'bg-orange-50 dark:bg-orange-950/30', text: 'text-orange-700 dark:text-orange-300', dot: 'bg-orange-500' },
  lapangan: { bg: 'bg-green-50 dark:bg-green-950/30', text: 'text-green-700 dark:text-green-300', dot: 'bg-green-500' },
  jembatan: { bg: 'bg-cyan-50 dark:bg-cyan-950/30', text: 'text-cyan-700 dark:text-cyan-300', dot: 'bg-cyan-500' },
  sungai: { bg: 'bg-sky-50 dark:bg-sky-950/30', text: 'text-sky-700 dark:text-sky-300', dot: 'bg-sky-500' },
  pasar: { bg: 'bg-pink-50 dark:bg-pink-950/30', text: 'text-pink-700 dark:text-pink-300', dot: 'bg-pink-500' },
  perkebunan: { bg: 'bg-lime-50 dark:bg-lime-950/30', text: 'text-lime-700 dark:text-lime-300', dot: 'bg-lime-500' },
}

interface CategoryBadgeProps {
  slug: string
  name?: string
  className?: string
  active?: boolean
  onClick?: () => void
}

export function CategoryBadge({ slug, name, className, active, onClick }: CategoryBadgeProps) {
  const { t } = useTranslation()
  const colors = categoryColors[slug] || { bg: 'bg-gray-50 dark:bg-gray-950/30', text: 'text-gray-700 dark:text-gray-300', dot: 'bg-gray-400' }
  const label = name || t(`category.${slug}`, slug)

  const Component = onClick ? 'button' : 'span'

  return (
    <Component
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200',
        active
          ? `${colors.bg} ${colors.text} ring-2 ring-offset-1 ring-offset-surface ${colors.dot.replace('bg-', 'ring-')}`
          : `${colors.bg} ${colors.text}`,
        onClick && 'cursor-pointer hover:scale-[1.03] active:scale-[0.97]',
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', colors.dot)} />
      {label}
    </Component>
  )
}
