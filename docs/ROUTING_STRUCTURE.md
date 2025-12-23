# Routing Structure Diagram

## Application Routing Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         App.tsx                                  │
│                    (Root Component)                              │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      AppRoutes.tsx                               │
│                   (Route Renderer)                               │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      routes/config.tsx                           │
│                  (Main Route Configuration)                      │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                ┌───────────┴───────────┬────────────────┐
                ▼                       ▼                ▼
        ┌──────────────┐      ┌──────────────┐  ┌──────────────┐
        │  appRoutes   │      │protectedRoutes│  │publicRoutes  │
        │              │      │               │  │              │
        │ / (Home)     │      │ (from modules)│  │ /login       │
        │ * (NotFound) │      │               │  │ /register    │
        └──────────────┘      └───────┬───────┘  └──────────────┘
                                      │
                        ┌─────────────┴─────────────┐
                        ▼                           ▼
              ┌──────────────────┐      ┌──────────────────────┐
              │  Inbox Module    │      │ Lead Management      │
              │  (inbox.tsx)     │      │ (lead-management.tsx)│
              └──────────────────┘      └──────────────────────┘
```

## Module Routes Structure

### Inbox Module

```
/inbox
├── GET /inbox                    → InboxList (pages/Inbox/InboxList.tsx)
├── GET /inbox/compose           → InboxCompose (pages/Inbox/InboxCompose.tsx)
└── GET /inbox/:messageId        → InboxDetail (pages/Inbox/InboxDetail.tsx)
```

### Lead Management Module

```
/lead-management
├── GET /lead-management                     → LeadList (pages/LeadManagement/LeadList.tsx)
├── GET /lead-management/create             → LeadCreate (pages/LeadManagement/LeadCreate.tsx)
├── GET /lead-management/import             → LeadImport (pages/LeadManagement/LeadImport.tsx)
├── GET /lead-management/export             → LeadExport (pages/LeadManagement/LeadExport.tsx)
├── GET /lead-management/:leadId            → LeadDetail (pages/LeadManagement/LeadDetail.tsx)
└── GET /lead-management/:leadId/edit       → LeadEdit (pages/LeadManagement/LeadEdit.tsx)
```

## File System Structure

```
src/
├── routes/
│   ├── modules/                          📂 Module Routes Directory
│   │   ├── README.md                     📖 Module routes documentation
│   │   ├── QUICKSTART.md                 ⚡ Quick start guide
│   │   ├── index.ts                      📤 Module exports
│   │   ├── inbox.tsx                     📬 Inbox routes
│   │   └── lead-management.tsx           👥 Lead Management routes
│   │
│   ├── README.md                         📖 Main routes documentation
│   ├── QUICKSTART.md                     ⚡ Main quick start
│   ├── config.tsx                        ⚙️  Route configurations
│   ├── AppRoutes.tsx                     🔀 Route renderer
│   ├── types.ts                          📝 TypeScript types
│   ├── examples.tsx                      💡 Route examples
│   └── index.ts                          📤 Public exports
│
└── pages/
    ├── Inbox/                            📬 Inbox Pages
    │   ├── index.ts                      📤 Export all pages
    │   ├── InboxList.tsx                 📋 List view
    │   ├── InboxDetail.tsx               📄 Detail view
    │   └── InboxCompose.tsx              ✍️  Compose form
    │
    └── LeadManagement/                   👥 Lead Management Pages
        ├── index.ts                      📤 Export all pages
        ├── LeadList.tsx                  📋 List view
        ├── LeadDetail.tsx                📄 Detail view
        ├── LeadCreate.tsx                ➕ Create form
        ├── LeadEdit.tsx                  ✏️  Edit form
        ├── LeadImport.tsx                📥 Import interface
        └── LeadExport.tsx                📤 Export interface
```

## Route Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Navigation                           │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                     React Router                                 │
│                  (Match URL Pattern)                             │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Route Configuration                            │
│              (Find matching IRouteConfig)                        │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                ▼                       ▼
        ┌──────────────┐        ┌──────────────┐
        │  Protected?  │        │   Public?    │
        │     Yes      │        │     Yes      │
        └──────┬───────┘        └──────┬───────┘
               │                       │
               ▼                       ▼
    ┌──────────────────┐    ┌──────────────────┐
    │ Check Auth       │    │ Render Component │
    └────────┬─────────┘    └──────────────────┘
             │
    ┌────────┴────────┐
    ▼                 ▼
┌────────┐      ┌────────────┐
│Authed? │      │Not Authed? │
│  Yes   │      │  Redirect  │
└───┬────┘      └────────────┘
    │
    ▼
┌─────────────────────┐
│  Lazy Load Component│
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Render Page        │
└─────────────────────┘
```

## Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                          config.tsx                              │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐                │
│  │ appRoutes  │  │ protected  │  │  public    │                │
│  │            │  │  Routes    │  │  Routes    │                │
│  └──────┬─────┘  └─────┬──────┘  └─────┬──────┘                │
│         │              │               │                        │
│         │         ┌────┴────┐          │                        │
│         │         │ modules │          │                        │
│         │         │ routes  │          │                        │
│         │         └────┬────┘          │                        │
│         │    ┌─────────┴──────────┐    │                        │
│         │    ▼                    ▼    │                        │
│         │ ┌────────┐        ┌─────────┐│                        │
│         │ │ inbox  │        │  lead   ││                        │
│         │ │ Routes │        │  Mgmt   ││                        │
│         │ └────────┘        └─────────┘│                        │
│         │                               │                        │
│         └───────────────┬───────────────┘                        │
│                         ▼                                        │
│                  ┌──────────────┐                                │
│                  │    routes    │                                │
│                  │   (combined) │                                │
│                  └──────┬───────┘                                │
└─────────────────────────┼────────────────────────────────────────┘
                          │
                          ▼
                  ┌──────────────┐
                  │  AppRoutes   │
                  │  Component   │
                  └──────┬───────┘
                         │
                         ▼
                  ┌──────────────┐
                  │React Router  │
                  │  Routes      │
                  └──────────────┘
