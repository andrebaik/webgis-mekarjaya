import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MapPin, Plus, X, Star } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Badge } from '../../components/ui/badge'
import { AdminPageHeader } from '../../components/admin/AdminPageHeader'
import { DataTable, type Column } from '../../components/admin/DataTable'
import { ContentField } from '../../components/admin/ContentField'
import { adminCreate, adminDelete, adminUpdate } from '../../services/adminApi'
import { useLocations } from '../../hooks/useLocations'
import { useCategories } from '../../hooks/useCategories'
import { useQueryClient } from '@tanstack/react-query'
import type { Location, Category } from '../../types'

interface LocationForm {
  slug: string
  category_id: number
  name_id: string
  description_id: string
  coordinates: string
  featured: boolean
}

const emptyForm: LocationForm = {
  slug: '',
  category_id: 0,
  name_id: '',
  description_id: '',
  coordinates: '[107.83, -7.38]',
  featured: false,
}

export function AdminLocationsPage() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { data: locations, isError } = useLocations()
  const { data: categories } = useCategories()
  const [editing, setEditing] = useState<Location | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<LocationForm>(emptyForm)

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['locations'] })

  const resetForm = () => {
    setForm(emptyForm)
    setEditing(null)
    setShowForm(false)
  }

  const startEdit = (row: Location) => {
    setEditing(row)
    setForm({
      slug: row.slug,
      category_id: row.category_id,
      name_id: row.name_id,
      description_id: row.description_id ?? '',
      coordinates: JSON.stringify(row.coordinates),
      featured: row.featured,
    })
    setShowForm(true)
  }

  const handleSave = async () => {
    let coordinates: number[]
    try {
      coordinates = JSON.parse(form.coordinates)
    } catch {
      alert('Coordinates must be valid JSON array [lng, lat]')
      return
    }
    const body = {
      slug: form.slug,
      category_id: form.category_id,
      name_id: form.name_id,
      description_id: form.description_id || null,
      coordinates,
      featured: form.featured,
    }
    if (editing) {
      await adminUpdate(`/api/admin/locations/${editing.id}`, body)
    } else {
      await adminCreate('/api/admin/locations', body)
    }
    await invalidate()
    resetForm()
  }

  const handleDelete = async (row: Location) => {
    if (!window.confirm(t('admin.confirm_delete'))) return
    await adminDelete(`/api/admin/locations/${row.id}`)
    await invalidate()
  }

  const columns: Column<Location>[] = [
    { key: 'name_id', label: t('admin.name_id'), render: (r) => <span className="font-medium text-foreground">{r.name_id}</span> },
    {
      key: 'category_id',
      label: t('admin.category'),
      render: (r) => {
        const cat = categories?.find((c: Category) => c.id === r.category_id)
        return cat ? <Badge variant="outline">{cat.name_id}</Badge> : <span className="text-xs">{String(r.category_id)}</span>
      },
    },
    { key: 'slug', label: t('admin.slug'), render: (r) => <code className="text-xs text-muted-foreground">{r.slug}</code> },
    {
      key: 'featured',
      label: t('admin.featured'),
      render: (r) => (r.featured ? <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> : '—'),
    },
  ]

  return (
    <div>
      <AdminPageHeader
        icon={MapPin}
        title={t('admin.locations')}
        description={t('admin.locations_subtitle')}
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
              {editing ? t('admin.edit') : t('admin.add')} — {t('admin.locations')}
            </h3>
            <Button variant="ghost" size="sm" onClick={resetForm} aria-label={t('admin.cancel')} className="!p-2">
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">{t('admin.slug')}</label>
                <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">{t('admin.category')}</label>
                <select
                  value={form.category_id}
                  onChange={(e) => setForm({ ...form, category_id: Number(e.target.value) })}
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  required
                >
                  <option value={0}>—</option>
                  {categories?.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name_id}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Coordinates [lng, lat]</label>
                <Input value={form.coordinates} onChange={(e) => setForm({ ...form, coordinates: e.target.value })} />
              </div>
            </div>
            <ContentField prefix="name" values={form} onChange={(f, v) => setForm({ ...form, [f]: v })} required />
            <ContentField prefix="description" values={form} onChange={(f, v) => setForm({ ...form, [f]: v })} textarea />
            <label className="flex items-center gap-2 text-sm font-medium text-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="w-4 h-4 accent-[--color-primary]"
              />
              {t('admin.featured')}
            </label>
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
        <DataTable columns={columns} rows={locations ?? []} onEdit={startEdit} onDelete={handleDelete} emptyLabel={t('featured.empty')} />
      )}
    </div>
  )
}
