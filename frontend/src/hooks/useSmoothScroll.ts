import { useEffect } from 'react'
import Lenis from 'lenis'

/**
 * Smooth scroll ala referensi. Dipasang di RootLayout saja — halaman peta berada
 * di luar layout itu, jadi Leaflet tetap memakai scroll native (lenis mengambil
 * alih wheel event dan akan mengacaukan zoom peta).
 *
 * Mati total bila pengguna meminta pengurangan gerak: smooth scroll adalah salah
 * satu pemicu utama motion sickness.
 */
export function useSmoothScroll() {
  useEffect(() => {
    const kurangiGerak = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (kurangiGerak.matches) return

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })

    let frame = 0
    const jalankan = (waktu: number) => {
      lenis.raf(waktu)
      frame = requestAnimationFrame(jalankan)
    }
    frame = requestAnimationFrame(jalankan)

    return () => {
      cancelAnimationFrame(frame)
      lenis.destroy()
    }
  }, [])
}
