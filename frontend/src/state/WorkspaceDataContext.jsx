import { createContext, useContext, useMemo, useState } from 'react'
import { expos as startingExpos } from '../data/expos'
import { sessions as startingSessions } from '../data/sessions'
import { applications as startingApplications } from '../data/applications'
import { booths as startingBooths } from '../data/booths'
import { users as startingUsers } from '../data/users'
import { attendance as startingAttendance } from '../data/attendance'
import { notifications as startingNotifications } from '../data/notifications'
import { feedback as startingFeedback } from '../data/feedback'
import { registrations as startingRegistrations } from '../data/registrations'

const WorkspaceDataContext = createContext(null)

export function WorkspaceDataProvider({ children }) {
  const [expos, setExpos] = useState(startingExpos)
  const [sessions, setSessions] = useState(startingSessions)
  const [applications, setApplications] = useState(startingApplications)
  const [booths, setBooths] = useState(startingBooths)
  const [users, setUsers] = useState(startingUsers)
  const [attendance, setAttendance] = useState(startingAttendance)
  const [notifications, setNotifications] = useState(startingNotifications)
  const [feedback, setFeedback] = useState(startingFeedback)
  const [registrations, setRegistrations] = useState(startingRegistrations)
  const [sessionRegistrations, setSessionRegistrations] = useState([1])
  const [bookmarks, setBookmarks] = useState([1])
  const [profile, setProfile] = useState({ companyName: 'Northstar Labs', description: 'Tools for thoughtful, connected teams.', products: 'Team planning tools, Event displays', services: 'Product demos, Consulting', website: 'https://northstar.example', contactPerson: 'Hassan Ali', phone: '+92 300 1234567', staff: 'Hassan Ali, Areeba Khan' })
  const [toast, setToast] = useState('')

  function notify(message) {
    setToast(message)
    window.setTimeout(() => setToast(''), 2600)
  }

  function saveExpo(expo) {
    if (expo.id) setExpos(items => items.map(item => item.id === expo.id ? expo : item))
    else setExpos(items => [...items, { ...expo, id: Date.now() }])
    notify(expo.id ? 'Expo updated successfully.' : 'Expo created successfully.')
  }

  function deleteExpo(id) { setExpos(items => items.filter(item => item.id !== id)); notify('Expo deleted.') }
  function saveSession(session) { if (session.id) setSessions(items => items.map(item => item.id === session.id ? session : item)); else setSessions(items => [...items, { ...session, id: Date.now() }]); notify(session.id ? 'Session updated.' : 'Session created.') }
  function deleteSession(id) { setSessions(items => items.filter(item => item.id !== id)); notify('Session deleted.') }
  function updateApplication(id, status, remarks = '') { setApplications(items => items.map(item => item.id === id ? { ...item, status, remarks } : item)); notify(`Application ${status}.`) }
  function addApplication(expoId) { setApplications(items => [...items, { id: Date.now(), expoId, company: 'Northstar Labs', exhibitor: 'Hassan Ali', status: 'pending', submitted: new Date().toISOString().slice(0, 10), remarks: '' }]); notify('Application submitted.') }
  function saveBooth(booth) { setBooths(items => [...items, { ...booth, id: Date.now() }]); notify('Booth created.') }
  function deleteBooth(id) { setBooths(items => items.filter(item => item.id !== id)); notify('Booth deleted.') }
  function assignBooth(id, exhibitor) { setBooths(items => items.map(item => item.id === id ? { ...item, exhibitor, status: exhibitor ? 'occupied' : 'available' } : item)); notify(exhibitor ? 'Booth assigned.' : 'Booth released.') }
  function requestBooth(id) { setBooths(items => items.map(item => item.id === id ? { ...item, status: 'reserved', exhibitor: 'Northstar Labs' } : item)); notify('Booth request submitted.') }
  function toggleBookmark(id) { setBookmarks(items => items.includes(id) ? items.filter(item => item !== id) : [...items, id]) }
  function toggleSessionRegistration(id) { setSessionRegistrations(items => items.includes(id) ? items.filter(item => item !== id) : [...items, id]); notify(sessionRegistrations.includes(id) ? 'Session registration cancelled.' : 'Session registration confirmed.') }
  function registerExpo(expoId) { if (!registrations.some(item => item.expoId === expoId)) setRegistrations(items => [...items, { id: Date.now(), expoId, attendee: 'Mariam Khan', status: 'registered', registeredAt: new Date().toISOString().slice(0, 10) }]); notify('Expo registration confirmed.') }
  function markNotification(id) { setNotifications(items => items.map(item => item.id === id ? { ...item, read: true } : item)) }
  function markAllNotifications() { setNotifications(items => items.map(item => ({ ...item, read: true }))); notify('All notifications marked as read.') }
  function addFeedback(item) { setFeedback(items => [{ ...item, id: Date.now(), status: 'new' }, ...items]); notify('Feedback submitted.') }
  function updateFeedback(id, status) { setFeedback(items => items.map(item => item.id === id ? { ...item, status } : item)); notify('Feedback status updated.') }
  function inviteUser(user) { setUsers(items => [{ ...user, id: Date.now(), status: 'invited', joinedAt: new Date().toISOString().slice(0, 10), lastSeen: 'Not signed in' }, ...items]); notify('Invitation added to the demo workspace.') }
  function updateUser(id, changes) { setUsers(items => items.map(item => item.id === id ? { ...item, ...changes } : item)); notify('User updated.') }
  function removeUser(id) { setUsers(items => items.filter(item => item.id !== id)); notify('User removed from the workspace.') }
  function updateAttendance(id, action) { const timestamp = new Date().toISOString().slice(0, 16); setAttendance(items => items.map(item => { if (item.id !== id) return item; if (action === 'check-in') return { ...item, status: 'checked-in', checkedInAt: timestamp, checkedOutAt: '' }; return { ...item, status: 'checked-out', checkedOutAt: timestamp } })); notify(action === 'check-in' ? 'Attendee checked in.' : 'Attendee checked out.') }
  function addAttendance(record) { setAttendance(items => [{ ...record, id: Date.now(), status: 'expected', checkedInAt: '', checkedOutAt: '' }, ...items]); notify('Guest added to the attendance list.') }

  const value = useMemo(() => ({ expos, sessions, applications, booths, notifications, feedback, registrations, sessionRegistrations, bookmarks, profile, users, attendance, toast, setProfile, saveExpo, deleteExpo, saveSession, deleteSession, addApplication, updateApplication, saveBooth, deleteBooth, assignBooth, requestBooth, toggleBookmark, toggleSessionRegistration, registerExpo, markNotification, markAllNotifications, addFeedback, updateFeedback, inviteUser, updateUser, removeUser, updateAttendance, addAttendance }), [expos, sessions, applications, booths, notifications, feedback, registrations, sessionRegistrations, bookmarks, profile, users, attendance, toast])
  return <WorkspaceDataContext.Provider value={value}>{children}</WorkspaceDataContext.Provider>
}

export function useWorkspaceData() {
  const value = useContext(WorkspaceDataContext)
  if (!value) throw new Error('useWorkspaceData must be used inside WorkspaceDataProvider')
  return value
}
