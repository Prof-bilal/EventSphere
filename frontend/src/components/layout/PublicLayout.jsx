import { Link } from 'react-router-dom'

export default function PublicLayout({ children }) {
  return (
    <div className="site">
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
          <Link to="/login">Sign in</Link>
        </nav>
        <Link className="button button-dark nav-cta" to="/register">
          Plan your event ↗
        </Link>
      </header>
      <main>{children}</main>
    </div>
  )
}
