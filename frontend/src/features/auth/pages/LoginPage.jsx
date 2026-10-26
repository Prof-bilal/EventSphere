import { useState } from 'react'
import { ArrowRight, Eye, EyeOff } from 'lucide-react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { api } from '../../../api'
import { useAuth } from '../../../state/AuthContext'

export default function LoginPage() {
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
  const [touched, setTouched] = useState({})
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  function update(event) {
    setValues({ ...values, [event.target.name]: event.target.value })
    setTouched({ ...touched, [event.target.name]: true })
  }

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())
  const passwordValid = values.password.length >= 6
  const formValid = emailValid && passwordValid
  const emailError = !values.email.trim() ? 'Email is required.' : !emailValid ? 'Enter a valid email address.' : ''
  const passwordError = !values.password ? 'Password is required.' : !passwordValid ? 'Password must be at least 6 characters.' : ''

  async function submit(event) {
    event.preventDefault()
    setError('')
    if (!formValid) return

    setBusy(true)
    try {
      const data = await api('/auth/login', 'POST', {
        email: values.email.trim().toLowerCase(),
        password: values.password,
      })
      localStorage.setItem('token', data.token)
      setUser(data.user)
      navigate('/dashboard')
    } catch (error) {
      setError(error.message)
    }
    setBusy(false)
  }

  return (
    <main className="auth-page auth-login">
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
          <h1>Good to see you again.</h1>
          <p className="auth-description">Sign in to pick up where you left off.</p>
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
              {touched.email && emailError && <small className="auth-validation">{emailError}</small>}
            </div>
            <div className="auth-field">
              <label htmlFor="password">Password</label>
              <div className="auth-input-wrap">
                <input
                  id="password"
                  name="password"
                  type={visible ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={values.password}
                  onChange={update}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setVisible(!visible)}
                  aria-label={visible ? 'Hide password' : 'Show password'}
                  title={visible ? 'Hide password' : 'Show password'}
                >
                  {visible ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {touched.password && passwordError && <small className="auth-validation">{passwordError}</small>}
            </div>

            <Link className="forgot-link" to="/forgot-password">
              Forgot your password?
            </Link>
            <button className="button button-orange auth-submit" disabled={busy || !formValid}>
              <span>{busy ? 'Please wait...' : 'Sign in'}</span>
              {!busy && <ArrowRight size={17} />}
            </button>
          </form>
          <p className="auth-switch">
            New to EventSphere? <Link to="/register">Create an account</Link>
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
