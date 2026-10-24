import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../../api'
import { PublicLayout } from '../components/PublicComponents'

export default function EventsPage() {
  const [expos, setExpos] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api('/expo/getExpo?status=published')
      .then(setExpos)
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false))
  }, [])

  const filtered = expos.filter((expo) =>
    (expo.title + ' ' + expo.location).toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <PublicLayout
      eyebrow="FIND YOUR NEXT EXPERIENCE"
      title="Events worth showing up for."
      copy="Browse expos, trade shows, and gatherings built around curious people and meaningful connections."
    >
      <section className="public-section wrap">
        <div className="page-toolbar">
          <input
            className="page-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search events or locations"
            aria-label="Search events"
          />
          <span>{filtered.length} events found</span>
        </div>
        {error && (
          <p className="api-error" role="alert">
            {error}
          </p>
        )}
        {loading && <p>Loading events...</p>}
        {!loading && !filtered.length && <p className="empty-state">No published events yet.</p>}
        <div className="public-event-grid">
          {filtered.map((expo) => (
            <Link className="public-event-card" to={'/events/' + expo._id} key={expo._id}>
              <div className="event-card-art">
                {expo.imageUrl ? (
                  <img src={expo.imageUrl} alt={expo.title} />
                ) : (
                  <strong>{expo.theme}</strong>
                )}
                <span>{expo.status}</span>
              </div>
              <div className="event-card-body">
                <span className="eyebrow">{new Date(expo.startDate).toLocaleDateString()}</span>
                <h2>{expo.title}</h2>
                <p>{expo.location}</p>
                <p>{expo.description}</p>
                <div>Explore event →</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </PublicLayout>
  )
}
