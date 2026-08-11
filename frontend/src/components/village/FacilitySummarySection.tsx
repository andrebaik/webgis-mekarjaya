import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { AnimatedSection } from '../AnimatedSection'
import { itemStagger } from '../../lib/motion'
import { useLocations } from '../../hooks/useLocations'
import { useCategories } from '../../hooks/useCategories'
import { categoryColor } from '../../lib/leafletIcons'
import { SectionHeading } from '../ui/SectionHeading'

const MotionLink = motion.create(Link)

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
        <SectionHeading
          eyebrow={t('village.eyebrow_facilities')}
          title={t('village.facilities')}
          subtitle={t('village.facilities_subtitle')}
          className="mb-8"
        />
      </AnimatedSection>

      {/* Kartu muncul berurutan, bukan serentak — mata jadi punya arah baca. */}
      <AnimatedSection stagger className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {summary.map((cat) => (
          <MotionLink
            key={cat.id}
            to={`/map?category=${cat.slug}`}
            variants={itemStagger}
            whileHover={{ y: -3 }}
            transition={{ type: 'spring', stiffness: 400, damping: 26 }}
            className="group bg-surface-card rounded-2xl border border-border p-4 transition-colors hover:border-foreground/30 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <span
                className="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0"
                style={{ backgroundColor: categoryColor(cat.slug) }}
              />
              <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors motion-reduce:transition-none" />
            </div>
            <div className="font-heading text-3xl font-bold text-foreground leading-none">
              {cat.count}
            </div>
            <div className="text-xs font-semibold text-muted-foreground mt-2 leading-tight">
              {cat.name_id}
            </div>
          </MotionLink>
        ))}
      </AnimatedSection>
    </div>
  )
}
