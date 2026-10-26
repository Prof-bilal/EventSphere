import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { MessageCircle, Send, UserRound } from 'lucide-react'
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

  const selectedContact = contacts.find((person) => person._id === receiverId)
  const initials = selectedContact?.name?.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase() || '?'

  return (
    <div className="dash-view messages-page">
      <div className="page-intro messages-intro">
        <div>
          <span className="dash-eyebrow">MESSAGES</span>
          <h1>Keep the conversation moving.</h1>
          <p>Contact organizers and exhibitors.</p>
        </div>
        <div className="messages-intro-mark"><MessageCircle size={22} /></div>
      </div>
      {error && <p className="api-error" role="alert">{error}</p>}
      {loading && <p>Loading contacts...</p>}
      <div className="messages-contact-bar">
        <label className="messages-contact-field">
          <span><UserRound size={14} /> Contact</span>
          <select value={receiverId} onChange={(event) => setReceiverId(event.target.value)}>
            <option value="">Choose a person</option>
            {contacts.map((person) => <option key={person._id} value={person._id}>{person.name} · {person.role}</option>)}
          </select>
        </label>
        {selectedContact && <div className="messages-selected-contact"><span>{initials}</span><div><strong>{selectedContact.name}</strong><small>{selectedContact.role}</small></div></div>}
      </div>
      <div className="message-panel messages-panel">
        <section>
          <div className="message-panel-header">
            {selectedContact ? <><div className="message-panel-avatar">{initials}</div><div><strong>{selectedContact.name}</strong><span>{selectedContact.role} · Your conversation</span></div></> : <><MessageCircle size={18} /><div><strong>Choose a contact</strong><span>Your conversations will appear here.</span></div></>}
          </div>
          <div className="message-list">
            {!messages.length && <div className="message-empty"><MessageCircle size={23} /><strong>{receiverId ? 'No messages yet.' : 'Select a contact to begin.'}</strong><p>{receiverId ? 'Send the first message and start the conversation.' : 'Choose an organizer or exhibitor above to view your conversation.'}</p></div>}
            {messages.map((item) => (
              <article className={item.senderId === user._id ? 'message mine' : 'message'} key={item._id}>
                <strong>{item.senderId === user._id ? 'You' : contacts.find((person) => person._id === item.senderId)?.name}</strong>
                <p>{item.message}</p>
                <small>{new Date(item.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</small>
              </article>
            ))}
          </div>
          <form className="message-composer" onSubmit={send}>
            <input aria-label="Message" placeholder={receiverId ? 'Write a message...' : 'Choose a contact first'} value={draft} onChange={(event) => setDraft(event.target.value)} maxLength={2000} required disabled={!receiverId} />
            <button className="message-send" disabled={busy || !receiverId || !draft.trim()}>{busy ? 'Sending...' : 'Send'} <Send size={15} /></button>
          </form>
        </section>
      </div>
    </div>
  )
}
