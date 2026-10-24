import { useState } from 'react'
import { api } from '../../../api'
import { useAuth } from '../../../state/AuthContext'

export default function AccountPage() {
  const { user, setUser } = useAuth()
  const [name, setName] = useState(user.name)
  const [phone, setPhone] = useState(user.phone || '')
  const [image, setImage] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function save(event) {
    event.preventDefault()
    setBusy(true)
    try {
      const form = new FormData()
      form.append('name', name)
      if (phone) form.append('phone', phone)
      if (image) form.append('profilePicture', image)
      const data = await api('/auth/editprofile', 'PUT', form)
      setUser({ ...user, ...data.user })
      setMessage('Account updated.')
      setError('')
    } catch (error) {
      setError(error.message)
    }
    setBusy(false)
  }

  return (
    <div className="dash-view">
      <div className="page-intro">
        <div>
          <span className="dash-eyebrow">YOUR ACCOUNT</span>
          <h1>Your personal details.</h1>
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
      <form className="workspace-form" onSubmit={save}>
        <label className="workspace-field">
          <span>Name</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            minLength={3}
            maxLength={30}
          />
        </label>
        <label className="workspace-field">
          <span>Phone</span>
          <input
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            pattern="[0-9]{10,15}"
            placeholder="10–15 digits"
          />
        </label>
        <label className="workspace-field">
          <span>Profile image</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(event) => setImage(event.target.files[0])}
          />
        </label>
        {user.profileImage && (
          <img className="company-logo" src={user.profileImage} alt={user.name} />
        )}
        <button className="dash-primary" disabled={busy}>
          {busy ? 'Saving...' : 'Save account'}
        </button>
      </form>
    </div>
  )
}
