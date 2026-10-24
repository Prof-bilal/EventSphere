import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../../api'
import { useAuth } from '../../../state/AuthContext'

export default function OverviewPage() {
  const { user } = useAuth()
  const [expos, setExpos] = useState([])
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadOverview() {
      try {
        setExpos(await api('/expo/getExpo'))
        setSessions(await api('/session/get-sessions'))
      } catch (error) {
        setError(error.message)
      }
      setLoading(false)
    }
    loadOverview()
    window.addEventListener('event-updated', loadOverview)
    return () => window.removeEventListener('event-updated', loadOverview)
  }, [])

  return (
    <div className="dash-view">
      <div className="page-intro">
        <div>
          <span className="dash-eyebrow">ATTENDEE WORKSPACE</span>
          <h1>Welcome, {user.name}.</h1>
          <p>Everything you need for your next event.</p>
        </div>
      </div>
      {error && (
        <p className="api-error" role="alert">
          {error}
        </p>
      )}
      {loading && <p>Loading overview...</p>}
      <div className="dash-grid">
        <article className="dash-card">
          <span className="dash-eyebrow">EXPOS</span>
          <h2>{expos.length}</h2>
          <Link className="text-link" to="/attendee/expos">
            Explore expos
          </Link>
        </article>
        <article className="dash-card">
          <span className="dash-eyebrow">SESSIONS</span>
          <h2>{sessions.length}</h2>
          <Link className="text-link" to="/attendee/sessions">
            View schedule
          </Link>
        </article>
        <article className="dash-card">
          <span className="dash-eyebrow">YOUR NEXT STEP</span>
          <h2>Plan your visit.</h2>
          <Link className="dash-primary" to="/attendee/bookmarks">
            My plans
          </Link>
        </article>
      </div>
      <section className="dash-card">
        <h2>Upcoming sessions</h2>
        {!sessions.length && <p>No sessions yet.</p>}
        {sessions.slice(0, 5).map((session) => (
          <article className="activity-row" key={session._id}>
            <div>
              <strong>{session.title}</strong>
              <p>
                {session.speakerName} · {session.startTime} · {session.location}
              </p>
            </div>
          </article>
        ))}
      </section>
    </div>
  )
}
