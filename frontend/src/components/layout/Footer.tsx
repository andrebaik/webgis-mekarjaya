import { useTranslation } from 'react-i18next'
import { useCategories } from '../../hooks/useCategories'
import { MapPin, Heart, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router'

export function Footer() {
  const { t } = useTranslation()
  const { data: categories } = useCategories()
  const quickLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/desa', label: t('nav.profil_desa') },
    { to: '/map', label: t('nav.map') },
  ]

  return (
    <footer className="border-t border-neutral-200/60 bg-[#F4F4F3] text-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-neutral-900 text-white flex items-center justify-center shadow-xs">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="font-heading font-bold text-sm tracking-tight block text-neutral-900">
                  {t('footer.title')}
                </span>
                <span className="block text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-medium -mt-0.5">
                  {t('hero.region')}
                </span>
              </div>
            </div>
            <p className="text-xs text-neutral-500 leading-relaxed max-w-sm">
              {t('footer.desc')}
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
              {t('footer.nav')}
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-xs font-medium text-neutral-600 hover:text-neutral-900 transition-colors inline-flex items-center gap-1"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 text-neutral-400" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
              {t('footer.categories')}
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {categories?.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/map?category=${cat.slug}`}
                  className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-white border border-neutral-200/80 text-neutral-600 hover:text-neutral-900 shadow-xs transition-all"
                >
                  {cat.name_id}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-neutral-200/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-400">
          <p>{t('footer.copyright')}</p>
          <p className="flex items-center gap-1 font-medium text-neutral-500">
            {t('footer.built_prefix')} <Heart className="w-3 h-3 text-red-500 fill-red-500" />{' '}
            {t('footer.built_suffix')}
          </p>
        </div>
      </div>
    </footer>
  )
}
