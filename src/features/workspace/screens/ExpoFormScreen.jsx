import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Activity, ArrowLeft, ArrowRight, Bell, Bookmark, Building2, CalendarDays, Check, Clock3, Edit3, Grid3X3, Plus, Search, ScanLine, ShieldCheck, Trash2, UserCircle, UserPlus, Users, X } from 'lucide-react'
import { useWorkspaceData } from '../../../state/WorkspaceDataContext'
import { publicExhibitors as mockExhibitors } from '../../../data/publicData'
import { roleDetails, emptyExpo, emptySession, Status, EmptyState, Field } from '../workspaceCommon'

function ExpoFormScreen({ editId, go }) {
  const { expos, saveExpo } = useWorkspaceData()
  const existing = expos.find(item => item.id === Number(editId))
  const [values, setValues] = useState(existing || emptyExpo)
  const [errors, setErrors] = useState({})
  function update(event) { setValues(current => ({ ...current, [event.target.name]: event.target.value })); setErrors(current => ({ ...current, [event.target.name]: '' })) }
  function submit(event) {
    event.preventDefault()
    const next = {}
    ;['title', 'description', 'location', 'startDate', 'endDate'].forEach(key => { if (!String(values[key] || '').trim()) next[key] = 'This field is required.' })
    if (values.startDate && values.endDate && values.endDate < values.startDate) next.endDate = 'End date must be after the start date.'
    setErrors(next)
    if (Object.keys(next).length) return
    saveExpo({ ...values, id: existing?.id, capacity: Number(values.capacity) || 0 })
    go('expos')
  }
  return <div className="dash-view"><div className="page-intro"><div><button className="back-link" onClick={() => go('expos')}><ArrowLeft size={15}/> Back to expos</button><span className="dash-eyebrow">{existing ? 'EDIT EXPO' : 'NEW EXPO'}</span><h1>{existing ? 'Update the event details.' : 'Start with the essentials.'}</h1><p>Give the event a clear name, place, timeline, and status.</p></div></div><form className="workspace-form" onSubmit={submit} noValidate><div className="form-grid"><Field label="Expo title" error={errors.title}><input name="title" value={values.title} onChange={update} placeholder="Future Makers Expo"/></Field><Field label="Theme"><input name="theme" value={values.theme} onChange={update} placeholder="Ideas that move us forward"/></Field><Field label="Location" error={errors.location}><input name="location" value={values.location} onChange={update} placeholder="Venue or address"/></Field><Field label="Capacity"><input name="capacity" type="number" min="0" value={values.capacity} onChange={update} placeholder="1200"/></Field><Field label="Start date" error={errors.startDate}><input name="startDate" type="date" value={values.startDate} onChange={update}/></Field><Field label="End date" error={errors.endDate}><input name="endDate" type="date" value={values.endDate} onChange={update}/></Field><Field label="Registration deadline"><input name="deadline" type="date" value={values.deadline} onChange={update}/></Field><Field label="Status"><select name="status" value={values.status} onChange={update}><option value="draft">Draft</option><option value="published">Published</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select></Field><Field label="Description" error={errors.description}><textarea name="description" value={values.description} onChange={update} rows="5" placeholder="What should people know about this event?"/></Field></div><div className="form-actions"><button type="button" className="outline-button" onClick={() => go('expos')}>Cancel</button><button className="dash-primary" type="submit">{existing ? 'Save changes' : 'Create expo'}<Check size={16}/></button></div></form></div>
}

export default ExpoFormScreen

