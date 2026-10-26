import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../../api'

export default function ExposPage() {
  const [expos, setExpos] = useState([])
  const [applications, setApplications] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function loadExpos() {
    try {
      const [publishedExpos, myApplications] = await Promise.all([
        api('/expo/getExpo?status=published'),
        api('/exhibitorApplication/getMyApplications'),
      ])
      setExpos(publishedExpos)
      setApplications(myApplications.applications || [])

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

  const filtered = expos.filter((expo) =>
    (expo.title + ' ' + expo.location).toLowerCase().includes(search.toLowerCase()),
  )

  function applicationFor(expoId) {
    return applications.find((item) => (item.expoId?._id || item.expoId) === expoId)
  }

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
      <div className="management-table-wrap">
        <table className="management-table">
          <thead><tr><th>Expo</th><th>Location & date</th><th>Application</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.map((expo) => {
              const application = applicationFor(expo._id)
              return <tr key={expo._id}>
                <td><div className="management-event"><span className="management-event-thumb">{expo.imageUrl ? <img src={expo.imageUrl} alt="" /> : expo.title.slice(0, 1)}</span><div><strong>{expo.title}</strong><small>{expo.description || 'No description added.'}</small></div></div></td>
                <td><div className="management-meta"><strong>{expo.location}</strong><small>{new Date(expo.startDate).toLocaleDateString()} – {new Date(expo.endDate).toLocaleDateString()}</small></div></td>
                <td>{application?.ApplicationStatus ? <span className={`management-status management-status-${application.ApplicationStatus}`}>{application.ApplicationStatus}</span> : <span className="management-status management-status-open">Open</span>}</td>
                <td><div className="management-actions"><Link className="management-link" to={'/events/' + expo._id}>View event ↗</Link>{application?.ApplicationStatus ? <button className="management-button" disabled>{application.ApplicationStatus}</button> : <Link className="management-button management-button-primary" to={'/dashboard/applications?expoId=' + expo._id}>Apply</Link>}</div></td>
              </tr>
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
