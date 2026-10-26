import { useEffect, useState } from 'react'
import { Bookmark, CalendarDays, Clock3, MapPin } from 'lucide-react'
import { api } from '../../../api'

export default function SessionsPage() {
  const [sessions, setSessions] = useState([])
  const [bookmarks, setBookmarks] = useState([])
  const [registered, setRegistered] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function loadSessions() {
    try {
      setSessions(await api('/session/get-sessions'))
      setBookmarks(await api('/bookmark'))
      setRegistered(await api('/session/my-registrations'))
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

  async function bookmark(id) {
    setBusy(true)
    try {
      const saved = bookmarks.some((item) => item.sessionId?._id === id)
      await api('/bookmark/' + id, saved ? 'DELETE' : 'POST')
      await loadSessions()
    } catch (error) {
      setError(error.message)
    }
    setBusy(false)
  }

  async function register(id) {
    setBusy(true)
    try {
      const joined = registered.some((item) => item.sessionId?._id === id)
      await api('/session/' + id + '/register', joined ? 'DELETE' : 'POST')
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
            <div className="session-record-actions"><button className="session-action-edit" disabled={busy} onClick={() => bookmark(item._id)}><Bookmark size={14} />{bookmarks.some((saved) => saved.sessionId?._id === item._id) ? 'Saved' : 'Save'}</button><button className="session-action-register" disabled={busy} onClick={() => register(item._id)}>{registered.some((saved) => saved.sessionId?._id === item._id) ? 'Registered' : 'Register'}</button></div>
          </article>
        ))}
      </section>
    </div>
  )
}
