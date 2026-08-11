import { useTranslation } from 'react-i18next'
import { Maximize2, Mountain, Home, Users, Compass } from 'lucide-react'
import { AnimatedSection } from '../AnimatedSection'
import { formatNumber } from '../../lib/utils'
import type { VillageProfile } from '../../types'

interface RegionFactsSectionProps {
  profile: VillageProfile
}

export function RegionFactsSection({ profile }: RegionFactsSectionProps) {
  const { t } = useTranslation()

  // mysql2 mengirim DECIMAL sebagai string, jadi normalkan dulu sebelum diformat.
  const area = profile.area_km2 == null ? null : Number(profile.area_km2)

  const facts = [
    area != null && !Number.isNaN(area)
      ? { icon: Maximize2, label: t('village.area'), value: formatNumber(area), unit: t('village.area_unit') }
      : null,
    profile.altitude_m != null
      ? { icon: Mountain, label: t('village.altitude'), value: formatNumber(profile.altitude_m), unit: t('village.altitude_unit') }
      : null,
    profile.rw_count != null
      ? { icon: Home, label: t('village.rw_count'), value: formatNumber(profile.rw_count), unit: 'RW' }
      : null,
    profile.rt_count != null
      ? { icon: Users, label: t('village.rt_count'), value: formatNumber(profile.rt_count), unit: 'RT' }
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
    <section id="wilayah" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-neutral-200/50 scroll-mt-32">
      <AnimatedSection>
        <div className="mb-8">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-neutral-900 tracking-tight">
            {t('village.region')}
          </h2>
          <p className="text-xs text-neutral-500 mt-1">{t('village.region_subtitle')}</p>
        </div>

        {facts.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {facts.map((fact) => (
              <div key={fact.label} className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center mb-3">
                  <fact.icon className="w-5 h-5 text-neutral-900" />
                </div>
                <div className="font-heading text-2xl font-bold text-neutral-900">
                  {fact.value}
                  <span className="text-sm font-semibold text-neutral-400 ml-1">{fact.unit}</span>
                </div>
                <div className="text-xs font-medium text-neutral-400 mt-0.5">{fact.label}</div>
              </div>
            ))}
          </div>
        )}

        {boundaries.length > 0 && (
          <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 md:p-8 shadow-xs">
            <h3 className="font-heading font-bold text-sm text-neutral-900 uppercase tracking-wider mb-5 flex items-center gap-2">
              <Compass className="w-4 h-4 text-neutral-900" />
              {t('village.boundaries')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {boundaries.map((boundary) => (
                <div key={boundary.label} className="flex items-start gap-3 px-4 py-3 rounded-2xl bg-neutral-100/60 border border-neutral-200/60">
                  <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-neutral-400 w-14 mt-0.5">
                    {boundary.label}
                  </span>
                  <span className="text-sm font-medium text-neutral-700">{boundary.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </AnimatedSection>
    </section>
  )
}
