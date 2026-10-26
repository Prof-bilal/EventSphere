import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Bookmark, CalendarDays, Ticket, X } from 'lucide-react'
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
    <div className="dash-view bookmarks-page">
      <div className="page-intro bookmarks-intro">
        <div>
          <span className="dash-eyebrow">MY PLANS</span>
          <h1>Your event, your way.</h1>
          <p>Keep every registration, pass, and saved session in one place.</p>
        </div>
      </div>
      {error && (
        <p className="api-error" role="alert">
          {error}
        </p>
      )}
      {loading && <p>Loading your plans...</p>}
      <div className="bookmarks-grid">
        <section className="bookmarks-panel bookmarks-panel-wide">
          <div className="bookmarks-panel-header">
            <div className="bookmarks-panel-heading">
              <span className="bookmarks-panel-icon"><Ticket size={17} /></span>
              <div>
                <span className="dash-eyebrow">YOUR PASSES</span>
                <h2>Registered expos</h2>
              </div>
            </div>
            <span className="bookmarks-count">{registrations.length}</span>
          </div>
          {!registrations.length && (
            <div className="bookmarks-empty">
              <Ticket size={20} />
              <strong>No expo registrations yet.</strong>
              <p>Find an event and reserve your place to see your pass here.</p>
            </div>
          )}
          {!!registrations.length && (
            <div className="plan-list">
              {registrations.map((item) => (
                <article className="plan-item" key={item._id}>
                  <div className="plan-item-main">
                    <span className={`plan-status plan-status-${item.status}`}>{item.status}</span>
                    <strong>{item.expoId?.title || 'Deleted expo'}</strong>
                    <p>Registration <b>#{item.registrationNumber}</b></p>
                  </div>
                  {item.status === 'registered' && (
                    <div className="plan-item-actions">
                      <Link className="plan-pass-link" to={`/attendee/pass/${item._id}`}>
                        View / print pass <ArrowUpRight size={15} />
                      </Link>
                      <button className="plan-cancel" type="button" disabled={busy} onClick={() => cancel(item._id)}>
                        <X size={15} />
                        Cancel
                      </button>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
        <section className="bookmarks-panel">
          <div className="bookmarks-panel-header">
            <div className="bookmarks-panel-heading">
              <span className="bookmarks-panel-icon"><CalendarDays size={17} /></span>
              <div>
                <span className="dash-eyebrow">YOUR SCHEDULE</span>
                <h2>Registered sessions</h2>
              </div>
            </div>
            <span className="bookmarks-count">{sessions.length}</span>
          </div>
          {!sessions.length && <p className="bookmarks-muted">No registered sessions yet.</p>}
          {!!sessions.length && (
            <div className="compact-plan-list">
              {sessions.map((item) => (
                <article className="compact-plan-item" key={item._id}>
                  <div>
                    <strong>{item.sessionId?.title || 'Deleted session'}</strong>
                    <p>{item.sessionId?.startTime || 'Time to be announced'} · {item.sessionId?.location || 'Location to be announced'}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
          <Link className="bookmarks-panel-link" to="/dashboard/sessions">
            Manage session registrations <ArrowUpRight size={15} />
          </Link>
        </section>
        <section className="bookmarks-panel">
          <div className="bookmarks-panel-header">
            <div className="bookmarks-panel-heading">
              <span className="bookmarks-panel-icon"><Bookmark size={17} /></span>
              <div>
                <span className="dash-eyebrow">SAVED FOR LATER</span>
                <h2>Bookmarked sessions</h2>
              </div>
            </div>
            <span className="bookmarks-count">{bookmarks.length}</span>
          </div>
          {!bookmarks.length && <p className="bookmarks-muted">No bookmarks yet.</p>}
          {!!bookmarks.length && (
            <div className="compact-plan-list">
              {bookmarks.map((item) => (
                <article className="compact-plan-item" key={item._id}>
                  <div>
                    <strong>{item.sessionId?.title || 'Deleted session'}</strong>
                    <p>{item.sessionId?.startTime || 'Time to be announced'} · {item.sessionId?.location || 'Location to be announced'}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
          <Link className="bookmarks-panel-link" to="/dashboard/sessions">
            Browse sessions <ArrowUpRight size={15} />
          </Link>
        </section>
      </div>
    </div>
  )
}
