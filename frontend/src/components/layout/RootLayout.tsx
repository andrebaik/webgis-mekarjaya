import { Outlet, useLocation } from 'react-router'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { motion } from 'framer-motion'
import { useSmoothScroll } from '../../hooks/useSmoothScroll'

export function RootLayout() {
  const location = useLocation()
  // Sengaja di RootLayout, bukan App: halaman peta ada di luar layout ini sehingga
  // Leaflet tetap memakai scroll native untuk zoom.
  useSmoothScroll()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <motion.main
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1"
      >
        <Outlet />
      </motion.main>
      <Footer />
    </div>
  )
}
