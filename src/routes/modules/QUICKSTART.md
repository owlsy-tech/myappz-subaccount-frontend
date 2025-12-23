# Module Routes Quick Start Guide

⚡ **TL;DR:** Each feature module gets its own route file in `src/routes/modules/`.

## Adding Routes to Existing Module (1 minute)

### Example: Adding a route to Inbox

Open `src/routes/modules/inbox.tsx`:

```typescript
// 1. Add lazy import for your new page
const InboxArchive = lazy(() =>
  import('../../pages/Inbox').then((module) => ({
    default: module.InboxArchive || module.default,
  }))
);

// 2. Add route to the array
export const inboxRoutes: IRouteConfig[] = [
  // ... existing routes
  // ⭐ Add your new route here
  {
    path: '/inbox/archive',
    element: InboxArchive,
    title: 'Archived Messages',
    description: 'View archived messages',
    protected: true,
  },
];
```

Done! Navigate to `/inbox/archive` 🎉

## Creating a New Module (3 minutes)

### Step 1: Create Module Route File

Create `src/routes/modules/projects.tsx`:

```typescript
/**
 * Projects Module Routes Configuration
 */

import { lazy } from 'react';
import { IRouteConfig } from '../types';

// Lazy load pages
const ProjectList = lazy(() =>
  import('../../pages/Projects').then((module) => ({
    default: module.ProjectList || module.default,
  }))
);

const ProjectDetail = lazy(() =>
  import('../../pages/Projects').then((module) => ({
    default: module.ProjectDetail || module.default,
  }))
);

/**
 * Projects module routes
 */
export const projectRoutes: IRouteConfig[] = [
  {
    path: '/projects',
    element: ProjectList,
    title: 'Projects',
    description: 'View all projects',
    protected: true,
  },
  {
    path: '/projects/:projectId',
    element: ProjectDetail,
    title: 'Project Details',
    description: 'View project details',
    protected: true,
  },
];

export default projectRoutes;
```

### Step 2: Export from Index

Open `src/routes/modules/index.ts` and add:

```typescript
export { projectRoutes } from './projects';
export { default as projectRoutesDefault } from './projects';
```

### Step 3: Import in Main Config

Open `src/routes/config.tsx` and update:

```typescript
// Add to imports
import { inboxRoutes, leadManagementRoutes, projectRoutes } from './modules';

// Add to protectedRoutes array
export const protectedRoutes: IRouteConfig[] = [
  ...inboxRoutes,
  ...leadManagementRoutes,
  ...projectRoutes, // ← Add here
];
```

### Step 4: Done! 🎉

Your module routes are live!

## Current Modules

| Module          | File                  | Base Path          |
| --------------- | --------------------- | ------------------ |
| Inbox           | `inbox.tsx`           | `/inbox`           |
| Lead Management | `lead-management.tsx` | `/lead-management` |

## Common Route Patterns

### Basic List + Detail

```typescript
export const moduleRoutes: IRouteConfig[] = [
  {
    path: '/items',
    element: ItemList,
    title: 'Items',
    protected: true,
  },
  {
    path: '/items/:id',
    element: ItemDetail,
    title: 'Item Details',
    protected: true,
  },
];
```

### Full CRUD

```typescript
export const moduleRoutes: IRouteConfig[] = [
  {
    path: '/items',
    element: ItemList,
    title: 'Items',
    protected: true,
  },
  {
    path: '/items/create',
    element: ItemCreate,
    title: 'Create Item',
    protected: true,
  },
  {
    path: '/items/:id',
    element: ItemDetail,
    title: 'Item Details',
    protected: true,
  },
  {
    path: '/items/:id/edit',
    element: ItemEdit,
    title: 'Edit Item',
    protected: true,
  },
];
```

### With Import/Export

```typescript
export const moduleRoutes: IRouteConfig[] = [
  {
    path: '/items',
    element: ItemList,
    title: 'Items',
    protected: true,
  },
  {
    path: '/items/import',
    element: ItemImport,
    title: 'Import Items',
    protected: true,
  },
  {
    path: '/items/export',
    element: ItemExport,
    title: 'Export Items',
    protected: true,
  },
];
```

## URL Naming Convention

Follow this pattern for consistency:

```
/module-name                    ← List view
/module-name/create            ← Create new
/module-name/import            ← Import data
/module-name/export            ← Export data
/module-name/:id               ← View single item
/module-name/:id/edit          ← Edit single item
/module-name/settings          ← Module settings
```

### ✅ Good Examples

