import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { roleDetails } from '../../features/workspace/workspaceCommon'

export default function WorkspaceSidebar({ role, unread, open, onNavigate }) {
  const location = useLocation()
  const navigate = useNavigate()
  const details = roleDetails[role]
  const current = location.pathname.split('/').filter(Boolean)[1] || 'overview'

  return <aside className={open ? 'dashboard-sidebar open' : 'dashboard-sidebar'}>
    <Link className="dash-brand" to="/"><span className="brand-mark" aria-hidden="true"><i/><i/><i/></span>EventSphere</Link>
    <div className="sidebar-role"><span>WORKSPACE</span><strong>{details.label}</strong><select value={role} onChange={event => navigate(`/${event.target.value}`)} aria-label="Switch workspace"><option value="organizer">Organizer</option><option value="exhibitor">Exhibitor</option><option value="attendee">Attendee</option></select></div>
    <nav className="dashboard-nav" aria-label="Workspace navigation">{details.nav.map(([id, label, Icon]) => <Link key={id} className={current === id ? 'active' : ''} to={`/${role}/${id === 'overview' ? '' : id}`} onClick={onNavigate}><Icon size={17}/>{label}{id === 'notifications' && unread > 0 && <b>{unread}</b>}</Link>)}</nav>
    <Link className="sidebar-home" to="/"><LogOut size={16}/> Back to EventSphere</Link>
  </aside>
}
