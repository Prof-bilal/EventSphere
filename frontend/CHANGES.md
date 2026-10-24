# EventSphere implementation walkthrough

The frontend now sends requests to the Express backend. Dashboard records come from MongoDB instead of the old sample data. This guide explains how to read the changes and demonstrate the assignment.

## Read the frontend in this order

1. Open `src/api.js` to see how requests are sent.
2. Open `src/features/auth/pages/LoginPage.jsx` to see a complete form submission.
3. Open `src/state/AuthContext.jsx` to see how the signed-in user is shared.
4. Open `src/components/layout/WorkspaceLayout.jsx` to see login and role checks.
5. Open `src/features/attendee/pages/BookmarksPage.jsx` to see a simple page that loads real data.
6. Open `src/features/organizer/pages/ExpoFormPage.jsx` to see create and edit requests.

## Pages contain their own code

Previously, `BookmarksPage.jsx` returned another component called `BookmarksScreen`. You had to open a second file to find its logic and HTML.

Now `BookmarksPage.jsx` contains the state variables, `loadPlans`, `cancel`, and the JSX returned by the page. The other dashboard pages follow the same approach. They no longer use `useOutletContext`, a `go` callback, or a shared screen component.

The shared layouts display the header and navigation. They do not contain the individual page forms. A React page is still a function component, but there is no extra screen layer between the router and the page.

## How a request works

For example:

```js
const data = await api('/expo/getExpo')
setExpos(data)
```

`api` sends a GET request to `/api/expo/getExpo`. The Vite proxy forwards it to `http://localhost:4000`. Express runs the matching route and controller. The controller reads MongoDB and returns JSON. `setExpos` stores that response, and React displays it.

For a form submission:

```js
await api('/feedback', 'POST', values)
```

The second argument is the HTTP method. The third argument is the body. `api.js` converts a plain object to JSON. When you pass `FormData`, it sends multipart form data for uploads and lets the browser set the upload headers.

The page's `try` block handles a successful response. Its `catch` block displays the backend error. `loading` controls the initial loading message. `busy` disables a button while its request is running.

## Authentication

`LoginPage.jsx` sends the email and password to `/api/auth/login`. The backend compares the password with its bcrypt hash, checks verification and approval, and returns a JWT and a safe user object.

The frontend saves the JWT in localStorage and calls `setUser`. The API helper adds `Authorization: Bearer TOKEN` to protected requests. The backend also sets its existing HTTP-only cookie. On refresh, `AuthContext.jsx` calls `/auth/profile` to restore the user. If that request fails, it removes the saved token.

`WorkspaceLayout.jsx` redirects visitors without a login to `/login`. It maps the backend's `admin` role to the `/organizer` workspace. Exhibitors and attendees go to their corresponding workspaces. The backend middleware still enforces access for every protected API.

Logout calls `/auth/logout`, clears the frontend token, and removes the shared user state.

Registration, forgot-password, reset-password, verification, and resend-verification now call the real backend. Registration passes the actual verification token to the email service. Exhibitor accounts need organizer approval. Public registration cannot create an organizer account.

## Organizer pages

| Page | What it does |
|---|---|
| OverviewPage | Loads expo and session counts and upcoming sessions |
| ExposPage | Lists, searches, and deletes expos |
| ExpoFormPage | Creates or updates expo details and an optional image |
| ApplicationsPage | Displays uploaded documents and approves or rejects applications |
| BoothsPage | Creates and edits booths, shows requests, and assigns approved exhibitors |
| SessionsPage | Lists sessions and opens edit or delete actions |
| SessionFormPage | Saves topic, speaker, date, time, location, capacity, and session type |
| RegistrationsPage | Shows real attendee registrations |
| AttendancePage | Marks registered attendees present |
| UserManagementPage | Approves exhibitors and blocks or unblocks accounts |
| AnalyticsPage | Loads counts, session popularity, booth-detail views, and exports CSV |
| FeedbackPage | Submits feedback and updates feedback status |
| NotificationsPage | Displays notifications and marks them as read |
| MessagesPage | Reads and sends conversations |
| AccountPage | Updates the signed-in user's name, phone, and profile image |

## Exhibitor pages

