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
        <Link className="dash-primary" to="/dashboard/expos/new">
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
      <div className="management-table-wrap">
        <table className="management-table">
          <thead><tr><th>Expo</th><th>Location & date</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.map((expo) => (
              <tr key={expo._id}>
                <td><div className="management-event"><span className="management-event-thumb">{expo.imageUrl ? <img src={expo.imageUrl} alt="" /> : expo.title.slice(0, 1)}</span><div><strong>{expo.title}</strong><small>{expo.description || 'No description added.'}</small></div></div></td>
                <td><div className="management-meta"><strong>{expo.location}</strong><small>{new Date(expo.startDate).toLocaleDateString()} – {new Date(expo.endDate).toLocaleDateString()}</small></div></td>
                <td><span className={`management-status management-status-${expo.status}`}>{expo.status}</span></td>
                <td><div className="management-actions"><Link className="management-link" to={'/events/' + expo._id}>View event ↗</Link><Link className="management-button" to={'/dashboard/expos/' + expo._id + '/edit'}>Edit</Link><button className="management-button management-button-danger" disabled={busy} onClick={() => deleteExpo(expo._id)}>Delete</button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
