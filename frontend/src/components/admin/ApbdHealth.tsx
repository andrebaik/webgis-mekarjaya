import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { ApbdItem } from '../../types'
import { formatRp } from '../../lib/utils'

interface ApbdHealthProps {
  items: ApbdItem[]
}

export function ApbdHealth({ items }: ApbdHealthProps) {
  const { t } = useTranslation()

  const { pendapatan, belanja } = useMemo(() => {
    let p = 0
    let b = 0
    for (const item of items) {
      if (item.type === 'pendapatan') p += item.amount
      else b += item.amount
    }
    return { pendapatan: p, belanja: b }
  }, [items])

  const surplus = pendapatan - belanja
  const belanjaPct = pendapatan > 0 ? Math.min(100, (belanja / pendapatan) * 100) : 0

  return (
    <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-xs h-full flex flex-col justify-between">
      <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">
        {t('admin.billing_health')}
      </span>
      <div className="space-y-4 flex-1 flex flex-col justify-center">
        <div>
          <div className="flex justify-between text-xs gap-3 mb-1.5 font-medium">
            <span className="text-neutral-500">{t('village.apbd_pendapatan')}</span>
            <span className="font-semibold text-neutral-900 truncate">{formatRp(pendapatan)}</span>
          </div>
          <div className="h-2 rounded-full bg-neutral-100 overflow-hidden">
            <div className="h-full bg-neutral-900 rounded-full" style={{ width: '100%' }} />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs gap-3 mb-1.5 font-medium">
            <span className="text-neutral-500">{t('village.apbd_belanja')}</span>
            <span className="font-semibold text-neutral-900 truncate">{formatRp(belanja)}</span>
          </div>
          <div className="h-2 rounded-full bg-neutral-100 overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${belanjaPct}%` }} />
          </div>
        </div>

        <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-3">
          <span className="text-xs text-neutral-400 font-medium">{t('admin.surplus')}</span>
          <span
            className={`font-heading text-base font-bold ${
              surplus >= 0 ? 'text-emerald-600' : 'text-rose-600'
            }`}
          >
            {formatRp(surplus)}
          </span>
        </div>
      </div>
    </div>
  )
}
