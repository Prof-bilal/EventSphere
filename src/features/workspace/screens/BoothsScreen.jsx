import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Activity, ArrowLeft, ArrowRight, Bell, Bookmark, Building2, CalendarDays, Check, Clock3, Edit3, Grid3X3, Plus, Search, ScanLine, ShieldCheck, Trash2, UserCircle, UserPlus, Users, X } from 'lucide-react'
import { useWorkspaceData } from '../../../state/WorkspaceDataContext'
import { publicExhibitors as mockExhibitors } from '../../../data/publicData'
import { roleDetails, emptyExpo, emptySession, Status, EmptyState, Field } from '../workspaceCommon'

function BoothsScreen({ role, search }) {
  const { booths, assignBooth, requestBooth, saveBooth, deleteBooth } = useWorkspaceData()
  const [selectedId, setSelectedId] = useState(booths[0]?.id)
  const [newNumber, setNewNumber] = useState('')
  const [assignee, setAssignee] = useState('Northstar Labs')
  const filtered = booths.filter(item => `${item.number} ${item.category} ${item.exhibitor}`.toLowerCase().includes(search.toLowerCase()))
  const selected = booths.find(item => item.id === selectedId)
  function addBooth(event) { event.preventDefault(); if (!newNumber.trim()) return; saveBooth({ number: newNumber.toUpperCase(), floor: 'Hall A', size: 'Standard', category: 'General', status: 'available', exhibitor: '', expoId: 1 }); setNewNumber('') }
  return <div className="dash-view"><div className="page-intro"><div><span className="dash-eyebrow">FLOOR PLAN</span><h1>{role === 'organizer' ? 'Make room for everyone.' : role === 'exhibitor' ? 'Find your place on the floor.' : 'Know where you’re going.'}</h1><p>Available, reserved, and occupied spaces update as actions are taken.</p></div></div>{role === 'organizer' && <form className="inline-form" onSubmit={addBooth}><input value={newNumber} onChange={event => setNewNumber(event.target.value)} placeholder="New booth number, e.g. C01"/><button className="dash-primary" type="submit"><Plus size={15}/> Add booth</button></form>}<div className="booth-layout"><section className="dash-card floor-card"><div className="floor-top"><span>HALL A</span><span><i className="legend available"/>Available <i className="legend reserved"/>Reserved <i className="legend occupied"/>Occupied</span></div><div className="booth-map">{filtered.map(booth => <button key={booth.id} className={`${booth.status} ${selectedId === booth.id ? 'selected' : ''}`} onClick={() => setSelectedId(booth.id)}>{booth.number}<small>{booth.status}</small></button>)}</div></section>{selected && <aside className="dash-card booth-detail"><span className="dash-eyebrow">SELECTED BOOTH</span><h2>{selected.number}</h2><Status value={selected.status}/><p>{selected.floor} · {selected.size} · {selected.category}</p>{selected.exhibitor && <p><strong>Assigned to:</strong> {selected.exhibitor}</p>}{role === 'organizer' && <><select value={assignee} onChange={event => setAssignee(event.target.value)}><option>Northstar Labs</option><option>Paper & Form</option><option>Mosaic Works</option><option>Bright Loop</option></select><button className="dash-primary" onClick={() => assignBooth(selected.id, assignee)}>Assign booth</button><button className="danger-button" onClick={() => window.confirm('Delete this booth?') && deleteBooth(selected.id)}><Trash2 size={14}/> Delete booth</button></>}{role === 'exhibitor' && <button className="dash-primary" disabled={selected.status === 'occupied'} onClick={() => requestBooth(selected.id)}>{selected.status === 'available' ? 'Request this booth' : selected.exhibitor === 'Northstar Labs' ? 'Requested' : 'Unavailable'}</button>}{role === 'attendee' && <Link className="text-link" to="/exhibitors">View nearby exhibitors <ArrowRight size={15}/></Link>}</aside>}</div></div>
}

export default BoothsScreen

