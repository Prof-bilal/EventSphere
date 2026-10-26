import { useEffect, useState } from 'react'
import { Building2, DollarSign, MapPin, Package, Save, UserRound } from 'lucide-react'
import { api } from '../../../api'
import { useAuth } from '../../../state/AuthContext'

export default function BoothsPage() {
  const { user } = useAuth()
  const [booths, setBooths] = useState([])
  const [expos, setExpos] = useState([])
  const [expoId, setExpoId] = useState('')
  const [selected, setSelected] = useState(null)
  const [details, setDetails] = useState({ products: '', services: '', staff: '' })
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

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
    setDetails({
      products: booth.products || '',
      services: booth.services || '',
      staff: booth.staff || '',
    })
  }

  async function request() {
    setBusy(true)
    try {
      const data = await api('/booth/' + selected._id + '/request', 'POST')
      setMessage(data.message)
      await loadBooths()
    } catch (error) {
      setError(error.message)
    }
    setBusy(false)
  }

  async function saveDetails(event) {
    event.preventDefault()
    setBusy(true)
    try {
      await api('/booth/' + selected._id + '/details', 'PUT', details)
      setMessage('Booth details saved.')
      await loadBooths()
    } catch (error) {
      setError(error.message)
    }
    setBusy(false)
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
      {message && (
        <p className="api-message" role="status">
          {message}
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
          <aside className="dash-card booth-detail booth-detail-redesigned exhibitor-booth-detail">
            <div className="booth-detail-header"><div><span className="dash-eyebrow">YOUR BOOTH</span><h2>{selected.boothNumber}</h2></div><span className={`booth-status booth-status-${selected.status}`}>{selected.status}</span></div>
            <div className="booth-detail-context"><span><Building2 size={14} /> {selected.expoId?.title || 'Selected expo'}</span><span><MapPin size={14} /> {selected.floorName}</span></div>
            <div className="booth-detail-stats"><div><Package size={15} /><span>Type<strong>{selected.boothType}</strong></span></div><div><MapPin size={15} /><span>Position<strong>{selected.position.x}, {selected.position.y}</strong></span></div><div><DollarSign size={15} /><span>Price<strong>{selected.price}</strong></span></div></div>
            <div className="booth-detail-info"><div><Package size={15} /><span>Size<strong>{selected.size.width} × {selected.size.height}</strong></span></div><div><UserRound size={15} /><span>Exhibitor<strong>{selected.exhibitorId?.name || 'Not assigned'}</strong></span></div></div>
            {selected.exhibitorId?._id === user._id ? (
              <form className="exhibitor-booth-form" onSubmit={saveDetails}>
                <div className="exhibitor-form-heading"><span className="dash-eyebrow">BOOTH PROFILE</span><h3>Tell visitors what to expect</h3></div>
                <label className="workspace-field">
                  <span>Products</span>
                  <input placeholder="What are you showcasing?" value={details.products}
                    onChange={(event) => setDetails({ ...details, products: event.target.value })}
                  />
                </label>
                <label className="workspace-field">
                  <span>Services</span>
                  <input placeholder="What services do you offer?" value={details.services}
                    onChange={(event) => setDetails({ ...details, services: event.target.value })}
                  />
                </label>
                <label className="workspace-field">
                  <span>Staff names</span>
                  <input placeholder="Who will be at the booth?" value={details.staff}
                    onChange={(event) => setDetails({ ...details, staff: event.target.value })}
                  />
                </label>
                <div className="exhibitor-booth-form-footer"><p>Keep these details updated for attendees.</p><button className="dash-primary" disabled={busy}><Save size={15} /> Save details</button></div>
              </form>
            ) : (
              <button className="dash-primary booth-assign-button" disabled={busy || selected.status !== 'available'} onClick={request}>
                <Package size={15} /> Request booth
              </button>
            )}
          </aside>
        )}
      </div>
    </div>
  )
}
