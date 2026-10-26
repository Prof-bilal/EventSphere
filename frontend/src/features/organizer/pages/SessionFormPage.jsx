import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api } from '../../../api'

export default function SessionFormPage() {
  const { editId } = useParams()
  const navigate = useNavigate()
  const [expos, setExpos] = useState([])
  const [values, setValues] = useState({
    expoId: '',
    title: '',
    description: '',
    topic: '',
    speakerName: '',
    location: '',
    startDate: '',
    startTime: '',
    endTime: '',
    capacity: '',
    sessionType: 'session',
    fee: '0',
  })
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadForm() {
      try {
        setExpos(await api('/expo/getExpo'))
        if (editId) {
          const session = await api('/session/get-session/' + editId)
          setValues({
            ...session,
            expoId: session.expoId?._id || session.expoId,
            startDate: session.startDate.slice(0, 10),
          })
        }
      } catch (error) {
        setError(error.message)
      }
      setLoading(false)
    }
    loadForm()
  }, [editId])

  function update(event) {
    setValues({ ...values, [event.target.name]: event.target.value })
  }

  async function submit(event) {
    event.preventDefault()
    if (values.startTime >= values.endTime) {
      setError('End time must be after start time.')
      return
    }
    setBusy(true)
    try {
      await api(
        editId ? '/session/update-session/' + editId : '/session/create-session/' + values.expoId,
        editId ? 'PUT' : 'POST',
        values,
      )
      navigate('/dashboard/sessions')
    } catch (error) {
      setError(error.message)
    }
    setBusy(false)
  }

  return (
    <div className="dash-view">
      <div className="page-intro">
        <div>
          <Link to="/dashboard/sessions">Back to schedule</Link>
          <h1>{editId ? 'Update the session.' : 'Add a new session.'}</h1>
        </div>
      </div>
      {error && (
        <p className="api-error" role="alert">
          {error}
        </p>
      )}
      {loading ? (
        <p>Loading form...</p>
      ) : (
        <form className="workspace-form" onSubmit={submit}>
          <div className="form-grid">
            <label className="workspace-field">
              <span>Expo</span>
              <select
                name="expoId"
                value={values.expoId}
                onChange={update}
                required
                disabled={Boolean(editId)}
              >
                <option value="">Select expo</option>
                {expos.map((expo) => (
                  <option key={expo._id} value={expo._id}>
                    {expo.title}
                  </option>
                ))}
              </select>
            </label>
            <label className="workspace-field">
              <span>Session type</span>
              <select name="sessionType" value={values.sessionType} onChange={update}>
                <option value="session">Session</option>
                <option value="workshop">Workshop</option>
                <option value="seminar">Seminar</option>
              </select>
            </label>
            <label className="workspace-field">
              <span>Title</span>
              <input name="title" value={values.title} onChange={update} minLength={3} required />
            </label>
            <label className="workspace-field">
              <span>Speaker</span>
              <input
                name="speakerName"
                value={values.speakerName}
                onChange={update}
                minLength={3}
                required
              />
            </label>
            <label className="workspace-field">
              <span>Topic</span>
              <input name="topic" value={values.topic} onChange={update} minLength={3} required />
            </label>
            <label className="workspace-field">
              <span>Location</span>
              <input name="location" value={values.location} onChange={update} required />
            </label>
            <label className="workspace-field">
              <span>Date</span>
              <input
                name="startDate"
                type="date"
                value={values.startDate}
                onChange={update}
                required
              />
            </label>
            <label className="workspace-field">
              <span>Capacity</span>
              <input
                name="capacity"
                type="number"
                min="1"
                max="240"
                value={values.capacity}
                onChange={update}
                required
              />
            </label>
            <label className="workspace-field">
              <span>Start time</span>
              <input
                name="startTime"
                type="time"
                value={values.startTime}
                onChange={update}
                required
              />
            </label>
            <label className="workspace-field">
              <span>End time</span>
              <input name="endTime" type="time" value={values.endTime} onChange={update} required />
            </label>
            <label className="workspace-field">
              <span>Description</span>
              <textarea
                name="description"
                value={values.description}
                onChange={update}
                minLength={3}
                rows={4}
                required
              />
            </label>
          </div>
          <button className="dash-primary" disabled={busy}>
            {busy ? 'Saving...' : 'Save session'}
          </button>
        </form>
      )}
    </div>
  )
}
