import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react'
import { AnimatedSection } from '../AnimatedSection'
import { formatRp, formatRpCompact } from '../../lib/utils'
import type { ApbdItem } from '../../types'

interface ApbdSectionProps {
  items: ApbdItem[]
}

const barColors = ['#171717', '#C2410C', '#10B981', '#06B6D4', '#8B5CF6', '#F59E0B', '#EC4899']

export function ApbdSection({ items }: ApbdSectionProps) {
  const { t } = useTranslation()

  const pendapatan = useMemo(() => items.filter((i) => i.type === 'pendapatan'), [items])
  const belanja = useMemo(() => items.filter((i) => i.type === 'belanja'), [items])
  const totalPendapatan = useMemo(() => pendapatan.reduce((sum, i) => sum + i.amount, 0), [pendapatan])
  const totalBelanja = useMemo(() => belanja.reduce((sum, i) => sum + i.amount, 0), [belanja])

  // Komposisi belanja per kategori — dihitung di klien karena seluruh item sudah ada di
  // memori; memanggil /api/apbd/summary hanya menambah request untuk data yang sama.
  const komposisi = useMemo(() => {
    const byCategory = new Map<string, number>()
    for (const item of belanja) {
      byCategory.set(item.category, (byCategory.get(item.category) ?? 0) + item.amount)
    }
    return [...byCategory.entries()]
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount)
  }, [belanja])

  if (items.length === 0) return null

  const selisih = totalPendapatan - totalBelanja
  const surplus = selisih >= 0

  const renderTable = (rows: ApbdItem[], total: number) => (
    <div className="bg-white rounded-2xl border border-neutral-200/80 overflow-hidden shadow-xs">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-neutral-100/50 text-left text-[11px] uppercase tracking-wider text-neutral-400 border-b border-neutral-100">
            <th className="px-4 py-3 font-semibold">{t('admin.category')}</th>
            <th className="px-4 py-3 font-semibold">{t('admin.title')}</th>
            <th className="px-4 py-3 font-semibold text-right">{t('admin.amount')}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {rows.map((item) => (
            <tr key={item.id} className="hover:bg-neutral-50/80 transition-colors">
              <td className="px-4 py-3 text-neutral-500">{item.category}</td>
              <td className="px-4 py-3 font-semibold text-neutral-900">{item.title}</td>
              <td className="px-4 py-3 text-right font-medium text-neutral-900 font-mono">{formatRp(item.amount)}</td>
            </tr>
          ))}
          <tr className="bg-neutral-100/60 font-bold">
            <td className="px-4 py-3 text-neutral-900" colSpan={2}>
              {t('village.apbd_total')}
            </td>
            <td className="px-4 py-3 text-right text-neutral-900 font-mono">{formatRp(total)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )

  return (
    <section id="apbdes" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-neutral-200/50 scroll-mt-32">
      <AnimatedSection>
        <div className="mb-8">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-neutral-900 tracking-tight">{t('village.apbd')}</h2>
        </div>

        {/* Ringkasan */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center mb-3">
              <TrendingUp className="w-5 h-5 text-neutral-900" />
            </div>
            <div className="font-heading text-2xl font-bold text-neutral-900">{formatRpCompact(totalPendapatan)}</div>
            <div className="text-xs font-medium text-neutral-400 mt-0.5">{t('village.apbd_pendapatan')}</div>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-3">
              <TrendingDown className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="font-heading text-2xl font-bold text-neutral-900">{formatRpCompact(totalBelanja)}</div>
            <div className="text-xs font-medium text-neutral-400 mt-0.5">{t('village.apbd_belanja')}</div>
          </div>

          <div className={`rounded-2xl border p-5 shadow-xs ${surplus ? 'bg-emerald-50/60 border-emerald-200/80' : 'bg-red-50/60 border-red-200/80'}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${surplus ? 'bg-emerald-100' : 'bg-red-100'}`}>
              <Wallet className={`w-5 h-5 ${surplus ? 'text-emerald-700' : 'text-red-600'}`} />
            </div>
            <div className={`font-heading text-2xl font-bold ${surplus ? 'text-emerald-700' : 'text-red-600'}`}>
              {formatRpCompact(Math.abs(selisih))}
            </div>
            <div className={`text-xs font-semibold mt-0.5 ${surplus ? 'text-emerald-600' : 'text-red-500'}`}>
              {surplus ? t('village.apbd_surplus') : t('village.apbd_defisit')}
            </div>
          </div>
        </div>

        {/* Komposisi belanja */}
        {komposisi.length > 0 && (
          <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 md:p-8 mb-6 shadow-xs">
            <h3 className="font-heading font-bold text-sm text-neutral-900 uppercase tracking-wider mb-5">
              {t('village.apbd_composition')}
            </h3>
            <ResponsiveContainer width="100%" height={Math.max(160, komposisi.length * 48)}>
              <BarChart data={komposisi} layout="vertical" margin={{ left: 8, right: 24, top: 0, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="category"
                  // Nama kategori APBDes panjang ("Bidang Penyelenggaraan"); di bawah ~150px
                  // Recharts memecahnya jadi dua baris dan tabraknya dengan bar.
                  width={150}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: '#737373' }}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(0,0,0,0.04)' }}
                  formatter={(value) => [formatRp(Number(value)), t('admin.amount')]}
                  contentStyle={{ borderRadius: 12, border: '1px solid #E5E5E5', fontSize: 12 }}
                />
                <Bar dataKey="amount" radius={[0, 8, 8, 0]} barSize={18} isAnimationActive={false}>
                  {komposisi.map((entry, i) => (
                    <Cell key={entry.category} fill={barColors[i % barColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="font-heading font-bold text-sm text-neutral-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-900" />
              {t('village.apbd_pendapatan')}
            </h3>
            {renderTable(pendapatan, totalPendapatan)}
          </div>
          <div>
            <h3 className="font-heading font-bold text-sm text-neutral-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              {t('village.apbd_belanja')}
            </h3>
            {renderTable(belanja, totalBelanja)}
          </div>
        </div>
      </AnimatedSection>
    </section>
  )
}
