import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../../api'

export default function SessionsPage() {
  const [sessions, setSessions] = useState([])

  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function loadSessions() {
    try {
      setSessions(await api('/session/get-sessions'))

      setError('')
    } catch (error) {
      setError(error.message)
    }
    setLoading(false)
  }
  useEffect(() => {
    loadSessions()
    window.addEventListener('event-updated', loadSessions)
    return () => window.removeEventListener('event-updated', loadSessions)
  }, [])

  async function remove(id) {
    if (!window.confirm('Delete this session?')) return
    setBusy(true)
    try {
      await api('/session/delete-session/' + id, 'DELETE')
      await loadSessions()
    } catch (error) {
      setError(error.message)
    }
    setBusy(false)
  }
  const filtered = sessions.filter((item) =>
    (item.title + ' ' + item.speakerName).toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="dash-view">
      <div className="page-intro">
        <div>
          <span className="dash-eyebrow">SCHEDULE</span>
          <h1>Make time for good ideas.</h1>
        </div>
        <Link className="dash-primary" to="/organizer/sessions/new">
          Add session
        </Link>
      </div>
      <input
        className="page-search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search sessions or speakers"
        aria-label="Search sessions"
      />
      {error && (
        <p className="api-error" role="alert">
          {error}
        </p>
      )}
      {loading && <p>Loading sessions...</p>}
      {!loading && !filtered.length && <p className="empty-state">No sessions found.</p>}
      <section className="dash-card">
        {filtered.map((item) => (
          <article className="activity-row" key={item._id}>
            <div>
              <span className="dash-eyebrow">
                {item.sessionType} · {item.expoId?.title}
              </span>
              <h3>{item.title}</h3>
              <p>
                {item.speakerName} · {item.location}
              </p>
              <small>
                {new Date(item.startDate).toLocaleDateString()} · {item.startTime}–{item.endTime}
              </small>
            </div>
            <div className="record-actions">
              <Link className="outline-button" to={'/organizer/sessions/' + item._id + '/edit'}>
                Edit
              </Link>
              <button className="danger-button" disabled={busy} onClick={() => remove(item._id)}>
                Delete
              </button>
            </div>
          </article>
        ))}
      </section>
    </div>
  )
}
