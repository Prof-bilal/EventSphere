import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../../api'

export default function BoothsPage() {
  const [booths, setBooths] = useState([])
  const [expos, setExpos] = useState([])
  const [expoId, setExpoId] = useState('')
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadBooths() {
    try {
      const list = await api('/booth/getBooth')
      setBooths(list)
      setExpos(await api('/expo/getExpo'))

      setSelected((current) =>
        current ? list.find((item) => item._id === current._id) || null : null,
      )
    } catch (error) {
      setError(error.message)
    }
    setLoading(false)
  }
  useEffect(() => {
    loadBooths()
    window.addEventListener('event-updated', loadBooths)
    return () => window.removeEventListener('event-updated', loadBooths)
  }, [])

  function selectBooth(booth) {
    setSelected(booth)
    api('/booth/' + booth._id + '/visit', 'POST').catch((error) => setError(error.message))
  }

  const filtered = booths.filter((booth) => !expoId || booth.expoId?._id === expoId)

  return (
    <div className="dash-view">
      <div className="page-intro">
        <div>
          <span className="dash-eyebrow">FLOOR PLAN</span>
          <h1>Make room for everyone.</h1>
          <p>Select a booth to view its location and details.</p>
        </div>
      </div>
      {error && (
        <p className="api-error" role="alert">
          {error}
        </p>
      )}
      <label className="workspace-field">
        <span>Expo</span>
        <select
          value={expoId}
          onChange={(event) => {
            setExpoId(event.target.value)
            setSelected(null)
          }}
        >
          <option value="">All expos</option>
          {expos.map((expo) => (
            <option key={expo._id} value={expo._id}>
              {expo.title}
            </option>
          ))}
        </select>
      </label>

      {loading && <p>Loading floor plan...</p>}
      {!loading && !filtered.length && <p className="empty-state">No booths found.</p>}
      <div className="booth-workspace">
        <section className="dash-card">
          <div className="booth-map">
            {filtered.map((booth) => (
              <button
                key={booth._id}
                className={booth.status === 'booked' ? 'occupied' : 'available'}
                onClick={() => selectBooth(booth)}
              >
                {booth.boothNumber}
                <small>{booth.status}</small>
              </button>
            ))}
          </div>
        </section>
        {selected && (
          <aside className="dash-card booth-detail">
            <h2>{selected.boothNumber}</h2>
            <span className="status-pill">{selected.status}</span>
            <p>
              {selected.expoId?.title} · {selected.floorName}
            </p>
            <p>
              {selected.size.width} × {selected.size.height} · Position {selected.position.x},{' '}
              {selected.position.y}
            </p>
            <p>
              {selected.boothType} · {selected.price}
            </p>
            {selected.exhibitorId && <p>Exhibitor: {selected.exhibitorId.name}</p>}
            <p>Products: {selected.products || 'Not added'}</p>
            <p>Services: {selected.services || 'Not added'}</p>
            <p>Staff: {selected.staff || 'Not added'}</p>
            {selected.exhibitorId && (
              <Link
                className="text-link"
                to={'/attendee/messages?userId=' + selected.exhibitorId._id}
              >
                Contact exhibitor
              </Link>
            )}
          </aside>
        )}
      </div>
    </div>
  )
}
