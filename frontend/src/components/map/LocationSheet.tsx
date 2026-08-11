import { useRef, useState } from 'react'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { MapPin, ChevronUp } from 'lucide-react'
import { cn } from '../../lib/utils'
import { categoryColor } from '../../lib/leafletIcons'
import type { Location, Category } from '../../types'

interface LocationSheetProps {
  locations: Location[]
  categoryMap: Map<number, Category>
}

const TINGGI_SHEET = '72vh'
const TINGGI_PEEK = 76 // px yang tetap terlihat saat tertutup (gagang + jumlah hasil)
const AMBANG_GESER = 40 // px minimal geseran sebelum dianggap buka/tutup

/**
 * Daftar lokasi versi mobile. Sebelumnya sidebar disembunyikan total di layar kecil
 * (`hidden md:block`) sehingga pengguna HP tidak punya cara melihat daftar sama sekali.
 *
 * Posisi digerakkan lewat transform CSS, bukan framer-motion: `dragConstraints`
 * mengunci nilai y sehingga sheet tidak pernah bergeser, dan `y` tidak menerima
 * string calc(). Transform CSS + transition jauh lebih dapat diprediksi di sini.
 */
export function LocationSheet({ locations, categoryMap }: LocationSheetProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const awalSentuh = useRef<number | null>(null)

  return (
    <div
      className={cn(
        'md:hidden absolute inset-x-0 bottom-0 z-[1001] flex flex-col rounded-t-3xl',
        'bg-[#F4F4F3] border-t border-neutral-200 shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.18)]',
        'transition-transform duration-300 ease-out motion-reduce:transition-none'
      )}
      style={{
        height: TINGGI_SHEET,
        transform: open ? 'translateY(0)' : `translateY(calc(${TINGGI_SHEET} - ${TINGGI_PEEK}px))`,
      }}
      onTouchStart={(e) => {
        awalSentuh.current = e.touches[0].clientY
      }}
      onTouchEnd={(e) => {
        if (awalSentuh.current === null) return
        const delta = e.changedTouches[0].clientY - awalSentuh.current
        if (delta < -AMBANG_GESER) setOpen(true)
        else if (delta > AMBANG_GESER) setOpen(false)
        awalSentuh.current = null
      }}
    >
      {/* Gagang sekaligus tombol, supaya tetap bisa dipakai tanpa gestur geser
          (keyboard, pembaca layar, atau pengguna yang tidak menemukan gestur). */}
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label={open ? t('map.list_close') : t('map.list_open')}
        className="shrink-0 pt-2.5 pb-3 px-4 cursor-pointer rounded-t-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-inset"
      >
        <span className="block w-10 h-1 rounded-full bg-neutral-300 mx-auto mb-2.5" />
        <span className="flex items-center justify-center gap-2">
          <span className="text-xs font-bold text-neutral-900">{t('map.list_title')}</span>
          <span className="text-[11px] font-semibold text-neutral-400">
            {t('map.result_count', { count: locations.length })}
          </span>
          <ChevronUp
            className={cn(
              'w-3.5 h-3.5 text-neutral-400 transition-transform duration-200 motion-reduce:transition-none',
              open && 'rotate-180'
            )}
          />
        </span>
      </button>

      <div className="flex-1 overflow-y-auto overscroll-contain px-3 pb-6 space-y-2">
        {locations.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="w-8 h-8 mx-auto text-neutral-400 mb-2" />
            <p className="text-xs text-neutral-400">{t('map.no_results')}</p>
          </div>
        ) : (
          locations.map((loc) => {
            const cat = categoryMap.get(loc.category_id)
            return (
              <Link
                key={loc.id}
                to={`/location/${loc.slug}`}
                className="flex items-start gap-3 min-h-11 p-3.5 rounded-2xl bg-white border border-neutral-200/80 shadow-xs active:bg-neutral-50 transition-colors motion-reduce:transition-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
              >
                <span
                  className="w-3 h-3 rounded-full mt-1 shrink-0"
                  style={{ backgroundColor: categoryColor(cat?.slug) }}
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-bold text-neutral-900 truncate">{loc.name_id}</span>
                  <span className="block text-[11px] text-neutral-400 font-medium mt-0.5 truncate">
                    {cat ? cat.name_id : ''}
                  </span>
                </span>
              </Link>
            )
          })
        )}
      </div>
    </div>
  )
}
