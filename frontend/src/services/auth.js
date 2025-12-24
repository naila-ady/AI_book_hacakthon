// Authentication service using Better Auth
import { signIn, signUp, signOut } from '../config/auth.config';

// Helper functions to manage tokens in localStorage
const getStoredToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('better_auth_token') || '';
  }
  return '';
};

const setStoredToken = (token) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('better_auth_token', token);
  }
};

const clearStoredToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('better_auth_token');
  }
};

export const authService = {
  // Sign up function
  register: async (email, password, name) => {
    console.log('Auth Service: Starting registration for email:', email);
    try {
      const response = await signUp.email({
        email,
        password,
        name,
      });

      console.log('Auth Service: Registration response:', response);

      // Better Auth might return different response structure
      // Check multiple possible locations for the session token
      let token = null;

      if (response && response.session && response.session.token) {
        token = response.session.token;
      } else if (response && response.token) {
        token = response.token;
      } else if (response && response.data && response.data.session && response.data.session.token) {
        token = response.data.session.token;
      } else if (response && response.data && response.data.token) {
        token = response.data.token;
      }

      if (token) {
        setStoredToken(token);
        console.log('Auth Service: Token stored in localStorage');
      } else {
        console.log('Auth Service: No token found in response');
        console.log('Response structure:', JSON.stringify(response, null, 2));
      }

      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  // Sign in function
  login: async (email, password) => {
    console.log('Auth Service: Starting login for email:', email);
    try {
      const response = await signIn.email({
        email,
        password,
      });

      console.log('Auth Service: Login response:', response);

      // Better Auth might return different response structure
      // Check multiple possible locations for the session token
      let token = null;

      if (response && response.session && response.session.token) {
        token = response.session.token;
      } else if (response && response.token) {
        token = response.token;
      } else if (response && response.data && response.data.session && response.data.session.token) {
        token = response.data.session.token;
      } else if (response && response.data && response.data.token) {
        token = response.data.token;
      }

      if (token) {
        setStoredToken(token);
        console.log('Auth Service: Token stored in localStorage');
      } else {
        console.log('Auth Service: No token found in response');
        console.log('Response structure:', JSON.stringify(response, null, 2));
      }

      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Sign out function
  logout: async () => {
    try {
      const response = await signOut();
      // Clear the stored token
      clearStoredToken();
      // Additional cleanup can be done here if needed
      return response;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  // Get current user session
  getCurrentUser: async () => {
    // This would typically be handled by the useSession hook
    // but we can provide a wrapper if needed
  }
};