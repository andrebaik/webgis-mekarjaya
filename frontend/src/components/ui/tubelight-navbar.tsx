import { Link, useLocation } from 'react-router'
import { motion, useReducedMotion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
}

interface NavBarProps {
  items: NavItem[]
  className?: string
}

/**
 * Navigasi pil dengan sorotan "lampu tabung" yang meluncur antar item.
 *
 * Penyesuaian dari sumber aslinya:
 * - `"use client"` dibuang — direktif Next.js, tak berarti di Vite.
 * - `next/link` diganti `react-router` (`href` -> `to`); project ini tidak memakai Next.
 * - State `isMobile` dihapus: nilainya tak pernah dibaca sama sekali (responsif
 *   sudah ditangani kelas `hidden md:inline`), dan `noUnusedLocals` menolaknya.
 * - `bg-background/5` -> `bg-surface-card/70`: token `--color-background` tidak ada
 *   di `@theme` project ini, sehingga kelas aslinya tidak menghasilkan warna apa pun.
 * - Item aktif ditentukan dari rute berjalan, bukan state lokal. Versi aslinya
 *   menyimpan `activeTab` sendiri sehingga sorotan salah menunjuk begitu pengguna
 *   menekan tombol back atau membuka URL langsung.
 * - `sm:bottom-auto` + `pointer-events-none`: aslinya wadah memakai `bottom-0`
 *   DAN `sm:top-0` sekaligus, sehingga di layar lebar kotaknya melar setinggi
 *   viewport (terukur 337x776px) dan memblokir klik di tengah halaman.
 */
export function NavBar({ items, className }: NavBarProps) {
  const { pathname } = useLocation()
  const reduceMotion = useReducedMotion()

  if (items.length === 0) return null

  // Cocokkan rute terpanjang lebih dulu supaya '/desa' tidak kalah oleh '/'.
  const aktif =
    [...items]
      .sort((a, b) => b.url.length - a.url.length)
      .find((item) => pathname === item.url || pathname.startsWith(item.url + '/'))?.name ??
    items[0].name

  return (
    <div
      className={cn(
        'fixed bottom-0 sm:top-0 sm:bottom-auto left-1/2 -translate-x-1/2 z-50 mb-6 sm:pt-6',
        // Wadah hanya pembungkus posisi; klik harus tembus ke konten di bawahnya.
        'pointer-events-none',
        className
      )}
    >
      <nav className="pointer-events-auto flex items-center gap-3 bg-surface-card/70 border border-border backdrop-blur-lg py-1 px-1 rounded-full shadow-lg">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = aktif === item.name

          return (
            <Link
              key={item.name}
              to={item.url}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'relative cursor-pointer text-sm font-semibold px-6 py-2 rounded-full',
                'transition-colors motion-reduce:transition-none',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground',
                'text-foreground/70 hover:text-foreground',
                isActive && 'bg-muted text-foreground'
              )}
            >
              <span className="hidden md:inline">{item.name}</span>
              {/* Di mobile hanya ikon yang tampil, jadi namanya tetap dibawa untuk
                  pembaca layar — ikon tanpa label tidak terbaca sama sekali. */}
              <span className="md:hidden" aria-hidden="true">
                <Icon size={18} strokeWidth={2.5} />
              </span>
              <span className="md:hidden sr-only">{item.name}</span>

              {isActive && (
                <motion.div
                  layoutId="lamp"
                  className="absolute inset-0 w-full bg-foreground/5 rounded-full -z-10"
                  initial={false}
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { type: 'spring', stiffness: 300, damping: 30 }
                  }
                >
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-foreground rounded-t-full">
                    <div className="absolute w-12 h-6 bg-foreground/20 rounded-full blur-md -top-2 -left-2" />
                    <div className="absolute w-8 h-6 bg-foreground/20 rounded-full blur-md -top-1" />
                    <div className="absolute w-4 h-4 bg-foreground/20 rounded-full blur-sm top-0 left-2" />
                  </div>
                </motion.div>
              )}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
