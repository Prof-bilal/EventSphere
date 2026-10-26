import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../../../api'
import PublicLayout from '../../../components/layout/PublicLayout'
import RegistrationPass from '../components/RegistrationPass'

export default function RegistrationPassPage() {
  const { id } = useParams()
  const [registration, setRegistration] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadPass() {
      try {
        const registrations = await api('/expoRegistration/mine')
        const found = registrations.find((item) => item._id === id)
        if (!found) throw new Error('Registration pass not found.')
        setRegistration(found)
      } catch (loadError) {
        setError(loadError.message)
      }
      setLoading(false)
    }
    loadPass()
  }, [id])

  return (
    <PublicLayout>
      <section className="registration-pass-page">
        <div className="registration-pass-page-heading">
          <span className="eyebrow"><span className="status-dot" /> YOUR EVENT PASS</span>
          <h1>Ready for the room.</h1>
          <p>Keep this pass on your phone or print it before you arrive.</p>
        </div>
        {loading && <p role="status">Loading your pass...</p>}
        {error && <p className="api-error" role="alert">{error}</p>}
        {registration && <RegistrationPass registration={registration} />}
        <Link className="text-link registration-pass-back" to="/dashboard/expos">
          Back to expos
        </Link>
      </section>
    </PublicLayout>
  )
}
