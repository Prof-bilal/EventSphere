import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api } from '../../../api'

export default function AuthStatusPage({ type }) {
  const [params] = useSearchParams()
  const [email, setEmail] = useState(params.get('email') || '')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [verified, setVerified] = useState(false)
  const token = params.get('token')

  useEffect(() => {
    if (type !== 'verify' || !token) return
    let active = true
    setBusy(true)
    api('/auth/verify-email?token=' + encodeURIComponent(token))
      .then(() => {
        if (active) setVerified(true)
      })
      .catch((error) => {
        if (active) setError(error.message)
      })
      .finally(() => {
        if (active) setBusy(false)
      })
    return () => {
      active = false
    }
  }, [type, token])

  async function resend(event) {
    event.preventDefault()
    setBusy(true)
    try {
      const data = await api('/auth/resend-verification', 'POST', { email })
      setMessage(data.message)
      setError('')
    } catch (error) {
      setError(error.message)
    }
    setBusy(false)
  }

  let title = 'Check your inbox.'
  let copy =
    'Open the verification link in your email. Exhibitor accounts also need organizer approval.'
  if (verified || type === 'verified') {
    title = 'Email verified.'
    copy = 'Your email is confirmed. You can sign in once your account is approved.'
  }
  if (type === 'sent')
    copy = 'If an account exists for that email, a password reset link has been sent.'
  if (type === 'resetSuccess') {
    title = 'Password updated.'
    copy = 'Sign in with your new password.'
  }
  if (['expired', 'invalid', 'resetInvalid'].includes(type)) {
    title = 'This link is not active.'
    copy = 'Request a fresh email and open its link.'
  }

  return (
    <main className="auth-page auth-status-page">
      <div className="auth-form-side">
        <header className="auth-header">
          <Link className="brand" to="/">
            EventSphere
          </Link>
          <Link to="/">Back to home</Link>
        </header>
        <div className="auth-form-content">
          <span className="eyebrow">YOUR ACCOUNT</span>
          <h1>{busy ? 'Please wait...' : title}</h1>
          <p className="auth-description">{copy}</p>
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
          {!verified && ['verify', 'expired', 'invalid'].includes(type) && (
            <form onSubmit={resend}>
              <label className="auth-field">
                Email address
                <div className="auth-input-wrap">
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </div>
              </label>
              <button className="button button-orange auth-submit" disabled={busy}>
                Resend verification email
              </button>
            </form>
          )}
          {type === 'resetInvalid' && (
            <Link className="button button-orange" to="/forgot-password">
              Request a reset link
            </Link>
          )}
          <p className="auth-switch">
            <Link to="/login">Back to sign in</Link>
          </p>
        </div>
      </div>
      <aside className="auth-story">
        <div className="auth-story-image">
          <img src="/assets/expo-hall.png" alt="Visitors at a trade show" />
        </div>
        <div className="auth-story-content">
          <span className="eyebrow">GOOD PEOPLE. GREAT CONNECTIONS.</span>
          <h2>
            Keep your place
            <br />
            in the story.
          </h2>
        </div>
      </aside>
    </main>
  )
}
