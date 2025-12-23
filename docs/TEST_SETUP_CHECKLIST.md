# Test Setup Checklist

This checklist helps new developers set up and verify the testing environment for the Subaccount Frontend project.

## Prerequisites

Before starting, ensure you have:

- [ ] Node.js >= 18.0.0 installed
- [ ] npm >= 9.0.0 installed
- [ ] Git installed and configured
- [ ] Project cloned and dependencies installed (`npm install`)

## Installation Verification

### 1. Verify Dependencies

Run the following command and ensure no errors:

```bash
npm list vitest @testing-library/react @testing-library/user-event cypress msw
```

Expected output should show all packages installed without errors.

### 2. Verify Test Configuration

Check that the following configuration files exist:

- [ ] `vitest.config.ts` - Vitest configuration
- [ ] `src/setupTests.ts` - Test setup file
- [ ] `.github/workflows/test.yml` - CI/CD workflow

### 3. Verify Test Directory Structure

Ensure the following directories exist:

- [ ] `src/__tests__/` - Main test directory
- [ ] `src/__tests__/unit/` - Unit tests
- [ ] `src/__tests__/integration/` - Integration tests
- [ ] `src/__tests__/helpers/` - Test utilities
- [ ] `src/__tests__/mocks/` - Mock data and handlers

## Running Tests

### Unit Tests

- [ ] Run all unit tests: `npm test`
- [ ] Verify tests pass
- [ ] Run tests in watch mode: `npm run test:watch`
- [ ] Press 'q' to quit watch mode

### Integration Tests

- [ ] Run integration tests: `npm run test:integration`
- [ ] Verify MSW handlers are working
- [ ] Check API mocking is functional

### Coverage Report

- [ ] Generate coverage report: `npm run test:coverage`
- [ ] Open coverage report: `open coverage/index.html` (Mac/Linux) or `start coverage/index.html` (Windows)
- [ ] Verify coverage meets thresholds:
  - Branches: 80%
  - Functions: 80%
  - Lines: 80%
  - Statements: 80%

### Test UI (Optional)

- [ ] Run Vitest UI: `npm run test:ui`
- [ ] Navigate to `http://localhost:51204` (or provided URL)
- [ ] Explore test results in browser UI
- [ ] Close UI with Ctrl+C

## Writing Your First Test

### Unit Test Example

Create a new file: `src/__tests__/unit/example.test.ts`

```typescript
import { describe, it, expect } from 'vitest';

describe('Example Test', () => {
  it('should pass basic assertion', () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] Create the file
- [ ] Run `npm test`
- [ ] Verify your test appears and passes

### Component Test Example

Create a new file: `src/__tests__/unit/components/example.test.tsx`

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@/__tests__/helpers/test-utils';

const TestComponent = () => <div>Hello Test</div>;

describe('TestComponent', () => {
  it('should render text', () => {
    render(<TestComponent />);
    expect(screen.getByText('Hello Test')).toBeInTheDocument();
  });
});
```

- [ ] Create the file
- [ ] Run `npm test`
- [ ] Verify your component test passes

### Integration Test Example

Create a new file: `src/__tests__/integration/example-integration.test.ts`

```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { api } from '@/services/api';
import { startServer, closeServer } from '@/__tests__/mocks/server';

beforeAll(() => startServer());
afterAll(() => closeServer());

describe('API Integration Example', () => {
  it('should fetch health status', async () => {
    const health = await api.get('/api/health');
    expect(health).toBeDefined();
    expect(health.status).toBe('healthy');
  });
});
```

- [ ] Create the file
- [ ] Run `npm run test:integration`
- [ ] Verify MSW is intercepting the request
- [ ] Check test passes

- [ ] Create the file
- [ ] Start dev server: `npm start`
- [ ] Find and run your test in Cypress UI
- [ ] Verify test passes

## Common Issues and Solutions

### Issue: Tests not found

**Solution:**

- Check test file naming: `*.test.ts`, `*.test.tsx`, `*.spec.ts`, `*.spec.tsx`
- Run `npm test -- --reporter=verbose` to see what Vitest is finding

