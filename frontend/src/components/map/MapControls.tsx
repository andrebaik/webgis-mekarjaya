import { useTranslation } from 'react-i18next'
import { useMap } from 'react-leaflet'
import { Plus, Minus, Layers } from 'lucide-react'
import { cn } from '../../lib/utils'

interface MapControlsProps {
  showDesaBoundary: boolean
  showRwBoundary: boolean
  onToggleDesa: () => void
  onToggleRw: () => void
}

/**
 * Kontrol melayang di kanan peta. Semua tombol 44x44px (minimum target sentuh)
 * dan punya focus ring — kontrol bawaan Leaflet dimatikan supaya gayanya seragam
 * dengan sisa aplikasi.
 */
export function MapControls({ showDesaBoundary, showRwBoundary, onToggleDesa, onToggleRw }: MapControlsProps) {
  const { t } = useTranslation()
  const map = useMap()

  const btn =
    'w-11 h-11 flex items-center justify-center transition-colors cursor-pointer ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-1'

  return (
    <div className="absolute top-3 right-3 z-[1000] flex flex-col gap-2 items-end">
      {/* Zoom */}
      <div className="flex flex-col rounded-2xl overflow-hidden bg-white border border-neutral-200/80 shadow-sm divide-y divide-neutral-200/80">
        <button onClick={() => map.zoomIn()} className={cn(btn, 'hover:bg-neutral-100')} aria-label={t('map.zoom_in')}>
          <Plus className="w-4 h-4 text-neutral-700" />
        </button>
        <button onClick={() => map.zoomOut()} className={cn(btn, 'hover:bg-neutral-100')} aria-label={t('map.zoom_out')}>
          <Minus className="w-4 h-4 text-neutral-700" />
        </button>
      </div>

      {/* Layer batas wilayah */}
      <div className="rounded-2xl bg-white border border-neutral-200/80 shadow-sm overflow-hidden">
        {/* Judul disembunyikan di layar kecil supaya kolom kontrol tetap selebar
            tombol (±46px) dan tidak memakan ruang kolom pencarian. */}
        <div className="hidden md:flex px-3 pt-2.5 pb-1.5 items-center gap-1.5 border-b border-neutral-200/60">
          <Layers className="w-3.5 h-3.5 text-neutral-400" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            {t('map.layers')}
          </span>
        </div>
        <div className="p-1.5 flex flex-col gap-1">
          <LayerToggle
            label={t('map.boundary_village')}
            color="#C2410C"
            active={showDesaBoundary}
            onToggle={onToggleDesa}
          />
          <LayerToggle
            label={t('map.boundary_rw')}
            color="#10B981"
            active={showRwBoundary}
            onToggle={onToggleRw}
          />
        </div>
      </div>
    </div>
  )
}

interface LayerToggleProps {
  label: string
  color: string
  active: boolean
  onToggle: () => void
}

function LayerToggle({ label, color, active, onToggle }: LayerToggleProps) {
  return (
    <button
      onClick={onToggle}
      role="switch"
      aria-checked={active}
      aria-label={label}
      className={cn(
        'min-h-11 min-w-11 px-2.5 rounded-xl flex items-center justify-center md:justify-start gap-2.5 text-xs font-semibold cursor-pointer',
        'transition-colors motion-reduce:transition-none',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900',
        active ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-400 hover:bg-neutral-50'
      )}
    >
      {/* Kotak warna sekaligus penanda aktif — tidak mengandalkan warna saja,
          karena status juga tercermin dari isian penuh vs kosong. */}
      <span
        className="w-3.5 h-3.5 rounded-[5px] border-2 shrink-0 transition-colors motion-reduce:transition-none"
        style={{ borderColor: color, backgroundColor: active ? color : 'transparent' }}
      />
      <span className="hidden md:inline whitespace-nowrap">{label}</span>
    </button>
  )
}
