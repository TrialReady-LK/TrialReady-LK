import { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { ErrorBoundary } from './components/ErrorBoundary'
import { AuthProvider } from './features/auth/context/AuthContext'
import AppRoutes from './routes/AppRoutes'
import { ensureInitialDemoDataSeeded } from './features/demo/services/demoSeedService'

function App() {
  useEffect(() => {
    void ensureInitialDemoDataSeeded()
  }, [])

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App