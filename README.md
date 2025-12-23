# React TypeScript Boilerplate

A production-ready, enterprise-grade React TypeScript boilerplate with modern tooling, comprehensive testing, performance monitoring, and development best practices.

[![CI/CD Pipeline](https://github.com/yourusername/subaccount-frontend/workflows/CI/CD%20Pipeline/badge.svg)](https://github.com/yourusername/subaccount-frontend/actions)
[![codecov](https://codecov.io/gh/yourusername/subaccount-frontend/branch/main/graph/badge.svg)](https://codecov.io/gh/yourusername/subaccount-frontend)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-blue.svg)](https://reactjs.org/)

---

## 👥 **NEW TEAM MEMBER? START HERE!**

### 📚 Essential Documentation (Read in Order)

| Priority        | Document                                                  | Description                                      | Time   |
| --------------- | --------------------------------------------------------- | ------------------------------------------------ | ------ |
| 🔴 **CRITICAL** | [**QUICK_START.md**](docs/QUICK_START.md)                 | **Setup and first PR in 10 minutes**             | 10 min |
| 🔴 **CRITICAL** | [**TEAM_RULES.md**](docs/TEAM_RULES.md)                   | **Team standards, code review rules, workflows** | 30 min |
| 🟠 **HIGH**     | [**TEAM_RULES_SUMMARY.md**](docs/TEAM_RULES_SUMMARY.md)   | Quick reference card (print this!)               | 5 min  |
| 🟠 **HIGH**     | [**TEAM_ONBOARDING.md**](docs/TEAM_ONBOARDING.md)         | 30-60-90 day onboarding plan                     | 20 min |
| 🟡 **MEDIUM**   | [**DEVELOPMENT_GUIDE.md**](docs/DEVELOPMENT_GUIDE.md)     | Detailed development practices                   | 30 min |
| 🟡 **MEDIUM**   | [**TESTING_GUIDE.md**](docs/TESTING_GUIDE.md)             | Comprehensive testing strategies                 | 30 min |
| 🟢 **LOW**      | [**SECURITY.md**](docs/SECURITY.md)                       | Security policies & guidelines                   | 15 min |
| 🟢 **LOW**      | [**ENV_VARIABLES.md**](docs/ENV_VARIABLES.md)             | Environment variables reference                  | 10 min |
| 📋 **INDEX**    | [**DOCUMENTATION_INDEX.md**](docs/DOCUMENTATION_INDEX.md) | Complete documentation index                     | 5 min  |

### ⚡ Quick Rules (Zero Tolerance)

```
❌ NO console.log          ❌ NO 'any' types         ❌ NO unused code
❌ NO ESLint warnings      ✅ 80%+ test coverage     ✅ Reviews in 24h
✅ Run 'npm run validate' before every commit
```

**👉 Start with:** [QUICK_START.md](docs/QUICK_START.md) → [TEAM_RULES.md](docs/TEAM_RULES.md) → Ask in `#help`

---

## 🚀 Features

### Core Technology Stack

- **React 19.0** - Latest React with concurrent features and improved performance
- **TypeScript 5.6** - Strict type safety with modern TS features
- **React Router v6** - Declarative routing with data APIs
- **Zustand** - Lightweight state management (no Redux bloat)
- **Axios** - Promise-based HTTP client with interceptors

### Development Tools

- **ESLint + Airbnb Config** - Comprehensive linting rules
- **Prettier** - Consistent code formatting
- **Husky + lint-staged** - Pre-commit hooks for quality gates
- **TypeScript Strict Mode** - Maximum type safety

### Testing Suite

- **Vitest** - Lightning-fast unit and integration testing framework
- **React Testing Library** - Component testing with best practices
- **@vitest/ui** - Interactive test UI for enhanced debugging
- **@vitest/coverage-v8** - Fast and accurate code coverage
- **MSW (Mock Service Worker)** - API mocking for realistic tests
- **80%+ Code Coverage** - Comprehensive test coverage requirements

### Performance & Monitoring

- **Web Vitals Tracking** - FCP, LCP, FID, CLS, TTFB monitoring
- **Performance Profiler** - React Profiler integration
- **Memory Leak Detection** - Automatic detection of memory leaks
- **Performance Monitor Component** - Real-time metrics during development
- **Bundle Analysis** - Webpack bundle analyzer integration

### Form Validation

- **React Hook Form** - Performant forms with easy validation
- **Zod** - TypeScript-first schema validation
- **Comprehensive Validation Schemas** - Email, password, phone, etc.

### Quality Assurance

- **SonarQube Integration** - Code quality and security analysis
- **GitHub Actions CI/CD** - Automated testing and deployment
- **Codecov Integration** - Coverage reporting and tracking
- **Error Boundaries** - Graceful error handling
- **Centralized Logging** - Structured logging system

### Accessibility

- **WCAG 2.1 AA Compliant** - Accessibility best practices
- **ARIA Labels** - Proper semantic HTML and ARIA attributes
- **Keyboard Navigation** - Full keyboard accessibility
- **Screen Reader Support** - Optimized for assistive technologies

### Developer Experience

- **Hot Module Replacement** - Fast refresh during development
- **Code Splitting** - Lazy loading for optimal performance
- **Path Aliases** - Clean imports with @ prefix
- **Environment Variables** - Secure configuration management

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Testing](#testing)
- [Performance Monitoring](#performance-monitoring)
- [Deployment](#deployment)
- [Team Rules & Standards](#team-rules--standards)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 (or yarn/pnpm)
- **Git** >= 2.0.0

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/owlsy-tech/subaccount-frontend.git
   cd subaccount-frontend
   ```

2. **Install dependencies**

   ```bash
   npm ci
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your configuration:

   ```env
   VITE_API_BASE_URL=https://api.example.com
   VITE_APP_ENV=development
   VITE_VERSION=0.1.0
   ```

4. **Initialize Husky hooks**

   ```bash
   npm run prepare
   ```

5. **Start the development server**
   ```bash
   npm start
   ```

The application will open at [http://localhost:3000](http://localhost:3000)

## 🛣️ Routing

This project uses a **centralized routing configuration** to keep routes organized and maintainable.

### Adding a New Route

**You should NEVER modify `App.tsx` to add routes.** Instead, add them to `src/routes/config.tsx`:

1. **Import your page component (lazy-loaded):**

   ```typescript
   const MyNewPage = lazy(() => import('../pages/MyNewPage'));
   ```

2. **Add to the appropriate routes array:**
   ```typescript
   export const appRoutes: RouteConfig[] = [
     // ... existing routes
     {
       path: '/my-new-page',
       element: MyNewPage,
       title: 'My New Page',
       description: 'Description of my page',
     },
   ];
   ```

That's it! Your route is now active.

### Route Categories

- **`appRoutes`** - General application routes (home, about, etc.)
- **`protectedRoutes`** - Routes requiring authentication (dashboard, profile, etc.)
- **`publicRoutes`** - Public routes (login, register, etc.)

### Documentation

- **Detailed Guide:** `src/routes/README.md`
- **Examples:** `src/routes/examples.tsx`
- **Migration Guide:** `docs/ROUTING_MIGRATION.md`

### Quick Example

```typescript
// src/routes/config.tsx
{
  path: '/dashboard',
  element: Dashboard,
  title: 'Dashboard',
  protected: true, // Requires authentication
  meta: {
    roles: ['admin'], // Custom metadata
  },
}
```

## Testing Strategy

This project follows the testing pyramid approach:

- **Unit Tests (80%)**: Test individual components, functions, and modules in isolation
- **Integration Tests (20%)**: Test interactions between components and services

### Coverage Requirements

- Branches: 80%
- Functions: 80%
- Lines: 80%
- Statements: 80%

For detailed testing documentation, see [docs/TESTING.md](docs/TESTING.md)

## Available Scripts

### Development

```bash
# Start development server with hot reload (Vite)
npm run dev
# or
npm start

# Preview production build locally
npm run preview
```

### Testing

```bash
# Run all tests once
npm test
# or
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with interactive UI
npm run test:ui

# Run tests with coverage report
npm run test:coverage

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration

# Run all tests with coverage
npm run test:all

# Run full validation (type-check, lint, format, and tests)
npm run validate

# Run CI pipeline (validate + build)
npm run ci
```

### Code Quality

```bash
# Lint TypeScript/TSX files
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Format code with Prettier
npm run format

# Check if code is formatted correctly
npm run format:check

# Type check without emitting files
npm run type-check

# Run all validation checks (type-check + lint + format + test)
npm run validate
```

### Build & Deploy

```bash
# Create production build (TypeScript compilation + Vite build)
npm run build

# Preview production build locally
npm run preview

# Analyze bundle size (requires vite-bundle-visualizer)
npm run analyze
```

### Git Hooks

The following hooks run automatically via Husky:

- **Pre-commit**: Lint-staged (ESLint + Prettier on staged files)
- **Pre-push**: Full validation (type-check, lint, format-check, tests)

## 📁 Project Structure

```
subaccount-frontend/
├── .github/
│   └── workflows/          # GitHub Actions CI/CD
│       └── ci.yml
├── .husky/                 # Git hooks configuration (Husky v8)
│   ├── pre-commit         # Runs lint-staged
│   └── pre-push           # Runs validation
├── .vscode/                # VS Code workspace settings
│   ├── extensions.json    # Recommended extensions
│   └── settings.json      # Workspace configuration
├── docs/                   # 📚 Project documentation
│   ├── QUICK_START.md     # Quick start guide
│   ├── TEAM_RULES.md      # Team standards and rules
│   ├── DEVELOPMENT_GUIDE.md # Development practices
│   ├── TESTING_GUIDE.md   # Comprehensive testing guide
│   ├── SECURITY.md        # Security policies
│   ├── ENV_VARIABLES.md   # Environment variables reference
│   └── DOCUMENTATION_INDEX.md # Complete docs index
├── public/                 # Static assets
│   ├── vite.svg
│   └── robots.txt
├── src/
│   ├── __tests__/          # Test files
│   │   ├── unit/          # Unit tests
│   │   ├── integration/   # Integration tests
│   │   ├── helpers/       # Test helpers
│   │   └── mocks/         # Mock data and handlers
│   ├── components/         # Reusable UI components
│   │   ├── ErrorBoundary/
│   │   ├── Layout/
│   │   └── PerformanceMonitor/
│   ├── constants/          # Application constants
│   ├── hooks/              # Custom React hooks
│   │   ├── usePerformanceMonitor.ts
│   │   ├── useMemoryLeakDetector.ts
│   │   └── index.ts
│   ├── pages/              # Page components
│   │   ├── Home/
│   │   └── NotFound/
│   ├── routes/             # ⭐ Route configuration (ADD NEW ROUTES HERE)
│   │   ├── config.tsx      # Route definitions
│   │   ├── AppRoutes.tsx   # Route renderer
│   │   ├── types.ts        # Route type definitions
│   │   ├── examples.tsx    # Route pattern examples
│   │   ├── index.ts        # Barrel exports
│   │   ├── QUICKSTART.md   # Quick routing guide
│   │   └── README.md       # Detailed routing docs
│   ├── services/           # API services and HTTP clients
│   │   └── api.ts
│   ├── store/              # State management (Zustand)
│   │   └── useUserStore.ts
│   ├── types/              # TypeScript type definitions
│   │   ├── api.types.ts
│   │   └── user.types.ts
│   ├── utils/              # Utility functions
│   │   ├── validation.ts   # Form validation utilities
│   │   ├── performance.ts  # Performance monitoring
│   │   └── logger.ts       # Centralized logging
│   ├── App.tsx             # Root application component
│   ├── App.test.tsx        # App component tests
│   ├── index.tsx           # Application entry point
│   ├── index.css           # Global styles
│   ├── setupTests.ts       # Vitest setup
│   ├── vite-env.d.ts       # Vite type definitions
│   └── react-app-env.d.ts  # React type definitions
├── .env.example            # Environment variables template
├── .eslintignore           # ESLint ignore patterns
├── .eslintrc.json          # ESLint configuration
├── .prettierignore         # Prettier ignore patterns
├── .prettierrc.json        # Prettier configuration
├── .gitignore              # Git ignore patterns
├── index.html              # HTML entry point (Vite)
├── vite.config.ts          # Vite configuration
├── vitest.config.ts        # Vitest test configuration
├── jest.config.js          # Jest configuration (legacy)
├── tsconfig.json           # TypeScript configuration
├── tsconfig.node.json      # TypeScript config for Node
├── tsconfig.eslint.json    # TypeScript config for ESLint
├── sonar-project.properties # SonarQube configuration
├── package.json            # Dependencies and scripts
├── package-lock.json       # Locked dependencies
└── README.md               # This file
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file based on `.env.example`:

| Variable                             | Description                   | Default                   |
| ------------------------------------ | ----------------------------- | ------------------------- |
| `VITE_API_BASE_URL`                  | API base URL                  | `https://api.example.com` |
| `VITE_API_TIMEOUT`                   | API request timeout (ms)      | `30000`                   |
| `VITE_APP_ENV`                       | Environment name              | `development`             |
| `VITE_ENABLE_PERFORMANCE_MONITORING` | Enable performance monitoring | `true`                    |
| `VITE_LOG_LEVEL`                     | Logging level                 | `debug`                   |
| `VITE_VERSION`                       | Application version           | `0.1.0`                   |

### TypeScript Configuration

TypeScript is configured with strict mode enabled:

```json
{
  "strict": true,
  "noImplicitAny": true,
  "strictNullChecks": true,
  "noUncheckedIndexedAccess": true
}
```

### ESLint Rules

Key ESLint rules enforced:

- ❌ No console.log statements
- ✅ Consistent import ordering
- ✅ React hooks rules
- ✅ Accessibility (jsx-a11y)
- ✅ TypeScript strict rules

## 🧪 Testing

### Unit & Integration Tests

Tests are written using Vitest and React Testing Library:

```typescript
// Example test
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Home } from './Home';

describe('Home', () => {
  it('should render successfully', () => {
    render(<Home />);
    expect(screen.getByText('Welcome')).toBeInTheDocument();
  });
});
```

### Coverage Requirements

- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%
- **Statements**: 80%

## 📊 Performance Monitoring

### Web Vitals

The application tracks Core Web Vitals:

- **FCP** (First Contentful Paint): < 1.8s
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1
- **TTFB** (Time to First Byte): < 0.8s

### Performance Monitor

In development mode, a real-time performance monitor displays:

- Web Vitals metrics
- Memory usage
- Render performance
- Performance issues

### Memory Leak Detection

The application includes automatic memory leak detection:

```typescript
import { useMemoryLeakDetector } from '@hooks';

const MyComponent = () => {
  useMemoryLeakDetector({
    componentName: 'MyComponent',
    enabled: import.meta.env.VITE_ENV === 'development',
  });
  // ...
};
```

## 👥 Team Rules & Standards

This project follows strict team rules and development standards to ensure code quality, consistency, and collaboration excellence.

### Core Documents

📋 **[TEAM_RULES.md](docs/TEAM_RULES.md)** - Comprehensive team rules covering:

- Code review requirements and etiquette
- Development standards and conventions
- Git workflow and commit guidelines
- Communication protocols
- Code quality standards (no console.log, no `any` types, etc.)
- Testing requirements (80%+ coverage mandatory)
- Performance standards and metrics
- Security requirements
- Meeting guidelines and escalation process

📋 **[TEAM_RULES_SUMMARY.md](docs/TEAM_RULES_SUMMARY.md)** - Quick reference card:

- Zero tolerance rules
- Essential commands
- Common tasks reference
- Quick validation checklist

🚀 **[QUICK_START.md](docs/QUICK_START.md)** - Get started in 10 minutes:

- Setup instructions
- First task workflow
- Common development tasks
- Essential documentation links

📘 **[DEVELOPMENT_GUIDE.md](docs/DEVELOPMENT_GUIDE.md)** - Detailed development guide:

- Daily development workflow
- Component development patterns
- API integration guidelines
- Debugging and troubleshooting

🧪 **[TESTING_GUIDE.md](docs/TESTING_GUIDE.md)** - Testing best practices:

- Unit and integration testing
- Coverage requirements
- Testing patterns and examples

🔒 **[SECURITY.md](docs/SECURITY.md)** - Security policies:

- Reporting vulnerabilities
- Security best practices
- Authentication and authorization
- Input validation and XSS prevention

### Quick Rules Summary

**Code Quality (Zero Tolerance):**

- ❌ No `console.log` statements (use logger utility)
- ❌ No TypeScript `any` types
- ❌ No unused variables or imports
- ❌ No ESLint warnings or errors
- ✅ All code must pass TypeScript strict mode

**Code Review Requirements:**

- ⏰ Reviews must be completed within 24 hours
- ✅ All PRs require at least one approval
- ✅ All CI/CD checks must pass
- ✅ 80%+ test coverage required
- ✅ No merge conflicts
- ✅ All comments must be resolved

**Testing Standards:**

- 📊 Minimum 80% coverage (statements, branches, functions, lines)
- ✅ Unit tests for all new features
- ✅ Integration tests for API calls
- ✅ E2E tests for critical user flows
- ✅ Tests must be meaningful, not just for coverage

**Git Workflow:**

- 🌿 Branch naming: `<type>/<ticket-id>-<description>`
- 💬 Commit format: Conventional Commits specification
- 🔀 Merge strategy: Squash and merge
- 📏 PR size: Maximum 400 lines (ideal: 200 lines)

**Performance Requirements:**

- ⚡ FCP < 1.8s, LCP < 2.5s, FID < 100ms
- 📦 Bundle size: Initial < 200KB (gzipped)
- 💾 Memory: No leaks detected by profiler
- 🎯 Lighthouse score: Performance > 90

**Security Rules:**

- 🔒 Never commit secrets or API keys
- ✅ Always validate user input
- 🛡️ XSS prevention required
- 🔐 Use environment variables for configuration
- 📋 Run `npm audit` weekly

**Communication:**

- 🕐 Daily stand-ups at 9:30 AM (15 min max)
- 💬 Slack response: @mentions within 2 hours
- 📝 Document all architectural decisions
- 🤝 Pair program on complex features

### Enforcement

Violations of team rules will result in:

1. **First offense:** Verbal warning and coaching
2. **Repeated violations:** Written warning and performance plan
3. **Serious violations:** Immediate escalation to management

### Questions?

If you have questions about team rules or standards:

- Read the full [TEAM_RULES.md](docs/TEAM_RULES.md) document
- Check [DOCUMENTATION_INDEX.md](docs/DOCUMENTATION_INDEX.md) for all documentation
- Ask in `#help` Slack channel
- Contact the team lead
- Propose changes in retrospectives

## 🚢 Deployment

### Production Build

1. **Create production build**

   ```bash
   npm run build
   ```

2. **Test production build locally**

   ```bash
   npx serve -s build
   ```

3. **Analyze bundle size**
   ```bash
   npm run analyze
   ```

### Deployment Platforms

#### Vercel

```bash
npm install -g vercel
vercel --prod
```

#### Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod
```

#### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment-Specific Builds

```bash
# Development
VITE_ENV=development npm run build

# Staging
VITE_ENV=staging npm run build

# Production
VITE_ENV=production npm run build
```

## 🔒 Security

### Security Headers

The application includes security headers in `index.html`:

- Content Security Policy (CSP)
- X-Content-Type-Options
- Referrer-Policy

### Dependency Security

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

## 🤝 Contributing

We welcome contributions! Please read our contribution guidelines before submitting pull requests.

**Required Reading:**

- 📋 [TEAM_RULES.md](TEAM_RULES.md) - Team standards and development rules
- 🤝 [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) - Professional behavior expectations
- 🔧 [CONTRIBUTING.md](CONTRIBUTING.md) - Detailed contribution guidelines

**Before Contributing:**

1. Read and understand team rules
2. Set up your development environment
3. Join team communication channels
4. Review existing issues and PRs
5. Discuss major changes before implementation

### Quick Start for Contributors

1. **Read the rules** - Review [TEAM_RULES.md](TEAM_RULES.md) and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
2. **Fork the repository** - Click the fork button on GitHub
3. **Create a feature branch** - `git checkout -b feature/PROJ-123-amazing-feature`
4. **Make your changes** - Follow coding standards
5. **Write tests** - Maintain 80%+ coverage
6. **Run validation** - `npm run validate` (includes lint, test, type-check)
7. **Commit your changes** - Use conventional commits format
8. **Push to your fork** - `git push origin feature/PROJ-123-amazing-feature`
9. **Open a Pull Request** - Use the PR template, link related issues
10. **Respond to reviews** - Address all comments within 24 hours

**Remember:**

- ✅ All PR checks must pass (no exceptions)
- ✅ Code reviews within 24 hours
- ✅ Keep PRs small (< 400 lines)
- ✅ Test thoroughly before submitting
- ✅ Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Deep Khicher** - _Initial work_ - [Deep](https://github.com/thetestcoder)

## 🙏 Acknowledgments

- React team for the amazing framework
- TypeScript team for type safety
- All open-source contributors

## 📞 Support

For support, email team@startyoursaas.io or open an issue on GitHub.

## 🗺️ Roadmap

- [ ] Add internationalization (i18n)
- [ ] Implement PWA features
- [ ] Add Storybook for component documentation
- [ ] Integrate Sentry for error tracking
- [ ] Add GraphQL support
- [ ] Implement Server-Side Rendering (SSR)

## 📚 Additional Resources

- [React Documentation](https://reactjs.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Testing Library](https://testing-library.com/)
- [Cypress Documentation](https://www.cypress.io/)

---
