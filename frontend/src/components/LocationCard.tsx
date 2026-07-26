import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { MapPin, ArrowUpRight } from 'lucide-react'
import { Card, CardContent } from './ui/card'
import { CategoryBadge } from './CategoryBadge'
import type { Location, Category } from '../types'

interface LocationCardProps {
  location: Location
  category?: Category
  featured?: boolean
}

export function LocationCard({ location, category, featured }: LocationCardProps) {
  const [imgError, setImgError] = useState(false)
  const { i18n } = useTranslation()
  const lang = i18n.language
  const name = (location as any)[`name_${lang}`] || location.name_id
  const desc = (location as any)[`description_${lang}`] || location.description_id
  const imgSrc = location.images?.[0] || ''

  return (
    <Link to={`/location/${location.slug}`} className="block group">
      <Card className={`overflow-hidden ${featured ? 'ring-2 ring-primary/20' : ''}`}>
        <div className={`relative overflow-hidden ${featured ? 'h-48' : 'h-36'}`}>
          {imgSrc && !imgError ? (
            <img
              src={imgSrc}
              alt={name}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 dark:from-primary/20 dark:via-secondary/10 dark:to-accent/20" />
          )}
          <div className="absolute inset-0 flex items-center justify-center">
            <MapPin className="w-10 h-10 text-primary/20 dark:text-primary/30" />
          </div>
          {featured && (
            <div className="absolute top-3 left-3">
              <span className="text-[10px] uppercase tracking-[0.15em] font-semibold text-primary bg-surface-card shadow-sm px-2.5 py-1 rounded-full shadow-sm">
                Unggulan
              </span>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-surface-card to-transparent" />
        </div>

        <CardContent className="p-5 -mt-4 relative">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-heading font-semibold text-lg text-foreground leading-snug group-hover:text-primary transition-colors duration-200 line-clamp-2">
                {name}
              </h3>
            </div>
            <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0 mt-1" />
          </div>

          {category && (
            <CategoryBadge slug={category.slug} name={(category as any)[`name_${lang}`] || category.name_id} className="mb-3" />
          )}

          {desc && (
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {desc}
            </p>
          )}

          <div className="flex items-center gap-1.5 mt-3 text-xs text-muted-foreground/70">
            <MapPin className="w-3 h-3" />
            <span className="font-mono">
              {location.coordinates[1].toFixed(4)}, {location.coordinates[0].toFixed(4)}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
