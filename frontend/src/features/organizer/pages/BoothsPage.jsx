import { useEffect, useState } from 'react'
import { Building2, DollarSign, Edit3, MapPin, Package, Ruler, Save, Trash2, UserCheck, Users, X } from 'lucide-react'
import { api } from '../../../api'

export default function BoothsPage() {
  const [booths, setBooths] = useState([])
  const [expos, setExpos] = useState([])
  const [applications, setApplications] = useState([])
  const [expoId, setExpoId] = useState('')
  const [selected, setSelected] = useState(null)
  const [assignee, setAssignee] = useState('')
  const [editing, setEditing] = useState('')
  const [values, setValues] = useState({
    boothType: 'Standard',
    floorName: 'Main floor',
    price: '0',
    width: '3',
    height: '3',
    x: '0',
    y: '0',
  })
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function loadBooths() {
    try {
      const list = await api('/booth/getBooth')
      setBooths(list)
      setExpos(await api('/expo/getExpo'))
      const data = await api('/exhibitorApplication/getApplications')
      setApplications(data.getApplications.filter((item) => item.ApplicationStatus === 'Approved'))
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
    setAssignee('')
  }

  async function saveBooth(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      const body = {
        boothType: values.boothType,
        floorName: values.floorName,
        price: Number(values.price),
        position: {
          x: Number(values.x),
          y: Number(values.y),
          width: Number(values.width),
          height: Number(values.height),
        },
        size: { width: Number(values.width), height: Number(values.height) },
      }
      await api(
        editing ? '/booth/updateBooth/' + editing : '/booth/create/' + expoId,
        editing ? 'PUT' : 'POST',
        body,
      )
      setEditing('')
      await loadBooths()
      setMessage('Booth saved.')
    } catch (error) {
      setError(error.message)
    }
    setBusy(false)
  }

  async function assign() {
    setBusy(true)
    try {
      await api('/booth/assign/' + selected._id, 'PUT', { exhibitorId: assignee })
      setSelected(null)
      await loadBooths()
      setMessage('Booth assigned.')
    } catch (error) {
      setError(error.message)
    }
    setBusy(false)
  }

  async function remove() {
    if (!window.confirm('Delete this booth?')) return
    setBusy(true)
    try {
      await api('/booth/deleteBooth/' + selected._id, 'DELETE')
      setSelected(null)
      await loadBooths()
    } catch (error) {
      setError(error.message)
    }
    setBusy(false)
  }

  function editBooth() {
    setEditing(selected._id)
    setExpoId(selected.expoId?._id || selected.expoId)
    setValues({
      boothType: selected.boothType,
      floorName: selected.floorName,
      price: selected.price,
      width: selected.size.width,
      height: selected.size.height,
      x: selected.position.x,
      y: selected.position.y,
    })
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
      <form className="workspace-form booth-form" onSubmit={saveBooth}>
        <div className="booth-form-heading"><div><span className="dash-eyebrow">BOOTH SETUP</span><h2>{editing ? 'Edit booth' : 'Create booth'}</h2></div><span>{editing ? 'Update booth details' : 'Add a new space to the floor plan'}</span></div>
        <div className="form-grid">
          <label className="workspace-field">
            <span>Type</span>
            <select
              value={values.boothType}
              onChange={(event) => setValues({ ...values, boothType: event.target.value })}
            >
              <option>Standard</option>
              <option>Premium</option>
            </select>
          </label>
          <label className="workspace-field">
            <span>Floor</span>
            <input
              value={values.floorName}
              onChange={(event) => setValues({ ...values, floorName: event.target.value })}
              required
            />
          </label>
          <label className="workspace-field">
            <span>Price</span>
            <input
              type="number"
              min="0"
              value={values.price}
              onChange={(event) => setValues({ ...values, price: event.target.value })}
              required
            />
          </label>
          <label className="workspace-field">
            <span>Width</span>
            <input
              type="number"
              min="1"
              value={values.width}
              onChange={(event) => setValues({ ...values, width: event.target.value })}
              required
            />
          </label>
          <label className="workspace-field">
            <span>Height</span>
            <input
              type="number"
              min="1"
              value={values.height}
              onChange={(event) => setValues({ ...values, height: event.target.value })}
              required
            />
          </label>
          <label className="workspace-field">
            <span>X position</span>
            <input
              type="number"
              min="0"
              value={values.x}
              onChange={(event) => setValues({ ...values, x: event.target.value })}
              required
            />
          </label>
          <label className="workspace-field">
            <span>Y position</span>
            <input
              type="number"
              min="0"
              value={values.y}
              onChange={(event) => setValues({ ...values, y: event.target.value })}
              required
            />
          </label>
        </div>
        <div className="booth-form-footer">
          {!expoId && <p>Select an expo before creating a booth.</p>}
          <div className="booth-form-actions"><button className="dash-primary" disabled={busy || !expoId}><Save size={15} />{busy ? 'Saving...' : 'Save booth'}</button>{editing && <button type="button" className="outline-button" onClick={() => setEditing('')}><X size={14} /> Cancel edit</button>}</div>
        </div>
      </form>
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
          <aside className="dash-card booth-detail booth-detail-redesigned">
            <div className="booth-detail-header"><div><span className="dash-eyebrow">BOOTH DETAILS</span><h2>{selected.boothNumber}</h2></div><span className={`booth-status booth-status-${selected.status}`}>{selected.status}</span></div>
            <div className="booth-detail-context"><span><Building2 size={14} /> {selected.expoId?.title || 'Selected expo'}</span><span><MapPin size={14} /> {selected.floorName}</span></div>
            <div className="booth-detail-stats"><div><Ruler size={15} /><span>Size<strong>{selected.size.width} × {selected.size.height}</strong></span></div><div><MapPin size={15} /><span>Position<strong>{selected.position.x}, {selected.position.y}</strong></span></div><div><DollarSign size={15} /><span>Price<strong>{selected.boothType} · {selected.price}</strong></span></div></div>
            <div className="booth-detail-info"><div><Package size={15} /><span>Products<strong>{selected.products || 'Not added'}</strong></span></div><div><Package size={15} /><span>Services<strong>{selected.services || 'Not added'}</strong></span></div><div><Users size={15} /><span>Staff<strong>{selected.staff || 'Not added'}</strong></span></div></div>
            {selected.exhibitorId && <div className="booth-assigned"><UserCheck size={16} /><span><small>ASSIGNED EXHIBITOR</small><strong>{selected.exhibitorId.name}</strong></span></div>}
            {selected.requestedBy?.length > 0 && (
              <div className="booth-requests">
                <h3>Booth requests</h3>
                {selected.requestedBy.map((person) => (
                  <div key={person._id}><span>{person.name}</span><small>{person.email}</small></div>
                ))}
              </div>
            )}
            {!selected.exhibitorId && (
              <>
                <label className="workspace-field booth-assign-field">
                  <span>Approved exhibitor</span>
                  <select value={assignee} onChange={(event) => setAssignee(event.target.value)}>
                    <option value="">Select exhibitor</option>
                    {applications
                      .filter((item) => item.expoId?._id === selected.expoId?._id)
                      .map((item) => (
                        <option value={item.exhibitorId?._id} key={item._id}>
                          {item.exhibitorId?.name}
                        </option>
                      ))}
                  </select>
                </label>
                <button className="dash-primary booth-assign-button" disabled={busy || !assignee} onClick={assign}>
                  <UserCheck size={15} /> Assign booth
                </button>
              </>
            )}
            <div className="booth-detail-actions"><button className="outline-button" onClick={editBooth}><Edit3 size={14} /> Edit booth
            </button>
            <button className="danger-button" disabled={busy} onClick={remove}><Trash2 size={14} /> Delete booth</button></div>
          </aside>
        )}
      </div>
    </div>
  )
}
