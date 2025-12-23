# Module Routes Configuration

This directory contains module-specific route configurations for the application. Each module has its own route file to organize routes logically by feature area.

## Structure

```
routes/modules/
├── README.md                  # This file - module routes documentation
├── index.ts                   # Exports all module routes
├── inbox.tsx                  # Inbox/messaging routes
└── lead-management.tsx        # Lead management routes
```

## Purpose

Module routes provide:

1. **Separation of Concerns**: Each feature module has its own route configuration
2. **Scalability**: Easy to add new modules without cluttering the main config
3. **Maintainability**: Route changes are isolated to their respective modules
4. **Team Collaboration**: Different teams can work on different module routes independently

## Available Modules

### 📬 Inbox Module

Routes for messaging and communication features.

**File**: `inbox.tsx`

**Routes**:

- `/inbox` - Inbox list view
- `/inbox/compose` - Compose new message
- `/inbox/:messageId` - View message details

### 👥 Lead Management Module

Routes for lead management features.

**File**: `lead-management.tsx`

**Routes**:

- `/lead-management` - Lead list view
- `/lead-management/create` - Create new lead
- `/lead-management/import` - Import leads from file
- `/lead-management/export` - Export leads to file
- `/lead-management/:leadId` - View lead details
- `/lead-management/:leadId/edit` - Edit lead information

## Adding a New Module

### Step 1: Create Module Route File

Create a new file in `routes/modules/` (e.g., `my-module.tsx`):

```typescript
/**
 * My Module Routes Configuration
 */

import { lazy } from 'react';
import { IRouteConfig } from '../types';

// Lazy load pages
const MyModuleList = lazy(() =>
  import('../../pages/MyModule').then((module) => ({
    default: module.MyModuleList || module.default,
  }))
);

const MyModuleDetail = lazy(() =>
  import('../../pages/MyModule').then((module) => ({
    default: module.MyModuleDetail || module.default,
  }))
);

/**
 * My Module routes
 */
export const myModuleRoutes: IRouteConfig[] = [
  {
    path: '/my-module',
    element: MyModuleList,
    title: 'My Module',
    description: 'My module list view',
    protected: true,
  },
  {
    path: '/my-module/:id',
    element: MyModuleDetail,
    title: 'My Module Details',
    description: 'View module item details',
    protected: true,
  },
];

export default myModuleRoutes;
```

### Step 2: Export from Index

Add to `routes/modules/index.ts`:

```typescript
export { myModuleRoutes } from './my-module';
export { default as myModuleRoutesDefault } from './my-module';
```

### Step 3: Import in Main Config

Add to `routes/config.tsx`:

```typescript
import { inboxRoutes, leadManagementRoutes, myModuleRoutes } from './modules';

export const protectedRoutes: IRouteConfig[] = [
  ...inboxRoutes,
  ...leadManagementRoutes,
  ...myModuleRoutes, // ← Add here
];
```

### Step 4: Done! 🎉

Your module routes are now active!

## Route Naming Conventions

Follow these conventions for consistency:

### URL Path Structure

```
/module-name                    # List/Index view
/module-name/create            # Create new item
/module-name/import            # Import items
/module-name/export            # Export items
/module-name/:id               # View single item
/module-name/:id/edit          # Edit single item
/module-name/:id/delete        # Delete confirmation
/module-name/settings          # Module-specific settings
```

### Examples

✅ **Good**:

- `/leads`
- `/leads/create`
- `/leads/:leadId`
- `/leads/:leadId/edit`

❌ **Avoid**:

- `/leadsList` (use `/leads`)
- `/lead/new` (use `/leads/create`)
- `/lead-details/:id` (use `/leads/:id`)

## Module Route Template

Use this template when creating new module routes:

```typescript
/**
 * [Module Name] Module Routes Configuration
 * Centralized routing configuration for the [Module Name] module
 */

import { lazy } from 'react';
import { IRouteConfig } from '../types';

// Lazy load pages
const ModuleList = lazy(() =>
  import('../../pages/ModuleName').then((module) => ({
    default: module.ModuleList || module.default,
  }))
);

const ModuleDetail = lazy(() =>
  import('../../pages/ModuleName').then((module) => ({
    default: module.ModuleDetail || module.default,
  }))
);

const ModuleCreate = lazy(() =>
  import('../../pages/ModuleName').then((module) => ({
    default: module.ModuleCreate || module.default,
  }))
);

const ModuleEdit = lazy(() =>
  import('../../pages/ModuleName').then((module) => ({
    default: module.ModuleEdit || module.default,
  }))
);

/**
 * [Module Name] module routes
 * All routes related to [module description]
 */
export const moduleNameRoutes: IRouteConfig[] = [
  {
    path: '/module-name',
    element: ModuleList,
    title: 'Module Name',
    description: 'View and manage module items',
    protected: true,
  },
  {
    path: '/module-name/create',
    element: ModuleCreate,
    title: 'Create Item',
    description: 'Create a new item',
    protected: true,
  },
  {
    path: '/module-name/:id',
    element: ModuleDetail,
    title: 'Item Details',
    description: 'View item details',
    protected: true,
  },
  {
    path: '/module-name/:id/edit',
    element: ModuleEdit,
    title: 'Edit Item',
    description: 'Edit item information',
    protected: true,
  },
];

export default moduleNameRoutes;
```

## Page Component Structure

Module pages should follow this structure:

