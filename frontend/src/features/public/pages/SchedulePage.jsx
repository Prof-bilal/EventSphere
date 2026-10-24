import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { api } from '../../../api'
import { useAuth } from '../../../state/AuthContext'
import { PublicLayout } from '../components/PublicComponents'

export default function SchedulePage() {
  const { user } = useAuth()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const [sessions, setSessions] = useState([])
  const [bookmarks, setBookmarks] = useState([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const expoId = params.get('expoId') || ''

  useEffect(() => {
    async function loadSchedule() {
      try {
        setSessions(await api('/session/get-sessions' + (expoId ? '?expoId=' + expoId : '')))
        if (user?.role === 'attendee') setBookmarks(await api('/bookmark'))
      } catch (error) {
        setError(error.message)
      }
      setLoading(false)
    }
    loadSchedule()
    window.addEventListener('event-updated', loadSchedule)
    return () => window.removeEventListener('event-updated', loadSchedule)
  }, [expoId, user])

  async function bookmark(id) {
    if (!user) {
      navigate('/login')
      return
    }
    if (user.role !== 'attendee') {
      setError('Use an attendee account to bookmark sessions.')
      return
    }
    setBusy(true)
    try {
      const saved = bookmarks.some((item) => item.sessionId?._id === id)
      await api('/bookmark/' + id, saved ? 'DELETE' : 'POST')
      setBookmarks(await api('/bookmark'))
    } catch (error) {
      setError(error.message)
    }
    setBusy(false)
  }

  return (
    <PublicLayout
      eyebrow="A DAY FULL OF POSSIBILITY"
      title="Make time for good ideas."
      copy="Explore the talks, workshops, and conversations on the schedule."
    >
      <section className="public-section wrap schedule-public-list">
        {error && (
          <p className="api-error" role="alert">
            {error}
          </p>
        )}
        {loading && <p>Loading schedule...</p>}
        {!loading && !sessions.length && <p className="empty-state">No sessions scheduled yet.</p>}
        {sessions.map((session) => (
          <article key={session._id}>
            <time>{session.startTime}</time>
            <div className="schedule-public-line" />
            <div>
              <span className="eyebrow">
                {session.sessionType} · {new Date(session.startDate).toLocaleDateString()}
              </span>
              <h2>{session.title}</h2>
              <p>
                {session.speakerName} · {session.location}
              </p>
            </div>
            <button disabled={busy} onClick={() => bookmark(session._id)}>
              {bookmarks.some((item) => item.sessionId?._id === session._id)
                ? 'Remove bookmark'
                : 'Bookmark'}
            </button>
          </article>
        ))}
      </section>
    </PublicLayout>
  )
}
