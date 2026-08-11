import { useState } from 'react'
import { Link } from 'react-router'
import { useLocations } from '../hooks/useLocations'
import { useCategories } from '../hooks/useCategories'
import { useMapFilter } from '../hooks/useMapFilter'
import { useGeoJson } from '../hooks/useGeoJson'
import { useTranslation } from 'react-i18next'
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import { PanelLeftClose, PanelLeft, Home } from 'lucide-react'
import type { Feature } from 'geojson'
import 'leaflet/dist/leaflet.css'
import { cn } from '../lib/utils'
import { MapBoundsUpdater } from '../components/map/MapBoundsUpdater'
import { LocationMarker } from '../components/map/LocationMarker'
import { CategoryFilterBar } from '../components/map/CategoryFilterBar'
import { LocationSidebar } from '../components/map/LocationSidebar'
import { LocationSheet } from '../components/map/LocationSheet'
import { MapControls } from '../components/map/MapControls'
import { MapLegend } from '../components/map/MapLegend'
import { SearchBar } from '../components/SearchBar'
import { ErrorState } from '../components/ErrorState'

const rwColors = [
  '#10B981', // emerald
  '#3B82F6', // blue
  '#F59E0B', // amber
  '#8B5CF6', // purple
  '#EC4899', // pink
  '#06B6D4', // cyan
  '#65A30D', // lime
  '#F97316', // orange
]

const iconBtn =
  'w-11 h-11 flex items-center justify-center rounded-2xl bg-white border border-neutral-200/80 ' +
  'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 shadow-sm transition-colors cursor-pointer ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-1'

export function MapPage() {
  const { t } = useTranslation()
  const { data: locations, isLoading, isError: isLocationsError, refetch: refetchLocations } = useLocations()
  const { data: categories, isError: isCategoriesError, refetch: refetchCategories } = useCategories()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const desaBoundary = useGeoJson('/geojson/desa.geojson')
  const rwBoundary = useGeoJson('/geojson/rw.geojson')
  const [showDesaBoundary, setShowDesaBoundary] = useState(true)
  const [showRwBoundary, setShowRwBoundary] = useState(true)

  const {
    categoryFilter,
    categoryMap,
    categoryLocations,
    filteredLocations,
    search,
    setSearch,
    activeMarker,
    setActiveMarker,
    setCategoryFilter,
    clearCategory,
  } = useMapFilter(locations, categories)

  const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#F4F4F3]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin motion-reduce:animate-none" />
          <p className="text-xs font-semibold text-neutral-500">{t('map.loading')}</p>
        </div>
      </div>
    )
  }

  if (isLocationsError || isCategoriesError) {
    return <ErrorState onRetry={() => { refetchLocations(); refetchCategories() }} />
  }

  return (
    <div className="h-screen flex bg-[#F4F4F3] overflow-hidden">
      {sidebarOpen && (
        <LocationSidebar
          locations={filteredLocations}
          categoryMap={categoryMap}
          activeMarker={activeMarker}
          onHover={setActiveMarker}
        />
      )}

      {/* Peta full-bleed; seluruh kontrol melayang di atasnya supaya tinggi peta
          tidak lagi terpotong top bar yang membungkus di layar sempit. */}
      <main className="flex-1 relative">
        {/* Baris atas: navigasi + pencarian */}
        {/* pr-* menyisakan ruang untuk kolom kontrol di kanan (zoom + layer),
            jika tidak tombol zoom menimpa sisi kanan kolom pencarian. */}
        <div className="absolute top-3 left-3 right-3 pr-14 md:pr-[8.75rem] z-[1000] flex items-start gap-2 pointer-events-none">
          <div className="flex items-center gap-2 pointer-events-auto">
            <Link to="/" className={iconBtn} aria-label={t('nav.home')}>
              <Home className="w-4 h-4" />
            </Link>
            {/* Toggle sidebar hanya bermakna di desktop — di mobile daftar lokasi
                memakai bottom sheet, jadi tombol ini disembunyikan agar tidak jadi
                tombol mati seperti sebelumnya. */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-pressed={sidebarOpen}
              className={cn(iconBtn, 'hidden md:flex')}
              aria-label={t('map.toggle_sidebar')}
            >
              {sidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex-1 max-w-sm ml-auto pointer-events-auto">
            <SearchBar
              value={search}
              onChange={setSearch}
              className="[&_input]:h-11 [&_input]:bg-white [&_input]:border-neutral-200/80 [&_input]:shadow-sm [&_input]:rounded-2xl"
            />
          </div>
        </div>

        {/* Filter kategori: baris tersendiri agar tidak berdesakan dengan pencarian.
            Diberi jarak dari kontrol kanan supaya tidak tertimpa. */}
        <div className="absolute top-[4.25rem] left-3 right-3 md:right-[8.5rem] z-[999] pointer-events-none">
          <div className="pointer-events-auto">
            <CategoryFilterBar
              categories={categories}
              activeSlug={categoryFilter}
              onSelect={setCategoryFilter}
              onSelectAll={clearCategory}
            />
          </div>
        </div>

        <MapContainer
          center={[-7.384, 107.838]}
          zoom={14}
          className="h-full w-full"
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url={tileUrl}
          />

          {showDesaBoundary && desaBoundary && (
            <GeoJSON
              data={desaBoundary}
              style={{ color: '#C2410C', weight: 3, opacity: 0.9, fillColor: '#C2410C', fillOpacity: 0.04 }}
            />
          )}

          {showRwBoundary && rwBoundary && (
            <GeoJSON
              data={rwBoundary}
              style={(feature) => {
                const fid = (feature?.properties?.fid ?? 0) as number
                const color = rwColors[fid % rwColors.length]
                return {
                  color,
                  weight: 2,
                  opacity: 0.8,
                  dashArray: '4, 4',
                  fillColor: color,
                  fillOpacity: 0.12,
                }
              }}
              onEachFeature={(feature: Feature, layer) => {
                const props = feature.properties
                if (props) {
                  const name = props.nama_rw || `RW ${props.rw}`
                  const luas = props.luas_ha ? `${Number(props.luas_ha).toFixed(1)} Ha` : ''
                  layer.bindTooltip(
                    `<strong>${name}</strong>${luas ? `<br/><span style="font-size:11px;color:#666;">Luas: ${luas}</span>` : ''}`,
                    { permanent: false, direction: 'center', className: 'rw-tooltip' }
                  )
                }
              }}
            />
          )}

          <MapBoundsUpdater boundary={desaBoundary} locations={categoryLocations} />

          <MarkerClusterGroup chunkedLoading>
            {filteredLocations.map((loc) => (
              <LocationMarker
                key={loc.id}
                location={loc}
                category={categoryMap.get(loc.category_id)}
                active={activeMarker === loc.id}
              />
            ))}
          </MarkerClusterGroup>

          {/* Di dalam MapContainer karena butuh useMap() untuk zoom */}
          <MapControls
            showDesaBoundary={showDesaBoundary}
            showRwBoundary={showRwBoundary}
            onToggleDesa={() => setShowDesaBoundary(!showDesaBoundary)}
            onToggleRw={() => setShowRwBoundary(!showRwBoundary)}
          />
        </MapContainer>

        <MapLegend categories={categories} locations={filteredLocations} />

        <LocationSheet locations={filteredLocations} categoryMap={categoryMap} />
      </main>
    </div>
  )
}
