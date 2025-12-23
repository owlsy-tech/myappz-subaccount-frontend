/**
 * Lead Management Module Routes Configuration
 * Centralized routing configuration for the Lead Management module
 */

import { lazy } from 'react';

import { IRouteConfig } from '../types';

// Lazy load Lead Management pages for code splitting
const LeadList = lazy(() =>
  import('../../pages/LeadManagement').then((module) => ({ default: module.LeadList }))
);

const LeadDetail = lazy(() =>
  import('../../pages/LeadManagement').then((module) => ({ default: module.LeadDetail }))
);

const LeadCreate = lazy(() =>
  import('../../pages/LeadManagement').then((module) => ({ default: module.LeadCreate }))
);

const LeadEdit = lazy(() =>
  import('../../pages/LeadManagement').then((module) => ({ default: module.LeadEdit }))
);

const LeadImport = lazy(() =>
  import('../../pages/LeadManagement').then((module) => ({ default: module.LeadImport }))
);

const LeadExport = lazy(() =>
  import('../../pages/LeadManagement').then((module) => ({ default: module.LeadExport }))
);

/**
 * Lead Management module routes
 * All routes related to lead management functionality
 */
export const leadManagementRoutes: IRouteConfig[] = [
  {
    path: '/lead-management',
    element: LeadList,
    title: 'Lead Management',
    description: 'View and manage your leads',
    protected: true,
  },
  {
    path: '/lead-management/create',
    element: LeadCreate,
    title: 'Create Lead',
    description: 'Create a new lead',
    protected: true,
  },
  {
    path: '/lead-management/import',
    element: LeadImport,
    title: 'Import Leads',
    description: 'Import leads from file',
    protected: true,
  },
  {
    path: '/lead-management/export',
    element: LeadExport,
    title: 'Export Leads',
    description: 'Export leads to file',
    protected: true,
  },
  {
    path: '/lead-management/:leadId',
    element: LeadDetail,
    title: 'Lead Details',
    description: 'View lead details',
    protected: true,
  },
  {
    path: '/lead-management/:leadId/edit',
    element: LeadEdit,
    title: 'Edit Lead',
    description: 'Edit lead information',
    protected: true,
  },
];

export default leadManagementRoutes;
