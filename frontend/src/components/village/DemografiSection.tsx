import { useTranslation } from 'react-i18next'
import { Users } from 'lucide-react'
import { DemografiChart } from '../DemografiChart'
import { AnimatedSection } from '../AnimatedSection'
import { filterByCategory, toChartData, getTotal, getGenderSplit, getLatestYear } from '../../lib/demographics'
import type { DemographicRow } from '../../types'

interface DemografiSectionProps {
  rows: DemographicRow[]
}

export function DemografiSection({ rows }: DemografiSectionProps) {
  const { t } = useTranslation()
  if (rows.length === 0) return null

  const total = getTotal(rows)
  const { laki_laki, perempuan } = getGenderSplit(rows)
  const year = getLatestYear(rows)
  const pekerjaan = toChartData(filterByCategory(rows, 'pekerjaan'))

  return (
    <section id="demografi" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-neutral-200/50 scroll-mt-32">
      <AnimatedSection>
        <div className="mb-8">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-neutral-900 tracking-tight">
            {t('village.demographics')}
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            {year ? t('village.year', { year }) : ''}
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 md:p-8 mb-6 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="text-center md:text-left">
              <div className="font-heading text-4xl md:text-5xl font-bold text-neutral-900">
                {total.toLocaleString('id-ID')}
              </div>
              <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mt-1">
                {t('demografi.total')}
              </div>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto text-neutral-900">
              <Users className="w-8 h-8 text-neutral-900" />
            </div>
            <div className="grid grid-cols-2 gap-4 text-center md:text-left">
              <div>
                <div className="font-heading text-2xl font-bold text-neutral-900">
                  {laki_laki.toLocaleString('id-ID')}
                </div>
                <div className="text-xs font-medium text-neutral-400 mt-0.5">{t('demografi.male')}</div>
              </div>
              <div>
                <div className="font-heading text-2xl font-bold text-neutral-900">
                  {perempuan.toLocaleString('id-ID')}
                </div>
                <div className="text-xs font-medium text-neutral-400 mt-0.5">{t('demografi.female')}</div>
              </div>
            </div>
          </div>
        </div>

        {pekerjaan.length > 0 && (
          <div className="grid grid-cols-1">
            <DemografiChart title={t('demografi.pekerjaan')} data={pekerjaan} barColor="#06B6D4" delay={0.1} />
          </div>
        )}
      </AnimatedSection>
    </section>
  )
}
