import { BrowserRouter } from 'react-router-dom'
import AppRouter from './router'
import { AuthProvider } from '../state/AuthContext'
import '../index.css'
import '../dashboard.css'
import '../auth.css'
import '../public-pages.css'
import '../event-card.css'
import '../exhibitor-card.css'
import '../overview.css'
import '../bookmarks.css'
import '../feedback.css'
import '../notifications.css'
import '../messages.css'
import '../account.css'
import '../expo-record.css'
import '../management-table.css'
import '../application.css'
import '../application-table.css'
import '../booth-detail.css'
import '../sessions.css'
import '../analytics.css'
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
