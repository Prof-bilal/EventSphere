import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Activity, ArrowLeft, ArrowRight, Bell, Bookmark, Building2, CalendarDays, Check, Clock3, Edit3, Grid3X3, Plus, Search, ScanLine, ShieldCheck, Trash2, UserCircle, UserPlus, Users, X } from 'lucide-react'
import { useWorkspaceData } from '../../../state/WorkspaceDataContext'
import { publicExhibitors as mockExhibitors } from '../../../data/publicData'
import { roleDetails, emptyExpo, emptySession, Status, EmptyState, Field } from '../workspaceCommon'

function FeedbackScreen({ role }) {
  const { feedback, addFeedback, updateFeedback, expos } = useWorkspaceData()
  const [values, setValues] = useState({ user: role === 'exhibitor' ? 'Hassan Ali' : 'Mariam Khan', expo: expos[0]?.title || '', rating: '5', category: 'suggestion', comment: '' })
  const [error, setError] = useState('')
  function submit(event) { event.preventDefault(); if (values.comment.trim().length < 10) return setError('Please write at least 10 characters.'); addFeedback({ ...values, rating: Number(values.rating) }); setValues(current => ({ ...current, comment: '' })); setError('') }
  if (role === 'organizer') return <div className="dash-view"><div className="page-intro"><div><span className="dash-eyebrow">FEEDBACK & SUPPORT</span><h1>Listen and respond.</h1><p>Review suggestions, complaints, and technical requests.</p></div></div><div className="feedback-list">{feedback.map(item => <article className="dash-card" key={item.id}><div><span className="dash-eyebrow">{item.category} · {item.expo}</span><h2>{item.user}</h2><p>{item.comment}</p><span className="rating">{'★'.repeat(item.rating)}</span></div><select value={item.status} onChange={event => updateFeedback(item.id, event.target.value)}><option value="new">New</option><option value="in-progress">In progress</option><option value="resolved">Resolved</option></select></article>)}</div></div>
  return <div className="dash-view"><div className="page-intro"><div><span className="dash-eyebrow">SHARE FEEDBACK</span><h1>Tell us how it went.</h1><p>Your comments help organizers improve the experience.</p></div></div><form className="workspace-form compact-form" onSubmit={submit}><Field label="Expo"><select value={values.expo} onChange={event => setValues(current => ({ ...current, expo: event.target.value }))}>{expos.map(expo => <option key={expo.id}>{expo.title}</option>)}</select></Field><Field label="Category"><select value={values.category} onChange={event => setValues(current => ({ ...current, category: event.target.value }))}><option value="suggestion">Suggestion</option><option value="complaint">Complaint</option><option value="technical">Technical</option></select></Field><Field label="Rating"><select value={values.rating} onChange={event => setValues(current => ({ ...current, rating: event.target.value }))}>{[5, 4, 3, 2, 1].map(value => <option value={value} key={value}>{value} stars</option>)}</select></Field><Field label="Comment" error={error}><textarea rows="6" value={values.comment} onChange={event => setValues(current => ({ ...current, comment: event.target.value }))} placeholder="What worked well, and what could be better?"/></Field><button className="dash-primary" type="submit">Submit feedback<ArrowRight size={15}/></button></form></div>
}

export default FeedbackScreen

