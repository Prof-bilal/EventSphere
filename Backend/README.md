# EventSphere Backend

EventSphere is an event management backend built with Node.js, Express, MongoDB, and Mongoose.

## Project status

Current backend status: **functionally complete for the current project requirements**.

Completed modules:

- Authentication and JWT authorization
- Admin, exhibitor, and attendee roles
- Expo management
- Exhibitor profiles
- Exhibitor applications
- Application approval, rejection, and admin remarks
- Profile and document uploads
- Booth creation, assignment, update, and deletion
- MongoDB integration
- Brevo email integration
- Search and filtering
- Attendee expo registration and dashboard
- Session bookmarks
- Notifications stored in MongoDB
- Socket.IO real-time notifications
- User messaging
- User feedback and admin feedback status management
- Admin analytics
- Admin user listing, blocking, and unblocking

This backend is intended for the current project requirements. Production hardening such as rate limiting, advanced logging, automated tests, and deployment configuration can be added later.

## Requirements

- Node.js 18 or newer
- npm
- MongoDB
- Git
- Postman for API testing

## Clone the project

Open a terminal and run:

```bash
git clone https://github.com/Prof-bilal/EventSphere.git
cd EventSphere/Backend
```

If the repository is already cloned, enter the backend folder:

```bash
cd EventSphere/Backend
```

## Install dependencies

```bash
npm install
```

## Environment variables

Create a `.env` file inside the `Backend` folder. Do not commit this file to GitHub.

```env
PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
BREVO_API_KEY=your_brevo_api_key
BREVO_SENDER_EMAIL=your_sender_email
BREVO_SENDER_NAME=EventSphere
FRONTEND_URL=your_frontend_url
```

Use your real MongoDB and Brevo values locally. Never share API keys or JWT secrets publicly.

## Run the backend

Start the development server:

```bash
npm run dev
```

The server runs on the port defined in `.env`. If no port is provided, the application uses port `5000`.

Check that the server is running by opening:

```text
GET http://localhost:4000/
```

Expected response:

```text
Hello World
```

## API base URLs

```text
http://localhost:4000/api/auth
http://localhost:4000/api/expo
http://localhost:4000/api/exhibitor
http://localhost:4000/api/exhibitorApplication
http://localhost:4000/api/booth
http://localhost:4000/api/session
http://localhost:4000/api/expoRegistration
http://localhost:4000/api/bookmark
http://localhost:4000/api/notification
http://localhost:4000/api/feedback
http://localhost:4000/api/message
http://localhost:4000/api/analytics
http://localhost:4000/api/attendee
```

## Main API routes

### Authentication

```text
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/profile
PUT    /api/auth/editprofile
GET    /api/auth/verify-email
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
```

### Expo

```text
POST   /api/expo/createExpo
GET    /api/expo/getExpo
GET    /api/expo/getExpo/:id
PUT    /api/expo/updateExpo/:id
DELETE /api/expo/deleteExpo/:id
```

### Exhibitor profile

```text
POST   /api/exhibitor/createProfile
GET    /api/exhibitor/getexhibitor
PUT    /api/exhibitor/updateexhibitor/:id
DELETE /api/exhibitor/deleteexhibitor/:id
```

The profile create and update requests use `multipart/form-data` with these fields:

- `image` for the profile image
- `documents` for one or more documents

### Exhibitor application

```text
POST   /api/exhibitorApplication/create/:expoId
GET    /api/exhibitorApplication/getApplications
GET    /api/exhibitorApplication/getApplication/:id
PUT    /api/exhibitorApplication/updateApplication/:id
PUT    /api/exhibitorApplication/approveApplication/:id
PUT    /api/exhibitorApplication/rejectApplication/:id
GET    /api/exhibitorApplication/getMyApplications
```

### Booth

```text
POST   /api/booth/create/:expoId
PUT    /api/booth/assign/:id
GET    /api/booth/getBooth
GET    /api/booth/getBooth/:id
GET    /api/booth/getMyBooths
PUT    /api/booth/updateBooth/:id
DELETE /api/booth/deleteBooth/:id
```

Most protected routes require a login token. In Postman, add:

```text
Authorization: Bearer YOUR_TOKEN
```

## Team workflow for beginners

### 1. Get the latest code

Before starting work:

```bash
git switch main
git pull origin main
```

### 2. Create your own branch

Never make feature changes directly on `main`:

```bash
git switch -c feature/your-feature-name
```

