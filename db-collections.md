# EventSphere Database Collections

Database: MongoDB

## users

| Field | Type | Required | Description |
|---|---|---:|---|
| `_id` | ObjectId | Yes | Unique user ID |
| `name` | String | Yes | User's full name |
| `email` | String | Yes | Unique login email |
| `passwordHash` | String | Yes | Bcrypt password hash |
| `role` | String | Yes | `admin`, `organizer`, `exhibitor`, or `attendee` |
| `phone` | String | No | Contact number |
| `profileImage` | String | No | Profile image URL |
| `isActive` | Boolean | Yes | Account status; default `true` |
| `createdAt` | Date | Yes | Creation timestamp |
| `updatedAt` | Date | Yes | Last update timestamp |

Indexes: unique index on `email`.

## expos

| Field | Type | Required | Description |
|---|---|---:|---|
| `_id` | ObjectId | Yes | Unique expo ID |
| `title` | String | Yes | Expo name |
| `description` | String | Yes | Expo description |
| `theme` | String | No | Expo theme |
| `location` | String | Yes | Venue or address |
| `startDate` | Date | Yes | Start date |
| `endDate` | Date | Yes | End date |
| `registrationDeadline` | Date | No | Last registration date |
| `bannerImage` | String | No | Expo banner URL |
| `organizerId` | ObjectId | Yes | Reference to `users` |
| `status` | String | Yes | `draft`, `published`, `completed`, or `cancelled` |
| `capacity` | Number | No | Maximum attendees |
| `createdAt` | Date | Yes | Creation timestamp |
| `updatedAt` | Date | Yes | Last update timestamp |

## exhibitorProfiles

| Field | Type | Required | Description |
|---|---|---:|---|
| `_id` | ObjectId | Yes | Profile ID |
| `userId` | ObjectId | Yes | Reference to `users` |
| `companyName` | String | Yes | Company name |
| `logo` | String | No | Logo URL |
| `description` | String | Yes | Company description |
| `products` | [String] | No | Products offered |
| `services` | [String] | No | Services offered |
| `website` | String | No | Company website |
| `contactPerson` | String | Yes | Company representative |
| `phone` | String | No | Company contact number |
| `documents` | [String] | No | Uploaded document URLs |
| `createdAt` | Date | Yes | Creation timestamp |
| `updatedAt` | Date | Yes | Last update timestamp |

## exhibitorApplications

| Field | Type | Required | Description |
|---|---|---:|---|
| `_id` | ObjectId | Yes | Application ID |
| `expoId` | ObjectId | Yes | Reference to `expos` |
| `exhibitorId` | ObjectId | Yes | Reference to exhibitor user/profile |
| `applicationStatus` | String | Yes | `applied`, `approved`, or `rejected` |
| `submittedDocuments` | [String] | No | Application document URLs |
| `remarks` | String | No | Organizer remarks |
| `reviewedBy` | ObjectId | No | Reviewing organizer |
| `reviewedAt` | Date | No | Review timestamp |
| `createdAt` | Date | Yes | Submission timestamp |
| `updatedAt` | Date | Yes | Last update timestamp |

Recommended unique rule: one application per exhibitor per expo.

## booths

| Field | Type | Required | Description |
|---|---|---:|---|
| `_id` | ObjectId | Yes | Booth ID |
| `expoId` | ObjectId | Yes | Reference to `expos` |
| `boothNumber` | String | Yes | Public booth number, such as `A-01` |
| `floor` | String | No | Floor or hall name |
| `position.x` | Number | No | Floor-plan horizontal position |
| `position.y` | Number | No | Floor-plan vertical position |
| `position.width` | Number | No | Floor-plan width |
| `position.height` | Number | No | Floor-plan height |
| `size` | String | No | Physical booth size |
| `category` | String | No | Booth category |
| `price` | Number | No | Booth price if applicable |
| `status` | String | Yes | `available`, `reserved`, or `occupied` |
| `exhibitorId` | ObjectId | No | Assigned exhibitor |
| `createdAt` | Date | Yes | Creation timestamp |
| `updatedAt` | Date | Yes | Last update timestamp |

Recommended unique rule: `expoId + boothNumber`. Always verify availability before assignment.

## sessions

