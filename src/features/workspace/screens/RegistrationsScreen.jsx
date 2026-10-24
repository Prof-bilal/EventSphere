import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Activity, ArrowLeft, ArrowRight, Bell, Bookmark, Building2, CalendarDays, Check, Clock3, Edit3, Grid3X3, Plus, Search, ScanLine, ShieldCheck, Trash2, UserCircle, UserPlus, Users, X } from 'lucide-react'
import { useWorkspaceData } from '../../../state/WorkspaceDataContext'
import { publicExhibitors as mockExhibitors } from '../../../data/publicData'
import { roleDetails, emptyExpo, emptySession, Status, EmptyState, Field } from '../workspaceCommon'

function RegistrationsScreen({ search }) {
  const { registrations, expos } = useWorkspaceData()
  const filtered = registrations.filter(item => `${item.attendee} ${item.status}`.toLowerCase().includes(search.toLowerCase()))
  return <div className="dash-view"><div className="page-intro"><div><span className="dash-eyebrow">ATTENDEE REGISTRATIONS</span><h1>See who is coming.</h1><p>Registration status and event details in one clear list.</p></div></div><div className="table-card"><div className="table-head registrations"><span>Attendee</span><span>Expo</span><span>Registered</span><span>Status</span></div>{filtered.map(item => <div className="table-row registrations" key={item.id}><strong>{item.attendee}</strong><span>{expos.find(expo => expo.id === item.expoId)?.title}</span><span>{item.registeredAt}</span><Status value={item.status}/></div>)}</div></div>
}

export default RegistrationsScreen

