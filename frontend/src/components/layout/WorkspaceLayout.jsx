import { useState } from 'react'
import { Link, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, Bell, LogOut } from 'lucide-react'
import { useAuth } from '../../state/AuthContext'
import { roleDetails } from '../../navigation'

export default function WorkspaceLayout({ role }) {
  const { user, loading, logout, notifications, notice } = useAuth()
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')
  const location = useLocation()
  const navigate = useNavigate()
  const details = roleDetails[role]
  const userRole = user?.role === 'admin' ? 'organizer' : user?.role
  const page = location.pathname.split('/')[2] || 'overview'

  async function signOut() {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      setError(error.message)
    }
  }

  if (loading)
    return (
      <p className="section wrap" role="status">
        Loading your account...
      </p>
    )
  if (!user) return <Navigate to="/login" replace />
  if (userRole !== role) return <Navigate to={`/${userRole}`} replace />

  return (
    <div className="dashboard-page">
      <aside className={`dashboard-sidebar ${open ? 'open' : ''}`}>
        <Link to="/" className="brand">
          EventSphere
        </Link>
        <p className="dash-eyebrow">{details.label} workspace</p>
        <nav className="dashboard-nav" aria-label="Workspace navigation">
          {details.nav.map(([path, label, Icon]) => (
            <Link
              key={path}
              className={page === path ? 'active' : ''}
              to={`/${role}/${path === 'overview' ? '' : path}`}
              onClick={() => setOpen(false)}
            >
              <Icon size={17} />
              {label}
            </Link>
          ))}
          {role !== 'exhibitor' && (
            <Link to={`/${role}/messages`} onClick={() => setOpen(false)}>
              Messages
            </Link>
          )}
        </nav>
      </aside>
      <div className="dashboard-main">
        <header className="dashboard-header">
          <button
            className="dash-menu"
            onClick={() => setOpen(!open)}
            aria-label="Toggle navigation"
          >
            {open ? <X /> : <Menu />}
          </button>
          <div className="header-title">
            <span className="dash-header-label">{details.label} workspace</span>
            <Link to={`/${role}/account`}>{user.name}</Link>
          </div>
          <Link to={`/${role}/notifications`} aria-label="Notifications">
            <Bell size={19} />
            {notifications.filter((item) => !item.isRead).length}
          </Link>
          <button className="outline-button" onClick={signOut}>
            <LogOut size={15} /> Sign out
          </button>
        </header>
        {error && (
          <p className="api-error" role="alert">
            {error}
          </p>
        )}
        <main className="dashboard-content">
          <Outlet />
        </main>
        {notice && (
          <div className="toast" role="status">
            {notice}
          </div>
        )}
      </div>
    </div>
  )
}
