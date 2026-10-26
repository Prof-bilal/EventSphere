import { useEffect, useState } from 'react'
import { Bell, CalendarCheck2, Check, Info, Send, ArrowUpRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../../api'
import { useAuth } from '../../../state/AuthContext'
import { roleDashboardConfig } from '../config'

export default function NotificationsPage() {
  const { user, notifications, setNotifications } = useAuth()
  const navigate = useNavigate()
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

  function notificationTarget(item) {
    const type = String(item.type || '').toLowerCase()
    const expoId = typeof item.relatedExpoId === 'string' ? item.relatedExpoId : item.relatedExpoId?._id

    if (type === 'message' || type.includes('message')) return '/dashboard/messages'
    if (type === 'session' || type.includes('session') || type === 'reminder') return '/dashboard/sessions'
    if (type === 'application' || type.includes('application')) return '/dashboard/applications'
    if (type === 'booth' || type.includes('booth')) return '/dashboard/booths'
    if (expoId && (type === 'expo' || type.includes('expo'))) return `/events/${expoId}`
    if (type === 'registration' || type.includes('registration')) return '/dashboard/bookmarks'
    if (type === 'account' || type.includes('account')) return '/dashboard/account'
    return '/dashboard/notifications'
  }

  async function openNotification(item) {
    if (!item.isRead) await markRead(item._id)
    navigate(notificationTarget(item))
  }

  function handleNotificationKeyDown(event, item) {
    if (event.target !== event.currentTarget) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      openNotification(item)
    }
  }

  function notificationIcon(type) {
    if (type === 'registration') return <CalendarCheck2 size={17} />
    if (type === 'system') return <Info size={17} />
    return <Bell size={17} />
  }

  return (
    <div className="dash-view notifications-page">
      <div className="page-intro notifications-intro">
        <div>
          <span className="dash-eyebrow">UPDATES</span>
          <h1>Keep up with your event.</h1>
          <p>Important updates, registrations, and event news — all in one place.</p>
        </div>
        <div className="notifications-intro-mark"><Bell size={22} /></div>
      </div>
      {error && <p className="api-error" role="alert">{error}</p>}
      {result && <p className="api-message" role="status">{result}</p>}
      {canSend && (
        <form className="notification-compose" onSubmit={send}>
          <div className="notification-compose-heading">
            <div><span className="dash-eyebrow">ORGANIZER TOOLS</span><h2>Send an update</h2></div>
            <Send size={18} />
          </div>
          <label className="workspace-field"><span>Recipient</span><select value={values.userId} onChange={(event) => setValues({ ...values, userId: event.target.value })} required><option value="">Select user</option>{users.map((person) => <option key={person._id} value={person._id}>{person.name} · {person.role}</option>)}</select></label>
          <label className="workspace-field"><span>Title</span><input value={values.title} onChange={(event) => setValues({ ...values, title: event.target.value })} required /></label>
          <label className="workspace-field"><span>Message</span><textarea value={values.message} onChange={(event) => setValues({ ...values, message: event.target.value })} required /></label>
          <button className="notification-send" disabled={busy}>{busy ? 'Sending...' : 'Send notification'} <Send size={15} /></button>
        </form>
      )}
      <section className="notification-feed">
        <div className="notification-feed-heading">
          <div><span className="dash-eyebrow">YOUR INBOX</span><h2>Recent updates</h2></div>
          <span className="notification-unread-count">{notifications.filter((item) => !item.isRead).length} unread</span>
        </div>
        {!notifications.length && <div className="notification-empty"><Bell size={20} /><strong>No notifications yet.</strong><p>New event updates will appear here.</p></div>}
        {!!notifications.length && <div className="notification-items">
          {notifications.map((item) => <article
            className={`notification-item notification-item-clickable ${item.isRead ? 'is-read' : 'is-unread'}`}
            key={item._id}
            role="link"
            tabIndex="0"
            aria-label={`Open notification: ${item.title}`}
            onClick={() => openNotification(item)}
            onKeyDown={(event) => handleNotificationKeyDown(event, item)}
          >
            <div className="notification-item-icon">{notificationIcon(item.type)}</div>
            <div className="notification-item-content">
              <div className="notification-item-topline"><span>{item.type || 'event'} update</span><time>{new Date(item.createdAt).toLocaleString()}</time></div>
              <strong>{item.title}</strong>
              <p>{item.message}</p>
            </div>
            <div className="notification-item-actions">
              <span className="notification-open-action">Open <ArrowUpRight size={14} /></span>
              <button className="notification-read-action" type="button" disabled={item.isRead} onClick={(event) => { event.stopPropagation(); markRead(item._id) }}>{item.isRead ? <><Check size={14} /> Read</> : 'Mark as read'}</button>
            </div>
          </article>)}
        </div>}
      </section>
    </div>
  )
}
