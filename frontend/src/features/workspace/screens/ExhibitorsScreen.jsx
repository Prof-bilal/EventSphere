import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Activity, ArrowLeft, ArrowRight, Bell, Bookmark, Building2, CalendarDays, Check, Clock3, Edit3, Grid3X3, Plus, Search, ScanLine, ShieldCheck, Trash2, UserCircle, UserPlus, Users, X } from 'lucide-react'
import { useWorkspaceData } from '../../../state/WorkspaceDataContext'
import { publicExhibitors as mockExhibitors } from '../../../data/publicData'
import { roleDetails, emptyExpo, emptySession, Status, EmptyState, Field } from '../workspaceCommon'

function ExhibitorsScreen({ search }) {
  const [category, setCategory] = useState('all')
  const categories = ['all', ...new Set(mockExhibitors.map(item => item.category.toLowerCase()))]
  const filtered = mockExhibitors.filter(item => (category === 'all' || item.category.toLowerCase() === category) && `${item.name} ${item.category} ${item.booth}`.toLowerCase().includes(search.toLowerCase()))
  return <div className="dash-view"><div className="page-intro"><div><span className="dash-eyebrow">EXHIBITOR DIRECTORY</span><h1>Meet the people behind the brands.</h1><p>Search by company, category, or booth location.</p></div><select value={category} onChange={event => setCategory(event.target.value)}>{categories.map(item => <option key={item}>{item}</option>)}</select></div><div className="exhibitor-grid workspace-exhibitors">{filtered.map(item => <article className="exhibitor-card" key={item.id}><div className="exhibitor-logo">{item.name.slice(0, 2)}</div><span className="dash-eyebrow">{item.category}</span><h2>{item.name}</h2><p>{item.description}</p><div><span>Booth {item.booth}</span><ArrowRight size={15}/></div></article>)}</div></div>
}

export default ExhibitorsScreen