| Field | Type | Required | Description |
|---|---|---:|---|
| `_id` | ObjectId | Yes | Session ID |
| `expoId` | ObjectId | Yes | Reference to `expos` |
| `title` | String | Yes | Session title |
| `description` | String | No | Session details |
| `speaker` | String | No | Speaker name |
| `topic` | String | No | Session topic |
| `date` | Date | Yes | Session date |
| `startTime` | String | Yes | Start time |
| `endTime` | String | Yes | End time |
| `location` | String | Yes | Room or location |
| `capacity` | Number | No | Maximum participants |
| `type` | String | Yes | `session`, `workshop`, or `seminar` |
| `createdAt` | Date | Yes | Creation timestamp |
| `updatedAt` | Date | Yes | Last update timestamp |

## expoRegistrations

| Field | Type | Required | Description |
|---|---|---:|---|
| `_id` | ObjectId | Yes | Registration ID |
| `expoId` | ObjectId | Yes | Reference to `expos` |
| `attendeeId` | ObjectId | Yes | Reference to `users` |
| `registrationStatus` | String | Yes | `registered`, `cancelled`, or `attended` |
| `registeredAt` | Date | Yes | Registration timestamp |
| `attendanceStatus` | String | No | `not-marked`, `present`, or `absent` |

Recommended unique rule: one attendee registration per expo.

## sessionRegistrations

| Field | Type | Required | Description |
|---|---|---:|---|
| `_id` | ObjectId | Yes | Registration ID |
| `sessionId` | ObjectId | Yes | Reference to `sessions` |
| `attendeeId` | ObjectId | Yes | Reference to `users` |
| `registeredAt` | Date | Yes | Registration timestamp |
| `attended` | Boolean | Yes | Attendance flag; default `false` |

## bookmarks

| Field | Type | Required | Description |
|---|---|---:|---|
| `_id` | ObjectId | Yes | Bookmark ID |
| `attendeeId` | ObjectId | Yes | Reference to `users` |
| `sessionId` | ObjectId | Yes | Reference to `sessions` |
| `createdAt` | Date | Yes | Bookmark timestamp |

Recommended unique rule: one bookmark per attendee per session.

## notifications

| Field | Type | Required | Description |
|---|---|---:|---|
| `_id` | ObjectId | Yes | Notification ID |
| `userId` | ObjectId | Yes | Recipient user |
| `title` | String | Yes | Notification title |
| `message` | String | Yes | Notification message |
| `type` | String | Yes | Notification category |
| `relatedExpoId` | ObjectId | No | Related expo |
| `isRead` | Boolean | Yes | Read status; default `false` |
| `createdAt` | Date | Yes | Creation timestamp |

## feedback

| Field | Type | Required | Description |
|---|---|---:|---|
| `_id` | ObjectId | Yes | Feedback ID |
| `userId` | ObjectId | Yes | Submitting user |
| `expoId` | ObjectId | Yes | Related expo |
| `rating` | Number | No | Rating from 1 to 5 |
| `comment` | String | Yes | Suggestion, complaint, or feedback |
| `category` | String | Yes | `suggestion`, `complaint`, or `technical` |
| `status` | String | Yes | `new`, `in-progress`, or `resolved` |
| `createdAt` | Date | Yes | Submission timestamp |
| `updatedAt` | Date | Yes | Last update timestamp |

## messages

| Field | Type | Required | Description |
|---|---|---:|---|
| `_id` | ObjectId | Yes | Message ID |
| `senderId` | ObjectId | Yes | Sending user |
| `receiverId` | ObjectId | Yes | Receiving user |
| `expoId` | ObjectId | No | Related expo |
| `message` | String | Yes | Message text |
| `isRead` | Boolean | Yes | Read status; default `false` |
| `createdAt` | Date | Yes | Message timestamp |

## Main relationships

```text
User 1 ──── many Expos                 (organizerId)
User 1 ──── 1 ExhibitorProfile         (userId)
Expo 1 ──── many ExhibitorApplications (expoId)
Expo 1 ──── many Booths                 (expoId)
Expo 1 ──── many Sessions               (expoId)
Expo 1 ──── many ExpoRegistrations      (expoId)
Session 1 ─ many SessionRegistrations   (sessionId)
Attendee 1 ─ many Bookmarks             (attendeeId)
```
