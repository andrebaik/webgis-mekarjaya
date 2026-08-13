export interface Category {
  id: number
  slug: string
  name_id: string
  icon: string
}

export interface Location {
  id: number
  slug: string
  category_id: number
  name_id: string
  description_id: string | null
  coordinates: number[]
  images: string[]
  featured: boolean
  category_slug?: string
  category_name_id?: string
}

export interface VillageProfile {
  id: number
  name_id: string
  description_id: string | null
  history_id: string | null
  image_url: string | null
  address: string | null
  phone: string | null
  email: string | null
  vision_id: string | null
  /** Satu poin misi per baris. */
  mission_id: string | null
  /** MySQL DECIMAL dikirim sebagai string oleh mysql2. */
  area_km2: string | number | null
  altitude_m: number | null
  rw_count: number | null
  rt_count: number | null
  boundary_north: string | null
  boundary_south: string | null
  boundary_east: string | null
  boundary_west: string | null
}

/** Rekap penduduk per dusun/RW dari laporan bulanan desa. */
export interface Hamlet {
  id: number
  year: number
  month: number
  name: string
  rw: number
  rt_count: number | null
  kk_count: number | null
  male: number
  female: number
  ktp_required: number | null
  ktp_done: number | null
  ktp_pending: number | null
  sort_order: number
}

export type ApbdType = 'pelaksanaan' | 'pendapatan' | 'belanja'

export interface ApbdItem {
  id: number
  year: number
  type: ApbdType
  category: string
  /** Pagu anggaran. */
  amount: number
  /** Dana terserap. `null` = belum ada realisasi, berbeda dari terealisasi Rp 0. */
  realisasi: number | null
  sort_order: number
}

export interface PeriodProgram {
  id: number
  period_id: number
  title_id: string
  description_id: string | null
  year: number | null
  status: 'selesai' | 'berjalan'
  sort_order: number
}

export interface VillagePeriod {
  id: number
  name: string
  year_start: number
  year_end: number
  photo_url: string | null
  description_id: string | null
  sort_order: number
  programs: PeriodProgram[]
}

export interface AdminLoginResponse {
  token: string
  username: string
}
