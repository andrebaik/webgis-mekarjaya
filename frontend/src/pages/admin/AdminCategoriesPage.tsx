import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Tag, Plus, X } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { AdminPageHeader } from '../../components/admin/AdminPageHeader'
import { DataTable, type Column } from '../../components/admin/DataTable'
import { ContentField } from '../../components/admin/ContentField'
import { adminCreate, adminDelete, adminUpdate } from '../../services/adminApi'
import { useCategories } from '../../hooks/useCategories'
import { useQueryClient } from '@tanstack/react-query'
import type { Category } from '../../types'

export function AdminCategoriesPage() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { data: categories, isError } = useCategories()
  const [editing, setEditing] = useState<Category | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ slug: '', name_id: '', icon: '' })

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['categories'] })

  const resetForm = () => {
    setForm({ slug: '', name_id: '', icon: '' })
    setEditing(null)
    setShowForm(false)
  }

  const startEdit = (row: Category) => {
    setEditing(row)
    setForm({
      slug: row.slug,
      name_id: row.name_id,
      icon: row.icon || '',
    })
    setShowForm(true)
  }

  const handleSave = async () => {
    const body = { ...form, icon: form.icon || null }
    if (editing) {
      await adminUpdate(`/api/admin/categories/${editing.id}`, body)
    } else {
      await adminCreate('/api/admin/categories', body)
    }
    await invalidate()
    resetForm()
  }

  const handleDelete = async (row: Category) => {
    if (!window.confirm(t('admin.confirm_delete'))) return
    await adminDelete(`/api/admin/categories/${row.id}`)
    await invalidate()
  }

  const columns: Column<Category>[] = [
    { key: 'slug', label: t('admin.slug'), render: (r) => <code className="text-xs font-medium text-foreground">{r.slug}</code> },
    { key: 'name_id', label: t('admin.name_id'), render: (r) => <span className="font-medium text-foreground">{r.name_id}</span> },
    { key: 'icon', label: 'Icon', render: (r) => <code className="text-xs text-muted-foreground">{r.icon || '—'}</code> },
  ]

  return (
    <div>
      <AdminPageHeader
        icon={Tag}
        title={t('admin.categories')}
        description={t('admin.categories_subtitle')}
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
              {editing ? t('admin.edit') : t('admin.add')} — {t('admin.categories')}
            </h3>
            <Button variant="ghost" size="sm" onClick={resetForm} aria-label={t('admin.cancel')} className="!p-2">
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">{t('admin.slug')}</label>
                <Input
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="sekolah"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Icon</label>
                <Input
                  value={form.icon}
                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
                  placeholder="school"
                />
              </div>
            </div>
            <ContentField
              prefix="name"
              values={form}
              onChange={(field, value) => setForm({ ...form, [field]: value })}
              required
            />
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
        <DataTable columns={columns} rows={categories ?? []} onEdit={startEdit} onDelete={handleDelete} emptyLabel={t('featured.empty')} />
      )}
    </div>
  )
}
