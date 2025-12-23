/**
 * Layout Component
 * Main layout wrapper with header, footer, and content area
 */

import { memo, ReactNode } from 'react';

import { Link, useLocation } from 'react-router-dom';

import { useUser } from '../../store/useUserStore';

interface ILayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: ILayoutProps) => {
  const location = useLocation();
  const user = useUser();

  const isActive = (path: string): boolean => {
    return location.pathname === path;
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Header */}
      <header
        style={{
          backgroundColor: '#1a202c',
          color: 'white',
          padding: '1rem 2rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
        role="banner"
      >
        <nav
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
          aria-label="Main navigation"
        >
          <div>
            <Link
              to="/"
              style={{
                color: 'white',
                textDecoration: 'none',
                fontSize: '1.5rem',
                fontWeight: 'bold',
              }}
              aria-label="Home"
            >
              React App
            </Link>
          </div>

          <ul
            style={{
              display: 'flex',
              gap: '2rem',
              listStyle: 'none',
              margin: 0,
              padding: 0,
              alignItems: 'center',
            }}
          >
            <li>
              <Link
                to="/"
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  backgroundColor: isActive('/') ? '#2d3748' : 'transparent',
                  transition: 'background-color 0.2s',
                }}
                aria-current={isActive('/') ? 'page' : undefined}
              >
                Home
              </Link>
            </li>
            {user && (
              <li
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <span style={{ fontSize: '0.875rem', opacity: 0.8 }}>
                  Welcome, {user.firstName}
                </span>
              </li>
            )}
          </ul>
        </nav>
      </header>

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          maxWidth: '1200px',
          width: '100%',
          margin: '0 auto',
          padding: '2rem',
        }}
        role="main"
      >
        {children}
      </main>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: '#f7fafc',
          borderTop: '1px solid #e2e8f0',
          padding: '2rem',
          marginTop: 'auto',
        }}
        role="contentinfo"
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            textAlign: 'center',
            color: '#718096',
            fontSize: '0.875rem',
          }}
        >
          <p style={{ margin: 0 }}>
            &copy; {new Date().getFullYear()} React App. All rights reserved.
          </p>
          <p style={{ margin: '0.5rem 0 0' }}>
            Built with React, TypeScript, and modern best practices
          </p>
        </div>
      </footer>
    </div>
  );
};

export default memo(Layout);
