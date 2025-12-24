// Auth configuration for Better Auth
import { createAuthClient } from "better-auth/client";

// Create the auth client
const authClientInstance = createAuthClient({
  baseURL: typeof window !== 'undefined' ? (window.ENV?.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:8000") : "http://localhost:8000",
});

// Export authentication functions
export const signIn = authClientInstance.signIn;
export const signUp = authClientInstance.signUp;
export const signOut = authClientInstance.signOut;

// Export the client instance in case we need it
export const authClient = authClientInstance;

// Simple function to check session manually
export const checkSession = async () => {
  try {
    const token = localStorage.getItem('better_auth_token') || '';

    if (!token) {
      console.log('No token found in localStorage');
      return { data: null, isLoading: false };
    }

    // Get the base URL consistently with the auth client
    const baseURL = typeof window !== 'undefined' ? (window.ENV?.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:8000") : "http://localhost:8000";

    // Use the Better Auth client to check the session
    const response = await fetch(`${baseURL}/api/auth/session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Session check successful:', data);
      return { data, isLoading: false };
    } else {
      console.log('Session check failed with status:', response.status);
      // Clear the token if session check fails
      localStorage.removeItem('better_auth_token');
      return { data: null, isLoading: false };
    }
  } catch (error) {
    console.error('Session check failed:', error);
    // Clear the token if there's an error
    localStorage.removeItem('better_auth_token');
    return { data: null, isLoading: false };
  }
};