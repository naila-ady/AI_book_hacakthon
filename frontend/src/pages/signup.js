import React from 'react';
import AuthLayout from '../components/auth/AuthLayout';
import SignupForm from '../components/auth/SignupForm';
import { useHistory } from '@docusaurus/router';

function SignupPage() {
  const history = useHistory();

  const handleSignupSuccess = async () => {
    // Wait a moment to ensure token is properly stored
    await new Promise(resolve => setTimeout(resolve, 300));

    // Redirect to the main application (book content)
    window.location.href = '/';
  };

  const handleSignupError = (error) => {
    console.error('Signup error:', error);
    // Error handling is done within the SignupForm component
  };

  return (
    <AuthLayout title="Sign Up" description="Create a new account">
      <div className="container margin-vert--lg">
        <div className="row">
          <div className="col col--6 col--offset-3">
            <SignupForm
              onSuccess={handleSignupSuccess}
              onError={handleSignupError}
            />
            <div className="margin-top--md">
              Already have an account? <a href="/login">Sign in here</a>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}

export default SignupPage;