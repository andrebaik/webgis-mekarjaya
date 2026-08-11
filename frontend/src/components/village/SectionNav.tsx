import { useEffect, useState } from 'react'
import { cn } from '../../lib/utils'

export interface SectionNavItem {
  id: string
  label: string
}

interface SectionNavProps {
  items: SectionNavItem[]
}

export function SectionNav({ items }: SectionNavProps) {
  const [active, setActive] = useState(items[0]?.id ?? '')

  useEffect(() => {
    if (items.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        // Ambil seksi terlihat yang paling atas, supaya sorotan tidak melompat-lompat
        // ketika dua seksi terlihat sekaligus.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      // Pita sempit di sekitar sepertiga atas viewport = "seksi yang sedang dibaca".
      { rootMargin: '-96px 0px -60% 0px', threshold: 0 }
    )

    for (const item of items) {
      const el = document.getElementById(item.id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [items])

  if (items.length === 0) return null

  return (
    <nav className="sticky top-16 z-40 bg-surface/90 backdrop-blur-md border-b border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-2.5">
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault()
                document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
              aria-current={active === item.id ? 'true' : undefined}
              className={cn(
                'shrink-0 min-h-11 px-4 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer inline-flex items-center',
                'transition-colors motion-reduce:transition-none',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-inset',
                active === item.id
                  ? 'bg-foreground text-white shadow-xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  )
}
