import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Activity, ArrowLeft, ArrowRight, Bell, Bookmark, Building2, CalendarDays, Check, Clock3, Edit3, Grid3X3, Plus, Search, ScanLine, ShieldCheck, Trash2, UserCircle, UserPlus, Users, X } from 'lucide-react'
import { useWorkspaceData } from '../../../state/WorkspaceDataContext'
import { publicExhibitors as mockExhibitors } from '../../../data/publicData'
import { roleDetails, emptyExpo, emptySession, Status, EmptyState, Field } from '../workspaceCommon'

function MessagesScreen() {
  const [messages, setMessages] = useState([{ id: 1, from: 'Organizer team', text: 'Welcome to Future Makers Expo. Let us know if you need help with your booth.', mine: false }])
  const [draft, setDraft] = useState('')
  function send(event) { event.preventDefault(); if (!draft.trim()) return; setMessages(items => [...items, { id: Date.now(), from: 'Northstar Labs', text: draft.trim(), mine: true }]); setDraft('') }
  return <div className="dash-view"><div className="page-intro"><div><span className="dash-eyebrow">ORGANIZER CONTACT</span><h1>Keep the conversation moving.</h1><p>Ask questions and keep event details clear.</p></div></div><div className="message-panel"><aside><strong>Organizer team</strong><small>Future Makers Expo</small></aside><section><div className="message-list">{messages.map(item => <div className={item.mine ? 'message mine' : 'message'} key={item.id}><strong>{item.from}</strong><p>{item.text}</p></div>)}</div><form onSubmit={send}><input value={draft} onChange={event => setDraft(event.target.value)} placeholder="Write a message..."/><button className="dash-primary" type="submit">Send<ArrowRight size={15}/></button></form></section></div></div>
}

export default MessagesScreen

