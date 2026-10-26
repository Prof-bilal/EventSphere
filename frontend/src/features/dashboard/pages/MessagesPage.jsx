import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api } from '../../../api'
import { useAuth } from '../../../state/AuthContext'

export default function MessagesPage() {
  const { user } = useAuth()
  const [params] = useSearchParams()
  const [contacts, setContacts] = useState([])
  const [receiverId, setReceiverId] = useState(params.get('userId') || '')
  const [messages, setMessages] = useState([])
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api('/message/contacts')
      .then(setContacts)
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    let active = true
    async function loadMessages() {
      if (!receiverId) {
        setMessages([])
        return
      }
      try {
        const data = await api('/message/conversation/' + receiverId)
        if (active) setMessages(data)
      } catch (error) {
        if (active) setError(error.message)
      }
    }
    loadMessages()
    window.addEventListener('event-updated', loadMessages)
    return () => {
      active = false
      window.removeEventListener('event-updated', loadMessages)
    }
  }, [receiverId])

  async function send(event) {
    event.preventDefault()
    if (!receiverId || !draft.trim()) return
    setBusy(true)
    setError('')
    try {
      await api('/message', 'POST', { receiverId, message: draft.trim() })
      setDraft('')
      setMessages(await api('/message/conversation/' + receiverId))
    } catch (error) {
      setError(error.message)
    }
    setBusy(false)
  }

  return (
    <div className="dash-view">
      <div className="page-intro">
        <div>
          <span className="dash-eyebrow">MESSAGES</span>
          <h1>Keep the conversation moving.</h1>
          <p>Contact organizers and exhibitors.</p>
        </div>
      </div>
      {error && <p className="api-error" role="alert">{error}</p>}
      {loading && <p>Loading contacts...</p>}
      <label className="workspace-field">
        <span>Contact</span>
        <select value={receiverId} onChange={(event) => setReceiverId(event.target.value)}>
          <option value="">Choose a person</option>
          {contacts.map((person) => <option key={person._id} value={person._id}>{person.name} · {person.role}</option>)}
        </select>
      </label>
      <div className="message-panel">
        <section>
          <div className="message-list">
            {!messages.length && <p className="empty-state">{receiverId ? 'No messages yet. Start the conversation.' : 'Select a contact.'}</p>}
            {messages.map((item) => (
              <article className={item.senderId === user._id ? 'message mine' : 'message'} key={item._id}>
                <strong>{item.senderId === user._id ? 'You' : contacts.find((person) => person._id === item.senderId)?.name}</strong>
                <p>{item.message}</p>
                <small>{new Date(item.createdAt).toLocaleString()}</small>
              </article>
            ))}
          </div>
          <form onSubmit={send}>
            <input aria-label="Message" placeholder="Write a message..." value={draft} onChange={(event) => setDraft(event.target.value)} maxLength={2000} required />
            <button className="dash-primary" disabled={busy || !receiverId}>{busy ? 'Sending...' : 'Send'}</button>
          </form>
        </section>
      </div>
    </div>
  )
}
