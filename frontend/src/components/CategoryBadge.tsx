import { useTranslation } from 'react-i18next'
import { cn } from '../lib/utils'

const categoryColors: Record<string, { bg: string; text: string; dot: string }> = {
  sekolah: { bg: 'bg-blue-50 border-blue-200/60', text: 'text-blue-700', dot: 'bg-blue-500' },
  puskesmas: { bg: 'bg-red-50 border-red-200/60', text: 'text-red-700', dot: 'bg-red-500' },
  desa: { bg: 'bg-amber-50 border-amber-200/60', text: 'text-amber-700', dot: 'bg-amber-500' },
  ibadah: { bg: 'bg-emerald-50 border-emerald-200/60', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  wisata: { bg: 'bg-purple-50 border-purple-200/60', text: 'text-purple-700', dot: 'bg-purple-500' },
  umkm: { bg: 'bg-orange-50 border-orange-200/60', text: 'text-orange-700', dot: 'bg-orange-500' },
  lapangan: { bg: 'bg-green-50 border-green-200/60', text: 'text-green-700', dot: 'bg-green-500' },
  jembatan: { bg: 'bg-cyan-50 border-cyan-200/60', text: 'text-cyan-700', dot: 'bg-cyan-500' },
  sungai: { bg: 'bg-sky-50 border-sky-200/60', text: 'text-sky-700', dot: 'bg-sky-500' },
  pasar: { bg: 'bg-pink-50 border-pink-200/60', text: 'text-pink-700', dot: 'bg-pink-500' },
  perkebunan: { bg: 'bg-lime-50 border-lime-200/60', text: 'text-lime-700', dot: 'bg-lime-500' },
  'fasilitas-umum': { bg: 'bg-indigo-50 border-indigo-200/60', text: 'text-indigo-700', dot: 'bg-indigo-500' },
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
  const colors = categoryColors[slug] || {
    bg: 'bg-neutral-100 border-neutral-200',
    text: 'text-neutral-700',
    dot: 'bg-neutral-400',
  }
  const label = name || t(`category.${slug}`, slug)

  const Component = onClick ? 'button' : 'span'

  return (
    <Component
      onClick={onClick}
      {...(onClick ? { type: 'button' as const, 'aria-pressed': Boolean(active) } : {})}
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border shadow-xs transition-all duration-200 motion-reduce:transition-none',
        active
          ? `${colors.bg} ${colors.text} ring-2 ring-neutral-900/20 font-bold`
          : `${colors.bg} ${colors.text}`,
        onClick &&
          'cursor-pointer hover:scale-[1.02] active:scale-[0.98] motion-reduce:hover:scale-100 motion-reduce:active:scale-100 ' +
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900',
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', colors.dot)} />
      {label}
    </Component>
  )
}
