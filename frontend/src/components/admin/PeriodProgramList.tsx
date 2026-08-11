import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Pencil, Trash2, CheckCircle2, CircleDashed } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { ContentField } from './ContentField'
import { adminCreate, adminDelete, adminUpdate } from '../../services/adminApi'
import { useQueryClient } from '@tanstack/react-query'
import type { VillagePeriod, PeriodProgram } from '../../types'

interface PeriodProgramListProps {
  period: VillagePeriod
}

export function PeriodProgramList({ period }: PeriodProgramListProps) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<PeriodProgram | null>(null)
  const [form, setForm] = useState({
    title_id: '',
    description_id: '',
    year: '', status: 'selesai',
  })

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['periods'] })

  const resetForm = () => {
    setForm({ title_id: '', description_id: '', year: '', status: 'selesai' })
    setEditing(null)
    setShowForm(false)
  }

  const startEdit = (p: PeriodProgram) => {
    setEditing(p)
    setForm({
      title_id: p.title_id,
      description_id: p.description_id ?? '',
      year: p.year ? String(p.year) : '', status: p.status,
    })
    setShowForm(true)
  }

  const handleSave = async () => {
    const body = {
      title_id: form.title_id,
      description_id: form.description_id || null,
      year: form.year ? Number(form.year) : null, status: form.status,
    }
    if (editing) {
      await adminUpdate(`/api/admin/programs/${editing.id}`, body)
    } else {
      await adminCreate(`/api/admin/periods/${period.id}/programs`, body)
    }
    await invalidate()
    resetForm()
  }

  const handleDelete = async (p: PeriodProgram) => {
    if (!window.confirm(t('admin.confirm_delete'))) return
    await adminDelete(`/api/admin/programs/${p.id}`)
    await invalidate()
  }

  return (
    <div className="border-t border-border/40 pt-4 mt-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-heading font-semibold text-sm uppercase tracking-wider text-muted-foreground">
          {t('village.period_program')} ({period.programs.length})
        </h4>
        <Button size="sm" variant="outline" onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4" /> {t('admin.add')}
        </Button>
      </div>

      {showForm && (
        <div className="bg-muted/30 rounded-xl p-4 mb-4 space-y-3">
          <ContentField prefix="title" values={form} onChange={(f, v) => setForm({ ...form, [f]: v })} required />
          <ContentField prefix="description" values={form} onChange={(f, v) => setForm({ ...form, [f]: v })} textarea />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">{t('admin.year')}</label>
              <Input value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} placeholder="2024" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">{t('admin.status')}</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option value="selesai">{t('village.program_status_selesai')}</option>
                <option value="berjalan">{t('village.program_status_berjalan')}</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave}>{t('admin.save')}</Button>
            <Button size="sm" variant="outline" onClick={resetForm}>{t('admin.cancel')}</Button>
          </div>
        </div>
      )}

      {period.programs.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4 text-center bg-muted/20 rounded-xl">{t('admin.no_data')}</p>
      ) : (
        <ul className="space-y-2">
          {period.programs.map((p) => {
            const done = p.status === 'selesai'
            return (
              <li key={p.id} className="flex items-center justify-between gap-3 bg-surface-card border border-border/60 rounded-xl px-4 py-3">
                <div className="flex items-start gap-3 min-w-0">
                  {done ? (
                    <CheckCircle2 className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
                  ) : (
                    <CircleDashed className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  )}
                  <div className="min-w-0">
                    <div className="font-medium text-foreground truncate">{p.title_id}</div>
                    <div className="text-xs text-muted-foreground">
                      {p.year ? `${p.year} · ` : ''}
                      <span className={done ? 'text-secondary' : 'text-primary'}>
                        {t(`village.program_status_${p.status}`)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button size="sm" variant="outline" className="!p-2" onClick={() => startEdit(p)} aria-label={t('admin.edit')}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="!p-2 text-red-600" onClick={() => handleDelete(p)} aria-label={t('admin.delete')}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
