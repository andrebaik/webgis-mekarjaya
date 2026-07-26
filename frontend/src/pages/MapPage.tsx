import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useLocations } from '../hooks/useLocations'
import { useCategories } from '../hooks/useCategories'
import { useTranslation } from 'react-i18next'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import { Icon, type DivIcon } from 'leaflet'
import { PanelLeftClose, PanelLeft, MapPin, Layers, Home } from 'lucide-react'
import 'leaflet/dist/leaflet.css'
import { Badge } from '../components/ui/badge'
import { CategoryBadge } from '../components/CategoryBadge'
import { SearchBar } from '../components/SearchBar'
import { ScrollArea } from '../components/ui/scroll-area'
import { useTheme } from '../lib/theme'
import type { Location, Category } from '../types'

const categoryIconColors: Record<string, string> = {
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
}

function createCustomIcon(categorySlug: string, isActive: boolean = false): DivIcon {
  const color = categoryIconColors[categorySlug] || '#6B7280'
  const size = isActive ? 36 : 28

  return new Icon({
    iconUrl: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cpath d='M16 2C10.48 2 6 6.48 6 12c0 6.28 10 18 10 18s10-11.72 10-18c0-5.52-4.48-10-10-10z' fill='${encodeURIComponent(color)}'/%3E%3Ccircle cx='16' cy='12' r='4' fill='white'/%3E%3C/svg%3E`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
    className: 'marker-transition',
  })
}

function MapBoundsUpdater({ locations }: { locations: Location[] }) {
  const map = useMap()

  useEffect(() => {
    if (locations.length === 0) return
    const bounds = locations.map((loc) => [loc.coordinates[1], loc.coordinates[0]] as [number, number])
    if (bounds.length > 0) {
      const padding = 0.02
      const allBounds = bounds.flat()
      const minLat = Math.min(...allBounds.filter((_, i) => i % 2 === 0))
      const maxLat = Math.max(...allBounds.filter((_, i) => i % 2 === 0))
      const minLng = Math.min(...allBounds.filter((_, i) => i % 2 === 1))
      const maxLng = Math.max(...allBounds.filter((_, i) => i % 2 === 1))
      map.fitBounds(
        [
          [minLat - padding, minLng - padding],
          [maxLat + padding, maxLng + padding],
        ],
        { padding: [50, 50] }
      )
    }
  }, [map, locations])

  return null
}

export function MapPage() {
  const { t, i18n } = useTranslation()
  const { data: locations, isLoading } = useLocations()
  const { data: categories } = useCategories()
  const [searchParams, setSearchParams] = useSearchParams()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [search, setSearch] = useState('')
  const [activeMarker, setActiveMarker] = useState<number | null>(null)
  const { theme } = useTheme()
  const navigate = useNavigate()

  const categoryFilter = searchParams.get('category') || ''
  const lang = i18n.language

  const categoryMap = useMemo(() => {
    const map = new Map<number, Category>()
    categories?.forEach((c) => map.set(c.id, c))
    return map
  }, [categories])

  const filteredLocations = useMemo(() => {
    if (!locations) return []
    let result = locations

    if (categoryFilter) {
      const cat = categories?.find((c) => c.slug === categoryFilter)
      if (cat) result = result.filter((loc) => loc.category_id === cat.id)
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter((loc) => {
        const name = ((loc as any)[`name_${lang}`] || loc.name_id).toLowerCase()
        const desc = ((loc as any)[`description_${lang}`] || loc.description_id || '').toLowerCase()
        return name.includes(q) || desc.includes(q)
      })
    }

    return result
  }, [locations, categoryFilter, categories, search, lang])

  const tileUrl = theme === 'dark'
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

  const setCategoryFilter = (slug: string) => {
    if (slug === categoryFilter) {
      setSearchParams({})
    } else {
      setSearchParams({ category: slug })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-surface">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Memuat peta...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Top bar */}
      <div className="bg-surface-card border-b border-border px-4 py-2 flex items-center gap-2 shrink-0">
        <Link to="/" className="p-1.5 rounded-lg hover:bg-muted transition-colors cursor-pointer" aria-label="Home">
          <Home className="w-5 h-5 text-muted-foreground" />
        </Link>
        <div className="w-px h-5 bg-border" />
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded-lg hover:bg-muted transition-colors cursor-pointer"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? (
            <PanelLeftClose className="w-5 h-5 text-muted-foreground" />
          ) : (
            <PanelLeft className="w-5 h-5 text-muted-foreground" />
          )}
        </button>
        <div className="flex-1 flex items-center gap-2 overflow-x-auto scrollbar-hide">
          <Badge
            variant={categoryFilter === '' ? 'default' : 'outline'}
            className="cursor-pointer shrink-0 text-xs sm:text-sm"
            onClick={() => setSearchParams({})}
          >
            <Layers className="w-3.5 h-3.5 mr-1" />
            {t('map.all')}
          </Badge>
          {categories?.map((cat) => (
            <CategoryBadge
              key={cat.id}
              slug={cat.slug}
              name={(cat as any)[`name_${lang}`] || cat.name_id}
              active={categoryFilter === cat.slug}
              onClick={() => setCategoryFilter(cat.slug)}
            />
          ))}
        </div>
        <SearchBar value={search} onChange={setSearch} className="hidden sm:block w-56" />
      </div>

      {/* Map + Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        {sidebarOpen && (
          <ScrollArea className="w-80 border-r border-border bg-surface shrink-0 hidden md:block">
            <div className="p-3 sm:hidden">
              <SearchBar value={search} onChange={setSearch} />
            </div>
            <div className="p-3 space-y-2">
              {filteredLocations.length === 0 ? (
                <div className="text-center py-12">
                  <MapPin className="w-8 h-8 mx-auto text-muted-foreground/50 mb-2" />
                  <p className="text-sm text-muted-foreground">{t('map.no_results')}</p>
                </div>
              ) : (
                filteredLocations.map((loc) => {
                  const cat = categoryMap.get(loc.category_id)
                  const name = (loc as any)[`name_${lang}`] || loc.name_id
                  return (
                    <Link
                      key={loc.id}
                      to={`/location/${loc.slug}`}
                      onMouseEnter={() => setActiveMarker(loc.id)}
                      onMouseLeave={() => setActiveMarker(null)}
                      className={`block p-3 rounded-xl border transition-all duration-200 ${
                        activeMarker === loc.id
                          ? 'border-primary bg-primary/5 shadow-sm'
                          : 'border-border bg-surface-card hover:border-primary/30 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="w-3 h-3 rounded-full mt-1 shrink-0"
                          style={{ backgroundColor: categoryIconColors[cat?.slug || ''] || '#6B7280' }}
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5 truncate">
                            {cat ? (cat as any)[`name_${lang}`] || cat.name_id : ''}
                          </p>
                        </div>
                      </div>
                    </Link>
                  )
                })
              )}
            </div>
            <div className="border-t border-border px-3 py-2">
              <p className="text-xs text-muted-foreground">{filteredLocations.length} lokasi</p>
            </div>
          </ScrollArea>
        )}

        {/* Map */}
        <div className="flex-1 relative">
          <div className="md:hidden absolute top-2 left-2 right-2 z-[1000]">
            <SearchBar value={search} onChange={setSearch} />
          </div>
          <MapContainer
            center={[-7.24, 107.8572]}
            zoom={14}
            className="h-full w-full"
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url={tileUrl}
            />
            <MapBoundsUpdater locations={filteredLocations} />
            <MarkerClusterGroup chunkedLoading>
              {filteredLocations.map((loc: Location) => {
                const cat = categoryMap.get(loc.category_id)
                const name = (loc as any)[`name_${lang}`] || loc.name_id
                const catName = cat ? (cat as any)[`name_${lang}`] || cat.name_id : ''
                const desc = (loc as any)[`description_${lang}`] || loc.description_id || ''
                const coords = `${loc.coordinates[1].toFixed(4)}°S, ${loc.coordinates[0].toFixed(4)}°E`
                return (
                  <Marker
                    key={loc.id}
                    position={[loc.coordinates[1], loc.coordinates[0]]}
                    icon={createCustomIcon(cat?.slug || '', activeMarker === loc.id)}
                  >
                    <Popup maxWidth={300} minWidth={240} className="location-popup">
                      <div className="space-y-2.5">
                        {loc.images?.[0] && (
                          <div className="-mx-4 -mt-[14px] mb-2 rounded-t-xl overflow-hidden h-28">
                            <img
                              src={loc.images[0]}
                              alt={name}
                              className="w-full h-full object-cover"
                              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                            />
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: categoryIconColors[cat?.slug || ''] || '#6B7280' }}
                          />
                          <span className="text-xs font-medium text-muted-foreground tracking-wide uppercase">{catName}</span>
                        </div>
                        <h3 className="font-heading font-semibold text-foreground text-base leading-tight -mt-1">{name}</h3>
                        {desc && (
                          <p className="text-xs text-muted-foreground/80 leading-relaxed line-clamp-2">{desc}</p>
                        )}
                        <p className="text-[10px] text-muted-foreground/50 font-mono">{coords}</p>
                        <button
                          onClick={() => navigate(`/location/${loc.slug}`)}
                          className="w-full bg-primary text-white text-sm font-medium py-2 rounded-lg hover:bg-primary-dark transition-all duration-200 active:scale-[0.98] cursor-pointer"
                        >
                          {t('map.view_details')}
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                )
              })}
            </MarkerClusterGroup>
          </MapContainer>
        </div>
      </div>
    </div>
  )
}
