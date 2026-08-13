import { useMemo } from 'react'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { ExternalLink, MapPin, Tag, Users, Wallet } from 'lucide-react'
import { useLocations } from '../../hooks/useLocations'
import { useCategories } from '../../hooks/useCategories'
import { useHamlets } from '../../hooks/useHamlets'
import { getPopulationSummary } from '../../lib/demographics'
import { useApbd } from '../../hooks/useApbd'
import { usePeriods } from '../../hooks/usePeriods'
import { storage } from '../../lib/storage'
import { formatNumber, formatRp, formatRpCompact } from '../../lib/utils'
import { DashboardStatCard } from '../../components/admin/DashboardStatCard'
import { RevenueChart } from '../../components/admin/RevenueChart'
import { CategoryDonut } from '../../components/admin/CategoryDonut'
import { ApbdHealth } from '../../components/admin/ApbdHealth'
import { RecentLocations } from '../../components/admin/RecentLocations'
import { ProgramFeed } from '../../components/admin/ProgramFeed'

export function AdminDashboardPage() {
  const { t } = useTranslation()
  const locations = useLocations()
  const categories = useCategories()
  const hamlets = useHamlets()
  const apbd = useApbd()
  const periods = usePeriods()

  const locationList = locations.data ?? []
  const categoryList = categories.data ?? []

  const latestYear = useMemo(() => {
    const all = apbd.data ?? []
    return all.reduce((max, item) => Math.max(max, item.year), 0) || undefined
  }, [apbd.data])

  const apbdItems = useMemo(() => {
    const all = apbd.data ?? []
    return latestYear ? all.filter((item) => item.year === latestYear) : all
  }, [apbd.data, latestYear])

  // Pakai sumber yang sama persis dengan halaman publik. Sebelumnya dasbor hanya
  // membaca tabel `demographics`, sehingga menampilkan 0 jiwa padahal laporan
  // penduduk per dusun sudah terisi dan halaman depan menampilkan angka penuh.
  const population = useMemo(
    () => getPopulationSummary(hamlets.data).total,
    [hamlets.data]
  )

  const apbdTotals = useMemo(() => {
    let pendapatan = 0
    let belanja = 0
    // Cocokkan tipe secara eksplisit: baris 'pelaksanaan' adalah ringkasan
    // realisasi, bukan belanja. Pola `else` membuatnya ikut terjumlah dan
    // angka belanja di dasbor jadi lebih besar dari kenyataan.
    for (const item of apbdItems) {
      if (item.type === 'pendapatan') pendapatan += item.amount
      else if (item.type === 'belanja') belanja += item.amount
    }
    return { pendapatan, belanja, year: latestYear }
  }, [apbdItems, latestYear])

  const username = storage.getUsername() ?? 'Admin'

  return (
    <div className="space-y-6">
      {/* Greeting Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-neutral-900 tracking-tight">
            {t('admin.hello', { name: username })}
          </h1>
          <p className="text-xs text-neutral-400 font-medium mt-1">
            Ringkasan data fasilitas, wilayah, demografi & keuangan Desa Mekarjaya.
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-neutral-200/80 text-xs font-semibold text-neutral-700 hover:text-neutral-900 hover:border-neutral-300 shadow-xs transition-all w-fit"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          {t('admin.view_site')}
        </Link>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardStatCard
          label={t('admin.total_locations')}
          value={`${formatNumber(locationList.length)} Lokasi`}
          icon={MapPin}
          trend="+12% bulan ini"
          trendUp={true}
          bars={[20, 35, 50, 40, 70, 90, 60]}
        />
        <DashboardStatCard
          label={t('admin.total_categories')}
          value={`${formatNumber(categoryList.length)} Kategori`}
          icon={Tag}
          trend="+2 baru"
          trendUp={true}
          bars={[30, 40, 35, 60, 50, 75, 95]}
        />
        <DashboardStatCard
          label={t('admin.total_population')}
          value={`${formatNumber(population)} Jiwa`}
          icon={Users}
          trend="+0,94% tahun lalu"
          trendUp={true}
          bars={[40, 50, 65, 55, 80, 70, 85]}
        />
        <DashboardStatCard
          label={t('village.apbd_pendapatan')}
          value={formatRpCompact(apbdTotals.pendapatan)}
          icon={Wallet}
          hint={formatRp(apbdTotals.pendapatan)}
          trend="+8,4% sisa anggaran"
          trendUp={true}
          bars={[15, 30, 45, 60, 75, 85, 100]}
        />
      </div>

      {/* Main Chart Section: Revenue & APBD Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Seluruh tahun, bukan tahun terbaru saja: grafiknya kini bersumbu
              tahun, jadi memberi satu tahun hanya menghasilkan satu batang. */}
          <RevenueChart items={apbd.data ?? []} />
        </div>
        <CategoryDonut locations={locationList} categories={categoryList} />
      </div>

      {/* Widget Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ApbdHealth items={apbdItems} />
        <RecentLocations locations={locationList} categories={categoryList} />
        <ProgramFeed periods={periods.data ?? []} />
      </div>
    </div>
  )
}
