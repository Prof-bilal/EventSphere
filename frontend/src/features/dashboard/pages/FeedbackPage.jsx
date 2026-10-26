import { useEffect, useState } from 'react'
import { ArrowUpRight, CheckCircle2, MessageSquareText, Send, Star } from 'lucide-react'
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
    <div className="dash-view feedback-page">
      <div className="page-intro feedback-intro">
        <div>
          <span className="dash-eyebrow">FEEDBACK & SUPPORT</span>
          <h1>Make the next experience better.</h1>
          <p>Tell us what worked, what could improve, and what you want to see next.</p>
        </div>
        <div className="feedback-intro-mark"><MessageSquareText size={22} /></div>
      </div>
      {error && <p className="api-error" role="alert">{error}</p>}
      {message && <p className="api-message" role="status">{message}</p>}
      <div className="feedback-layout">
        <section className="feedback-compose">
          <div className="feedback-section-heading">
            <div>
              <span className="dash-eyebrow">SHARE YOUR THOUGHTS</span>
              <h2>How was your experience?</h2>
            </div>
            <span className="feedback-step">01 / 01</span>
          </div>
          <form className="feedback-form" onSubmit={submit}>
            <label className="feedback-field feedback-field-expo">
              <span>Which expo is this about?</span>
              <select name="expoId" value={values.expoId} onChange={update} required>
                <option value="">Select an expo</option>
                {expos.map((expo) => <option key={expo._id} value={expo._id}>{expo.title}</option>)}
              </select>
            </label>
            <fieldset className="feedback-field feedback-categories">
              <legend>What would you like to share?</legend>
              <div className="feedback-choice-grid">
                {[
                  ['suggestion', 'Suggestion'],
                  ['complaint', 'Complaint'],
                  ['technical', 'Technical issue'],
                ].map(([value, label]) => (
                  <button className={values.category === value ? 'feedback-choice selected' : 'feedback-choice'} type="button" key={value} onClick={() => setValues({ ...values, category: value })}>
                    <span>{label}</span>
                    {values.category === value && <CheckCircle2 size={15} />}
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset className="feedback-field feedback-rating">
              <legend>How would you rate it?</legend>
              <div className="rating-options">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button className={String(values.rating) === String(value) ? 'rating-option selected' : 'rating-option'} type="button" key={value} onClick={() => setValues({ ...values, rating: String(value) })} aria-label={`${value} out of 5 stars`}>
                    <Star size={18} fill={String(values.rating) === String(value) ? 'currentColor' : 'none'} />
                    <span>{value}</span>
                  </button>
                ))}
              </div>
            </fieldset>
            <label className="feedback-field feedback-message-field">
              <span>Your message</span>
              <textarea name="comment" value={values.comment} onChange={update} placeholder="Share a detail, idea, or moment that stood out..." required minLength={3} maxLength={1000} rows={6} />
              <small>{values.comment.length}/1000 characters</small>
            </label>
            <div className="feedback-form-footer">
              <p>Your feedback helps our team shape better events.</p>
              <button className="feedback-submit" disabled={busy || !values.expoId || values.comment.trim().length < 3}>
                {busy ? 'Sending...' : 'Submit feedback'}
                <Send size={16} />
              </button>
            </div>
          </form>
        </section>
        <aside className="feedback-aside">
          <span className="dash-eyebrow">A BETTER EVENT STARTS HERE</span>
          <h2>Small details make a big difference.</h2>
          <p>Whether it is the schedule, the venue, or a conversation you had, your perspective helps us improve the next experience.</p>
          <div className="feedback-aside-rule" />
          <div className="feedback-aside-note"><Star size={16} /><span>Honest, thoughtful feedback is always welcome.</span></div>
        </aside>
      </div>
      <section className="feedback-history">
        <div className="feedback-section-heading">
          <div><span className="dash-eyebrow">YOUR VOICE</span><h2>Previous feedback</h2></div>
          <span className="feedback-count">{feedback.length} {feedback.length === 1 ? 'entry' : 'entries'}</span>
        </div>
        {loading && <p className="feedback-empty">Loading feedback...</p>}
        {!loading && !feedback.length && <div className="feedback-empty"><MessageSquareText size={20} /><strong>No feedback yet.</strong><p>Your submitted feedback will appear here.</p></div>}
        {!loading && !!feedback.length && <div className="feedback-history-list">
          {feedback.map((item) => (
            <article className="feedback-history-item" key={item._id}>
              <div className="feedback-history-main">
                <div className="feedback-history-meta"><span className={`feedback-status feedback-status-${item.status}`}>{item.status}</span><span>{item.category}</span></div>
                <h3>{item.expoId?.title || 'Deleted expo'}</h3>
                <p>{item.comment}</p>
              </div>
              <div className="feedback-history-side">
                <span className="feedback-rating-value"><Star size={14} fill="currentColor" /> {item.rating || '—'} / 5</span>
                {config.canModerate ? <select aria-label="Feedback status" value={item.status} onChange={(event) => updateStatus(item._id, event.target.value)}><option value="new">New</option><option value="in-progress">In progress</option><option value="resolved">Resolved</option></select> : <ArrowUpRight size={17} />}
              </div>
            </article>
          ))}
        </div>}
      </section>
    </div>
  )
}
