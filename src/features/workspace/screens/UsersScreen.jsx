import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Activity, ArrowLeft, ArrowRight, Bell, Bookmark, Building2, CalendarDays, Check, Clock3, Edit3, Grid3X3, Plus, Search, ScanLine, ShieldCheck, Trash2, UserCircle, UserPlus, Users, X } from 'lucide-react'
import { useWorkspaceData } from '../../../state/WorkspaceDataContext'
import { publicExhibitors as mockExhibitors } from '../../../data/publicData'
import { roleDetails, emptyExpo, emptySession, Status, EmptyState, Field } from '../workspaceCommon'

function UsersScreen({ search }) {
  const { users, inviteUser, updateUser, removeUser } = useWorkspaceData()
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showInvite, setShowInvite] = useState(false)
  const [invite, setInvite] = useState({ name: '', email: '', role: 'attendee' })
  const [errors, setErrors] = useState({})
  const filtered = users.filter(item => (roleFilter === 'all' || item.role === roleFilter) && (statusFilter === 'all' || item.status === statusFilter) && `${item.name} ${item.email} ${item.role}`.toLowerCase().includes(search.toLowerCase()))
  function submitInvite(event) {
    event.preventDefault()
    const next = {}
    if (!invite.name.trim()) next.name = 'Name is required.'
    if (!/^\S+@\S+\.\S+$/.test(invite.email)) next.email = 'Enter a valid email address.'
    if (users.some(item => item.email.toLowerCase() === invite.email.toLowerCase())) next.email = 'A user with this email already exists.'
    setErrors(next)
    if (Object.keys(next).length) return
    inviteUser(invite)
    setInvite({ name: '', email: '', role: 'attendee' })
    setShowInvite(false)
  }
  return <div className="dash-view">
    <div className="page-intro"><div><span className="dash-eyebrow">USER MANAGEMENT</span><h1>People, access, and roles.</h1><p>Invite users, control access, and keep every workspace assigned correctly.</p></div><button className="dash-primary" onClick={() => setShowInvite(value => !value)}><UserPlus size={16}/>{showInvite ? 'Close form' : 'Invite user'}</button></div>
    <div className="management-summary"><div><span>Total users</span><strong>{users.length}</strong></div><div><span>Active</span><strong>{users.filter(item => item.status === 'active').length}</strong></div><div><span>Invited</span><strong>{users.filter(item => item.status === 'invited').length}</strong></div><div><span>Suspended</span><strong>{users.filter(item => item.status === 'suspended').length}</strong></div></div>
    {showInvite && <form className="workspace-form management-form" onSubmit={submitInvite}><div className="card-heading"><div><span className="dash-eyebrow">NEW INVITATION</span><h2>Add someone to EventSphere.</h2></div></div><div className="form-grid"><Field label="Full name" error={errors.name}><input value={invite.name} onChange={event => { setInvite(current => ({ ...current, name: event.target.value })); setErrors(current => ({ ...current, name: '' })) }} placeholder="e.g. Ali Raza"/></Field><Field label="Email address" error={errors.email}><input type="email" value={invite.email} onChange={event => { setInvite(current => ({ ...current, email: event.target.value })); setErrors(current => ({ ...current, email: '' })) }} placeholder="ali@example.com"/></Field><Field label="Workspace role"><select value={invite.role} onChange={event => setInvite(current => ({ ...current, role: event.target.value }))}><option value="attendee">Attendee</option><option value="exhibitor">Exhibitor</option><option value="organizer">Organizer</option></select></Field></div><div className="form-actions"><button type="button" className="outline-button" onClick={() => setShowInvite(false)}>Cancel</button><button type="submit" className="dash-primary">Send invitation<ArrowRight size={15}/></button></div></form>}
    <div className="view-toolbar management-toolbar"><div className="toolbar-search"><Search size={16}/><span>{search || 'Search users from the header'}</span></div><div><select value={roleFilter} onChange={event => setRoleFilter(event.target.value)} aria-label="Filter users by role"><option value="all">All roles</option><option value="organizer">Organizer</option><option value="exhibitor">Exhibitor</option><option value="attendee">Attendee</option></select><select value={statusFilter} onChange={event => setStatusFilter(event.target.value)} aria-label="Filter users by status"><option value="all">All statuses</option><option value="active">Active</option><option value="invited">Invited</option><option value="suspended">Suspended</option></select></div></div>
    {filtered.length ? <div className="table-card management-table"><div className="table-head users-table"><span>User</span><span>Role</span><span>Status</span><span>Joined</span><span>Last seen</span><span>Actions</span></div>{filtered.map(item => <div className="table-row users-table" key={item.id}><div className="user-cell"><span>{item.name.slice(0, 2).toUpperCase()}</span><div><strong>{item.name}</strong><small>{item.email}</small></div></div><select value={item.role} onChange={event => updateUser(item.id, { role: event.target.value })} aria-label={`Role for ${item.name}`}><option value="organizer">Organizer</option><option value="exhibitor">Exhibitor</option><option value="attendee">Attendee</option></select><Status value={item.status}/><span>{item.joinedAt}</span><span>{item.lastSeen}</span><div className="row-actions"><button title={item.status === 'suspended' ? 'Activate user' : 'Suspend user'} onClick={() => updateUser(item.id, { status: item.status === 'suspended' ? 'active' : 'suspended' })}>{item.status === 'suspended' ? <Check size={14}/> : <ShieldCheck size={14}/>}</button><button title="Remove user" className="danger-link" onClick={() => window.confirm(`Remove ${item.name}?`) && removeUser(item.id)}><Trash2 size={14}/></button></div></div>)}</div> : <EmptyState title="No users found" copy="Try another search, role, or account status."/>}
  </div>
}

export default UsersScreen

