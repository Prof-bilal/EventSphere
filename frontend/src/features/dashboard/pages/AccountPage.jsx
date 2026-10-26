import { useState } from 'react'
import { Camera, CheckCircle2, Phone, Save, ShieldCheck, UserRound } from 'lucide-react'
import { api } from '../../../api'
import { useAuth } from '../../../state/AuthContext'

export default function AccountPage() {
  const { user, setUser } = useAuth()
  const [name, setName] = useState(user.name)
  const [phone, setPhone] = useState(user.phone || '')
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(user.profileImage || '')
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

  function selectImage(event) {
    const file = event.target.files?.[0]
    if (!file) return
    setImage(file)
    setPreview(URL.createObjectURL(file))
  }

  const initials = name?.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase() || '?'

  return (
    <div className="dash-view account-page">
      <div className="page-intro account-intro">
        <div>
          <span className="dash-eyebrow">YOUR ACCOUNT</span>
          <h1>Your personal details.</h1>
          <p>Keep your profile current so your event experience feels personal.</p>
        </div>
      </div>
      {error && <p className="api-error" role="alert">{error}</p>}
      {message && <p className="api-message" role="status">{message}</p>}
      <div className="account-layout">
        <section className="account-card">
          <div className="account-profile-header">
            <div className="account-avatar-wrap">
              {preview ? <img className="account-avatar" src={preview} alt={name} /> : <span className="account-avatar account-avatar-fallback">{initials}</span>}
              <label className="account-avatar-camera" htmlFor="profile-image"><Camera size={14} /><span>Change photo</span></label>
            </div>
            <div className="account-profile-copy">
              <span className="dash-eyebrow">PROFILE</span>
              <h2>{name || 'Your name'}</h2>
              <p>{user.email || 'Your account email'}</p>
            </div>
          </div>
          <form className="account-form" onSubmit={save}>
            <div className="account-form-heading"><div><span className="dash-eyebrow">PERSONAL INFORMATION</span><h3>Update your details</h3></div><UserRound size={18} /></div>
            <div className="account-fields">
              <label className="account-field"><span>Full name</span><input value={name} onChange={(event) => setName(event.target.value)} required minLength={3} maxLength={30} placeholder="Your full name" /></label>
              <label className="account-field"><span>Phone number <small>Optional</small></span><div className="account-input-icon"><Phone size={15} /><input value={phone} onChange={(event) => setPhone(event.target.value)} pattern="[0-9]{10,15}" placeholder="10–15 digits" /></div></label>
              <label className="account-field account-upload-field" htmlFor="profile-image"><span>Profile photo</span><div className="account-upload-box"><Camera size={18} /><div><strong>{image ? image.name : 'Choose a new profile photo'}</strong><small>JPG, PNG, or WEBP · Max 5MB</small></div><span>Browse</span></div></label>
            </div>
            <input id="profile-image" className="account-file-input" type="file" accept="image/jpeg,image/png,image/webp" onChange={selectImage} />
            <div className="account-form-footer"><p>Your profile photo and name are visible in your workspace.</p><button className="account-save" disabled={busy || name.trim().length < 3}>{busy ? 'Saving...' : 'Save changes'} <Save size={15} /></button></div>
          </form>
        </section>
        <aside className="account-aside">
          <div className="account-aside-icon"><ShieldCheck size={20} /></div>
          <span className="dash-eyebrow">YOUR PROFILE</span>
          <h2>Make it yours.</h2>
          <p>A complete profile helps organizers and exhibitors recognize you throughout the event workspace.</p>
          <div className="account-aside-check"><CheckCircle2 size={15} /><span>Profile details stay in sync across your account.</span></div>
        </aside>
      </div>
    </div>
  )
}
