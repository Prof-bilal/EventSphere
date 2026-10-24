import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api } from '../../../api'

export default function ExpoFormPage() {
  const { editId } = useParams()
  const navigate = useNavigate()
  const [values, setValues] = useState({
    title: '',
    theme: '',
    description: '',
    location: '',
    startDate: '',
    endDate: '',
    registrationDeadline: '',
    capacity: '',
    status: 'draft',
  })
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(Boolean(editId))
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadExpo() {
      try {
        const data = await api('/expo/getExpo/' + editId)
        const expo = data.getExpo
        setValues({
          title: expo.title,
          theme: expo.theme,
          description: expo.description,
          location: expo.location,
          startDate: expo.startDate.slice(0, 10),
          endDate: expo.endDate.slice(0, 10),
          registrationDeadline: expo.registrationDeadline.slice(0, 10),
          capacity: expo.capacity,
          status: expo.status,
        })
      } catch (error) {
        setError(error.message)
      }
      setLoading(false)
    }
    if (editId) loadExpo()
  }, [editId])

  function update(event) {
    setValues({ ...values, [event.target.name]: event.target.value })
  }

  async function submit(event) {
    event.preventDefault()
    if (values.endDate <= values.startDate) {
      setError('End date must be after start date.')
      return
    }
    if (values.registrationDeadline > values.startDate) {
      setError('Registration deadline must be before the expo starts.')
      return
    }
    setBusy(true)
    try {
      const form = new FormData()
      Object.entries(values).forEach(([key, value]) => form.append(key, value))
      if (image) form.append('image', image)
      await api(
        editId ? '/expo/updateExpo/' + editId : '/expo/createExpo',
        editId ? 'PUT' : 'POST',
        form,
      )
      navigate('/organizer/expos')
    } catch (error) {
      setError(error.message)
    }
    setBusy(false)
  }

  return (
    <div className="dash-view">
      <div className="page-intro">
        <div>
          <Link to="/organizer/expos" className="back-link">
            Back to expos
          </Link>
          <h1>{editId ? 'Update the event.' : 'Create your next event.'}</h1>
        </div>
      </div>
      {error && (
        <p className="api-error" role="alert">
          {error}
        </p>
      )}
      {loading ? (
        <p>Loading expo...</p>
      ) : (
        <form className="workspace-form" onSubmit={submit}>
          <div className="form-grid">
            <label className="workspace-field">
              <span>Title</span>
              <input
                name="title"
                value={values.title}
                onChange={update}
                required
                minLength={3}
                maxLength={50}
              />
            </label>
            <label className="workspace-field">
              <span>Theme</span>
              <input
                name="theme"
                value={values.theme}
                onChange={update}
                required
                minLength={3}
                maxLength={50}
              />
            </label>
            <label className="workspace-field">
              <span>Location</span>
              <input
                name="location"
                value={values.location}
                onChange={update}
                required
                minLength={3}
              />
            </label>
            <label className="workspace-field">
              <span>Capacity</span>
              <input
                name="capacity"
                type="number"
                min="1"
                max="10000"
                value={values.capacity}
                onChange={update}
                required
              />
            </label>
            <label className="workspace-field">
              <span>Start date</span>
              <input
                name="startDate"
                type="date"
                value={values.startDate}
                onChange={update}
                required
              />
            </label>
            <label className="workspace-field">
              <span>End date</span>
              <input name="endDate" type="date" value={values.endDate} onChange={update} required />
            </label>
            <label className="workspace-field">
              <span>Registration deadline</span>
              <input
                name="registrationDeadline"
                type="date"
                value={values.registrationDeadline}
                onChange={update}
                required
              />
            </label>
            <label className="workspace-field">
              <span>Status</span>
              <select name="status" value={values.status} onChange={update}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </label>
            <label className="workspace-field">
              <span>Event image</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(event) => setImage(event.target.files[0])}
              />
            </label>
            <label className="workspace-field">
              <span>Description</span>
              <textarea
                name="description"
                value={values.description}
                onChange={update}
                minLength={10}
                maxLength={200}
                rows={5}
                required
              />
            </label>
          </div>
          <button className="dash-primary" disabled={busy}>
            {busy ? 'Saving...' : 'Save expo'}
          </button>
        </form>
      )}
    </div>
  )
}
