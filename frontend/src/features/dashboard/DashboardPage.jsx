import { Navigate } from 'react-router-dom'
import { useAuth } from '../../state/AuthContext'
import OverviewPage from './pages/OverviewPage'
import AccountPage from './pages/AccountPage'
import MessagesPage from './pages/MessagesPage'
import NotificationsPage from './pages/NotificationsPage'
import FeedbackPage from './pages/FeedbackPage'
import OrganizerExposPage from '../organizer/pages/ExposPage'
import ExpoFormPage from '../organizer/pages/ExpoFormPage'
import ApplicationsPage from '../organizer/pages/ApplicationsPage'
import OrganizerBoothsPage from '../organizer/pages/BoothsPage'
import OrganizerSessionsPage from '../organizer/pages/SessionsPage'
import SessionFormPage from '../organizer/pages/SessionFormPage'
import RegistrationsPage from '../organizer/pages/RegistrationsPage'
import AnalyticsPage from '../organizer/pages/AnalyticsPage'
import UserManagementPage from '../organizer/pages/UserManagementPage'
import AttendancePage from '../organizer/pages/AttendancePage'
import ExhibitorProfilePage from '../exhibitor/pages/ProfilePage'
import ExhibitorExposPage from '../exhibitor/pages/ExposPage'
import ExhibitorApplicationsPage from '../exhibitor/pages/ApplicationsPage'
import ExhibitorBoothsPage from '../exhibitor/pages/BoothsPage'
import ExhibitorSessionsPage from '../exhibitor/pages/SessionsPage'
import AttendeeExposPage from '../attendee/pages/ExposPage'
import AttendeeExhibitorsPage from '../attendee/pages/ExhibitorsPage'
import AttendeeBoothsPage from '../attendee/pages/BoothsPage'
import AttendeeSessionsPage from '../attendee/pages/SessionsPage'
import AttendeeBookmarksPage from '../attendee/pages/BookmarksPage'

const rolePages = {
  organizer: {
    overview: OverviewPage,
    expos: OrganizerExposPage,
    expoNew: ExpoFormPage,
    expoEdit: ExpoFormPage,
    applications: ApplicationsPage,
    booths: OrganizerBoothsPage,
    sessions: OrganizerSessionsPage,
    sessionNew: SessionFormPage,
    sessionEdit: SessionFormPage,
    registrations: RegistrationsPage,
    attendance: AttendancePage,
    users: UserManagementPage,
    analytics: AnalyticsPage,
    feedback: FeedbackPage,
    notifications: NotificationsPage,
    messages: MessagesPage,
    account: AccountPage,
  },
  exhibitor: {
    overview: OverviewPage,
    profile: ExhibitorProfilePage,
    expos: ExhibitorExposPage,
    applications: ExhibitorApplicationsPage,
    booths: ExhibitorBoothsPage,
    sessions: ExhibitorSessionsPage,
    messages: MessagesPage,
    feedback: FeedbackPage,
    notifications: NotificationsPage,
    account: AccountPage,
  },
  attendee: {
    overview: OverviewPage,
    expos: AttendeeExposPage,
    exhibitors: AttendeeExhibitorsPage,
    booths: AttendeeBoothsPage,
    sessions: AttendeeSessionsPage,
    bookmarks: AttendeeBookmarksPage,
    feedback: FeedbackPage,
    notifications: NotificationsPage,
    messages: MessagesPage,
    account: AccountPage,
  },
}

export default function DashboardPage({ page }) {
  const { user, loading } = useAuth()
  if (loading) return <p className="section wrap" role="status">Loading your account...</p>

  const role = user?.role === 'admin' ? 'organizer' : user?.role
  const Page = rolePages[role]?.[page]
  if (!Page) return <Navigate to="/dashboard" replace />
  return <Page />
}
