import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from '../features/public/pages/HomePage'
import LoginPage from '../features/auth/pages/LoginPage'
import RegisterPage from '../features/auth/pages/RegisterPage'
import ForgotPasswordPage from '../features/auth/pages/ForgotPasswordPage'
import ResetPasswordPage from '../features/auth/pages/ResetPasswordPage'
import AuthStatusPage from '../features/auth/components/AuthStatusPage'
import AboutPage from '../features/public/pages/AboutPage'
import ContactPage from '../features/public/pages/ContactPage'
import EventDetailPage from '../features/public/pages/EventDetailPage'
import EventsPage from '../features/public/pages/EventsPage'
import ExhibitorsPage from '../features/public/pages/ExhibitorsPage'
import FloorPlanPage from '../features/public/pages/FloorPlanPage'
import SchedulePage from '../features/public/pages/SchedulePage'
import WorkspaceLayout from '../components/layout/WorkspaceLayout'
import OrganizerOverviewPage from '../features/organizer/pages/OverviewPage'
import OrganizerExposPage from '../features/organizer/pages/ExposPage'
import ExpoFormPage from '../features/organizer/pages/ExpoFormPage'
import ApplicationsPage from '../features/organizer/pages/ApplicationsPage'
import BoothsPage from '../features/organizer/pages/BoothsPage'
import SessionsPage from '../features/organizer/pages/SessionsPage'
import SessionFormPage from '../features/organizer/pages/SessionFormPage'
import RegistrationsPage from '../features/organizer/pages/RegistrationsPage'
import AnalyticsPage from '../features/organizer/pages/AnalyticsPage'
import FeedbackPage from '../features/organizer/pages/FeedbackPage'
import NotificationsPage from '../features/organizer/pages/NotificationsPage'
import UserManagementPage from '../features/organizer/pages/UserManagementPage'
import AttendancePage from '../features/organizer/pages/AttendancePage'
import ExhibitorOverviewPage from '../features/exhibitor/pages/OverviewPage'
import ExhibitorProfilePage from '../features/exhibitor/pages/ProfilePage'
import ExhibitorExposPage from '../features/exhibitor/pages/ExposPage'
import ExhibitorApplicationsPage from '../features/exhibitor/pages/ApplicationsPage'
import ExhibitorBoothsPage from '../features/exhibitor/pages/BoothsPage'
import ExhibitorSessionsPage from '../features/exhibitor/pages/SessionsPage'
import ExhibitorMessagesPage from '../features/exhibitor/pages/MessagesPage'
import ExhibitorFeedbackPage from '../features/exhibitor/pages/FeedbackPage'
import ExhibitorNotificationsPage from '../features/exhibitor/pages/NotificationsPage'
import AttendeeOverviewPage from '../features/attendee/pages/OverviewPage'
import AttendeeExposPage from '../features/attendee/pages/ExposPage'
import AttendeeExhibitorsPage from '../features/attendee/pages/ExhibitorsPage'
import AttendeeBoothsPage from '../features/attendee/pages/BoothsPage'
import AttendeeSessionsPage from '../features/attendee/pages/SessionsPage'
import AttendeeBookmarksPage from '../features/attendee/pages/BookmarksPage'
import AttendeeFeedbackPage from '../features/attendee/pages/FeedbackPage'
import AttendeeNotificationsPage from '../features/attendee/pages/NotificationsPage'

export default function AppRouter() {
  return <Routes>
    <Route path="/" element={<HomePage/>}/><Route path="/login" element={<LoginPage/>}/><Route path="/register" element={<RegisterPage/>}/><Route path="/forgot-password" element={<ForgotPasswordPage/>}/><Route path="/reset-password" element={<ResetPasswordPage/>}/>
    <Route path="/verify-email" element={<AuthStatusPage type="verify"/>}/><Route path="/verify-email/success" element={<AuthStatusPage type="verified"/>}/><Route path="/verify-email/expired" element={<AuthStatusPage type="expired"/>}/><Route path="/verify-email/invalid" element={<AuthStatusPage type="invalid"/>}/><Route path="/reset-password/sent" element={<AuthStatusPage type="sent"/>}/><Route path="/reset-password/success" element={<AuthStatusPage type="resetSuccess"/>}/><Route path="/reset-password/invalid" element={<AuthStatusPage type="resetInvalid"/>}/>
    <Route path="/events" element={<EventsPage/>}/><Route path="/events/:id" element={<EventDetailPage/>}/><Route path="/exhibitors" element={<ExhibitorsPage/>}/><Route path="/schedule" element={<SchedulePage/>}/><Route path="/floor-plan" element={<FloorPlanPage/>}/><Route path="/about" element={<AboutPage/>}/><Route path="/contact" element={<ContactPage/>}/>
    <Route path="/organizer" element={<WorkspaceLayout role="organizer"/>}><Route index element={<OrganizerOverviewPage/>}/><Route path="expos" element={<OrganizerExposPage/>}/><Route path="expos/new" element={<ExpoFormPage/>}/><Route path="expos/:editId/edit" element={<ExpoFormPage/>}/><Route path="applications" element={<ApplicationsPage/>}/><Route path="booths" element={<BoothsPage/>}/><Route path="sessions" element={<SessionsPage/>}/><Route path="sessions/new" element={<SessionFormPage/>}/><Route path="sessions/:editId/edit" element={<SessionFormPage/>}/><Route path="registrations" element={<RegistrationsPage/>}/><Route path="attendance" element={<AttendancePage/>}/><Route path="attendances/d" element={<AttendancePage/>}/><Route path="users" element={<UserManagementPage/>}/><Route path="analytics" element={<AnalyticsPage/>}/><Route path="feedback" element={<FeedbackPage/>}/><Route path="notifications" element={<NotificationsPage/>}/></Route>
    <Route path="/exhibitor" element={<WorkspaceLayout role="exhibitor"/>}><Route index element={<ExhibitorOverviewPage/>}/><Route path="profile" element={<ExhibitorProfilePage/>}/><Route path="expos" element={<ExhibitorExposPage/>}/><Route path="applications" element={<ExhibitorApplicationsPage/>}/><Route path="booths" element={<ExhibitorBoothsPage/>}/><Route path="sessions" element={<ExhibitorSessionsPage/>}/><Route path="messages" element={<ExhibitorMessagesPage/>}/><Route path="feedback" element={<ExhibitorFeedbackPage/>}/><Route path="notifications" element={<ExhibitorNotificationsPage/>}/></Route>
    <Route path="/attendee" element={<WorkspaceLayout role="attendee"/>}><Route index element={<AttendeeOverviewPage/>}/><Route path="expos" element={<AttendeeExposPage/>}/><Route path="exhibitors" element={<AttendeeExhibitorsPage/>}/><Route path="booths" element={<AttendeeBoothsPage/>}/><Route path="sessions" element={<AttendeeSessionsPage/>}/><Route path="bookmarks" element={<AttendeeBookmarksPage/>}/><Route path="feedback" element={<AttendeeFeedbackPage/>}/><Route path="notifications" element={<AttendeeNotificationsPage/>}/></Route>
    <Route path="/admin/attendance" element={<Navigate to="/organizer/attendance" replace/>}/><Route path="/admin/users" element={<Navigate to="/organizer/users" replace/>}/><Route path="/admin/*" element={<Navigate to="/organizer" replace/>}/><Route path="*" element={<div className="section wrap"><h1>Page not found.</h1><a href="/">Return to EventSphere →</a></div>}/>
  </Routes>
}
