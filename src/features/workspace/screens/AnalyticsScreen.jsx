import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Activity, ArrowLeft, ArrowRight, Bell, Bookmark, Building2, CalendarDays, Check, Clock3, Edit3, Grid3X3, Plus, Search, ScanLine, ShieldCheck, Trash2, UserCircle, UserPlus, Users, X } from 'lucide-react'
import { useWorkspaceData } from '../../../state/WorkspaceDataContext'
import { publicExhibitors as mockExhibitors } from '../../../data/publicData'
import { roleDetails, emptyExpo, emptySession, Status, EmptyState, Field } from '../workspaceCommon'

function AnalyticsScreen() {
  const { expos, applications, booths, sessions, registrations } = useWorkspaceData()
  const metrics = [['Attendees', registrations.length, 75], ['Approved exhibitors', applications.filter(item => item.status === 'approved').length, 54], ['Occupied booths', booths.filter(item => item.status === 'occupied').length, 62], ['Sessions', sessions.length, 82]]
  return <div className="dash-view"><div className="page-intro"><div><span className="dash-eyebrow">ANALYTICS</span><h1>See what is moving.</h1><p>Basic event, booth, attendee, and session numbers.</p></div><select className="page-select"><option>{expos[0]?.title}</option>{expos.slice(1).map(expo => <option key={expo.id}>{expo.title}</option>)}</select></div><div className="analytics-grid">{metrics.map(([label, value, percent]) => <div className="dash-card analytics-card" key={label}><span>{label}</span><strong>{value}</strong><div><i style={{ width: `${percent}%` }}/></div><small>{percent}% of the current target</small></div>)}</div><div className="dash-card"><div className="card-heading"><div><span className="dash-eyebrow">POPULAR SESSIONS</span><h2>What people are saving.</h2></div></div>{sessions.map((session, index) => <div className="ranking-row" key={session.id}><span>0{index + 1}</span><strong>{session.title}</strong><div><i style={{ width: `${90 - index * 18}%` }}/></div><small>{42 - index * 8} saves</small></div>)}</div></div>
}

export default AnalyticsScreen

