import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLocationBySlug } from '../hooks/useLocationBySlug'
import { useLocations } from '../hooks/useLocations'
import { useCategories } from '../hooks/useCategories'
import { ArrowLeft, MapPin, ChevronRight, ImageIcon, Info, Navigation } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { CategoryBadge } from '../components/CategoryBadge'
import { LocationCard } from '../components/LocationCard'
import { AnimatedSection } from '../components/AnimatedSection'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import { Icon } from 'leaflet'
import { motion } from 'framer-motion'
import 'leaflet/dist/leaflet.css'
import type { Location } from '../types'

function MiniMap({ lat, lng }: { lat: number; lng: number }) {
  return (
    <div className="h-56 rounded-2xl overflow-hidden border border-border shadow-sm">
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
              iconUrl: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cpath d='M16 2C10.48 2 6 6.48 6 12c0 6.28 10 18 10 18s10-11.72 10-18c0-5.52-4.48-10-10-10z' fill='%23C2410C'/%3E%3Ccircle cx='16' cy='12' r='4' fill='white'/%3E%3C/svg%3E`,
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
  const { t, i18n } = useTranslation()
  const { data: location, isLoading } = useLocationBySlug(slug!)
  const { data: allLocations } = useLocations()
  const { data: categories } = useCategories()
  const lang = i18n.language

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Memuat lokasi...</p>
        </div>
      </div>
    )
  }

  if (!location) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <MapPin className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
        <h2 className="font-heading text-xl font-semibold text-foreground mb-2">{t('location.not_found')}</h2>
        <Link to="/map">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="w-4 h-4" /> {t('location.back_to_map')}
          </Button>
        </Link>
      </div>
    )
  }

  const name = (location as any)[`name_${lang}`] || location.name_id
  const desc = (location as any)[`description_${lang}`] || location.description_id
  const category = categories?.find((c) => c.slug === location.category_slug || c.id === location.category_id)
  const catName = category ? (category as any)[`name_${lang}`] || category.name_id : ''

  const relatedLocations: Location[] =
    allLocations?.filter(
      (l: Location) => l.category_id === location.category_id && l.id !== location.id
    ).slice(0, 3) || []

  const images = location.images || []
  const coords = location.coordinates || []

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link to="/" className="hover:text-foreground transition-colors">{t('nav.home')}</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/map" className="hover:text-foreground transition-colors">{t('nav.map')}</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-foreground font-medium truncate max-w-[200px]">{name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header */}
          <AnimatedSection>
            <div className="flex items-center gap-2 mb-4">
              {category && <CategoryBadge slug={category.slug} name={catName} />}
              {location.featured && <Badge variant="default">Unggulan</Badge>}
            </div>
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
              {name}
            </h1>
          </AnimatedSection>

          {/* Tabs: Gallery + Description */}
          <AnimatedSection delay={0.1}>
            <Tabs defaultValue="gallery">
              <TabsList className="mb-4">
                <TabsTrigger value="gallery">
                  <ImageIcon className="w-4 h-4 mr-1.5" />
                  {t('location.images')}
                </TabsTrigger>
                <TabsTrigger value="description">
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
                        className={`relative rounded-2xl overflow-hidden border border-border bg-muted ${i === 0 ? 'col-span-2 h-64' : 'h-40'}`}
                      >
                        <img
                          src={img}
                          alt={`${name} - ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-2 left-2 bg-foreground/80 text-surface text-xs px-2.5 py-1 rounded-lg font-medium">
                          Gambar {i + 1}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="h-48 rounded-2xl border border-dashed border-border bg-muted/50 flex items-center justify-center">
                    <div className="text-center">
                      <ImageIcon className="w-8 h-8 mx-auto text-muted-foreground/30 mb-2" />
                      <p className="text-sm text-muted-foreground">Belum ada gambar</p>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="description">
                <div className="prose prose-stone max-w-none">
                  <p className="text-muted-foreground leading-relaxed text-base">{desc}</p>
                </div>
              </TabsContent>
            </Tabs>
          </AnimatedSection>

          {/* Related Locations */}
          {relatedLocations.length > 0 && (
            <AnimatedSection delay={0.2}>
              <div className="pt-8 border-t border-border/60">
                <h2 className="font-heading text-xl font-semibold text-foreground mb-5">
                  Lokasi Lain di Kategori {catName}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {relatedLocations.map((loc) => (
                    <LocationCard key={loc.id} location={loc} category={category} />
                  ))}
                </div>
              </div>
            </AnimatedSection>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <AnimatedSection delay={0.15}>
            <div className="sticky top-24 space-y-6">
              {/* Mini Map */}
              {coords.length >= 2 && (
                <div>
                  <MiniMap lat={coords[1]} lng={coords[0]} />
                  <div className="mt-2.5 text-xs text-muted-foreground flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5" />
                    <span className="font-mono">{coords[1].toFixed(6)}, {coords[0].toFixed(6)}</span>
                  </div>
                </div>
              )}

              {/* Info Card */}
              <div className="rounded-2xl border border-border/60 bg-surface-card p-6 space-y-5">
                <h3 className="font-heading font-semibold text-foreground text-sm uppercase tracking-wider">
                  Informasi Lokasi
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-0.5">Kategori</p>
                    <p className="text-sm font-medium text-foreground">{catName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-0.5">Koordinat</p>
                    <p className="text-sm font-medium text-foreground font-mono">
                      {coords[1]?.toFixed(4)}, {coords[0]?.toFixed(4)}
                    </p>
                  </div>
                </div>
                <div className="pt-4 border-t border-border/60">
                  <Link to="/map">
                    <Button variant="outline" className="w-full">
                      <ArrowLeft className="w-4 h-4" /> {t('location.back_to_map')}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  )
}
