import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { MapPin } from 'lucide-react'
import { ScrollArea } from '../ui/scroll-area'
import { cn } from '../../lib/utils'
import { categoryColor } from '../../lib/leafletIcons'
import type { Location, Category } from '../../types'

interface LocationSidebarProps {
  locations: Location[]
  categoryMap: Map<number, Category>
  activeMarker: number | null
  onHover: (id: number | null) => void
}

export function LocationSidebar({ locations, categoryMap, activeMarker, onHover }: LocationSidebarProps) {
  const { t } = useTranslation()

  return (
    <aside
      aria-label={t('map.list_title')}
      className="w-80 border-r border-neutral-200/50 bg-[#F4F4F3] shrink-0 hidden md:flex flex-col"
    >
      <div className="shrink-0 px-4 py-3 border-b border-neutral-200/50 flex items-baseline justify-between gap-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
          {t('map.list_title')}
        </h2>
        <span className="text-[11px] font-semibold text-neutral-400">
          {t('map.result_count', { count: locations.length })}
        </span>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2">
          {locations.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="w-8 h-8 mx-auto text-neutral-400 mb-2" />
              <p className="text-xs text-neutral-400">{t('map.no_results')}</p>
            </div>
          ) : (
            locations.map((loc) => {
              const cat = categoryMap.get(loc.category_id)
              const active = activeMarker === loc.id

              return (
                <Link
                  key={loc.id}
                  to={`/location/${loc.slug}`}
                  onMouseEnter={() => onHover(loc.id)}
                  onMouseLeave={() => onHover(null)}
                  // Sorotan marker sebelumnya hanya lewat hover, jadi pengguna keyboard
                  // tidak pernah melihatnya. Focus disamakan dengan hover.
                  onFocus={() => onHover(loc.id)}
                  onBlur={() => onHover(null)}
                  className={cn(
                    'block min-h-11 p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900',
                    'motion-reduce:transition-none',
                    active
                      ? 'bg-white border-neutral-900 shadow-sm ring-1 ring-neutral-900/10'
                      : 'bg-white border-neutral-200/80 hover:border-neutral-400 shadow-xs'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="w-3 h-3 rounded-full mt-1 shrink-0"
                      style={{ backgroundColor: categoryColor(cat?.slug) }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-neutral-900 truncate">{loc.name_id}</p>
                      <p className="text-[11px] text-neutral-400 font-medium mt-0.5 truncate">
                        {cat ? cat.name_id : ''}
                      </p>
                    </div>
                  </div>
                </Link>
              )
            })
          )}
        </div>
      </ScrollArea>
    </aside>
  )
}
