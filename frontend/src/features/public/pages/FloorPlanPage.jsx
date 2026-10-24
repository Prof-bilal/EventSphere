import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api } from '../../../api'
import { PublicLayout } from '../components/PublicComponents'

export default function FloorPlanPage() {
  const [params] = useSearchParams()
  const [booths, setBooths] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const expoId = params.get('expoId') || ''

  useEffect(() => {
    async function loadBooths() {
      try {
        setBooths(await api('/booth/public' + (expoId ? '?expoId=' + expoId : '')))
      } catch (error) {
        setError(error.message)
      }
      setLoading(false)
    }
    loadBooths()
    window.addEventListener('event-updated', loadBooths)
    return () => window.removeEventListener('event-updated', loadBooths)
  }, [expoId])

  return (
    <PublicLayout
      eyebrow="FIND YOUR WAY AROUND"
      title="There’s room for every idea."
      copy="Explore the floor plan and select a booth to see who is there."
    >
      <section className="public-section wrap public-floor">
        {error && (
          <p className="api-error" role="alert">
            {error}
          </p>
        )}
        {loading && <p>Loading floor plan...</p>}
        {!loading && !booths.length && <p className="empty-state">No booths added yet.</p>}
        <div className="floor-public-map">
          {booths.map((booth) => (
            <button
              key={booth._id}
              className={booth.status === 'booked' ? 'occupied' : 'available'}
              onClick={() => setSelected(booth)}
            >
              {booth.boothNumber}
            </button>
          ))}
        </div>
        {selected && (
          <article className="exhibitor-card">
            <h2>{selected.boothNumber}</h2>
            <p>
              {selected.expoId?.title} · {selected.floorName} · {selected.status}
            </p>
            <p>
              Position: {selected.position.x}, {selected.position.y} · Size: {selected.size.width} ×{' '}
              {selected.size.height}
            </p>
            <p>{selected.exhibitorId?.name || 'Available booth'}</p>
            <p>{selected.products}</p>
            <p>{selected.services}</p>
            {selected.exhibitorId?.email && (
              <a className="text-link" href={'mailto:' + selected.exhibitorId.email}>
                Contact exhibitor
              </a>
            )}
          </article>
        )}
      </section>
    </PublicLayout>
  )
}
