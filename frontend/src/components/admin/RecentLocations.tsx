import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { MapPin, Star } from 'lucide-react'
import type { Category, Location } from '../../types'

interface RecentLocationsProps {
  locations: Location[]
  categories: Category[]
}

export function RecentLocations({ locations, categories }: RecentLocationsProps) {
  const { t } = useTranslation()
  const recent = [...locations].slice(-5).reverse()

  const catOf = (id: number) => categories.find((c) => c.id === id)

  return (
    <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-xs h-full flex flex-col justify-between">
      <div className="flex items-center justify-between gap-3 mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
          {t('admin.recent_locations')}
        </span>
        <Link
          to="/admin/locations"
          className="text-xs font-semibold text-neutral-900 hover:underline shrink-0"
        >
          {t('admin.view_all')}
        </Link>
      </div>

      {recent.length === 0 ? (
        <div className="py-6 flex items-center justify-center text-xs text-neutral-400">
          {t('admin.no_data')}
        </div>
      ) : (
        <ul className="space-y-1.5 flex-1">
          {recent.map((loc) => {
            const cat = catOf(loc.category_id)
            return (
              <li key={loc.id}>
                <Link
                  to="/admin/locations"
                  className="flex items-center gap-3 rounded-xl px-2.5 py-2 hover:bg-neutral-100/70 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-neutral-100 text-neutral-700 flex items-center justify-center shrink-0">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold text-neutral-900 truncate">
                      {loc.name_id}
                    </div>
                    {cat && (
                      <div className="text-[11px] text-neutral-400 truncate">
                        {t(`category.${cat.slug}`, cat.name_id)}
                      </div>
                    )}
                  </div>
                  {loc.featured && (
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
