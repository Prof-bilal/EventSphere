import { useEffect, useState } from 'react'
import { api } from '../../../api'

export default function AttendancePage() {
  const [registrations, setRegistrations] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [badgeNumber, setBadgeNumber] = useState('')

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
  async function markPresent(id) {
    setBusy(true)
    try {
      await api('/expoRegistration/register/attend/' + id, 'PUT')
      await loadRegistrations()
    } catch (error) {
      setError(error.message)
    }
    setBusy(false)
  }

  async function markByBadge(event) {
    event.preventDefault()
    const registration = registrations.find(
      (item) => String(item.badgeNumber || item.registrationNumber) === badgeNumber.trim(),
    )
    if (!registration) {
      setError('No registered attendee found with that badge number.')
      return
    }
    await markPresent(registration._id)
    setBadgeNumber('')
  }
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
          <span className="dash-eyebrow">ATTENDANCE</span>
          <h1>Welcome people in.</h1>
        </div>
      </div>
      <input
        className="page-search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search attendees or expos"
        aria-label="Search registrations"
      />
      <form className="attendance-badge-form" onSubmit={markByBadge} noValidate>
        <label>
          <span>Enter badge number</span>
          <input
            value={badgeNumber}
            onChange={(event) => setBadgeNumber(event.target.value)}
            placeholder="Scan or enter badge number"
            required
          />
        </label>
        <button className="dash-primary" disabled={busy || !badgeNumber.trim()}>
          Mark present
        </button>
      </form>
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
              <th>Badge</th>
              <th>Booth</th>
              <th>Status</th>
              <th>Attendance</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item._id}>
                <td>{item.attendeeId?.name || 'Deleted user'}</td>
                <td>{item.expoId?.title || 'Deleted expo'}</td>
                <td>{item.registrationNumber}</td>
                <td>{item.badgeNumber || item.registrationNumber}</td>
                <td>{item.boothNumber || '—'}</td>
                <td>{item.status}</td>
                <td>{item.attendanceStatus}</td>
                <td>
                  <button
                    className="outline-button"
                    disabled={
                      busy || item.attendanceStatus === 'present' || item.status !== 'registered'
                    }
                    onClick={() => markPresent(item._id)}
                  >
                    Mark present
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
