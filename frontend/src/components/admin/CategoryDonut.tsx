import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import type { Category, Location } from '../../types'

const COLORS = ['#171717', '#10B981', '#06B6D4', '#F59E0B', '#8B5CF6', '#EC4899', '#64748B']

interface CategoryDonutProps {
  locations: Location[]
  categories: Category[]
}

export function CategoryDonut({ locations, categories }: CategoryDonutProps) {
  const { t } = useTranslation()

  const data = useMemo(() => {
    const byCat = new Map<number, number>()
    for (const loc of locations) byCat.set(loc.category_id, (byCat.get(loc.category_id) ?? 0) + 1)
    return categories
      .map((c) => ({ name: t(`category.${c.slug}`, c.name_id), value: byCat.get(c.id) ?? 0 }))
      .filter((d) => d.value > 0)
  }, [locations, categories, t])

  const total = data.reduce((sum, d) => sum + d.value, 0)

  return (
    <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 shadow-xs h-full flex flex-col justify-between">
      <div className="flex items-center justify-between gap-3 mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
          {t('admin.locations_by_category')}
        </span>
        <span className="text-xs font-bold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded-full">
          {total} Lokasi
        </span>
      </div>

      {data.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-sm text-neutral-400 py-8">
          {t('admin.no_data')}
        </div>
      ) : (
        <>
          <div className="flex-1 min-h-[160px] py-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  strokeWidth={0}
                >
                  {data.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value} lokasi`, name]}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E5E5E5',
                    borderRadius: 12,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 space-y-1.5 pt-3 border-t border-neutral-100">
            {data.slice(0, 4).map((d, i) => (
              <li key={d.name} className="flex items-center justify-between text-xs gap-3">
                <span className="flex items-center gap-2 text-neutral-500 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: COLORS[i % COLORS.length] }}
                  />
                  <span className="truncate">{d.name}</span>
                </span>
                <span className="font-semibold text-neutral-900 shrink-0">{d.value}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
