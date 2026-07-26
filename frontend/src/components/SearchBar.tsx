import { useTranslation } from 'react-i18next'
import { Search, X } from 'lucide-react'
import { Input } from './ui/input'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function SearchBar({ value, onChange, placeholder, className }: SearchBarProps) {
  const { t } = useTranslation()

  return (
    <div className={`relative ${className || ''}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <Input
        placeholder={placeholder || t('map.search')}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9 h-10 text-sm rounded-xl"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer p-1 rounded-md hover:bg-muted transition-colors"
        >
          <X className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      )}
    </div>
  )
}
