import { useLocations } from '../hooks/useLocations'
import { useCategories } from '../hooks/useCategories'
import { useDemographics } from '../hooks/useDemographics'
import { useHamlets } from '../hooks/useHamlets'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { ArrowRight, MapPin, Tag, Users, Mountain } from 'lucide-react'
import { LocationCard } from '../components/LocationCard'
import { CategoryBadge } from '../components/CategoryBadge'
import { AnimatedSection } from '../components/AnimatedSection'
import { DemografiChart } from '../components/DemografiChart'
import { ErrorState } from '../components/ErrorState'
import { filterByCategory, toChartData, getPopulationSummary } from '../lib/demographics'
import { formatNumber } from '../lib/utils'
import { DashboardStatCard } from '../components/admin/DashboardStatCard'
import { motion } from 'framer-motion'
import type { Location } from '../types'

export function HomePage() {
  const { t } = useTranslation()
  const { data: locations, isLoading, isError, refetch } = useLocations()
  const { data: categories } = useCategories()
  const { data: demographics } = useDemographics()
  const { data: hamlets } = useHamlets()
  const featuredLocations = locations?.filter((loc: Location) => loc.featured).slice(0, 6) || []

  const penduduk = getPopulationSummary(hamlets, demographics)
  const pekerjaanData = toChartData(filterByCategory(demographics ?? [], 'pekerjaan'))

  if (isError) {
    return <ErrorState onRetry={refetch} />
  }

  return (
    <div className="min-h-screen bg-[#F4F4F3] text-neutral-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-neutral-200 text-neutral-700 text-xs font-semibold uppercase tracking-wider mb-6 shadow-xs">
                <MapPin className="w-3.5 h-3.5 text-neutral-900" />
                {t('hero.region')}
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-neutral-900 tracking-tight leading-[1.15] mb-6"
            >
              {t('hero.title')}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-neutral-500 max-w-2xl mb-8 leading-relaxed font-normal"
            >
              {t('hero.subtitle')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center gap-3"
            >
              <Link
                to="/map"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
              >
                {t('hero.cta')}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/desa"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-neutral-200/80 text-neutral-700 hover:text-neutral-900 hover:border-neutral-300 text-xs font-semibold shadow-xs transition-all cursor-pointer"
              >
                {t('nav.profil_desa')}
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stat Cards Row */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <DashboardStatCard
              label={t('stats.locations')}
              value={`${locations?.length || 0} Lokasi`}
              icon={MapPin}
              trend="+100% tercatat"
              trendUp={true}
              bars={[20, 35, 50, 40, 70, 90, 60]}
            />
            <DashboardStatCard
              label={t('stats.categories')}
              value={`${categories?.length || 0} Kategori`}
              icon={Tag}
              trend="Fasilitas & Potensi"
              trendUp={true}
              bars={[30, 40, 35, 60, 50, 75, 95]}
            />
            <DashboardStatCard
              label={t('stats.population')}
              value={`${formatNumber(penduduk.total)} Jiwa`}
              icon={Mountain}
              trend="Data terbaru"
              trendUp={true}
              bars={[40, 50, 65, 55, 80, 70, 85]}
            />
            <DashboardStatCard
              label={t('stats.coverage')}
              value="100% Wilayah"
              icon={Users}
              trend="Terpetakan"
              trendUp={true}
              bars={[15, 30, 45, 60, 75, 85, 100]}
            />
          </div>
        </AnimatedSection>
      </section>

      {/* Demografi Warga Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-neutral-200/50">
        <AnimatedSection>
          <div className="mb-8">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-neutral-900 tracking-tight">
              {t('demografi.title')}
            </h2>
            <p className="text-xs text-neutral-500 mt-1">{t('demografi.subtitle')}</p>
          </div>

          {/* Summary Card */}
          <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 md:p-8 mb-6 shadow-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="text-center md:text-left">
                <div className="font-heading text-4xl md:text-5xl font-bold text-neutral-900">
                  {formatNumber(penduduk.total)}
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
                    {formatNumber(penduduk.laki_laki)}
                  </div>
                  <div className="text-xs font-medium text-neutral-400 mt-0.5">{t('demografi.male')}</div>
                </div>
                <div>
                  <div className="font-heading text-2xl font-bold text-neutral-900">
                    {formatNumber(penduduk.perempuan)}
                  </div>
                  <div className="text-xs font-medium text-neutral-400 mt-0.5">{t('demografi.female')}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1">
            <DemografiChart title={t('demografi.pekerjaan')} data={pekerjaanData} barColor="#06B6D4" delay={0.1} />
          </div>
        </AnimatedSection>
      </section>

      {/* Featured Locations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-neutral-200/50">
        <AnimatedSection>
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-neutral-900 tracking-tight">
                {t('featured.title')}
              </h2>
              <p className="text-xs text-neutral-500 mt-1">{t('featured.subtitle')}</p>
            </div>
            <Link
              to="/map"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-900 hover:underline"
            >
              {t('featured.view_all')} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </AnimatedSection>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl border border-neutral-200/80 bg-white p-4 h-48 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredLocations.map((location: Location, i: number) => {
              const category = categories?.find((c) => c.id === location.category_id)
              return (
                <AnimatedSection key={location.id} delay={i * 0.08}>
                  <LocationCard location={location} category={category} featured />
                </AnimatedSection>
              )
            })}
          </div>
        )}
      </section>

      {/* Categories Section */}
      <section className="border-t border-neutral-200/50 py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="font-heading text-2xl font-bold text-neutral-900 tracking-tight mb-2">
              {t('categories.title')}
            </h2>
            <p className="text-xs text-neutral-500 mb-6">{t('categories.subtitle')}</p>
            <div className="flex flex-wrap justify-center gap-2">
              {categories?.map((cat) => (
                <Link key={cat.id} to={`/map?category=${cat.slug}`}>
                  <CategoryBadge slug={cat.slug} name={cat.name_id} />
                </Link>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