### Issue: Import errors in tests

**Solution:**

- Check path aliases in `vitest.config.ts`
- Verify `tsconfig.json` paths match
- Use correct import syntax: `@/__tests__/helpers/test-utils`
- Clear cache: `rm -rf node_modules/.vitest`

### Issue: MSW handlers not working

**Solution:**

- Verify server is started in test setup: `beforeAll(() => startServer())`
- Check handler URLs match your API calls
- Reset handlers between tests: `afterEach(() => server.resetHandlers())`
- Review `src/__tests__/mocks/handlers.ts`

### Issue: Flaky tests

**Solution:**

- Use `waitFor` for async operations
- Avoid arbitrary timeouts (`setTimeout`)
- Clear mocks between tests: `vi.clearAllMocks()`
- Check for race conditions

### Issue: Coverage not generated

**Solution:**

- Run with coverage flag: `npm run test:coverage`
- Check `vitest.config.ts` coverage configuration
- Verify `@vitest/coverage-v8` is installed
- Clear coverage directory: `rm -rf coverage`

## Continuous Integration

### Verify CI Setup

- [ ] Check `.github/workflows/test.yml` exists
- [ ] Push a test commit to a branch
- [ ] Create a pull request
- [ ] Verify GitHub Actions runs tests automatically
- [ ] Check all CI jobs pass:
  - Unit & Integration Tests
  - Build Test
  - Code Quality
  - Security Audit

### Pre-commit Hooks

- [ ] Make a change to a file
- [ ] Stage the file: `git add .`
- [ ] Commit: `git commit -m "test"`
- [ ] Verify pre-commit hooks run:
  - Linting
  - Formatting
  - Type checking
- [ ] If hooks fail, fix issues and try again

## Documentation Review

Read the following documentation:

- [ ] [TESTING.md](./TESTING.md) - Comprehensive testing guide
- [ ] [Test Directory README](../src/__tests__/README.md) - Quick reference
- [ ] Review existing test files for patterns
- [ ] Check Vitest documentation: https://vitest.dev/
- [ ] Check Testing Library docs: https://testing-library.com/
- [ ] Check Cypress docs: https://docs.cypress.io/

## Best Practices Checklist

When writing tests, ensure you:

- [ ] Follow AAA pattern (Arrange, Act, Assert)
- [ ] Use descriptive test names
- [ ] Test behavior, not implementation
- [ ] Keep tests independent
- [ ] Use accessible queries (getByRole, getByLabelText)
- [ ] Mock external dependencies
- [ ] Clean up after tests
- [ ] Write tests that provide confidence
- [ ] Don't test third-party libraries
- [ ] Keep tests maintainable

## Team Collaboration

- [ ] Ask team members about testing conventions
- [ ] Review pull requests with tests
- [ ] Share testing tips and patterns
- [ ] Report flaky tests immediately
- [ ] Suggest improvements to testing infrastructure
- [ ] Help maintain test documentation

## Quick Reference Commands

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch

# Run full validation
npm run validate

# Open coverage report (Mac/Linux)
open coverage/index.html

# Open coverage report (Windows)
start coverage/index.html
```

## Completion

Once you've completed all items in this checklist:

- [ ] Mark all checkboxes as complete
- [ ] You're ready to write tests!
- [ ] Start with simple tests and gradually increase complexity
- [ ] Ask for code reviews on your tests
- [ ] Keep learning and improving

## Need Help?

If you're stuck:

1. Check documentation in `docs/TESTING.md`
2. Look at existing tests for examples
3. Ask team members for guidance
4. Create an issue if you find problems
5. Refer to official documentation

## Resources

- **Vitest**: https://vitest.dev/
- **Testing Library**: https://testing-library.com/
- **MSW**: https://mswjs.io/
- **Testing Best Practices**: https://kentcdodds.com/blog/common-mistakes-with-react-testing-library

---

**Congratulations!** You've completed the test setup. Happy testing! 🎉
