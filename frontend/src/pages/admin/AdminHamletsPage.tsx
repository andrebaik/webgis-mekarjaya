import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Home, Plus, X, Users } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { AdminPageHeader } from '../../components/admin/AdminPageHeader'
import { DataTable, type Column } from '../../components/admin/DataTable'
import { adminCreate, adminDelete, adminUpdate } from '../../services/adminApi'
import { useHamlets } from '../../hooks/useHamlets'
import { useQueryClient } from '@tanstack/react-query'
import { formatNumber } from '../../lib/utils'
import type { Hamlet } from '../../types'

interface HamletForm {
  year: number
  month: number
  name: string
  rw: number
  rt_count: number | ''
  kk_count: number | ''
  male: number
  female: number
  ktp_required: number | ''
  ktp_done: number | ''
  ktp_pending: number | ''
  sort_order: number
}

const now = new Date()

const emptyForm: HamletForm = {
  year: now.getFullYear(),
  month: now.getMonth() + 1,
  name: '',
  rw: 1,
  rt_count: '',
  kk_count: '',
  male: 0,
  female: 0,
  ktp_required: '',
  ktp_done: '',
  ktp_pending: '',
  sort_order: 0,
}

const BULAN = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
]

/** Kolom opsional dikirim sebagai null saat dikosongkan, bukan string kosong. */
const nullIfBlank = (v: number | '') => (v === '' ? null : Number(v))