- `/leads`
- `/leads/create`
- `/leads/:leadId`
- `/leads/:leadId/edit`
- `/inbox/compose`
- `/projects/:projectId/tasks`

### ❌ Bad Examples

- `/leadsList` (use `/leads`)
- `/lead/new` (use `/leads/create`)
- `/lead-details/:id` (use `/leads/:id`)

## Page Structure

Your pages should be organized like this:

```
pages/
└── ModuleName/
    ├── index.ts              # Export all pages
    ├── ModuleList.tsx        # List view
    ├── ModuleDetail.tsx      # Detail view
    ├── ModuleCreate.tsx      # Create form
    └── ModuleEdit.tsx        # Edit form
```

### Example index.ts

```typescript
/**
 * Module Name Page Exports
 */

export { default as ModuleList } from './ModuleList';
export { default as ModuleDetail } from './ModuleDetail';
export { default as ModuleCreate } from './ModuleCreate';
export { default as ModuleEdit } from './ModuleEdit';
```

## Route Options Reference

```typescript
{
  path: '/my-route',          // Required - URL path
  element: MyComponent,       // Required - Lazy-loaded component
  title: 'My Page',           // Optional - Page title (SEO)
  description: 'About...',    // Optional - Page description (SEO)
  protected: true,            // Optional - Requires auth (default: false)
  meta: {                     // Optional - Custom metadata
    roles: ['admin'],
    permissions: ['read'],
  },
  children: [...],            // Optional - Nested routes
  index: true,                // Optional - Index route
}
```

## Checklist: New Module

- [ ] Created `src/routes/modules/your-module.tsx`
- [ ] Added lazy-loaded page imports
- [ ] Defined route configurations
- [ ] Exported routes with `export const yourModuleRoutes`
- [ ] Added `export default yourModuleRoutes`
- [ ] Exported from `modules/index.ts`
- [ ] Imported in `routes/config.tsx`
- [ ] Added to `protectedRoutes` array
- [ ] Tested routes in browser

## Checklist: New Route in Existing Module

- [ ] Added lazy import for page component
- [ ] Added route config to module array
- [ ] Set `protected: true` if auth required
- [ ] Provided `title` and `description`
- [ ] Tested route in browser

## ❌ Common Mistakes

### 1. Not Lazy Loading

```typescript
// ❌ BAD - Direct import
import { MyPage } from '../../pages/MyPage';

// ✅ GOOD - Lazy loading
const MyPage = lazy(() =>
  import('../../pages/MyPage').then((module) => ({
    default: module.MyPage || module.default,
  }))
);
```

### 2. Forgetting to Export

```typescript
// ❌ BAD - Not exported
const myRoutes = [...];

// ✅ GOOD - Exported
export const myRoutes: IRouteConfig[] = [...];
```

### 3. Not Adding to Config

```typescript
// ❌ BAD - Created module but didn't import
// File exists but not imported in config.tsx

// ✅ GOOD - Imported and spread into protectedRoutes
import { myModuleRoutes } from './modules';

export const protectedRoutes = [...myModuleRoutes];
```

### 4. Wrong Path Format

```typescript
// ❌ BAD
path: 'leads'; // Missing leading slash
path: '/leads/'; // Trailing slash
path: '/lead/:id'; // Inconsistent naming

// ✅ GOOD
path: '/leads';
path: '/leads/:leadId';
```

## Navigation Examples

### Link to Module Routes

```typescript
import { Link } from 'react-router-dom';

// Simple link
<Link to="/inbox">Go to Inbox</Link>

// With state
<Link to="/inbox/compose" state={{ from: 'dashboard' }}>
  Compose Message
</Link>
```

### Programmatic Navigation

```typescript
import { useNavigate } from 'react-router-dom';

const MyComponent = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/leads/create');
  };

  const handleBack = () => {
    navigate(-1); // Go back
  };
};
```

### Dynamic Routes

```typescript
// Route definition
{
  path: '/leads/:leadId',
  element: LeadDetail,
}

// In component
import { useParams } from 'react-router-dom';

const LeadDetail = () => {
  const { leadId } = useParams();
  return <div>Lead ID: {leadId}</div>;
};

// Navigate to it
<Link to={`/leads/${lead.id}`}>View Lead</Link>
```

## Need More Help?

- **Full Docs**: See `modules/README.md` for detailed documentation
- **Main Routes**: See `../README.md` for overall routing guide
- **Examples**: See `../examples.tsx` for more patterns
- **Types**: See `../types.ts` for TypeScript definitions

---

**Remember**: One module = One file in `routes/modules/` 🎯
