import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PiggyBank, Plus, X, Wallet, ShoppingBag } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Badge } from '../../components/ui/badge'
import { AdminPageHeader } from '../../components/admin/AdminPageHeader'
import { DataTable, type Column } from '../../components/admin/DataTable'
import { adminCreate, adminDelete, adminUpdate } from '../../services/adminApi'
import { useApbd } from '../../hooks/useApbd'
import { useQueryClient } from '@tanstack/react-query'
import { formatRp } from '../../lib/utils'
import { APBD_TYPES, APBD_CATEGORY_SUGGESTIONS } from '../../lib/apbd'
import type { ApbdItem, ApbdType } from '../../types'

interface ApbdForm {
  year: number
  type: ApbdType
  category: string
  amount: number
  sort_order: number
}

const emptyForm: ApbdForm = {
  year: new Date().getFullYear(),
  type: 'pelaksanaan',
  category: '',
  amount: 0,
  sort_order: 0,
}

export function AdminApbdPage() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [yearFilter, setYearFilter] = useState<number | undefined>(undefined)
  const [editing, setEditing] = useState<ApbdItem | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<ApbdForm>(emptyForm)

  const { data: items, isError } = useApbd(yearFilter)
  const { data: allItems } = useApbd()

  const years = useMemo(() => {
    const set = new Set<number>()
    for (const item of allItems ?? []) set.add(item.year)
    return Array.from(set).sort((a, b) => b - a)
  }, [allItems])

  const totals = useMemo(() => {
    let pendapatan = 0
    let belanja = 0
    // Cocokkan tipe secara eksplisit — dengan adanya 'pelaksanaan', pola `else`
    // akan salah menghitung baris pelaksanaan sebagai belanja.
    for (const item of items ?? []) {
      if (item.type === 'pendapatan') pendapatan += item.amount
      else if (item.type === 'belanja') belanja += item.amount
    }
    return { pendapatan, belanja }
  }, [items])

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['apbd'] })

  const resetForm = () => {
    setForm(emptyForm)
    setEditing(null)
    setShowForm(false)
  }

  const startEdit = (row: ApbdItem) => {
    setEditing(row)
    setForm({
      year: row.year,
      type: row.type,
      category: row.category,
      amount: row.amount,
      sort_order: row.sort_order,
    })
    setShowForm(true)
  }

  const handleSave = async () => {
    if (editing) {
      await adminUpdate(`/api/admin/apbd/${editing.id}`, form)
    } else {
      await adminCreate('/api/admin/apbd', form)
    }
    await invalidate()
    resetForm()
  }

  const handleDelete = async (row: ApbdItem) => {
    if (!window.confirm(t('admin.confirm_delete'))) return
    await adminDelete(`/api/admin/apbd/${row.id}`)
    await invalidate()
  }

  const columns: Column<ApbdItem>[] = [
    { key: 'year', label: t('admin.year'), render: (r) => <span className="font-medium text-foreground">{r.year}</span> },
    {
      key: 'type',
      label: t('admin.type'),
      render: (r) => (
        <Badge variant={r.type === 'pelaksanaan' ? 'outline' : r.type === 'pendapatan' ? 'default' : 'secondary'}>
          {t(`village.apbd_type_${r.type}`)}
        </Badge>
      ),
    },
    { key: 'category', label: t('village.apbd_pos'), render: (r) => <span className="font-medium text-foreground">{r.category}</span> },
    { key: 'amount', label: t('admin.amount'), render: (r) => <span className="font-medium tabular-nums text-right">{formatRp(r.amount)}</span> },
  ]

  return (
    <div>
      <AdminPageHeader
        icon={PiggyBank}
        title={t('admin.apbd')}
        description={t('admin.apbd_subtitle')}
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-surface-card rounded-2xl border border-border/60 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Wallet className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-xs text-muted-foreground uppercase tracking-wide">{t('village.apbd_pendapatan')}</div>
            <div className="font-heading text-lg font-bold text-foreground truncate">{formatRp(totals.pendapatan)}</div>
          </div>
        </div>
        <div className="bg-surface-card rounded-2xl border border-border/60 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-xs text-muted-foreground uppercase tracking-wide">{t('village.apbd_belanja')}</div>
            <div className="font-heading text-lg font-bold text-foreground truncate">{formatRp(totals.belanja)}</div>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="bg-surface-card rounded-2xl border border-border/60 mb-6 overflow-hidden">
          <div className="px-6 py-4 border-b border-border/40 flex items-center justify-between">
            <h3 className="font-heading font-semibold text-lg text-foreground">
              {editing ? t('admin.edit') : t('admin.add')} — {t('admin.apbd')}
            </h3>
            <Button variant="ghost" size="sm" onClick={resetForm} aria-label={t('admin.cancel')} className="!p-2">
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">{t('admin.year')}</label>
                <Input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">{t('admin.type')}</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value as ApbdType, category: '' })}
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
                >
                  {APBD_TYPES.map((tp) => (
                    <option key={tp} value={tp}>{t(`village.apbd_type_${tp}`)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">{t('village.apbd_pos')}</label>
                {/* datalist, bukan select: pos di luar daftar tetap bisa diketik,
                    sehingga baris lama yang posnya tidak baku masih bisa diedit. */}
                <Input
                  list="apbd-pos"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  required
                />
                <datalist id="apbd-pos">
                  {APBD_CATEGORY_SUGGESTIONS[form.type].map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">{t('admin.amount')}</label>
                <Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} />
              </div>
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
        <DataTable columns={columns} rows={items ?? []} onEdit={startEdit} onDelete={handleDelete} emptyLabel={t('featured.empty')} />
      )}
    </div>
  )
}
