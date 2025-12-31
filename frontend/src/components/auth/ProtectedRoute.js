import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useHistory } from '@docusaurus/router';

const ProtectedRoute = ({ children, redirectTo = '/login' }) => {
  // Check if we're in the browser environment (not during build)
  const isBrowser = typeof window !== 'undefined';

  if (!isBrowser) {
    // During build time, render children without protection
    // This allows the page to be built successfully
    return children;
  }

  try {
    const { isAuthenticated, isLoading } = useAuth();
    const history = useHistory();

    // Show loading state while checking authentication
    if (isLoading) {
      return (
        <div className="container margin-vert--lg">
          <div className="row">
            <div className="col col--6 col--offset-3">
              <div className="text--center padding--md">
                Checking authentication...
              </div>
            </div>
          </div>
        </div>
      );
    }

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      // Use Docusaurus router for navigation
      history.push(redirectTo);
      return null;
    }

    // If authenticated, render the protected content
    return children;
  } catch (error) {
    // If there's an error accessing auth context (e.g., during build),
    // just render the children
    console.warn('Auth context not available, rendering protected content:', error.message);
    return children;
  }
};

export default ProtectedRoute;