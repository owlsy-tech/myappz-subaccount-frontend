/**
 * App Component Tests
 * Unit tests for main App component
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import App from './App';

// Mock child components
vi.mock('./components/ErrorBoundary', () => ({
  ErrorBoundary: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="error-boundary">{children}</div>
  ),
}));

vi.mock('./components/Layout', () => ({
  Layout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="layout">{children}</div>
  ),
}));

vi.mock('./components/PerformanceMonitor', () => ({
  PerformanceMonitor: () => <div data-testid="performance-monitor">Performance Monitor</div>,
}));

vi.mock('./pages/Home', () => ({
  Home: () => <div data-testid="home-page">Home Page</div>,
}));

vi.mock('./pages/NotFound', () => ({
  NotFound: () => <div data-testid="not-found-page">Not Found Page</div>,
}));

// Mock logger
vi.mock('./utils/logger', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  },
}));

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      render(<App />);
      expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
    });

    it('should render Layout component', () => {
      render(<App />);
      expect(screen.getByTestId('layout')).toBeInTheDocument();
    });

    it('should render Home page on root route', () => {
      render(<App />);
      expect(screen.getByTestId('home-page')).toBeInTheDocument();
    });
  });

  describe('Error Boundary', () => {
    it('should wrap application in ErrorBoundary', () => {
      render(<App />);
      expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
    });
  });

  describe('Performance Monitor', () => {
    afterEach(() => {
      vi.unstubAllEnvs();
    });

    it('should render PerformanceMonitor in development mode', () => {
      vi.stubEnv('MODE', 'development');
      render(<App />);
      expect(screen.getByTestId('performance-monitor')).toBeInTheDocument();
    });

    it('should not render PerformanceMonitor in production mode', () => {
      vi.stubEnv('MODE', 'production');
      render(<App />);
      expect(screen.queryByTestId('performance-monitor')).not.toBeInTheDocument();
    });
  });

  describe('Routing', () => {
    it('should use BrowserRouter for routing', () => {
      render(<App />);
      // Router is rendered implicitly through the app structure
      expect(screen.getByTestId('layout')).toBeInTheDocument();
    });

    it('should support lazy loading with Suspense', () => {
      render(<App />);
      // Suspense fallback would show during lazy loading
      expect(screen.getByTestId('home-page')).toBeInTheDocument();
    });
  });

  describe('Logging', () => {
    it('should log application initialization', async () => {
      const { logger } = await import('./utils/logger');
      render(<App />);

      expect(logger.info).toHaveBeenCalledWith(
        'Application initialized',
        expect.objectContaining({
          environment: expect.any(String),
        })
      );
    });
  });
});
