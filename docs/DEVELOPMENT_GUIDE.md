# Development Guide

Comprehensive guide for team members working on this project. This document covers daily development practices, common workflows, troubleshooting, and best practices.

## Table of Contents

- [Daily Development Workflow](#daily-development-workflow)
- [Development Environment](#development-environment)
- [Coding Guidelines](#coding-guidelines)
- [Routes](#routes)
- [Common Tasks](#common-tasks)
- [Debugging Guide](#debugging-guide)
- [Performance Optimization](#performance-optimization)
- [Troubleshooting](#troubleshooting)
- [Tips & Tricks](#tips--tricks)

---

## Daily Development Workflow

### Morning Routine

```bash
# 1. Update your local repository
git checkout develop
git pull origin develop

# 2. Check for dependency updates
npm outdated

# 3. Run tests to ensure everything works
npm test

# 4. Start your development server
npm start
```

### Starting a New Task

```bash
# 1. Create feature branch from develop
git checkout develop
git pull origin develop
git checkout -b feature/PROJ-123-your-feature-name

# 2. Understand requirements
# - Read the ticket thoroughly
# - Ask questions if anything is unclear
# - Check acceptance criteria

# 3. Plan your approach
# - Sketch component structure
# - Identify required tests
# - Consider edge cases
# - Think about accessibility

# 4. Start coding!
```

### Before Committing

```bash
# Run the full validation suite
npm run validate

# This runs:
# - TypeScript type checking
# - ESLint
# - Prettier format check
# - All tests with coverage
```

### Creating a Pull Request

```bash
# 1. Ensure branch is up to date
git checkout develop
git pull origin develop
git checkout feature/PROJ-123-your-feature
git rebase develop

# 2. Push your branch
git push origin feature/PROJ-123-your-feature

# 3. Create PR on GitHub
# - Use PR template
# - Link related issues
# - Add screenshots for UI changes
# - Request review from appropriate team members

# 4. Monitor CI/CD checks
# - Ensure all checks pass
# - Fix any failures immediately
```

### End of Day

```bash
# 1. Commit and push your work
git add .
git commit -m "feat(feature): work in progress"
git push origin feature/PROJ-123-your-feature

# 2. Update ticket status in Jira
# - Move to "In Progress"
# - Add comments on progress
# - Flag any blockers

# 3. Check Slack for urgent messages

# 4. Plan tomorrow's work
```

---

## Development Environment

### Required Tools

#### Essential

- **Node.js** 18+ (use nvm for version management)
- **npm** 9+
- **Git** 2.0+
- **VS Code** (recommended) or WebStorm

#### Optional but Recommended

- **nvm** (Node Version Manager)
- **Postman** or **Insomnia** for API testing
- **React Developer Tools** (browser extension)
- **Redux DevTools** (browser extension, if using Redux)

### VS Code Setup

**Required Extensions:**

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "eamodio.gitlens",
    "usernamehw.errorlens",
    "vitest.explorer",
    "dsznajder.es7-react-js-snippets"
  ]
}
```

**Workspace Settings:**

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "eslint.validate": ["javascript", "javascriptreact", "typescript", "typescriptreact"],
  "files.autoSave": "onFocusChange",
  "editor.tabSize": 2,
  "editor.rulers": [100],
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true
}
```

### Browser DevTools Setup

**Chrome/Edge DevTools:**

1. Open DevTools (F12)
2. Go to Settings → Experiments
3. Enable "Performance Monitor"
4. Enable "Memory Inspector"

**React DevTools:**

- Install React Developer Tools extension
- Enable "Highlight Updates"
- Use Profiler tab for performance analysis

---

## Coding Guidelines

### Component Development

#### Component Template

```typescript
/**
 * ComponentName Component
 * Brief description of what this component does
 */

import { memo, useState, useCallback } from 'react';

import { useCustomHook } from '@hooks/useCustomHook';
import { api } from '@services/api';

import type { IComponentProps } from './ComponentName.types';

interface IComponentNameProps {
  id: string;
  onSuccess?: () => void;
}

const ComponentName = ({ id, onSuccess }: IComponentNameProps) => {
  // 1. Hooks
  const customData = useCustomHook();

  // 2. State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 3. Callbacks
  const handleAction = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await api.post('/endpoint', { id });
      onSuccess?.();
    } catch (err) {
      setError('Failed to perform action');
    } finally {
      setLoading(false);
    }
  }, [id, onSuccess]);

  // 4. Render
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {/* Component content */}
    </div>
  );
};

ComponentName.displayName = 'ComponentName';

export default memo(ComponentName);
```

#### Component Test Template

```typescript
/**
 * ComponentName Tests
 * Unit tests for ComponentName component
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ComponentName from './ComponentName';

describe('ComponentName', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render successfully', () => {
      render(<ComponentName id="123" />);
      expect(screen.getByTestId('component-name')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should handle user action', async () => {
      const user = userEvent.setup();
      const onSuccess = vi.fn();

      render(<ComponentName id="123" onSuccess={onSuccess} />);

      await user.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalled();
      });
    });
  });

  describe('Error Handling', () => {
    it('should display error message on failure', async () => {
      // Mock API failure
      render(<ComponentName id="123" />);

      // Test error scenario
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<ComponentName id="123" />);
      expect(screen.getByRole('button')).toHaveAttribute('aria-label');
    });
  });
});
```

### Custom Hook Development

#### Hook Template

```typescript
/**
 * useCustomHook
 * Brief description of what this hook does
 */

import { useState, useEffect, useCallback } from 'react';

import { logger } from '@utils/logger';

interface IUseCustomHookOptions {
  enabled?: boolean;
  interval?: number;
}

interface IUseCustomHookReturn {
  data: unknown | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useCustomHook = (options: IUseCustomHookOptions = {}): IUseCustomHookReturn => {
  const { enabled = true, interval = 5000 } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      // Fetch logic
      logger.debug('Fetching data from hook');
      // const result = await api.get('/endpoint');
      // setData(result);
    } catch (err) {
      logger.error('Failed to fetch data', err);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    fetchData();

    if (interval) {
      const intervalId = setInterval(fetchData, interval);
      return () => clearInterval(intervalId);
    }
  }, [fetchData, interval]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
};
```

### API Service Development

#### Adding New API Endpoint

```typescript
// src/services/userService.ts

import { api } from './api';
import type { IUser, IUserLoginRequest, IAuthResponse } from '@types/user.types';

export const userService = {
  /**
   * Login user with credentials
   */
  login: async (credentials: IUserLoginRequest): Promise<IAuthResponse> => {
    return api.post<IAuthResponse>('/auth/login', credentials);
  },

  /**
   * Get current user profile
   */
  getProfile: async (): Promise<IUser> => {
    return api.get<IUser>('/auth/profile');
  },

  /**
   * Update user profile
   */
  updateProfile: async (userId: string, updates: Partial<IUser>): Promise<IUser> => {
    return api.patch<IUser>(`/users/${userId}`, updates);
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    return api.post<void>('/auth/logout');
  },
};
```

### State Management

#### Creating a New Store

```typescript
// src/store/useProductStore.ts

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

import type { IProduct } from '@types/product.types';
import { logger } from '@utils/logger';

interface IProductState {
  products: IProduct[];
  selectedProduct: IProduct | null;
  isLoading: boolean;
  error: string | null;
}

interface IProductActions {
  setProducts: (products: IProduct[]) => void;
  selectProduct: (product: IProduct) => void;
  addProduct: (product: IProduct) => void;
  removeProduct: (productId: string) => void;
  clearError: () => void;
}

type TProductStore = IProductState & IProductActions;

const initialState: IProductState = {
  products: [],
  selectedProduct: null,
  isLoading: false,
  error: null,
};

export const useProductStore = create<TProductStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        setProducts: (products) => {
          logger.debug('Setting products', { count: products.length });
          set({ products }, false, 'setProducts');
        },

        selectProduct: (product) => {
          logger.debug('Selecting product', { productId: product.id });
          set({ selectedProduct: product }, false, 'selectProduct');
        },

        addProduct: (product) => {
          logger.debug('Adding product', { productId: product.id });
          set(
            (state) => ({
              products: [...state.products, product],
            }),
            false,
            'addProduct'
          );
        },

        removeProduct: (productId) => {
          logger.debug('Removing product', { productId });
          set(
            (state) => ({
              products: state.products.filter((p) => p.id !== productId),
              selectedProduct:
                state.selectedProduct?.id === productId ? null : state.selectedProduct,
            }),
            false,
            'removeProduct'
          );
        },

        clearError: () => {
          set({ error: null }, false, 'clearError');
        },
      }),
      {
        name: 'product-storage',
        partialize: (state) => ({
          products: state.products,
          selectedProduct: state.selectedProduct,
        }),
      }
    ),
    {
      name: 'ProductStore',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
);

// Selectors
export const selectProducts = (state: TProductStore) => state.products;
export const selectSelectedProduct = (state: TProductStore) => state.selectedProduct;
```

---

## Routes

This project uses a centralized routing system. All routes are managed in the `src/routes/` directory instead of `App.tsx`.

### Route Configuration Structure

```
src/routes/
├── README.md       # Detailed routing documentation
├── QUICKSTART.md   # Quick reference guide
├── index.ts        # Public exports
├── types.ts        # TypeScript type definitions
├── config.tsx      # ⭐ Main route configurations (edit this!)
├── examples.tsx    # Route pattern examples
└── AppRoutes.tsx   # Route renderer component
```

### Adding a Route

**All routes are defined in `src/routes/config.tsx`**

#### Basic Route

```typescript
// src/routes/config.tsx
import { lazy } from 'react';

// 1. Add lazy import
const MyPage = lazy(() => import('../pages/MyPage'));

// 2. Add to appropriate routes array
export const appRoutes: RouteConfig[] = [
  {
    path: '/',
    element: Home,
    title: 'Home',
  },
  {
    path: '/my-page',
    element: MyPage,
    title: 'My Page',
    description: 'Description for SEO',
  },
];
```

#### Protected Route (Requires Authentication)

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

#### Dynamic Route with Parameters

```typescript
export const appRoutes: RouteConfig[] = [
  {
    path: '/users/:userId',
    element: UserProfile,
    title: 'User Profile',
  },
  {
    path: '/products/:categoryId/:productId',
    element: ProductDetail,
    title: 'Product Details',
  },
];
```

#### Nested Routes

```typescript
// Parent component must render <Outlet /> from react-router-dom
export const appRoutes: RouteConfig[] = [
  {
    path: '/settings',
    element: SettingsLayout,
    title: 'Settings',
    children: [
      {
        index: true, // Default child (renders at /settings)
        element: ProfileSettings,
        title: 'Profile Settings',
      },
      {
        path: 'security', // Renders at /settings/security
        element: SecuritySettings,
        title: 'Security',
      },
      {
        path: 'notifications', // Renders at /settings/notifications
        element: NotificationSettings,
        title: 'Notifications',
      },
    ],
  },
];
```

#### Route with Metadata

```typescript
export const appRoutes: RouteConfig[] = [
  {
    path: '/admin',
    element: AdminPanel,
    title: 'Admin Panel',
    protected: true,
    meta: {
      roles: ['admin', 'superadmin'],
      permissions: ['manage_users'],
      layout: 'wide',
      analytics: {
        category: 'admin',
        trackPageView: true,
      },
    },
  },
];
```

### Route Configuration Options

| Property      | Type            | Required | Description                                  |
| ------------- | --------------- | -------- | -------------------------------------------- |
| `path`        | `string`        | ✅       | Route path (supports React Router patterns)  |
| `element`     | `Component`     | ✅       | Component to render (lazy-loaded or regular) |
| `title`       | `string`        | ❌       | Page title for SEO and accessibility         |
| `description` | `string`        | ❌       | Page description for SEO                     |
| `protected`   | `boolean`       | ❌       | Requires authentication (default: `false`)   |
| `children`    | `RouteConfig[]` | ❌       | Nested child routes                          |
| `index`       | `boolean`       | ❌       | Index route flag                             |
| `meta`        | `object`        | ❌       | Custom route metadata                        |

### Route Categories

Routes are organized into three categories in `config.tsx`:

#### 1. App Routes (`appRoutes`)

Core application routes available to all users:

```typescript
export const appRoutes: RouteConfig[] = [
  { path: '/', element: Home, title: 'Home' },
  { path: '*', element: NotFound, title: 'Not Found' },
];
```

#### 2. Protected Routes (`protectedRoutes`)

Routes requiring authentication:

```typescript
export const protectedRoutes: RouteConfig[] = [
  { path: '/dashboard', element: Dashboard, protected: true },
];
```

#### 3. Public Routes (`publicRoutes`)

Explicitly public routes (login, register, etc.):

```typescript
export const publicRoutes: RouteConfig[] = [
  { path: '/login', element: Login, title: 'Login' },
  { path: '/register', element: Register, title: 'Register' },
];
```

### Accessing Route Parameters

```typescript
// In component for route: /users/:userId
import { useParams } from 'react-router-dom';

const UserProfile = () => {
  const { userId } = useParams<{ userId: string }>();

  return <div>User ID: {userId}</div>;
};
```

### Navigation

#### Programmatic Navigation

```typescript
import { useNavigate } from 'react-router-dom';

const MyComponent = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/dashboard');
    // Or with state
    navigate('/dashboard', { state: { from: 'home' } });
  };

  return <button onClick={handleClick}>Go to Dashboard</button>;
};
```

#### Link Navigation

```typescript
import { Link } from 'react-router-dom';

const MyComponent = () => {
  return (
    <>
      <Link to="/dashboard">Dashboard</Link>
      <Link to={`/users/${userId}`}>User Profile</Link>
    </>
  );
};
```

### Route Examples

For complete routing pattern examples, see:

- `src/routes/examples.tsx` - Comprehensive examples
- `src/routes/README.md` - Detailed documentation
- `src/routes/QUICKSTART.md` - Quick reference

### Best Practices

1. ✅ **Always use lazy loading** for code splitting

   ```typescript
   const MyPage = lazy(() => import('../pages/MyPage'));
   ```

2. ✅ **Provide titles and descriptions** for SEO

   ```typescript
   { path: '/about', element: About, title: 'About Us', description: '...' }
   ```

3. ✅ **Use path constants** for frequently referenced routes

   ```typescript
   export const ROUTES = {
     HOME: '/',
     DASHBOARD: '/dashboard',
   };
   ```

4. ✅ **Keep routes organized** by category (app, protected, public)

5. ✅ **Document complex patterns** with comments

6. ❌ **Never modify App.tsx** for routing - use `config.tsx` only

7. ❌ **Don't put route logic in config** - use metadata and handle in components

---

## Common Tasks

### Adding a New Page

**Step 1: Create page directory**

```bash
mkdir -p src/pages/NewPage
```

**Step 2: Create page component**

```typescript
// src/pages/NewPage/NewPage.tsx
import { memo } from 'react';
import { usePerformanceMonitor } from '@hooks';

const NewPage = () => {
  usePerformanceMonitor({ componentName: 'NewPage' });

  return (
    <div>
      <h1>New Page</h1>
    </div>
  );
};

export default memo(NewPage);
```

**Step 3: Create test file**

```typescript
// src/pages/NewPage/NewPage.test.tsx
import { render, screen } from '@testing-library/react';
import NewPage from './NewPage';

describe('NewPage', () => {
  it('should render successfully', () => {
    render(<NewPage />);
    expect(screen.getByText('New Page')).toBeInTheDocument();
  });
});
```

**Step 4: Create index file**

```typescript
// src/pages/NewPage/index.ts
export { default } from './NewPage';
export { default as NewPage } from './NewPage';
```

**Step 5: Add route to centralized configuration**

```typescript
// src/routes/config.tsx
import { lazy } from 'react';

// Add lazy import at the top
const NewPage = lazy(() => import('../pages/NewPage'));

// Add to the appropriate routes array
export const appRoutes: RouteConfig[] = [
  {
    path: '/',
    element: Home,
    title: 'Home',
    description: 'Subaccount Management Home',
  },
  // Add your new route here
  {
    path: '/new-page',
    element: NewPage,
    title: 'New Page',
    description: 'Description of the new page',
  },
  // ... other routes
];
```

> **Note:** All routes are managed in `src/routes/config.tsx`. Never modify `App.tsx` for routing changes.

**For protected routes (requires authentication):**

```typescript
export const protectedRoutes: RouteConfig[] = [
  {
    path: '/new-page',
    element: NewPage,
    title: 'New Page',
    protected: true,
  },
];
```

**For routes with nested children:**

```typescript
export const appRoutes: RouteConfig[] = [
  {
    path: '/new-page',
    element: NewPageLayout,
    title: 'New Page',
    children: [
      {
        index: true,
        element: NewPageHome,
        title: 'New Page Home',
      },
      {
        path: 'details',
        element: NewPageDetails,
        title: 'Details',
      },
    ],
  },
];
```

**For dynamic routes:**

```typescript
export const appRoutes: RouteConfig[] = [
  {
    path: '/users/:userId',
    element: UserProfile,
    title: 'User Profile',
  },
];
```

> 💡 **Pro Tip:** Check `src/routes/examples.tsx` for more routing patterns and examples.

### Adding Form Validation

**Step 1: Define Zod schema**

```typescript
// src/utils/validation.ts
export const newFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: emailSchema,
  age: z.number().min(18, 'Must be 18 or older').max(120),
});

export type TNewForm = z.infer<typeof newFormSchema>;
```

**Step 2: Use in component**

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { newFormSchema, type TNewForm } from '@utils/validation';

const MyForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<TNewForm>({
    resolver: zodResolver(newFormSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: TNewForm) => {
    // Handle submission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} />
      {errors.name && <span>{errors.name.message}</span>}
      {/* More fields */}
    </form>
  );
};
```

### Adding API Endpoint

**Step 1: Define types**

```typescript
// src/types/product.types.ts
export interface IProduct {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface ICreateProductRequest {
  name: string;
  price: number;
  description: string;
}
```

**Step 2: Create service**

```typescript
// src/services/productService.ts
import { api } from './api';
import type { IProduct, ICreateProductRequest } from '@types/product.types';

export const productService = {
  getAll: async (): Promise<IProduct[]> => {
    return api.get<IProduct[]>('/products');
  },

  getById: async (id: string): Promise<IProduct> => {
    return api.get<IProduct>(`/products/${id}`);
  },

  create: async (data: ICreateProductRequest): Promise<IProduct> => {
    return api.post<IProduct>('/products', data);
  },

  update: async (id: string, data: Partial<IProduct>): Promise<IProduct> => {
    return api.patch<IProduct>(`/products/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    return api.delete<void>(`/products/${id}`);
  },
};
```

**Step 3: Write tests**

```typescript
// src/services/productService.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { productService } from './productService';
import { api } from './api';

vi.mock('./api');

describe('productService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch all products', async () => {
    const mockProducts = [{ id: '1', name: 'Product 1' }];
    (api.get as ReturnType<typeof vi.fn>).mockResolvedValue(mockProducts);

    const result = await productService.getAll();

    expect(api.get).toHaveBeenCalledWith('/products');
    expect(result).toEqual(mockProducts);
  });
});
```

### Adding Global State

**Step 1: Create store**

```typescript
// src/store/useAppStore.ts
import { create } from 'zustand';

interface IAppState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
}

interface IAppActions {
  setTheme: (theme: 'light' | 'dark') => void;
  toggleSidebar: () => void;
}

export const useAppStore = create<IAppState & IAppActions>((set) => ({
  theme: 'light',
  sidebarOpen: true,

  setTheme: (theme) => set({ theme }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));
```

**Step 2: Use in components**

```typescript
import { useAppStore } from '@store/useAppStore';

const MyComponent = () => {
  const theme = useAppStore((state) => state.theme);
  const setTheme = useAppStore((state) => state.setTheme);

  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Toggle Theme
    </button>
  );
};
```

---

## Debugging Guide

### Common Debugging Scenarios

#### 1. Component Not Rendering

**Check:**

```typescript
// Add console in development (remove before commit)
useEffect(() => {
  if (import.meta.env.VITE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.log('Component mounted', { props, state });
  }
}, []);
```

**Use React DevTools:**

- Check component tree
- Inspect props and state
- Use Profiler to check rendering

#### 2. Infinite Re-renders

**Causes:**

- Missing dependency array in useEffect
- State update in render
- Incorrect useCallback dependencies

**Solution:**

```typescript
// ❌ BAD - Causes infinite loop
useEffect(() => {
  setState(newValue);
}); // No dependency array!

// ✅ GOOD
useEffect(() => {
  setState(newValue);
}, [dependency]);
```

#### 3. State Not Updating

**Common Issues:**

- Mutating state directly
- Async state updates
- Stale closures

**Solution:**

```typescript
// ❌ BAD - Mutating state
const items = [...state.items];
items[0].name = 'New Name';
setState({ items });

// ✅ GOOD - Creating new state
setState({
  items: state.items.map((item, i) => (i === 0 ? { ...item, name: 'New Name' } : item)),
});
```

#### 4. API Calls Failing

**Debug Steps:**

1. Check Network tab in DevTools
2. Verify request URL and headers
3. Check authentication token
4. Verify API is running
5. Check CORS configuration

**Add Debugging:**

```typescript
try {
  const response = await api.get('/endpoint');
  logger.debug('API response', { response });
} catch (error) {
  logger.error('API error', {
    error,
    request: error.config,
    response: error.response,
  });
}
```

#### 5. TypeScript Errors

**Common Issues:**

- Missing type definitions
- Incorrect type inference
- Null/undefined checks

**Solutions:**

```typescript
// Use type guards
if (user && user.profile) {
  // TypeScript knows user.profile exists
}

// Use optional chaining
const email = user?.profile?.email ?? 'N/A';

// Use type assertions (as last resort)
const data = response.data as IExpectedType;
```

### Performance Debugging

#### Identify Slow Components

**Using React Profiler:**

```typescript
import { Profiler, ProfilerOnRenderCallback } from 'react';

const onRender: ProfilerOnRenderCallback = (
  id,
  phase,
  actualDuration,
  baseDuration,
  startTime,
  commitTime
) => {
  if (actualDuration > 16) {
    logger.warn(`Slow render in ${id}`, {
      phase,
      actualDuration,
      baseDuration,
    });
  }
};

<Profiler id="MyComponent" onRender={onRender}>
  <MyComponent />
</Profiler>
```

**Using Performance Monitor:**

```typescript
import { usePerformanceMonitor } from '@hooks';

const MyComponent = () => {
  const perf = usePerformanceMonitor({
    componentName: 'MyComponent',
    logSlowRenders: true,
  });

  // Check perf.slowRendersCount
};
```

#### Memory Leak Detection

```typescript
import { useMemoryLeakDetector } from '@hooks';

const MyComponent = () => {
  const { warnings, hasLeaks } = useMemoryLeakDetector({
    componentName: 'MyComponent',
    enabled: process.env.NODE_ENV === 'development',
  });

  useEffect(() => {
    if (hasLeaks) {
      logger.warn('Memory leaks detected', { warnings });
    }
  }, [hasLeaks, warnings]);
};
```

#### Bundle Size Analysis

```bash
# Build with analysis
npm run build

# Analyze bundle
npm run analyze

# Opens bundle-analysis.html showing:
# - Size of each dependency
# - Duplicate packages
# - Large modules
```

---

## Performance Optimization

### React Performance

#### 1. Memoization

**Use memo for expensive components:**

```typescript
import { memo } from 'react';

const ExpensiveList = memo(({ items }: { items: string[] }) => {
  return (
    <ul>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
});
```

**Use useCallback for event handlers:**

```typescript
const handleClick = useCallback((id: string) => {
  // Handler logic
}, [dependencies]);

// Pass to child
<ChildComponent onClick={handleClick} />
```

**Use useMemo for expensive calculations:**

```typescript
const sortedItems = useMemo(() => {
  return items.sort((a, b) => a.name.localeCompare(b.name));
}, [items]);
```

#### 2. Code Splitting

**Route-based splitting:**

```typescript
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));

<Suspense fallback={<Loading />}>
  <Routes>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/profile" element={<Profile />} />
  </Routes>
</Suspense>
```

**Component-based splitting:**

```typescript
import { lazy, Suspense } from 'react';

const HeavyChart = lazy(() => import('./components/HeavyChart'));

const Dashboard = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <Suspense fallback={<ChartSkeleton />}>
        <HeavyChart data={data} />
      </Suspense>
    </div>
  );
};
```

#### 3. List Optimization

**Virtualization for long lists:**

```typescript
import { useVirtualizer } from '@tanstack/react-virtual';

const VirtualList = ({ items }: { items: string[] }) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
  });

  return (
    <div ref={parentRef} style={{ height: '400px', overflow: 'auto' }}>
      <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            {items[virtualItem.index]}
          </div>
        ))}
      </div>
    </div>
  );
};
```

#### 4. Image Optimization

**Lazy loading images:**

```typescript
<img
  src={imageUrl}
  alt={description}
  loading="lazy"
  decoding="async"
/>
```

**Responsive images:**

```typescript
<img
  srcSet={`
    ${smallImage} 400w,
    ${mediumImage} 800w,
    ${largeImage} 1200w
  `}
  sizes="(max-width: 400px) 400px, (max-width: 800px) 800px, 1200px"
  src={mediumImage}
  alt={description}
/>
```

### Network Performance

#### 1. Request Batching

```typescript
// Batch multiple requests
const fetchDashboardData = async () => {
  const [users, products, orders] = await Promise.all([
    api.get('/users'),
    api.get('/products'),
    api.get('/orders'),
  ]);

  return { users, products, orders };
};
```

#### 2. Request Cancellation

```typescript
useEffect(() => {
  const controller = new AbortController();

  const fetchData = async () => {
    try {
      const data = await api.get('/endpoint', {
        signal: controller.signal,
      });
      setData(data);
    } catch (error) {
      if (error.name !== 'AbortError') {
        // Handle non-cancellation errors
      }
    }
  };

  fetchData();

  return () => {
    controller.abort(); // Cancel on unmount
  };
}, []);
```

#### 3. Caching Strategies

```typescript
// Simple in-memory cache
const cache = new Map();

const fetchWithCache = async (key: string) => {
  if (cache.has(key)) {
    return cache.get(key);
  }

  const data = await api.get(`/endpoint/${key}`);
  cache.set(key, data);

  return data;
};
```

---

## Troubleshooting

### Common Issues

#### Issue: "Module not found" Error

**Cause:** Incorrect import path or missing dependency

**Solution:**

```bash
# Check if package is installed
npm ls package-name

# If missing, install it
npm install package-name

# If path alias issue, check tsconfig.json paths
```

#### Issue: Tests Failing Only in CI

**Causes:**

- Environment variable differences
- Timezone differences
- Async timing issues
- Node/npm version differences

**Solution:**

```typescript
// Use fake timers for timing-dependent tests
vi.useFakeTimers();

// Set explicit timezone
process.env.TZ = 'UTC';

// Increase timeout for slow operations
// In Vitest, use test.setTimeout() within describe blocks
```

#### Issue: ESLint Errors After Pull

**Solution:**

```bash
# Clear ESLint cache
rm -rf node_modules/.cache

# Reinstall dependencies
rm -rf node_modules
npm ci

# Restart IDE
```

#### Issue: TypeScript Errors in IDE but not CLI

**Solution:**

```bash
# Restart TypeScript server in VS Code
# CMD/CTRL + Shift + P → "TypeScript: Restart TS Server"

# Or use CLI
npx tsc --noEmit

# Check for multiple TypeScript versions
npm ls typescript
```

#### Issue: Husky Hooks Not Running

**Solution:**

```bash
# Reinstall Husky
npm run prepare

# Make hooks executable (Unix/Mac)
chmod +x .husky/*

# Test hook manually
.husky/pre-commit
```

#### Issue: Build Fails with Out of Memory

**Solution:**

```bash
# Increase Node memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build

# Or in package.json
"build": "NODE_OPTIONS=--max-old-space-size=4096 react-scripts build"
```

### Getting Help

**When You're Stuck:**

1. **Check Documentation** (5 min)
   - README.md
   - TEAM_RULES.md
   - Wiki/Confluence

2. **Search Issues** (5 min)
   - GitHub issues
   - Stack Overflow
   - Team Slack history

3. **Ask Team** (immediate)
   - Post in `#help` Slack channel
   - Include:
     - What you're trying to do
     - What you've tried
     - Error messages
     - Screenshots if relevant

4. **Escalate** (if urgent)
   - Tag mentor or team lead
   - Set up pair programming session

---

## Tips & Tricks

### Development Productivity

#### Hot Tips

**1. Use Path Aliases:**

```typescript
// ❌ Avoid
import { Button } from '../../../components/Button';

// ✅ Better
import { Button } from '@components/Button';
```

**2. Use Code Snippets:**

```typescript
// Create VS Code snippets for common patterns
// File: .vscode/snippets.code-snippets
{
  "React Component": {
    "prefix": "rfc",
    "body": [
      "import { memo } from 'react';",
      "",
      "interface I${1:Component}Props {",
      "  $2",
      "}",
      "",
      "const ${1:Component} = memo(({ $3 }: I${1:Component}Props) => {",
      "  return (",
      "    <div>",
      "      $0",
      "    </div>",
      "  );",
      "});",
      "",
      "${1:Component}.displayName = '${1:Component}';",
      "",
      "export default ${1:Component};"
    ]
  }
}
```

**3. Git Aliases:**

```bash
# Add to ~/.gitconfig
[alias]
  co = checkout
  br = branch
  ci = commit
  st = status
  unstage = reset HEAD --
  last = log -1 HEAD
  visual = log --graph --oneline --all
```

**4. npm Scripts Shortcuts:**

```bash
# Add to ~/.bashrc or ~/.zshrc
alias nrs="npm run start"
alias nrt="npm run test"
alias nrl="npm run lint"
alias nrb="npm run build"
alias nrv="npm run validate"
```

### Testing Tips

**1. Test Data Factories:**

```typescript
// src/utils/testFactories.ts
export const createMockUser = (overrides = {}): IUser => ({
  id: '1',
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
  ...overrides,
});

// Use in tests
const user = createMockUser({ firstName: 'Jane' });
```

**2. Custom Render Helpers:**

```typescript
// src/utils/testUtils.tsx
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

export const renderWithRouter = (ui: React.ReactElement, options?: RenderOptions) => {
  return render(ui, {
    wrapper: BrowserRouter,
    ...options,
  });
};
```

**3. Mock API Responses:**

```typescript
// src/__mocks__/api.ts
export const mockApi = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
};
```

### Performance Tips

**1. Monitor Component Renders:**

```typescript
// Use why-did-you-render in development
if (process.env.NODE_ENV === 'development') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React, {
    trackAllPureComponents: true,
  });
}
```

**2. Measure Function Performance:**

```typescript
import { measureExecutionTime } from '@utils/performance';

const result = await measureExecutionTime('fetchData', async () => {
  return await api.get('/data');
});

// result.duration contains execution time in ms
```

**3. Profile Production Builds:**

```bash
# Build with profiling
npm run build:profile

# Analyze in React DevTools
# Profile tab will show detailed render timing
```

### Debugging Tools

**1. React DevTools Profiler:**

- Click "Record" button
- Interact with your app
- Click "Stop"
- Analyze flame graph
- Identify slow components

**2. Chrome Performance Tab:**

- Open DevTools → Performance
- Click Record
- Perform actions
- Click Stop
- Analyze:
  - FPS (should be 60)
  - CPU usage
  - Memory allocation
  - Network requests

**3. Chrome Memory Tab:**

- Take heap snapshot before action
- Perform action
- Take heap snapshot after
- Compare snapshots
- Find memory leaks

---

## Best Practices Checklist

### Before Every Commit

- [ ] Code follows style guide
- [ ] No `console.log` statements
- [ ] No `any` types
- [ ] All tests pass
- [ ] No ESLint warnings
- [ ] TypeScript checks pass
- [ ] Code is formatted with Prettier

### Before Every PR

- [ ] Branch is up to date with develop
- [ ] All validation passes (`npm run validate`)
- [ ] Tests have 80%+ coverage
- [ ] Documentation updated
- [ ] PR template filled completely
- [ ] Self-review completed
- [ ] Screenshots added (if UI changes)

### Weekly

- [ ] Review open PRs and provide feedback
- [ ] Check for dependency updates
- [ ] Run security audit (`npm audit`)
- [ ] Clean up old branches
- [ ] Update knowledge documentation

---

## Quick Reference

### Essential Commands

```bash
# Development
npm start                 # Start dev server
npm test                  # Run tests
npm run lint              # Check linting
npm run validate          # Run all checks

# Code Quality
npm run lint:fix          # Fix linting issues
npm run format            # Format code
npm run type-check        # Check TypeScript

# Testing
npm run test:watch        # Watch mode
npm run test:coverage     # With coverage

# Build
npm run build             # Production build
npm run analyze           # Bundle analysis
```

### Keyboard Shortcuts

**VS Code:**

- `Ctrl/Cmd + P` - Quick open file
- `Ctrl/Cmd + Shift + P` - Command palette
- `Ctrl/Cmd + Shift + F` - Search in files
- `Ctrl/Cmd + D` - Select next occurrence
- `Alt + Up/Down` - Move line up/down
- `Ctrl/Cmd + /` - Toggle comment
- `F2` - Rename symbol
- `F12` - Go to definition

**Chrome DevTools:**

- `F12` - Open DevTools
- `Ctrl/Cmd + Shift + C` - Inspect element
- `Ctrl/Cmd + Shift + J` - Open console
- `Ctrl/Cmd + Shift + M` - Toggle device toolbar

### Useful Links

- [Project Wiki](link)
- [API Docs](link)
- [Design System](link)
- [Jira Board](link)
- [Team Calendar](link)
- [On-call Schedule](link)

---

## Continuous Learning

### Recommended Learning Path

**Month 1-2:**

- Master React hooks
- Understand TypeScript advanced types
- Learn testing best practices
- Study performance optimization

**Month 3-4:**

- Advanced state management patterns
- Performance profiling and optimization
- Accessibility deep dive
- Security best practices

**Month 5-6:**

- Architecture and design patterns
- Micro-frontends
- Advanced testing strategies
- DevOps and deployment

### Learning Resources

**Internal:**

- Tech Talk Recordings
- Internal Blog Posts
- Team Wiki
- Mentor Sessions

**External:**

- [React.dev](https://react.dev)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- [Kent C. Dodds Blog](https://kentcdodds.com/blog)
- [Web.dev](https://web.dev)

---

## Remember

✅ **Ask questions** - Better to ask than assume  
✅ **Test thoroughly** - Bugs in production affect users  
✅ **Review carefully** - You're helping your teammates  
✅ **Document well** - Your future self will thank you  
✅ **Own your work** - From code to production  
✅ **Help others** - We succeed together

**Welcome to the team! Let's build something great! 🚀**

---

**Questions?** Ask in `#help` or contact your mentor/team lead

**Last Updated:** Dec 2025  
**Version:** 1.0.0
