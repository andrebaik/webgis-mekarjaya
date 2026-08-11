import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

interface AdminPageHeaderProps {
  title: string
  description?: string
  icon?: LucideIcon
  actions?: ReactNode
}

export function AdminPageHeader({ title, description, icon: Icon, actions }: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-3 min-w-0">
        {Icon && (
          <div className="w-10 h-10 rounded-2xl bg-white border border-neutral-200/80 text-neutral-900 shadow-xs flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <div className="min-w-0">
          <h1 className="font-heading text-xl md:text-2xl font-bold text-neutral-900 tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="text-xs text-neutral-400 font-medium mt-0.5 truncate">{description}</p>
          )}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  )
}
