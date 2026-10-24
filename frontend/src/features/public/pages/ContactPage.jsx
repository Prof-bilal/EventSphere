import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../../api'
import { useAuth } from '../../../state/AuthContext'
import { PublicLayout } from '../components/PublicComponents'

export default function ContactPage() {
  const { user } = useAuth()
  const [contacts, setContacts] = useState([])
  const [receiverId, setReceiverId] = useState('')
  const [message, setMessage] = useState('')
  const [result, setResult] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!user) return
    api('/message/contacts')
      .then((data) => {
        const organizers = data.filter((item) => item.role === 'admin')
        setContacts(organizers)
        setReceiverId(organizers[0]?._id || '')
      })
      .catch((error) => setError(error.message))
  }, [user])

  async function submit(event) {
    event.preventDefault()
    setBusy(true)
    try {
      await api('/message', 'POST', { receiverId, message })
      setResult('Your message has been sent to the organizer.')
      setMessage('')
      setError('')
    } catch (error) {
      setError(error.message)
    }
    setBusy(false)
  }

  return (
    <PublicLayout
      eyebrow="LET’S TALK ABOUT YOUR EVENT"
      title="Tell us what you’re bringing to life."
      copy="Contact an organizer for questions about your event."
    >
      <section className="public-section wrap contact-layout">
        <div>
          {error && (
            <p className="api-error" role="alert">
              {error}
            </p>
          )}
          {result && (
            <p className="api-message" role="status">
              {result}
            </p>
          )}
          {user ? (
            <form className="contact-form" onSubmit={submit}>
              <label>
                Organizer
                <select
                  value={receiverId}
                  onChange={(event) => setReceiverId(event.target.value)}
                  required
                >
                  <option value="">Select organizer</option>
                  {contacts.map((person) => (
                    <option key={person._id} value={person._id}>
                      {person.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Message
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  required
                  maxLength={2000}
                  rows="5"
                />
              </label>
              <button className="button button-orange" disabled={busy || !receiverId}>
                {busy ? 'Sending...' : 'Send message'}
              </button>
            </form>
          ) : (
            <p>
              <Link className="button button-orange" to="/login">
                Sign in to contact an organizer
              </Link>
            </p>
          )}
        </div>
        <aside className="contact-aside">
          <h2>Keep the conversation going.</h2>
          <p>Your conversations are available from the Messages page in your workspace.</p>
          <Link className="text-link" to="/events">
            Browse events →
          </Link>
        </aside>
      </section>
    </PublicLayout>
  )
}
