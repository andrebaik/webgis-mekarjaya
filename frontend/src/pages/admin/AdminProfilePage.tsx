import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Landmark, CheckCircle2, Save, Loader2 } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { AdminPageHeader } from '../../components/admin/AdminPageHeader'
import { ContentField } from '../../components/admin/ContentField'
import { ImageUploadField } from '../../components/admin/ImageUploadField'
import { useProfile } from '../../hooks/useProfile'
import { adminUpdate } from '../../services/adminApi'
import { useQueryClient } from '@tanstack/react-query'

export function AdminProfilePage() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { data: profile, isLoading } = useProfile()
  const [form, setForm] = useState<Record<string, string>>({})
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (profile) {
      setForm({
        name_id: profile.name_id || '',
        description_id: profile.description_id || '',
        history_id: profile.history_id || '',
        image_url: profile.image_url || '',
        address: profile.address || '',
        phone: profile.phone || '',
        email: profile.email || '',
        vision_id: profile.vision_id || '',
        mission_id: profile.mission_id || '',
        area_km2: profile.area_km2 == null ? '' : String(profile.area_km2),
        altitude_m: profile.altitude_m == null ? '' : String(profile.altitude_m),
        rw_count: profile.rw_count == null ? '' : String(profile.rw_count),
        rt_count: profile.rt_count == null ? '' : String(profile.rt_count),
        boundary_north: profile.boundary_north || '',
        boundary_south: profile.boundary_south || '',
        boundary_east: profile.boundary_east || '',
        boundary_west: profile.boundary_west || '',
      })
    }
  }, [profile])

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading...
      </div>
    )
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await adminUpdate('/api/admin/profile', form)
      await queryClient.invalidateQueries({ queryKey: ['profile'] })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <AdminPageHeader icon={Landmark} title={t('admin.profile')} description={t('admin.profile_subtitle')} />

      <div className="bg-surface-card rounded-2xl border border-border/60 max-w-3xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border/40">
          <h3 className="font-heading font-semibold text-lg text-foreground">{t('admin.profile')}</h3>
        </div>
        <div className="p-6 space-y-6">
          <section className="space-y-4">
            <ContentField prefix="name" values={form} onChange={(f, v) => setForm({ ...form, [f]: v })} required />
          </section>
          <section className="pt-2 border-t border-border/40">
            <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">{t('village.overview')}</h4>
            <div className="space-y-4">
              <ContentField prefix="description" values={form} onChange={(f, v) => setForm({ ...form, [f]: v })} textarea />
              <ImageUploadField
                value={form.image_url || null}
                onChange={(url) => setForm({ ...form, image_url: url ?? '' })}
                label="Image URL"
              />
            </div>
          </section>
          <section className="pt-2 border-t border-border/40">
            <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">{t('village.history')}</h4>
            <ContentField prefix="history" values={form} onChange={(f, v) => setForm({ ...form, [f]: v })} textarea />
          </section>
          <section className="pt-2 border-t border-border/40">
            <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">{t('village.vision_mission')}</h4>
            <div className="space-y-4">
              <ContentField prefix="vision" values={form} onChange={(f, v) => setForm({ ...form, [f]: v })} textarea />
              <div>
                <ContentField prefix="mission" values={form} onChange={(f, v) => setForm({ ...form, [f]: v })} textarea />
                <p className="text-xs text-muted-foreground mt-1.5">{t('village.mission_hint')}</p>
              </div>
            </div>
          </section>

          <section className="pt-2 border-t border-border/40">
            <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">{t('village.region')}</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">{t('village.area')} ({t('village.area_unit')})</label>
                <Input type="number" step="0.01" value={form.area_km2 || ''} onChange={(e) => setForm({ ...form, area_km2: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">{t('village.altitude')} ({t('village.altitude_unit')})</label>
                <Input type="number" value={form.altitude_m || ''} onChange={(e) => setForm({ ...form, altitude_m: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">{t('village.rw_count')}</label>
                <Input type="number" value={form.rw_count || ''} onChange={(e) => setForm({ ...form, rw_count: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">{t('village.rt_count')}</label>
                <Input type="number" value={form.rt_count || ''} onChange={(e) => setForm({ ...form, rt_count: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(['north', 'south', 'east', 'west'] as const).map((dir) => (
                <div key={dir}>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    {t('village.boundaries')} — {t(`village.boundary_${dir}`)}
                  </label>
                  <Input
                    value={form[`boundary_${dir}`] || ''}
                    onChange={(e) => setForm({ ...form, [`boundary_${dir}`]: e.target.value })}
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="pt-2 border-t border-border/40">
            <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">{t('village.profile')}</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">{t('village.address')}</label>
                <Input value={form.address || ''} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">{t('village.phone')}</label>
                <Input value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">{t('village.email')}</label>
                <Input value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
            </div>
          </section>
        </div>
        <div className="px-6 py-4 border-t border-border/40 flex gap-2 items-center bg-muted/20">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {t('admin.save')}
          </Button>
          {saved && (
            <span className="inline-flex items-center gap-1.5 text-sm text-secondary font-medium">
              <CheckCircle2 className="w-4 h-4" /> {t('admin.save')}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
