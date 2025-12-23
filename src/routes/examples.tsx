/* eslint-disable import/no-unresolved, import/extensions, @typescript-eslint/no-unsafe-return */
/**
 * Route Configuration Examples
 * This file contains examples of common routing patterns.
 * Copy these patterns to config.tsx when implementing new routes.
 *
 * Note: This file contains intentional type errors for demonstration purposes.
 * The imports reference non-existent pages as examples.
 */

import { lazy } from 'react';

import { IRouteConfig } from './types';

// ============================================================================
// BASIC ROUTES
// ============================================================================

/**
 * Example 1: Simple Route
 * Most basic route configuration
 */
// @ts-expect-error - Example import for demonstration
const SimplePageExample = lazy(() => import('../pages/SimplePage'));

export const simpleRouteExample: IRouteConfig = {
  path: '/simple',
  element: SimplePageExample,
  title: 'Simple Page',
  description: 'A simple page example',
};

// ============================================================================
// DYNAMIC ROUTES
// ============================================================================

/**
 * Example 2: Dynamic Route with Parameters
 * Use :paramName for URL parameters
 */
// @ts-expect-error - Example import for demonstration
const UserProfileExample = lazy(() => import('../pages/UserProfile'));

export const dynamicRouteExample: IRouteConfig = {
  path: '/users/:userId',
  element: UserProfileExample,
  title: 'User Profile',
  description: 'View user profile details',
};

/**
 * Example 3: Multiple Parameters
 */
// @ts-expect-error - Example import for demonstration
const ProductDetailExample = lazy(() => import('../pages/ProductDetail'));

export const multipleParamsExample: IRouteConfig = {
  path: '/products/:categoryId/:productId',
  element: ProductDetailExample,
  title: 'Product Details',
  description: 'View product details',
};

// ============================================================================
// NESTED ROUTES
// ============================================================================

/**
 * Example 4: Nested Routes with Layout
 * Parent component should use <Outlet /> from react-router-dom
 */
// @ts-expect-error - Example import for demonstration
const SettingsLayoutExample = lazy(() => import('../pages/Settings/Layout'));
// @ts-expect-error - Example import for demonstration
const ProfileSettingsExample = lazy(() => import('../pages/Settings/Profile'));
// @ts-expect-error - Example import for demonstration
const SecuritySettingsExample = lazy(() => import('../pages/Settings/Security'));
// @ts-expect-error - Example import for demonstration
const NotificationsSettingsExample = lazy(() => import('../pages/Settings/Notifications'));

export const nestedRoutesExample: IRouteConfig = {
  path: '/settings',
  element: SettingsLayoutExample,
  title: 'Settings',
  children: [
    {
      index: true, // Default child route (renders at /settings)
      path: '',
      element: ProfileSettingsExample,
      title: 'Profile Settings',
    },
    {
      path: 'security', // Renders at /settings/security
      element: SecuritySettingsExample,
      title: 'Security Settings',
    },
    {
      path: 'notifications', // Renders at /settings/notifications
      element: NotificationsSettingsExample,
      title: 'Notification Settings',
    },
  ],
};

// ============================================================================
// PROTECTED ROUTES
// ============================================================================

/**
 * Example 5: Protected Route (Requires Authentication)
 * Set protected: true for routes that need authentication
 */
// @ts-expect-error - Example import for demonstration
const DashboardExample = lazy(() => import('../pages/Dashboard'));

export const protectedRouteExample: IRouteConfig = {
  path: '/dashboard',
  element: DashboardExample,
  title: 'Dashboard',
  description: 'User dashboard',
  protected: true,
};

/**
 * Example 6: Protected Route with Role-Based Access
 * Use meta object for custom authorization logic
 */
// @ts-expect-error - Example import for demonstration
const AdminPanelExample = lazy(() => import('../pages/Admin'));

export const roleBasedRouteExample: IRouteConfig = {
  path: '/admin',
  element: AdminPanelExample,
  title: 'Admin Panel',
  description: 'Administrative dashboard',
  protected: true,
  meta: {
    roles: ['admin', 'superadmin'],
    permissions: ['manage_users', 'manage_settings'],
  },
};

// ============================================================================
// PUBLIC ROUTES
// ============================================================================

/**
 * Example 7: Authentication Routes
 * Routes that should only be accessible when NOT logged in
 */
// @ts-expect-error - Example import for demonstration
const LoginExample = lazy(() => import('../pages/Auth/Login'));
// @ts-expect-error - Example import for demonstration
const RegisterExample = lazy(() => import('../pages/Auth/Register'));
// @ts-expect-error - Example import for demonstration
const ForgotPasswordExample = lazy(() => import('../pages/Auth/ForgotPassword'));

export const authRoutesExample: IRouteConfig[] = [
  {
    path: '/login',
    element: LoginExample,
    title: 'Login',
    description: 'Sign in to your account',
  },
  {
    path: '/register',
    element: RegisterExample,
    title: 'Register',
    description: 'Create a new account',
  },
  {
    path: '/forgot-password',
    element: ForgotPasswordExample,
    title: 'Forgot Password',
    description: 'Reset your password',
  },
];

// ============================================================================
// WILDCARD ROUTES
// ============================================================================

/**
 * Example 8: Catch-All Route
 * Must be placed last in the routes array
 */
// @ts-expect-error - Example import for demonstration
const NotFoundExample = lazy(() => import('../pages/NotFound'));

