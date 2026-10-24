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

  async function register() {
    if (!user) {
      navigate('/login')
      return
    }
    if (user.role !== 'attendee') {
      setError('Sign in with an attendee account to register.')
      return
    }
    setBusy(true)
    try {
      const data = await api('/expoRegistration/register/' + id, 'POST')
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
              <button className="button button-orange" disabled={busy} onClick={register}>
                {busy ? 'Registering...' : 'Register for this expo'}
              </button>
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
