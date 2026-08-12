import { useEffect } from 'react'
import Lenis from 'lenis'

/**
 * Instance Lenis yang sedang aktif. Disimpan di level modul karena pihak lain
 * (mis. reset scroll saat pindah halaman) perlu menjangkaunya: Lenis memegang
 * posisi scroll-nya sendiri, sehingga `window.scrollTo()` akan dilawan dan
 * halaman tetap berhenti di posisi lama.
 */
let lenisAktif: Lenis | null = null

/** Langsung ke puncak halaman, lewat Lenis bila ia sedang memegang kendali. */
export function scrollKeAtas() {
  if (lenisAktif) {
    lenisAktif.scrollTo(0, { immediate: true })
    return
  }
  // Jalur tanpa Lenis: pengguna meminta pengurangan gerak.
  window.scrollTo(0, 0)
}

/**
 * Gulir ke sebuah elemen, menyisakan `ruangAtas` px di atasnya (untuk bar sticky).
 *
 * Posisi dihitung sendiri lalu dikirim sebagai ANGKA dengan `immediate: true`.
 * Diuji satu per satu di browser: bentuk `scrollTo(elemen)` dan `scrollTo(angka)`
 * beranimasi (baik default maupun dengan `duration` eksplisit) sama-sekali tidak
 * menggerakkan halaman di versi Lenis ini — scroll diam di 0 selama 2,5 detik.
 * Hanya `immediate` yang bekerja andal, sama seperti `scrollKeAtas`.
 *
 * Konsekuensinya lompatan ke seksi bersifat instan, bukan meluncur. Itu pilihan
 * sadar: perpindahan yang pasti terjadi lebih berharga daripada animasi yang
 * kadang tidak jalan sama sekali.
 *
 * Jalur tanpa Lenis memakai `behavior: 'auto'`, bukan `'smooth'`: selama Lenis
 * terpasang, scroll smooth bawaan peramban ikut ditelan.
 */
export function scrollKeElemen(el: Element, ruangAtas = 0) {
  const tujuan = el.getBoundingClientRect().top + window.scrollY - ruangAtas

  if (lenisAktif) {
    lenisAktif.scrollTo(tujuan, { immediate: true })
    return
  }
  window.scrollTo({ top: tujuan, behavior: 'auto' })
}

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
    lenisAktif = lenis

    let frame = 0
    const jalankan = (waktu: number) => {
      lenis.raf(waktu)
      frame = requestAnimationFrame(jalankan)
    }
    frame = requestAnimationFrame(jalankan)

    return () => {
      cancelAnimationFrame(frame)
      lenis.destroy()
      lenisAktif = null
    }
  }, [])
}
