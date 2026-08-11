import { useLayoutEffect, useRef, useState } from 'react'
import { formatNumber } from '../../lib/utils'

interface CountUpProps {
  value: number
  durasi?: number
  suffix?: string
  className?: string
}

/** Batas aman: kalau IntersectionObserver tak kunjung memicu, angka tetap muncul. */
const BATAS_FALLBACK = 2500

/**
 * Angka yang menghitung naik saat masuk viewport.
 *
 * Prinsip: angka yang benar lebih penting daripada animasinya. Setiap jalur yang
 * gagal (reduced-motion, IO tak tersedia, IO tak kunjung memicu karena tab tidak
 * dirender) langsung menampilkan nilai akhir — bukan diam di 0.
 */
export function CountUp({ value, durasi = 1400, suffix, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [tampil, setTampil] = useState(value)

  // useLayoutEffect supaya reset ke 0 terjadi sebelum paint — kalau pakai useEffect,
  // nilai akhir sempat berkedip lebih dulu.
  useLayoutEffect(() => {
    const el = ref.current

    const langsung = () => setTampil(value)

    if (!el || value === 0) return langsung()
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return langsung()
    if (typeof IntersectionObserver === 'undefined') return langsung()

    setTampil(0)

    let frame = 0
    let selesai = false

    const animasikan = () => {
      if (selesai) return
      selesai = true
      const mulai = performance.now()
      const langkah = (waktu: number) => {
        const p = Math.min(1, (waktu - mulai) / durasi)
        // ease-out cubic: cepat di awal, melambat di akhir
        setTampil(Math.round(value * (1 - Math.pow(1 - p, 3))))
        if (p < 1) frame = requestAnimationFrame(langkah)
      }
      frame = requestAnimationFrame(langkah)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return
        observer.disconnect()
        animasikan()
      },
      { threshold: 0.4 }
    )
    observer.observe(el)

    const jaring = window.setTimeout(() => {
      observer.disconnect()
      if (!selesai) {
        selesai = true
        setTampil(value)
      }
    }, BATAS_FALLBACK)

    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
      clearTimeout(jaring)
    }
  }, [value, durasi])

  return (
    <span ref={ref} className={className}>
      {formatNumber(tampil)}
      {suffix}
    </span>
  )
}
