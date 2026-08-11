import type { Hamlet } from '../types'

/**
 * Ringkasan jumlah penduduk desa, dihitung dari laporan penduduk per dusun
 * (`village_hamlets`) — satu-satunya sumber angka kependudukan setelah tabel
 * `demographics` dihapus.
 */
export function getPopulationSummary(
  hamlets: Hamlet[] | undefined
): { total: number; laki_laki: number; perempuan: number } {
  const list = hamlets ?? []
  const laki_laki = list.reduce((sum, h) => sum + h.male, 0)
  const perempuan = list.reduce((sum, h) => sum + h.female, 0)
  return { total: laki_laki + perempuan, laki_laki, perempuan }
}
