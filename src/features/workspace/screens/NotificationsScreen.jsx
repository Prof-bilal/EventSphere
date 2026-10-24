import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Activity, ArrowLeft, ArrowRight, Bell, Bookmark, Building2, CalendarDays, Check, Clock3, Edit3, Grid3X3, Plus, Search, ScanLine, ShieldCheck, Trash2, UserCircle, UserPlus, Users, X } from 'lucide-react'
import { useWorkspaceData } from '../../../state/WorkspaceDataContext'
import { publicExhibitors as mockExhibitors } from '../../../data/publicData'
import { roleDetails, emptyExpo, emptySession, Status, EmptyState, Field } from '../workspaceCommon'

function NotificationsScreen() {
  const { notifications, markNotification, markAllNotifications } = useWorkspaceData()
  const [filter, setFilter] = useState('all')
  const shown = filter === 'unread' ? notifications.filter(item => !item.read) : notifications
  return <div className="dash-view"><div className="page-intro"><div><span className="dash-eyebrow">NOTIFICATIONS</span><h1>Stay close to what changed.</h1><p>Application, expo, and schedule updates appear here.</p></div><button className="outline-button" onClick={markAllNotifications}><Check size={15}/> Mark all read</button></div><div className="filter-tabs"><button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All</button><button className={filter === 'unread' ? 'active' : ''} onClick={() => setFilter('unread')}>Unread</button></div><div className="notification-list">{shown.map(item => <button className={item.read ? 'notification-card read' : 'notification-card'} key={item.id} onClick={() => markNotification(item.id)}><span className="notification-icon"><Bell size={17}/></span><span><strong>{item.title}</strong><small>{item.message}</small><time>{item.time}</time></span>{!item.read && <i/>}</button>)}</div></div>
}

export default NotificationsScreen

