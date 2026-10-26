import { BrowserRouter } from 'react-router-dom'
import AppRouter from './router'
import { AuthProvider } from '../state/AuthContext'
import '../index.css'
import '../dashboard.css'
import '../auth.css'
import '../public-pages.css'
import LiveFormValidation from '../components/forms/LiveFormValidation'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <LiveFormValidation />
        <AppRouter />
      </BrowserRouter>
    </AuthProvider>
  )
}
