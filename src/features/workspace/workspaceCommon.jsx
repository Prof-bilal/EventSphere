import { Activity, Bell, Bookmark, Building2, CalendarDays, ClipboardList, Grid3X3, LayoutDashboard, MessageCircle, ScanLine, Star, UserCircle, UserCog } from 'lucide-react'

export const roleDetails = {
  organizer: { label: 'Organizer', name: 'Amina Rahman', intro: 'Your event, at a glance.', nav: [['overview', 'Overview', LayoutDashboard], ['expos', 'Expos', Building2], ['applications', 'Applications', ClipboardList], ['booths', 'Booths', Grid3X3], ['sessions', 'Sessions', CalendarDays], ['registrations', 'Registrations', UserCog], ['attendance', 'Attendance', ScanLine], ['users', 'User management', UserCog], ['analytics', 'Analytics', Activity], ['feedback', 'Feedback', Star], ['notifications', 'Notifications', Bell]] },
  exhibitor: { label: 'Exhibitor', name: 'Northstar Labs', intro: 'Welcome back, Northstar.', nav: [['overview', 'Overview', LayoutDashboard], ['profile', 'Company profile', UserCircle], ['expos', 'Find expos', Building2], ['applications', 'Applications', ClipboardList], ['booths', 'Booth', Grid3X3], ['sessions', 'Schedule', CalendarDays], ['messages', 'Messages', MessageCircle], ['feedback', 'Feedback', Star], ['notifications', 'Notifications', Bell]] },
  attendee: { label: 'Attendee', name: 'Mariam Khan', intro: 'Make the most of your visit.', nav: [['overview', 'Overview', LayoutDashboard], ['expos', 'Explore expos', Building2], ['exhibitors', 'Exhibitors', UserCog], ['booths', 'Floor plan', Grid3X3], ['sessions', 'Schedule', CalendarDays], ['bookmarks', 'My plans', Bookmark], ['feedback', 'Feedback', Star], ['notifications', 'Notifications', Bell]] },
}

export const emptyExpo = { title: '', description: '', theme: '', location: '', startDate: '', endDate: '', deadline: '', status: 'draft', capacity: '' }
export const emptySession = { expoId: 1, title: '', description: '', speaker: '', topic: '', date: '', startTime: '', endTime: '', location: '', capacity: '', type: 'session' }
export function Status({ value }) { return <span className={`status-pill ${String(value).toLowerCase().replaceAll(' ', '-')}`}>{value}</span> }
export function EmptyState({ title, copy }) { return <div className="empty-state"><span aria-hidden="true">⌕</span><h3>{title}</h3><p>{copy}</p></div> }
export function Field({ label, error, children }) { return <label className="workspace-field"><span>{label}</span>{children}{error && <small>{error}</small>}</label> }