```
pages/
└── ModuleName/
    ├── index.ts                    # Exports all components
    ├── ModuleList.tsx              # List view
    ├── ModuleDetail.tsx            # Detail view
    ├── ModuleCreate.tsx            # Create form
    ├── ModuleEdit.tsx              # Edit form
    ├── components/                 # Module-specific components
    │   ├── ModuleCard.tsx
    │   └── ModuleForm.tsx
    └── __tests__/                  # Module tests
        ├── ModuleList.test.tsx
        └── ModuleDetail.test.tsx
```

### Example Export (pages/ModuleName/index.ts)

```typescript
/**
 * Module Name Page Exports
 */

export { default as ModuleList } from './ModuleList';
export { default as ModuleDetail } from './ModuleDetail';
export { default as ModuleCreate } from './ModuleCreate';
export { default as ModuleEdit } from './ModuleEdit';
```

## Common Route Patterns

### Basic CRUD Routes

```typescript
export const crudRoutes: IRouteConfig[] = [
  {
    path: '/items',
    element: ItemList,
    title: 'Items',
  },
  {
    path: '/items/create',
    element: ItemCreate,
    title: 'Create Item',
  },
  {
    path: '/items/:id',
    element: ItemDetail,
    title: 'Item Details',
  },
  {
    path: '/items/:id/edit',
    element: ItemEdit,
    title: 'Edit Item',
  },
];
```

### Nested Module Routes

```typescript
export const nestedRoutes: IRouteConfig[] = [
  {
    path: '/projects',
    element: ProjectLayout,
    title: 'Projects',
    children: [
      {
        index: true,
        element: ProjectList,
        title: 'All Projects',
      },
      {
        path: ':projectId',
        element: ProjectDetail,
        title: 'Project Details',
      },
      {
        path: ':projectId/tasks',
        element: TaskList,
        title: 'Project Tasks',
      },
    ],
  },
];
```

### Routes with Query Parameters

```typescript
// Route definition
{
  path: '/search',
  element: SearchResults,
  title: 'Search',
}

// Usage in component
import { useSearchParams } from 'react-router-dom';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const filter = searchParams.get('filter');

  // Use /search?q=test&filter=active
};
```

## Protected Routes

All module routes should typically be protected (require authentication):

```typescript
export const moduleRoutes: IRouteConfig[] = [
  {
    path: '/module',
    element: Module,
    title: 'Module',
    protected: true, // ← Always set this for protected content
  },
];
```

## Route Metadata

Add custom metadata for advanced features:

```typescript
{
  path: '/admin',
  element: AdminPanel,
  title: 'Admin Panel',
  protected: true,
  meta: {
    roles: ['admin', 'superadmin'],
    permissions: ['manage_users'],
    analytics: {
      category: 'admin',
      track: true,
    },
    breadcrumb: 'Administration',
  },
}
```

## Testing Module Routes

### Example Test

```typescript
import { renderWithRouter } from '@/test-utils';
import { moduleRoutes } from '../my-module';

describe('My Module Routes', () => {
  it('should export all module routes', () => {
    expect(moduleRoutes).toBeDefined();
    expect(moduleRoutes.length).toBeGreaterThan(0);
  });

  it('should have correct paths', () => {
    const paths = moduleRoutes.map((route) => route.path);
    expect(paths).toContain('/my-module');
    expect(paths).toContain('/my-module/create');
  });

  it('should mark routes as protected', () => {
    moduleRoutes.forEach((route) => {
      expect(route.protected).toBe(true);
    });
  });
});
```

## Best Practices

1. **Keep modules focused**: Each module should represent a single feature area
2. **Use consistent naming**: Follow the naming conventions outlined above
3. **Always lazy load**: Use `lazy()` for all page components
4. **Mark as protected**: Set `protected: true` for authenticated routes
5. **Provide metadata**: Include `title` and `description` for SEO
6. **Document changes**: Update this README when adding new modules
7. **Test routes**: Write tests for route configurations
8. **Use TypeScript**: Leverage `IRouteConfig` type for type safety

## Migration Checklist

When adding routes from old code:

- [ ] Created new module file in `routes/modules/`
- [ ] Added lazy-loaded page imports
- [ ] Defined route configurations with proper metadata
- [ ] Exported routes from module file
- [ ] Added export to `modules/index.ts`
- [ ] Imported in main `routes/config.tsx`
- [ ] Added routes to appropriate category (protected/public/app)
- [ ] Updated module README if needed
- [ ] Tested all routes in browser
- [ ] Wrote route configuration tests

## Troubleshooting

### Route Not Found

1. Check the route is exported from module file
2. Verify it's imported in `routes/config.tsx`
3. Ensure it's added to the correct routes array
4. Check the path doesn't conflict with existing routes

### Component Not Loading

1. Verify the page component exists
2. Check the import path in the module file
3. Ensure the component is exported from the page's `index.ts`
4. Look for console errors related to lazy loading

### Protected Route Not Working

1. Verify `protected: true` is set in route config
2. Check authentication logic in `AppRoutes.tsx`
3. Ensure user is authenticated when accessing the route

## Related Documentation

- **Main Routes**: `../README.md` - Overall routing documentation
- **Quick Start**: `../QUICKSTART.md` - Quick guide to adding routes
- **Examples**: `../examples.tsx` - Route configuration examples
- **Types**: `../types.ts` - TypeScript route type definitions

## Questions?

- Check the main routing documentation: `src/routes/README.md`
- Review examples: `src/routes/examples.tsx`
- Ask your team lead or architect

---

**Remember**: Module routes provide organization and scalability. Keep them focused, well-documented, and consistent! 🎯
