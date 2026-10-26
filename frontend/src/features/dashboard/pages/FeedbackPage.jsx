import { useEffect, useState } from 'react'
import { api } from '../../../api'
import { useAuth } from '../../../state/AuthContext'
import { roleDashboardConfig } from '../config'

export default function FeedbackPage() {
  const { user } = useAuth()
  const role = user?.role === 'admin' ? 'organizer' : user?.role
  const config = roleDashboardConfig[role]?.feedback
  const [feedback, setFeedback] = useState([])
  const [expos, setExpos] = useState([])
  const [values, setValues] = useState({ expoId: '', category: 'suggestion', rating: '5', comment: '' })
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function loadFeedback() {
    try {
      setFeedback(await api(config.listEndpoint))
      setExpos(await api('/expo/getExpo'))
    } catch (error) {
      setError(error.message)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadFeedback()
  }, [config.listEndpoint])

  function update(event) {
    setValues({ ...values, [event.target.name]: event.target.value })
  }

  async function submit(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      await api('/feedback', 'POST', values)
      setValues({ ...values, comment: '' })
      setMessage('Feedback submitted.')
      await loadFeedback()
    } catch (error) {
      setError(error.message)
    }
    setBusy(false)
  }

  async function updateStatus(id, status) {
    try {
      await api('/feedback/' + id + '/status', 'PUT', { status })
      await loadFeedback()
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <div className="dash-view">
      <div className="page-intro"><div><span className="dash-eyebrow">FEEDBACK & SUPPORT</span><h1>Make the next experience better.</h1></div></div>
      {error && <p className="api-error" role="alert">{error}</p>}
      {message && <p className="api-message" role="status">{message}</p>}
      <form className="workspace-form" onSubmit={submit}>
        <div className="form-grid">
          <label className="workspace-field"><span>Expo</span><select name="expoId" value={values.expoId} onChange={update} required><option value="">Select expo</option>{expos.map((expo) => <option key={expo._id} value={expo._id}>{expo.title}</option>)}</select></label>
          <label className="workspace-field"><span>Category</span><select name="category" value={values.category} onChange={update}><option value="suggestion">Suggestion</option><option value="complaint">Complaint</option><option value="technical">Technical issue</option></select></label>
          <label className="workspace-field"><span>Rating</span><select name="rating" value={values.rating} onChange={update}>{[1, 2, 3, 4, 5].map((value) => <option key={value}>{value}</option>)}</select></label>
          <label className="workspace-field"><span>Message</span><textarea name="comment" value={values.comment} onChange={update} required minLength={3} maxLength={1000} rows={4} /></label>
        </div>
        <button className="dash-primary" disabled={busy}>{busy ? 'Sending...' : 'Submit feedback'}</button>
      </form>
      {loading && <p>Loading feedback...</p>}
      {!loading && !feedback.length && <p className="empty-state">No feedback yet.</p>}
      {feedback.map((item) => (
        <article className="dash-card" key={item._id}>
          <span className="status-pill">{item.status}</span>
          <h3>{item.expoId?.title || 'Deleted expo'}</h3>
          <p>{item.comment}</p>
          <small>{item.category} · Rating {item.rating || 'Not provided'}{item.userId?.name ? ` · ${item.userId.name}` : ''}</small>
          {config.canModerate && <select aria-label="Feedback status" value={item.status} onChange={(event) => updateStatus(item._id, event.target.value)}><option value="new">New</option><option value="in-progress">In progress</option><option value="resolved">Resolved</option></select>}
        </article>
      ))}
    </div>
  )
}
