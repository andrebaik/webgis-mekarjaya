import { useLocations } from '../hooks/useLocations'
import { useCategories } from '../hooks/useCategories'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ArrowRight, Map, Mountain, School, Store, TreePine, Landmark } from 'lucide-react'
import { Button } from '../components/ui/button'
import { LocationCard } from '../components/LocationCard'
import { CategoryBadge } from '../components/CategoryBadge'
import { AnimatedSection } from '../components/AnimatedSection'
import { motion } from 'framer-motion'
import type { Location } from '../types'

const categoryIcons: Record<string, React.ElementType> = {
  sekolah: School,
  wisata: Mountain,
  umkm: Store,
  perkebunan: TreePine,
  ibadah: Landmark,
}

export function HomePage() {
  const { t, i18n } = useTranslation()
  const { data: locations, isLoading } = useLocations()
  const { data: categories } = useCategories()
  const lang = i18n.language

  const featuredLocations = locations?.filter((loc: Location) => loc.featured).slice(0, 6) || []

  return (
    <div className="min-h-screen">
      {/* Hero — Editorial Style */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-6">
                <Map className="w-3.5 h-3.5" />
                Kecamatan Cikajang, Kabupaten Garut
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-[1.1] mb-6"
            >
              {t('hero.title').split('\n').map((line, i) => (
                <span key={i}>
                  {line}
                  {i === 0 && <br />}
                </span>
              ))}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8 leading-relaxed"
            >
              {t('hero.subtitle')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-wrap items-center gap-4"
            >
              <Link to="/map">
                <Button size="lg" className="shadow-lg hover:shadow-xl">
                  {t('hero.cta')}
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="flex -space-x-2">
                  {['wisata', 'sekolah', 'umkm', 'perkebunan'].map((s) => {
                    const Icon = categoryIcons[s] || Map
                    return (
                      <div key={s} className="w-9 h-9 rounded-full bg-surface-card border-2 border-surface flex items-center justify-center shadow-sm">
                        <Icon className="w-4 h-4 text-primary/70" />
                      </div>
                    )
                  })}
                </div>
                <span className="font-medium">{locations?.length || 0} lokasi tercatat</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats — Bento Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 relative z-10">
        <AnimatedSection>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { value: locations?.length || 0, label: t('stats.locations'), icon: Map, color: 'text-primary' },
              { value: categories?.length || 0, label: t('stats.categories'), icon: Mountain, color: 'text-secondary' },
              { value: '3', label: 'Bahasa', icon: Landmark, color: 'text-accent' },
              { value: '100%', label: t('stats.coverage'), icon: TreePine, color: 'text-primary' },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-surface-card rounded-2xl border border-border/60 p-5 hover:shadow-md transition-all duration-300 group"
              >
                <stat.icon className={`w-5 h-5 ${stat.color} mb-3 opacity-60 group-hover:opacity-100 transition-opacity`} />
                <div className="font-heading text-2xl md:text-3xl font-bold text-foreground">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground mt-1 font-medium uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* Featured Locations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <AnimatedSection>
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">{t('featured.title')}</h2>
              <p className="text-muted-foreground mt-2 text-sm">Lokasi-lokasi pilihan di Desa Mekarjaya</p>
            </div>
            <Link
              to="/map"
              className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-light transition-colors"
            >
              {t('featured.view_all')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </AnimatedSection>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl border border-border/60 bg-surface-card overflow-hidden">
                <div className="h-40 bg-muted animate-pulse" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-muted rounded-lg w-3/4 animate-pulse" />
                  <div className="h-4 bg-muted rounded-lg w-1/2 animate-pulse" />
                  <div className="h-3 bg-muted rounded-lg w-full animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : featuredLocations.length === 0 ? (
          <div className="text-center py-20">
            <Map className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">{t('featured.empty')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredLocations.map((location: Location, i: number) => {
              const category = categories?.find((c) => c.id === location.category_id)
              return (
                <AnimatedSection key={location.id} delay={i * 0.08}>
                  <LocationCard location={location} category={category} featured />
                </AnimatedSection>
              )
            })}
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link to="/map">
            <Button variant="outline" className="w-full">
              {t('featured.view_all')} <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Categories — Editorial Grid */}
      <section className="border-y border-border/40 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <AnimatedSection>
            <div className="text-center mb-10">
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-2">
                Jelajahi Berdasarkan Kategori
              </h2>
              <p className="text-muted-foreground text-sm">Temukan lokasi berdasarkan minat Anda</p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <div className="flex flex-wrap justify-center gap-2.5">
              {categories?.map((cat) => (
                <Link key={cat.id} to={`/map?category=${cat.slug}`}>
                  <CategoryBadge
                    slug={cat.slug}
                    name={(cat as any)[`name_${lang}`] || cat.name_id}
                    className="px-4 py-2 text-sm hover:scale-[1.03] transition-transform"
                  />
                </Link>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="text-center mt-10">
              <Link to="/map">
                <Button variant="outline">
                  <Map className="w-4 h-4" /> Lihat Semua di Peta
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
