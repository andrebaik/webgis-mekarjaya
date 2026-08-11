import { useRef, type ReactNode } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'

interface HeroParallaxProps {
  /** Lapisan latar (foto + scrim) — bergerak lebih lambat dari halaman. */
  background: ReactNode
  /** Lapisan teks — bergerak sedikit lebih cepat dan memudar saat ditinggalkan. */
  children: ReactNode
  className?: string
}

/**
 * Parallax hero: latar bergeser lebih lambat daripada teks saat halaman di-scroll,
 * sehingga hero terasa punya kedalaman tanpa menambah elemen visual baru.
 *
 * Hanya `transform` dan `opacity` yang dianimasikan (keduanya di-composite GPU),
 * jadi tidak memicu reflow. Saat `prefers-reduced-motion` aktif, seluruh efek
 * dimatikan dan hero dirender statis.
 */
export function HeroParallax({ background, children, className }: HeroParallaxProps) {
  const ref = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    // Dari saat hero menyentuh puncak viewport sampai ia keluar sepenuhnya.
    offset: ['start start', 'end start'],
  })

  // Latar turun 18% tinggi hero; teks naik sedikit — arah berlawanan inilah
  // yang menciptakan kesan kedalaman.
  //
  // Sengaja TANPA fade opacity: progress dihitung terhadap tinggi hero, sehingga
  // di layar pendek teks sudah pudar padahal masih terlihat penuh. Pergeseran
  // posisi saja sudah cukup, dan hasilnya konsisten di semua ukuran layar.
  const yLatar = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const yTeks = useTransform(scrollYProgress, [0, 1], ['0%', '-12%'])

  if (reduceMotion) {
    return (
      <section ref={ref} className={className}>
        {background}
        {children}
      </section>
    )
  }

  return (
    <section ref={ref} className={className}>
      {/* scale-110 memberi ruang gerak: tanpa itu, tepi bawah foto akan
          menyingkap latar kosong saat lapisan ini bergeser turun. */}
      <motion.div style={{ y: yLatar }} className="absolute inset-0 scale-110 will-change-transform">
        {background}
      </motion.div>

      <motion.div style={{ y: yTeks }} className="relative z-10 will-change-transform">
        {children}
      </motion.div>
    </section>
  )
}