The profile page creates or updates the company profile and uploads its logo and documents. The applications page uploads documents for an expo application and displays the organizer's decision. An approved expo application is required before requesting a booth.

The booth page shows available and assigned booths. A request asks the organizer to assign the booth; it does not immediately reserve the booth. Once the organizer assigns it, the exhibitor can save products, services, and staff names on that booth.

The remaining pages load expo information, schedules, messages, feedback, notifications, and personal account information from the backend.

## Attendee pages

The expos page registers the attendee for an expo. The exhibitors page searches company names, products, and services and filters by category. The floor-plan page shows booth locations and exhibitor details. It records a booth-detail view when an attendee selects a booth; this is the booth-engagement measure shown in the report.

The sessions page registers or unregisters a session and adds or removes bookmarks. The attendee must register for the expo before registering for one of its sessions. `BookmarksPage.jsx` lists expo registrations, registered sessions, and bookmarks. Cancelling an expo also removes that attendee's session registrations for it.

Attendees can also contact exhibitors and organizers, submit feedback, read notifications, and update their account.

## New backend files

| File | Purpose |
|---|---|
| model/SessionRegistrationmodel.js | Stores attendee, session, and expo references with a unique attendee/session index |
| controller/SessionRegistrationcontroller.js | Registers sessions, lists personal registrations, and cancels them |
| controller/BoothRequestcontroller.js | Handles requests, assigned-booth details, and recorded booth views |
| controller/Portalcontroller.js | Supplies personal profile, registrations, feedback, and message contacts |
| controller/Verificationcontroller.js | Resends verification emails |
| services/ReminderService.js | Checks once a minute for bookmarked sessions starting within 30 minutes |
| createAdmin.js | Creates the first verified organizer using your private environment settings |

Existing controllers, routes, and models were updated to connect these flows. The booth model now stores requesters, products, services, staff, and recorded views. Company profiles now include a category and accept company names and descriptions with spaces.

## Added API routes

| Method | Route | Purpose |
|---|---|---|
| POST | /api/session/:id/register | Register a session |
| DELETE | /api/session/:id/register | Cancel session registration |
| GET | /api/session/my-registrations | List personal session registrations |
| POST | /api/session/create-session/:expoId | Create an organizer session without requiring a booth |
| POST | /api/booth/:id/request | Request an available booth |
| PUT | /api/booth/:id/details | Update your assigned booth |
| POST | /api/booth/:id/visit | Record an attendee booth-detail view |
| GET | /api/booth/public | Load public booth and floor-plan information |
| GET | /api/exhibitor/my-profile | Load your company profile |
| GET | /api/expoRegistration/mine | Load your expo registrations |
| GET | /api/feedback/mine | Load your feedback |
| GET | /api/message/contacts | Load people you can message |
| POST | /api/auth/resend-verification | Resend a verification link |

## Live updates

`AuthContext.jsx` connects Socket.IO after login using the JWT. A `notification:new` event updates the notification list and displays a notice. An `event:updated` event tells open pages to load the latest schedule, booth allocation, or report.

The reminder service follows the backend machine's timezone. Keep the backend running to generate reminders. Notifications remain in MongoDB so users can read them later.

## Run and demonstrate

1. Fill in `Backend/.env` using `Backend/.env.example` as the field reference. Use port 4000 and the correct frontend URL.
2. Add your `ADMIN_NAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`, then run `npm run create-admin` inside `Backend` once.
3. Run `npm run dev` inside `Backend`.
4. Run `npm run dev` inside `frontend`.
5. Sign in as the organizer, create a published expo, and add booths and sessions. Use future dates: the existing backend has advance-registration and cancellation restrictions.
6. Register an exhibitor and verify their email. Approve the account from the organizer's User management page.
7. Sign in as the exhibitor, create the company profile, upload an application, and have the organizer approve it.
8. Request a booth, assign it from the organizer workspace, and save products and staff details as the exhibitor.
9. Register and verify an attendee. Register for the expo, register and bookmark sessions, and browse booth details.
10. Send messages, submit feedback, mark attendance, and open the organizer's analytics report.

The frontend build and JavaScript syntax checks validate the code. Confirm actual database persistence, delivered emails, and signed-in user flows with your configured backend before recording the assignment demonstration.
