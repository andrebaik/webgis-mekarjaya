import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import { ArrowUpRight } from 'lucide-react'
import 'leaflet/dist/leaflet.css'
import { AnimatedSection } from '../AnimatedSection'
import { MapBoundsUpdater } from '../map/MapBoundsUpdater'
import { useGeoJson } from '../../hooks/useGeoJson'

export function VillageMiniMap() {
  const { t } = useTranslation()
  const desaBoundary = useGeoJson('/geojson/desa.geojson')
  const rwBoundary = useGeoJson('/geojson/rw.geojson')

  if (!desaBoundary && !rwBoundary) return null

  return (
    <AnimatedSection>
      <div className="mb-6">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-neutral-900 tracking-tight">
          {t('village.map_title')}
        </h2>
        <p className="text-xs text-neutral-500 mt-1">{t('village.map_subtitle')}</p>
      </div>

      <div className="relative rounded-3xl overflow-hidden border border-neutral-200/80 shadow-xs">
        <MapContainer
          center={[-7.384, 107.838]}
          zoom={13}
          className="h-[320px] w-full"
          zoomControl={false}
          dragging={false}
          scrollWheelZoom={false}
          doubleClickZoom={false}
          touchZoom={false}
          keyboard={false}
          attributionControl={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {rwBoundary && (
            <GeoJSON
              data={rwBoundary}
              style={{ color: '#10B981', weight: 1.5, opacity: 0.7, dashArray: '4, 4', fillColor: '#10B981', fillOpacity: 0.08 }}
            />
          )}

          {desaBoundary && (
            <GeoJSON
              data={desaBoundary}
              style={{ color: '#C2410C', weight: 3, opacity: 0.9, fillColor: '#C2410C', fillOpacity: 0.05 }}
            />
          )}

          <MapBoundsUpdater boundary={desaBoundary ?? rwBoundary} locations={[]} />
        </MapContainer>

        <Link
          to="/map"
          className="absolute bottom-4 right-4 z-[500] inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-semibold shadow-lg hover:bg-neutral-800 transition-colors"
        >
          {t('village.map_open')}
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </AnimatedSection>
  )
}
