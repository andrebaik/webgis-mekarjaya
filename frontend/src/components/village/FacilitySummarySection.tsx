import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { ArrowUpRight } from 'lucide-react'
import { AnimatedSection } from '../AnimatedSection'
import { useLocations } from '../../hooks/useLocations'
import { useCategories } from '../../hooks/useCategories'
import { categoryColor } from '../../lib/leafletIcons'

export function FacilitySummarySection() {
  const { t } = useTranslation()
  const { data: locations } = useLocations()
  const { data: categories } = useCategories()

  const summary = useMemo(() => {
    if (!locations || !categories) return []
    const counts = new Map<number, number>()
    for (const loc of locations) {
      counts.set(loc.category_id, (counts.get(loc.category_id) ?? 0) + 1)
    }
    return categories
      .map((cat) => ({ ...cat, count: counts.get(cat.id) ?? 0 }))
      .filter((cat) => cat.count > 0)
      .sort((a, b) => b.count - a.count)
  }, [locations, categories])

  if (summary.length === 0) return null

  return (
    <div id="fasilitas" className="scroll-mt-32">
      <AnimatedSection>
        <div className="mb-6">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-neutral-900 tracking-tight">
            {t('village.facilities')}
          </h2>
          <p className="text-xs text-neutral-500 mt-1">{t('village.facilities_subtitle')}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {summary.map((cat) => (
            <Link
              key={cat.id}
              to={`/map?category=${cat.slug}`}
              className="group bg-white rounded-2xl border border-neutral-200/80 p-4 shadow-xs hover:shadow-md hover:border-neutral-300 transition-all"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <span
                  className="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0"
                  style={{ backgroundColor: categoryColor(cat.slug) }}
                />
                <ArrowUpRight className="w-3.5 h-3.5 text-neutral-300 group-hover:text-neutral-900 transition-colors" />
              </div>
              <div className="font-heading text-2xl font-bold text-neutral-900 leading-none">
                {cat.count}
              </div>
              <div className="text-xs font-semibold text-neutral-600 mt-1.5 leading-tight">
                {cat.name_id}
              </div>
            </Link>
          ))}
        </div>
      </AnimatedSection>
    </div>
  )
}
