# Testing Guide

This directory contains all test files for the Subaccount Frontend application.

## Quick Start

### Running Tests

```bash
# Run all unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e

# Run E2E tests headlessly
npm run test:e2e:headless
```

## Directory Structure

```
__tests__/
├── unit/                       # Unit tests
│   ├── components/             # Component unit tests
│   ├── services/               # Service unit tests
│   ├── hooks/                  # Hook unit tests
│   └── utils/                  # Utility function tests
├── integration/                # Integration tests
│   ├── api-integration.test.ts
│   └── ...
├── helpers/                    # Test utilities
│   └── test-utils.tsx          # Custom render, setup functions
└── mocks/                      # Mock data and handlers
    ├── mockData.ts             # Mock data factory
    ├── handlers.ts             # MSW request handlers
    └── server.ts               # MSW server setup
```

## Writing Tests

### Unit Test Example

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@/__tests__/helpers/test-utils';
import Button from '@/components/Button';

describe('Button', () => {
  it('should render with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

### Integration Test Example

```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { api } from '@/services/api';
import { startServer, closeServer } from '@/__tests__/mocks/server';

beforeAll(() => startServer());
afterAll(() => closeServer());

describe('API Integration', () => {
  it('should fetch user data', async () => {
    const user = await api.get('/api/users/123');
    expect(user).toBeDefined();
  });
});
```

## Test Utilities

### Custom Render Function

Use the custom render function that includes providers:

```typescript
import { render, screen, userEvent } from '@/__tests__/helpers/test-utils';

// Automatically wraps with Router and other providers
render(<MyComponent />);

// With initial route
render(<MyComponent />, { route: '/dashboard' });
```

### Mock Data

Use the mock data factory for consistent test data:

```typescript
import {
  mockUser,
  mockAuthToken,
  createMockUsers,
  createMockApiResponse,
} from '@/__tests__/mocks/mockData';

// Use predefined mocks
const user = mockUser;

// Create custom mocks
const users = createMockUsers(10);
const response = createMockApiResponse(users);
```

### MSW Handlers

API requests are automatically mocked using MSW. Custom handlers can be added:

```typescript
import { http, HttpResponse } from 'msw';
import { server } from '@/__tests__/mocks/server';

// Override default handler for a specific test
server.use(
  http.get('/api/custom-endpoint', () => {
    return HttpResponse.json({ data: 'custom response' });
  })
);
```

## Best Practices

1. **Test Behavior, Not Implementation**
   - Focus on what the code does, not how it does it
   - Use accessible queries (getByRole, getByLabelText)

2. **Keep Tests Independent**
   - Each test should run in isolation
   - Use beforeEach/afterEach for setup/cleanup

3. **Use Descriptive Names**

   ```typescript
   // Good
   it('should display error message when email is invalid', () => {});

   // Bad
   it('test email', () => {});
   ```

4. **Follow AAA Pattern**

   ```typescript
   it('should update profile', async () => {
     // Arrange - Setup
     const user = userEvent.setup();
     render(<Profile />);

     // Act - Perform action
     await user.type(screen.getByLabelText('Name'), 'John');
     await user.click(screen.getByRole('button', { name: /save/i }));

     // Assert - Verify result
     expect(screen.getByText('Profile updated')).toBeInTheDocument();
   });
   ```

5. **Mock External Dependencies**
   - Use MSW for API calls
   - Mock complex utilities
   - Don't mock what you're testing

## Common Patterns

### Testing Async Operations

```typescript
import { waitFor } from '@testing-library/react';

it('should load data', async () => {
  render(<DataComponent />);

  await waitFor(() => {
    expect(screen.getByText('Data loaded')).toBeInTheDocument();
  });
});
```

### Testing User Interactions

```typescript
const user = userEvent.setup();

// Click
await user.click(button);

// Type
await user.type(input, 'text');

// Select option
await user.selectOptions(select, 'option-value');

// Upload file
await user.upload(fileInput, file);
```

### Testing Error States

```typescript
it('should display error on API failure', async () => {
  server.use(
    http.get('/api/data', () => {
      return HttpResponse.error();
    })
  );

  render(<DataComponent />);

  await waitFor(() => {
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });
});
```

## Coverage Requirements

- Branches: 80%
- Functions: 80%
- Lines: 80%
- Statements: 80%

Run `npm run test:coverage` to check current coverage.

## Troubleshooting

### Tests Failing Randomly

- Check for race conditions
- Use proper async handling (waitFor, await)
- Clear mocks between tests

### Slow Tests

- Mock heavy operations
- Run tests in parallel where possible
- Use test.concurrent for independent tests

### Import Errors

- Check path aliases in vitest.config.ts
- Ensure dependencies are installed
- Clear node_modules and reinstall if needed

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [MSW Documentation](https://mswjs.io/)
- [Full Testing Guide](../../docs/TESTING.md)

## Getting Help

If you encounter issues:

1. Check this README
2. Review the full testing documentation in `docs/TESTING.md`
3. Look at existing tests for examples
4. Ask team members for guidance
