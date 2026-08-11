import type { LucideIcon } from 'lucide-react'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { cn } from '../../lib/utils'

interface DashboardStatCardProps {
  label: string
  value: string
  icon?: LucideIcon
  tone?: 'primary' | 'secondary' | 'accent'
  hint?: string
  trend?: string
  trendUp?: boolean
  bars?: number[]
}

const defaultBars = [25, 45, 30, 80, 60, 95, 40]

export function DashboardStatCard({
  label,
  value,
  icon: Icon,
  hint,
  trend = '+0,94 tahun lalu',
  trendUp = true,
  bars = defaultBars,
}: DashboardStatCardProps) {
  const maxBar = Math.max(...bars, 1)

  return (
    <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-xs flex flex-col justify-between hover:border-neutral-300 transition-all">
      {/* Top row: Label & Mini Bar Sparkline */}
      <div className="flex items-start justify-between gap-3">
        <div className="text-[11px] text-neutral-400 font-medium uppercase tracking-wider">
          {label}
        </div>

        {/* Mini Sparkline Bars */}
        <div className="flex items-end gap-1 h-7 pt-1 px-1">
          {bars.map((h, i) => {
            const isHighest = h === maxBar
            const barPct = Math.max(15, (h / maxBar) * 100)
            return (
              <div
                key={i}
                className={cn(
                  'w-1 rounded-xs transition-all',
                  isHighest ? 'bg-neutral-900' : 'bg-neutral-200'
                )}
                style={{ height: `${barPct}%` }}
              />
            )
          })}
        </div>
      </div>

      {/* Metric Value */}
      <div className="mt-2">
        <div className="font-heading text-2xl md:text-3xl font-bold text-neutral-900 tracking-tight">
          {value}
        </div>
        {hint && (
          <div className="text-xs text-neutral-500 font-medium mt-0.5">{hint}</div>
        )}
      </div>

      {/* Bottom Row: Trend Badge */}
      <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
        <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
          <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center">
            {trendUp ? (
              <ArrowUpRight className="w-2.5 h-2.5" />
            ) : (
              <ArrowDownRight className="w-2.5 h-2.5" />
            )}
          </div>
          <span>{trend}</span>
        </div>

        {Icon && (
          <div className="w-7 h-7 rounded-lg bg-neutral-100 text-neutral-500 flex items-center justify-center">
            <Icon className="w-3.5 h-3.5" />
          </div>
        )}
      </div>
    </div>
  )
}
