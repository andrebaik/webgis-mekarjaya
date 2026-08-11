import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

interface SectionHeadingProps {
  /** Label monospace kecil di atas judul. */
  eyebrow?: string
  title: ReactNode
  subtitle?: ReactNode
  action?: ReactNode
  className?: string
}

/**
 * Kepala seksi bergaya editorial: eyebrow monospace, judul display besar,
 * subjudul opsional. Dipakai ulang di semua seksi supaya ritme vertikalnya
 * konsisten di seluruh halaman.
 */
export function SectionHeading({ eyebrow, title, subtitle, action, className }: SectionHeadingProps) {
  return (
    <div className={cn('flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-10', className)}>
      <div className="max-w-3xl">
        {eyebrow && (
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-px bg-primary" />
            <span className="eyebrow">{eyebrow}</span>
          </div>
        )}
        <h2 className="text-display-sm text-foreground">{title}</h2>
        {subtitle && (
          <p className="text-sm sm:text-base text-muted-foreground mt-4 leading-relaxed max-w-xl">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
