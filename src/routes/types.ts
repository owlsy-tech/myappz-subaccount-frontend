/**
 * Route Types
 * Type definitions for application routing configuration
 */

import { ComponentType, LazyExoticComponent } from 'react';

/**
 * Route configuration interface
 */
export interface IRouteConfig {
  /**
   * Route path (supports React Router path patterns)
   */
  path: string;

  /**
   * Component to render for this route
   * Can be a lazy-loaded or regular component
   */
  element: LazyExoticComponent<ComponentType<unknown>> | ComponentType<unknown>;

  /**
   * Optional route title for SEO and accessibility
   */
  title?: string;

  /**
   * Optional route description
   */
  description?: string;

  /**
   * Whether this route requires authentication
   * @default false
   */
  protected?: boolean;

  /**
   * Nested child routes
   */
  children?: IRouteConfig[];

  /**
   * Optional index route flag
   */
  index?: boolean;

  /**
   * Optional route-specific metadata
   */
  meta?: Record<string, unknown>;
}

/**
 * Route group configuration for organizing routes
 */
export interface IRouteGroup {
  /**
   * Group name/identifier
   */
  name: string;

  /**
   * Routes in this group
   */
  routes: IRouteConfig[];

  /**
   * Optional group description
   */
  description?: string;
}
