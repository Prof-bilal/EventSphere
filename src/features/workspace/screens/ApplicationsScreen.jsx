import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Activity, ArrowLeft, ArrowRight, Bell, Bookmark, Building2, CalendarDays, Check, Clock3, Edit3, Grid3X3, Plus, Search, ScanLine, ShieldCheck, Trash2, UserCircle, UserPlus, Users, X } from 'lucide-react'
import { useWorkspaceData } from '../../../state/WorkspaceDataContext'
import { publicExhibitors as mockExhibitors } from '../../../data/publicData'
import { roleDetails, emptyExpo, emptySession, Status, EmptyState, Field } from '../workspaceCommon'

function ApplicationsScreen({ role, search }) {
  const { applications, expos, updateApplication } = useWorkspaceData()
  const [filter, setFilter] = useState('all')
  const [remarks, setRemarks] = useState({})
  const [review, setReview] = useState(null)
  const base = role === 'exhibitor' ? applications.filter(item => item.company === 'Northstar Labs') : applications
  const filtered = base.filter(item => (filter === 'all' || item.status === filter) && `${item.company} ${item.exhibitor}`.toLowerCase().includes(search.toLowerCase()))
  function openReview(item, status) { setReview({ item, status, remarks: remarks[item.id] ?? item.remarks ?? '' }) }
  function confirmReview() { updateApplication(review.item.id, review.status, review.remarks); setRemarks(current => ({ ...current, [review.item.id]: review.remarks })); setReview(null) }
  return <div className="dash-view"><div className="page-intro"><div><span className="dash-eyebrow">APPLICATIONS</span><h1>{role === 'organizer' ? 'Review every application clearly.' : 'Follow your application progress.'}</h1><p>Statuses and organizer remarks stay together.</p></div></div><div className="filter-tabs">{['all', 'pending', 'approved', 'rejected'].map(item => <button className={filter === item ? 'active' : ''} onClick={() => setFilter(item)} key={item}>{item}</button>)}</div>{filtered.length ? <div className="application-list">{filtered.map(item => <article className="dash-card application-card" key={item.id}><div><span className="dash-eyebrow">{expos.find(expo => expo.id === item.expoId)?.title}</span><h2>{item.company}</h2><p>{item.exhibitor} · Submitted {item.submitted}</p></div><Status value={item.status}/>{role === 'organizer' && <div className="review-actions"><button className="approve" onClick={() => openReview(item, 'approved')}>Approve</button><button className="reject" onClick={() => openReview(item, 'rejected')}>Reject</button></div>}{role === 'exhibitor' && item.remarks && <div className="application-remark"><strong>Organizer note</strong><p>{item.remarks}</p></div>}</article>)}</div> : <EmptyState title="No applications found" copy="Change the filter or search term."/>}{review && <div className="modal-backdrop" role="presentation" onMouseDown={event => event.target === event.currentTarget && setReview(null)}><div className="review-modal" role="dialog" aria-modal="true" aria-labelledby="review-modal-title"><button className="modal-close" onClick={() => setReview(null)} aria-label="Close review modal"><X size={17}/></button><span className="dash-eyebrow">{review.status === 'approved' ? 'APPROVE APPLICATION' : 'REJECT APPLICATION'}</span><h2 id="review-modal-title">{review.status === 'approved' ? 'Approve this application?' : 'Reject this application?'}</h2><p className="modal-copy">{review.item.company} · {review.item.exhibitor}</p><label className="modal-field"><span>Organizer remarks</span><textarea rows="4" value={review.remarks} onChange={event => setReview(current => ({ ...current, remarks: event.target.value }))} placeholder={review.status === 'approved' ? 'Add a note for the exhibitor...' : 'Explain what needs to change...'}/></label><div className="modal-actions"><button className="outline-button" onClick={() => setReview(null)}>Cancel</button><button className={review.status === 'approved' ? 'approve modal-confirm' : 'reject modal-confirm'} onClick={confirmReview}>{review.status === 'approved' ? 'Approve application' : 'Reject application'}<Check size={15}/></button></div></div></div>}</div>
}

export default ApplicationsScreen

