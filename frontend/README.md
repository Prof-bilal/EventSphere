# EventSphere frontend

React, Vite, Tailwind CSS, React Router, and Framer Motion.

## Run locally

```sh
npm install
npm run dev
```

Create a production build with `npm run build`, then preview it with `npm run preview`.

## Pages

- `/` — landing page
- `/login` — sign in
- `/register` — role-based registration
- `/register?role=exhibitor` — exhibitor registration
- `/register?role=attendee` — attendee registration
- `/forgot-password` — request a password reset link
- `/reset-password?token=...` — reset form; a token is required to enable submission

## Authentication status

These are frontend pages with validation, not an authentication service. Forms do not transmit or persist credentials, create accounts, send email, change passwords, or establish sessions. Valid forms display an explicit integration notice. Reset tokens are not verified in the browser.

Admin/Organizer is one management role provisioned through a backend seed, not public registration. Public registration offers only Exhibitor and Attendee. Unsupported role parameters, including `organizer` and `admin`, fall back to Attendee.

Before connecting a backend, implement server-side validation, password hashing, session management, authorization, and expiring single-use recovery tokens. The backend must reject management roles in public registration requests. Hosting must serve `index.html` for client-side routes so direct visits to `/login` and other pages work.
