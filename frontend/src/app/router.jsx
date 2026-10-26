import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import HomePage from '../features/public/pages/HomePage'
import LoginPage from '../features/auth/pages/LoginPage'
import RegisterPage from '../features/auth/pages/RegisterPage'
import ForgotPasswordPage from '../features/auth/pages/ForgotPasswordPage'
import ResetPasswordPage from '../features/auth/pages/ResetPasswordPage'
import AuthStatusPage from '../features/auth/components/AuthStatusPage'
import PublicOnlyRoute from '../features/auth/components/PublicOnlyRoute'
import AboutPage from '../features/public/pages/AboutPage'
import ContactPage from '../features/public/pages/ContactPage'
import EventDetailPage from '../features/public/pages/EventDetailPage'
import EventsPage from '../features/public/pages/EventsPage'
import ExhibitorsPage from '../features/public/pages/ExhibitorsPage'
import FloorPlanPage from '../features/public/pages/FloorPlanPage'
import SchedulePage from '../features/public/pages/SchedulePage'
import WorkspaceLayout from '../components/layout/WorkspaceLayout'
import DashboardPage from '../features/dashboard/DashboardPage'
import RegistrationPassPage from '../features/attendee/pages/RegistrationPassPage'

function LegacyDashboardRedirect({ role }) {
  const location = useLocation()
  const prefix = `/${role}`
  const suffix = location.pathname.slice(prefix.length)
  return <Navigate to={`/dashboard${suffix}${location.search}`} replace />
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicOnlyRoute>
            <RegisterPage />
          </PublicOnlyRoute>
        }
      />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/verify-email" element={<AuthStatusPage type="verify" />} />
      <Route path="/verify-email/success" element={<AuthStatusPage type="verified" />} />
      <Route path="/verify-email/expired" element={<AuthStatusPage type="expired" />} />
      <Route path="/verify-email/invalid" element={<AuthStatusPage type="invalid" />} />
      <Route path="/reset-password/sent" element={<AuthStatusPage type="sent" />} />
      <Route path="/reset-password/success" element={<AuthStatusPage type="resetSuccess" />} />
      <Route path="/reset-password/invalid" element={<AuthStatusPage type="resetInvalid" />} />
      <Route path="/events" element={<EventsPage />} />
      <Route path="/events/:id" element={<EventDetailPage />} />
      <Route path="/exhibitors" element={<ExhibitorsPage />} />
      <Route path="/schedule" element={<SchedulePage />} />
      <Route path="/floor-plan" element={<FloorPlanPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/dashboard" element={<WorkspaceLayout />}>
        <Route index element={<DashboardPage page="overview" />} />
        <Route path="expos" element={<DashboardPage page="expos" />} />
        <Route path="expos/new" element={<DashboardPage page="expoNew" />} />
        <Route path="expos/:editId/edit" element={<DashboardPage page="expoEdit" />} />
        <Route path="applications" element={<DashboardPage page="applications" />} />
        <Route path="profile" element={<DashboardPage page="profile" />} />
        <Route path="exhibitors" element={<DashboardPage page="exhibitors" />} />
        <Route path="booths" element={<DashboardPage page="booths" />} />
        <Route path="sessions" element={<DashboardPage page="sessions" />} />
        <Route path="sessions/new" element={<DashboardPage page="sessionNew" />} />
        <Route path="sessions/:editId/edit" element={<DashboardPage page="sessionEdit" />} />
        <Route path="registrations" element={<DashboardPage page="registrations" />} />
        <Route path="attendance" element={<DashboardPage page="attendance" />} />
        <Route path="attendances/d" element={<DashboardPage page="attendance" />} />
        <Route path="users" element={<DashboardPage page="users" />} />
        <Route path="analytics" element={<DashboardPage page="analytics" />} />
        <Route path="bookmarks" element={<DashboardPage page="bookmarks" />} />
        <Route path="feedback" element={<DashboardPage page="feedback" />} />
        <Route path="notifications" element={<DashboardPage page="notifications" />} />
        <Route path="messages" element={<DashboardPage page="messages" />} />
        <Route path="account" element={<DashboardPage page="account" />} />
      </Route>
      <Route path="/attendee/pass/:id" element={<RegistrationPassPage />} />
      <Route path="/organizer/*" element={<LegacyDashboardRedirect role="organizer" />} />
      <Route path="/exhibitor/*" element={<LegacyDashboardRedirect role="exhibitor" />} />
      <Route path="/attendee/*" element={<LegacyDashboardRedirect role="attendee" />} />
      <Route path="/admin/attendance" element={<Navigate to="/dashboard/attendance" replace />} />
      <Route path="/admin/users" element={<Navigate to="/dashboard/users" replace />} />
      <Route path="/admin/*" element={<Navigate to="/dashboard" replace />} />
      <Route
        path="*"
        element={
          <div className="section wrap">
            <h1>Page not found.</h1>
            <a href="/">Return to EventSphere →</a>
          </div>
        }
      />
    </Routes>
  )
}
