import { useLocations } from '../hooks/useLocations'
import { useCategories } from '../hooks/useCategories'
import { useHamlets } from '../hooks/useHamlets'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { ArrowRight, ArrowUpRight, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'
import { LocationCard } from '../components/LocationCard'
import { CategoryBadge } from '../components/CategoryBadge'
import { AnimatedSection } from '../components/AnimatedSection'
import { ErrorState } from '../components/ErrorState'
import { HeroParallax } from '../components/HeroParallax'
import { MagneticText } from '../components/ui/morphing-cursor'
import { Marquee } from '../components/ui/Marquee'
import { SectionHeading } from '../components/ui/SectionHeading'
import { CountUp } from '../components/ui/CountUp'
import { getPopulationSummary } from '../lib/demographics'
import { categoryColor } from '../lib/leafletIcons'
import type { Location } from '../types'

export function HomePage() {
  const { t } = useTranslation()
  const { data: locations, isLoading, isError, refetch } = useLocations()
  const { data: categories } = useCategories()
  const { data: hamlets } = useHamlets()

  const featuredLocations = locations?.filter((loc: Location) => loc.featured).slice(0, 6) || []
  const penduduk = getPopulationSummary(hamlets)

  if (isError) {
    return <ErrorState onRetry={refetch} />
  }

  const angka = [
    { label: t('stats.locations'), value: locations?.length ?? 0, suffix: '' },
    { label: t('stats.categories'), value: categories?.length ?? 0, suffix: '' },
    { label: t('stats.population'), value: penduduk.total, suffix: '' },
    { label: t('village.rw_count'), value: hamlets?.length ?? 0, suffix: '' },
  ]

  return (
    <div className="bg-surface text-foreground">
      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <HeroParallax
        className="relative overflow-hidden pt-14 pb-20 md:pt-24 md:pb-28"
        background={
          <>
            {/* Foto lanskap desa. Dekoratif murni (alt kosong) — seluruh informasi
                sudah ada di teks, jadi pembaca layar tidak perlu mendengarnya. */}
            <img
              src="/images/background_hero.webp"
              srcSet="/images/background_hero-800.webp 800w, /images/background_hero-1280.webp 1280w, /images/background_hero.webp 1831w"
              sizes="100vw"
              alt=""
              aria-hidden="true"
              fetchPriority="high"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            {/* Scrim: teks hero berwarna gelap, sedangkan foto ini terang di bagian
                atas dan ramai di bawah. Tanpa lapisan ini kontrasnya jatuh di bawah
                ambang keterbacaan. Dijaga setipis mungkin (70%->45%) supaya fotonya
                tetap jelas: pada nilai ini teks terkelap masih 5.2:1. */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-r from-surface/70 via-surface/58 to-surface/45"
            />
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-surface"
            />
          </>
        }
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-8"
          >
            <span className="w-8 h-px bg-primary" />
            <span className="eyebrow">{t('hero.eyebrow')}</span>
          </motion.div>

          {/* Wordmark raksasa — huruf muncul bertahap, lalu kata kedua tersingkap
              mengikuti kursor. Teks berhuruf-huruf diberikan sebagai `children`
              supaya animasi masuknya tetap hidup, tidak tergantikan. */}
          <h1 className="mb-8" aria-label={`${t('hero.wordmark')} — ${t('hero.wordmark_hover')}`}>
            <span className="sr-only">
              {t('hero.wordmark')} — {t('hero.wordmark_hover')}
            </span>
            <MagneticText
              text={t('hero.wordmark')}
              hoverText={t('hero.wordmark_hover')}
              textClassName="text-display"
            >
              <span aria-hidden="true" className="flex flex-wrap text-display text-foreground">
                {t('hero.wordmark').split('').map((huruf, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: '0.25em' }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.05 + i * 0.035, ease: [0.22, 1, 0.36, 1] }}
                    className="inline-block"
                  >
                    {huruf}
                  </motion.span>
                ))}
              </span>
            </MagneticText>
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              // neutral-600, bukan muted-foreground: di atas foto, #737373 hanya
              // mencapai kontras 3.5:1 — di bawah ambang 4.5:1 untuk teks bodi.
              className="lg:col-span-7 text-base sm:text-lg text-neutral-800 leading-relaxed max-w-2xl"
            >
              {t('hero.subtitle')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="lg:col-span-5 flex flex-wrap items-center gap-3 lg:justify-end"
            >
              <Link
                to="/map"
                className="group inline-flex items-center gap-2 min-h-11 px-6 rounded-2xl bg-foreground text-white text-sm font-semibold shadow-xs transition-colors hover:bg-neutral-800 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 motion-reduce:transition-none"
              >
                {t('hero.cta')}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
              </Link>
              <Link
                to="/desa"
                className="inline-flex items-center gap-2 min-h-11 px-6 rounded-2xl bg-surface-card border border-border text-sm font-semibold text-foreground transition-colors hover:border-neutral-400 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 motion-reduce:transition-none"
              >
                {t('hero.cta_secondary')}
              </Link>
            </motion.div>
          </div>
        </div>
      </HeroParallax>

      {/* ── MARQUEE KATEGORI ─────────────────────────────────────────── */}
      <div className="border-y border-border/60 py-5 bg-surface">
        <Marquee
          durasi={45}
          items={(categories ?? []).map((cat) => (
            <span key={cat.id} className="flex items-center gap-2.5">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: categoryColor(cat.slug) }}
              />
              <span className="font-heading text-sm font-semibold uppercase tracking-[0.14em] text-foreground">
                {cat.name_id}
              </span>
            </span>
          ))}
        />
      </div>

      {/* ── DESA DALAM ANGKA ─────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <AnimatedSection>
          <SectionHeading eyebrow={t('stats.eyebrow')} title={t('stats.title')} />
        </AnimatedSection>

        <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-border">
          {angka.map((item, i) => (
            <AnimatedSection key={item.label} delay={i * 0.06}>
              <div className="py-8 pr-4 border-b border-border h-full">
                <span className="font-mono text-xs text-muted-foreground block mb-3">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="font-heading text-4xl md:text-5xl font-bold tracking-tight tabular-nums">
                  <CountUp value={item.value} suffix={item.suffix} />
                </div>
                <div className="text-xs font-medium text-muted-foreground mt-2">{item.label}</div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* ── DEMOGRAFI ────────────────────────────────────────────────── */}
      <section className="border-t border-border/60 bg-surface-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <AnimatedSection>
            <SectionHeading
              eyebrow={t('demografi.eyebrow')}
              title={t('demografi.title')}
              subtitle={t('demografi.subtitle')}
            />
          </AnimatedSection>

          <AnimatedSection>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 items-start">
              <div className="sm:col-span-1 space-y-6">
                <div>
                  <div className="font-heading text-6xl md:text-7xl font-bold tracking-tight tabular-nums leading-none">
                    <CountUp value={penduduk.total} />
                  </div>
                  <div className="eyebrow mt-3">{t('demografi.total')}</div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border">
                  <div>
                    <div className="font-heading text-2xl font-bold tabular-nums">
                      <CountUp value={penduduk.laki_laki} />
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{t('demografi.male')}</div>
                  </div>
                  <div>
                    <div className="font-heading text-2xl font-bold tabular-nums">
                      <CountUp value={penduduk.perempuan} />
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{t('demografi.female')}</div>
                  </div>
                </div>
              </div>

            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── LOKASI UNGGULAN ──────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <AnimatedSection>
          <SectionHeading
            eyebrow={t('featured.eyebrow')}
            title={t('featured.title')}
            subtitle={t('featured.subtitle')}
            action={
              <Link
                to="/map"
                className="group inline-flex items-center gap-1.5 min-h-11 text-sm font-semibold text-foreground hover:text-primary transition-colors cursor-pointer motion-reduce:transition-none"
              >
                {t('featured.view_all')}
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none" />
              </Link>
            }
          />
        </AnimatedSection>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl border border-border bg-surface-card h-56 animate-pulse motion-reduce:animate-none" />
            ))}
          </div>
        ) : featuredLocations.length === 0 ? (
          <div className="border border-dashed border-border rounded-3xl py-16 text-center">
            <MapPin className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">{t('featured.empty')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredLocations.map((location: Location, i: number) => (
              <AnimatedSection key={location.id} delay={i * 0.07}>
                <LocationCard
                  location={location}
                  category={categories?.find((c) => c.id === location.category_id)}
                  featured
                />
              </AnimatedSection>
            ))}
          </div>
        )}
      </section>

      {/* ── KATEGORI ─────────────────────────────────────────────────── */}
      <section className="border-t border-border/60 bg-surface-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <AnimatedSection>
            <SectionHeading
              eyebrow={t('categories.eyebrow')}
              title={t('categories.title')}
              subtitle={t('categories.subtitle')}
            />
          </AnimatedSection>

          <AnimatedSection>
            <div className="flex flex-wrap gap-2.5">
              {categories?.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/map?category=${cat.slug}`}
                  className="rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
                >
                  <CategoryBadge slug={cat.slug} name={cat.name_id} className="min-h-11 px-4" />
                </Link>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
