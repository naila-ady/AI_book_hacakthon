import React from 'react';
import Layout from '@theme/Layout';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import { useAuth } from '../contexts/AuthContext';

function DashboardPage() {
  const { user } = useAuth();

  return (
    <Layout title="Dashboard" description="User dashboard">
      <ProtectedRoute>
        <div className="container margin-vert--lg">
          <div className="row">
            <div className="col col--8 col--offset-2">
              <h1>User Dashboard</h1>
              <div className="card">
                <div className="card__body">
                  <h3>Welcome, {user?.name || user?.email}!</h3>
                  <p>This is a protected page. Only authenticated users can see this content.</p>
                  <p>Your email: {user?.email}</p>
                  <p>Account created: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    </Layout>
  );
}

export default DashboardPage;