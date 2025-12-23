/**
 * Routes Module
 * Central export point for all routing-related utilities
 */

export { default as AppRoutes } from './AppRoutes';
export { default as routes, appRoutes, protectedRoutes, publicRoutes } from './config';
export type { IRouteConfig, IRouteGroup } from './types';
