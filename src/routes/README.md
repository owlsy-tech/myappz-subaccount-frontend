# Routes Configuration

This directory contains the centralized routing configuration for the application. All routes should be managed here instead of in `App.tsx`.

## Structure

```
routes/
├── README.md       # This file - documentation
├── QUICKSTART.md   # Quick start guide
├── index.ts        # Public exports
├── types.ts        # TypeScript type definitions
├── config.tsx      # Route configurations
├── AppRoutes.tsx   # Route renderer component
├── examples.tsx    # Route examples
└── modules/        # Module-specific routes
    ├── README.md               # Module routes documentation
    ├── QUICKSTART.md           # Module routes quick start
    ├── index.ts                # Module exports
    ├── inbox.tsx               # Inbox module routes
    └── lead-management.tsx     # Lead Management module routes
```

## Usage

### Adding a New Route

#### Simple Route (for general pages)

To add a simple route to the application:

1. **Import the lazy-loaded component** in `config.tsx`:

   ```typescript
   const MyNewPage = lazy(() => import('../pages/MyNewPage'));
   ```

2. **Add the route configuration** to the appropriate array:
   ```typescript
   export const appRoutes: RouteConfig[] = [
     {
       path: '/',
       element: Home,
       title: 'Home',
       description: 'Subaccount Management Home',
     },
     {
       path: '/my-new-page',
       element: MyNewPage,
       title: 'My New Page',
       description: 'Description of my new page',
     },
     // ... other routes
   ];
   ```

That's it! The route will automatically be rendered by the application.

#### Module Route (for feature modules)

For feature-specific routes (like Inbox, Lead Management, etc.), use module routes:

1. **Create or open a module file** in `modules/`:

   ```typescript
   // routes/modules/my-module.tsx
   const MyModuleList = lazy(() =>
     import('../../pages/MyModule').then((module) => ({
       default: module.MyModuleList || module.default,
     }))
   );
   ```

2. **Add the route to the module's route array**:

   ```typescript
   export const myModuleRoutes: IRouteConfig[] = [
     {
       path: '/my-module',
       element: MyModuleList,
       title: 'My Module',
       description: 'My module description',
       protected: true,
     },
   ];
   ```

3. **Export from `modules/index.ts`** and import in `config.tsx`

See `modules/README.md` for detailed module route documentation.

### Route Configuration Options

Each route can have the following properties:

| Property      | Type            | Required | Description                                                   |
| ------------- | --------------- | -------- | ------------------------------------------------------------- |
| `path`        | `string`        | ✅       | Route path (supports React Router patterns like `/users/:id`) |
| `element`     | `Component`     | ✅       | Component to render (lazy-loaded or regular)                  |
| `title`       | `string`        | ❌       | Page title for SEO and accessibility                          |
| `description` | `string`        | ❌       | Page description                                              |
| `protected`   | `boolean`       | ❌       | Whether route requires authentication (default: `false`)      |
| `children`    | `RouteConfig[]` | ❌       | Nested child routes                                           |
| `index`       | `boolean`       | ❌       | Whether this is an index route                                |
| `meta`        | `object`        | ❌       | Custom metadata for the route                                 |

### Route Organization

Routes are organized into three main categories and module-specific routes:

#### 1. **App Routes** (`appRoutes`)

Main application routes that are always available:

```typescript
export const appRoutes: RouteConfig[] = [
  // Home, NotFound, and other core routes
];
```

#### 2. **Protected Routes** (`protectedRoutes`)

Routes that require authentication:

```typescript
export const protectedRoutes: RouteConfig[] = [
  {
    path: '/dashboard',
    element: Dashboard,
    title: 'Dashboard',
    protected: true,
  },
];
```

#### 3. **Public Routes** (`publicRoutes`)

Routes that are explicitly public (like login, register):

```typescript
export const publicRoutes: RouteConfig[] = [
  {
    path: '/login',
    element: Login,
    title: 'Login',
  },
];
```

#### 4. **Module Routes** (`modules/`)

Feature-specific routes organized by module:

```typescript
// routes/modules/inbox.tsx
export const inboxRoutes: IRouteConfig[] = [
  {
    path: '/inbox',
    element: InboxList,
    title: 'Inbox',
    protected: true,
  },
  {
    path: '/inbox/:messageId',
    element: InboxDetail,
    title: 'Message Details',
    protected: true,
  },
];
```

Module routes are automatically included in the main routes via:

```typescript
// routes/config.tsx
import { inboxRoutes, leadManagementRoutes } from './modules';

export const protectedRoutes: IRouteConfig[] = [...inboxRoutes, ...leadManagementRoutes];
```

**Available Modules**:

