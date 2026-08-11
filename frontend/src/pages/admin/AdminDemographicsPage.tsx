import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Users, Plus, X } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Badge } from '../../components/ui/badge'
import { AdminPageHeader } from '../../components/admin/AdminPageHeader'
import { DataTable, type Column } from '../../components/admin/DataTable'
import { adminCreate, adminDelete, adminUpdate } from '../../services/adminApi'
import { useDemographics } from '../../hooks/useDemographics'
import { useQueryClient } from '@tanstack/react-query'
import type { DemographicRow } from '../../types'

interface DemoForm {
  year: number
  category: string
  label_key: string
  label_id: string
  value: number
  sort_order: number
}

const emptyForm: DemoForm = {
  year: new Date().getFullYear(),
  category: 'pekerjaan',
  label_key: '',
  label_id: '',
  value: 0,
  sort_order: 0,
}

const categories = ['total', 'jiwa', 'pekerjaan']

const categoryTone: Record<string, 'default' | 'secondary' | 'accent' | 'outline'> = {
  total: 'default',
  jiwa: 'secondary',
  pekerjaan: 'outline',
}

export function AdminDemographicsPage() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [yearFilter, setYearFilter] = useState<number | undefined>(undefined)
  const [editing, setEditing] = useState<DemographicRow | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<DemoForm>(emptyForm)

  const { data: rows, isError } = useDemographics(yearFilter)
  const { data: allRows } = useDemographics()

  const years = useMemo(() => {
    const set = new Set<number>()
    for (const r of allRows ?? []) set.add(r.year)
    return Array.from(set).sort((a, b) => b - a)
  }, [allRows])

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['demographics'] })

  const resetForm = () => {
    setForm(emptyForm)
    setEditing(null)
    setShowForm(false)
  }

  const startEdit = (row: DemographicRow) => {
    setEditing(row)
    setForm({
      year: row.year,
      category: row.category,
      label_key: row.label_key,
      label_id: row.label_id ?? '',
      value: row.value,
      sort_order: row.sort_order,
    })
    setShowForm(true)
  }

  const handleSave = async () => {
    if (editing) {
      await adminUpdate(`/api/admin/demographics/${editing.id}`, form)
    } else {
      await adminCreate('/api/admin/demographics', form)
    }
    await invalidate()
    resetForm()
  }

  const handleDelete = async (row: DemographicRow) => {
    if (!window.confirm(t('admin.confirm_delete'))) return
    await adminDelete(`/api/admin/demographics/${row.id}`)
    await invalidate()
  }

  const columns: Column<DemographicRow>[] = [
    { key: 'year', label: t('admin.year'), render: (r) => <span className="font-medium text-foreground">{r.year}</span> },
    { key: 'category', label: t('admin.category'), render: (r) => <Badge variant={categoryTone[r.category] ?? 'outline'}>{r.category}</Badge> },
    { key: 'label_key', label: 'Label Key', render: (r) => <code className="text-xs text-muted-foreground">{r.label_key}</code> },
    { key: 'label_id', label: t('admin.name_id') },
    { key: 'value', label: t('admin.amount'), render: (r) => <span className="font-medium tabular-nums">{r.value.toLocaleString('id-ID')}</span> },
  ]

  return (
    <div>
      <AdminPageHeader
        icon={Users}
        title={t('admin.demographics')}
        description={t('admin.demographics_subtitle')}
        actions={
          <>
            <select
              value={yearFilter ?? ''}
              onChange={(e) => setYearFilter(e.target.value ? Number(e.target.value) : undefined)}
              className="h-10 rounded-xl border border-border bg-surface-card px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
              aria-label={t('admin.year')}
            >
              <option value="">{t('admin.all_years')}</option>
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4" /> {t('admin.add')}
            </Button>
          </>
        }
      />

      {showForm && (
        <div className="bg-surface-card rounded-2xl border border-border/60 mb-6 overflow-hidden">
          <div className="px-6 py-4 border-b border-border/40 flex items-center justify-between">
            <h3 className="font-heading font-semibold text-lg text-foreground">
              {editing ? t('admin.edit') : t('admin.add')} — {t('admin.demographics')}
            </h3>
            <Button variant="ghost" size="sm" onClick={resetForm} aria-label={t('admin.cancel')} className="!p-2">
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">{t('admin.year')}</label>
                <Input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">{t('admin.category')}</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Label Key</label>
                <Input value={form.label_key} onChange={(e) => setForm({ ...form, label_key: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">{t('admin.amount')}</label>
                <Input type="number" value={form.value} onChange={(e) => setForm({ ...form, value: Number(e.target.value) })} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">{t('admin.name_id')}</label>
              <Input value={form.label_id} onChange={(e) => setForm({ ...form, label_id: e.target.value })} />
            </div>
          </div>
          <div className="px-6 py-4 border-t border-border/40 flex gap-2 bg-muted/20">
            <Button onClick={handleSave}>{t('admin.save')}</Button>
            <Button variant="outline" onClick={resetForm}>{t('admin.cancel')}</Button>
          </div>
        </div>
      )}

      {isError ? (
        <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-2xl p-4 text-sm text-red-700 dark:text-red-400">
          {t('common.error_title')}
        </div>
      ) : (
        <DataTable columns={columns} rows={rows ?? []} onEdit={startEdit} onDelete={handleDelete} emptyLabel={t('featured.empty')} />
      )}
    </div>
  )
}