Examples:

```bash
git switch -c feature/attendee-registration
git switch -c fix/booth-validation
```

### 3. Make and test your changes

Run the backend while working:

```bash
npm run dev
```

Test your API changes in Postman before committing.

### 4. Check your changed files

```bash
git status
git diff
```

Do not commit `.env`, passwords, API keys, tokens, or `node_modules`.

### 5. Save your changes

```bash
git add .
git commit -m "Add your feature name"
```

Use a clear commit message, for example:

```bash
git commit -m "Add attendee registration API"
```

### 6. Push your branch

```bash
git push -u origin feature/your-feature-name
```

For later pushes to the same branch:

```bash
git push
```

### 7. Create a Pull Request

After pushing, open GitHub and create a Pull Request from your branch into `main`.

Include these details in the Pull Request:

- What you changed
- Which API routes were added or updated
- How you tested the changes
- Any remaining issue or limitation

## Updating an existing feature branch

If someone has added changes to `main`, update your local branch carefully:

```bash
git switch main
git pull origin main
git switch feature/your-feature-name
git merge main
```

## Complete route list

### Admin user management

```text
GET /api/auth/pending-exhibitors
PUT /api/auth/approve-exhibitor/:id
PUT /api/auth/reject-exhibitor/:id
GET /api/auth/users
PUT /api/auth/block-user/:id
PUT /api/auth/unblock-user/:id
```

These routes require an admin token.

### Sessions

```text
POST   /api/session/create-session/:expoId/:boothId
POST   /api/session/create-session/:expoId/:boothId/:exhibitorId
GET    /api/session/get-sessions
GET    /api/session/get-sessions/:expoId
GET    /api/session/get-session/:id
PUT    /api/session/update-session/:id
DELETE /api/session/delete-session/:id
```

Sessions can be created by admins or exhibitors. Attendees must be registered for the expo before accessing its protected session list.

### Expo registration

```text
POST /api/expoRegistration/register/:expoId
GET  /api/expoRegistration/register
GET  /api/expoRegistration/register/:expoId
PUT  /api/expoRegistration/register/:id
PUT  /api/expoRegistration/register/attend/:id
GET  /api/expoRegistration/register/attendeeCount/:expoId
```

### Bookmarks

```text
POST   /api/bookmark/:sessionId
GET    /api/bookmark
DELETE /api/bookmark/:sessionId
```

### Notifications

```text
POST /api/notification
GET  /api/notification
PUT  /api/notification/:id/read
```

Notifications are saved in MongoDB, emitted through Socket.IO with the `notification:new` event, and sent through Brevo where applicable.

### Feedback

```text
POST /api/feedback
GET  /api/feedback
PUT  /api/feedback/:id/status
```

### Messages

```text
POST /api/message
GET  /api/message/conversation/:userId
```

### Search

```text
GET /api/expo/getExpo
GET /api/exhibitor/search
```

Use the query parameters supported by the controller for title, location, status, and exhibitor search filters.

### Dashboards and analytics

```text
GET /api/attendee/dashboard
GET /api/analytics/:expoId
```

The attendee dashboard requires an attendee token. Analytics requires an admin token.

## Upload requests

Use `multipart/form-data` in Postman for upload routes.

Exhibitor profile fields:

```text
image       one logo image
documents   one or more PDF, DOC, DOCX, JPG, PNG, or WEBP files
```

Exhibitor application fields:

```text
documents   one or more application documents
```

Uploaded files are served from:

```text
http://localhost:4000/uploads/<folder>/<filename>
```

## Socket.IO connection

The frontend connects with the logged-in user's JWT:

```js
const socket = io("http://localhost:4000", {
    auth: { token: YOUR_TOKEN }
});

socket.on("notification:new", (notification) => {
    console.log(notification);
});
```

## Development checklist

Before opening a Pull Request:

```bash
npm install
npm run dev
```

Then verify the changed API in Postman, check the terminal for errors, and run:

```bash
git diff
git status
```

Do not commit `.env`, API keys, passwords, JWT tokens, `node_modules`, or private uploaded files.

If Git reports conflicts, fix the marked files, then run:

```bash
git add .
git commit -m "Resolve merge conflicts"
git push
```

## Important rules

- Do not push directly to `main`.
- Do not commit `.env` or secret keys.
- Keep the existing coding style when adding code.
- Test new endpoints in Postman.
- Use meaningful branch and commit names.
- Pull the latest `main` before starting new work.
