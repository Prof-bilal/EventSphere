import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, Clock3, Edit3, MapPin, Trash2 } from 'lucide-react'
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
        <Link className="dash-primary" to="/dashboard/sessions/new">
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
      <section className="session-records">
        {filtered.map((item) => (
          <article className="session-record" key={item._id}>
            <div className="session-record-date"><CalendarDays size={16} /><strong>{new Date(item.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</strong><small>{item.startTime}</small></div>
            <div className="session-record-main"><span className="session-record-type">{item.sessionType} · {item.expoId?.title || 'Expo'}</span><h3>{item.title}</h3><p>{item.speakerName} · {item.location}</p><span className="session-record-time"><Clock3 size={13} /> {item.startTime}–{item.endTime} <MapPin size={13} /> {item.location}</span></div>
            <div className="session-record-actions"><Link className="session-action-edit" to={'/dashboard/sessions/' + item._id + '/edit'}><Edit3 size={14} /> Edit</Link><button className="session-action-delete" disabled={busy} onClick={() => remove(item._id)}><Trash2 size={14} /> Delete</button></div>
          </article>
        ))}
      </section>
    </div>
  )
}
