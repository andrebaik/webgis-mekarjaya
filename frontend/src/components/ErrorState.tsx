import { useTranslation } from 'react-i18next'
import { AlertTriangle } from 'lucide-react'
import { Button } from './ui/button'

interface ErrorStateProps {
  onRetry: () => void
}

export function ErrorState({ onRetry }: ErrorStateProps) {
  const { t } = useTranslation()

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center px-6">
        <AlertTriangle className="w-10 h-10 mx-auto text-destructive/60 mb-4" />
        <h2 className="font-heading text-xl font-semibold text-foreground mb-2">
          {t('common.error_title')}
        </h2>
        <p className="text-muted-foreground text-sm mb-6">{t('common.error_message')}</p>
        <Button variant="outline" onClick={onRetry}>
          {t('common.retry')}
        </Button>
      </div>
    </div>
  )
}
