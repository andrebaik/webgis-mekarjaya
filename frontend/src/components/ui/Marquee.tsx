import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

interface MarqueeProps {
  items: ReactNode[]
  /** Detik untuk satu putaran penuh. Makin besar makin lambat. */
  durasi?: number
  className?: string
}

/**
 * Ticker tak berujung. Isinya digandakan dua kali dan track digeser -50%,
 * sehingga sambungan antar putaran tidak terlihat. Animasinya CSS murni
 * (lihat .marquee-track di index.css) supaya berjalan di compositor.
 */
export function Marquee({ items, durasi = 40, className }: MarqueeProps) {
  if (items.length === 0) return null

  return (
    <div
      className={cn('relative overflow-hidden', className)}
      // Duplikat murni dekoratif — pembaca layar cukup mendengar sekali.
      aria-hidden="true"
    >
      <div className="marquee-track" style={{ ['--marquee-duration' as string]: `${durasi}s` }}>
        {[0, 1].map((salinan) => (
          <div key={salinan} className="flex shrink-0 items-center">
            {items.map((item, i) => (
              <div key={`${salinan}-${i}`} className="flex items-center">
                <span className="px-6 whitespace-nowrap">{item}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-primary/40 shrink-0" />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Tepi memudar supaya teks tidak terpotong mendadak di sisi layar */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-surface to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-surface to-transparent" />
    </div>
  )
}
