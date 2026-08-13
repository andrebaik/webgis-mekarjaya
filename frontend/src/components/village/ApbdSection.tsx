import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react'
import { motion } from 'framer-motion'
import { AnimatedSection } from '../AnimatedSection'
import { itemStagger } from '../../lib/motion'
import { SectionHeading } from '../ui/SectionHeading'
import { formatRp, formatRpCompact } from '../../lib/utils'
import { APBD_TYPES, getLatestApbdYear } from '../../lib/apbd'
import type { ApbdItem, ApbdType } from '../../types'

interface ApbdSectionProps {
  items: ApbdItem[]
}

/** Aksen per kolom — dipakai untuk titik penanda dan angka total. */
const accent: Record<ApbdType, { dot: string; total: string }> = {
  pelaksanaan: { dot: 'bg-foreground', total: 'text-foreground' },
  pendapatan: { dot: 'bg-primary', total: 'text-primary' },
  belanja: { dot: 'bg-emerald-500', total: 'text-emerald-700' },
}

export function ApbdSection({ items }: ApbdSectionProps) {
  const { t } = useTranslation()

  // Data bisa memuat beberapa tahun sekaligus; menjumlahkannya bersama menghasilkan
  // total yang salah. Selalu batasi ke tahun terbaru yang ada datanya.
  const year = useMemo(() => getLatestApbdYear(items), [items])
  const tahunIni = useMemo(
    () => (year == null ? [] : items.filter((i) => i.year === year)),
    [items, year]
  )

  const kolom = useMemo(
    () =>
      APBD_TYPES.map((type) => {
        const rows = tahunIni
          .filter((i) => i.type === type)
          .sort((a, b) => a.sort_order - b.sort_order || a.category.localeCompare(b.category))
        // 'pelaksanaan' TIDAK punya total: Pendapatan/Belanja/Pembiayaan adalah tiga
        // besaran berbeda, menjumlahkannya menghasilkan angka tanpa arti.
        const total = type === 'pelaksanaan' ? null : rows.reduce((sum, r) => sum + r.amount, 0)
        // Hanya baris yang benar-benar punya angka realisasi yang dijumlahkan;
        // pos yang belum terealisasi tidak boleh dihitung sebagai Rp 0.
        const adaRealisasi = rows.some((r) => r.realisasi != null)
        const totalRealisasi =
          type === 'pelaksanaan' || !adaRealisasi
            ? null
            : rows.reduce((sum, r) => sum + (r.realisasi ?? 0), 0)
        return { type, rows, total, totalRealisasi }
      }),
    [tahunIni]
  )

  const kolomBelanja = kolom.find((k) => k.type === 'belanja')
  const pendapatan = kolom.find((k) => k.type === 'pendapatan')?.total ?? 0
  const belanja = kolomBelanja?.total ?? 0
  const belanjaRealisasi = kolomBelanja?.totalRealisasi ?? null
  const serapan =
    belanjaRealisasi != null && belanja > 0 ? Math.round((belanjaRealisasi / belanja) * 100) : null
  const selisih = pendapatan - belanja
  const surplus = selisih >= 0

  if (tahunIni.length === 0) return null

  return (
    <section
      id="apbdes"
      className="border-t border-border/60 bg-surface-card py-16 md:py-20 scroll-mt-32"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <SectionHeading
            eyebrow={t('village.eyebrow_apbd')}
            title={t('village.apbd')}
            subtitle={year ? t('village.apbd_subtitle', { year }) : undefined}
          />
        </AnimatedSection>

          {/* Ringkasan pendapatan vs belanja */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <RingkasanKartu
              icon={TrendingUp}
              label={t('village.apbd_pendapatan')}
              value={formatRpCompact(pendapatan)}
            />
            <RingkasanKartu
              icon={TrendingDown}
              label={t('village.apbd_belanja')}
              value={formatRpCompact(belanja)}
              catatan={
                serapan != null && belanjaRealisasi != null
                  ? t('village.apbd_realisasi') +
                    ' ' +
                    formatRpCompact(belanjaRealisasi) +
                    ' · ' +
                    serapan +
                    '%'
                  : undefined
              }
            />
            <div
              className={`rounded-2xl border p-5 ${
                surplus ? 'bg-emerald-50/60 border-emerald-200/80' : 'bg-red-50/60 border-red-200/80'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                  surplus ? 'bg-emerald-100' : 'bg-red-100'
                }`}
              >
                <Wallet className={`w-5 h-5 ${surplus ? 'text-emerald-700' : 'text-red-600'}`} />
              </div>
              <div
                className={`font-heading text-2xl font-bold tabular-nums ${
                  surplus ? 'text-emerald-700' : 'text-red-600'
                }`}
              >
                {formatRpCompact(Math.abs(selisih))}
              </div>
              <div
                className={`text-xs font-semibold mt-0.5 ${
                  surplus ? 'text-emerald-600' : 'text-red-500'
                }`}
              >
                {surplus ? t('village.apbd_surplus') : t('village.apbd_defisit')}
              </div>
            </div>
          </div>

          {/* Tiga kolom APBDes */}
          <AnimatedSection stagger className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {kolom.map(({ type, rows, total, totalRealisasi }) => (
              <motion.div
                key={type}
                variants={itemStagger}
                className="bg-surface rounded-3xl border border-border overflow-hidden flex flex-col"
              >
                <h3 className="px-5 py-4 border-b border-border/60 font-heading font-bold text-sm text-foreground flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${accent[type].dot}`} />
                  {t(`village.apbd_type_${type}`)}
                </h3>

                {rows.length === 0 ? (
                  <p className="px-5 py-8 text-xs text-muted-foreground text-center flex-1">
                    {t('village.apbd_empty_type')}
                  </p>
                ) : (
                  <>
                    <ul className="divide-y divide-border/60 flex-1">
                      {rows.map((row) => (
                        <li key={row.id} className="px-5 py-3">
                          <div className="flex items-baseline justify-between gap-4">
                            <span className="text-xs text-muted-foreground leading-snug">
                              {row.category}
                            </span>
                            <span className="text-xs font-semibold text-foreground tabular-nums whitespace-nowrap">
                              {formatRp(row.amount)}
                            </span>
                          </div>
                          <div className="flex items-baseline justify-between gap-4 mt-1">
                            <span className="text-[11px] text-muted-foreground/80">
                              {t('village.apbd_realisasi')}
                            </span>
                            {row.realisasi == null ? (
                              <span className="text-[11px] text-muted-foreground/80 italic">
                                {t('village.apbd_belum_realisasi')}
                              </span>
                            ) : (
                              <span className="text-[11px] font-medium text-muted-foreground tabular-nums whitespace-nowrap">
                                {formatRp(row.realisasi)}
                                {row.amount > 0 && (
                                  <span className="ml-1.5 text-foreground/60">
                                    ({Math.round((row.realisasi / row.amount) * 100)}%)
                                  </span>
                                )}
                              </span>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                    {total !== null && (
                      <div className="px-5 py-3.5 bg-muted border-t border-border/60">
                        <div className="flex items-baseline justify-between gap-4">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                            {t('village.apbd_total')}
                          </span>
                          <span
                            className={`text-sm font-bold tabular-nums whitespace-nowrap ${accent[type].total}`}
                          >
                            {formatRp(total)}
                          </span>
                        </div>
                        {totalRealisasi !== null && (
                          <div className="flex items-baseline justify-between gap-4 mt-1">
                            <span className="text-[11px] font-medium text-muted-foreground">
                              {t('village.apbd_realisasi')}
                            </span>
                            <span className="text-xs font-semibold text-muted-foreground tabular-nums whitespace-nowrap">
                              {formatRp(totalRealisasi)}
                              {total > 0 && (
                                <span className="ml-1.5 text-foreground/60">
                                  ({Math.round((totalRealisasi / total) * 100)}%)
                                </span>
                              )}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            ))}
          </AnimatedSection>
      </div>
    </section>
  )
}

interface RingkasanKartuProps {
  icon: typeof TrendingUp
  label: string
  value: string
  /** Baris kecil di bawah label, mis. angka realisasi & persen serapan. */
  catatan?: string
}

function RingkasanKartu({ icon: Icon, label, value, catatan }: RingkasanKartuProps) {
  return (
    <div className="bg-surface rounded-2xl border border-border p-5">
      <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mb-3">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div className="font-heading text-2xl font-bold text-foreground tabular-nums">{value}</div>
      <div className="text-xs font-medium text-muted-foreground mt-0.5">{label}</div>
      {catatan && (
        <div className="text-[11px] text-muted-foreground/80 mt-1.5 tabular-nums">{catatan}</div>
      )}
    </div>
  )
}
