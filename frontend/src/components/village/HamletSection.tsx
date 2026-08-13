import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, useReducedMotion } from 'framer-motion'
import { Home, Users, IdCard } from 'lucide-react'
import { AnimatedSection } from '../AnimatedSection'
import { formatNumber } from '../../lib/utils'
import { easeKeluar } from '../../lib/motion'
import type { Hamlet } from '../../types'
import { SectionHeading } from '../ui/SectionHeading'

interface HamletSectionProps {
  rows: Hamlet[]
}

const NAMA_BULAN = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
]

export function HamletSection({ rows }: HamletSectionProps) {
  const { t } = useTranslation()
  const reduceMotion = useReducedMotion()

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

  // Diurutkan menurun: yang ingin dibaca dari visual ini adalah PERINGKAT dusun,
  // sesuatu yang tidak terbaca dari tabel di bawah yang tersusun menurut nomor RW.
  const peringkat = [...data].sort((a, b) => b.total - a.total)
  const terbesar = peringkat[0]?.total || 1

  return (
    <section
      id="dusun"
      className="border-t border-border/60 py-16 md:py-20 scroll-mt-32"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <AnimatedSection>
        <SectionHeading
          eyebrow={t('village.eyebrow_hamlets')}
          title={t('village.hamlets')}
          subtitle={t('village.hamlets_subtitle', { periode })}
        />

        {/* Ringkasan */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-surface-card rounded-2xl border border-border p-5">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mb-3">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div className="font-heading text-3xl font-bold text-foreground">{formatNumber(totalPenduduk)}</div>
            <div className="text-xs font-medium text-muted-foreground mt-0.5">{t('demografi.total')}</div>
          </div>
          <div className="bg-surface-card rounded-2xl border border-border p-5">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mb-3">
              <Home className="w-5 h-5 text-primary" />
            </div>
            <div className="font-heading text-3xl font-bold text-foreground">{formatNumber(total.kk)}</div>
            <div className="text-xs font-medium text-muted-foreground mt-0.5">{t('village.kk')}</div>
          </div>
          <div className="bg-surface-card rounded-2xl border border-border p-5">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mb-3">
              <Home className="w-5 h-5 text-primary" />
            </div>
            <div className="font-heading text-3xl font-bold text-foreground">
              {data.length}
              <span className="text-sm font-semibold text-muted-foreground ml-1">RW</span>
            </div>
            <div className="text-xs font-medium text-muted-foreground mt-0.5">
              {t('village.rt_total', { count: total.rt })}
            </div>
          </div>
          <div className="bg-surface-card rounded-2xl border border-border p-5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-3">
              <IdCard className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="font-heading text-3xl font-bold text-foreground">
              {persenKtp === null ? '—' : `${persenKtp}%`}
            </div>
            <div className="text-xs font-medium text-muted-foreground mt-0.5">{t('village.ktp_done')}</div>
          </div>
        </div>

        {/* Peringkat penduduk per dusun.
            Menggantikan bar chart Recharts yang memberi tiap dusun warna berbeda:
            ketujuh batang mengukur besaran yang sama, jadi warnanya tidak membawa
            arti apa pun dan hanya melawan palet halaman. Di sini warna dipakai
            untuk membedakan laki-laki dan perempuan, dan itu memang bermakna. */}
        <div className="bg-surface-card rounded-3xl border border-border p-6 md:p-8 mb-6">
          <div className="flex flex-wrap items-baseline justify-between gap-3 mb-6">
            <h3 className="font-heading font-bold text-sm text-foreground uppercase tracking-wider">
              {t('village.hamlet_chart')}
            </h3>
            <div className="flex items-center gap-4 text-[11px] font-medium text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-foreground" />
                {t('demografi.male')}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-primary" />
                {t('demografi.female')}
              </span>
            </div>
          </div>

          <ol className="space-y-4">
            {peringkat.map((h, i) => (
              <li key={h.id}>
                <div className="flex items-baseline justify-between gap-4 mb-1.5">
                  <span className="text-xs font-semibold text-foreground truncate">
                    <span className="text-muted-foreground tabular-nums mr-2">{i + 1}</span>
                    {h.name}
                    <span className="text-muted-foreground font-medium ml-1.5">RW {h.rw}</span>
                  </span>
                  <span className="text-xs font-bold text-foreground tabular-nums shrink-0">
                    {formatNumber(h.total)}
                  </span>
                </div>

                {/* Lebar bilah relatif terhadap dusun terbesar, bukan terhadap total
                    desa: dengan tujuh dusun, skala terhadap total membuat semua
                    bilah pendek dan selisihnya tidak terbaca. */}
                <motion.div
                  className="flex h-2.5 rounded-full overflow-hidden bg-muted"
                  initial={reduceMotion ? false : { scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.6, delay: i * 0.05, ease: easeKeluar }}
                  style={{ width: `${(h.total / terbesar) * 100}%`, transformOrigin: 'left' }}
                >
                  <span
                    className="bg-foreground h-full"
                    style={{ width: `${(h.male / h.total) * 100}%` }}
                    aria-hidden="true"
                  />
                  <span
                    className="bg-primary h-full flex-1"
                    aria-hidden="true"
                  />
                </motion.div>

                <div className="flex items-center gap-3 mt-1 text-[11px] text-muted-foreground tabular-nums">
                  <span>{formatNumber(h.male)} {t('demografi.male').toLowerCase()}</span>
                  <span aria-hidden="true" className="w-px h-3 bg-border" />
                  <span>{formatNumber(h.female)} {t('demografi.female').toLowerCase()}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Tabel rinci */}
        <div className="bg-surface-card rounded-2xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs min-w-[640px]">
              <thead>
                <tr className="bg-muted text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border/60">
                  <th className="px-4 py-3 font-semibold">{t('village.hamlet')}</th>
                  <th className="px-4 py-3 font-semibold text-right">RW</th>
                  <th className="px-4 py-3 font-semibold text-right">RT</th>
                  <th className="px-4 py-3 font-semibold text-right">{t('village.kk')}</th>
                  <th className="px-4 py-3 font-semibold text-right">{t('demografi.male')}</th>
                  <th className="px-4 py-3 font-semibold text-right">{t('demografi.female')}</th>
                  <th className="px-4 py-3 font-semibold text-right">{t('village.apbd_total')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {data.map((h) => (
                  <tr key={h.id} className="hover:bg-muted transition-colors motion-reduce:transition-none">
                    <td className="px-4 py-3 font-semibold text-foreground">{h.name}</td>
                    <td className="px-4 py-3 text-right text-muted-foreground">{h.rw}</td>
                    <td className="px-4 py-3 text-right text-muted-foreground">{h.rt_count ?? '—'}</td>
                    <td className="px-4 py-3 text-right text-muted-foreground">
                      {h.kk_count == null ? '—' : formatNumber(h.kk_count)}
                    </td>
                    <td className="px-4 py-3 text-right text-muted-foreground">{formatNumber(h.male)}</td>
                    <td className="px-4 py-3 text-right text-muted-foreground">{formatNumber(h.female)}</td>
                    <td className="px-4 py-3 text-right font-semibold text-foreground">
                      {formatNumber(h.total)}
                    </td>
                  </tr>
                ))}
                <tr className="bg-muted/60 font-bold">
                  <td className="px-4 py-3 text-foreground">{t('village.apbd_total')}</td>
                  <td className="px-4 py-3 text-right text-foreground">{data.length}</td>
                  <td className="px-4 py-3 text-right text-foreground">{total.rt}</td>
                  <td className="px-4 py-3 text-right text-foreground">{formatNumber(total.kk)}</td>
                  <td className="px-4 py-3 text-right text-foreground">{formatNumber(total.male)}</td>
                  <td className="px-4 py-3 text-right text-foreground">{formatNumber(total.female)}</td>
                  <td className="px-4 py-3 text-right text-foreground">{formatNumber(totalPenduduk)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </AnimatedSection>
      </div>
    </section>
  )
}
