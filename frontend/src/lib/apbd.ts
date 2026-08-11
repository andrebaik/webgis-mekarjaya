import type { ApbdType } from '../types'

/**
 * Tiga kelompok APBDes yang ditampilkan berdampingan di halaman profil desa.
 * Urutan array ini menentukan urutan kolom di UI dan urutan opsi di form admin.
 */
export const APBD_TYPES: ApbdType[] = ['pelaksanaan', 'pendapatan', 'belanja']

/**
 * Saran pos anggaran per kelompok, mengikuti nomenklatur APBDes yang dipakai desa.
 *
 * Ini hanya SARAN (dipakai sebagai <datalist>), bukan daftar tertutup: admin tetap
 * bisa mengetik pos lain. Kalau dibuat <select>, baris lama yang posnya di luar
 * daftar jadi tidak bisa diedit ulang — dan data seperti itu sudah ada.
 */
export const APBD_CATEGORY_SUGGESTIONS: Record<ApbdType, string[]> = {
  pelaksanaan: ['Pendapatan', 'Belanja', 'Pembiayaan'],
  pendapatan: [
    'Hasil Usaha Desa',
    'Hasil Aset Desa',
    'Dana Desa',
    'Bagi Hasil Pajak dan Retribusi',
    'Alokasi Dana Desa',
    'Bantuan Keuangan Provinsi',
    'Bunga Bank',
  ],
  belanja: [
    'Bidang Penyelenggaraan Pemerintahan Desa',
    'Bidang Pelaksanaan Pembangunan Desa',
    'Bidang Pembinaan Kemasyarakatan Desa',
    'Bidang Penanggulangan Bencana, Darurat dan Mendesak Desa',
  ],
}

/** Tahun terbaru yang punya data — dipakai agar kolom tidak mencampur antar tahun. */
export function getLatestApbdYear(items: { year: number }[]): number | null {
  if (items.length === 0) return null
  return Math.max(...items.map((i) => i.year))
}
