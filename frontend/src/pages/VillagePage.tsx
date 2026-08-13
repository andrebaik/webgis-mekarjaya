import { useProfile } from '../hooks/useProfile'
import { useApbd } from '../hooks/useApbd'
import { usePeriods } from '../hooks/usePeriods'
import { useHamlets } from '../hooks/useHamlets'
import { ErrorState } from '../components/ErrorState'
import { ProfileHero } from '../components/village/ProfileHero'
import { VisionMissionSection } from '../components/village/VisionMissionSection'
import { RegionFactsSection } from '../components/village/RegionFactsSection'
import { FacilitySummarySection } from '../components/village/FacilitySummarySection'
import { VillageMiniMap } from '../components/village/VillageMiniMap'
import { HamletSection } from '../components/village/HamletSection'
import { ApbdSection } from '../components/village/ApbdSection'
import { PeriodSlider } from '../components/village/PeriodSlider'

export function VillagePage() {
  const profileQuery = useProfile()
  const apbdQuery = useApbd()
  const periodsQuery = usePeriods()
  const hamletsQuery = useHamlets()

  const profile = profileQuery.data

  const isError =
    profileQuery.isError || apbdQuery.isError || periodsQuery.isError || hamletsQuery.isError

  const refetch = () => {
    profileQuery.refetch()
    apbdQuery.refetch()
    periodsQuery.refetch()
    hamletsQuery.refetch()
  }

  if (isError) {
    return <ErrorState onRetry={refetch} />
  }

  return (
    <div className="min-h-screen">
      {profile && <ProfileHero profile={profile} />}

      {profile && <VisionMissionSection profile={profile} />}
      {profile && <RegionFactsSection profile={profile} />}

      <section className="border-t border-border/60 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-8 items-start">
            <FacilitySummarySection />
            <VillageMiniMap />
          </div>
        </div>
      </section>

      {hamletsQuery.data && <HamletSection rows={hamletsQuery.data} />}
      {apbdQuery.data && <ApbdSection items={apbdQuery.data} />}
      {periodsQuery.data && <PeriodSlider periods={periodsQuery.data} />}
    </div>
  )
}
