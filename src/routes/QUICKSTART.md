# Routes Quick Start Guide

⚡ **TL;DR:** Never edit `App.tsx` for routes. Always use `src/routes/config.tsx` or module routes in `src/routes/modules/`.

## Adding a New Route

### Option 1: Simple Route (30 seconds)

For general pages like About, Contact, etc.

### Step 1: Create Your Page Component

```typescript
// src/pages/About/index.tsx
const About = () => {
  return (
    <div>
      <h1>About Us</h1>
      <p>Welcome to our about page!</p>
    </div>
  );
};

export default About;
```

### Step 2: Add to Routes Config

Open `src/routes/config.tsx`:

```typescript
// 1. Import your page (lazy-loaded)
const About = lazy(() => import('../pages/About'));

// 2. Add to appRoutes array
export const appRoutes: RouteConfig[] = [
  {
    path: '/',
    element: Home,
    title: 'Home',
  },
  // ⭐ Add your route here
  {
    path: '/about',
    element: About,
    title: 'About Us',
  },
  {
    path: '*',
    element: NotFound,
    title: 'Page Not Found',
  },
];
```

### Step 3: Done! 🎉

Navigate to `http://localhost:3000/about` - your route works!

### Option 2: Module Route (1 minute)

For feature-specific routes (Inbox, Lead Management, etc.)

#### Step 1: Find or Create Module File

Open existing module (e.g., `src/routes/modules/inbox.tsx`) or create new one.

#### Step 2: Add Lazy Import

```typescript
const InboxArchive = lazy(() =>
  import('../../pages/Inbox').then((module) => ({
    default: module.InboxArchive || module.default,
  }))
);
```

#### Step 3: Add to Module Routes Array

```typescript
export const inboxRoutes: IRouteConfig[] = [
  // ... existing routes
  {
    path: '/inbox/archive',
    element: InboxArchive,
    title: 'Archived Messages',
    description: 'View archived messages',
    protected: true,
  },
];
```

#### Step 4: Done! 🎉

Navigate to `http://localhost:3000/inbox/archive` - your route works!

**See `modules/QUICKSTART.md` for creating new modules.**

## When to Use Which?

| Route Type       | Use For                                   | Location            |
| ---------------- | ----------------------------------------- | ------------------- |
| **Simple Route** | General pages (Home, About, Contact)      | `routes/config.tsx` |
| **Module Route** | Feature-specific (Inbox, Leads, Projects) | `routes/modules/`   |

## Common Patterns

### Dynamic Route (User Profile)

```typescript
const UserProfile = lazy(() => import('../pages/UserProfile'));

{
  path: '/users/:userId',
  element: UserProfile,
  title: 'User Profile',
}
```

### Protected Route (Dashboard)

```typescript
const Dashboard = lazy(() => import('../pages/Dashboard'));

// Add to protectedRoutes array instead
export const protectedRoutes: RouteConfig[] = [
  {
    path: '/dashboard',
    element: Dashboard,
    title: 'Dashboard',
    protected: true,
  },
];
```

### Nested Routes (Settings)

```typescript
const SettingsLayout = lazy(() => import('../pages/Settings/Layout'));
const Profile = lazy(() => import('../pages/Settings/Profile'));
const Security = lazy(() => import('../pages/Settings/Security'));

{
  path: '/settings',
  element: SettingsLayout,
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

## Route Categories

Put your route in the right location:

| Category          | Use For             | Where to Add                     |
| ----------------- | ------------------- | -------------------------------- |
| `appRoutes`       | General pages       | `routes/config.tsx`              |
| `protectedRoutes` | Auth-required pages | `routes/config.tsx`              |
| `publicRoutes`    | Auth pages          | `routes/config.tsx`              |
| **Module Routes** | Feature-specific    | `routes/modules/your-module.tsx` |

### Current Modules

- **Inbox** (`modules/inbox.tsx`) - `/inbox`, `/inbox/compose`, `/inbox/:messageId`
- **Lead Management** (`modules/lead-management.tsx`) - `/lead-management`, `/lead-management/create`, etc.

## Route Configuration Options

```typescript
{
  path: '/my-page',           // Required - URL path
  element: MyPage,            // Required - Component to render
  title: 'My Page',           // Optional - Page title
  description: 'About...',    // Optional - Page description
  protected: true,            // Optional - Requires auth
  meta: {                     // Optional - Custom data
    roles: ['admin'],
  },
  children: [...],            // Optional - Nested routes
}
```

## ❌ Don't Do This

```typescript
// ❌ NEVER modify App.tsx for routes
// App.tsx
<Routes>
  <Route path="/new-page" element={<NewPage />} />
</Routes>
```

## ✅ Do This Instead

```typescript
// ✅ ALWAYS use routes/config.tsx
export const appRoutes: RouteConfig[] = [
  {
    path: '/new-page',
    element: NewPage,
    title: 'New Page',
  },
];
```

## Navigation in Components

```typescript
import { Link } from 'react-router-dom';

// Use Link for navigation
<Link to="/about">About Us</Link>

// Or useNavigate for programmatic navigation
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();
navigate('/about');
```

## Getting Route Parameters

```typescript
import { useParams } from 'react-router-dom';

const UserProfile = () => {
  const { userId } = useParams();
  return <div>User ID: {userId}</div>;
};
```

## Available Modules

Pre-configured module routes you can extend:

### 📬 Inbox Module

- `/inbox` - Inbox list
- `/inbox/compose` - Compose message
- `/inbox/:messageId` - Message details

### 👥 Lead Management Module

- `/lead-management` - Lead list
- `/lead-management/create` - Create lead
- `/lead-management/import` - Import leads
- `/lead-management/export` - Export leads
- `/lead-management/:leadId` - Lead details
- `/lead-management/:leadId/edit` - Edit lead

## Need More Help?

- **Module Routes**: See `modules/QUICKSTART.md` for creating new modules
- **Module Docs**: See `modules/README.md` for detailed module documentation
- **Examples:** See `src/routes/examples.tsx` for all patterns
- **Full Docs:** Read `src/routes/README.md` for detailed guide

## Checklist for Adding Routes

### Simple Route

- [ ] Created page component in `src/pages/`
- [ ] Added lazy import in `src/routes/config.tsx`
- [ ] Added route config to correct array (app/protected/public)
- [ ] Provided `path`, `element`, and `title`
- [ ] Tested route in browser
- [ ] Did NOT modify `App.tsx` ✅

### Module Route

- [ ] Created or opened module file in `src/routes/modules/`
- [ ] Added lazy import for page component
- [ ] Added route config to module array
- [ ] Set `protected: true` if auth required
- [ ] Exported from `modules/index.ts` (if new module)
- [ ] Imported in `routes/config.tsx` (if new module)
- [ ] Tested route in browser
- [ ] Did NOT modify `App.tsx` ✅

---

**Remember:**

- General routes → `src/routes/config.tsx`
- Feature routes → `src/routes/modules/`
- NEVER in `App.tsx`! 🎯
