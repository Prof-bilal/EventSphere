import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Activity, ArrowLeft, ArrowRight, Bell, Bookmark, Building2, CalendarDays, Check, Clock3, Edit3, Grid3X3, Plus, Search, ScanLine, ShieldCheck, Trash2, UserCircle, UserPlus, Users, X } from 'lucide-react'
import { useWorkspaceData } from '../../../state/WorkspaceDataContext'
import { publicExhibitors as mockExhibitors } from '../../../data/publicData'
import { roleDetails, emptyExpo, emptySession, Status, EmptyState, Field } from '../workspaceCommon'

function AttendanceScreen({ search }) {
  const { attendance, expos, users, updateAttendance, addAttendance } = useWorkspaceData()
  const [expoFilter, setExpoFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showGuest, setShowGuest] = useState(false)
  const [guest, setGuest] = useState({ attendee: '', email: '', expoId: expos[0]?.id || 1, ticket: '' })
  const [errors, setErrors] = useState({})
  const filtered = attendance.filter(item => (expoFilter === 'all' || item.expoId === Number(expoFilter)) && (statusFilter === 'all' || item.status === statusFilter) && `${item.attendee} ${item.email} ${item.ticket}`.toLowerCase().includes(search.toLowerCase()))
  const checkedIn = attendance.filter(item => item.status === 'checked-in').length
  const completed = attendance.filter(item => item.status === 'checked-out').length
  function readableTime(value) { return value ? value.replace('T', ' · ') : '—' }
  function submitGuest(event) {
    event.preventDefault()
    const next = {}
    if (!guest.attendee.trim()) next.attendee = 'Name is required.'
    if (!/^\S+@\S+\.\S+$/.test(guest.email)) next.email = 'Enter a valid email address.'
    if (!guest.ticket.trim()) next.ticket = 'Ticket number is required.'
    setErrors(next)
    if (Object.keys(next).length) return
    addAttendance({ ...guest, expoId: Number(guest.expoId), userId: users.find(item => item.email.toLowerCase() === guest.email.toLowerCase())?.id || null })
    setGuest({ attendee: '', email: '', expoId: expos[0]?.id || 1, ticket: '' })
    setShowGuest(false)
  }
  return <div className="dash-view">
    <div className="page-intro"><div><span className="dash-eyebrow">LIVE ATTENDANCE</span><h1>Know who is on site.</h1><p>Manage the guest list and record arrivals and departures in one place.</p></div><button className="dash-primary" onClick={() => setShowGuest(value => !value)}><Plus size={16}/>{showGuest ? 'Close form' : 'Add guest'}</button></div>
    <div className="attendance-hero"><div><span className="attendance-live"><i/> LIVE EVENT VIEW</span><strong>{checkedIn}</strong><p>people currently checked in</p></div><div className="attendance-metrics"><span><b>{attendance.length}</b> Expected</span><span><b>{checkedIn + completed}</b> Arrived</span><span><b>{completed}</b> Checked out</span><span><b>{attendance.length ? Math.round(((checkedIn + completed) / attendance.length) * 100) : 0}%</b> Arrival rate</span></div></div>
    {showGuest && <form className="workspace-form management-form" onSubmit={submitGuest}><div className="card-heading"><div><span className="dash-eyebrow">MANUAL ENTRY</span><h2>Add a guest to today’s list.</h2></div></div><div className="form-grid"><Field label="Guest name" error={errors.attendee}><input value={guest.attendee} onChange={event => { setGuest(current => ({ ...current, attendee: event.target.value })); setErrors(current => ({ ...current, attendee: '' })) }}/></Field><Field label="Email" error={errors.email}><input type="email" value={guest.email} onChange={event => { setGuest(current => ({ ...current, email: event.target.value })); setErrors(current => ({ ...current, email: '' })) }}/></Field><Field label="Expo"><select value={guest.expoId} onChange={event => setGuest(current => ({ ...current, expoId: event.target.value }))}>{expos.map(expo => <option key={expo.id} value={expo.id}>{expo.title}</option>)}</select></Field><Field label="Ticket number" error={errors.ticket}><input value={guest.ticket} onChange={event => { setGuest(current => ({ ...current, ticket: event.target.value })); setErrors(current => ({ ...current, ticket: '' })) }} placeholder="ES-0000"/></Field></div><div className="form-actions"><button type="button" className="outline-button" onClick={() => setShowGuest(false)}>Cancel</button><button type="submit" className="dash-primary">Add to list<Check size={15}/></button></div></form>}
    <div className="view-toolbar management-toolbar"><div className="toolbar-search"><Search size={16}/><span>{search || 'Search by name, email, or ticket'}</span></div><div><select value={expoFilter} onChange={event => setExpoFilter(event.target.value)} aria-label="Filter attendance by expo"><option value="all">All expos</option>{expos.map(expo => <option value={expo.id} key={expo.id}>{expo.title}</option>)}</select><select value={statusFilter} onChange={event => setStatusFilter(event.target.value)} aria-label="Filter attendance by status"><option value="all">All attendance</option><option value="expected">Expected</option><option value="checked-in">Checked in</option><option value="checked-out">Checked out</option></select></div></div>
    {filtered.length ? <div className="table-card management-table"><div className="table-head attendance-table"><span>Guest</span><span>Expo / ticket</span><span>Check in</span><span>Check out</span><span>Status</span><span>Action</span></div>{filtered.map(item => <div className="table-row attendance-table" key={item.id}><div className="user-cell"><span>{item.attendee.slice(0, 2).toUpperCase()}</span><div><strong>{item.attendee}</strong><small>{item.email}</small></div></div><div><strong>{expos.find(expo => expo.id === item.expoId)?.title}</strong><small>{item.ticket}</small></div><span>{readableTime(item.checkedInAt)}</span><span>{readableTime(item.checkedOutAt)}</span><Status value={item.status}/><div className="attendance-action">{item.status === 'expected' && <button className="check-in-button" onClick={() => updateAttendance(item.id, 'check-in')}><ScanLine size={14}/> Check in</button>}{item.status === 'checked-in' && <button className="check-out-button" onClick={() => updateAttendance(item.id, 'check-out')}><Clock3 size={14}/> Check out</button>}{item.status === 'checked-out' && <span className="complete-mark"><Check size={14}/> Complete</span>}</div></div>)}</div> : <EmptyState title="No attendance records found" copy="Try another expo, status, or search term."/>}
  </div>
}

export default AttendanceScreen

