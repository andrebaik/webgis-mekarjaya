export interface DemografikItem {
  label: string
  value: number
}

export interface DemografikData {
  totalPenduduk: number
  jiwa: { laki_laki: number; perempuan: number }
  usia: DemografikItem[]
  pendidikan: DemografikItem[]
  pekerjaan: DemografikItem[]
}

export const demographics: DemografikData = {
  totalPenduduk: 5248,
  jiwa: { laki_laki: 2634, perempuan: 2614 },
  usia: [
    { label: '0\u201314 Tahun', value: 1420 },
    { label: '15\u201329 Tahun', value: 1580 },
    { label: '30\u201344 Tahun', value: 1240 },
    { label: '45\u201359 Tahun', value: 680 },
    { label: '60+ Tahun', value: 328 },
  ],
  pendidikan: [
    { label: 'SD/Sederajat', value: 1850 },
    { label: 'SMP/Sederajat', value: 1240 },
    { label: 'SMA/Sederajat', value: 1560 },
    { label: 'Diploma', value: 280 },
    { label: 'S1+', value: 318 },
  ],
  pekerjaan: [
    { label: 'Petani', value: 1240 },
    { label: 'Buruh', value: 860 },
    { label: 'Wiraswasta', value: 720 },
    { label: 'PNS/TNI/Polri', value: 280 },
    { label: 'Lainnya', value: 540 },
  ],
}
