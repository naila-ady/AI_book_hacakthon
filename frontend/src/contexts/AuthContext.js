import React, { createContext, useContext, useState, useEffect } from 'react';

// Create Auth Context
const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(typeof window !== 'undefined'); // Only loading if in browser

  useEffect(() => {
    // Check if we're in the browser environment
    if (typeof window === 'undefined') {
      // Not in browser (during build), set initial state and return
      setIsLoading(false);
      return;
    }

    // Check if we have a stored token and try to validate it
    const storedToken = localStorage.getItem('better_auth_token');
    if (storedToken) {
      // Validate the token by checking the session
      validateSession();
    } else {
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
    }

    // Listen for storage events to handle authentication state changes from other tabs/windows
    const handleStorageChange = (e) => {
      if (e.key === 'better_auth_token') {
        validateSession();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Function to validate the session with the backend
  const validateSession = async () => {
    // Check if we're in the browser environment
    if (typeof window === 'undefined') {
      // Not in browser, skip validation
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const storedToken = localStorage.getItem('better_auth_token');
      if (!storedToken) {
        setUser(null);
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      // Check session with backend
      // Browser-compatible environment variable access
const backendUrl = typeof window !== 'undefined'
  ? (window.env && window.env.NEXT_PUBLIC_BACKEND_URL) || 'http://localhost:8000'
  : process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

const sessionResponse = await fetch(backendUrl + '/api/auth/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + storedToken,
        },
      });

      if (sessionResponse.ok) {
        const sessionData = await sessionResponse.json();
        setUser(sessionData.user);
        setIsAuthenticated(true);
      } else {
        // Token is invalid, clear it
        localStorage.removeItem('better_auth_token');
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Session validation failed:', error);
      // Clear the token if there's an error
      if (typeof window !== 'undefined') {
        localStorage.removeItem('better_auth_token');
      }
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to manually refresh the session
  const refreshSession = async () => {
    // Validate the session with the backend
    await validateSession();
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};