# WeatherGuard

WeatherGuard is a secure weather alerting system that sends scheduled weather updates to approved users via Telegram. It consists of a NestJS backend and a React (Vite) admin portal for managing access requests.

## System Design

The system is built on a modular architecture:
- **Frontend (Admin Portal)**: React, Vite, TailwindCSS. Uses standard patterns like custom hooks for data fetching (separating presentation from logic) and contexts for authentication.
- **Backend (API)**: NestJS, providing structured, type-safe modules for Users, Auth, Weather, and Alerts.
- **Database**: MongoDB, for storing user profiles, OAuth identities, and Telegram linking data.

### Database Schema

The core domain model is the `User` schema in MongoDB. It stores OAuth details, admin approval state, and Telegram linking context.

```typescript
{
  _id: ObjectId;
  name: string;             // User's display name
  email: string;            // User's email (unique)
  avatarUrl?: string;       // Profile picture URL
  
  // OAuth Identity
  provider: 'google';       // OAuth provider
  providerId: string;       // Unique ID from provider
  
  // Authorization & Access Control
  role: 'user' | 'admin';           // Determines access to the admin portal
  status: 'pending' | 'approved' | 'rejected'; // Determines eligibility for alerts
  
  // Telegram Integration
  telegramChatId?: string;          // Populated once user links their Telegram
  telegramLinkToken?: string;       // Temporary token used during the linking process
  
  // Audit Trail
  approvedBy?: ObjectId;            // Admin who approved the request
  approvedAt?: Date;                // Timestamp of approval
  createdAt: Date;
  updatedAt: Date;
}
```

## Data Flow: Ensuring Secure Alerts

WeatherGuard enforces strict access control to ensure that only approved personnel receive weather alerts. Here is the step-by-step data flow that guarantees this:

1. **Access Request**: A user signs in via Google OAuth. Their account is created in MongoDB with a default status of `pending`.
2. **Admin Approval**: An admin reviews the request in the admin portal. When they approve the user, the backend updates the user's status to `approved` and generates a temporary, unique `telegramLinkToken`.
3. **Telegram Linking**: The admin provides the user with a special Telegram link containing the token. When the user starts a chat with the bot, the backend matches the token, associates the user's `telegramChatId` with their database record, and removes the token.
4. **Alert Dispatch Enforcement**: The alerting mechanism runs periodically (via cron) or manually via an admin endpoint. To determine who receives an alert, the `AlertsService` queries the `UsersService`.
5. **The Security Query**: The `UsersService` executes a strict query (`findApprovedAndLinked`) against MongoDB:
   ```typescript
   this.userModel.find({
     status: UserStatus.APPROVED,
     telegramChatId: { $exists: true, $ne: null }
   })
   ```
   This query is the central enforcement mechanism. It physically prevents the system from fetching or sending messages to any user who is not explicitly `approved` or who hasn't completed the Telegram linking process.

By relying on database-level filtering rather than application-side array filtering, we guarantee security and scalability when dispatching alerts.
