import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/auth';
import { useHistory } from '@docusaurus/router';

const UserProfile = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const history = useHistory();

  const handleLogout = async () => {
    try {
      await authService.logout();
      // Clear any stored tokens
      localStorage.removeItem('better_auth_token');
      // Force redirect to home after logout to ensure page refresh
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (isLoading) {
    return <div>...</div>; // Loading state
  }

  if (!isAuthenticated) {
    return (
      <div>
        <a href="/login" className="button button--secondary button--sm">Log In</a>
        <a href="/signup" className="button button--primary button--sm margin-left--sm">Sign Up</a>
      </div>
    );
  }

  return (
    <div className="dropdown dropdown--right dropdown--username">
      <span className="navbar__link">
        {user?.name || user?.email}
      </span>
      <button
        onClick={handleLogout}
        className="button button--secondary button--sm margin-left--sm"
      >
        Logout
      </button>
    </div>
  );
};

export default UserProfile;