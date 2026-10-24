import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../../api'

export default function BookmarksPage() {
  const [registrations, setRegistrations] = useState([])
  const [bookmarks, setBookmarks] = useState([])
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function loadPlans() {
    try {
      setRegistrations(await api('/expoRegistration/mine'))
      setBookmarks(await api('/bookmark'))
      setSessions(await api('/session/my-registrations'))
    } catch (error) {
      setError(error.message)
    }
    setLoading(false)
  }
  useEffect(() => {
    loadPlans()
  }, [])

  async function cancel(id) {
    setBusy(true)
    try {
      await api('/expoRegistration/register/' + id, 'PUT')
      await loadPlans()
    } catch (error) {
      setError(error.message)
    }
    setBusy(false)
  }

  return (
    <div className="dash-view">
      <div className="page-intro">
        <div>
          <span className="dash-eyebrow">MY PLANS</span>
          <h1>Your event, your way.</h1>
        </div>
      </div>
      {error && (
        <p className="api-error" role="alert">
          {error}
        </p>
      )}
      {loading && <p>Loading your plans...</p>}
      <div className="dash-grid">
        <section className="dash-card">
          <h2>Registered expos</h2>
          {!registrations.length && <p>No expo registrations yet.</p>}
          {registrations.map((item) => (
            <article className="activity-row" key={item._id}>
              <div>
                <strong>{item.expoId?.title || 'Deleted expo'}</strong>
                <p>
                  {item.status} · #{item.registrationNumber}
                </p>
              </div>
              {item.status === 'registered' && (
                <button className="outline-button" disabled={busy} onClick={() => cancel(item._id)}>
                  Cancel
                </button>
              )}
            </article>
          ))}
        </section>
        <section className="dash-card">
          <h2>Registered sessions</h2>
          {!sessions.length && <p>No registered sessions yet.</p>}
          {sessions.map((item) => (
            <article className="activity-row" key={item._id}>
              <div>
                <strong>{item.sessionId?.title || 'Deleted session'}</strong>
                <p>
                  {item.sessionId?.startTime} · {item.sessionId?.location}
                </p>
              </div>
            </article>
          ))}
          <Link className="text-link" to="/attendee/sessions">
            Manage session registrations
          </Link>
        </section>
        <section className="dash-card">
          <h2>Bookmarked sessions</h2>
          {!bookmarks.length && <p>No bookmarks yet.</p>}
          {bookmarks.map((item) => (
            <article className="activity-row" key={item._id}>
              <div>
                <strong>{item.sessionId?.title || 'Deleted session'}</strong>
                <p>
                  {item.sessionId?.startTime} · {item.sessionId?.location}
                </p>
              </div>
            </article>
          ))}
          <Link className="text-link" to="/attendee/sessions">
            Browse sessions
          </Link>
        </section>
      </div>
    </div>
  )
}
