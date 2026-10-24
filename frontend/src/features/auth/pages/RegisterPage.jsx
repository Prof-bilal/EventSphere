import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { api } from '../../../api'
import { useAuth } from '../../../state/AuthContext'

export default function RegisterPage() {
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
  const [visible, setVisible] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  function update(event) {
    setValues({ ...values, [event.target.name]: event.target.value })
  }

  async function submit(event) {
    event.preventDefault()
    setError('')
    if (values.password !== values.confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(values.password)
    ) {
      setError(
        'Use at least 8 characters including uppercase, lowercase, a number, and a symbol (@$!%*?&).',
      )
      return
    }
    setBusy(true)
    try {
      await api('/auth/register', 'POST', {
        name: values.name.trim(),
        email: values.email.trim().toLowerCase(),
        password: values.password,
        role: values.role,
      })
      navigate('/verify-email?email=' + encodeURIComponent(values.email))
    } catch (error) {
      setError(error.message)
    }
    setBusy(false)
  }

  return (
    <main className="auth-page auth-register">
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
          <h1>Find your place. Make your mark.</h1>
          <p className="auth-description">Create an account for your side of the event.</p>
          {error && (
            <div className="auth-alert" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={submit}>
            <fieldset className="role-picker">
              <legend>I’m joining as an</legend>
              <div className="role-options">
                <label
                  className={values.role === 'attendee' ? 'role-option selected' : 'role-option'}
                >
                  <input
                    type="radio"
                    name="role"
                    value="attendee"
                    checked={values.role === 'attendee'}
                    onChange={update}
                  />
                  <strong>Attendee</strong>
                  <span>I’m here to discover</span>
                </label>
                <label
                  className={values.role === 'exhibitor' ? 'role-option selected' : 'role-option'}
                >
                  <input
                    type="radio"
                    name="role"
                    value="exhibitor"
                    checked={values.role === 'exhibitor'}
                    onChange={update}
                  />
                  <strong>Exhibitor</strong>
                  <span>I’m showcasing a brand</span>
                </label>
              </div>
            </fieldset>
            <div className="auth-field">
              <label htmlFor="name">Full name</label>
              <div className="auth-input-wrap">
                <input
                  id="name"
                  name="name"
                  autoComplete="name"
                  value={values.name}
                  onChange={update}
                  minLength={3}
                  maxLength={30}
                  required
                />
              </div>
            </div>
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
                  required
                />
              </div>
            </div>
            <div className="auth-field">
              <label htmlFor="password">Password</label>
              <div className="auth-input-wrap">
                <input
                  id="password"
                  name="password"
                  type={visible ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={values.password}
                  onChange={update}
                  minLength={8}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setVisible(!visible)}
                >
                  {visible ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            <div className="auth-field">
              <label htmlFor="confirmPassword">Confirm password</label>
              <div className="auth-input-wrap">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={values.confirmPassword}
                  onChange={update}
                  required
                />
              </div>
              <p className="field-hint">
                Use 8 or more characters with uppercase, lowercase, a number and a symbol (@$!%*?&).
              </p>
            </div>

            <button className="button button-orange auth-submit" disabled={busy}>
              {busy ? 'Please wait...' : 'Create account'}
            </button>
          </form>
          <p className="auth-switch">
            <Link to="/login">Back to sign in</Link>
          </p>
          <p className="field-hint">
            Exhibitor accounts need organizer approval before signing in.
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
