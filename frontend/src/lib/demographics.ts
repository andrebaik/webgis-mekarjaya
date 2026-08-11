import type { DemographicRow, Hamlet } from '../types'

export interface DemographicChartItem {
  label_key: string
  label: string
  value: number
}

export function filterByCategory(rows: DemographicRow[], category: string): DemographicRow[] {
  return rows.filter((r) => r.category === category).sort((a, b) => a.sort_order - b.sort_order)
}

export function toChartData(rows: DemographicRow[]): DemographicChartItem[] {
  return rows.map((r) => ({
    label_key: r.label_key,
    label: r.label_id || r.label_key,
    value: r.value,
  }))
}

export function getTotal(rows: DemographicRow[]): number {
  const total = rows.find((r) => r.category === 'total')
  return total?.value ?? 0
}

export function getGenderSplit(rows: DemographicRow[]): { laki_laki: number; perempuan: number } {
  const l = rows.find((r) => r.category === 'jiwa' && r.label_key === 'laki_laki')
  const p = rows.find((r) => r.category === 'jiwa' && r.label_key === 'perempuan')
  return { laki_laki: l?.value ?? 0, perempuan: p?.value ?? 0 }
}

export function getLatestYear(rows: DemographicRow[]): number | null {
  return rows.length ? Math.max(...rows.map((r) => r.year)) : null
}

/**
 * Ringkasan jumlah penduduk. Laporan penduduk per dusun (`village_hamlets`) adalah
 * sumber resmi dan paling mutakhir, jadi dipakai lebih dulu; tabel `demographics`
 * hanya jadi cadangan bila laporan dusun belum diisi. Tanpa ini, halaman depan
 * menampilkan 0 jiwa padahal data dusunnya ada.
 */
export function getPopulationSummary(
  hamlets: Hamlet[] | undefined,
  rows: DemographicRow[] | undefined
): { total: number; laki_laki: number; perempuan: number } {
  if (hamlets && hamlets.length > 0) {
    const laki_laki = hamlets.reduce((sum, h) => sum + h.male, 0)
    const perempuan = hamlets.reduce((sum, h) => sum + h.female, 0)
    return { total: laki_laki + perempuan, laki_laki, perempuan }
  }
  const list = rows ?? []
  const { laki_laki, perempuan } = getGenderSplit(list)
  return { total: getTotal(list), laki_laki, perempuan }
}
