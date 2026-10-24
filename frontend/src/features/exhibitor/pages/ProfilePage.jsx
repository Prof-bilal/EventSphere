import { useEffect, useState } from 'react'
import { api } from '../../../api'

export default function ProfilePage() {
  const [id, setId] = useState('')
  const [values, setValues] = useState({
    CompanyName: '',
    description: '',
    category: '',
    products: '',
    services: '',
    website: '',
    contactPerson: '',
    phone: '',
  })
  const [logo, setLogo] = useState(null)
  const [documents, setDocuments] = useState([])
  const [savedDocuments, setSavedDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function loadProfile() {
      try {
        const profile = await api('/exhibitor/my-profile')
        if (profile) {
          setId(profile._id)
          setValues(profile)
          setSavedDocuments(profile.documents || [])
        }
      } catch (error) {
        setError(error.message)
      }
      setLoading(false)
    }
    loadProfile()
  }, [])

  function update(event) {
    setValues({ ...values, [event.target.name]: event.target.value })
  }

  async function submit(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      const form = new FormData()
      for (const key of [
        'CompanyName',
        'description',
        'category',
        'products',
        'services',
        'website',
        'contactPerson',
        'phone',
      ])
        form.append(key, values[key] || '')
      if (logo) form.append('image', logo)
      Array.from(documents).forEach((file) => form.append('documents', file))
      const result = await api(
        id ? '/exhibitor/updateexhibitor/' + id : '/exhibitor/createProfile',
        id ? 'PUT' : 'POST',
        form,
      )
      setId(result.data._id)
      setValues(result.data)
      setSavedDocuments(result.data.documents || [])
      setDocuments([])
      setLogo(null)
      event.target.reset()
      setMessage('Company profile saved.')
    } catch (error) {
      setError(error.message)
    }
    setBusy(false)
  }

  return (
    <div className="dash-view">
      <div className="page-intro">
        <div>
          <span className="dash-eyebrow">COMPANY PROFILE</span>
          <h1>Show people what you do.</h1>
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
      {loading ? (
        <p>Loading profile...</p>
      ) : (
        <form className="workspace-form" onSubmit={submit}>
          <div className="form-grid">
            <label className="workspace-field">
              <span>Company name</span>
              <input
                name="CompanyName"
                value={values.CompanyName}
                onChange={update}
                minLength={3}
                maxLength={50}
                required
              />
            </label>
            <label className="workspace-field">
              <span>Category</span>
              <input name="category" value={values.category || ''} onChange={update} required />
            </label>
            <label className="workspace-field">
              <span>Products</span>
              <input name="products" value={values.products || ''} onChange={update} />
            </label>
            <label className="workspace-field">
              <span>Services</span>
              <input name="services" value={values.services || ''} onChange={update} />
            </label>
            <label className="workspace-field">
              <span>Website</span>
              <input name="website" type="url" value={values.website || ''} onChange={update} />
            </label>
            <label className="workspace-field">
              <span>Contact person</span>
              <input
                name="contactPerson"
                value={values.contactPerson}
                onChange={update}
                minLength={3}
                required
              />
            </label>
            <label className="workspace-field">
              <span>Phone</span>
              <input name="phone" value={values.phone} onChange={update} required />
            </label>
            <label className="workspace-field">
              <span>Logo</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(event) => setLogo(event.target.files[0])}
              />
            </label>
            <label className="workspace-field">
              <span>Documents</span>
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.png,.webp"
                onChange={(event) => setDocuments(event.target.files)}
              />
            </label>
            <label className="workspace-field">
              <span>Description</span>
              <textarea
                name="description"
                value={values.description}
                onChange={update}
                minLength={10}
                maxLength={1000}
                rows={5}
                required
              />
            </label>
          </div>
          {values.logoUrl && (
            <img className="company-logo" src={values.logoUrl} alt="Company logo" />
          )}
          <div className="record-actions">
            {savedDocuments.map((path, index) => (
              <a key={path} href={path} target="_blank" rel="noreferrer">
                Document {index + 1}
              </a>
            ))}
          </div>
          <button className="dash-primary" disabled={busy}>
            {busy ? 'Saving...' : 'Save profile'}
          </button>
        </form>
      )}
    </div>
  )
}
