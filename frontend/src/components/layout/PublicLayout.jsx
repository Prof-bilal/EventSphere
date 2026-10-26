import { useEffect, useRef, useState } from 'react'
import { ChevronDown, LayoutDashboard, LogOut, UserRound } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../state/AuthContext'

export default function PublicLayout({ children }) {
  return (
    <div className="site">
      <PublicHeader />
      <main>{children}</main>
    </div>
  )
}

export function PublicHeader() {
  const { user, loading, logout } = useAuth()
  const navigate = useNavigate()
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef(null)
  const workspacePath = user ? '/dashboard' : '/register'
  const initials = user?.name?.trim()?.charAt(0)?.toUpperCase() || '?'

  useEffect(() => {
    function closeProfile(event) {
      if (!profileRef.current?.contains(event.target)) setProfileOpen(false)
    }
    function closeOnEscape(event) {
      if (event.key === 'Escape') setProfileOpen(false)
    }
    document.addEventListener('mousedown', closeProfile)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('mousedown', closeProfile)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [])

  async function signOut() {
    await logout()
    setProfileOpen(false)
    navigate('/')
  }

  return (
    <header className="header">
        <Link className="brand" to="/">
          <span className="brand-mark" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          EventSphere
        </Link>
        <nav className="navigation" aria-label="Main navigation">
          <Link to="/events">Events</Link>
          <Link to="/exhibitors">Exhibitors</Link>
          <Link to="/schedule">Schedule</Link>
          <Link to="/about">About</Link>
          {!loading && !user && (
            <Link to="/login">Sign in</Link>
          )}
        </nav>
        {loading ? null : user ? (
          <div className="public-profile" ref={profileRef}>
            <button
              className="public-profile-trigger"
              type="button"
              aria-expanded={profileOpen}
              aria-haspopup="menu"
              onClick={() => setProfileOpen((open) => !open)}
            >
              <span className="public-avatar" aria-hidden="true">
                <span>{initials}</span>
                {user.profileImage && (
                  <img src={user.profileImage} alt="" onError={(event) => (event.currentTarget.style.display = 'none')} />
                )}
              </span>
              <span className="public-profile-name">{user.name}</span>
              <ChevronDown size={15} className={profileOpen ? 'is-open' : ''} />
            </button>
            {profileOpen && (
              <div className="public-profile-dropdown" role="menu">
                <div className="public-profile-heading">
                  <span className="public-avatar public-avatar-large" aria-hidden="true">
                    <span>{initials}</span>
                    {user.profileImage && <img src={user.profileImage} alt="" />}
                  </span>
                  <div>
                    <strong>{user.name}</strong>
                    <small>{user.email}</small>
                  </div>
                </div>
                <Link to="/dashboard/account" role="menuitem" onClick={() => setProfileOpen(false)}>
                  <UserRound size={15} /> Account
                </Link>
                <Link to={workspacePath} role="menuitem" onClick={() => setProfileOpen(false)}>
                  <LayoutDashboard size={15} /> Open workspace
                </Link>
                <button type="button" role="menuitem" onClick={signOut}>
                  <LogOut size={15} /> Sign out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link className="button button-dark nav-cta" to="/register">
            Plan your event ↗
          </Link>
        )}
    </header>
  )
}
