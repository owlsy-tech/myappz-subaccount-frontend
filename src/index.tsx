/**
 * Application Entry Point
 * Main entry file for React application
 */

import React from 'react';

import ReactDOM from 'react-dom/client';

import './index.css';
import App from './App';
import { logger } from './utils/logger';

// Get root element
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find the root element');
}

// Create root
const root = ReactDOM.createRoot(rootElement);

// Log application start
logger.info('Application starting', {
  timestamp: new Date().toISOString(),
  environment: import.meta.env.MODE,
  reactVersion: React.version,
});

// Render application
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Log performance metrics after load
if (typeof window !== 'undefined' && 'performance' in window) {
  window.addEventListener('load', () => {
    const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

    if (perfData) {
      logger.info('Page load performance', {
        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
        loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
        domInteractive: perfData.domInteractive - perfData.fetchStart,
        totalLoadTime: perfData.loadEventEnd - perfData.fetchStart,
      });
    }
  });
}

// Hot Module Replacement (HMR) - Vite handles this automatically

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  logger.error('Unhandled promise rejection', {
    reason: event.reason as Error,
    promise: event.promise,
  });
});

// Handle global errors
window.addEventListener('error', (event) => {
  logger.error('Global error caught', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error as Error,
  });
});
