import { useTranslation } from 'react-i18next'
import { MapPin, Heart, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Footer() {
  const { t } = useTranslation()

  const quickLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/map', label: t('nav.map') },
  ]

  const categories = [
    { slug: 'sekolah', label: t('category.sekolah') },
    { slug: 'wisata', label: t('category.wisata') },
    { slug: 'umkm', label: t('category.umkm') },
    { slug: 'ibadah', label: t('category.ibadah') },
    { slug: 'perkebunan', label: t('category.perkebunan') },
  ]

  return (
    <footer className="border-t border-border/40 bg-foreground text-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-md">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-heading font-semibold text-lg">{t('footer.title')}</span>
                <span className="block text-[10px] uppercase tracking-[0.2em] text-surface/50 -mt-0.5">
                  Kec. Cikajang, Kab. Garut
                </span>
              </div>
            </div>
            <p className="text-sm text-surface/50 leading-relaxed max-w-sm">
              {t('footer.desc')}
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-heading font-semibold text-sm uppercase tracking-wider text-surface/70">
              Navigasi
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-surface/50 hover:text-surface transition-colors inline-flex items-center gap-1"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="font-heading font-semibold text-sm uppercase tracking-wider text-surface/70">
              Kategori
            </h4>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  to={`/map?category=${cat.slug}`}
                  className="text-xs px-3 py-1.5 rounded-full bg-surface/10 text-surface/60 hover:bg-primary/20 hover:text-surface transition-all duration-200"
                >
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-surface/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-surface/30">
          <p>{t('footer.copyright')}</p>
          <p className="flex items-center gap-1">
            Dibangun dengan <Heart className="w-3 h-3 text-primary fill-primary" /> untuk Desa Mekarjaya
          </p>
        </div>
      </div>
    </footer>
  )
}
