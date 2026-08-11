import { Icon, type DivIcon } from 'leaflet'

export const categoryIconColors: Record<string, string> = {
  sekolah: '#3B82F6',
  puskesmas: '#EF4444',
  desa: '#F59E0B',
  ibadah: '#10B981',
  wisata: '#8B5CF6',
  umkm: '#F97316',
  lapangan: '#22C55E',
  jembatan: '#06B6D4',
  sungai: '#0EA5E9',
  pasar: '#EC4899',
  perkebunan: '#65A30D',
  'fasilitas-umum': '#6366F1',
}

export function categoryColor(categorySlug?: string): string {
  return (categorySlug && categoryIconColors[categorySlug]) || '#6B7280'
}

export function createCategoryIcon(categorySlug: string, isActive: boolean = false): DivIcon {
  const color = categoryColor(categorySlug)
  const size = isActive ? 36 : 28

  return new Icon({
    iconUrl: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cpath d='M16 2C10.48 2 6 6.48 6 12c0 6.28 10 18 10 18s10-11.72 10-18c0-5.52-4.48-10-10-10z' fill='${encodeURIComponent(color)}'/%3E%3Ccircle cx='16' cy='12' r='4' fill='white'/%3E%3C/svg%3E`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  })
}
