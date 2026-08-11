import type React from 'react'
import { useRef, useState, useCallback, useEffect, type ReactNode } from 'react'
import { useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface MagneticTextProps {
  text: string
  hoverText?: string
  className?: string
  /**
   * Lapisan dasar kustom. Bila diisi, `text` tidak dirender langsung dan hanya
   * dipakai sebagai label aksesibilitas — berguna saat teks dasarnya sudah punya
   * animasi sendiri (mis. huruf yang muncul bertahap) yang tidak boleh hilang.
   */
  children?: ReactNode
  /**
   * Kelas tipografi untuk kedua lapisan, supaya keduanya pasti selaras.
   *
   * Digabung dengan template string, BUKAN `cn()`: twMerge menganggap kelas
   * kustom seperti `text-display` bertabrakan dengan `text-surface` (keduanya
   * berawalan `text-`) lalu membuang yang pertama — teks penyingkap jadi
   * mengecil ke ukuran bawaan 16px.
   */
  textClassName?: string
  /**
   * Diameter lingkaran penyingkap, dalam px. Bila tidak diisi, dihitung dari
   * tinggi kontainer (2,2x) supaya ikut menyusut bersama teks yang memakai
   * `clamp()` — angka tetap akan kebesaran di layar sempit.
   */
  circleSize?: number
}

/**
 * Teks yang menyingkap kata lain lewat "lubang" bundar mengikuti kursor.
 *
 * Penyesuaian dari sumber aslinya:
 * - `"use client"` dibuang (direktif Next.js, tak berarti di Vite).
 * - `text-background` -> `text-surface`: token `--color-background` tidak ada di
 *   `@theme` proyek ini, sehingga kelas aslinya tidak menghasilkan warna apa pun.
 * - `useRef<number>()` -> diberi nilai awal (wajib sejak tipe React 19).
 * - `tracking-tighter` + `tracking-wide` yang saling bertabrakan dirapikan.
 * - Loop rAF hanya hidup saat hover; aslinya berputar 60fps selamanya.
 * - Menghormati `prefers-reduced-motion`.
 */
export function MagneticText({
  text,
  hoverText = text,
  className,
  children,
  textClassName = 'font-heading text-5xl font-bold tracking-tight',
  circleSize,
}: MagneticTextProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const circleRef = useRef<HTMLDivElement>(null)
  const innerTextRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
  const reduceMotion = useReducedMotion()

  const mousePos = useRef({ x: 0, y: 0 })
  const currentPos = useRef({ x: 0, y: 0 })
  // React 19 mewajibkan nilai awal pada useRef.
  const animationFrameRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    // ResizeObserver, bukan window resize: ukuran kontainer bisa berubah karena
    // pembungkusnya, tanpa jendela ikut berubah ukuran.
    const ro = new ResizeObserver(() => {
      setContainerSize({ width: el.offsetWidth, height: el.offsetHeight })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (!isHovered || reduceMotion) return

    const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor

    const animate = () => {
      currentPos.current.x = lerp(currentPos.current.x, mousePos.current.x, 0.15)
      currentPos.current.y = lerp(currentPos.current.y, mousePos.current.y, 0.15)

      if (circleRef.current) {
        circleRef.current.style.transform = `translate(${currentPos.current.x}px, ${currentPos.current.y}px) translate(-50%, -50%)`
      }
      if (innerTextRef.current) {
        innerTextRef.current.style.transform = `translate(${-currentPos.current.x}px, ${-currentPos.current.y}px)`
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
    }
  }, [isHovered, reduceMotion])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    mousePos.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }, [])

  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    mousePos.current = { x, y }
    currentPos.current = { x, y }
    setIsHovered(true)
  }, [])

  const handleMouseLeave = useCallback(() => setIsHovered(false), [])

  const diameter = circleSize ?? Math.max(120, Math.round(containerSize.height * 2.2))

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'relative inline-flex items-center justify-center select-none',
        !reduceMotion && 'cursor-none',
        className
      )}
    >
      {children ?? <span className={`${textClassName} text-foreground`}>{text}</span>}

      <div
        ref={circleRef}
        aria-hidden="true"
        className="absolute top-0 left-0 pointer-events-none rounded-full bg-foreground overflow-hidden"
        style={{
          width: isHovered ? diameter : 0,
          height: isHovered ? diameter : 0,
          transition: reduceMotion
            ? 'none'
            : 'width 0.5s cubic-bezier(0.33, 1, 0.68, 1), height 0.5s cubic-bezier(0.33, 1, 0.68, 1)',
          willChange: 'transform, width, height',
        }}
      >
        <div
          ref={innerTextRef}
          className="absolute flex items-center justify-center"
          style={{
            width: containerSize.width,
            height: containerSize.height,
            top: '50%',
            left: '50%',
            willChange: 'transform',
          }}
        >
          <span className={`${textClassName} text-surface whitespace-nowrap`}>{hoverText}</span>
        </div>
      </div>
    </div>
  )
}