export function AdminHamletsPage() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [editing, setEditing] = useState<Hamlet | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<HamletForm>(emptyForm)

  const { data: rows, isError } = useHamlets()

  const total = useMemo(() => {
    const list = rows ?? []
    const male = list.reduce((s, r) => s + r.male, 0)
    const female = list.reduce((s, r) => s + r.female, 0)
    return { male, female, jiwa: male + female, kk: list.reduce((s, r) => s + (r.kk_count ?? 0), 0) }
  }, [rows])

  const periode = useMemo(() => {
    const first = (rows ?? [])[0]
    return first ? `${BULAN[first.month - 1]} ${first.year}` : null
  }, [rows])

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['hamlets'] })

  const resetForm = () => {
    setForm(emptyForm)
    setEditing(null)
    setShowForm(false)
  }

  const startEdit = (row: Hamlet) => {
    setEditing(row)
    setForm({
      year: row.year,
      month: row.month,
      name: row.name,
      rw: row.rw,
      rt_count: row.rt_count ?? '',
      kk_count: row.kk_count ?? '',
      male: row.male,
      female: row.female,
      ktp_required: row.ktp_required ?? '',
      ktp_done: row.ktp_done ?? '',
      ktp_pending: row.ktp_pending ?? '',
      sort_order: row.sort_order,
    })
    setShowForm(true)
  }

  const handleSave = async () => {
    const body = {
      ...form,
      rt_count: nullIfBlank(form.rt_count),
      kk_count: nullIfBlank(form.kk_count),
      ktp_required: nullIfBlank(form.ktp_required),
      ktp_done: nullIfBlank(form.ktp_done),
      ktp_pending: nullIfBlank(form.ktp_pending),
    }
    if (editing) {
      await adminUpdate(`/api/admin/hamlets/${editing.id}`, body)
    } else {
      await adminCreate('/api/admin/hamlets', body)
    }
    await invalidate()
    resetForm()
  }

  const handleDelete = async (row: Hamlet) => {
    if (!window.confirm(t('admin.confirm_delete'))) return
    await adminDelete(`/api/admin/hamlets/${row.id}`)
    await invalidate()
  }

  const columns: Column<Hamlet>[] = [
    { key: 'rw', label: 'RW', render: (r) => <span className="font-medium text-foreground">RW {r.rw}</span> },
    { key: 'name', label: t('village.hamlet'), render: (r) => <span className="font-medium text-foreground">{r.name}</span> },
    { key: 'rt_count', label: 'RT', render: (r) => <span className="tabular-nums text-muted-foreground">{r.rt_count ?? '—'}</span> },
    { key: 'kk_count', label: t('village.kk'), render: (r) => <span className="tabular-nums text-muted-foreground">{r.kk_count == null ? '—' : formatNumber(r.kk_count)}</span> },
    { key: 'male', label: t('demografi.male'), render: (r) => <span className="tabular-nums">{formatNumber(r.male)}</span> },
    { key: 'female', label: t('demografi.female'), render: (r) => <span className="tabular-nums">{formatNumber(r.female)}</span> },
    {
      key: 'id',
      label: t('demografi.total'),
      // Total sengaja dihitung, bukan disimpan — supaya tidak bisa berbeda dari rinciannya.
      render: (r) => <span className="font-semibold tabular-nums text-foreground">{formatNumber(r.male + r.female)}</span>,
    },
  ]

  const num = (label: string, key: keyof HamletForm, opsional = false) => (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1.5">
        {label}
        {opsional && <span className="text-muted-foreground font-normal"> (opsional)</span>}
      </label>
      <Input
        type="number"
        value={form[key] as number | ''}
        onChange={(e) =>
          setForm({ ...form, [key]: e.target.value === '' && opsional ? '' : Number(e.target.value) })
        }
      />
    </div>
  )

  return (
    <div>
      <AdminPageHeader
        icon={Home}
        title={t('admin.hamlets')}
        description={t('admin.hamlets_subtitle')}
        actions={
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4" /> {t('admin.add')}
          </Button>
        }
      />

      {/* Ringkasan periode yang sedang ditampilkan */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: t('demografi.total'), value: formatNumber(total.jiwa), icon: Users },
          { label: t('demografi.male'), value: formatNumber(total.male) },
          { label: t('demografi.female'), value: formatNumber(total.female) },
          { label: t('village.kk'), value: formatNumber(total.kk) },
        ].map((kartu) => (
          <div key={kartu.label} className="bg-surface-card rounded-2xl border border-border/60 p-4">
            <div className="text-xs text-muted-foreground uppercase tracking-wide">{kartu.label}</div>
            <div className="font-heading text-xl font-bold text-foreground tabular-nums mt-1">
              {kartu.value}
            </div>
          </div>
        ))}
      </div>

      {periode && (
        <p className="text-xs text-muted-foreground mb-4">
          {t('admin.hamlets_period', { periode })}
        </p>
      )}

      {showForm && (
        <div className="bg-surface-card rounded-2xl border border-border/60 mb-6 overflow-hidden">
          <div className="px-6 py-4 border-b border-border/40 flex items-center justify-between">
            <h3 className="font-heading font-semibold text-lg text-foreground">
              {editing ? t('admin.edit') : t('admin.add')} — {t('admin.hamlets')}
            </h3>
            <Button variant="ghost" size="sm" onClick={resetForm} aria-label={t('admin.cancel')} className="!p-2">
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="p-6 space-y-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {num(t('admin.year'), 'year')}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">{t('admin.month')}</label>
                <select
                  value={form.month}
                  onChange={(e) => setForm({ ...form, month: Number(e.target.value) })}
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
                >
                  {BULAN.map((b, i) => (
                    <option key={b} value={i + 1}>{b}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">{t('village.hamlet')}</label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              {num('RW', 'rw')}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {num('Jumlah RT', 'rt_count', true)}
              {num(t('village.kk'), 'kk_count', true)}
              {num(t('demografi.male'), 'male')}
              {num(t('demografi.female'), 'female')}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {num('Wajib KTP', 'ktp_required', true)}
              {num(t('village.ktp_done'), 'ktp_done', true)}
              {num('Belum Rekam KTP', 'ktp_pending', true)}
              {num('Urutan', 'sort_order')}
            </div>

            <p className="text-xs text-muted-foreground">
              {t('admin.hamlets_hint', {
                total: formatNumber(Number(form.male || 0) + Number(form.female || 0)),
              })}
            </p>
          </div>

          <div className="px-6 py-4 border-t border-border/40 flex gap-2 bg-muted/20">
            <Button onClick={handleSave}>{t('admin.save')}</Button>
            <Button variant="outline" onClick={resetForm}>{t('admin.cancel')}</Button>
          </div>
        </div>
      )}

      {isError ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-700">
          {t('common.error_title')}
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={rows ?? []}
          onEdit={startEdit}
          onDelete={handleDelete}
          emptyLabel={t('admin.no_data')}
        />
      )}
    </div>
  )
}
