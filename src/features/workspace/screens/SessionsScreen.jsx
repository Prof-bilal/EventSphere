import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Activity, ArrowLeft, ArrowRight, Bell, Bookmark, Building2, CalendarDays, Check, Clock3, Edit3, Grid3X3, Plus, Search, ScanLine, ShieldCheck, Trash2, UserCircle, UserPlus, Users, X } from 'lucide-react'
import { useWorkspaceData } from '../../../state/WorkspaceDataContext'
import { publicExhibitors as mockExhibitors } from '../../../data/publicData'
import { roleDetails, emptyExpo, emptySession, Status, EmptyState, Field } from '../workspaceCommon'

function SessionsScreen({ role, search, go }) {
  const { sessions, expos, deleteSession, bookmarks, sessionRegistrations, toggleBookmark, toggleSessionRegistration } = useWorkspaceData()
  const filtered = sessions.filter(item => `${item.title} ${item.speaker} ${item.topic} ${item.location}`.toLowerCase().includes(search.toLowerCase()))
  return <div className="dash-view"><div className="page-intro"><div><span className="dash-eyebrow">SESSIONS & SCHEDULE</span><h1>Ideas worth making time for.</h1><p>Manage speakers and time slots or build a personal agenda.</p></div>{role === 'organizer' && <button className="dash-primary" onClick={() => go('sessions/new')}><Plus size={15}/> Add session</button>}</div>{filtered.length ? <div className="schedule-list">{filtered.map(session => <article className="schedule-card" key={session.id}><time>{session.startTime}</time><div className="schedule-line"/><div className="schedule-main"><span className="dash-eyebrow">{session.type} · {expos.find(expo => expo.id === Number(session.expoId))?.title}</span><h2>{session.title}</h2><p>{session.speaker} · {session.location} · {session.startTime}–{session.endTime}</p></div>{role === 'organizer' ? <div className="row-actions"><button onClick={() => go(`sessions/${session.id}/edit`)}><Edit3 size={15}/></button><button onClick={() => window.confirm('Delete this session?') && deleteSession(session.id)}><Trash2 size={15}/></button></div> : <div className="session-actions"><button className={bookmarks.includes(session.id) ? 'save-button saved' : 'save-button'} onClick={() => toggleBookmark(session.id)}><Bookmark size={15} fill={bookmarks.includes(session.id) ? 'currentColor' : 'none'}/>{bookmarks.includes(session.id) ? 'Saved' : 'Save'}</button><button className="dash-primary" onClick={() => toggleSessionRegistration(session.id)}>{sessionRegistrations.includes(session.id) ? 'Cancel registration' : 'Register'}</button></div>}</article>)}</div> : <EmptyState title="No sessions found" copy="Try another speaker, topic, or room."/>}</div>
}

export default SessionsScreen

