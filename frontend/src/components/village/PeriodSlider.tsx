import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronLeft, ChevronRight, CheckCircle2, Clock } from 'lucide-react'
import { AnimatedSection } from '../AnimatedSection'
import type { VillagePeriod } from '../../types'

interface PeriodSliderProps {
  periods: VillagePeriod[]
}

export function PeriodSlider({ periods }: PeriodSliderProps) {
  const { t } = useTranslation()
  const [index, setIndex] = useState(0)

  if (periods.length === 0) return null

  const current = periods[index]
  const desc = (current.description_id ?? '')

  const next = () => setIndex((i) => (i + 1) % periods.length)
  const prev = () => setIndex((i) => (i - 1 + periods.length) % periods.length)

  return (
    <section id="periode" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-neutral-200/50 scroll-mt-32">
      <AnimatedSection>
        <div className="mb-8">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-neutral-900 tracking-tight">{t('village.period_title')}</h2>
        </div>

        <div className="relative bg-white rounded-3xl border border-neutral-200/80 overflow-hidden shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
            {/* Photo / name */}
            <div className="bg-neutral-50 p-8 flex flex-col items-center justify-center text-center border-b lg:border-b-0 lg:border-r border-neutral-200/60">
              {current.photo_url ? (
                <img
                  src={current.photo_url}
                  alt={current.name}
                  className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-xs"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-neutral-900 text-white flex items-center justify-center font-heading text-3xl font-bold shadow-xs">
                  {current.name.charAt(0)}
                </div>
              )}
              <h3 className="font-heading text-xl font-bold text-neutral-900 mt-4">{current.name}</h3>
              <p className="text-xs font-semibold text-neutral-400 mt-1 uppercase tracking-wider">
                {current.year_start} – {current.year_end}
              </p>
            </div>

            {/* Programs */}
            <div className="lg:col-span-2 p-8">
              {desc && <p className="text-xs text-neutral-500 mb-6 leading-relaxed font-normal">{desc}</p>}
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-4">
                {t('village.period_program')}
              </h4>
              <ul className="space-y-3">
                {current.programs.map((program) => {
                  const title = program.title_id
                  return (
                    <li key={program.id} className="flex items-start gap-3">
                      {program.status === 'selesai' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      ) : (
                        <Clock className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                      )}
                      <div>
                        <div className="text-xs font-semibold text-neutral-900">{title}</div>
                        <div className="text-[11px] text-neutral-400 mt-0.5">
                          {program.year ? `${program.year} · ` : ''}
                          <span className={program.status === 'selesai' ? 'text-emerald-600 font-semibold' : 'text-amber-600 font-semibold'}>
                            {t(`village.program_status_${program.status}`)}
                          </span>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>

          {/* Controls */}
          {periods.length > 1 && (
            <div className="absolute bottom-4 right-4 flex items-center gap-2">
              <button
                onClick={prev}
                className="p-2 rounded-xl bg-neutral-100 border border-neutral-200 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-200/60 transition-all cursor-pointer shadow-xs"
                aria-label="Previous period"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-semibold text-neutral-500">
                {index + 1} / {periods.length}
              </span>
              <button
                onClick={next}
                className="p-2 rounded-xl bg-neutral-100 border border-neutral-200 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-200/60 transition-all cursor-pointer shadow-xs"
                aria-label="Next period"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </AnimatedSection>
    </section>
  )
}
