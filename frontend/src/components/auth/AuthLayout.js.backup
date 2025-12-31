import React from 'react';
import Layout from '@theme/Layout';

// Layout without navbar for auth pages
const AuthLayout = ({ children, title, description }) => {
  return (
    <Layout
      title={title}
      description={description}
      wrapperClassName="auth-layout"
    >
      <div
        className="auth-page"
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0D0D0D'
        }}
      >
        <div style={{
          width: '100%',
          maxWidth: '500px',
          margin: '0 auto',
          padding: '2rem'
        }}>
          {children}
        </div>
      </div>
    </Layout>
  );
};

export default AuthLayout;