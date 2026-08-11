import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRp(n: number): string {
  return 'Rp ' + n.toLocaleString('id-ID')
}

export function formatNumber(n: number): string {
  return n.toLocaleString('id-ID')
}

const compactFormatter = new Intl.NumberFormat('id-ID', { notation: 'compact', maximumFractionDigits: 1 })

export function formatRpCompact(n: number): string {
  return 'Rp ' + compactFormatter.format(n)
}
