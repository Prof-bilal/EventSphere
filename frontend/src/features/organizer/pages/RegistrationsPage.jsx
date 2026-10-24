import { useEffect, useState } from 'react'
import { api } from '../../../api'

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadRegistrations() {
    try {
      setRegistrations(await api('/expoRegistration/register'))
    } catch (error) {
      setError(error.message)
    }
    setLoading(false)
  }
  useEffect(() => {
    loadRegistrations()
  }, [])

  const filtered = registrations.filter((item) =>
    (
      (item.attendeeId?.name || '') +
      ' ' +
      (item.expoId?.title || '') +
      ' ' +
      item.registrationNumber
    )
      .toLowerCase()
      .includes(search.toLowerCase()),
  )

  return (
    <div className="dash-view">
      <div className="page-intro">
        <div>
          <span className="dash-eyebrow">REGISTRATIONS</span>
          <h1>See who is joining you.</h1>
        </div>
      </div>
      <input
        className="page-search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search attendees or expos"
        aria-label="Search registrations"
      />
      {error && (
        <p className="api-error" role="alert">
          {error}
        </p>
      )}
      {loading && <p>Loading registrations...</p>}
      {!loading && !filtered.length && <p className="empty-state">No registrations found.</p>}
      <div className="table-scroll">
        <table className="records-table">
          <thead>
            <tr>
              <th>Attendee</th>
              <th>Expo</th>
              <th>Registration</th>
              <th>Status</th>
              <th>Attendance</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item._id}>
                <td>{item.attendeeId?.name || 'Deleted user'}</td>
                <td>{item.expoId?.title || 'Deleted expo'}</td>
                <td>{item.registrationNumber}</td>
                <td>{item.status}</td>
                <td>{item.attendanceStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
