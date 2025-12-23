# Testing Documentation

This document provides comprehensive information about testing strategies, setup, and best practices for the Subaccount Frontend application.

## Table of Contents

1. [Overview](#overview)
2. [Testing Stack](#testing-stack)
3. [Test Structure](#test-structure)
4. [Unit Testing](#unit-testing)
5. [Integration Testing](#integration-testing)
6. [End-to-End Testing](#end-to-end-testing)
7. [Running Tests](#running-tests)
8. [Writing Tests](#writing-tests)
9. [Test Coverage](#test-coverage)
10. [Best Practices](#best-practices)
11. [Continuous Integration](#continuous-integration)
12. [Troubleshooting](#troubleshooting)

---

## Overview

Our testing strategy follows the testing pyramid approach:

- **Unit Tests (80%)**: Fast, isolated tests for individual components, functions, and utilities
- **Integration Tests (20%)**: Tests for interactions between components and services

### Testing Philosophy

- **Test behavior, not implementation**: Focus on what the code does, not how it does it
- **Write tests that provide confidence**: Tests should catch real bugs and prevent regressions
- **Keep tests maintainable**: Tests should be easy to read, understand, and update
- **Fast feedback loops**: Tests should run quickly to encourage frequent execution

---

## Testing Stack

### Core Testing Tools

- **[Vitest](https://vitest.dev/)**: Fast unit testing framework (Vite-native alternative to Jest)
- **[React Testing Library](https://testing-library.com/react)**: Component testing utilities
- **[MSW (Mock Service Worker)](https://mswjs.io/)**: API mocking library

### Testing Utilities

- **@testing-library/user-event**: User interaction simulation
- **@testing-library/jest-dom**: Custom Jest matchers for DOM assertions
- **@vitest/ui**: Visual test runner interface
- **@vitest/coverage-v8**: Code coverage reporting

---

## Test Structure

```
src/
├── __tests__/                      # Centralized test directory
│   ├── unit/                       # Unit tests
│   │   ├── components/             # Component unit tests
│   │   ├── services/               # Service unit tests
│   │   ├── hooks/                  # Custom hook tests
│   │   └── utils/                  # Utility function tests
│   ├── integration/                # Integration tests
│   │   ├── api-integration.test.ts
│   │   └── component-flow.test.tsx
│   ├── helpers/                    # Test utilities
│   │   └── test-utils.tsx          # Custom render functions
│   └── mocks/                      # Mock data and handlers
│       ├── mockData.ts             # Mock data factory
│       ├── handlers.ts             # MSW request handlers
│       └── server.ts               # MSW server setup
├── components/                     # Component source files
│   └── ComponentName/
│       ├── ComponentName.tsx
│       └── ComponentName.test.tsx  # Co-located component tests
└── setupTests.ts                   # Global test setup
```

---

## Unit Testing

Unit tests focus on testing individual components, functions, or modules in isolation.

### Component Testing

**Example: Button Component Test**

```typescript
// src/components/Button/Button.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, userEvent } from '@/__tests__/helpers/test-utils';
import Button from './Button';

describe('Button', () => {
  it('should render with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should call onClick when clicked', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Click me</Button>);

    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### Service Testing

**Example: API Service Test**

```typescript
// src/__tests__/unit/services/api.test.ts
import { describe, it, expect, vi } from 'vitest';
import { api } from '@/services/api';
import { mockUser } from '@/__tests__/mocks/mockData';

describe('API Service', () => {
  it('should make GET request successfully', async () => {
    const client = api.getClient();
    vi.mocked(client.get).mockResolvedValueOnce({
      data: { data: mockUser },
    });

    const result = await api.get('/users/123');

    expect(result).toEqual(mockUser);
    expect(client.get).toHaveBeenCalledWith('/users/123', undefined);
  });
});
```

### Hook Testing

**Example: Custom Hook Test**

```typescript
// src/hooks/useAuth.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useAuth } from './useAuth';

describe('useAuth', () => {
  it('should initialize with logged out state', () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('should login successfully', async () => {
    const { result } = renderHook(() => useAuth());

    await result.current.login('test@example.com', 'password');

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toBeDefined();
    });
  });
});
```

---

## Integration Testing

Integration tests verify that multiple components or modules work together correctly.

### API Integration Testing with MSW

**Example: Authentication Flow Integration Test**

```typescript
// src/__tests__/integration/auth-flow.test.ts
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { api } from '@/services/api';
import { server, startServer, closeServer } from '@/__tests__/mocks/server';

beforeAll(() => startServer());
afterEach(() => server.resetHandlers());
afterAll(() => closeServer());

describe('Authentication Flow Integration', () => {
  it('should complete login flow', async () => {
    const response = await api.post('/api/auth/login', {
      email: 'test@example.com',
      password: 'password123',
    });

    expect(response.token).toBeDefined();
    expect(response.user).toBeDefined();

    api.setAuthToken(response.token, true);

    const profile = await api.get('/api/users/profile');
    expect(profile.email).toBe('test@example.com');
  });
});
```

### Component Integration Testing

**Example: Form with API Integration**

```typescript
// src/__tests__/integration/registration-form.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen, userEvent, waitFor } from '@/__tests__/helpers/test-utils';
import RegistrationForm from '@/components/RegistrationForm';

describe('Registration Form Integration', () => {
  it('should submit form and handle success', async () => {
    const user = userEvent.setup();
    render(<RegistrationForm />);

    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.type(screen.getByLabelText('Password'), 'SecurePass123!');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/registration successful/i)).toBeInTheDocument();
    });
  });
});
```

---

## Running Tests

### Unit and Integration Tests (Vitest)

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui

# Run specific test file
npm test -- path/to/test.test.ts

# Run tests matching pattern
npm test -- --grep "Button"
```

### Run All Tests

```bash
# Run all test suites
npm run validate
```

---

## Writing Tests

### Test Structure (AAA Pattern)

Follow the **Arrange-Act-Assert** pattern:

```typescript
it('should update user profile', async () => {
  // Arrange - Setup test data and conditions
  const user = userEvent.setup();
  const mockUser = { name: 'John Doe', email: 'john@example.com' };
  render(<ProfileForm user={mockUser} />);

  // Act - Perform the action being tested
  await user.type(screen.getByLabelText('Name'), 'Jane Doe');
  await user.click(screen.getByRole('button', { name: /save/i }));

  // Assert - Verify the expected outcome
  await waitFor(() => {
    expect(screen.getByText(/profile updated/i)).toBeInTheDocument();
  });
});
```

### Test Naming Conventions

Use descriptive test names that clearly state what is being tested:

```typescript
describe('Component/Function Name', () => {
  describe('Specific Feature', () => {
    it('should [expected behavior] when [condition]', () => {
      // Test implementation
    });

    it('should [expected behavior] given [state]', () => {
      // Test implementation
    });
  });
});
```

**Examples:**

- ✅ `should display error message when email is invalid`
- ✅ `should call onSubmit with form data when form is valid`
- ❌ `test email validation`
- ❌ `it works`

### Using Test Utilities

```typescript
// Use custom render function with providers
import { render, screen } from '@/__tests__/helpers/test-utils';

// Use mock data factory
import { mockUser, createMockUsers } from '@/__tests__/mocks/mockData';

// Setup user interactions
const user = userEvent.setup();
await user.click(button);
await user.type(input, 'text');
```

### Mocking

#### Mock Functions

```typescript
import { vi } from 'vitest';

const mockFn = vi.fn();
mockFn.mockReturnValue('value');
mockFn.mockResolvedValue(Promise.resolve('async value'));

expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
```

#### Mock Modules

```typescript
vi.mock('@/services/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));
```

#### Mock API Responses with MSW

```typescript
import { http, HttpResponse } from 'msw';
import { server } from '@/__tests__/mocks/server';

server.use(
  http.get('/api/users', () => {
    return HttpResponse.json({ users: [] });
  })
);
```

---

## Test Coverage

### Coverage Goals

- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%
- **Statements**: 80%

### Viewing Coverage

```bash
# Generate coverage report
npm run test:coverage

# View HTML report
open coverage/index.html
```

### Coverage Configuration

Coverage thresholds are configured in `vitest.config.ts`:

```typescript
coverage: {
  provider: 'v8',
  reporter: ['text', 'json', 'html', 'lcov'],
  thresholds: {
    branches: 80,
    functions: 80,
    lines: 80,
    statements: 80,
  },
}
```

### What to Exclude from Coverage

- Configuration files
- Type definitions
- Test files themselves
- Generated code
- Third-party code

---

## Best Practices

### General Testing Best Practices

1. **Test user behavior, not implementation details**

   ```typescript
   // ❌ Bad - Testing implementation
   expect(component.state.isOpen).toBe(true);

   // ✅ Good - Testing behavior
   expect(screen.getByRole('dialog')).toBeVisible();
   ```

2. **Use accessible queries**

   ```typescript
   // Preferred query order:
   screen.getByRole('button', { name: /submit/i });
   screen.getByLabelText('Email');
   screen.getByPlaceholderText('Enter email');
   screen.getByText('Welcome');
   screen.getByTestId('custom-element'); // Last resort
   ```

3. **Avoid testing third-party libraries**
   - Trust that libraries like React Router work correctly
   - Test your integration with them, not their functionality

4. **Keep tests independent**
   - Each test should run in isolation
   - Don't depend on test execution order
   - Clean up after each test

5. **Use descriptive test names**
   - Test names should read like documentation
   - Someone should understand what the code does by reading test names

6. **Don't test everything**
   - Focus on critical paths and complex logic
   - Simple getters/setters may not need tests
   - Balance coverage with maintainability

### Component Testing Best Practices

1. **Test component contracts, not internals**

   ```typescript
   // ✅ Test props and callbacks
   const onSubmit = vi.fn();
   render(<Form onSubmit={onSubmit} />);
   // Submit form and verify onSubmit was called
   ```

2. **Use user-event over fireEvent**

   ```typescript
   // ❌ Avoid fireEvent
   fireEvent.click(button);

   // ✅ Use userEvent
   const user = userEvent.setup();
   await user.click(button);
   ```

3. **Wait for async updates**

   ```typescript
   await waitFor(() => {
     expect(screen.getByText('Loaded')).toBeInTheDocument();
   });
   ```

4. **Test loading and error states**

   ```typescript
   it('should show loading state', () => {
     render(<Component isLoading />);
     expect(screen.getByText('Loading...')).toBeInTheDocument();
   });

   it('should show error state', () => {
     render(<Component error="Failed to load" />);
     expect(screen.getByText('Failed to load')).toBeInTheDocument();
   });
   ```

### Integration Testing Best Practices

1. **Test realistic scenarios**
   - Simulate actual user workflows
   - Test interactions between components and services

2. **Use MSW for API mocking**
   - More realistic than mocking axios directly
   - Intercepts network requests at the network level

3. **Test error scenarios**
   - Network errors
   - Validation errors
   - Unauthorized access

---

## Continuous Integration

### GitHub Actions

Tests run automatically on every push and pull request:

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:coverage
```

### Pre-commit Hooks

Tests run before each commit using Husky:

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged && npm test"
    }
  }
}
```

---

## Troubleshooting

### Common Issues

#### Tests Failing Randomly

**Problem**: Tests pass sometimes and fail other times

**Solutions**:

- Avoid testing implementation details
- Use proper async handling (`waitFor`, `await`)
- Clear mocks between tests
- Check for race conditions

#### Slow Tests

**Problem**: Test suite takes too long to run

**Solutions**:

- Mock heavy operations (API calls, file I/O)
- Use `test.concurrent` for independent tests
- Optimize setup/teardown
- Run E2E tests separately from unit tests

#### Coverage Not Meeting Thresholds

**Problem**: Code coverage below configured thresholds

**Solutions**:

- Identify uncovered code with `npm run test:coverage`
- Focus on critical paths first
- Exclude non-essential files from coverage
- Write targeted tests for gaps

### Getting Help

- Check [Vitest Documentation](https://vitest.dev/)
- Check [Testing Library Documentation](https://testing-library.com/)
- Review existing tests for patterns
- Ask team members for guidance

---

## Additional Resources

- [Testing Library Cheat Sheet](https://testing-library.com/docs/react-testing-library/cheatsheet/)
- [Vitest API Reference](https://vitest.dev/api/)
- [MSW Documentation](https://mswjs.io/docs/)
- [Kent C. Dodds - Common Testing Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

## Conclusion

Good tests provide confidence that your code works as expected and help prevent regressions. Follow these guidelines to write effective, maintainable tests that add value to the project.

Remember: **The goal is not 100% coverage, but confidence in your code.**
