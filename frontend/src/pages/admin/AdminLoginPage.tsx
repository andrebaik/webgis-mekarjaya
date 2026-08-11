import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, Navigate, useLocation } from 'react-router'
import { MapPin, Loader2 } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { useAdminAuth } from '../../hooks/useAdminAuth'

export function AdminLoginPage() {
  const { t } = useTranslation()
  const { isAuthenticated, login } = useAdminAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  if (isAuthenticated.data) {
    return <Navigate to="/admin" replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await login.mutateAsync({ username, password })
      const from = (location.state as { from?: string })?.from || '/admin'
      navigate(from, { replace: true })
    } catch {
      setError(t('admin.login_error'))
    }
  }

  return (
    <div className="min-h-screen bg-[#F4F4F3] flex items-center justify-center px-4 font-sans">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-xs overflow-hidden p-8">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-neutral-900 flex items-center justify-center mb-4 text-white shadow-xs">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-neutral-900 tracking-tight">
              {t('admin.login_title')}
            </h1>
            <p className="text-xs text-neutral-400 font-medium mt-1">Desa Mekarjaya Admin Portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">
                {t('admin.login_username')}
              </label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
                className="bg-neutral-100/50 border-neutral-200 focus:bg-white text-neutral-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">
                {t('admin.login_password')}
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="bg-neutral-100/50 border-neutral-200 focus:bg-white text-neutral-900"
              />
            </div>

            {error && (
              <p className="text-xs font-medium text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-100 text-center">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl py-2.5 text-xs font-semibold shadow-xs transition-all"
              disabled={login.isPending}
            >
              {login.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mx-auto" />
              ) : (
                t('admin.login_submit')
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
