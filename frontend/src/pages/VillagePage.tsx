import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useProfile } from '../hooks/useProfile'
import { useDemographics } from '../hooks/useDemographics'
import { useApbd } from '../hooks/useApbd'
import { usePeriods } from '../hooks/usePeriods'
import { useHamlets } from '../hooks/useHamlets'
import { ErrorState } from '../components/ErrorState'
import { ProfileHero } from '../components/village/ProfileHero'
import { SectionNav, type SectionNavItem } from '../components/village/SectionNav'
import { VisionMissionSection } from '../components/village/VisionMissionSection'
import { RegionFactsSection } from '../components/village/RegionFactsSection'
import { FacilitySummarySection } from '../components/village/FacilitySummarySection'
import { VillageMiniMap } from '../components/village/VillageMiniMap'
import { DemografiSection } from '../components/village/DemografiSection'
import { HamletSection } from '../components/village/HamletSection'
import { ApbdSection } from '../components/village/ApbdSection'
import { PeriodSlider } from '../components/village/PeriodSlider'

export function VillagePage() {
  const { t } = useTranslation()
  const profileQuery = useProfile()
  const demographicsQuery = useDemographics()
  const apbdQuery = useApbd()
  const periodsQuery = usePeriods()
  const hamletsQuery = useHamlets()

  const profile = profileQuery.data

  const isError = profileQuery.isError || demographicsQuery.isError || apbdQuery.isError ||
    periodsQuery.isError || hamletsQuery.isError

  // Nav hanya memuat seksi yang benar-benar dirender, supaya tidak ada anchor
  // yang menggantung ke seksi yang disembunyikan karena datanya kosong.
  const hasVisionMission = Boolean(profile?.vision_id?.trim() || profile?.mission_id?.trim())
  const hasRegion = Boolean(
    profile &&
      (profile.area_km2 != null ||
        profile.altitude_m != null ||
        profile.rw_count != null ||
        profile.rt_count != null ||
        profile.boundary_north ||
        profile.boundary_south ||
        profile.boundary_east ||
        profile.boundary_west)
  )

  const navItems = useMemo<SectionNavItem[]>(() => {
    const items: SectionNavItem[] = []
    if (profile) items.push({ id: 'gambaran-umum', label: t('village.nav_overview') })
    if (hasVisionMission) items.push({ id: 'visi-misi', label: t('village.nav_vision') })
    if (hasRegion) items.push({ id: 'wilayah', label: t('village.nav_region') })
    items.push({ id: 'fasilitas', label: t('village.nav_facilities') })
    if (hamletsQuery.data?.length) items.push({ id: 'dusun', label: t('village.nav_hamlets') })
    if (demographicsQuery.data?.length) items.push({ id: 'demografi', label: t('village.nav_demographics') })
    if (apbdQuery.data?.length) items.push({ id: 'apbdes', label: t('village.nav_apbd') })
    if (periodsQuery.data?.length) items.push({ id: 'periode', label: t('village.nav_period') })
    return items
  }, [t, profile, hasVisionMission, hasRegion, hamletsQuery.data, demographicsQuery.data, apbdQuery.data, periodsQuery.data])

  const refetch = () => {
    profileQuery.refetch()
    demographicsQuery.refetch()
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

      <SectionNav items={navItems} />

      {profile && <VisionMissionSection profile={profile} />}
      {profile && <RegionFactsSection profile={profile} />}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-neutral-200/50">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <FacilitySummarySection />
          <VillageMiniMap />
        </div>
      </section>

      {hamletsQuery.data && <HamletSection rows={hamletsQuery.data} />}
      {demographicsQuery.data && <DemografiSection rows={demographicsQuery.data} />}
      {apbdQuery.data && <ApbdSection items={apbdQuery.data} />}
      {periodsQuery.data && <PeriodSlider periods={periodsQuery.data} />}
    </div>
  )
}
