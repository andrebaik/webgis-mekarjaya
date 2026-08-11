import { Marker, Popup } from 'react-leaflet'
import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { createCategoryIcon, categoryColor } from '../../lib/leafletIcons'
import type { Location, Category } from '../../types'

interface LocationMarkerProps {
  location: Location
  category?: Category
  active?: boolean
}

export function LocationMarker({ location, category, active = false }: LocationMarkerProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const name = location.name_id
  const catName = category ? category.name_id : ''
  const desc = (location.description_id ?? '')
  const coords = `${location.coordinates[1].toFixed(4)}°S, ${location.coordinates[0].toFixed(4)}°E`

  return (
    <Marker
      position={[location.coordinates[1], location.coordinates[0]]}
      icon={createCategoryIcon(category?.slug || '', active)}
    >
      <Popup maxWidth={300} minWidth={240} className="location-popup">
        <div className="space-y-2.5">
          {location.images?.[0] && (
            <div className="-mx-4 -mt-[14px] mb-2 rounded-t-xl overflow-hidden h-28">
              <img
                src={location.images[0]}
                alt={name}
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
            </div>
          )}
          <div className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: categoryColor(category?.slug) }}
            />
            <span className="text-xs font-medium text-muted-foreground tracking-wide uppercase">{catName}</span>
          </div>
          <h3 className="font-heading font-semibold text-foreground text-base leading-tight -mt-1">{name}</h3>
          {desc && (
            <p className="text-xs text-muted-foreground/80 leading-relaxed line-clamp-2">{desc}</p>
          )}
          <p className="text-[10px] text-muted-foreground/50 font-mono">{coords}</p>
          <button
            onClick={() => navigate(`/location/${location.slug}`)}
            className="w-full bg-primary text-white text-sm font-medium py-2 rounded-lg hover:bg-primary-dark transition-all duration-200 active:scale-[0.98] cursor-pointer"
          >
            {t('map.view_details')}
          </button>
        </div>
      </Popup>
    </Marker>
  )
}
