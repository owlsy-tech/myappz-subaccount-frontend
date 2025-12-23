/**
 * AppRoutes Component Tests
 * Unit tests for the AppRoutes component
 */

import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import AppRoutes from './AppRoutes';

// Mock route components
vi.mock('../pages/Home', () => ({
  Home: () => <div data-testid="home-page">Home Page</div>,
}));

vi.mock('../pages/NotFound', () => ({
  NotFound: () => <div data-testid="not-found-page">Not Found Page</div>,
}));

// Helper function to render component with router
const renderWithRouter = (component: React.ReactElement, { route = '/' } = {}) => {
  return render(<MemoryRouter initialEntries={[route]}>{component}</MemoryRouter>);
};

describe('AppRoutes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Route Rendering', () => {
    it('should render without crashing', async () => {
      renderWithRouter(<AppRoutes />);
      await waitFor(() => {
        expect(screen.getByTestId('home-page')).toBeInTheDocument();
      });
    });

    it('should render Home page on root route', async () => {
      renderWithRouter(<AppRoutes />, { route: '/' });
      await waitFor(() => {
        expect(screen.getByTestId('home-page')).toBeInTheDocument();
      });
    });

    it('should render NotFound page for unknown routes', async () => {
      renderWithRouter(<AppRoutes />, { route: '/unknown-route' });
      await waitFor(() => {
        expect(screen.getByTestId('not-found-page')).toBeInTheDocument();
      });
    });
  });

  describe('Route Configuration', () => {
    it('should load routes from configuration', async () => {
      const { routes } = await import('./config');
      expect(routes).toBeDefined();
      expect(Array.isArray(routes)).toBe(true);
      expect(routes.length).toBeGreaterThan(0);
    });

    it('should have valid route structure', async () => {
      const { routes } = await import('./config');
      routes.forEach((route: any) => {
        expect(route).toHaveProperty('path');
        expect(route).toHaveProperty('element');
      });
    });
  });

  describe('Lazy Loading', () => {
    it('should support lazy-loaded components', async () => {
      renderWithRouter(<AppRoutes />);
      await waitFor(() => {
        expect(screen.getByTestId('home-page')).toBeInTheDocument();
      });
    });
  });

  describe('Integration', () => {
    it('should integrate with React Router', async () => {
      const { container } = renderWithRouter(<AppRoutes />);
      await waitFor(() => {
        expect(container.querySelector('[data-testid="home-page"]')).toBeInTheDocument();
      });
    });

    it('should handle route navigation', async () => {
      renderWithRouter(<AppRoutes />, { route: '/' });
      await waitFor(() => {
        expect(screen.getByTestId('home-page')).toBeInTheDocument();
      });
    });
  });
});
