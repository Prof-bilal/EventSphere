# EventSphere

EventSphere is an event-management application with a React frontend and a Node.js/Express backend. It helps admins manage expos, exhibitors, applications, booths, sessions, attendees, notifications, messages, feedback, and analytics.

This guide is written for beginners setting up the project for the first time.

## Project structure

~~~text
EventSphere/
├── Backend/      # Node.js, Express, MongoDB API
├── frontend/     # React and Vite web application
└── README.md     # This guide
~~~

## What you need first

Install Node.js 18 or newer, Git, MongoDB (local or MongoDB Atlas), and Postman.

## 1. Get the project

~~~bash
git clone https://github.com/Prof-bilal/EventSphere.git
cd EventSphere
~~~

If you already have the project, update it before starting:

~~~bash
git switch main
git pull origin main
~~~

## 2. Set up the backend

~~~bash
cd Backend
npm install
~~~

Create a private file named .env inside Backend/:

~~~env
PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=use_a_long_random_secret
BREVO_API_KEY=your_brevo_api_key
BREVO_SENDER_EMAIL=your_sender_email
BREVO_SENDER_NAME=EventSphere
FRONTEND_URL=http://localhost:5173
~~~

Replace the example values with your own. Never commit this file. If it was ever pushed publicly, rotate the MongoDB password, JWT secret, Brevo API key, and any other exposed credentials.

Start the backend:

~~~bash
npm run dev
~~~

The API normally runs at http://localhost:4000. For routes and Postman examples, read [Backend/README.md](Backend/README.md).

## Backend status

The assignment modules are implemented in the backend and connected to the frontend. Database and email flows require valid local environment settings. The modules include:

- JWT authentication, email verification, password reset, and logout
- Admin, exhibitor, and attendee roles
- Admin approval and blocking of users and exhibitors
- Expo, booth, exhibitor profile, and exhibitor application management
- Sessions, attendee expo registration, bookmarks, feedback, messaging, and analytics
- Profile, logo, and document uploads
- Brevo email notifications and Socket.IO real-time notifications

This is a project backend, not a production deployment. Rate limiting, advanced logging, automated tests, and deployment hardening can be added later.

## Main API prefixes

```text
/api/auth
/api/expo
/api/exhibitor
/api/exhibitorApplication
/api/booth
/api/session
/api/expoRegistration
/api/bookmark
/api/notification
/api/feedback
/api/message
/api/analytics
/api/attendee
```

Most protected requests require:

```text
Authorization: Bearer YOUR_TOKEN
```

Use `multipart/form-data` for requests containing images or documents. Use JSON for normal requests.

## Roles

- **Admin:** creates expos and booths, assigns booths, manages users, approves exhibitors and applications, manages sessions, feedback, and analytics.
- **Exhibitor:** creates a profile, uploads documents, applies for expos, views assigned booths, and creates sessions.
- **Attendee:** registers for expos, views sessions, bookmarks sessions, sends messages, and submits feedback.

## Real-time notifications

The backend uses Socket.IO. The frontend connects with the JWT:

```js
const socket = io("http://localhost:4000", {
  auth: { token: YOUR_TOKEN }
});

socket.on("notification:new", (notification) => {
  console.log(notification);
});
```

Notifications are stored in MongoDB and important notifications are sent through Brevo.

## 3. Set up the frontend

Open a second terminal and run the frontend from the repository:

~~~bash
cd /home/abullah/Projects/EventSphere/frontend
npm install
npm run dev
~~~

Open the local URL printed by Vite, usually http://localhost:5173.

Create a production build when needed:

~~~bash
npm run build
npm run preview
~~~

The Vite development server forwards `/api`, `/uploads`, and `/socket.io` to the backend on port 4000. Keep `PORT=4000` in `Backend/.env` and set `FRONTEND_URL` to the URL printed by Vite so email links return to the correct frontend.

For the page structure, read [frontend/README.md](frontend/README.md). For a walkthrough of the implementation, read [frontend/CHANGES.md](frontend/CHANGES.md).

## Create the first organizer account

Add `ADMIN_NAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` to `Backend/.env`. Then run:

```bash
cd Backend
npm run create-admin
```

The script creates a verified organizer account and leaves existing accounts untouched. Public registration creates only attendee and exhibitor accounts. Exhibitors verify their email and wait for organizer approval from the User management page before signing in.

## Beginner Git workflow

Create a branch before making changes:

~~~bash
git switch -c feature/short-description
~~~

After making and testing changes:

~~~bash
git status
git diff
git add .
git commit -m "Describe the change"
git push -u origin feature/short-description
~~~

Then open a pull request on GitHub. Do not commit .env, passwords, API keys, tokens, node_modules, build output, or uploaded private files.

## Common problems

- **npm is not recognized:** install Node.js and reopen your terminal.
- **MongoDB connection fails:** check MONGO_URI, database access rules, and whether the database is running.
- **Port is already in use:** change PORT in Backend/.env or stop the process using that port.
- **The frontend cannot reach the API:** make sure the backend is running and its CORS/frontend URL settings match your local frontend URL.
- **A page works through navigation but not after refresh:** configure the deployed frontend server to return index.html for client-side routes.

## API testing

Use Postman to test the backend:

1. Start MongoDB and the backend.
2. Test `POST /api/auth/login`.
3. Copy the returned token.
4. Add it as a Bearer token to protected requests.
5. Use an admin, exhibitor, or attendee account according to the route requirement.
6. Use form-data for uploads and JSON for normal requests.

The backend root health check is:

```text
GET http://localhost:4000/
```

Expected response:

```text
Hello World
```

## More project notes

See [requirements.md](requirements.md), [roadmap-checklist.md](roadmap-checklist.md), [roles-workflows-api.md](roles-workflows-api.md), and [db-collections.md](db-collections.md) for additional documentation.
