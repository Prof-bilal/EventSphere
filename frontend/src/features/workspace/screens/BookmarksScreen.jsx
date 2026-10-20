import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Activity, ArrowLeft, ArrowRight, Bell, Bookmark, Building2, CalendarDays, Check, Clock3, Edit3, Grid3X3, Plus, Search, ScanLine, ShieldCheck, Trash2, UserCircle, UserPlus, Users, X } from 'lucide-react'
import { useWorkspaceData } from '../../../state/WorkspaceDataContext'
import { publicExhibitors as mockExhibitors } from '../../../data/publicData'
import { roleDetails, emptyExpo, emptySession, Status, EmptyState, Field } from '../workspaceCommon'

function BookmarksScreen({ go }) {
  const { expos, sessions, registrations, bookmarks, sessionRegistrations } = useWorkspaceData()
  const plannedSessions = sessions.filter(item => bookmarks.includes(item.id) || sessionRegistrations.includes(item.id))
  return <div className="dash-view"><div className="page-intro"><div><span className="dash-eyebrow">MY PLANS</span><h1>Your event, your way.</h1><p>Registered expos, sessions, and bookmarks together.</p></div></div><div className="dash-grid"><section className="dash-card"><div className="card-heading"><div><span className="dash-eyebrow">REGISTERED EXPOS</span><h2>Where you’re going.</h2></div></div>{registrations.map(item => <div className="activity-row" key={item.id}><span className="activity-dot"/><div><strong>{expos.find(expo => expo.id === item.expoId)?.title}</strong><small>Registered {item.registeredAt}</small></div></div>)}</section><section className="dash-card"><div className="card-heading"><div><span className="dash-eyebrow">SAVED SESSIONS</span><h2>Your personal agenda.</h2></div><button onClick={() => go('sessions')}>Browse <ArrowRight size={14}/></button></div>{plannedSessions.map(item => <div className="session-row" key={item.id}><time>{item.startTime}</time><span className="session-dot"/><div><strong>{item.title}</strong><small>{item.location}</small></div></div>)}</section></div></div>
}

export default BookmarksScreen

