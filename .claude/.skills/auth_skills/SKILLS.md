# Authentication Skill

## Purpose
When a user requests authentication functionality (login, signup, registration, sign-in, sign-up), implement a complete authentication system with React Context, service layer, and protected routes.

## Implementation Steps

1. Create `src/contexts/AuthContext.js` with:
   - Auth state (user, isAuthenticated, isLoading)
   - AuthProvider component
   - useAuth custom hook
   - Session validation on app load
   - Cross-tab synchronization

2. Create `src/services/auth.js` with:
   - authService object
   - register function (email, password, name)
   - login function (email, password)
   - logout function
   - Token management in localStorage

3. Create `src/config/auth.config.js` with:
   - signIn.email function
   - signUp.email function
   - signOut function
   - checkSession function
   - API calls to backend endpoints

4. Create `src/components/auth/` directory with:
   - LoginForm.js (with validation)
   - SignupForm.js (with validation)
   - ProtectedRoute.js (with loading states)
   - AuthLayout.js (if needed)

5. Create `src/pages/login.js` and `src/pages/signup.js` with proper routing

## Backend API Integration
- Sign-in: POST to `/api/auth/sign-in/email`
- Sign-up: POST to `/api/auth/sign-up/email`
- Sign-out: POST to `/api/auth/sign-out`
- Session: POST to `/api/auth/session` with Authorization header

## Security Features
- Token storage in localStorage
- Session validation
- Form validation
- Error handling
- Protected route implementation

## Files to Create
- `src/contexts/AuthContext.js`
- `src/services/auth.js`
- `src/config/auth.config.js`
- `src/components/auth/LoginForm.js`
- `src/components/auth/SignupForm.js`
- `src/components/auth/ProtectedRoute.js`
- `src/components/auth/AuthLayout.js`
- `src/pages/login.js`
- `src/pages/signup.js`

## Usage Pattern
1. Wrap app with AuthProvider
2. Use useAuth hook in components
3. Protect routes with ProtectedRoute component
4. Handle authentication state changes appropriately