import { useEffect, useState } from 'react'
import { api } from '../../../api'

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([])
  const [remarks, setRemarks] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function loadApplications() {
    try {
      const data = await api('/exhibitorApplication/getApplications')
      setApplications(data.getApplications)
    } catch (error) {
      setError(error.message)
    }
    setLoading(false)
  }
  useEffect(() => {
    loadApplications()
  }, [])

  async function review(id, approved) {
    setBusy(true)
    try {
      await api(
        '/exhibitorApplication/' + (approved ? 'approveApplication/' : 'rejectApplication/') + id,
        'PUT',
        { remarks },
      )
      await loadApplications()
    } catch (error) {
      setError(error.message)
    }
    setBusy(false)
  }

  return (
    <div className="dash-view">
      <div className="page-intro">
        <div>
          <span className="dash-eyebrow">APPLICATIONS</span>
          <h1>Bring the right exhibitors together.</h1>
        </div>
      </div>
      {error && (
        <p className="api-error" role="alert">
          {error}
        </p>
      )}
      <label className="workspace-field">
        <span>Review remarks</span>
        <input
          value={remarks}
          onChange={(event) => setRemarks(event.target.value)}
          placeholder="Optional feedback for the exhibitor"
        />
      </label>
      {loading && <p>Loading applications...</p>}
      {!loading && !applications.length && <p className="empty-state">No applications yet.</p>}
      {applications.map((item) => (
        <article className="dash-card" key={item._id}>
          <span className="status-pill">{item.ApplicationStatus}</span>
          <h3>{item.expoId?.title || 'Deleted expo'}</h3>
          <p>{item.exhibitorId?.name}</p>
          <p>{item.remarks}</p>
          <div className="record-actions">
            {item.submittedDocuments.map((path, index) => (
              <a className="text-link" key={path} href={path} target="_blank" rel="noreferrer">
                Document {index + 1}
              </a>
            ))}
          </div>
          {item.ApplicationStatus === 'Applied' && (
            <div className="record-actions">
              <button
                className="dash-primary"
                disabled={busy}
                onClick={() => review(item._id, true)}
              >
                Approve
              </button>
              <button
                className="danger-button"
                disabled={busy}
                onClick={() => review(item._id, false)}
              >
                Reject
              </button>
            </div>
          )}
        </article>
      ))}
    </div>
  )
}
