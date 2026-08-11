import { Navigate, useLocation } from 'react-router'
import { storage } from '../../lib/storage'

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const location = useLocation()

  if (!storage.getToken()) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />
  }

  return <>{children}</>
}
