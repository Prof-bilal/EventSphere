import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { api } from '../../../api'
import { useAuth } from '../../../state/AuthContext'

export default function ResetPasswordPage() {
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
  const [confirmVisible, setConfirmVisible] = useState(false)
  const [touched, setTouched] = useState({})
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  function update(event) {
    setValues({ ...values, [event.target.name]: event.target.value })
    setTouched({ ...touched, [event.target.name]: true })
  }

  const passwordValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(values.password)
  const passwordsMatch = values.password === values.confirmPassword && values.confirmPassword.length > 0
  const passwordError = !values.password ? 'Password is required.' : !passwordValid ? 'Use 8+ characters with uppercase, lowercase, number, and symbol.' : ''
  const confirmError = !values.confirmPassword ? 'Please confirm your password.' : !passwordsMatch ? 'Passwords do not match.' : ''

  async function submit(event) {
    event.preventDefault()
    setError('')
    if (!passwordValid || !passwordsMatch || !params.get('token')) return

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
      await api('/auth/reset-password', 'POST', {
        token: params.get('token'),
        newPassword: values.password,
        confirmPassword: values.confirmPassword,
      })
      navigate('/reset-password/success')
    } catch (error) {
      setError(error.message)
    }
    setBusy(false)
  }

  return (
    <main className="auth-page auth-reset">
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
          <h1>A new password. A fresh start.</h1>
          <p className="auth-description">Choose a new password for your account.</p>
          {error && (
            <div className="auth-alert" role="alert">
              {error}
            </div>
          )}
          {!params.get('token') && (
            <p className="api-error">
              Open the reset link from your email, or{' '}
              <Link to="/forgot-password">request a new link</Link>.
            </p>
          )}
          <form onSubmit={submit} noValidate>
            <div className="auth-field">
              <label htmlFor="password">New password</label>
              <div className="auth-input-wrap">
                <input
                  id="password"
                  name="password"
                  type={visible ? 'text' : 'password'}
                  autoComplete="new-password"
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
            <div className="auth-field">
              <label htmlFor="confirmPassword">Confirm password</label>
              <div className="auth-input-wrap">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={confirmVisible ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={values.confirmPassword}
                  onChange={update}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setConfirmVisible(!confirmVisible)}
                  aria-label={confirmVisible ? 'Hide confirmed password' : 'Show confirmed password'}
                  title={confirmVisible ? 'Hide confirmed password' : 'Show confirmed password'}
                >
                  {confirmVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {touched.confirmPassword && confirmError && <small className="auth-validation">{confirmError}</small>}
              <p className="field-hint">
                Use 8 or more characters with uppercase, lowercase, a number and a symbol (@$!%*?&).
              </p>
            </div>

            <button
              className="button button-orange auth-submit"
              disabled={busy || !params.get('token') || !passwordValid || !passwordsMatch}
            >
              {busy ? 'Please wait...' : 'Reset password'}
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