```

## Route Type Hierarchy

```
IRouteConfig
├── path: string                     (Required) URL path pattern
├── element: Component               (Required) Lazy-loaded component
├── title?: string                   (Optional) Page title
├── description?: string             (Optional) Page description
├── protected?: boolean              (Optional) Requires authentication
├── children?: IRouteConfig[]        (Optional) Nested routes
├── index?: boolean                  (Optional) Index route flag
└── meta?: Record<string, any>       (Optional) Custom metadata
```

## Module Export Pattern

```
routes/modules/inbox.tsx
    │
    ├─► export const inboxRoutes: IRouteConfig[]
    │       └─► Array of route configurations
    │
    └─► export default inboxRoutes
            └─► Default export for convenience

routes/modules/index.ts
    │
    ├─► export { inboxRoutes } from './inbox'
    ├─► export { leadManagementRoutes } from './lead-management'
    │
    └─► Re-exports for easy importing

routes/config.tsx
    │
    └─► import { inboxRoutes, leadManagementRoutes } from './modules'
            │
            └─► Spread into protectedRoutes array
```

## Page Component Pattern

```
pages/ModuleName/
    │
    ├── index.ts                    (Barrel export)
    │   └─► export { default as ModuleList } from './ModuleList'
    │   └─► export { default as ModuleDetail } from './ModuleDetail'
    │
    ├── ModuleList.tsx              (List/Index view)
    │   ├─► usePerformanceMonitor()
    │   ├─► useMemoryLeakDetector()
    │   └─► Render list UI
    │
    ├── ModuleDetail.tsx            (Detail view)
    │   ├─► usePerformanceMonitor()
    │   ├─► useMemoryLeakDetector()
    │   └─► Render detail UI
    │
    ├── ModuleCreate.tsx            (Create form)
    └── ModuleEdit.tsx              (Edit form)
```

## Lazy Loading Flow

```
Route Matched
     │
     ▼
┌─────────────────┐
│ lazy(() =>      │
│   import(...)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Dynamic Import  │
│ (Code Splitting)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Component Chunk │
│    Downloaded   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Suspense        │
│ Fallback Shown  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Component       │
│   Rendered      │
└─────────────────┘
```

## URL Naming Convention

```
Standard CRUD Pattern:
/resource                       → List all resources
/resource/create               → Create new resource
/resource/:id                  → View single resource
/resource/:id/edit             → Edit resource
/resource/:id/delete           → Delete confirmation

Extended Patterns:
/resource/import               → Import resources
/resource/export               → Export resources
/resource/settings             → Resource-specific settings
/resource/:id/action           → Resource-specific action

Examples:
✅ /leads
✅ /leads/create
✅ /leads/123
✅ /leads/123/edit
✅ /inbox
✅ /inbox/compose
✅ /inbox/456

❌ /leadsList
❌ /lead/new
❌ /edit-lead/123
```

## Authentication Flow

```
Route Request
     │
     ▼
┌─────────────────┐
│ Route Config    │
│ protected: true?│
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
  Yes        No
    │         │
    ▼         └─────────────┐
┌─────────────────┐         │
│ Check Auth      │         │
│ Status          │         │
└────────┬────────┘         │
         │                  │
    ┌────┴────┐            │
    ▼         ▼            │
Authed    Not Authed       │
    │         │            │
    │         ▼            │
    │   ┌──────────┐       │
    │   │Redirect  │       │
    │   │to /login │       │
    │   └──────────┘       │
    │                      │
    └──────────┬───────────┘
               │
               ▼
        ┌─────────────┐
        │Render Page  │
        └─────────────┘
```

## Best Practices Summary

### ✅ DO

- Use module routes for feature-specific routes
- Lazy load all page components
- Mark protected routes with `protected: true`
- Follow RESTful URL conventions
- Provide title and description for SEO
- Use TypeScript types (`IRouteConfig`)
- Document complex route patterns
- Test all routes thoroughly

### ❌ DON'T

- Add routes directly in App.tsx
- Forget to export from module index
- Use inconsistent URL naming
- Hardcode values in route configs
- Skip lazy loading
- Forget authentication checks
- Mix concerns in route files

## Quick Reference

### Add Route to Existing Module

1. Open `routes/modules/your-module.tsx`
2. Add lazy import
3. Add route config
4. Done ✅

### Create New Module

1. Create `routes/modules/your-module.tsx`
2. Define routes
3. Export from `modules/index.ts`
4. Import in `config.tsx`
5. Done ✅

### Create Page Component

1. Create `pages/ModuleName/YourPage.tsx`
2. Add performance hooks
3. Export from `pages/ModuleName/index.ts`
4. Done ✅

---

**Legend:**

- 📂 Directory
- 📖 Documentation
- ⚡ Quick Guide
- 📤 Exports
- ⚙️ Configuration
- 🔀 Router
- 📝 Types
- 💡 Examples
- 📬 Inbox Module
- 👥 Lead Management Module
- 📋 List View
- 📄 Detail View
- ✍️ Form/Compose
- ➕ Create
- ✏️ Edit
- 📥 Import
- 📤 Export
