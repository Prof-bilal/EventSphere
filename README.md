# EventSphere

EventSphere is an event management web application with a Node.js backend and a React frontend (Vite + Tailwind). This repository contains both the Backend and frontend apps and supporting documentation (DB collections, roles/workflows, roadmaps).

Short tech summary

- Backend: Node.js, Express, MongoDB
- Frontend: React, Vite, Tailwind CSS, React Router, Framer Motion
- DB: MongoDB (see db-collections.md for collection schemas)

Repository structure

- Backend/ — Node.js API server and configuration
- frontend/ — React + Vite frontend
- db-collections.md — database collections and fields
- requirements.md, roles-workflows-api.md, roadmap-checklist.md — planning docs

Quick start (local)

Prerequisites

- Node.js (18+ recommended) or newer
- npm
- MongoDB running locally or accessible via MONGO_URI

Run backend

1. Open a terminal and start the backend:

```sh
cd Backend
npm install
npm run dev
```

- The backend will read configuration from a .env file located at Backend/.env. By default the server listens on PORT (example 4000).
- If no PORT is provided, fallback values may be used by the app. Check Backend/.env.example or the code for defaults.

Run frontend

1. Start the frontend in a separate terminal:

```sh
cd frontend
npm install
npm run dev
```

2. By default the frontend dev server uses Vite (commonly on http://localhost:5173). The frontend expects BACKEND API calls to target the backend server (see FRONTEND_URL in Backend/.env for a sample).

Backend configuration (important)

Do NOT commit secrets or real credentials into the repository. Backend/.env in the repository is for local development reference only — replace values with your own and keep secrets out of source control.

Create Backend/.env (example)

```env
# Backend server port
PORT=4000

# MongoDB connection string (use your own MongoDB URI)
MONGO_URI=mongodb://localhost:27017/Eventsphere

# JWT secret for signing tokens
JWT_SECRET=your_jwt_secret_here

# Email provider (Brevo / Sendinblue) API key and sender details
BREVO_API_KEY=your_brevo_api_key_here
BREVO_SENDER_EMAIL=your_sender_email@example.com
BREVO_SENDER_NAME=EventSphere

# URL to your frontend app (used in email links)
FRONTEND_URL=http://localhost:5173
```

- Replace placeholder values with secure values.
- Never push `.env`, API keys, or passwords to git. Use environment-specific configuration or a secrets manager for production.

Environment tips

- Use a different database for development, test, and production.
- Use long, random values for JWT_SECRET and rotate them if suspected compromised.
- The codebase includes email verification and password reset flows; set BREVO_API_KEY to a working transactional email provider key (or mock email sending in development).

Database

- The project expects MongoDB. See db-collections.md at the repo root for collection definitions and fields used by the backend.

Seeding and roles

- Admin/Organizer roles are typically provisioned by a seed script or initial database setup. Check Backend seed files or the backend README for details about how management roles are created.

API overview (routes documented in Backend/README.md)

The backend exposes REST endpoints under `/api/*`. Below is a concise summary copied from the backend README — consult Backend/README.md for full details:

Auth

- POST /api/auth/register — register new user
- POST /api/auth/login — login and receive JWT
- POST /api/auth/logout — logout
- GET /api/auth/profile — get current user profile
- GET /api/auth/verify-email — verify email (used in verification links)
- POST /api/auth/forgot-password — request password reset
- POST /api/auth/reset-password — reset password using token

Expo (events)

- POST /api/expo/createExpo — create an expo/event
- GET /api/expo/getExpo — list expos
- GET /api/expo/getExpo/:id — get expo by id
- PUT /api/expo/updateExpo/:id — update expo
- DELETE /api/expo/deleteExpo/:id — delete expo

Exhibitor

- POST /api/exhibitor/createProfile — create exhibitor profile
- GET /api/exhibitor/getExhibitors — list exhibitor profiles
- GET /api/exhibitor/getExhibitor/:id — get exhibitor by id
- PUT /api/exhibitor/updateexhibitor/:id — update exhibitor
- DELETE /api/exhibitor/deleteexhibitor/:id — delete exhibitor

Exhibitor Applications

- POST /api/exhibitorApplication/create/:expoId — submit application for an expo
- GET /api/exhibitorApplication/getApplications — list applications
- GET /api/exhibitorApplication/getApplication/:id — get application
- PUT /api/exhibitorApplication/updateexhibitor/:id — update application
- PUT /api/exhibitorApplication/approve/:id — approve application
- PUT /api/exhibitorApplication/reject/:id — reject application

Booth management

- POST /api/booth/create/:expoId — create a booth for an expo
- PUT /api/booth/assign/:id — assign a booth
- GET /api/booth/getBooth — list booths
- GET /api/booth/getMyBooths — get booths for current exhibitor
- PUT /api/booth/updateBooth/:id — update booth
- DELETE /api/booth/deleteBooth/:id — delete booth

Other notes

- The backend README contains additional developer notes, recommended git workflows, and safety reminders (for example, do not commit `.env` or password files into the repo).
- See Backend/README.md for more detailed developer guidance, commands, and the intended project workflow.

Frontend notes

- The frontend is a Vite React app. See frontend/README.md for a quick start and the list of pages.
- Important pages include landing (/), /login, /register (role-based), password reset flows, and management pages for Admin/Organizer roles.
- The frontend README also includes a student guide file: frontend/Readme-Student Guide-eProject Process.txt

More documentation

- db-collections.md — detailed database collections and field definitions
- roles-workflows-api.md — information about roles and API workflows
- requirements.md — project requirements
- roadmap-checklist.md — roadmap and checklist

What I changed

- Added this top-level README.md summarizing backend and frontend, including environment configuration guidance and a concise API route map (based on Backend/README.md and Backend/.env). I avoided copying secrets — example values are placeholders. The detailed backend README and frontend README remain in their folders.

Next steps I recommend

- Add a Backend/.env.example file (gitignored) with the template shown above so contributors can copy it safely.
- Add a short CONTRIBUTING.md describing how to run the project, how to open issues and PRs, and branch naming conventions.
- If you want, I can create Backend/.env.example and CONTRIBUTING.md now.

