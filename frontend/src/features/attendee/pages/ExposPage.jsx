import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../../../api'
import { useAuth } from '../../../state/AuthContext'

export default function ExposPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [expos, setExpos] = useState([])
  const [registrations, setRegistrations] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [selectedExpo, setSelectedExpo] = useState(null)
  const [registrationDetails, setRegistrationDetails] = useState({
    phone: user?.phone || '',
    organization: '',
    jobTitle: '',
  })

  async function loadExpos() {
    try {
      setExpos(await api('/expo/getExpo?status=published'))
      setRegistrations(await api('/expoRegistration/mine'))
      setError('')
    } catch (error) {
      setError(error.message)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadExpos()
    window.addEventListener('event-updated', loadExpos)
    return () => window.removeEventListener('event-updated', loadExpos)
  }, [])

  function beginRegistration(expo) {
    setSelectedExpo(expo)
    setRegistrationDetails({ phone: user?.phone || '', organization: '', jobTitle: '' })
    setError('')
  }

  async function register(event) {
    event.preventDefault()
    if (!selectedExpo || !/^\d{10,15}$/.test(registrationDetails.phone)) return
    setBusy(true)
    try {
      const data = await api(
        '/expoRegistration/register/' + selectedExpo._id,
        'POST',
        registrationDetails,
      )
      navigate('/attendee/pass/' + data.registration._id)
      setSelectedExpo(null)
      await loadExpos()
      setMessage('Expo registration confirmed.')
    } catch (error) {
      setError(error.message)
    }
    setBusy(false)
  }

  async function cancel(id) {
    setBusy(true)
    try {
      await api('/expoRegistration/register/' + id, 'PUT')
      await loadExpos()
      setMessage('Expo registration cancelled.')
    } catch (error) {
      setError(error.message)
    }
    setBusy(false)
  }

  const filtered = expos.filter((expo) =>
    (expo.title + ' ' + expo.location).toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="dash-view">
      <div className="page-intro">
        <div>
          <span className="dash-eyebrow">EXPOS</span>
          <h1>Find your next event.</h1>
        </div>
      </div>
      <input
        className="page-search"
        aria-label="Search expos"
        placeholder="Search expos or locations"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
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
      {selectedExpo && (
        <form className="workspace-form attendee-registration-form" onSubmit={register} noValidate>
          <div className="card-heading">
            <div>
              <span className="dash-eyebrow">REGISTER FOR EXPO</span>
              <h2>{selectedExpo.title}</h2>
            </div>
            <button type="button" className="text-link" onClick={() => setSelectedExpo(null)}>
              Close
            </button>
          </div>
          <div className="form-grid">
            <label className="workspace-field">
              <span>Phone number</span>
              <input
                name="phone"
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
            <label className="workspace-field">
              <span>Organization (optional)</span>
              <input
                name="organization"
                value={registrationDetails.organization}
                onChange={(event) =>
                  setRegistrationDetails({ ...registrationDetails, organization: event.target.value })
                }
              />
            </label>
            <label className="workspace-field">
              <span>Job title (optional)</span>
              <input
                name="jobTitle"
                value={registrationDetails.jobTitle}
                onChange={(event) =>
                  setRegistrationDetails({ ...registrationDetails, jobTitle: event.target.value })
                }
              />
            </label>
          </div>
          <button
            className="dash-primary"
            disabled={busy || !/^\d{10,15}$/.test(registrationDetails.phone)}
          >
            {busy ? 'Registering...' : 'Confirm registration'}
          </button>
        </form>
      )}
      {loading && <p role="status">Loading expos...</p>}
      {!loading && !filtered.length && <p className="empty-state">No expos found.</p>}
      <div className="dash-grid">
        {filtered.map((expo) => (
          <article className="dash-card expo-record" key={expo._id}>
            {expo.imageUrl && <img className="record-image" src={expo.imageUrl} alt={expo.title} />}
            <span className="status-pill">{expo.status}</span>
            <h2>{expo.title}</h2>
            <p>{expo.description}</p>
            <p>
              {expo.location} · {new Date(expo.startDate).toLocaleDateString()}
            </p>
            <div className="record-actions">
              <Link className="text-link" to={'/events/' + expo._id}>
                View event
              </Link>
              <button
                className="dash-primary"
                type="button"
                disabled={busy || registrations.some((item) => item.expoId?._id === expo._id && item.status === 'registered')}
                onClick={() => beginRegistration(expo)}
              >
                {registrations.some(
                  (item) => item.expoId?._id === expo._id && item.status === 'registered',
                )
                  ? 'Registered'
                  : 'Register'}
              </button>
              {registrations.some((item) => item.expoId?._id === expo._id && item.status === 'registered') && (
                <button
                  type="button"
                  className="outline-button"
                  disabled={busy}
                  onClick={() =>
                    cancel(registrations.find((item) => item.expoId?._id === expo._id)?._id)
                  }
                >
                  Cancel
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
