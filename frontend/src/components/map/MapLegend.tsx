import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDown, Info } from 'lucide-react'
import { cn } from '../../lib/utils'
import { categoryColor } from '../../lib/leafletIcons'
import type { Category, Location } from '../../types'

interface MapLegendProps {
  categories?: Category[]
  locations?: Location[]
}

/**
 * Legenda warna marker. Tanpa ini, warna penanda di peta tidak punya arti apa pun
 * bagi pengunjung. Hanya menampilkan kategori yang benar-benar punya lokasi.
 */
export function MapLegend({ categories, locations }: MapLegendProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  const terpakai = (categories ?? []).filter((cat) =>
    (locations ?? []).some((loc) => loc.category_id === cat.id)
  )

  if (terpakai.length === 0) return null

  return (
    // Di mobile diangkat ke atas gagang bottom sheet (peek ±76px) supaya tidak saling timpa.
    <div className="absolute bottom-[5.5rem] md:bottom-3 right-3 z-[1000] max-w-[calc(100vw-1.5rem)]">
      <div className="rounded-2xl bg-white/95 backdrop-blur-sm border border-neutral-200/80 shadow-sm overflow-hidden">
        <button
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label={t('map.legend_toggle')}
          className={cn(
            'min-h-11 w-full px-3.5 flex items-center gap-2 text-xs font-bold text-neutral-700 cursor-pointer',
            'hover:bg-neutral-50 transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-inset'
          )}
        >
          <Info className="w-3.5 h-3.5 text-neutral-400" />
          <span className="uppercase tracking-wider text-[10px]">{t('map.legend')}</span>
          <ChevronDown
            className={cn(
              'w-3.5 h-3.5 text-neutral-400 ml-auto transition-transform duration-200 motion-reduce:transition-none',
              open && 'rotate-180'
            )}
          />
        </button>

        {open && (
          <div className="px-3.5 pb-3 pt-1 border-t border-neutral-200/60 max-h-[40vh] overflow-y-auto">
            <ul className="space-y-1.5">
              {terpakai.map((cat) => (
                <li key={cat.id} className="flex items-center gap-2.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: categoryColor(cat.slug) }}
                  />
                  <span className="text-[11px] font-medium text-neutral-600 whitespace-nowrap">
                    {cat.name_id}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
