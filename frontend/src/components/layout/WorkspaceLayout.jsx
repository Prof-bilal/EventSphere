import { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Check } from 'lucide-react'
import { useWorkspaceData } from '../../state/WorkspaceDataContext'
import { roleDetails } from '../../features/workspace/workspaceCommon'
import WorkspaceSidebar from './WorkspaceSidebar'
import WorkspaceHeader from './WorkspaceHeader'

export default function WorkspaceLayout({ role }) {
  const navigate = useNavigate()
  const location = useLocation()
  const data = useWorkspaceData()
  const details = roleDetails[role]
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [profileOpen, setProfileOpen] = useState(false)
  const page = location.pathname.split('/').filter(Boolean)[1] || 'overview'
  const currentLabel = details.nav.find(item => item[0] === page)?.[1] || 'Workspace'
  const go = path => navigate(`/${role}/${path === 'overview' ? '' : path}`)
  const context = { role, search, go }

  return <div className="dashboard-page"><WorkspaceSidebar role={role} unread={data.notifications.filter(item => !item.read).length} open={menuOpen} onNavigate={() => setMenuOpen(false)}/><div className="dashboard-main"><WorkspaceHeader role={role} details={details} currentLabel={currentLabel} unread={data.notifications.filter(item => !item.read).length} searchOpen={searchOpen} setSearchOpen={setSearchOpen} search={search} setSearch={setSearch} menuOpen={menuOpen} setMenuOpen={setMenuOpen} profileOpen={profileOpen} setProfileOpen={setProfileOpen} go={go}/><main className="dashboard-content"><Outlet context={context}/></main>{data.toast && <div className="toast" role="status"><Check size={16}/>{data.toast}</div>}</div></div>
}
