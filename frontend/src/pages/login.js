import React from 'react';
import AuthLayout from '../components/auth/AuthLayout';
import LoginForm from '../components/auth/LoginForm';
import { useHistory } from '@docusaurus/router';

function LoginPage() {
  const history = useHistory();

  const handleLoginSuccess = async () => {
    // Wait a moment to ensure token is properly stored
    await new Promise(resolve => setTimeout(resolve, 300));

    // Check if token is available before redirecting
    const token = localStorage.getItem('better_auth_token');

    if (token) {
      // Token is available, redirect immediately
      window.location.href = '/';
    } else {
      // Token might not be stored yet, wait a bit more
      setTimeout(() => {
        window.location.href = '/';
      }, 500);
    }
  };

  const handleLoginError = (error) => {
    console.error('Login error:', error);
    // Error handling is done within the LoginForm component
  };

  return (
    <AuthLayout title="Sign In" description="Sign in to your account">
      <div className="container margin-vert--lg">
        <div className="row">
          <div className="col col--6 col--offset-3">
            <LoginForm
              onSuccess={handleLoginSuccess}
              onError={handleLoginError}
            />
            <div className="margin-top--md">
              Don't have an account? <a href="/signup">Sign up here</a>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}

export default LoginPage;