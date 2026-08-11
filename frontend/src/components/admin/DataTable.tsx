import { useTranslation } from 'react-i18next'
import { Inbox, Pencil, Trash2, Loader2 } from 'lucide-react'

export interface Column<T> {
  key: string
  label: string
  render?: (row: T) => React.ReactNode
}

interface DataTableProps<T> {
  columns: Column<T>[]
  rows: T[]
  onEdit?: (row: T) => void
  onDelete?: (row: T) => void
  deletePending?: boolean
  emptyLabel?: string
}

export function DataTable<T extends { id: number }>({
  columns,
  rows,
  onEdit,
  onDelete,
  deletePending,
  emptyLabel,
}: DataTableProps<T>) {
  const { t } = useTranslation()

  if (rows.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-neutral-200/80 px-6 py-14 flex flex-col items-center text-center shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-neutral-100 flex items-center justify-center mb-3">
          <Inbox className="w-6 h-6 text-neutral-400" />
        </div>
        <p className="text-xs font-medium text-neutral-400">{emptyLabel || 'Belum ada data'}</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-neutral-200/80 overflow-hidden shadow-xs">
      <div className="px-5 py-3.5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
        <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
          {t('admin.total_items', { count: rows.length })}
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-neutral-100/40 text-left text-[11px] uppercase tracking-wider text-neutral-400 border-b border-neutral-100">
              {columns.map((col) => (
                <th key={col.key} className="px-5 py-3 font-semibold whitespace-nowrap">
                  {col.label}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="px-5 py-3 font-semibold text-right">{t('admin.edit')}</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-neutral-50/80 transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className="px-5 py-3.5 text-neutral-600 font-medium whitespace-nowrap">
                    {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? '')}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(row)}
                          className="p-1.5 rounded-lg border border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
                          aria-label={t('admin.edit')}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(row)}
                          disabled={deletePending}
                          className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors disabled:opacity-50 cursor-pointer"
                          aria-label={t('admin.delete')}
                        >
                          {deletePending ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
