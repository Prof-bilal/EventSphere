import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FileText, MessageSquareText, Pencil, UserRound } from 'lucide-react'
import { api } from '../../../api'

export default function ApplicationsPage() {
  const [params] = useSearchParams()
  const [applications, setApplications] = useState([])
  const [expos, setExpos] = useState([])
  const [expoId, setExpoId] = useState(params.get('expoId') || '')
  const [documents, setDocuments] = useState([])
  const [editId, setEditId] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  async function loadApplications() {
    try {
      const data = await api('/exhibitorApplication/getMyApplications')
      setApplications(data.applications)
      setExpos(await api('/expo/getExpo?status=published'))
    } catch (error) {
      setError(error.message)
    }
    setLoading(false)
  }
  useEffect(() => {
    loadApplications()
  }, [])

  async function submit(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      const form = new FormData()
      Array.from(documents).forEach((file) => form.append('documents', file))
      await api(
        editId
          ? '/exhibitorApplication/updateApplication/' + editId
          : '/exhibitorApplication/create/' + expoId,
        editId ? 'PUT' : 'POST',
        form,
      )
      setMessage(editId ? 'Documents added to application.' : 'Application submitted.')
      setEditId('')
      setDocuments([])
      event.target.reset()
      window.dispatchEvent(new Event('event-updated'))
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
          <h1>Find your place on the floor.</h1>
        </div>
      </div>
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
      <form className="workspace-form" onSubmit={submit}>
        <label className="workspace-field">
          <span>Expo</span>
          <select
            value={expoId}
            onChange={(event) => setExpoId(event.target.value)}
            required
            disabled={Boolean(editId)}
          >
            <option value="">Select expo</option>
            {expos.map((expo) => (
              <option key={expo._id} value={expo._id}>
                {expo.title}
              </option>
            ))}
          </select>
        </label>
        <label className="workspace-field">
          <span>Required documents</span>
          <input
            type="file"
            multiple
            required
            accept=".pdf,.doc,.docx,.jpg,.png,.webp"
            onChange={(event) => setDocuments(event.target.files)}
          />
        </label>
        <button className="dash-primary" disabled={busy}>
          {busy ? 'Submitting...' : editId ? 'Add documents' : 'Apply'}
        </button>
      </form>
      {loading && <p>Loading applications...</p>}
      {!loading && !applications.length && <p className="empty-state">No applications yet.</p>}
      {applications.map((item) => (
        <article className="application-record" key={item._id}>
          <div className="application-record-header"><div className="application-record-title"><span className="application-mark"><FileText size={18} /></span><div><span className={`application-status application-status-${item.ApplicationStatus?.toLowerCase().replace(/\s+/g, '-')}`}>{item.ApplicationStatus}</span><h3>{item.expoId?.title || 'Deleted expo'}</h3></div></div><span className="application-record-id">Your application</span></div>
          <div className="application-record-details"><span><UserRound size={14} /> {item.exhibitorId?.name || 'Your company profile'}</span>{item.remarks && <span><MessageSquareText size={14} /> {item.remarks}</span>}</div>
          {item.ApplicationStatus === 'Applied' && (
            <div className="application-edit-row"><button className="application-edit-button" onClick={() => {
                setEditId(item._id)
                setExpoId(item.expoId._id)
                window.scrollTo(0, 0)
              }}><Pencil size={14} /> Add documents to this application</button></div>
          )}
          <div className="application-documents"><span className="dash-eyebrow">YOUR DOCUMENTS</span><div className="application-document-list">{(item.submittedDocuments || []).map((path, index) => <a className="application-document" key={path} href={path} target="_blank" rel="noreferrer"><FileText size={16} /><span><strong>Document {index + 1}</strong><small>Open document ↗</small></span></a>)}</div></div>
        </article>
      ))}
    </div>
  )
}
