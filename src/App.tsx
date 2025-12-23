/**
 * App Component
 * Main application component with routing, error boundaries, and performance monitoring
 */

import { Suspense } from 'react';

import { BrowserRouter } from 'react-router-dom';

import { ErrorBoundary } from './components/ErrorBoundary';
import { Layout } from './components/Layout';
import { PerformanceMonitor } from './components/PerformanceMonitor';
import { AppRoutes } from './routes';
import { logger } from './utils/logger';

/**
 * Loading fallback component
 */
const LoadingFallback = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      fontSize: '1.25rem',
      color: '#718096',
    }}
    role="status"
    aria-live="polite"
    aria-label="Loading page content"
  >
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          border: '4px solid #e2e8f0',
          borderTop: '4px solid #4299e1',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}
        aria-hidden="true"
      />
      <span>Loading...</span>
    </div>
    <style>
      {`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}
    </style>
  </div>
);

/**
 * Main App Component
 */
const App = () => {
  // Log app initialization
  logger.info('Application initialized', {
    environment: import.meta.env.MODE,
    version: import.meta.env.VITE_VERSION || '0.1.0',
  });

  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        logger.error('Application error caught by boundary', {
          error: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
        });
      }}
    >
      <BrowserRouter>
        <Layout>
          <Suspense fallback={<LoadingFallback />}>
            <AppRoutes />
          </Suspense>
        </Layout>
      </BrowserRouter>

      {/* Performance Monitor (Development only) */}
      {import.meta.env.MODE === 'development' && <PerformanceMonitor position="bottom-right" />}
    </ErrorBoundary>
  );
};

export default App;
