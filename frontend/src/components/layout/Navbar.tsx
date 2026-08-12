import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Home, Landmark, Map } from 'lucide-react'
import { NavBar } from '../ui/tubelight-navbar'
import { BrandMark } from './BrandMark'

/**
 * Navigasi utama: pil melayang bergaya "lampu tabung" (lihat ui/tubelight-navbar).
 *
 * Brand dirender terpisah karena komponen pil tidak punya slot untuknya — kalau
 * navbar lama diganti begitu saja, lambang desa dan nama portal hilang sama sekali.
 *
 * Posisi pil: atas-tengah di desktop, bawah-tengah di mobile (bawaan komponennya).
 * RootLayout menyediakan padding atas & bawah agar konten tidak tertutup, karena
 * pil ini `fixed` dan tidak lagi memakan ruang di aliran dokumen seperti bar lama.
 */
export function Navbar() {
  const { t } = useTranslation()

  const items = [
    { name: t('nav.home'), url: '/', icon: Home },
    { name: t('nav.profil_desa'), url: '/desa', icon: Landmark },
    { name: t('nav.map'), url: '/map', icon: Map },
  ]

  return (
    <>
      <Link
        to="/"
        className="fixed top-4 left-4 sm:top-6 sm:left-6 z-50 inline-flex items-center min-h-11 px-3 rounded-2xl bg-surface-card/70 border border-border backdrop-blur-lg shadow-sm transition-transform hover:scale-[1.02] motion-reduce:transition-none motion-reduce:hover:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
      >
        <BrandMark title="Mekarjaya" subtitle="WebGIS Portal" size={28} />
      </Link>

      <NavBar items={items} />
    </>
  )
}
