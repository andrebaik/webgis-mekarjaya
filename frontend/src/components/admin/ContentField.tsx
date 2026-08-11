import { useTranslation } from 'react-i18next'
import { Input } from '../ui/input'

interface ContentFieldProps {
  /** Nama kolom tanpa sufiks bahasa, mis. 'name' | 'description' | 'title' | 'history'. */
  prefix: string
  values: object
  onChange: (field: string, value: string) => void
  textarea?: boolean
  required?: boolean
}

export function ContentField({ prefix, values, onChange, textarea, required }: ContentFieldProps) {
  const { t } = useTranslation()

  const key = `${prefix}_id`
  const value = String((values as Record<string, unknown>)[key] ?? '')

  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1.5">
        {t(`admin.${key}`)}
      </label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(key, e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      ) : (
        <Input value={value} onChange={(e) => onChange(key, e.target.value)} required={required} />
      )}
    </div>
  )
}
