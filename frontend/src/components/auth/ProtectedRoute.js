import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Redirect, useHistory } from '@docusaurus/router';

const ProtectedRoute = ({ children, redirectTo = '/login' }) => {
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
};

export default ProtectedRoute;