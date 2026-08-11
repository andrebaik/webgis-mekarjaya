import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { CheckCircle2, Clock } from 'lucide-react'
import type { VillagePeriod } from '../../types'

interface ProgramFeedProps {
  periods: VillagePeriod[]
}

export function ProgramFeed({ periods }: ProgramFeedProps) {
  const { t } = useTranslation()
  // Collect all programs from periods
  const allPrograms = periods.flatMap((p) =>
    (p.programs ?? []).map((prog) => ({ ...prog, periodName: p.name }))
  )

  const latestPrograms = allPrograms.slice(-5).reverse()

  return (
    <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-xs h-full flex flex-col justify-between">
      <div className="flex items-center justify-between gap-3 mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
          {t('admin.program_feed')}
        </span>
        <Link
          to="/admin/periods"
          className="text-xs font-semibold text-neutral-900 hover:underline shrink-0"
        >
          {t('admin.view_all')}
        </Link>
      </div>

      {latestPrograms.length === 0 ? (
        <div className="py-6 flex items-center justify-center text-xs text-neutral-400">
          {t('admin.no_data')}
        </div>
      ) : (
        <ul className="space-y-2 flex-1">
          {latestPrograms.map((prog) => {
            const title = prog.title_id
            return (
              <li key={prog.id} className="flex items-start gap-2.5 px-2 py-1.5">
                {prog.status === 'selesai' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                ) : (
                  <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                )}
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-neutral-900 truncate">{title}</div>
                  <div className="text-[11px] text-neutral-400 truncate">
                    {prog.periodName} {prog.year ? `(${prog.year})` : ''}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
