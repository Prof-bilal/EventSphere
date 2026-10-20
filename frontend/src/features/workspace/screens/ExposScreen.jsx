import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Activity, ArrowLeft, ArrowRight, Bell, Bookmark, Building2, CalendarDays, Check, Clock3, Edit3, Grid3X3, Plus, Search, ScanLine, ShieldCheck, Trash2, UserCircle, UserPlus, Users, X } from 'lucide-react'
import { useWorkspaceData } from '../../../state/WorkspaceDataContext'
import { publicExhibitors as mockExhibitors } from '../../../data/publicData'
import { roleDetails, emptyExpo, emptySession, Status, EmptyState, Field } from '../workspaceCommon'

function ExposScreen({ role, search, go }) {
  const { expos, deleteExpo, registerExpo, registrations, applications, addApplication } = useWorkspaceData()
  const [status, setStatus] = useState('all')
  const filtered = expos.filter(item => (status === 'all' || item.status === status) && `${item.title} ${item.location} ${item.theme}`.toLowerCase().includes(search.toLowerCase()))
  function apply(expoId) { if (!applications.some(item => item.expoId === expoId && item.company === 'Northstar Labs')) addApplication(expoId) }
  return <div className="dash-view">
    <div className="page-intro"><div><span className="dash-eyebrow">{role === 'organizer' ? 'EXPO MANAGEMENT' : 'EVENT DISCOVERY'}</span><h1>{role === 'organizer' ? 'Build an event worth showing up for.' : 'Find your next expo.'}</h1><p>Search, review details, and take the next useful action.</p></div>{role === 'organizer' && <button className="dash-primary" onClick={() => go('expos/new')}><Plus size={16}/> Add expo</button>}</div>
    <div className="view-toolbar"><div className="toolbar-search"><Search size={16}/><span>{search || 'Use the search field in the header'}</span></div><select value={status} onChange={event => setStatus(event.target.value)}><option value="all">All statuses</option><option value="published">Published</option><option value="draft">Draft</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select></div>
    {filtered.length ? role === 'organizer' ? <div className="table-card expo-management-table"><div className="table-head expo-table"><span>Expo</span><span>Dates</span><span>Location</span><span>Status</span><span>Capacity</span><span>Actions</span></div>{filtered.map(expo => <div className="table-row expo-table" key={expo.id}><div className="expo-name-cell"><span className="expo-row-icon"><Building2 size={16}/></span><div><strong>{expo.title}</strong><small>{expo.theme || expo.description}</small></div></div><span>{expo.startDate}<br/><em>to {expo.endDate}</em></span><span>{expo.location}</span><Status value={expo.status}/><span>{expo.capacity || '—'} guests</span><div className="row-actions"><button onClick={() => go(`expos/${expo.id}/edit`)} title="Edit expo"><Edit3 size={14}/></button><button className="danger-link" onClick={() => window.confirm('Delete this expo?') && deleteExpo(expo.id)} title="Delete expo"><Trash2 size={14}/></button></div></div>)}</div> : <div className="expo-grid">{filtered.map(expo => <article className="expo-card" key={expo.id}><div className="expo-card-image"><Status value={expo.status}/><Building2 size={30}/></div><div className="expo-card-content"><span className="dash-eyebrow">{expo.startDate} — {expo.endDate}</span><h2>{expo.title}</h2><p>{expo.location}</p><p>{expo.description}</p><div className="expo-actions">{role === 'exhibitor' ? <button onClick={() => apply(expo.id)} disabled={applications.some(item => item.expoId === expo.id && item.company === 'Northstar Labs')}>{applications.some(item => item.expoId === expo.id && item.company === 'Northstar Labs') ? 'Applied' : 'Apply now'}</button> : <button onClick={() => registerExpo(expo.id)} disabled={registrations.some(item => item.expoId === expo.id)}>{registrations.some(item => item.expoId === expo.id) ? 'Registered' : 'Register'}</button>}</div></div></article>)}</div> : <EmptyState title="No expos found" copy="Try another search or status filter."/>}
  </div>
}

export default ExposScreen

