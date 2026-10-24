import { useState } from 'react'
import { api } from '../../../api'
import { useAuth } from '../../../state/AuthContext'

export default function NotificationsPage() {
  const { notifications, setNotifications } = useAuth()
  const [error, setError] = useState('')

  async function markRead(id) {
    try {
      await api('/notification/' + id + '/read', 'PUT')
      setNotifications((items) =>
        items.map((item) => (item._id === id ? { ...item, isRead: true } : item)),
      )
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <div className="dash-view">
      <div className="page-intro">
        <div>
          <span className="dash-eyebrow">UPDATES</span>
          <h1>Keep up with your event.</h1>
        </div>
      </div>
      {error && (
        <p className="api-error" role="alert">
          {error}
        </p>
      )}
      {!notifications.length && <p className="empty-state">No notifications yet.</p>}
      <section className="dash-card">
        {notifications.map((item) => (
          <article className="activity-row" key={item._id}>
            <div>
              <strong>{item.title}</strong>
              <p>{item.message}</p>
              <small>{new Date(item.createdAt).toLocaleString()}</small>
            </div>
            <button
              className="outline-button"
              disabled={item.isRead}
              onClick={() => markRead(item._id)}
            >
              {item.isRead ? 'Read' : 'Mark as read'}
            </button>
          </article>
        ))}
      </section>
    </div>
  )
}
