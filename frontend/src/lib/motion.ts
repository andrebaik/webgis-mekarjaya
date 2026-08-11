import type { Variants } from 'framer-motion'

/** Kurva easing tunggal untuk seluruh aplikasi, supaya ritme geraknya seragam. */
export const easeKeluar = [0.22, 1, 0.36, 1] as const

/** Seksi masuk: naik pelan sambil memudar masuk. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeKeluar } },
}

/** Pembungkus yang memunculkan anak-anaknya berurutan. */
export const wadahStagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
}

/** Dipasang pada tiap anak di dalam `<AnimatedSection stagger>`. */
export const itemStagger: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: easeKeluar } },
}
