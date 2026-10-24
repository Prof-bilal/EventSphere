import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../../api'

export default function ExposPage() {
  const [expos, setExpos] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  async function loadExpos() {
    try {
      setExpos(await api('/expo/getExpo'))

      setError('')
    } catch (error) {
      setError(error.message)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadExpos()
    window.addEventListener('event-updated', loadExpos)
    return () => window.removeEventListener('event-updated', loadExpos)
  }, [])

  async function deleteExpo(id) {
    if (!window.confirm('Delete this expo?')) return
    setBusy(true)
    try {
      await api('/expo/deleteExpo/' + id, 'DELETE')
      await loadExpos()
      setMessage('Expo deleted.')
    } catch (error) {
      setError(error.message)
    }
    setBusy(false)
  }

  const filtered = expos.filter((expo) =>
    (expo.title + ' ' + expo.location).toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="dash-view">
      <div className="page-intro">
        <div>
          <span className="dash-eyebrow">EXPOS</span>
          <h1>Bring your next event to life.</h1>
        </div>
        <Link className="dash-primary" to="/organizer/expos/new">
          Create expo
        </Link>
      </div>
      <input
        className="page-search"
        aria-label="Search expos"
        placeholder="Search expos or locations"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      {error && (
        <p className="api-error" role="alert">
          {error}
        </p>
      )}
      {message && (
        <p className="api-message" role="status">
          {message}
        </p>
      )}
      {loading && <p role="status">Loading expos...</p>}
      {!loading && !filtered.length && <p className="empty-state">No expos found.</p>}
      <div className="dash-grid">
        {filtered.map((expo) => (
          <article className="dash-card" key={expo._id}>
            {expo.imageUrl && <img className="record-image" src={expo.imageUrl} alt={expo.title} />}
            <span className="status-pill">{expo.status}</span>
            <h2>{expo.title}</h2>
            <p>{expo.description}</p>
            <p>
              {expo.location} · {new Date(expo.startDate).toLocaleDateString()}
            </p>
            <div className="record-actions">
              <Link className="text-link" to={'/events/' + expo._id}>
                View event
              </Link>
              <Link className="outline-button" to={'/organizer/expos/' + expo._id + '/edit'}>
                Edit
              </Link>
              <button
                className="danger-button"
                disabled={busy}
                onClick={() => deleteExpo(expo._id)}
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
