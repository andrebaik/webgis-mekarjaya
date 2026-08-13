import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Info, MoreHorizontal } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { ApbdItem } from '../../types'
import { formatRp } from '../../lib/utils'

const compact = new Intl.NumberFormat('id-ID', { notation: 'compact', maximumFractionDigits: 1 })

interface RevenueChartProps {
  items: ApbdItem[]
}

export function RevenueChart({ items }: RevenueChartProps) {
  const { t } = useTranslation()
  const [timePeriod, setTimePeriod] = useState<'weekly' | 'monthly' | 'yearly'>('monthly')

  // Dikelompokkan per TAHUN, bukan per pos anggaran. Judulnya "Pendapatan &
  // Belanja", jadi sumbu waktu yang memberi arti — bukan daftar pos yang bisa
  // berjumlah belasan dan membuat labelnya bertumpuk.
  const data = useMemo(() => {
    const map = new Map<number, { year: number; pendapatan: number; belanja: number }>()
    for (const item of items) {
      const row = map.get(item.year) ?? { year: item.year, pendapatan: 0, belanja: 0 }
      // Cocokkan tipe secara eksplisit — baris 'pelaksanaan' adalah ringkasan
      // realisasi dan akan menggandakan angka bila ikut dijumlahkan di sini.
      if (item.type === 'pendapatan') row.pendapatan += item.amount
      else if (item.type === 'belanja') row.belanja += item.amount
      map.set(item.year, row)
    }
    return Array.from(map.values()).sort((a, b) => a.year - b.year)
  }, [items])

  const totalPendapatan = useMemo(
    () => data.reduce((sum, d) => sum + d.pendapatan, 0),
    [data]
  )

  return (
    <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 shadow-xs h-full flex flex-col">
      {/* Section Top Header: Title, Info Icon, Actions */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            {t('admin.revenue_chart')}
          </span>
          <Info className="w-3.5 h-3.5 text-neutral-400 cursor-pointer hover:text-neutral-600" />
        </div>
        <button
          aria-label="Actions"
          className="w-7 h-7 rounded-lg hover:bg-neutral-100 flex items-center justify-center text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Subheader: Total Value, Legend, & Time Pills */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-neutral-100">
        <div className="flex items-baseline gap-2">
          <span className="text-xs text-neutral-400 font-medium">Total APBDes :</span>
          <span className="font-heading text-2xl font-bold text-neutral-900">
            {formatRp(totalPendapatan)}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-xs font-medium text-neutral-500">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-900" />
            <span className="uppercase text-[11px] tracking-wider font-semibold text-neutral-600">
              {t('village.apbd_pendapatan')}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="uppercase text-[11px] tracking-wider font-semibold text-neutral-600">
              {t('village.apbd_belanja')}
            </span>
          </div>

          {/* Time Selector Pills */}
          <div className="bg-neutral-100/80 p-1 rounded-full flex items-center gap-1 text-xs">
            {(['weekly', 'monthly', 'yearly'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setTimePeriod(period)}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold capitalize transition-all cursor-pointer ${
                  timePeriod === period
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-400 hover:text-neutral-700'
                }`}
              >
                {period === 'weekly' ? 'Mingguan' : period === 'monthly' ? 'Bulanan' : 'Tahunan'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Display */}
      {data.length === 0 ? (
        <div className="flex-1 flex items-center justify-center py-12 text-sm text-neutral-400">
          {t('admin.no_data')}
        </div>
      ) : (
        <div className="flex-1 min-h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
              <XAxis
                dataKey="year"
                tick={{ fontSize: 11, fill: '#737373', fontWeight: 500 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#A3A3A3' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => compact.format(Number(v))}
                width={48}
              />
              <Tooltip
                formatter={(value) => formatRp(Number(value))}
                cursor={{ fill: '#F5F5F5', opacity: 0.7 }}
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E5E5',
                  borderRadius: 16,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  padding: '10px 14px',
                  fontSize: 12,
                  color: '#171717',
                }}
              />
              <Bar
                dataKey="pendapatan"
                name={t('village.apbd_pendapatan')}
                fill="#171717"
                radius={[6, 6, 0, 0]}
                maxBarSize={28}
              />
              <Bar
                dataKey="belanja"
                name={t('village.apbd_belanja')}
                fill="#10B981"
                radius={[6, 6, 0, 0]}
                maxBarSize={28}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
