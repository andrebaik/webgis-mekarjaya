import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { I18nextProvider } from 'react-i18next'
import i18n from './lib/i18n'
import { Toaster } from 'sonner'
import { RootLayout } from './components/layout/RootLayout'
import { HomePage } from './pages/HomePage'
import { MapPage } from './pages/MapPage'
import { LocationDetailPage } from './pages/LocationDetailPage'
import { ThemeProvider } from './lib/theme'
import './index.css'

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
        <ThemeProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/map" element={<MapPage />} />
              <Route element={<RootLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/location/:slug" element={<LocationDetailPage />} />
              </Route>
            </Routes>
            <Toaster position="top-right" richColors />
          </BrowserRouter>
        </ThemeProvider>
      </I18nextProvider>
    </QueryClientProvider>
  )
}

export default App
