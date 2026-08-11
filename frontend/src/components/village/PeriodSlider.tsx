import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronLeft, ChevronRight, CheckCircle2, Clock } from 'lucide-react'
import { AnimatedSection } from '../AnimatedSection'
import type { VillagePeriod } from '../../types'
import { SectionHeading } from '../ui/SectionHeading'

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
    <section id="periode" className="border-t border-border/60 py-16 md:py-20 scroll-mt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <AnimatedSection>
        <SectionHeading eyebrow={t('village.eyebrow_period')} title={t('village.period_title')} />

        <div className="relative bg-surface-card rounded-3xl border border-border overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
            {/* Photo / name */}
            <div className="bg-muted p-8 flex flex-col items-center justify-center text-center border-b lg:border-b-0 lg:border-r border-border/60">
              {current.photo_url ? (
                <img
                  src={current.photo_url}
                  alt={current.name}
                  className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-xs"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-foreground text-white flex items-center justify-center font-heading text-3xl font-bold">
                  {current.name.charAt(0)}
                </div>
              )}
              <h3 className="font-heading text-xl font-bold text-foreground mt-4">{current.name}</h3>
              <p className="text-xs font-semibold text-muted-foreground mt-1 uppercase tracking-wider">
                {current.year_start} – {current.year_end}
              </p>
            </div>

            {/* Programs */}
            <div className="lg:col-span-2 p-8">
              {desc && <p className="text-xs text-muted-foreground mb-6 leading-relaxed font-normal">{desc}</p>}
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-4">
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
                        <div className="text-xs font-semibold text-foreground">{title}</div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">
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
                className="w-11 h-11 inline-flex items-center justify-center rounded-xl bg-muted border border-border text-muted-foreground hover:text-foreground hover:bg-border/60 transition-colors motion-reduce:transition-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
                aria-label="Previous period"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-semibold text-muted-foreground">
                {index + 1} / {periods.length}
              </span>
              <button
                onClick={next}
                className="w-11 h-11 inline-flex items-center justify-center rounded-xl bg-muted border border-border text-muted-foreground hover:text-foreground hover:bg-border/60 transition-colors motion-reduce:transition-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
                aria-label="Next period"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </AnimatedSection>
      </div>
    </section>
  )
}
