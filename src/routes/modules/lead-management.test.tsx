/**
 * Lead Management Routes Module Tests
 * Unit tests for the lead management routes configuration
 */

import { Suspense } from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { leadManagementRoutes } from './lead-management';

// Mock the lazy imports
vi.mock('../../pages/LeadManagement', () => ({
  LeadList: () => <div data-testid="lead-list">LeadList</div>,
  LeadDetail: () => <div data-testid="lead-detail">LeadDetail</div>,
  LeadCreate: () => <div data-testid="lead-create">LeadCreate</div>,
  LeadEdit: () => <div data-testid="lead-edit">LeadEdit</div>,
  LeadImport: () => <div data-testid="lead-import">LeadImport</div>,
  LeadExport: () => <div data-testid="lead-export">LeadExport</div>,
}));

describe('Lead Management Routes Module', () => {
  describe('Route Configuration', () => {
    it('should export leadManagementRoutes as an array', () => {
      expect(leadManagementRoutes).toBeDefined();
      expect(Array.isArray(leadManagementRoutes)).toBe(true);
    });

    it('should have exactly 6 routes', () => {
      expect(leadManagementRoutes).toHaveLength(6);
    });

    it('should have all required route properties', () => {
      leadManagementRoutes.forEach((route) => {
        expect(route).toHaveProperty('path');
        expect(route).toHaveProperty('element');
        expect(route).toHaveProperty('title');
        expect(route).toHaveProperty('description');
        expect(route).toHaveProperty('protected');
      });
    });
  });

  describe('Lead List Route', () => {
    const listRoute = leadManagementRoutes.find((route) => route.path === '/lead-management');

    it('should have correct path', () => {
      expect(listRoute).toBeDefined();
      expect(listRoute?.path).toBe('/lead-management');
    });

    it('should have correct title', () => {
      expect(listRoute?.title).toBe('Lead Management');
    });

    it('should have correct description', () => {
      expect(listRoute?.description).toBe('View and manage your leads');
    });

    it('should be a protected route', () => {
      expect(listRoute?.protected).toBe(true);
    });

    it('should have element property', () => {
      expect(listRoute?.element).toBeDefined();
      expect(typeof listRoute?.element).toBe('object');
    });
  });

  describe('Lead Create Route', () => {
    const createRoute = leadManagementRoutes.find(
      (route) => route.path === '/lead-management/create'
    );

    it('should have correct path', () => {
      expect(createRoute).toBeDefined();
      expect(createRoute?.path).toBe('/lead-management/create');
    });

    it('should have correct title', () => {
      expect(createRoute?.title).toBe('Create Lead');
    });

    it('should have correct description', () => {
      expect(createRoute?.description).toBe('Create a new lead');
    });

    it('should be a protected route', () => {
      expect(createRoute?.protected).toBe(true);
    });

    it('should have element property', () => {
      expect(createRoute?.element).toBeDefined();
      expect(typeof createRoute?.element).toBe('object');
    });
  });

  describe('Lead Import Route', () => {
    const importRoute = leadManagementRoutes.find(
      (route) => route.path === '/lead-management/import'
    );

    it('should have correct path', () => {
      expect(importRoute).toBeDefined();
      expect(importRoute?.path).toBe('/lead-management/import');
    });

    it('should have correct title', () => {
      expect(importRoute?.title).toBe('Import Leads');
    });

    it('should have correct description', () => {
      expect(importRoute?.description).toBe('Import leads from file');
    });

    it('should be a protected route', () => {
      expect(importRoute?.protected).toBe(true);
    });

    it('should have element property', () => {
      expect(importRoute?.element).toBeDefined();
      expect(typeof importRoute?.element).toBe('object');
    });
  });

  describe('Lead Export Route', () => {
    const exportRoute = leadManagementRoutes.find(
      (route) => route.path === '/lead-management/export'
    );

    it('should have correct path', () => {
      expect(exportRoute).toBeDefined();
      expect(exportRoute?.path).toBe('/lead-management/export');
    });

    it('should have correct title', () => {
      expect(exportRoute?.title).toBe('Export Leads');
    });

    it('should have correct description', () => {
      expect(exportRoute?.description).toBe('Export leads to file');
    });

    it('should be a protected route', () => {
      expect(exportRoute?.protected).toBe(true);
    });

    it('should have element property', () => {
      expect(exportRoute?.element).toBeDefined();
      expect(typeof exportRoute?.element).toBe('object');
    });
  });

  describe('Lead Detail Route', () => {
    const detailRoute = leadManagementRoutes.find(
      (route) => route.path === '/lead-management/:leadId'
    );

    it('should have correct path with parameter', () => {
      expect(detailRoute).toBeDefined();
      expect(detailRoute?.path).toBe('/lead-management/:leadId');
    });

    it('should have correct title', () => {
      expect(detailRoute?.title).toBe('Lead Details');
    });

    it('should have correct description', () => {
      expect(detailRoute?.description).toBe('View lead details');
    });

    it('should be a protected route', () => {
      expect(detailRoute?.protected).toBe(true);
    });

    it('should have element property', () => {
      expect(detailRoute?.element).toBeDefined();
      expect(typeof detailRoute?.element).toBe('object');
    });
  });

  describe('Lead Edit Route', () => {
    const editRoute = leadManagementRoutes.find(
      (route) => route.path === '/lead-management/:leadId/edit'
    );

    it('should have correct path with parameter', () => {
      expect(editRoute).toBeDefined();
      expect(editRoute?.path).toBe('/lead-management/:leadId/edit');
    });

    it('should have correct title', () => {
      expect(editRoute?.title).toBe('Edit Lead');
    });

    it('should have correct description', () => {
      expect(editRoute?.description).toBe('Edit lead information');
    });

    it('should be a protected route', () => {
      expect(editRoute?.protected).toBe(true);
    });

    it('should have element property', () => {
      expect(editRoute?.element).toBeDefined();
      expect(typeof editRoute?.element).toBe('object');
    });
  });

  describe('Route Security', () => {
    it('should have all routes protected', () => {
      const allProtected = leadManagementRoutes.every((route) => route.protected === true);
      expect(allProtected).toBe(true);
    });
  });

  describe('Route Paths', () => {
    it('should have unique paths', () => {
      const paths = leadManagementRoutes.map((route) => route.path);
      const uniquePaths = new Set(paths);
      expect(uniquePaths.size).toBe(paths.length);
    });

    it('should have all paths starting with /lead-management', () => {
      const allStartWithLeadManagement = leadManagementRoutes.every((route) =>
        route.path.startsWith('/lead-management')
      );
      expect(allStartWithLeadManagement).toBe(true);
    });

    it('should have static routes before parameterized routes', () => {
      const createIndex = leadManagementRoutes.findIndex(
        (route) => route.path === '/lead-management/create'
      );
      const detailIndex = leadManagementRoutes.findIndex(
        (route) => route.path === '/lead-management/:leadId'
      );
      expect(createIndex).toBeLessThan(detailIndex);
    });
  });

  describe('Route Titles', () => {
    it('should have unique titles', () => {
      const titles = leadManagementRoutes.map((route) => route.title);
      const uniqueTitles = new Set(titles);
      expect(uniqueTitles.size).toBe(titles.length);
    });

    it('should have non-empty titles', () => {
      const allHaveTitles = leadManagementRoutes.every(
        (route) => route.title && route.title.length > 0
      );
      expect(allHaveTitles).toBe(true);
    });
  });

  describe('Route Descriptions', () => {
    it('should have non-empty descriptions', () => {
      const allHaveDescriptions = leadManagementRoutes.every(
        (route) => route.description && route.description.length > 0
      );
      expect(allHaveDescriptions).toBe(true);
    });

    it('should have unique descriptions', () => {
      const descriptions = leadManagementRoutes.map((route) => route.description);
      const uniqueDescriptions = new Set(descriptions);
      expect(uniqueDescriptions.size).toBe(descriptions.length);
    });
  });

  describe('Route Order', () => {
    it('should have list route first', () => {
      expect(leadManagementRoutes[0].path).toBe('/lead-management');
    });

    it('should have create route early in the list', () => {
      const createIndex = leadManagementRoutes.findIndex(
        (route) => route.path === '/lead-management/create'
      );
      expect(createIndex).toBeLessThan(3);
    });

    it('should have import and export routes before parameterized routes', () => {
      const importIndex = leadManagementRoutes.findIndex(
        (route) => route.path === '/lead-management/import'
      );
      const exportIndex = leadManagementRoutes.findIndex(
        (route) => route.path === '/lead-management/export'
      );
      const detailIndex = leadManagementRoutes.findIndex(
        (route) => route.path === '/lead-management/:leadId'
      );
      expect(importIndex).toBeLessThan(detailIndex);
      expect(exportIndex).toBeLessThan(detailIndex);
    });
  });

  describe('Lazy Loading', () => {
    it('should use lazy loaded components', () => {
      leadManagementRoutes.forEach((route) => {
        expect(route.element).toBeDefined();
        // Lazy components have a $$typeof symbol property
        expect(typeof route.element).toBe('object');
      });
    });

    it('should lazy load LeadList component', async () => {
      const ListRoute = leadManagementRoutes.find((route) => route.path === '/lead-management');
      expect(ListRoute).toBeDefined();

      const Component = ListRoute!.element as React.ComponentType;
      render(
        <Suspense fallback={<div>Loading...</div>}>
          <Component />
        </Suspense>
      );

      await waitFor(() => {
        expect(screen.getByTestId('lead-list')).toBeInTheDocument();
      });
    });

    it('should lazy load LeadCreate component', async () => {
      const CreateRoute = leadManagementRoutes.find(
        (route) => route.path === '/lead-management/create'
      );
      expect(CreateRoute).toBeDefined();

      const Component = CreateRoute!.element as React.ComponentType;
      render(
        <Suspense fallback={<div>Loading...</div>}>
          <Component />
        </Suspense>
      );

      await waitFor(() => {
        expect(screen.getByTestId('lead-create')).toBeInTheDocument();
      });
    });

    it('should lazy load LeadImport component', async () => {
      const ImportRoute = leadManagementRoutes.find(
        (route) => route.path === '/lead-management/import'
      );
      expect(ImportRoute).toBeDefined();

      const Component = ImportRoute!.element as React.ComponentType;
      render(
        <Suspense fallback={<div>Loading...</div>}>
          <Component />
        </Suspense>
      );

      await waitFor(() => {
        expect(screen.getByTestId('lead-import')).toBeInTheDocument();
      });
    });

    it('should lazy load LeadExport component', async () => {
      const ExportRoute = leadManagementRoutes.find(
        (route) => route.path === '/lead-management/export'
      );
      expect(ExportRoute).toBeDefined();

      const Component = ExportRoute!.element as React.ComponentType;
      render(
        <Suspense fallback={<div>Loading...</div>}>
          <Component />
        </Suspense>
      );

      await waitFor(() => {
        expect(screen.getByTestId('lead-export')).toBeInTheDocument();
      });
    });

    it('should lazy load LeadDetail component', async () => {
      const DetailRoute = leadManagementRoutes.find(
        (route) => route.path === '/lead-management/:leadId'
      );
      expect(DetailRoute).toBeDefined();

      const Component = DetailRoute!.element as React.ComponentType;
      render(
        <Suspense fallback={<div>Loading...</div>}>
          <Component />
        </Suspense>
      );

      await waitFor(() => {
        expect(screen.getByTestId('lead-detail')).toBeInTheDocument();
      });
    });

    it('should lazy load LeadEdit component', async () => {
      const EditRoute = leadManagementRoutes.find(
        (route) => route.path === '/lead-management/:leadId/edit'
      );
      expect(EditRoute).toBeDefined();

      const Component = EditRoute!.element as React.ComponentType;
      render(
        <Suspense fallback={<div>Loading...</div>}>
          <Component />
        </Suspense>
      );

      await waitFor(() => {
        expect(screen.getByTestId('lead-edit')).toBeInTheDocument();
      });
    });
  });

  describe('Default Export', () => {
    it('should have default export', async () => {
      const defaultExport = await import('./lead-management').then((module) => module.default);
      expect(defaultExport).toBeDefined();
      expect(Array.isArray(defaultExport)).toBe(true);
    });

    it('should match named export', async () => {
      const defaultExport = await import('./lead-management').then((module) => module.default);
      expect(defaultExport).toEqual(leadManagementRoutes);
    });
  });

  describe('Type Safety', () => {
    it('should conform to IRouteConfig interface', () => {
      leadManagementRoutes.forEach((route) => {
        expect(typeof route.path).toBe('string');
        expect(route.element).toBeDefined();
        expect(typeof route.title).toBe('string');
        expect(typeof route.description).toBe('string');
        expect(typeof route.protected).toBe('boolean');
      });
    });
  });

  describe('Route Parameters', () => {
    it('should have leadId parameter in detail route', () => {
      const detailRoute = leadManagementRoutes.find((route) => route.path.includes(':leadId'));
      expect(detailRoute).toBeDefined();
      expect(detailRoute?.path).toContain(':leadId');
    });

    it('should have leadId parameter in edit route', () => {
      const editRoute = leadManagementRoutes.find(
        (route) => route.path === '/lead-management/:leadId/edit'
      );
      expect(editRoute).toBeDefined();
      expect(editRoute?.path).toContain(':leadId');
    });

    it('should have exactly 2 routes with parameters', () => {
      const routesWithParams = leadManagementRoutes.filter((route) => route.path.includes(':'));
      expect(routesWithParams).toHaveLength(2);
    });
  });

  describe('CRUD Operations Coverage', () => {
    it('should have route for listing leads', () => {
      const listRoute = leadManagementRoutes.find((route) => route.path === '/lead-management');
      expect(listRoute).toBeDefined();
    });

    it('should have route for creating leads', () => {
      const createRoute = leadManagementRoutes.find(
        (route) => route.path === '/lead-management/create'
      );
      expect(createRoute).toBeDefined();
    });

    it('should have route for viewing lead details', () => {
      const detailRoute = leadManagementRoutes.find(
        (route) => route.path === '/lead-management/:leadId'
      );
      expect(detailRoute).toBeDefined();
    });

    it('should have route for editing leads', () => {
      const editRoute = leadManagementRoutes.find(
        (route) => route.path === '/lead-management/:leadId/edit'
      );
      expect(editRoute).toBeDefined();
    });
  });

  describe('Import/Export Functionality', () => {
    it('should have route for importing leads', () => {
      const importRoute = leadManagementRoutes.find(
        (route) => route.path === '/lead-management/import'
      );
      expect(importRoute).toBeDefined();
    });

    it('should have route for exporting leads', () => {
      const exportRoute = leadManagementRoutes.find(
        (route) => route.path === '/lead-management/export'
      );
      expect(exportRoute).toBeDefined();
    });
  });

  describe('Module Structure', () => {
    it('should export leadManagementRoutes', async () => {
      const module = await import('./lead-management');
      expect(module.leadManagementRoutes).toBeDefined();
      expect(Array.isArray(module.leadManagementRoutes)).toBe(true);
    });

    it('should export default', async () => {
      const module = await import('./lead-management');
      expect(module.default).toBeDefined();
      expect(Array.isArray(module.default)).toBe(true);
    });
  });

  describe('Route Completeness', () => {
    it('should have all expected lead management operations', () => {
      const expectedPaths = [
        '/lead-management',
        '/lead-management/create',
        '/lead-management/import',
        '/lead-management/export',
        '/lead-management/:leadId',
        '/lead-management/:leadId/edit',
      ];

      const actualPaths = leadManagementRoutes.map((route) => route.path);
      expect(actualPaths).toEqual(expect.arrayContaining(expectedPaths));
    });
  });
});
