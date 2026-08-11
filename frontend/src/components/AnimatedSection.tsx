import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'
import { fadeUp, wadahStagger } from '../lib/motion'

interface AnimatedSectionProps {
  children: ReactNode
  className?: string
  delay?: number
  /**
   * Jadikan pembungkus ini orkestrator: anak langsung yang memakai
   * `variants={itemStagger}` akan muncul berurutan, bukan serentak.
   */
  stagger?: boolean
}

export function AnimatedSection({ children, className, delay = 0, stagger }: AnimatedSectionProps) {
  const reduceMotion = useReducedMotion()

  // Pengguna yang meminta pengurangan gerak tetap harus melihat kontennya.
  // Tetap memakai motion.div dengan `animate="visible"` (bukan <div> biasa) supaya
  // anak yang memakai `variants={itemStagger}` tetap punya konteks varian dan
  // langsung berada pada state terlihat — bukan menggantung tanpa orkestrator.
  if (reduceMotion) {
    return (
      <motion.div initial={false} animate="visible" className={className}>
        {children}
      </motion.div>
    )
  }

  return (
    <motion.div
      variants={stagger ? wadahStagger : fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
