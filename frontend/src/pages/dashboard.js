import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';

function DashboardPage() {
  const [authData, setAuthData] = useState({ user: null, isAuthenticated: false, isLoading: true });

  useEffect(() => {
    // This only runs in the browser
    if (typeof window !== 'undefined') {
      // Dynamically import and use auth context after component mounts
      const loadAuth = async () => {
        try {
          // Try to get auth context after component mounts
          const { useAuth } = await import('../contexts/AuthContext');
          // Since we can't directly use hooks dynamically, we'll check for auth state another way
          const token = localStorage.getItem('better_auth_token');
          if (token) {
            // Try to validate session
            const response = await fetch((process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000') + '/api/auth/session', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
              },
            });

            if (response.ok) {
              const userData = await response.json();
              setAuthData({ user: userData.user, isAuthenticated: true, isLoading: false });
            } else {
              setAuthData({ user: null, isAuthenticated: false, isLoading: false });
            }
          } else {
            setAuthData({ user: null, isAuthenticated: false, isLoading: false });
          }
        } catch (error) {
          console.error('Auth error:', error);
          setAuthData({ user: null, isAuthenticated: false, isLoading: false });
        }
      };

      loadAuth();
    }
  }, []);

  const { user, isAuthenticated, isLoading } = authData;

  // During loading or if not authenticated, show a message
  if (isLoading) {
    return (
      <Layout title="Dashboard" description="User dashboard">
        <div className="container margin-vert--lg">
          <div className="row">
            <div className="col col--8 col--offset-2">
              <h1>Loading Dashboard...</h1>
              <p>Please wait while we verify your authentication status.</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login if not authenticated (client-side only)
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }

    return (
      <Layout title="Redirecting..." description="Redirecting to login">
        <div className="container margin-vert--lg">
          <div className="row">
            <div className="col col--8 col--offset-2">
              <h1>Redirecting...</h1>
              <p>You need to be logged in to access this page. Redirecting to login...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Show dashboard content for authenticated users
  const displayName = user ? (user.name || user.email) : 'User';

  return (
    <Layout title="Dashboard" description="User dashboard">
      <div className="container margin-vert--lg">
        <div className="row">
          <div className="col col--8 col--offset-2">
            <h1>User Dashboard</h1>
            <div className="card">
              <div className="card__body">
                <h3>Welcome, {displayName}!</h3>
                <p>This is a protected page. Only authenticated users can see this content.</p>
                <p>Your email: {user?.email || 'Not available'}</p>
                <p>Account created: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default DashboardPage;