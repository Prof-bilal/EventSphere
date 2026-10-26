import { useEffect, useState } from 'react'
import { api } from '../../../api'

export default function UserManagementPage() {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function loadUsers() {
    try {
      setUsers(await api('/auth/users'))
    } catch (error) {
      setError(error.message)
    }
    setLoading(false)
  }
  useEffect(() => {
    loadUsers()
  }, [])

  async function updateUser(id, action) {
    setBusy(true)
    try {
      await api('/auth/' + action + '/' + id, 'PUT')
      await loadUsers()
    } catch (error) {
      setError(error.message)
    }
    setBusy(false)
  }

  return (
    <div className="dash-view">
      <div className="page-intro">
        <div>
          <span className="dash-eyebrow">USER MANAGEMENT</span>
          <h1>The people behind the event.</h1>
        </div>
      </div>
      <input
        className="page-search"
        placeholder="Search people"
        aria-label="Search people"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      {error && (
        <p className="api-error" role="alert">
          {error}
        </p>
      )}
      {loading && <p>Loading users...</p>}
      {!loading && !users.length && <p className="empty-state">No users found.</p>}
      <div className="table-scroll">
        <table className="records-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Company</th>
              <th>Approval</th>
              <th>Access</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users
              .filter((item) =>
                (item.name + ' ' + item.email).toLowerCase().includes(search.toLowerCase()),
              )
              .map((item) => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.role}</td>
                  <td>
                    {item.companyProfile ? (
                      <div className="user-company-cell">
                        <strong>{item.companyProfile.CompanyName}</strong>
                        <small>
                          {item.companyProfile.category} · {item.companyProfile.contactPerson}
                        </small>
                      </div>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td>{item.approvalStatus}</td>
                  <td>{item.IsBlocked ? 'Blocked' : 'Active'}</td>
                  <td>
                    <div className="record-actions">
                      <button
                        className="outline-button"
                        disabled={busy}
                        onClick={() =>
                          updateUser(item._id, item.IsBlocked ? 'unblock-user' : 'block-user')
                        }
                      >
                        {item.IsBlocked ? 'Unblock' : 'Block'}
                      </button>
                      {item.role === 'exhibitor' && item.approvalStatus === 'pending' && (
                        <>
                          <button
                            className="dash-primary"
                            disabled={busy}
                            onClick={() => updateUser(item._id, 'approve-exhibitor')}
                          >
                            Approve
                          </button>
                          <button
                            className="danger-button"
                            disabled={busy}
                            onClick={() => updateUser(item._id, 'reject-exhibitor')}
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
