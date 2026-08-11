import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Home, Users, IdCard } from 'lucide-react'
import { AnimatedSection } from '../AnimatedSection'
import { formatNumber } from '../../lib/utils'
import type { Hamlet } from '../../types'

interface HamletSectionProps {
  rows: Hamlet[]
}

const NAMA_BULAN = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
]

const barColors = ['#171717', '#C2410C', '#10B981', '#06B6D4', '#8B5CF6', '#F59E0B', '#EC4899']

export function HamletSection({ rows }: HamletSectionProps) {
  const { t } = useTranslation()

  const data = useMemo(
    () =>
      [...rows]
        .sort((a, b) => a.rw - b.rw)
        .map((h) => ({ ...h, total: h.male + h.female })),
    [rows]
  )

  const total = useMemo(
    () =>
      data.reduce(
        (acc, h) => ({
          male: acc.male + h.male,
          female: acc.female + h.female,
          kk: acc.kk + (h.kk_count ?? 0),
          rt: acc.rt + (h.rt_count ?? 0),
          ktpDone: acc.ktpDone + (h.ktp_done ?? 0),
          ktpRequired: acc.ktpRequired + (h.ktp_required ?? 0),
        }),
        { male: 0, female: 0, kk: 0, rt: 0, ktpDone: 0, ktpRequired: 0 }
      ),
    [data]
  )

  if (data.length === 0) return null

  const periode = `${NAMA_BULAN[(data[0].month ?? 1) - 1] ?? ''} ${data[0].year}`
  const totalPenduduk = total.male + total.female
  const persenKtp = total.ktpRequired > 0 ? Math.round((total.ktpDone / total.ktpRequired) * 100) : null

  const chartData = data.map((h) => ({
    label: `RW ${h.rw} · ${h.name}`,
    total: h.total,
  }))

  return (
    <section
      id="dusun"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-neutral-200/50 scroll-mt-32"
    >
      <AnimatedSection>
        <div className="mb-8">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-neutral-900 tracking-tight">
            {t('village.hamlets')}
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            {t('village.hamlets_subtitle', { periode })}
          </p>
        </div>

        {/* Ringkasan */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center mb-3">
              <Users className="w-5 h-5 text-neutral-900" />
            </div>
            <div className="font-heading text-2xl font-bold text-neutral-900">{formatNumber(totalPenduduk)}</div>
            <div className="text-xs font-medium text-neutral-400 mt-0.5">{t('demografi.total')}</div>
          </div>
          <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center mb-3">
              <Home className="w-5 h-5 text-neutral-900" />
            </div>
            <div className="font-heading text-2xl font-bold text-neutral-900">{formatNumber(total.kk)}</div>
            <div className="text-xs font-medium text-neutral-400 mt-0.5">{t('village.kk')}</div>
          </div>
          <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center mb-3">
              <Home className="w-5 h-5 text-neutral-900" />
            </div>
            <div className="font-heading text-2xl font-bold text-neutral-900">
              {data.length}
              <span className="text-sm font-semibold text-neutral-400 ml-1">RW</span>
            </div>
            <div className="text-xs font-medium text-neutral-400 mt-0.5">
              {t('village.rt_total', { count: total.rt })}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-3">
              <IdCard className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="font-heading text-2xl font-bold text-neutral-900">
              {persenKtp === null ? '—' : `${persenKtp}%`}
            </div>
            <div className="text-xs font-medium text-neutral-400 mt-0.5">{t('village.ktp_done')}</div>
          </div>
        </div>

        {/* Grafik penduduk per dusun */}
        <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 md:p-8 mb-6 shadow-xs">
          <h3 className="font-heading font-bold text-sm text-neutral-900 uppercase tracking-wider mb-5">
            {t('village.hamlet_chart')}
          </h3>
          <ResponsiveContainer width="100%" height={Math.max(180, chartData.length * 48)}>
            <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 24, top: 0, bottom: 0 }}>
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="label"
                width={170}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: '#737373' }}
              />
              <Tooltip
                cursor={{ fill: 'rgba(0,0,0,0.04)' }}
                formatter={(value) => [formatNumber(Number(value)), t('demografi.total')]}
                contentStyle={{ borderRadius: 12, border: '1px solid #E5E5E5', fontSize: 12 }}
              />
              <Bar dataKey="total" radius={[0, 8, 8, 0]} barSize={18} isAnimationActive={false}>
                {chartData.map((entry, i) => (
                  <Cell key={entry.label} fill={barColors[i % barColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Tabel rinci */}
        <div className="bg-white rounded-2xl border border-neutral-200/80 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs min-w-[640px]">
              <thead>
                <tr className="bg-neutral-100/50 text-left text-[11px] uppercase tracking-wider text-neutral-400 border-b border-neutral-100">
                  <th className="px-4 py-3 font-semibold">{t('village.hamlet')}</th>
                  <th className="px-4 py-3 font-semibold text-right">RW</th>
                  <th className="px-4 py-3 font-semibold text-right">RT</th>
                  <th className="px-4 py-3 font-semibold text-right">{t('village.kk')}</th>
                  <th className="px-4 py-3 font-semibold text-right">{t('demografi.male')}</th>
                  <th className="px-4 py-3 font-semibold text-right">{t('demografi.female')}</th>
                  <th className="px-4 py-3 font-semibold text-right">{t('village.apbd_total')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {data.map((h) => (
                  <tr key={h.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="px-4 py-3 font-semibold text-neutral-900">{h.name}</td>
                    <td className="px-4 py-3 text-right text-neutral-500">{h.rw}</td>
                    <td className="px-4 py-3 text-right text-neutral-500">{h.rt_count ?? '—'}</td>
                    <td className="px-4 py-3 text-right text-neutral-500">
                      {h.kk_count == null ? '—' : formatNumber(h.kk_count)}
                    </td>
                    <td className="px-4 py-3 text-right text-neutral-500">{formatNumber(h.male)}</td>
                    <td className="px-4 py-3 text-right text-neutral-500">{formatNumber(h.female)}</td>
                    <td className="px-4 py-3 text-right font-semibold text-neutral-900">
                      {formatNumber(h.total)}
                    </td>
                  </tr>
                ))}
                <tr className="bg-neutral-100/60 font-bold">
                  <td className="px-4 py-3 text-neutral-900">{t('village.apbd_total')}</td>
                  <td className="px-4 py-3 text-right text-neutral-900">{data.length}</td>
                  <td className="px-4 py-3 text-right text-neutral-900">{total.rt}</td>
                  <td className="px-4 py-3 text-right text-neutral-900">{formatNumber(total.kk)}</td>
                  <td className="px-4 py-3 text-right text-neutral-900">{formatNumber(total.male)}</td>
                  <td className="px-4 py-3 text-right text-neutral-900">{formatNumber(total.female)}</td>
                  <td className="px-4 py-3 text-right text-neutral-900">{formatNumber(totalPenduduk)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </AnimatedSection>
    </section>
  )
}
