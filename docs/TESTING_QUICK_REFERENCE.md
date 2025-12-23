# Testing Quick Reference Card

## 🚀 Quick Commands

```bash
# Run all tests
npm test

# Watch mode (recommended for development)
npm run test:watch

# With coverage
npm run test:coverage

# With UI
npm run test:ui

# Unit tests only
npm run test:unit

# Integration tests only
npm run test:integration


# E2E tests (headless)
npm run test:e2e:headless

# All tests (unit + integration)
npm run test:all

# Full validation (type-check + lint + format + tests)
npm run validate
```

## 📁 Where to Put Tests

| Test Type   | Location                     | Example                      |
| ----------- | ---------------------------- | ---------------------------- |
| Unit        | `src/__tests__/unit/`        | `components/Button.test.tsx` |
| Integration | `src/__tests__/integration/` | `api-integration.test.ts`    |

## 🧪 Test Templates

### Unit Test

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@/__tests__/helpers/test-utils';

describe('ComponentName', () => {
  it('should render successfully', () => {
    render(<ComponentName />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### Integration Test

```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { api } from '@/services/api';
import { startServer, closeServer } from '@/__tests__/mocks/server';

beforeAll(() => startServer());
afterAll(() => closeServer());

describe('API Integration', () => {
  it('should fetch data', async () => {
    const data = await api.get('/api/endpoint');
    expect(data).toBeDefined();
  });
});
```

## 🔍 Common Queries (React Testing Library)

```typescript
// ✅ Preferred (accessible)
screen.getByRole('button', { name: /submit/i });
screen.getByLabelText('Email');
screen.getByPlaceholderText('Enter email');
screen.getByText('Welcome');
screen.getByDisplayValue('John');

// ⚠️ Use when needed
screen.getByAltText('Logo');
screen.getByTitle('Close');

// ❌ Last resort
screen.getByTestId('custom-element');
```

## 🎭 User Interactions

```typescript
import { userEvent } from '@/__tests__/helpers/test-utils';

const user = userEvent.setup();

// Click
await user.click(element);

// Type
await user.type(input, 'text');

// Clear and type
await user.clear(input);
await user.type(input, 'new text');

// Select
await user.selectOptions(select, 'option-value');

// Upload file
await user.upload(input, file);

// Keyboard
await user.keyboard('{Enter}');
await user.keyboard('{Tab}');
```

## 🕐 Async Testing

```typescript
import { waitFor } from '@testing-library/react';

// Wait for element
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
});

// Wait for element to disappear
await waitFor(() => {
  expect(screen.queryByText('Loading')).not.toBeInTheDocument();
});

// With custom timeout
await waitFor(
  () => {
    expect(screen.getByText('Loaded')).toBeInTheDocument();
  },
  { timeout: 5000 }
);
```

## 🎯 Common Assertions

```typescript
// Existence
expect(element).toBeInTheDocument();
expect(element).not.toBeInTheDocument();

// Visibility
expect(element).toBeVisible();
expect(element).not.toBeVisible();

// Enabled/Disabled
expect(button).toBeEnabled();
expect(button).toBeDisabled();

// Values
expect(input).toHaveValue('text');
expect(checkbox).toBeChecked();

// Classes
expect(element).toHaveClass('active');

// Attributes
expect(element).toHaveAttribute('href', '/page');

// Text content
expect(element).toHaveTextContent('Welcome');

// Function calls
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
expect(mockFn).toHaveBeenCalledTimes(2);
```

## 🎪 Mock Data

```typescript
import {
  mockUser,
  mockAuthToken,
  createMockUsers,
  createMockApiResponse,
} from '@/__tests__/mocks/mockData';

// Use predefined mocks
const user = mockUser;
const token = mockAuthToken;

// Create custom mocks
const users = createMockUsers(10);
const response = createMockApiResponse(data);
```

## 🌐 MSW (API Mocking)

```typescript
import { http, HttpResponse } from 'msw';
import { server } from '@/__tests__/mocks/server';

// Override handler for specific test
server.use(
  http.get('/api/endpoint', () => {
    return HttpResponse.json({ data: 'custom' });
  })
);

// Simulate error
server.use(
  http.get('/api/endpoint', () => {
    return HttpResponse.error();
  })
);

// Simulate delay
server.use(
  http.get('/api/endpoint', async () => {
    await delay(1000);
    return HttpResponse.json({ data: 'delayed' });
  })
);
```

## 🧹 Setup/Teardown

```typescript
import { beforeEach, afterEach, beforeAll, afterAll } from 'vitest';

// Before all tests in file
beforeAll(() => {
  // One-time setup
});

// Before each test
beforeEach(() => {
  // Setup for each test
});

// After each test
afterEach(() => {
  // Cleanup after each test
  vi.clearAllMocks();
});

// After all tests in file
afterAll(() => {
  // One-time cleanup
});
```

## 🎨 Mock Functions

```typescript
import { vi } from 'vitest';

// Create mock
const mockFn = vi.fn();

// Mock return value
mockFn.mockReturnValue('value');

// Mock resolved promise
mockFn.mockResolvedValue('async value');

// Mock rejected promise
mockFn.mockRejectedValue(new Error('error'));

// Mock implementation
mockFn.mockImplementation((arg) => arg * 2);

// Clear mock
mockFn.mockClear();

// Reset mock
mockFn.mockReset();
```

## 🏷️ Test Patterns

### AAA Pattern

```typescript
it('should do something', async () => {
  // Arrange - Setup
  const user = userEvent.setup();
  render(<Component />);

  // Act - Perform action
  await user.click(screen.getByRole('button'));

  // Assert - Verify result
  expect(screen.getByText('Success')).toBeInTheDocument();
});
```

### Testing Loading States

```typescript
it('should show loading state', () => {
  render(<Component isLoading />);
  expect(screen.getByText('Loading...')).toBeInTheDocument();
});
```

### Testing Error States

```typescript
it('should show error', () => {
  render(<Component error="Failed to load" />);
  expect(screen.getByText('Failed to load')).toBeInTheDocument();
});
```

## 📊 Coverage

```bash
# Generate coverage
npm run test:coverage

# View HTML report
open coverage/index.html        # Mac/Linux
start coverage/index.html       # Windows
```

## 🎯 Coverage Thresholds

- Branches: 80%
- Functions: 80%
- Lines: 80%
- Statements: 80%

## ⚡ Performance Tips

1. Use `test.concurrent` for independent tests
2. Mock heavy operations
3. Avoid arbitrary waits
4. Use proper async handling
5. Clear mocks between tests

## 🐛 Debugging

```typescript
// Debug component
import { screen } from '@testing-library/react';

screen.debug(); // Print DOM
screen.logTestingPlaygroundURL(); // Get testing playground URL

// Vitest debugging
import { vi } from 'vitest';

vi.fn().mockImplementation((...args) => {
  console.log('Called with:', args);
});
```

## 📚 Resources

- **Vitest**: https://vitest.dev/
- **Testing Library**: https://testing-library.com/
- **MSW**: https://mswjs.io/

## 🆘 Common Issues

| Issue           | Solution                                    |
| --------------- | ------------------------------------------- |
| Test not found  | Check file naming: `*.test.ts(x)`           |
| Import errors   | Check path aliases in `vitest.config.ts`    |
| MSW not working | Verify `startServer()` in `beforeAll`       |
| Flaky tests     | Use `waitFor` for async, avoid `setTimeout` |
| Coverage low    | Check excluded files, add targeted tests    |

## 💡 Tips

- ✅ Test behavior, not implementation
- ✅ Use accessible queries
- ✅ Keep tests independent
- ✅ Write descriptive test names
- ✅ Mock external dependencies
- ✅ Clean up after tests
- ✅ Use AAA pattern
- ❌ Don't test third-party libraries
- ❌ Don't use arbitrary timeouts
- ❌ Don't share state between tests

---

**Full Documentation**: See `docs/TESTING.md`
**Setup Guide**: See `docs/TEST_SETUP_CHECKLIST.md`
