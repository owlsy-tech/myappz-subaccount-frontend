/**
 * Inbox Routes Module Tests
 * Unit tests for the inbox routes configuration
 */

import { Suspense } from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { inboxRoutes } from './inbox';

// Mock the lazy imports
vi.mock('../../pages/Inbox', () => ({
  InboxList: () => <div data-testid="inbox-list">InboxList</div>,
  InboxDetail: () => <div data-testid="inbox-detail">InboxDetail</div>,
  InboxCompose: () => <div data-testid="inbox-compose">InboxCompose</div>,
}));

describe('Inbox Routes Module', () => {
  describe('Route Configuration', () => {
    it('should export inboxRoutes as an array', () => {
      expect(inboxRoutes).toBeDefined();
      expect(Array.isArray(inboxRoutes)).toBe(true);
    });

    it('should have exactly 3 routes', () => {
      expect(inboxRoutes).toHaveLength(3);
    });

    it('should have all required route properties', () => {
      inboxRoutes.forEach((route) => {
        expect(route).toHaveProperty('path');
        expect(route).toHaveProperty('element');
        expect(route).toHaveProperty('title');
        expect(route).toHaveProperty('description');
        expect(route).toHaveProperty('protected');
      });
    });
  });

  describe('Inbox List Route', () => {
    const listRoute = inboxRoutes.find((route) => route.path === '/inbox');

    it('should have correct path', () => {
      expect(listRoute).toBeDefined();
      expect(listRoute?.path).toBe('/inbox');
    });

    it('should have correct title', () => {
      expect(listRoute?.title).toBe('Inbox');
    });

    it('should have correct description', () => {
      expect(listRoute?.description).toBe('View and manage your messages');
    });

    it('should be a protected route', () => {
      expect(listRoute?.protected).toBe(true);
    });

    it('should have element property', () => {
      expect(listRoute?.element).toBeDefined();
      expect(typeof listRoute?.element).toBe('object');
    });
  });

  describe('Inbox Compose Route', () => {
    const composeRoute = inboxRoutes.find((route) => route.path === '/inbox/compose');

    it('should have correct path', () => {
      expect(composeRoute).toBeDefined();
      expect(composeRoute?.path).toBe('/inbox/compose');
    });

    it('should have correct title', () => {
      expect(composeRoute?.title).toBe('Compose Message');
    });

    it('should have correct description', () => {
      expect(composeRoute?.description).toBe('Create a new message');
    });

    it('should be a protected route', () => {
      expect(composeRoute?.protected).toBe(true);
    });

    it('should have element property', () => {
      expect(composeRoute?.element).toBeDefined();
      expect(typeof composeRoute?.element).toBe('object');
    });
  });

  describe('Inbox Detail Route', () => {
    const detailRoute = inboxRoutes.find((route) => route.path === '/inbox/:messageId');

    it('should have correct path with parameter', () => {
      expect(detailRoute).toBeDefined();
      expect(detailRoute?.path).toBe('/inbox/:messageId');
    });

    it('should have correct title', () => {
      expect(detailRoute?.title).toBe('Message Details');
    });

    it('should have correct description', () => {
      expect(detailRoute?.description).toBe('View message details');
    });

    it('should be a protected route', () => {
      expect(detailRoute?.protected).toBe(true);
    });

    it('should have element property', () => {
      expect(detailRoute?.element).toBeDefined();
      expect(typeof detailRoute?.element).toBe('object');
    });
  });

  describe('Route Security', () => {
    it('should have all routes protected', () => {
      const allProtected = inboxRoutes.every((route) => route.protected === true);
      expect(allProtected).toBe(true);
    });
  });

  describe('Route Paths', () => {
    it('should have unique paths', () => {
      const paths = inboxRoutes.map((route) => route.path);
      const uniquePaths = new Set(paths);
      expect(uniquePaths.size).toBe(paths.length);
    });

    it('should have all paths starting with /inbox', () => {
      const allStartWithInbox = inboxRoutes.every((route) => route.path.startsWith('/inbox'));
      expect(allStartWithInbox).toBe(true);
    });
  });

  describe('Route Titles', () => {
    it('should have unique titles', () => {
      const titles = inboxRoutes.map((route) => route.title);
      const uniqueTitles = new Set(titles);
      expect(uniqueTitles.size).toBe(titles.length);
    });

    it('should have non-empty titles', () => {
      const allHaveTitles = inboxRoutes.every((route) => route.title && route.title.length > 0);
      expect(allHaveTitles).toBe(true);
    });
  });

  describe('Route Descriptions', () => {
    it('should have non-empty descriptions', () => {
      const allHaveDescriptions = inboxRoutes.every(
        (route) => route.description && route.description.length > 0
      );
      expect(allHaveDescriptions).toBe(true);
    });
  });

  describe('Route Order', () => {
    it('should have list route first', () => {
      expect(inboxRoutes[0].path).toBe('/inbox');
    });

    it('should have compose route before detail route', () => {
      const composeIndex = inboxRoutes.findIndex((route) => route.path === '/inbox/compose');
      const detailIndex = inboxRoutes.findIndex((route) => route.path === '/inbox/:messageId');
      expect(composeIndex).toBeLessThan(detailIndex);
    });
  });

  describe('Lazy Loading', () => {
    it('should use lazy loaded components', () => {
      inboxRoutes.forEach((route) => {
        expect(route.element).toBeDefined();
        // Lazy components have a $$typeof symbol property
        expect(typeof route.element).toBe('object');
      });
    });

    it('should lazy load InboxList component', async () => {
      const InboxListRoute = inboxRoutes.find((route) => route.path === '/inbox');
      expect(InboxListRoute).toBeDefined();

      const Component = InboxListRoute!.element as React.ComponentType;
      render(
        <Suspense fallback={<div>Loading...</div>}>
          <Component />
        </Suspense>
      );

      await waitFor(() => {
        expect(screen.getByTestId('inbox-list')).toBeInTheDocument();
      });
    });

    it('should lazy load InboxCompose component', async () => {
      const ComposeRoute = inboxRoutes.find((route) => route.path === '/inbox/compose');
      expect(ComposeRoute).toBeDefined();

      const Component = ComposeRoute!.element as React.ComponentType;
      render(
        <Suspense fallback={<div>Loading...</div>}>
          <Component />
        </Suspense>
      );

      await waitFor(() => {
        expect(screen.getByTestId('inbox-compose')).toBeInTheDocument();
      });
    });

    it('should lazy load InboxDetail component', async () => {
      const DetailRoute = inboxRoutes.find((route) => route.path === '/inbox/:messageId');
      expect(DetailRoute).toBeDefined();

      const Component = DetailRoute!.element as React.ComponentType;
      render(
        <Suspense fallback={<div>Loading...</div>}>
          <Component />
        </Suspense>
      );

      await waitFor(() => {
        expect(screen.getByTestId('inbox-detail')).toBeInTheDocument();
      });
    });
  });

  describe('Default Export', () => {
    it('should have default export', async () => {
      const defaultExport = await import('./inbox').then((module) => module.default);
      expect(defaultExport).toBeDefined();
      expect(Array.isArray(defaultExport)).toBe(true);
    });

    it('should match named export', async () => {
      const defaultExport = await import('./inbox').then((module) => module.default);
      expect(defaultExport).toEqual(inboxRoutes);
    });
  });

  describe('Type Safety', () => {
    it('should conform to IRouteConfig interface', () => {
      inboxRoutes.forEach((route) => {
        expect(typeof route.path).toBe('string');
        expect(route.element).toBeDefined();
        expect(typeof route.title).toBe('string');
        expect(typeof route.description).toBe('string');
        expect(typeof route.protected).toBe('boolean');
      });
    });
  });

  describe('Route Parameters', () => {
    it('should have messageId parameter in detail route', () => {
      const detailRoute = inboxRoutes.find((route) => route.path.includes(':messageId'));
      expect(detailRoute).toBeDefined();
      expect(detailRoute?.path).toContain(':messageId');
    });
  });

  describe('Module Structure', () => {
    it('should export inboxRoutes', async () => {
      const module = await import('./inbox');
      expect(module.inboxRoutes).toBeDefined();
      expect(Array.isArray(module.inboxRoutes)).toBe(true);
    });

    it('should export default', async () => {
      const module = await import('./inbox');
      expect(module.default).toBeDefined();
      expect(Array.isArray(module.default)).toBe(true);
    });
  });
});
