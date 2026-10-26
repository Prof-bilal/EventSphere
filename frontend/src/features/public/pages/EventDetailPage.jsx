import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api } from '../../../api'
import { useAuth } from '../../../state/AuthContext'
import { PublicLayout } from '../components/PublicComponents'

export default function EventDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [expo, setExpo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [registered, setRegistered] = useState(false)
  const [registration, setRegistration] = useState(null)
  const [registrationOpen, setRegistrationOpen] = useState(false)
  const [registrationDetails, setRegistrationDetails] = useState({
    phone: user?.phone || '',
    organization: '',
    jobTitle: '',
  })

  useEffect(() => {
    async function loadExpo() {
      try {
        const data = await api('/expo/getExpo/' + id)
        setExpo(data.getExpo)
      } catch (error) {
        setError(error.message)
      }
      setLoading(false)
    }
    loadExpo()
  }, [id])

  useEffect(() => {
    if (user?.role !== 'attendee') return
    api('/expoRegistration/register/' + id)
      .then((data) => {
        setRegistration(data)
        setRegistered(data.status === 'registered')
      })
      .catch(() => setRegistered(false))
  }, [id, user])

  function beginRegistration() {
    if (!user) {
      navigate('/login')
      return
    }
    if (user.role !== 'attendee') {
      setError('Sign in with an attendee account to register.')
      return
    }
    setRegistrationDetails({ phone: user.phone || '', organization: '', jobTitle: '' })
    setRegistrationOpen(true)
  }

  async function register(event) {
    event.preventDefault()
    if (!/^\d{10,15}$/.test(registrationDetails.phone)) return
    setBusy(true)
    try {
      const data = await api('/expoRegistration/register/' + id, 'POST', registrationDetails)
      setMessage(data.message)
      setRegistered(true)
      setRegistration(data.registration)
      setRegistrationOpen(false)
      navigate('/attendee/pass/' + data.registration._id)
    } catch (error) {
      setError(error.message)
    }
    setBusy(false)
  }

  async function cancelRegistration() {
    if (!registration) return
    setBusy(true)
    try {
      const data = await api('/expoRegistration/register/' + registration._id, 'PUT')
      setRegistration(data.registration)
      setRegistered(false)
      setMessage(data.message)
    } catch (error) {
      setError(error.message)
    }
    setBusy(false)
  }

  return (
    <PublicLayout
      eyebrow="EVENT DETAIL"
      title={expo?.title || 'Event details'}
      copy={expo ? expo.location + ' · ' + new Date(expo.startDate).toLocaleDateString() : ''}
    >
      <section className="public-section wrap">
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
        {loading && <p>Loading event...</p>}
        {expo && (
          <div className="detail-layout">
            <div>
              <div className="detail-art">
                {expo.imageUrl ? (
                  <img src={expo.imageUrl} alt={expo.title} />
                ) : (
                  <strong>{expo.theme}</strong>
                )}
              </div>
              <div className="detail-copy">
                <h2>{expo.theme}</h2>
                <p>{expo.description}</p>
              </div>
            </div>
            <aside className="detail-panel">
              <span className="eyebrow">YOUR VISIT</span>
              <h2>Plan your day.</h2>
              <div>
                {new Date(expo.startDate).toLocaleDateString()} –{' '}
                {new Date(expo.endDate).toLocaleDateString()}
              </div>
              <div>{expo.location}</div>
              <div>Capacity: {expo.capacity}</div>
              <div>
                Registration closes: {new Date(expo.registrationDeadline).toLocaleDateString()}
              </div>
              <button className="button button-orange" disabled={busy || registered} onClick={beginRegistration}>
                {registered ? 'Registered' : busy ? 'Registering...' : 'Register'}
              </button>
              {registered && (
                <button className="button event-cancel-button" disabled={busy} onClick={cancelRegistration}>
                  Cancel registration
                </button>
              )}
              {registrationOpen && !registered && (
                <form className="event-registration-form" onSubmit={register} noValidate>
                  <label>
                    <span>Phone number</span>
                    <input
                      type="tel"
                      pattern="[0-9]{10,15}"
                      value={registrationDetails.phone}
                      onChange={(event) =>
                        setRegistrationDetails({ ...registrationDetails, phone: event.target.value })
                      }
                      placeholder="03001234567"
                      required
                    />
                  </label>
                  <label>
                    <span>Organization (optional)</span>
                    <input
                      value={registrationDetails.organization}
                      onChange={(event) =>
                        setRegistrationDetails({ ...registrationDetails, organization: event.target.value })
                      }
                    />
                  </label>
                  <label>
                    <span>Job title (optional)</span>
                    <input
                      value={registrationDetails.jobTitle}
                      onChange={(event) =>
                        setRegistrationDetails({ ...registrationDetails, jobTitle: event.target.value })
                      }
                    />
                  </label>
                  <button className="button button-orange" disabled={busy || !/^\d{10,15}$/.test(registrationDetails.phone)}>
                    {busy ? 'Registering...' : 'Confirm registration'}
                  </button>
                </form>
              )}
              {registered && registration && (
                <Link className="text-link event-pass-link" to={`/attendee/pass/${registration._id}`}>
                  View / print your pass →
                </Link>
              )}
            </aside>
          </div>
        )}
      </section>
      <section className="detail-links wrap">
        <Link to="/exhibitors">Meet exhibitors →</Link>
        <Link to={'/schedule?expoId=' + id}>Explore schedule →</Link>
        <Link to={'/floor-plan?expoId=' + id}>View floor plan →</Link>
      </section>
    </PublicLayout>
  )
}
