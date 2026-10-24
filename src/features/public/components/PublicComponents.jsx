import { Link } from 'react-router-dom'

function PublicHeader() {
  return (
    <header className="public-header">
      <Link className="brand" to="/">
        <span className="brand-mark" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        EventSphere
      </Link>
      <nav>
        <Link to="/events">Events</Link>
        <Link to="/exhibitors">Exhibitors</Link>
        <Link to="/schedule">Schedule</Link>
        <Link to="/about">About</Link>
      </nav>
      <div className="public-header-actions">
        <Link to="/login">Sign in</Link>
        <Link className="button button-dark" to="/register">
          Join EventSphere <ArrowUpRight size={15} />
        </Link>
      </div>
    </header>
  );
}

function PublicLayout({ eyebrow, title, copy, children }) {
  return (
    <div className="public-site">
      <PublicHeader />
      <main>
        <section className="public-hero wrap">
          <span className="eyebrow">
            <span className="status-dot" />
            {eyebrow}
          </span>
          <h1>{title}</h1>
          <p>{copy}</p>
        </section>
        {children}
      </main>
      <footer className="public-footer wrap">
        <div>
          <Link className="brand" to="/">
            <span className="brand-mark" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            EventSphere
          </Link>
          <p>
            Good people. Great connections.
            <br />
            Events that bring it all together.
          </p>
        </div>
        <div>
          <span>Explore</span>
          <Link to="/events">Events</Link>
          <Link to="/exhibitors">Exhibitors</Link>
          <Link to="/about">About us</Link>
        </div>
        <div>
          <span>Get in touch</span>
          <Link to="/contact">Contact the team</Link>
          <Link to="/login">Sign in</Link>
        </div>
      </footer>
    </div>
  );
}

export { PublicLayout }