- **Inbox** (`modules/inbox.tsx`) - Messaging and communication routes
- **Lead Management** (`modules/lead-management.tsx`) - Lead management routes

See `modules/README.md` for adding new modules.

### Nested Routes

To create nested routes:

```typescript
{
  path: '/settings',
  element: Settings,
  title: 'Settings',
  children: [
    {
      path: 'profile',
      element: Profile,
      title: 'Profile Settings',
    },
    {
      path: 'security',
      element: Security,
      title: 'Security Settings',
    },
  ],
}
```

### Dynamic Routes

Use React Router path patterns for dynamic routes:

```typescript
{
  path: '/users/:userId',
  element: UserProfile,
  title: 'User Profile',
}
```

## Examples

### Basic Route

```typescript
{
  path: '/about',
  element: About,
  title: 'About Us',
  description: 'Learn more about our company',
}
```

### Protected Route with Metadata

```typescript
{
  path: '/admin',
  element: AdminPanel,
  title: 'Admin Panel',
  protected: true,
  meta: {
    roles: ['admin', 'superadmin'],
    permissions: ['manage_users'],
  },
}
```

### Route with Nested Children

```typescript
{
  path: '/products',
  element: ProductsLayout,
  title: 'Products',
  children: [
    {
      index: true,
      element: ProductsList,
      title: 'All Products',
    },
    {
      path: ':productId',
      element: ProductDetail,
      title: 'Product Details',
    },
  ],
}
```

## Best Practices

1. **Always use lazy loading** for route components to enable code splitting:

   ```typescript
   const MyPage = lazy(() => import('../pages/MyPage'));
   ```

2. **Provide meaningful titles and descriptions** for better SEO and accessibility

3. **Organize routes logically**:
   - Use `appRoutes` for general pages (Home, About, etc.)
   - Use `protectedRoutes` for authenticated pages
   - Use `publicRoutes` for auth pages (Login, Register)
   - Use **module routes** for feature-specific routes (Inbox, Lead Management, etc.)

4. **Use module routes for features**: Group related routes in `modules/` directory:

   ```typescript
   // routes/modules/my-feature.tsx
   export const myFeatureRoutes: IRouteConfig[] = [...]
   ```

5. **Use path constants** for frequently referenced routes:

   ```typescript
   export const ROUTES = {
     HOME: '/',
     DASHBOARD: '/dashboard',
     SETTINGS: '/settings',
   };
   ```

6. **Keep route-specific logic out of config** - use route metadata and handle logic in components

7. **Document complex route patterns** with comments in the config file

8. **Follow naming conventions**: Use consistent URL patterns (see `modules/README.md`)

## Integration with App.tsx

The routes are automatically integrated into `App.tsx` through the `AppRoutes` component:

```typescript
import { AppRoutes } from './routes';

// In App.tsx
<Suspense fallback={<LoadingFallback />}>
  <AppRoutes />
</Suspense>
```

This means you **never need to modify `App.tsx`** when adding or changing routes - all route management happens in this directory!

## Migration Guide

If you need to add routes from the old `App.tsx` pattern:

**Old way (in App.tsx):**

```typescript
const MyPage = lazy(() => import('./pages/MyPage'));

<Routes>
  <Route path="/my-page" element={<MyPage />} />
</Routes>
```

**New way (in routes/config.tsx):**

```typescript
const MyPage = lazy(() => import('../pages/MyPage'));

export const appRoutes: RouteConfig[] = [
  // ... existing routes
  {
    path: '/my-page',
    element: MyPage,
    title: 'My Page',
  },
];
```

## TypeScript Support

All routes are fully typed. Import the types as needed:

```typescript
import { IRouteConfig } from './routes/types';
```

## Testing

When writing tests that need route information:

```typescript
import { routes, appRoutes } from '@/routes';
import { inboxRoutes } from '@/routes/modules';

// Use in tests
const homeRoute = appRoutes.find((route) => route.path === '/');
const inboxRoute = inboxRoutes.find((route) => route.path === '/inbox');
```

## Module Routes Documentation

For detailed information about module-specific routes:

- **Module Routes Guide**: `modules/README.md` - Comprehensive module routes documentation
- **Module Quick Start**: `modules/QUICKSTART.md` - Quick guide for adding module routes
- **Available Modules**:
  - Inbox (`modules/inbox.tsx`)
  - Lead Management (`modules/lead-management.tsx`)

## Quick Links

- **Quick Start**: `QUICKSTART.md` - Fast guide for adding routes
- **Examples**: `examples.tsx` - Route configuration examples
- **Types**: `types.ts` - TypeScript type definitions
- **Module Routes**: `modules/` - Feature-specific route configurations
