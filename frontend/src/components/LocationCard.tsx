import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { MapPin, ArrowUpRight } from 'lucide-react'
import { CategoryBadge } from './CategoryBadge'
import type { Location, Category } from '../types'

interface LocationCardProps {
  location: Location
  category?: Category
  featured?: boolean
}

export function LocationCard({ location, category, featured }: LocationCardProps) {
  const [imgError, setImgError] = useState(false)
  const { t } = useTranslation()
  const name = location.name_id
  const desc = (location.description_id ?? '')
  const imgSrc = location.images?.[0] || ''

  return (
    <Link to={`/location/${location.slug}`} className="block group">
      <div
        className={`bg-white rounded-2xl border border-neutral-200/80 overflow-hidden shadow-xs hover:shadow-md hover:border-neutral-300 transition-all ${
          featured ? 'ring-2 ring-neutral-900/10' : ''
        }`}
      >
        <div className={`relative overflow-hidden ${featured ? 'h-48' : 'h-40'} bg-neutral-100`}>
          {imgSrc && !imgError ? (
            <img
              src={imgSrc}
              alt={name}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-100 to-neutral-200/60 flex items-center justify-center">
              <MapPin className="w-10 h-10 text-neutral-300" />
            </div>
          )}
          {featured && (
            <div className="absolute top-3 left-3">
              <span className="text-[10px] uppercase tracking-[0.15em] font-bold text-neutral-900 bg-white/90 backdrop-blur-md border border-neutral-200 shadow-xs px-2.5 py-1 rounded-full">
                {t('location.featured_badge')}
              </span>
            </div>
          )}
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-heading font-bold text-base text-neutral-900 leading-snug group-hover:text-neutral-700 transition-colors line-clamp-1">
              {name}
            </h3>
            <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0 mt-0.5" />
          </div>

          {category && (
            <CategoryBadge slug={category.slug} name={category.name_id} className="mb-2.5" />
          )}

          {desc && (
            <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed font-normal">
              {desc}
            </p>
          )}

          <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-neutral-100 text-[11px] text-neutral-400 font-mono">
            <MapPin className="w-3.5 h-3.5 text-neutral-400" />
            <span>
              {location.coordinates[1].toFixed(4)}, {location.coordinates[0].toFixed(4)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
