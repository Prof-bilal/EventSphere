import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../../api'
import { useAuth } from '../../../state/AuthContext'
import { roleDashboardConfig } from '../config'

export default function OverviewPage() {
  const { user } = useAuth()
  const role = user?.role === 'admin' ? 'organizer' : user?.role
  const config = roleDashboardConfig[role]
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
    <div className="dash-view overview-page">
      <div className="page-intro">
        <div>
          <span className="dash-eyebrow">{config.workspaceLabel}</span>
          <h1>Welcome, {user.name}.</h1>
          <p>Everything you need for your next event.</p>
        </div>
      </div>
      {error && <p className="api-error" role="alert">{error}</p>}
      {loading && <p>Loading overview...</p>}
      <div className="overview-grid">
        <article className="overview-stat dash-card">
          <span className="dash-eyebrow">EXPOS</span>
          <h2>{expos.length}</h2>
          <Link className="text-link" to="/dashboard/expos">Explore expos</Link>
        </article>
        <article className="overview-stat dash-card">
          <span className="dash-eyebrow">SESSIONS</span>
          <h2>{sessions.length}</h2>
          <Link className="text-link" to="/dashboard/sessions">View schedule</Link>
        </article>
        <article className="overview-next dash-card">
          <span className="dash-eyebrow">YOUR NEXT STEP</span>
          <h2>{config.overview.nextStepTitle}</h2>
          <Link className="dash-primary" to={config.overview.nextStepPath}>{config.overview.nextStepLabel}</Link>
        </article>
      </div>
      <section className="overview-sessions dash-card">
        <h2>Upcoming sessions</h2>
        {!sessions.length && <p className="overview-empty">No sessions scheduled yet. Your event schedule will appear here.</p>}
        {sessions.slice(0, 5).map((session) => (
          <article className="activity-row" key={session._id}>
            <div>
              <strong>{session.title}</strong>
              <p>{session.speakerName} · {session.startTime} · {session.location}</p>
            </div>
          </article>
        ))}
      </section>
    </div>
  )
}
