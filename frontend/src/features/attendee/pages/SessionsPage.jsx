import { useEffect, useState } from 'react'
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
              <button className="outline-button" disabled={busy} onClick={() => bookmark(item._id)}>
                {bookmarks.some((saved) => saved.sessionId?._id === item._id)
                  ? 'Remove bookmark'
                  : 'Bookmark'}
              </button>
              <button className="dash-primary" disabled={busy} onClick={() => register(item._id)}>
                {registered.some((saved) => saved.sessionId?._id === item._id)
                  ? 'Cancel registration'
                  : 'Register'}
              </button>
            </div>
          </article>
        ))}
      </section>
    </div>
  )
}
