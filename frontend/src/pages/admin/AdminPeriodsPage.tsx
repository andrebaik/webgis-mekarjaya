import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Timer, Plus, X, ListChecks } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Badge } from '../../components/ui/badge'
import { AdminPageHeader } from '../../components/admin/AdminPageHeader'
import { DataTable, type Column } from '../../components/admin/DataTable'
import { ContentField } from '../../components/admin/ContentField'
import { PeriodProgramList } from '../../components/admin/PeriodProgramList'
import { ImageUploadField } from '../../components/admin/ImageUploadField'
import { adminCreate, adminDelete, adminUpdate } from '../../services/adminApi'
import { usePeriods } from '../../hooks/usePeriods'
import { useQueryClient } from '@tanstack/react-query'
import type { VillagePeriod } from '../../types'

interface PeriodForm {
  name: string
  year_start: string
  year_end: string
  photo_url: string
  description_id: string
}

const emptyForm: PeriodForm = {
  name: '',
  year_start: '',
  year_end: '',
  photo_url: '',
  description_id: '',
}

export function AdminPeriodsPage() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { data: periods, isError } = usePeriods()
  const [editing, setEditing] = useState<VillagePeriod | null>(null)
  const [selectedPeriodId, setSelectedPeriodId] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<PeriodForm>(emptyForm)

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['periods'] })

  const resetForm = () => {
    setForm(emptyForm)
    setEditing(null)
    setShowForm(false)
  }

  const startEdit = (row: VillagePeriod) => {
    setEditing(row)
    setSelectedPeriodId(row.id)
    setForm({
      name: row.name,
      year_start: String(row.year_start),
      year_end: String(row.year_end),
      photo_url: row.photo_url || '',
      description_id: row.description_id ?? '',
    })
    setShowForm(true)
  }

  const handleSave = async () => {
    const body = {
      name: form.name,
      year_start: Number(form.year_start),
      year_end: Number(form.year_end),
      photo_url: form.photo_url || null,
      description_id: form.description_id || null,
    }
    if (editing) {
      await adminUpdate(`/api/admin/periods/${editing.id}`, body)
    } else {
      await adminCreate('/api/admin/periods', body)
    }
    await invalidate()
    resetForm()
  }

  const handleDelete = async (row: VillagePeriod) => {
    if (!window.confirm(t('admin.confirm_delete'))) return
    await adminDelete(`/api/admin/periods/${row.id}`)
    if (selectedPeriodId === row.id) setSelectedPeriodId(null)
    await invalidate()
  }

  const columns: Column<VillagePeriod>[] = [
    { key: 'name', label: t('admin.name_id'), render: (r) => <span className="font-medium text-foreground">{r.name}</span> },
    { key: 'year_start', label: 'Tahun Awal', render: (r) => <span className="tabular-nums">{r.year_start}</span> },
    { key: 'year_end', label: 'Tahun Akhir', render: (r) => <span className="tabular-nums">{r.year_end}</span> },
    {
      key: 'programs',
      label: t('village.period_program'),
      render: (r) => (
        <Badge variant="outline" className="gap-1.5">
          <ListChecks className="w-3.5 h-3.5" />
          {r.programs.length}
        </Badge>
      ),
    },
  ]

  const selectedPeriod = periods?.find((p) => p.id === selectedPeriodId)

  return (
    <div>
      <AdminPageHeader
        icon={Timer}
        title={t('admin.periods')}
        description={t('admin.periods_subtitle')}
        actions={
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4" /> {t('admin.add')}
          </Button>
        }
      />

      {showForm && (
        <div className="bg-surface-card rounded-2xl border border-border/60 mb-6 overflow-hidden">
          <div className="px-6 py-4 border-b border-border/40 flex items-center justify-between">
            <h3 className="font-heading font-semibold text-lg text-foreground">
              {editing ? t('admin.edit') : t('admin.add')} — {t('admin.periods')}
            </h3>
            <Button variant="ghost" size="sm" onClick={resetForm} aria-label={t('admin.cancel')} className="!p-2">
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">{t('admin.name_id')}</label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">{t('admin.year')} Awal</label>
                <Input type="number" value={form.year_start} onChange={(e) => setForm({ ...form, year_start: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">{t('admin.year')} Akhir</label>
                <Input type="number" value={form.year_end} onChange={(e) => setForm({ ...form, year_end: e.target.value })} required />
              </div>
            </div>
            <ImageUploadField
              value={form.photo_url || null}
              onChange={(url) => setForm({ ...form, photo_url: url ?? '' })}
              label="Photo URL"
            />
            <ContentField prefix="description" values={form} onChange={(f, v) => setForm({ ...form, [f]: v })} textarea />
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
        <div className="space-y-6">
          <DataTable columns={columns} rows={periods ?? []} onEdit={startEdit} onDelete={handleDelete} emptyLabel={t('featured.empty')} />
          {selectedPeriod && (
            <div className="bg-surface-card rounded-2xl border border-border/60 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                  <Timer className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-lg text-foreground">{selectedPeriod.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {selectedPeriod.year_start} — {selectedPeriod.year_end}
                  </p>
                </div>
              </div>
              <PeriodProgramList period={selectedPeriod} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
