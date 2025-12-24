
import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Chatbot from '@site/src/components/Chatbot';

import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';
import AuthStatus from '@site/src/components/auth/AuthStatus';
import { checkSession } from '../config/auth.config';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header
      className={clsx('hero hero--primary', styles.heroBanner)}
      style={{
        background: 'linear-gradient(90deg, #0D0D0D, #1a1a1a)', // dark background
        color: '#ff9f0d', // primary accent color
      }}
    >
      <div className="container">
        <Heading as="h1" className="hero__title" style={{ color: '#ff9f0d' }}>
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle" style={{ color: '#ffffff' }}>
          {siteConfig.tagline}
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            style={{
              backgroundColor: '#ff9f0d', // orange button
              color: '#0D0D0D',           // dark text
              borderRadius: '8px',
              border: '1px solid #ffb733',
            }}
            to="/docs/intro"
          >
            Physical AI & Humanoid Robotics Video Tutorial 🎥 CLICK HERE TO WATCH THE VIDEO ⏱️
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  const [authState, setAuthState] = useState<{ user: any; isAuthenticated: boolean; isLoading: boolean }>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  useEffect(() => {
    // Check session status when component mounts
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

  const { user, isAuthenticated, isLoading } = authState;

  if (isLoading) {
    return (
      <Layout
        title={` ${siteConfig.title}`}
        description="Description will go into a meta tag in <head />"
      >
        <div style={{ backgroundColor: '#0D0D0D', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ color: '#ff9f0d', fontSize: '1.5rem' }}>
            Loading...
          </div>
        </div>
      </Layout>
    );
  }

  // If user is authenticated, show the full home page with all features
  if (isAuthenticated && user) {
    return (
      <Layout
        title={` ${siteConfig.title}`}
        description="Description will go into a meta tag in <head />"
      >
        <div style={{ backgroundColor: '#0D0D0D', minHeight: '100vh' }}>
          <div style={{ padding: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
            <AuthStatus />
          </div>
          <HomepageHeader />
          <main>
            <HomepageFeatures />
            <Chatbot />
          </main>
        </div>
      </Layout>
    );
  } else {
    // If user is not authenticated, show only the authentication box
    return (
      <Layout
        title={` ${siteConfig.title}`}
        description="Description will go into a meta tag in <head />"
      >
        <div style={{ backgroundColor: '#0D0D0D', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: '400px', padding: '2rem', textAlign: 'center' }}>
            <div style={{
              backgroundColor: '#1a1a1a',
              borderRadius: '10px',
              padding: '2rem',
              border: '1px solid rgba(255, 159, 13, 0.2)',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
              <h1 style={{ color: '#ff9f0d', marginBottom: '1.5rem' }}>{siteConfig.title}</h1>
              <p style={{ color: '#ffffff', marginBottom: '2rem' }}>{siteConfig.tagline}</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <a
                  href="/login"
                  style={{
                    display: 'block',
                    backgroundColor: '#ff9f0d',
                    color: '#0D0D0D',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    fontWeight: '500',
                    border: '1px solid rgba(255, 159, 13, 0.3)',
                  }}
                >
                  Sign In
                </a>

                <a
                  href="/signup"
                  style={{
                    display: 'block',
                    backgroundColor: '#0D0D0D',
                    color: '#ff9f0d',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    fontWeight: '500',
                    border: '1px solid #ff9f0d',
                  }}
                >
                  Sign Up
                </a>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}
