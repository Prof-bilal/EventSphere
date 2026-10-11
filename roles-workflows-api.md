# EventSphere Roles Workflows and API Requirements

## Role permissions

| Action | Organizer | Exhibitor | Attendee |
|---|:---:|:---:|:---:|
| Create/update/delete expo | Yes | No | No |
| Review exhibitor applications | Yes | No | No |
| Create and assign booths | Yes | No | No |
| Apply for expo | No | Yes | No |
| Manage exhibitor profile | No | Yes | No |
| Register for expo | Optional | No | Yes |
| Register for sessions | No | Optional | Yes |
| Search exhibitors | Yes | Yes | Yes |
| View public expo information | Yes | Yes | Yes |
| Manage sessions | Yes | No | No |
| Submit feedback | Yes | Yes | Yes |
| Manage feedback | Yes | No | No |

## Main workflows

### Organizer

```text
Login → Create expo → Create booths and sessions → Review applications
→ Approve exhibitor → Assign booth → Monitor registrations and analytics
```

### Exhibitor

```text
Register → Create company profile → Apply for expo → Wait for approval
→ Request booth → View assigned booth → Contact organizer
```

### Attendee

```text
Register → Browse expo → Register for expo → Search exhibitors
→ View booth → Browse schedule → Register/bookmark session → Give feedback
```

## Authentication APIs

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/forgot-password
POST /api/auth/reset-password
GET  /api/auth/me
```

## Expo APIs

```text
GET    /api/expos
POST   /api/expos
GET    /api/expos/:id
PUT    /api/expos/:id
DELETE /api/expos/:id
```

## Application APIs

```text
POST /api/applications
GET  /api/applications
GET  /api/applications/:id
PUT  /api/applications/:id/approve
PUT  /api/applications/:id/reject
```

## Booth APIs

```text
GET  /api/expos/:expoId/booths
POST /api/expos/:expoId/booths
PUT  /api/booths/:id
POST /api/booths/:id/request
POST /api/booths/:id/assign
```

## Session APIs

```text
GET    /api/expos/:expoId/sessions
POST   /api/expos/:expoId/sessions
GET    /api/sessions/:id
PUT    /api/sessions/:id
DELETE /api/sessions/:id
POST   /api/sessions/:id/register
POST   /api/sessions/:id/bookmark
DELETE /api/sessions/:id/bookmark
```

## Exhibitor APIs

```text
GET /api/exhibitors
GET /api/exhibitors/:id
GET /api/exhibitors/search
GET /api/exhibitor-profile
POST /api/exhibitor-profile
PUT /api/exhibitor-profile
```

## Attendee APIs

```text
POST /api/expos/:expoId/register
GET  /api/attendee/registrations
GET  /api/attendee/bookmarks
```

## Feedback, messaging, and analytics APIs

```text
POST /api/feedback
GET  /api/feedback
PUT  /api/feedback/:id/status

POST /api/messages
GET  /api/messages/conversation/:userId

GET /api/analytics/:expoId
GET /api/notifications
PUT /api/notifications/:id/read
```

## Required backend rules

- [ ] Validate all request data
- [ ] Authenticate protected requests
- [ ] Check the user's role before restricted actions
- [ ] Never return `passwordHash` in API responses
- [ ] Prevent duplicate expo registrations
- [ ] Prevent duplicate session registrations
- [ ] Prevent duplicate bookmarks
- [ ] Prevent booth double booking
- [ ] Return correct HTTP status codes
- [ ] Handle missing records with a clear 404 response
- [ ] Keep secrets in environment variables
