import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Activity, ArrowLeft, ArrowRight, Bell, Bookmark, Building2, CalendarDays, Check, Clock3, Edit3, Grid3X3, Plus, Search, ScanLine, ShieldCheck, Trash2, UserCircle, UserPlus, Users, X } from 'lucide-react'
import { useWorkspaceData } from '../../../state/WorkspaceDataContext'
import { publicExhibitors as mockExhibitors } from '../../../data/publicData'
import { roleDetails, emptyExpo, emptySession, Status, EmptyState, Field } from '../workspaceCommon'

function SessionFormScreen({ editId, go }) {
  const { sessions, expos, saveSession } = useWorkspaceData()
  const existing = sessions.find(item => item.id === Number(editId))
  const [values, setValues] = useState(existing || emptySession)
  const [errors, setErrors] = useState({})
  function update(event) { setValues(current => ({ ...current, [event.target.name]: event.target.value })); setErrors(current => ({ ...current, [event.target.name]: '' })) }
  function submit(event) { event.preventDefault(); const next = {}; ['title', 'speaker', 'date', 'startTime', 'endTime', 'location'].forEach(key => { if (!String(values[key] || '').trim()) next[key] = 'Required.' }); if (values.startTime && values.endTime && values.endTime <= values.startTime) next.endTime = 'End time must be later.'; setErrors(next); if (Object.keys(next).length) return; saveSession({ ...values, id: existing?.id, expoId: Number(values.expoId), capacity: Number(values.capacity) || 0 }); go('sessions') }
  return <div className="dash-view"><div className="page-intro"><div><button className="back-link" onClick={() => go('sessions')}><ArrowLeft size={15}/> Back to sessions</button><span className="dash-eyebrow">{existing ? 'EDIT SESSION' : 'NEW SESSION'}</span><h1>{existing ? 'Update the session.' : 'Add a new session.'}</h1></div></div><form className="workspace-form" onSubmit={submit}><div className="form-grid"><Field label="Expo"><select name="expoId" value={values.expoId} onChange={update}>{expos.map(expo => <option value={expo.id} key={expo.id}>{expo.title}</option>)}</select></Field><Field label="Session type"><select name="type" value={values.type} onChange={update}><option value="session">Session</option><option value="workshop">Workshop</option><option value="seminar">Seminar</option><option value="keynote">Keynote</option></select></Field><Field label="Title" error={errors.title}><input name="title" value={values.title} onChange={update}/></Field><Field label="Speaker" error={errors.speaker}><input name="speaker" value={values.speaker} onChange={update}/></Field><Field label="Topic"><input name="topic" value={values.topic} onChange={update}/></Field><Field label="Location" error={errors.location}><input name="location" value={values.location} onChange={update}/></Field><Field label="Date" error={errors.date}><input name="date" type="date" value={values.date} onChange={update}/></Field><Field label="Capacity"><input name="capacity" type="number" value={values.capacity} onChange={update}/></Field><Field label="Start time" error={errors.startTime}><input name="startTime" type="time" value={values.startTime} onChange={update}/></Field><Field label="End time" error={errors.endTime}><input name="endTime" type="time" value={values.endTime} onChange={update}/></Field><Field label="Description"><textarea name="description" rows="4" value={values.description} onChange={update}/></Field></div><div className="form-actions"><button type="button" className="outline-button" onClick={() => go('sessions')}>Cancel</button><button className="dash-primary" type="submit">Save session<Check size={16}/></button></div></form></div>
}

export default SessionFormScreen

