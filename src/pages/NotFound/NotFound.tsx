/**
 * NotFound Page Component
 * 404 error page with navigation back to home
 */

import { memo } from 'react';

import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
        padding: '2rem',
      }}
    >
      <div
        style={{
          fontSize: '8rem',
          fontWeight: 'bold',
          color: '#4299e1',
          lineHeight: 1,
          marginBottom: '1rem',
        }}
        aria-hidden="true"
      >
        404
      </div>

      <h1
        style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          color: '#2d3748',
          marginBottom: '1rem',
        }}
      >
        Page Not Found
      </h1>

      <p
        style={{
          fontSize: '1.125rem',
          color: '#718096',
          marginBottom: '2rem',
          maxWidth: '500px',
        }}
      >
        Sorry, the page you are looking for does not exist or has been moved.
      </p>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link
          to="/"
          style={{
            display: 'inline-block',
            padding: '0.75rem 2rem',
            backgroundColor: '#4299e1',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            fontWeight: '600',
            transition: 'background-color 0.2s',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#3182ce';
          }}
          onFocus={(e) => {
            e.currentTarget.style.backgroundColor = '#3182ce';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#4299e1';
          }}
          onBlur={(e) => {
            e.currentTarget.style.backgroundColor = '#4299e1';
          }}
        >
          Go to Home
        </Link>

        <button
          onClick={() => window.history.back()}
          style={{
            padding: '0.75rem 2rem',
            backgroundColor: '#edf2f7',
            color: '#2d3748',
            border: '1px solid #cbd5e0',
            borderRadius: '4px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#e2e8f0';
          }}
          onFocus={(e) => {
            e.currentTarget.style.backgroundColor = '#e2e8f0';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#edf2f7';
          }}
          onBlur={(e) => {
            e.currentTarget.style.backgroundColor = '#edf2f7';
          }}
          type="button"
        >
          Go Back
        </button>
      </div>

      <div
        style={{
          marginTop: '3rem',
          padding: '1.5rem',
          backgroundColor: '#f7fafc',
          borderRadius: '8px',
          maxWidth: '600px',
        }}
      >
        <h2
          style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#2d3748',
            marginBottom: '0.75rem',
          }}
        >
          Need Help?
        </h2>
        <p
          style={{
            fontSize: '0.9rem',
            color: '#718096',
            marginBottom: '1rem',
          }}
        >
          If you believe this is an error, please contact support or check the following:
        </p>
        <ul
          style={{
            textAlign: 'left',
            color: '#4a5568',
            fontSize: '0.9rem',
            paddingLeft: '1.5rem',
          }}
        >
          <li style={{ marginBottom: '0.5rem' }}>Check the URL for typos</li>
          <li style={{ marginBottom: '0.5rem' }}>Make sure you have the correct permissions</li>
          <li style={{ marginBottom: '0.5rem' }}>
            Try refreshing the page or clearing your browser cache
          </li>
        </ul>
      </div>
    </div>
  );
};

export default memo(NotFound);
