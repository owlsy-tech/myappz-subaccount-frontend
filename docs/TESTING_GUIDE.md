# Testing Guide

Comprehensive guide for writing and maintaining tests in this project. This document covers testing strategies, best practices, common patterns, and team testing standards.

## Table of Contents

- [Testing Philosophy](#testing-philosophy)
- [Testing Stack](#testing-stack)
- [Unit Testing](#unit-testing)
- [Integration Testing](#integration-testing)
- [Testing Best Practices](#testing-best-practices)
- [Common Testing Patterns](#common-testing-patterns)
- [Mocking Strategies](#mocking-strategies)
- [Coverage Requirements](#coverage-requirements)
- [Performance Testing](#performance-testing)
- [Accessibility Testing](#accessibility-testing)
- [Troubleshooting Tests](#troubleshooting-tests)

---

## Testing Philosophy

### Test Pyramid

We follow the testing pyramid approach:

```
        /\Integration Tests (30%)
       /  \      - Component interactions
      /____\     - API integration
     /      \
    /        \   Unit Tests (60%)
   /          \  - Pure functions
  /____________\ - Components
                 - Utilities



```

### Core Principles

1. **Test Behavior, Not Implementation**
   - Test what users see and do
   - Avoid testing internal state
   - Focus on inputs and outputs

2. **Write Tests First (TDD)**
   - Write failing test
   - Write minimal code to pass
   - Refactor with confidence

3. **Keep Tests Simple**
   - One assertion per test (when possible)
   - Clear test names
   - Easy to understand and maintain

4. **Tests Should Be Fast**
   - Unit tests: < 100ms each
   - Integration tests: < 500ms each

5. **Tests Should Be Isolated**
   - No shared state between tests
   - Each test can run independently
   - Order doesn't matter

---

## Testing Stack

### Tools & Libraries

- **Vitest** - Fast test runner and assertion library
- **React Testing Library** - Component testing
- **@testing-library/user-event** - User interaction simulation
- **@testing-library/jest-dom** - Custom DOM matchers
- **MSW** (Mock Service Worker) - API mocking (optional)

### Configuration Files

- `vitest.config.ts` - Vitest configuration
- `src/setupTests.ts` - Test setup and global mocks

---

## Unit Testing

### What to Unit Test

✅ **Always Test:**

- Pure functions and utilities
- Component rendering
- User interactions
- Conditional rendering
- Error states
- Loading states
- Form validation
- State management
- Custom hooks

❌ **Don't Test:**

- Third-party libraries
- Browser APIs
- Implementation details
- CSS styles
- Trivial code

### Component Testing

#### Basic Rendering Test

```typescript
import { render, screen } from '@testing-library/react';
import Button from './Button';

describe('Button', () => {
  it('should render with correct text', () => {
    render(<Button>Click Me</Button>);

    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });
});
```

#### Testing Props

```typescript
it('should display loading state', () => {
  render(<Button loading>Submit</Button>);

  expect(screen.getByRole('button')).toBeDisabled();
  expect(screen.getByText('Loading...')).toBeInTheDocument();
});

it('should be disabled when disabled prop is true', () => {
  render(<Button disabled>Submit</Button>);

  expect(screen.getByRole('button')).toBeDisabled();
});
```

#### Testing User Interactions

```typescript
import userEvent from '@testing-library/user-event';

it('should call onClick when clicked', async () => {
  const user = userEvent.setup();
  const handleClick = vi.fn();

  render(<Button onClick={handleClick}>Click Me</Button>);

  await user.click(screen.getByRole('button'));

  expect(handleClick).toHaveBeenCalledTimes(1);
});

it('should handle keyboard interaction', async () => {
  const user = userEvent.setup();
  const handleClick = vi.fn();

  render(<Button onClick={handleClick}>Click Me</Button>);

  const button = screen.getByRole('button');
  button.focus();
  await user.keyboard('{Enter}');

  expect(handleClick).toHaveBeenCalled();
});
```

#### Testing Conditional Rendering

```typescript
it('should render error message when error prop is provided', () => {
  render(<Form error="Invalid input" />);

  expect(screen.getByRole('alert')).toBeInTheDocument();
  expect(screen.getByText('Invalid input')).toBeInTheDocument();
});

it('should not render error when no error prop', () => {
  render(<Form />);

  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});
```

#### Testing Async Operations

```typescript
import { waitFor } from '@testing-library/react';

it('should fetch and display user data', async () => {
  const mockUser = { id: '1', name: 'John Doe' };

  // Mock API call
  vi.spyOn(api, 'get').mockResolvedValue(mockUser);

  render(<UserProfile userId="1" />);

  // Loading state
  expect(screen.getByText('Loading...')).toBeInTheDocument();

  // Wait for data to load
  await waitFor(() => {
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  // Verify API was called
  expect(api.get).toHaveBeenCalledWith('/users/1');
});

it('should handle API errors gracefully', async () => {
  // Mock API error
  vi.spyOn(api, 'get').mockRejectedValue(new Error('Network error'));

  render(<UserProfile userId="1" />);

  await waitFor(() => {
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });
});
```

### Testing Custom Hooks

```typescript
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

describe('useCounter', () => {
  it('should initialize with default value', () => {
    const { result } = renderHook(() => useCounter(0));

    expect(result.current.count).toBe(0);
  });

  it('should increment counter', () => {
    const { result } = renderHook(() => useCounter(0));

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });

  it('should decrement counter', () => {
    const { result } = renderHook(() => useCounter(5));

    act(() => {
      result.current.decrement();
    });

    expect(result.current.count).toBe(4);
  });

  it('should reset counter', () => {
    const { result } = renderHook(() => useCounter(5));

    act(() => {
      result.current.increment();
      result.current.increment();
    });

    expect(result.current.count).toBe(7);

    act(() => {
      result.current.reset();
    });

    expect(result.current.count).toBe(5);
  });
});
```

### Testing Utilities

```typescript
// src/utils/formatters.test.ts
import { formatCurrency, formatDate, formatPhone } from './formatters';

describe('formatters', () => {
  describe('formatCurrency', () => {
    it('should format number as currency', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
    });

    it('should handle zero', () => {
      expect(formatCurrency(0)).toBe('$0.00');
    });

    it('should handle negative numbers', () => {
      expect(formatCurrency(-123.45)).toBe('-$123.45');
    });

    it('should round to 2 decimal places', () => {
      expect(formatCurrency(123.456789)).toBe('$123.46');
    });
  });

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2024-01-15T12:00:00Z');
      expect(formatDate(date)).toBe('January 15, 2024');
    });

    it('should handle invalid dates', () => {
      expect(formatDate(new Date('invalid'))).toBe('Invalid Date');
    });
  });
});
```

---

## Integration Testing

### Component Integration

#### Testing Component with Context

```typescript
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import UserDashboard from './UserDashboard';

const renderWithRouter = (component: React.ReactElement) => {
  return render(component, { wrapper: BrowserRouter });
};

describe('UserDashboard Integration', () => {
  it('should integrate with router and display user data', async () => {
    renderWithRouter(<UserDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });
  });
});
```

#### Testing Component with Store

```typescript
import { render, screen, act } from '@testing-library/react';
import { useUserStore } from '@store/useUserStore';
import UserProfile from './UserProfile';

describe('UserProfile with Store', () => {
  beforeEach(() => {
    // Reset store
    act(() => {
      useUserStore.getState().logout();
    });
  });

  it('should display user from store', () => {
    // Set user in store
    act(() => {
      useUserStore.getState().setUser(mockUser);
    });

    render(<UserProfile />);

    expect(screen.getByText(mockUser.name)).toBeInTheDocument();
  });
});
```

### API Integration Testing

```typescript
import { productService } from './productService';
import { api } from './api';

vi.mock('./api');

describe('productService Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch products and handle response', async () => {
    const mockProducts = [
      { id: '1', name: 'Product 1', price: 100 },
      { id: '2', name: 'Product 2', price: 200 },
    ];

    (api.get as ReturnType<typeof vi.fn>).mockResolvedValue(mockProducts);

    const result = await productService.getAll();

    expect(api.get).toHaveBeenCalledWith('/products');
    expect(result).toEqual(mockProducts);
    expect(result).toHaveLength(2);
  });

  it('should handle API errors', async () => {
    const error = {
      message: 'Network Error',
      status: 500,
    };

    (api.get as ReturnType<typeof vi.fn>).mockRejectedValue(error);

    await expect(productService.getAll()).rejects.toEqual(error);
  });
});
```

---

## Testing Best Practices

### 1. Test Naming Conventions

```typescript
// ✅ GOOD - Descriptive and clear
describe('UserProfile', () => {
  it('should display user name when user is logged in', () => {});
  it('should show login prompt when user is not logged in', () => {});
  it('should handle API errors gracefully', () => {});
});

// ❌ BAD - Vague and unclear
describe('UserProfile', () => {
  it('works', () => {});
  it('test 1', () => {});
  it('should render', () => {}); // Too generic
});
```

### 2. Arrange-Act-Assert Pattern

```typescript
it('should increment counter when button is clicked', async () => {
  // ARRANGE - Set up test data and render
  const user = userEvent.setup();
  render(<Counter initialValue={0} />);

  // ACT - Perform action
  await user.click(screen.getByRole('button', { name: 'Increment' }));

  // ASSERT - Verify result
  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});
```

### 3. Use Testing Library Queries Correctly

**Query Priority (in order of preference):**

1. `getByRole` - Most accessible
2. `getByLabelText` - Form elements
3. `getByPlaceholderText` - Inputs
4. `getByText` - Non-interactive elements
5. `getByDisplayValue` - Form elements
6. `getByAltText` - Images
7. `getByTitle` - Less preferred
8. `getByTestId` - Last resort

```typescript
// ✅ GOOD - Using accessible queries
screen.getByRole('button', { name: 'Submit' });
screen.getByLabelText('Email');
screen.getByText('Welcome');

// ❌ BAD - Using test IDs unnecessarily
screen.getByTestId('submit-button');
screen.getByTestId('email-input');
```

### 4. Async Testing

```typescript
import { waitFor, waitForElementToBeRemoved } from '@testing-library/react';

it('should load data asynchronously', async () => {
  render(<AsyncComponent />);

  // Wait for loading to disappear
  await waitForElementToBeRemoved(() => screen.getByText('Loading...'));

  // Or wait for element to appear
  await waitFor(() => {
    expect(screen.getByText('Data loaded')).toBeInTheDocument();
  });
});

it('should handle async errors', async () => {
  vi.spyOn(api, 'get').mockRejectedValue(new Error('API Error'));

  render(<AsyncComponent />);

  await waitFor(() => {
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });
});
```

### 5. Testing Forms

```typescript
describe('RegistrationForm', () => {
  it('should submit form with valid data', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<RegistrationForm onSubmit={onSubmit} />);

    // Fill form
    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.type(screen.getByLabelText('Password'), 'SecurePass123!');
    await user.type(screen.getByLabelText('Confirm Password'), 'SecurePass123!');
    await user.click(screen.getByLabelText('Accept Terms'));

    // Submit
    await user.click(screen.getByRole('button', { name: 'Register' }));

    // Verify
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'SecurePass123!',
        confirmPassword: 'SecurePass123!',
        acceptTerms: true,
      });
    });
  });

  it('should show validation errors for invalid data', async () => {
    const user = userEvent.setup();

    render(<RegistrationForm />);

    // Submit empty form
    await user.click(screen.getByRole('button', { name: 'Register' }));

    // Should be disabled or show errors
    expect(screen.getByRole('button', { name: 'Register' })).toBeDisabled();
  });

  it('should validate password confirmation match', async () => {
    const user = userEvent.setup();

    render(<RegistrationForm />);

    await user.type(screen.getByLabelText('Password'), 'SecurePass123!');
    await user.type(screen.getByLabelText('Confirm Password'), 'DifferentPass123!');
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    });
  });
});
```

---

## Common Testing Patterns

### Pattern 1: Testing Loading States

```typescript
it('should show loading spinner while fetching data', async () => {
  // Mock slow API
  vi.spyOn(api, 'get').mockImplementation(
    () => new Promise((resolve) => setTimeout(resolve, 1000))
  );

  render(<DataComponent />);

  expect(screen.getByRole('status')).toBeInTheDocument();
  expect(screen.getByText('Loading...')).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });
});
```

### Pattern 2: Testing Error Boundaries

```typescript
import { ErrorBoundary } from '@components/ErrorBoundary';

const ThrowError = () => {
  throw new Error('Test error');
};

it('should catch and display errors', () => {
  // Suppress console errors in tests
  vi.spyOn(console, 'error').mockImplementation(() => {});

  render(
    <ErrorBoundary>
      <ThrowError />
    </ErrorBoundary>
  );

  expect(screen.getByText('Something went wrong')).toBeInTheDocument();

  console.error.mockRestore();
});
```

### Pattern 3: Testing Routes

```typescript
import { MemoryRouter } from 'react-router-dom';

it('should render home page on root route', () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>
  );

  expect(screen.getByText('Home Page')).toBeInTheDocument();
});

it('should render 404 page for unknown routes', () => {
  render(
    <MemoryRouter initialEntries={['/unknown-route']}>
      <App />
    </MemoryRouter>
  );

  expect(screen.getByText('Page Not Found')).toBeInTheDocument();
});
```

### Pattern 4: Testing with Timers

```typescript
describe('Countdown Timer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should countdown from 10 to 0', () => {
    render(<CountdownTimer seconds={10} />);

    expect(screen.getByText('10')).toBeInTheDocument();

    // Fast-forward 5 seconds
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(screen.getByText('5')).toBeInTheDocument();

    // Fast-forward remaining time
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('Time is up!')).toBeInTheDocument();
  });
});
```

### Pattern 5: Testing Accessibility

```typescript
it('should have proper ARIA attributes', () => {
  render(<Modal isOpen title="Confirm Action" />);

  const modal = screen.getByRole('dialog');
  expect(modal).toHaveAttribute('aria-modal', 'true');
  expect(modal).toHaveAttribute('aria-labelledby');

  expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
});

it('should be keyboard navigable', async () => {
  const user = userEvent.setup();
  const onClose = vi.fn();

  render(<Modal isOpen onClose={onClose} />);

  // Press Escape to close
  await user.keyboard('{Escape}');

  expect(onClose).toHaveBeenCalled();
});

it('should trap focus within modal', async () => {
  const user = userEvent.setup();

  render(<Modal isOpen />);

  const closeButton = screen.getByRole('button', { name: 'Close' });
  const confirmButton = screen.getByRole('button', { name: 'Confirm' });

  closeButton.focus();
  await user.tab();

  expect(confirmButton).toHaveFocus();

  await user.tab();

  // Should cycle back to close button
  expect(closeButton).toHaveFocus();
});
```

---

## Mocking Strategies

### Mocking API Calls

```typescript
// Mock entire module
vi.mock('@services/api');

// Mock specific method
vi.spyOn(api, 'get').mockResolvedValue(mockData);
vi.spyOn(api, 'post').mockRejectedValue(new Error('API Error'));

// Mock with different responses
vi.spyOn(api, 'get')
  .mockResolvedValueOnce(firstResponse)
  .mockResolvedValueOnce(secondResponse)
  .mockRejectedValueOnce(new Error('Error'));
```

### Mocking Hooks

```typescript
vi.mock('@hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

// In test
const mockUseAuth = useAuth as ReturnType<typeof vi.fn>;

mockUseAuth.mockReturnValue({
  user: mockUser,
  login: vi.fn(),
  logout: vi.fn(),
  isAuthenticated: true,
});
```

### Mocking Router

```typescript
vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')),
  useNavigate: () => vi.fn(),
  useParams: () => ({ id: '123' }),
  useLocation: () => ({ pathname: '/test' }),
}));
```

### Mocking Local Storage

```typescript
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// In test
it('should save to localStorage', () => {
  // Your test
  expect(localStorageMock.setItem).toHaveBeenCalledWith('key', 'value');
});
```

### Mocking Date/Time

```typescript
describe('DateComponent', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-01T00:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should display current date', () => {
    render(<DateComponent />);
    expect(screen.getByText('January 1, 2024')).toBeInTheDocument();
  });
});
```

---

## Coverage Requirements

### Minimum Coverage Thresholds

All code must meet these minimum coverage requirements:

- **Statements:** 80%
- **Branches:** 80%
- **Functions:** 80%
- **Lines:** 80%

### Coverage Exclusions

These files are excluded from coverage requirements:

- `src/index.tsx` - Entry point
- `src/setupTests.ts` - Test configuration
- `src/react-app-env.d.ts` - Type definitions
- `*.stories.tsx` - Storybook stories
- `*.d.ts` - Type definition files

### Checking Coverage

```bash
# Run tests with coverage
npm run test:coverage

# View coverage report
open coverage/lcov-report/index.html

# Check specific file coverage
npm run test:coverage -- src/components/Button/Button.tsx
```

### Coverage Reports

**Generated reports:**

- `coverage/lcov-report/index.html` - HTML report (open in browser)
- `coverage/lcov.info` - LCOV format (for CI tools)
- `coverage/coverage-final.json` - JSON format
- `coverage/clover.xml` - Clover format (for SonarQube)

### Improving Coverage

**Find Uncovered Code:**

```bash
# See coverage summary in terminal
npm run test:coverage

# Look for red/yellow highlighted lines in HTML report
open coverage/lcov-report/index.html
```

**Add Missing Tests:**

```typescript
// If coverage shows branch not tested:
if (condition) {
  // Not tested
}

// Add test:
it('should handle condition when true', () => {
  // Test with condition = true
});

it('should handle condition when false', () => {
  // Test with condition = false
});
```

---

## Performance Testing

### Measuring Component Performance

```typescript
import { renderHook } from '@testing-library/react';
import { usePerformanceMonitor } from '@hooks';

describe('Performance Tests', () => {
  it('should render within acceptable time', () => {
    const startTime = performance.now();

    render(<ComplexComponent />);

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    expect(renderTime).toBeLessThan(50); // Should render in < 50ms
  });
});
```

### Testing Memoization

```typescript
it('should not re-render when props do not change', () => {
  const { rerender } = render(<MemoizedComponent value="test" />);

  const firstRender = screen.getByText('test');

  // Re-render with same props
  rerender(<MemoizedComponent value="test" />);

  const secondRender = screen.getByText('test');

  // Should be same element (not re-rendered)
  expect(firstRender).toBe(secondRender);
});
```

### Memory Leak Tests

```typescript
describe('Memory Leak Tests', () => {
  it('should clean up timers on unmount', () => {
    vi.spyOn(global, 'clearInterval');

    const { unmount } = render(<ComponentWithInterval />);

    unmount();

    expect(clearInterval).toHaveBeenCalled();
  });

  it('should remove event listeners on unmount', () => {
    const removeEventListener = vi.spyOn(window, 'removeEventListener');

    const { unmount } = render(<ComponentWithListener />);

    unmount();

    expect(removeEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
  });
});
```

---

## Accessibility Testing

### Manual Accessibility Checks

```typescript
describe('Accessibility', () => {
  it('should have proper heading hierarchy', () => {
    render(<Page />);

    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  });

  it('should have form labels', () => {
    render(<Form />);

    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('should have alt text for images', () => {
    render(<ImageGallery />);

    const images = screen.getAllByRole('img');
    images.forEach((img) => {
      expect(img).toHaveAttribute('alt');
      expect(img.getAttribute('alt')).not.toBe('');
    });
  });

  it('should have proper button types', () => {
    render(<Form />);

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    expect(submitButton).toHaveAttribute('type', 'submit');

    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    expect(cancelButton).toHaveAttribute('type', 'button');
  });
});
```

### Keyboard Navigation Testing

```typescript
describe('Keyboard Navigation', () => {
  it('should navigate through form with Tab key', async () => {
    const user = userEvent.setup();

    render(<Form />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Submit' });

    emailInput.focus();
    expect(emailInput).toHaveFocus();

    await user.tab();
    expect(passwordInput).toHaveFocus();

    await user.tab();
    expect(submitButton).toHaveFocus();
  });

  it('should submit form with Enter key', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<Form onSubmit={onSubmit} />);

    const emailInput = screen.getByLabelText('Email');
    await user.type(emailInput, 'test@example.com{Enter}');

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
    });
  });
});
```

### ARIA Testing

```typescript
it('should have proper ARIA attributes', () => {
  render(<Alert type="error" message="Error occurred" />);

  const alert = screen.getByRole('alert');
  expect(alert).toHaveAttribute('aria-live', 'assertive');
  expect(alert).toHaveAttribute('aria-atomic', 'true');
});

it('should have aria-label for icon buttons', () => {
  render(<IconButton icon="close" onClick={vi.fn()} />);

  const button = screen.getByRole('button');
  expect(button).toHaveAttribute('aria-label', expect.any(String));
});

it('should have aria-describedby for form errors', async () => {
  const user = userEvent.setup();

  render(<Input label="Email" />);

  const input = screen.getByLabelText('Email');
  await user.type(input, 'invalid');
  await user.tab();

  await waitFor(() => {
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby');
  });
});
```

---

## Troubleshooting Tests

### Common Test Failures

#### 1. "Unable to find element"

**Cause:** Element not rendered or wrong query

**Solution:**

```typescript
// Debug what's in the DOM
screen.debug();

// Or debug specific element
screen.debug(screen.getByTestId('container'));

// Check available roles
screen.logTestingPlaygroundURL();
```

#### 2. "Not wrapped in act(...)"

**Cause:** State update outside act()

**Solution:**

```typescript
// ❌ BAD
fireEvent.click(button);
// State updates happen

// ✅ GOOD
await user.click(button);
// or
act(() => {
  fireEvent.click(button);
});
```

#### 3. Tests Timeout

**Cause:** Async operation not resolving

**Solution:**

```typescript
// Increase timeout
it('should load data', async () => {
  // ...
}, 10000); // 10 second timeout

// Or use waitFor with timeout
await waitFor(
  () => {
    expect(screen.getByText('Data')).toBeInTheDocument();
  },
  { timeout: 5000 }
);
```

#### 4. Flaky Tests

**Causes:**

- Race conditions
- Timing issues
- External dependencies
- Shared state

**Solutions:**

```typescript
// Use waitFor for async operations
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
});

// Clear state between tests
beforeEach(() => {
  vi.clearAllMocks();
  cleanup();
});

// Mock random/time-dependent values
vi.spyOn(Math, 'random').mockReturnValue(0.5);
vi.setSystemTime(new Date('2024-01-01'));
```

### Test Debugging Tips

**1. Isolate Failing Test:**

```typescript
// Run only this test
it.only('should work', () => {
  // Test code
});

// Skip this test
it.skip('should work', () => {
  // Test code
});
```

**2. Add Debug Statements:**

```typescript
it('should work', async () => {
  render(<Component />);

  // See what's rendered
  screen.debug();

  // See current state
  console.log(screen.getByTestId('container').innerHTML);

  await user.click(button);

  // See what changed
  screen.debug();
});
```

**3. Check Test Coverage:**

```bash
# Run single test file with coverage
npm test -- Button.test.tsx --coverage --collectCoverageFrom=src/components/Button/**

# See what lines are not covered
```

---

## Testing Checklist

### Before Submitting PR

- [ ] All new code has tests
- [ ] All tests pass locally
- [ ] Coverage meets 80% threshold
- [ ] No skipped or disabled tests (without justification)
- [ ] Tests are meaningful (not just for coverage)
- [ ] Edge cases are tested
- [ ] Error scenarios are tested
- [ ] Async operations are tested
- [ ] Accessibility is tested (for UI components)
- [ ] Tests follow naming conventions
- [ ] Tests are well-organized
- [ ] Mock data is realistic
- [ ] No hardcoded values in tests
- [ ] Tests are maintainable

### Code Review - Testing Focus

When reviewing PRs, verify:

- [ ] Tests exist for all changes
- [ ] Tests are comprehensive
- [ ] Test names are descriptive
- [ ] Tests test behavior, not implementation
- [ ] Mocks are appropriate
- [ ] No duplicate test code
- [ ] Tests are readable
- [ ] Edge cases covered
- [ ] Error cases covered

---

## Quick Reference

### Jest Matchers

```typescript
// Equality
expect(value).toBe(expected); // Strict equality
expect(value).toEqual(expected); // Deep equality
expect(value).not.toBe(expected); // Negation

// Truthiness
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeNull();
expect(value).toBeUndefined();
expect(value).toBeDefined();

// Numbers
expect(value).toBeGreaterThan(3);
expect(value).toBeGreaterThanOrEqual(3);
expect(value).toBeLessThan(5);
expect(value).toBeLessThanOrEqual(5);
expect(value).toBeCloseTo(0.3, 1); // Floating point

// Strings
expect(string).toMatch(/regex/);
expect(string).toContain('substring');

// Arrays
expect(array).toContain(item);
expect(array).toHaveLength(3);

// Objects
expect(object).toHaveProperty('key');
expect(object).toMatchObject({ key: 'value' });

// Functions
expect(fn).toHaveBeenCalled();
expect(fn).toHaveBeenCalledTimes(2);
expect(fn).toHaveBeenCalledWith(arg1, arg2);
expect(fn).toHaveReturned();
expect(fn).toHaveReturnedWith(value);

// Promises
await expect(promise).resolves.toBe(value);
await expect(promise).rejects.toThrow(error);

// DOM (from @testing-library/jest-dom)
expect(element).toBeInTheDocument();
expect(element).toBeVisible();
expect(element).toBeDisabled();
expect(element).toHaveTextContent('text');
expect(element).toHaveAttribute('attr', 'value');
expect(element).toHaveClass('class-name');
expect(element).toHaveFocus();
```

### Testing Library Queries

```typescript
// get* - Throws error if not found
screen.getByRole('button');
screen.getByLabelText('Email');
screen.getByText('Hello');

// query* - Returns null if not found
screen.queryByRole('button');
screen.queryByText('Hello');

// find* - Returns promise, waits for element
await screen.findByRole('button');
await screen.findByText('Hello');

// *All variants - Return array
screen.getAllByRole('listitem');
screen.queryAllByRole('listitem');
await screen.findAllByRole('listitem');
```

### User Event API

```typescript
import userEvent from '@testing-library/user-event';

const user = userEvent.setup();

// Click
await user.click(element);
await user.dblClick(element);
await user.tripleClick(element);

// Type
await user.type(input, 'text to type');
await user.clear(input);

// Keyboard
await user.keyboard('{Enter}');
await user.keyboard('{Shift>}A{/Shift}'); // Shift+A
await user.tab();

// Select
await user.selectOptions(select, 'option1');

// Upload
await user.upload(input, file);

// Hover
await user.hover(element);
await user.unhover(element);
```

---

## Advanced Testing Topics

### Testing with React Context

```typescript
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthContext.Provider value={mockAuthValue}>
    <ThemeContext.Provider value={mockThemeValue}>
      {children}
    </ThemeContext.Provider>
  </AuthContext.Provider>
);

const renderWithContext = (component: React.ReactElement) => {
  return render(component, { wrapper: TestWrapper });
};

it('should use context value', () => {
  renderWithContext(<ComponentUsingContext />);
  expect(screen.getByText(mockAuthValue.user.name)).toBeInTheDocument();
});
```

### Snapshot Testing

```typescript
it('should match snapshot', () => {
  const { container } = render(<Component />);
  expect(container.firstChild).toMatchSnapshot();
});

// Update snapshots when intentional changes made:
// npm test -- -u
```

### Testing Error Scenarios

```typescript
describe('Error Handling', () => {
  it('should handle network errors', async () => {
    vi.spyOn(api, 'get').mockRejectedValue(new Error('Network error'));

    render(<DataComponent />);

    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument();
    });
  });

  it('should handle 404 errors', async () => {
    vi.spyOn(api, 'get').mockRejectedValue({
      response: { status: 404, data: { message: 'Not found' } },
    });

    render(<DataComponent />);

    await waitFor(() => {
      expect(screen.getByText(/not found/i)).toBeInTheDocument();
    });
  });
});
```

---

## CI/CD Integration

### Running Tests in CI

Tests run automatically in GitHub Actions:

```yaml
- name: Run tests with coverage
  run: npm run test:coverage
  env:
    CI: true

- name: Check coverage threshold
  run: |
    npm run test:coverage -- --coverageThreshold='{"global":{"branches":80,"functions":80,"lines":80,"statements":80}}'
```

### Coverage Reporting

Coverage reports are:

- Uploaded to Codecov
- Displayed in PR comments
- Fail PR if below threshold

### Test Failure Handling

**When Tests Fail in CI:**

1. Check the CI logs
2. Reproduce locally
3. Fix the issue
4. Verify fix with `npm run validate`
5. Push changes
6. Verify CI passes

---

## Resources

### Internal Resources

- Team Wiki: Testing Best Practices
- Example Tests: See `src/` directories
- Test Utilities: `src/utils/testUtils.ts`

### External Resources

- [Testing Library Docs](https://testing-library.com/)
- [Jest Documentation](https://jestjs.io/)
- [Kent C. Dodds - Common Testing Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

### Learning Resources

- [Testing JavaScript](https://testingjavascript.com/) by Kent C. Dodds
- [React Testing Library Tutorial](https://www.robinwieruch.de/react-testing-library/)

---

## Questions?

If you have questions about testing:

1. Check this guide
2. Review example tests in the codebase
3. Ask in `#testing` Slack channel
4. Consult with QA team
5. Pair with senior developer

---

**Remember: Good tests are an investment, not a cost. They save time and prevent bugs!** ✅

---

**Last Updated:** December 2025  
**Version:** 1.0.0  
**Maintained by:** QA Team & Team Lead
