import { useState } from 'react'
import { Link, useLocation } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Menu, X, MapPin } from 'lucide-react'
import { cn } from '../../lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

export function Navbar() {
  const { t } = useTranslation()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const links = [
    { to: '/', label: t('nav.home') },
    { to: '/desa', label: t('nav.profil_desa') },
    { to: '/map', label: t('nav.map') },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-neutral-200/50 bg-[#F4F4F3]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Brand */}
          <Link to="/" className="flex items-center gap-3 group min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 rounded-xl">
            <div className="w-9 h-9 rounded-xl bg-neutral-900 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-all">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-heading font-bold text-neutral-900 text-sm tracking-tight block">
                Mekarjaya
              </span>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-medium -mt-0.5">
                WebGIS Portal
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1 bg-neutral-200/60 rounded-2xl p-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  'min-h-11 px-4 inline-flex items-center rounded-xl text-xs font-semibold transition-all duration-200 motion-reduce:transition-none',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900',
                  location.pathname === link.to
                    ? 'bg-white text-neutral-900 shadow-xs border border-neutral-200/70'
                    : 'text-neutral-500 hover:text-neutral-900'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-11 h-11 flex items-center justify-center rounded-xl bg-neutral-200/60 text-neutral-600 hover:text-neutral-900 transition-colors motion-reduce:transition-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
              aria-label={t('nav.toggle_menu')}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden overflow-hidden border-t border-neutral-200/50 bg-[#F4F4F3]"
          >
            <div className="px-4 py-4 space-y-1">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center min-h-11 px-4 rounded-xl text-xs font-semibold transition-colors motion-reduce:transition-none',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900',
                    location.pathname === link.to
                      ? 'bg-white text-neutral-900 shadow-xs border border-neutral-200/70'
                      : 'text-neutral-500 hover:text-neutral-900'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
