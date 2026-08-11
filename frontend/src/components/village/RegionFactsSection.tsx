import { useTranslation } from 'react-i18next'
import { Maximize2, Mountain, Home, Users, Compass } from 'lucide-react'
import { motion } from 'framer-motion'
import { AnimatedSection } from '../AnimatedSection'
import { itemStagger } from '../../lib/motion'
import type { VillageProfile } from '../../types'
import { SectionHeading } from '../ui/SectionHeading'
import { CountUp } from '../ui/CountUp'

interface RegionFactsSectionProps {
  profile: VillageProfile
}

export function RegionFactsSection({ profile }: RegionFactsSectionProps) {
  const { t } = useTranslation()

  // mysql2 mengirim DECIMAL sebagai string, jadi normalkan dulu sebelum diformat.
  const area = profile.area_km2 == null ? null : Number(profile.area_km2)

  // `raw` dipakai CountUp (butuh angka), bukan string terformat.
  const facts = [
    area != null && !Number.isNaN(area)
      ? { icon: Maximize2, label: t('village.area'), raw: area, unit: t('village.area_unit') }
      : null,
    profile.altitude_m != null
      ? { icon: Mountain, label: t('village.altitude'), raw: profile.altitude_m, unit: t('village.altitude_unit') }
      : null,
    profile.rw_count != null
      ? { icon: Home, label: t('village.rw_count'), raw: profile.rw_count, unit: 'RW' }
      : null,
    profile.rt_count != null
      ? { icon: Users, label: t('village.rt_count'), raw: profile.rt_count, unit: 'RT' }
      : null,
  ].filter((f): f is NonNullable<typeof f> => f !== null)

  const boundaries = [
    { label: t('village.boundary_north'), value: profile.boundary_north },
    { label: t('village.boundary_south'), value: profile.boundary_south },
    { label: t('village.boundary_east'), value: profile.boundary_east },
    { label: t('village.boundary_west'), value: profile.boundary_west },
  ].filter((b) => b.value)

  if (facts.length === 0 && boundaries.length === 0) return null

  return (
    <section id="wilayah" className="border-t border-border/60 bg-surface-card py-16 md:py-20 scroll-mt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <AnimatedSection>
        <SectionHeading
          eyebrow={t('village.eyebrow_region')}
          title={t('village.region')}
          subtitle={t('village.region_subtitle')}
        />
      </AnimatedSection>

        {facts.length > 0 && (
          <AnimatedSection stagger className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {facts.map((fact) => (
              <motion.div
                key={fact.label}
                variants={itemStagger}
                className="bg-surface rounded-2xl border border-border p-5"
              >
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mb-3">
                  <fact.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="font-heading text-3xl font-bold text-foreground">
                  <CountUp value={fact.raw} />
                  <span className="text-sm font-semibold text-muted-foreground ml-1">{fact.unit}</span>
                </div>
                <div className="text-xs font-medium text-muted-foreground mt-1">{fact.label}</div>
              </motion.div>
            ))}
          </AnimatedSection>
        )}

        {boundaries.length > 0 && (
          <div className="bg-surface rounded-3xl border border-border p-6 md:p-8">
            <h3 className="font-heading font-bold text-sm text-foreground uppercase tracking-wider mb-5 flex items-center gap-2">
              <Compass className="w-4 h-4 text-primary" />
              {t('village.boundaries')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {boundaries.map((boundary) => (
                <div key={boundary.label} className="flex items-start gap-3 px-4 py-3 rounded-2xl bg-muted border border-border/60">
                  <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-muted-foreground w-14 mt-0.5">
                    {boundary.label}
                  </span>
                  <span className="text-sm font-medium text-foreground">{boundary.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
