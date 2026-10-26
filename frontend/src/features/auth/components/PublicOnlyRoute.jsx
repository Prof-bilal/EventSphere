import { Navigate } from 'react-router-dom'
import { useAuth } from '../../../state/AuthContext'

export default function PublicOnlyRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) return null
  if (user) return <Navigate to="/" replace />

  return children
}
