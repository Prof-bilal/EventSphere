# EventSphere frontend

React, Vite, React Router, Tailwind CSS, and Framer Motion frontend for EventSphere.

## Run locally

```bash
npm install
npm run dev
```

Create a production build with `npm run build`, then preview it with `npm run preview`.

The frontend includes public pages for events, exhibitors, schedules, floor plans, authentication, and the Organizer, Exhibitor, and Attendee workspaces.

## Backend connection

Start the backend on port 4000. Vite forwards `/api`, `/uploads`, and `/socket.io` to that port. Set `FRONTEND_URL` in `Backend/.env` to your actual frontend URL for verification and reset email links.

## Page structure

Each page in `src/features/organizer/pages`, `src/features/exhibitor/pages`, and `src/features/attendee/pages` contains its own state, API calls, handlers, and JSX. The old shared `workspace/screens` layer and mock data files were removed.

`src/api.js` sends requests. `src/state/AuthContext.jsx` shares the signed-in user and notifications. `src/components/layout/WorkspaceLayout.jsx` checks the user's role and displays the navigation. `src/navigation.js` contains the menu items.

See [CHANGES.md](CHANGES.md) for the beginner walkthrough.
