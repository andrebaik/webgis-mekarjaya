import { useTranslation } from 'react-i18next'
import { Layers } from 'lucide-react'
import { cn } from '../../lib/utils'
import { CategoryBadge } from '../CategoryBadge'
import type { Category } from '../../types'

interface CategoryFilterBarProps {
  categories?: Category[]
  activeSlug: string
  onSelect: (slug: string) => void
  onSelectAll: () => void
}

// Chip di peta dibuat setinggi 44px (minimum target sentuh); di halaman lain
// CategoryBadge tetap memakai ukuran ringkas bawaannya.
const chip = 'min-h-11 px-3.5 shrink-0 text-xs'

export function CategoryFilterBar({ categories, activeSlug, onSelect, onSelectAll }: CategoryFilterBarProps) {
  const { t } = useTranslation()

  return (
    <div
      role="group"
      aria-label={t('map.filter_title')}
      className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1"
    >
      <button
        type="button"
        onClick={onSelectAll}
        aria-pressed={activeSlug === ''}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-xl border text-xs font-semibold shadow-sm transition-colors cursor-pointer',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 motion-reduce:transition-none',
          chip,
          activeSlug === ''
            ? 'bg-neutral-900 text-white border-neutral-900'
            : 'bg-white text-neutral-600 border-neutral-200/80 hover:text-neutral-900'
        )}
      >
        <Layers className="w-3.5 h-3.5" />
        {t('map.all')}
      </button>

      {categories?.map((cat) => (
        <CategoryBadge
          key={cat.id}
          slug={cat.slug}
          name={cat.name_id}
          active={activeSlug === cat.slug}
          onClick={() => onSelect(cat.slug)}
          className={cn(chip, 'shadow-sm')}
        />
      ))}
    </div>
  )
}
