import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { I18nextProvider } from 'react-i18next'
import i18n from './lib/i18n'
import { RootLayout } from './components/layout/RootLayout'
import { ScrollToTop } from './components/layout/ScrollToTop'
import { HomePage } from './pages/HomePage'
import { MapPage } from './pages/MapPage'
import { VillagePage } from './pages/VillagePage'
import { LocationDetailPage } from './pages/LocationDetailPage'
import { ErrorBoundary } from './components/ErrorBoundary'
import { RequireAuth } from './components/admin/RequireAuth'
import { AdminLoginPage } from './pages/admin/AdminLoginPage'
import { AdminLayout } from './pages/admin/AdminLayout'
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage'
import { AdminLocationsPage } from './pages/admin/AdminLocationsPage'
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage'
import { AdminProfilePage } from './pages/admin/AdminProfilePage'
import { AdminHamletsPage } from './pages/admin/AdminHamletsPage'
import { AdminApbdPage } from './pages/admin/AdminApbdPage'
import { AdminPeriodsPage } from './pages/admin/AdminPeriodsPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>
          <ScrollToTop />
          <ErrorBoundary>
            <Routes>
              <Route path="/map" element={<MapPage />} />
              <Route element={<RootLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/desa" element={<VillagePage />} />
                <Route path="/location/:slug" element={<LocationDetailPage />} />
              </Route>
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route
                path="/admin"
                element={
                  <RequireAuth>
                    <AdminLayout />
                  </RequireAuth>
                }
              >
                <Route index element={<AdminDashboardPage />} />
                <Route path="locations" element={<AdminLocationsPage />} />
                <Route path="categories" element={<AdminCategoriesPage />} />
                <Route path="profile" element={<AdminProfilePage />} />
                <Route path="hamlets" element={<AdminHamletsPage />} />
                <Route path="apbd" element={<AdminApbdPage />} />
                <Route path="periods" element={<AdminPeriodsPage />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ErrorBoundary>
        </BrowserRouter>
      </I18nextProvider>
    </QueryClientProvider>
  )
}

export default App
