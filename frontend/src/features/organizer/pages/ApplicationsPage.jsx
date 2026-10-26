import { useEffect, useState } from 'react'
import { Check, FileText, MessageSquareText, UserRound } from 'lucide-react'
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
      {!!applications.length && <div className="application-table-wrap"><table className="application-table"><thead><tr><th>Expo</th><th>Exhibitor</th><th>Documents</th><th>Status</th><th>Review</th></tr></thead><tbody>{applications.map((item) => <tr key={item._id}><td><div className="application-table-expo"><span className="application-mark"><FileText size={16} /></span><div><strong>{item.expoId?.title || 'Deleted expo'}</strong>{item.remarks && <small><MessageSquareText size={12} /> {item.remarks}</small>}</div></div></td><td><span className="application-table-person"><UserRound size={14} /> {item.exhibitorId?.name || 'Unknown exhibitor'}</span></td><td><div className="application-table-documents">{(item.submittedDocuments || []).map((path, index) => <a key={path} href={path} target="_blank" rel="noreferrer"><FileText size={13} /> Document {index + 1}</a>)}</div></td><td><span className={`application-status application-status-${item.ApplicationStatus?.toLowerCase().replace(/\s+/g, '-')}`}>{item.ApplicationStatus}</span></td><td>{item.ApplicationStatus === 'Applied' ? <div className="application-table-actions"><button className="application-review-approve" disabled={busy} onClick={() => review(item._id, true)}><Check size={14} /> Approve</button><button className="application-review-reject" disabled={busy} onClick={() => review(item._id, false)}>Reject</button></div> : <span className="application-reviewed">Reviewed</span>}</td></tr>)}</tbody></table></div>}
    </div>
  )
}
