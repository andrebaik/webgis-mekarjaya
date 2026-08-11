import { useParams, Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { isAxiosError } from 'axios'
import { useLocationBySlug } from '../hooks/useLocationBySlug'
import { useLocations } from '../hooks/useLocations'
import { useCategories } from '../hooks/useCategories'
import { ErrorState } from '../components/ErrorState'
import { ArrowLeft, MapPin, ChevronRight, ImageIcon, Info, Navigation } from 'lucide-react'
import { CategoryBadge } from '../components/CategoryBadge'
import { LocationCard } from '../components/LocationCard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import { Icon } from 'leaflet'
import { motion } from 'framer-motion'
import 'leaflet/dist/leaflet.css'
import type { Location } from '../types'

function MiniMap({ lat, lng }: { lat: number; lng: number }) {
  return (
    <div className="h-56 rounded-2xl overflow-hidden border border-neutral-200/80 shadow-xs">
      <MapContainer
        center={[lat, lng]}
        zoom={15}
        className="h-full w-full"
        zoomControl={false}
        scrollWheelZoom={false}
        dragging={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker
          position={[lat, lng]}
          icon={
            new Icon({
              iconUrl: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cpath d='M16 2C10.48 2 6 6.48 6 12c0 6.28 10 18 10 18s10-11.72 10-18c0-5.52-4.48-10-10-10z' fill='%23171717'/%3E%3Ccircle cx='16' cy='12' r='4' fill='white'/%3E%3C/svg%3E`,
              iconSize: [32, 32],
              iconAnchor: [16, 32],
            })
          }
        />
      </MapContainer>
    </div>
  )
}

export function LocationDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { t } = useTranslation()
  const { data: location, isLoading, isError, error, refetch } = useLocationBySlug(slug!)
  const { data: allLocations } = useLocations()
  const { data: categories } = useCategories()
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-[#F4F4F3]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-neutral-500">{t('location.loading')}</p>
        </div>
      </div>
    )
  }

  const notFound = isError && isAxiosError(error) && error.response?.status === 404

  if (isError && !notFound) {
    return <ErrorState onRetry={refetch} />
  }

  if (!location) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <MapPin className="w-12 h-12 mx-auto text-neutral-300 mb-4" />
        <h2 className="font-heading text-xl font-bold text-neutral-900 mb-2">{t('location.not_found')}</h2>
        <Link
          to="/map"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-neutral-200 text-xs font-semibold text-neutral-700 hover:text-neutral-900 shadow-xs transition-all mt-4"
        >
          <ArrowLeft className="w-4 h-4" /> {t('location.back_to_map')}
        </Link>
      </div>
    )
  }

  const name = location.name_id
  const desc = (location.description_id ?? '')
  const category = categories?.find((c) => c.slug === location.category_slug || c.id === location.category_id)
  const catName = category ? category.name_id : ''

  const relatedLocations: Location[] =
    allLocations?.filter(
      (l: Location) => l.category_id === location.category_id && l.id !== location.id
    ).slice(0, 3) || []

  const images = location.images || []
  const coords = location.coordinates || []

  return (
    <div className="min-h-screen bg-[#F4F4F3] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Trail */}
        <nav className="flex items-center gap-2 text-xs font-medium text-neutral-400 mb-6">
          <Link to="/" className="hover:text-neutral-900 transition-colors">{t('nav.home')}</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/map" className="hover:text-neutral-900 transition-colors">{t('nav.map')}</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-neutral-900 font-bold truncate max-w-[200px]">{name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 md:p-8 shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                {category && <CategoryBadge slug={category.slug} name={catName} />}
                {location.featured && (
                  <span className="text-[10px] uppercase tracking-[0.15em] font-bold text-neutral-900 bg-neutral-100 px-2.5 py-1 rounded-full border border-neutral-200">
                    {t('location.featured_badge')}
                  </span>
                )}
              </div>
              <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-900 leading-tight">
                {name}
              </h1>
            </div>

            {/* Tabs: Gallery & Description */}
            <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 shadow-xs">
              <Tabs defaultValue="gallery">
                <TabsList className="mb-4 bg-neutral-100/70 p-1 rounded-2xl">
                  <TabsTrigger value="gallery" className="rounded-xl text-xs font-semibold">
                    <ImageIcon className="w-4 h-4 mr-1.5" />
                    {t('location.images')}
                  </TabsTrigger>
                  <TabsTrigger value="description" className="rounded-xl text-xs font-semibold">
                    <Info className="w-4 h-4 mr-1.5" />
                    {t('location.description')}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="gallery">
                  {images.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3">
                      {images.map((img: string, i: number) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.1 }}
                          className={`relative rounded-2xl overflow-hidden border border-neutral-200/80 bg-neutral-100 ${
                            i === 0 ? 'col-span-2 h-64' : 'h-40'
                          }`}
                        >
                          <img
                            src={img}
                            alt={`${name} - ${i + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-2 left-2 bg-neutral-900/80 backdrop-blur-md text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-lg">
                            {t('location.image_label', { index: i + 1 })}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-48 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 flex items-center justify-center">
                      <div className="text-center">
                        <ImageIcon className="w-8 h-8 mx-auto text-neutral-300 mb-2" />
                        <p className="text-xs font-medium text-neutral-400">{t('location.no_images')}</p>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="description">
                  <div className="prose prose-neutral max-w-none">
                    <p className="text-neutral-600 leading-relaxed text-sm">{desc}</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Related Locations */}
            {relatedLocations.length > 0 && (
              <div className="pt-4">
                <h2 className="font-heading text-lg font-bold text-neutral-900 mb-4">
                  {t('location.related', { category: catName })}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {relatedLocations.map((loc) => (
                    <LocationCard key={loc.id} location={loc} category={category} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="sticky top-20 space-y-6">
              {/* Mini Map */}
              {coords.length >= 2 && (
                <div className="bg-white rounded-3xl border border-neutral-200/80 p-4 shadow-xs">
                  <MiniMap lat={coords[1]} lng={coords[0]} />
                  <div className="mt-3 text-xs font-mono text-neutral-400 flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5 text-neutral-900" />
                    <span>{coords[1].toFixed(6)}, {coords[0].toFixed(6)}</span>
                  </div>
                </div>
              )}

              {/* Info Card */}
              <div className="rounded-3xl border border-neutral-200/80 bg-white p-6 space-y-5 shadow-xs">
                <h3 className="font-heading font-bold text-neutral-900 text-xs uppercase tracking-wider">
                  {t('location.info_title')}
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider mb-0.5">
                      {t('location.category')}
                    </p>
                    <p className="text-xs font-bold text-neutral-900">{catName}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider mb-0.5">
                      {t('location.coordinates')}
                    </p>
                    <p className="text-xs font-mono font-semibold text-neutral-900">
                      {coords[1]?.toFixed(4)}, {coords[0]?.toFixed(4)}
                    </p>
                  </div>
                </div>
                <div className="pt-4 border-t border-neutral-100">
                  <Link
                    to="/map"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-100 border border-neutral-200/80 text-xs font-semibold text-neutral-700 hover:text-neutral-900 shadow-xs transition-all"
                  >
                    <ArrowLeft className="w-4 h-4" /> {t('location.back_to_map')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
