/**
 * Routes Configuration
 * Centralized routing configuration for the application
 * Add or modify routes here instead of in App.tsx
 */

import { lazy } from 'react';

import { inboxRoutes, leadManagementRoutes } from './modules';
import { IRouteConfig } from './types';

// Lazy load pages for code splitting
const Home = lazy(() => import('../pages/Home').then((module) => ({ default: module.Home })));
const NotFound = lazy(() =>
  import('../pages/NotFound').then((module) => ({ default: module.NotFound }))
);

/**
 * Main application routes
 */
export const appRoutes: IRouteConfig[] = [
  {
    path: '/',
    element: Home,
    title: 'Home',
    description: 'Subaccount Management Home',
  },
  {
    path: '*',
    element: NotFound,
    title: 'Page Not Found',
    description: '404 - Page not found',
  },
];

/**
 * Protected routes that require authentication
 * Add authentication-required routes here
 */
export const protectedRoutes: IRouteConfig[] = [
  // Module routes
  ...inboxRoutes,
  ...leadManagementRoutes,

  // Example:
  // {
  //   path: '/dashboard',
  //   element: Dashboard,
  //   title: 'Dashboard',
  //   protected: true,
  // },
];

/**
 * Public routes that don't require authentication
 */
export const publicRoutes: IRouteConfig[] = [
  // Example:
  // {
  //   path: '/login',
  //   element: Login,
  //   title: 'Login',
  // },
];

/**
 * All routes combined
 */
export const routes: IRouteConfig[] = [...appRoutes, ...protectedRoutes, ...publicRoutes];

export default routes;
