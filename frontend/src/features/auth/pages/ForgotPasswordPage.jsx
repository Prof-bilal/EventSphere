import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { api } from '../../../api'
import { useAuth } from '../../../state/AuthContext'

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { setUser } = useAuth()
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: params.get('role') === 'exhibitor' ? 'exhibitor' : 'attendee',
  })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [touched, setTouched] = useState(false)

  function update(event) {
    setValues({ ...values, [event.target.name]: event.target.value })
    setTouched(true)
  }

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())
  const emailError = !values.email.trim() ? 'Email is required.' : !emailValid ? 'Enter a valid email address.' : ''

  async function submit(event) {
    event.preventDefault()
    setError('')
    if (!emailValid) return

    setBusy(true)
    try {
      await api('/auth/forgot-password', 'POST', { email: values.email.trim().toLowerCase() })
      navigate('/reset-password/sent')
    } catch (error) {
      setError(error.message)
    }
    setBusy(false)
  }

  return (
    <main className="auth-page auth-forgot">
      <div className="auth-form-side">
        <header className="auth-header">
          <Link className="brand" to="/">
            EventSphere
          </Link>
          <Link className="auth-back" to="/">
            Back to home
          </Link>
        </header>
        <div className="auth-form-content">
          <span className="eyebrow">
            <span className="status-dot" />
            YOUR EVENT WORKSPACE
          </span>
          <h1>Let’s get you back in.</h1>
          <p className="auth-description">Enter your email to request a password reset link.</p>
          {error && (
            <div className="auth-alert" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={submit} noValidate>
            <div className="auth-field">
              <label htmlFor="email">Email address</label>
              <div className="auth-input-wrap">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={values.email}
                  onChange={update}
                />
              </div>
              {touched && emailError && <small className="auth-validation">{emailError}</small>}
            </div>

            <button className="button button-orange auth-submit" disabled={busy || !emailValid}>
              {busy ? 'Please wait...' : 'Send reset link'}
            </button>
          </form>
          <p className="auth-switch">
            <Link to="/login">Back to sign in</Link>
          </p>
        </div>
        <footer className="auth-footer">
          <span>© {new Date().getFullYear()} EventSphere</span>
          <span>Bring people together.</span>
        </footer>
      </div>
      <aside className="auth-story">
        <div className="auth-story-image">
          <img src="/assets/expo-hall.png" alt="People coming together at a trade show" />
        </div>
        <div className="auth-story-content">
          <span className="eyebrow">GOOD PEOPLE. GREAT CONNECTIONS.</span>
          <h2>
            Every great event
            <br />
            starts with people.
          </h2>
          <p>Your plans, your connections, your next big moment. All in one place.</p>
          <div className="auth-story-rule" />
          <div className="auth-story-roles">
            <span>For the planners.</span>
            <span>For the brands.</span>
            <span>For the curious.</span>
          </div>
        </div>
      </aside>
    </main>
  )
}
