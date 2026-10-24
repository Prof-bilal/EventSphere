import { BrowserRouter } from 'react-router-dom'
import AppRouter from './router'
import { AuthProvider } from '../state/AuthContext'
import '../index.css'
import '../dashboard.css'
import '../auth.css'
import '../public-pages.css'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </AuthProvider>
  )
}
