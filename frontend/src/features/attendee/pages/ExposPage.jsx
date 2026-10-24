import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../../api'

export default function ExposPage() {
  const [expos, setExpos] = useState([])
  const [registrations, setRegistrations] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  async function loadExpos() {
    try {
      setExpos(await api('/expo/getExpo?status=published'))
      setRegistrations(await api('/expoRegistration/mine'))
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

  async function register(expoId) {
    setBusy(true)
    try {
      await api('/expoRegistration/register/' + expoId, 'POST')
      await loadExpos()
      setMessage('Expo registration confirmed.')
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
          <h1>Find your next event.</h1>
        </div>
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
              <button
                className="dash-primary"
                disabled={
                  busy ||
                  registrations.some(
                    (item) => item.expoId?._id === expo._id && item.status === 'registered',
                  )
                }
                onClick={() => register(expo._id)}
              >
                {registrations.some(
                  (item) => item.expoId?._id === expo._id && item.status === 'registered',
                )
                  ? 'Registered'
                  : 'Register'}
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
