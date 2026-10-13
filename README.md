# EventSphere

EventSphere is an event-management application with a React frontend and a Node.js/Express backend. It helps organizers manage expos, exhibitors, applications, booths, and attendees.

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

## 3. Set up the frontend

Open a second terminal from the project root:

~~~bash
cd frontend
npm install
npm run dev
~~~

Open the local URL printed by Vite, usually http://localhost:5173.

Create a production build when needed:

~~~bash
npm run build
npm run preview
~~~

For available pages and current frontend limitations, read [frontend/README.md](frontend/README.md).

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

## More project notes

See [requirements.md](requirements.md), [roadmap-checklist.md](roadmap-checklist.md), [roles-workflows-api.md](roles-workflows-api.md), and [db-collections.md](db-collections.md) for additional documentation.

