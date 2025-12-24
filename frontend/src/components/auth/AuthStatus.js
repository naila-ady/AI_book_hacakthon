import React, { useState, useEffect } from 'react';
import { useHistory } from '@docusaurus/router';
import { useAuth } from '../../contexts/AuthContext';
import { checkSession } from '../../config/auth.config';

const AuthStatus = () => {
  const history = useHistory();
  const [authState, setAuthState] = useState({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const sessionResponse = await checkSession();
        if (sessionResponse.data && sessionResponse.data.user) {
          setAuthState({
            user: sessionResponse.data.user,
            isAuthenticated: true,
            isLoading: false
          });
        } else {
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false
          });
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false
        });
      }
    };

    checkAuthStatus();
  }, []);

  const handleLogout = async () => {
    try {
      const { signOut } = await import('../../config/auth.config');
      await signOut();
      // Clear any stored tokens
      localStorage.removeItem('better_auth_token');
      // Force redirect to home after logout to ensure page refresh
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (authState.isLoading) {
    return (
      <div className="auth-status auth-status--loading">
        Loading...
      </div>
    );
  }

  return (
    <div className="auth-status">
      {authState.isAuthenticated ? (
        <div className="auth-status--authenticated">
          <span className="auth-status__greeting">Hello, {authState.user?.name || authState.user?.email?.split('@')[0]}!</span>
          <button
            onClick={handleLogout}
            className="button button--secondary button--sm auth-status__logout"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="auth-status--unauthenticated">
          <a href="/login" className="button button--secondary button--sm auth-status__login">Log In</a>
          <a href="/signup" className="button button--primary button--sm auth-status__signup">Sign Up</a>
        </div>
      )}
    </div>
  );
};

export default AuthStatus;