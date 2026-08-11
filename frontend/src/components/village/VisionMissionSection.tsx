import { useTranslation } from 'react-i18next'
import { Target, Quote } from 'lucide-react'
import { AnimatedSection } from '../AnimatedSection'
import type { VillageProfile } from '../../types'

interface VisionMissionSectionProps {
  profile: VillageProfile
}

export function VisionMissionSection({ profile }: VisionMissionSectionProps) {
  const { t } = useTranslation()

  const vision = profile.vision_id?.trim()
  // Satu poin misi per baris (lihat konvensi kolom mission_id).
  const missions = (profile.mission_id ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  if (!vision && missions.length === 0) return null

  return (
    <section id="visi-misi" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-neutral-200/50 scroll-mt-32">
      <AnimatedSection>
        <div className="mb-8">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-neutral-900 tracking-tight">
            {t('village.vision_mission')}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {vision && (
            <div className="bg-neutral-900 rounded-3xl p-8 md:p-10 text-white relative overflow-hidden">
              <Quote className="w-16 h-16 text-white/10 absolute top-6 right-6" />
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[11px] font-semibold uppercase tracking-wider mb-5">
                {t('village.vision')}
              </div>
              <p className="font-heading text-lg md:text-xl leading-relaxed font-medium relative">
                {vision}
              </p>
            </div>
          )}

          {missions.length > 0 && (
            <div className="bg-white rounded-3xl border border-neutral-200/80 p-8 md:p-10 shadow-xs">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-800 text-[11px] font-semibold uppercase tracking-wider mb-5">
                <Target className="w-3.5 h-3.5 text-neutral-900" />
                {t('village.mission')}
              </div>
              <ol className="space-y-3">
                {missions.map((mission, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="shrink-0 w-6 h-6 rounded-lg bg-neutral-900 text-white text-[11px] font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-sm text-neutral-600 leading-relaxed">{mission}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </AnimatedSection>
    </section>
  )
}
