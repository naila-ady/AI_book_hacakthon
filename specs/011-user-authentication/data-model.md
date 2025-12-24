# Data Model: User Authentication

## User Entity

**Fields:**
- `id` (string) - Unique identifier for the user (auto-generated)
- `email` (string) - User's email address (required, unique, validated)
- `password` (string) - Hashed password (required, stored securely)
- `name` (string, optional) - User's display name
- `createdAt` (Date) - Account creation timestamp
- `updatedAt` (Date) - Last update timestamp
- `emailVerified` (boolean) - Whether email has been verified
- `isActive` (boolean) - Whether account is active

**Validation rules:**
- Email must be a valid email format
- Password must be at least 8 characters
- Email must be unique across all users
- Email is case-insensitive for login

## Session Entity

**Fields:**
- `id` (string) - Unique session identifier
- `userId` (string) - Reference to the user
- `expiresAt` (Date) - Session expiration timestamp
- `createdAt` (Date) - Session creation timestamp
- `lastAccessed` (Date) - Last time session was used
- `userAgent` (string, optional) - Browser/device information
- `ipAddress` (string, optional) - IP address of session origin

**Validation rules:**
- Session must be linked to an existing user
- Session must not be expired
- Session may have configurable expiration time

## Relationships

- **User → Sessions**: One-to-many (one user can have multiple sessions)
- Session always belongs to exactly one user

## State Transitions

**User Account:**
- `inactive` → `active` (after email verification)
- `active` → `suspended` (admin action)
- `suspended` → `active` (admin action)

**Session:**
- `created` → `active` (when user logs in)
- `active` → `expired` (when session expires)
- `active` → `terminated` (when user logs out)