export const catchAllRouteExample: IRouteConfig = {
  path: '*',
  element: NotFoundExample,
  title: 'Page Not Found',
  description: '404 - Page not found',
};

// ============================================================================
// ROUTES WITH METADATA
// ============================================================================

/**
 * Example 9: Route with Custom Metadata
 * Use meta object for storing custom route information
 */
// @ts-expect-error - Example import for demonstration
const BlogPostExample = lazy(() => import('../pages/Blog/Post'));

export const metadataRouteExample: IRouteConfig = {
  path: '/blog/:postId',
  element: BlogPostExample,
  title: 'Blog Post',
  description: 'Read blog post',
  meta: {
    layout: 'centered',
    showSidebar: true,
    requiresScroll: true,
    analytics: {
      category: 'blog',
      trackPageView: true,
    },
  },
};

// ============================================================================
// INDEX ROUTES
// ============================================================================

/**
 * Example 10: Index Route
 * Renders when parent route matches exactly
 */
// @ts-expect-error - Example import for demonstration
const ProductsListExample = lazy(() => import('../pages/Products/List'));
// @ts-expect-error - Example import for demonstration
const ProductsLayoutExample = lazy(() => import('../pages/Products/Layout'));

export const indexRouteExample: IRouteConfig = {
  path: '/products',
  element: ProductsLayoutExample,
  title: 'Products',
  children: [
    {
      index: true, // Renders at /products
      path: '',
      element: ProductsListExample,
      title: 'All Products',
    },
    {
      path: ':productId', // Renders at /products/:productId
      element: ProductDetailExample,
      title: 'Product Details',
    },
  ],
};

// ============================================================================
// OPTIONAL PARAMETERS
// ============================================================================

/**
 * Example 11: Optional Parameters
 * Use ? for optional route segments
 */
// @ts-expect-error - Example import for demonstration
const SearchExample = lazy(() => import('../pages/Search'));

export const optionalParamExample: IRouteConfig = {
  path: '/search/:query?',
  element: SearchExample,
  title: 'Search',
  description: 'Search the site',
};

// ============================================================================
// ROUTE GROUPS
// ============================================================================

/**
 * Example 12: Organizing Routes into Groups
 * Use route groups for better organization
 */
// @ts-expect-error - Example import for demonstration
const AccountOverviewExample = lazy(() => import('../pages/Account/Overview'));
// @ts-expect-error - Example import for demonstration
const AccountBillingExample = lazy(() => import('../pages/Account/Billing'));
// @ts-expect-error - Example import for demonstration
const AccountSubscriptionExample = lazy(() => import('../pages/Account/Subscription'));

export const accountRoutesGroup: IRouteConfig[] = [
  {
    path: '/account',
    element: AccountOverviewExample,
    title: 'Account Overview',
    protected: true,
  },
  {
    path: '/account/billing',
    element: AccountBillingExample,
    title: 'Billing',
    protected: true,
  },
  {
    path: '/account/subscription',
    element: AccountSubscriptionExample,
    title: 'Subscription',
    protected: true,
  },
];

// ============================================================================
// LAYOUT ROUTES
// ============================================================================

/**
 * Example 13: Shared Layout for Multiple Routes
 * All children share the same layout component
 */
// @ts-expect-error - Example import for demonstration
const DashboardLayoutExample = lazy(() => import('../pages/Dashboard/Layout'));
// @ts-expect-error - Example import for demonstration
const AnalyticsExample = lazy(() => import('../pages/Dashboard/Analytics'));
// @ts-expect-error - Example import for demonstration
const ReportsExample = lazy(() => import('../pages/Dashboard/Reports'));
// @ts-expect-error - Example import for demonstration
const MetricsExample = lazy(() => import('../pages/Dashboard/Metrics'));

export const layoutRoutesExample: IRouteConfig = {
  path: '/dashboard',
  element: DashboardLayoutExample,
  title: 'Dashboard',
  protected: true,
  children: [
    {
      index: true,
      path: '',
      element: AnalyticsExample,
      title: 'Analytics',
    },
    {
      path: 'reports',
      element: ReportsExample,
      title: 'Reports',
    },
    {
      path: 'metrics',
      element: MetricsExample,
      title: 'Metrics',
    },
  ],
};

// ============================================================================
// REDIRECTS
// ============================================================================

/**
 * Example 14: Redirect Route
 * For redirects, create a component that uses Navigate from react-router-dom
 *
 * Note: In actual implementation, import Navigate at the top:
 * import { Navigate } from 'react-router-dom';
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const RedirectToDashboard = () => {
  // Example placeholder - not meant to be functional
  return null;
};

export const redirectRouteExample: IRouteConfig = {
  path: '/old-dashboard',
  element: RedirectToDashboard,
  title: 'Redirecting...',
};

// ============================================================================
// USAGE IN config.tsx
// ============================================================================

/**
 * How to use these examples in config.tsx:
 *
 * 1. Copy the lazy import and route configuration
 * 2. Add to the appropriate routes array (appRoutes, protectedRoutes, publicRoutes)
 * 3. Update paths and component names as needed
 *
 * Example:
 *
 * export const appRoutes: IRouteConfig[] = [
 *   {
 *     path: '/',
 *     element: Home,
 *     title: 'Home',
 *   },
 *   // Add your new route here
 *   {
 *     path: '/my-page',
 *     element: MyPage,
 *     title: 'My Page',
 *   },
 * ];
 */
