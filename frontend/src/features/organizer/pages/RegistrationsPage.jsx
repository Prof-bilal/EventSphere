import { useEffect, useState } from 'react'
import { api } from '../../../api'

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [drafts, setDrafts] = useState({})
  const [busy, setBusy] = useState(false)

  async function loadRegistrations() {
    try {
      const data = await api('/expoRegistration/register')
      setRegistrations(data)
      setDrafts(
        Object.fromEntries(
          data.map((item) => [item._id, { badgeNumber: item.badgeNumber || item.registrationNumber, boothNumber: item.boothNumber || '' }]),
        ),
      )
    } catch (error) {
      setError(error.message)
    }
    setLoading(false)
  }

  async function saveDetails(id) {
    setBusy(true)
    try {
      await api('/expoRegistration/register/' + id + '/details', 'PUT', drafts[id])
      await loadRegistrations()
    } catch (error) {
      setError(error.message)
    }
    setBusy(false)
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
              <th>Badge</th>
              <th>Booth</th>
              <th>Contact</th>
              <th>Status</th>
              <th>Attendance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item._id}>
                <td>{item.attendeeId?.name || 'Deleted user'}</td>
                <td>{item.expoId?.title || 'Deleted expo'}</td>
                <td>
                  <input
                    className="table-input"
                    value={drafts[item._id]?.badgeNumber || ''}
                    onChange={(event) =>
                      setDrafts({ ...drafts, [item._id]: { ...drafts[item._id], badgeNumber: event.target.value } })
                    }
                    aria-label={`Badge number for ${item.attendeeId?.name || 'attendee'}`}
                  />
                </td>
                <td>
                  <input
                    className="table-input"
                    value={drafts[item._id]?.boothNumber || ''}
                    onChange={(event) =>
                      setDrafts({ ...drafts, [item._id]: { ...drafts[item._id], boothNumber: event.target.value } })
                    }
                    placeholder="Unassigned"
                    aria-label={`Booth number for ${item.attendeeId?.name || 'attendee'}`}
                  />
                </td>
                <td>{item.phone || item.attendeeId?.email || '—'}</td>
                <td>{item.status}</td>
                <td>{item.attendanceStatus}</td>
              <td>
                <button className="outline-button" disabled={busy} onClick={() => saveDetails(item._id)}>
                  Save
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
