import { useEffect, useState } from 'react'
import { api } from '../../../api'
import { useAuth } from '../../../state/AuthContext'
import { roleDashboardConfig } from '../config'

export default function NotificationsPage() {
  const { user, notifications, setNotifications } = useAuth()
  const role = user?.role === 'admin' ? 'organizer' : user?.role
  const canSend = roleDashboardConfig[role]?.canSendNotifications
  const [error, setError] = useState('')
  const [users, setUsers] = useState([])
  const [values, setValues] = useState({ userId: '', title: '', message: '' })
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState('')

  useEffect(() => {
    if (!canSend) return
    api('/auth/users').then(setUsers).catch((error) => setError(error.message))
  }, [canSend])

  async function send(event) {
    event.preventDefault()
    setBusy(true)
    try {
      await api('/notification', 'POST', { ...values, type: 'event' })
      setResult('Notification sent.')
      setValues({ userId: '', title: '', message: '' })
    } catch (error) {
      setError(error.message)
    }
    setBusy(false)
  }

  async function markRead(id) {
    try {
      await api('/notification/' + id + '/read', 'PUT')
      setNotifications((items) => items.map((item) => (item._id === id ? { ...item, isRead: true } : item)))
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <div className="dash-view">
      <div className="page-intro"><div><span className="dash-eyebrow">UPDATES</span><h1>Keep up with your event.</h1></div></div>
      {error && <p className="api-error" role="alert">{error}</p>}
      {result && <p className="api-message" role="status">{result}</p>}
      {canSend && (
        <form className="workspace-form" onSubmit={send}>
          <h2>Send an update</h2>
          <label className="workspace-field"><span>Recipient</span><select value={values.userId} onChange={(event) => setValues({ ...values, userId: event.target.value })} required><option value="">Select user</option>{users.map((person) => <option key={person._id} value={person._id}>{person.name} · {person.role}</option>)}</select></label>
          <label className="workspace-field"><span>Title</span><input value={values.title} onChange={(event) => setValues({ ...values, title: event.target.value })} required /></label>
          <label className="workspace-field"><span>Message</span><textarea value={values.message} onChange={(event) => setValues({ ...values, message: event.target.value })} required /></label>
          <button className="dash-primary" disabled={busy}>{busy ? 'Sending...' : 'Send notification'}</button>
        </form>
      )}
      {!notifications.length && <p className="empty-state">No notifications yet.</p>}
      <section className="dash-card">
        {notifications.map((item) => <article className="activity-row" key={item._id}><div><strong>{item.title}</strong><p>{item.message}</p><small>{new Date(item.createdAt).toLocaleString()}</small></div><button className="outline-button" disabled={item.isRead} onClick={() => markRead(item._id)}>{item.isRead ? 'Read' : 'Mark as read'}</button></article>)}
      </section>
    </div>
  )
}
