import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Activity, ArrowLeft, ArrowRight, Bell, Bookmark, Building2, CalendarDays, Check, Clock3, Edit3, Grid3X3, Plus, Search, ScanLine, ShieldCheck, Trash2, UserCircle, UserPlus, Users, X } from 'lucide-react'
import { useWorkspaceData } from '../../../state/WorkspaceDataContext'
import { publicExhibitors as mockExhibitors } from '../../../data/publicData'
import { roleDetails, emptyExpo, emptySession, Status, EmptyState, Field } from '../workspaceCommon'

function OverviewScreen({ role, go }) {
  const data = useWorkspaceData()
  const stats = role === 'organizer'
    ? [[data.expos.length, 'Expos'], [data.applications.filter(item => item.status === 'pending').length, 'Pending applications'], [data.registrations.length, 'Attendees'], [data.sessions.length, 'Sessions']]
    : role === 'exhibitor'
      ? [[data.applications.length, 'Applications'], [data.applications.filter(item => item.status === 'approved').length, 'Approved'], [data.booths.filter(item => item.exhibitor === 'Northstar Labs').length, 'Assigned booths'], [data.sessions.length, 'Sessions']]
      : [[data.registrations.length, 'Registered expos'], [data.bookmarks.length, 'Bookmarks'], [data.sessionRegistrations.length, 'Session registrations'], [data.notifications.filter(item => !item.read).length, 'Unread alerts']]
  return <div className="dash-view">
    <div className="page-intro"><div><span className="dash-eyebrow">{roleDetails[role].label.toUpperCase()} WORKSPACE</span><h1>{roleDetails[role].intro}</h1><p>Everything important is gathered here and ready for your next step.</p></div><button className="dash-primary" onClick={() => go(role === 'organizer' ? 'expos/new' : 'expos')}>{role === 'organizer' ? 'Create an expo' : 'Explore events'}<ArrowRight size={16}/></button></div>
    <div className="dash-stats">{stats.map(([value, label]) => <div className="dash-stat" key={label}><span>{label}</span><strong>{value}</strong><small><Activity size={12}/> Current workspace</small></div>)}</div>
    <div className="dash-grid"><section className="dash-card"><div className="card-heading"><div><span className="dash-eyebrow">UP NEXT</span><h2>Today’s schedule</h2></div><button onClick={() => go('sessions')}>View all <ArrowRight size={14}/></button></div>{data.sessions.slice(0, 3).map(session => <div className="session-row" key={session.id}><time>{session.startTime}</time><span className="session-dot"/><div><strong>{session.title}</strong><small>{session.speaker} · {session.location}</small></div></div>)}</section><section className="dash-card"><div className="card-heading"><div><span className="dash-eyebrow">RECENT ACTIVITY</span><h2>Keep an eye on it.</h2></div><button onClick={() => go('notifications')}>Open <ArrowRight size={14}/></button></div>{data.notifications.slice(0, 3).map(item => <div className="activity-row" key={item.id}><span className={item.read ? 'activity-dot read' : 'activity-dot'}/><div><strong>{item.title}</strong><small>{item.message}</small><time>{item.time}</time></div></div>)}</section></div>
  </div>
}

export default OverviewScreen

