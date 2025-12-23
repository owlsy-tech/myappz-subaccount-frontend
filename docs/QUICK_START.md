# Quick Start Guide

**Get up and running in 10 minutes!** ⚡

This guide helps you start development immediately. For detailed information, see the full documentation.

---

## 🚀 Installation (5 minutes)

### Prerequisites Check

```bash
node --version   # Must be 18.0.0+
npm --version    # Must be 9.0.0+
git --version    # Must be 2.0.0+
```

### Setup Commands

```bash
# 1. Clone the repository
git clone https://github.com/owlsy-dev/subaccount-frontend.git
cd subaccount-frontend

# 2. Install dependencies
npm ci

# 3. Copy environment variables
cp .env.example .env

# 4. Initialize Git hooks
npm run prepare

# 5. Start development server
npm run dev
# or
npm start
```

**🎉 Done!** Open [http://localhost:3000](http://localhost:3000)

---

## 📋 Essential Commands

### Development

```bash
npm run dev            # Start dev server (http://localhost:3000)
npm test               # Run tests once
npm run test:watch     # Run tests in watch mode
npm run lint           # Check code quality
```

### Validation (Run before committing)

```bash
npm run validate       # Run ALL checks (type-check + lint + format + test)
```

### Build

```bash
npm run build          # Production build (TypeScript + Vite)
npm run preview        # Preview production build locally
npm run analyze        # Analyze bundle size
```

---

## 🔥 First Task Workflow

### 1. Create Branch

```bash
git checkout develop
git pull origin develop
git checkout -b feature/PROJ-123-your-feature-name
```

### 2. Make Changes

- Edit files in `src/`
- Follow patterns from existing code
- Add tests for new code

### 3. Test Locally

```bash
npm run validate       # Runs lint, test, type-check
```

### 4. Commit

```bash
git add .
git commit -m "feat(scope): add new feature"
git push origin feature/PROJ-123-your-feature-name
```

### 5. Create PR

- Go to GitHub
- Click "New Pull Request"
- Fill out PR template
- Request review from team

---

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ErrorBoundary/
│   ├── Layout/
│   └── PerformanceMonitor/
├── pages/              # Page components (routes)
│   ├── Home/
│   └── NotFound/
├── hooks/              # Custom React hooks
│   ├── usePerformanceMonitor.ts
│   └── useMemoryLeakDetector.ts
├── services/           # API services
│   └── api.ts
├── store/              # Zustand state management
│   └── useUserStore.ts
├── types/              # TypeScript types
│   ├── api.types.ts
│   └── user.types.ts
├── utils/              # Utility functions
│   ├── validation.ts   # Zod schemas
│   ├── performance.ts  # Performance monitoring
│   └── logger.ts       # Logging utility
├── App.tsx             # Root component
└── index.tsx           # Entry point
```

---

## ✅ Team Rules Quick Reference

### Code Quality (Zero Tolerance)

- ❌ No `console.log` (use logger instead)
- ❌ No `any` types in TypeScript
- ❌ No unused variables/imports
- ❌ No ESLint warnings
- ✅ All code must pass `npm run validate`

### Testing Requirements

- ✅ 80%+ test coverage (enforced)
- ✅ Unit tests for all new code
- ✅ Tests must be meaningful
- ✅ Run `npm test` before committing

### PR Requirements

- ✅ Maximum 400 lines changed
- ✅ All CI checks must pass
- ✅ At least 1 approval required
- ✅ All comments resolved
- ✅ PR template filled out
- ⏰ Reviews within 24 hours

### Git Commit Format

```bash
<type>(scope): <description>

Types: feat, fix, docs, style, refactor, perf, test, chore
Examples:
  feat(auth): add login functionality
  fix(api): handle timeout errors
  docs(readme): update setup instructions
```

### Branch Naming

```bash
<type>/<ticket-id>-<description>

Examples:
  feature/PROJ-123-user-authentication
  bugfix/PROJ-456-fix-login-error
  hotfix/PROJ-789-critical-security-patch
```

---

## 🎯 Common Tasks

### Add New Page

```bash
# 1. Create page directory
mkdir -p src/pages/NewPage

# 2. Create files
touch src/pages/NewPage/NewPage.tsx
touch src/pages/NewPage/NewPage.test.tsx
touch src/pages/NewPage/index.ts

# 3. Add route in src/routes/config.tsx (NOT App.tsx)
# 4. Write tests
# 5. Run: npm run validate
```

### Add New Component

```bash
# 1. Create component directory
mkdir -p src/components/NewComponent

# 2. Create files
touch src/components/NewComponent/NewComponent.tsx
touch src/components/NewComponent/NewComponent.test.tsx
touch src/components/NewComponent/index.ts

# 3. Write component
# 4. Write tests
# 5. Run: npm run validate
```

### Add API Endpoint

```typescript
// 1. Define types (src/types/)
export interface IProduct {
  id: string;
  name: string;
}

// 2. Create service (src/services/productService.ts)
export const productService = {
  getAll: () => api.get<IProduct[]>('/products'),
  getById: (id: string) => api.get<IProduct>(`/products/${id}`),
};

// 3. Write tests
// 4. Use in components
```

### Add Form with Validation

```typescript
// 1. Define Zod schema (src/utils/validation.ts)
export const myFormSchema = z.object({
  email: emailSchema,
  name: z.string().min(1),
});

// 2. Use in component
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm({
  resolver: zodResolver(myFormSchema),
});
```

---

## 🆘 Getting Help

### When You're Stuck

**Try This Order:**

1. **Search Documentation** (5 min)
   - README.md
   - TEAM_RULES.md
   - DEVELOPMENT_GUIDE.md

2. **Search Past Issues** (5 min)
   - GitHub Issues
   - Slack history

3. **Ask Team** (immediate)
   - Post in `#help` Slack channel
   - Include: what you're trying to do, what you've tried, error messages

4. **Escalate** (if urgent)
   - Tag your mentor
   - Tag team lead

---

## 🐛 Debugging Tips

### Application Not Starting?

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for port conflicts (configured to use port 3000)
lsof -i :3000
# Or on Windows:
netstat -ano | findstr :3000
```

### Tests Failing?

```bash
# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- MyComponent.test.tsx

# Run tests with UI
npm run test:ui

# Update snapshots (if intentional changes)
npm test -- -u
```

### Linting Errors?

```bash
# Auto-fix most issues
npm run lint:fix

# Format code
npm run format

# Check what's wrong
npm run lint
```

### TypeScript Errors?

```bash
# Check types
npm run type-check

# Restart TS server in VS Code
# CMD/CTRL + Shift + P → "TypeScript: Restart TS Server"
```

---

## 📚 Key Documents

**Must Read (Priority Order):**

1. 📖 **[TEAM_RULES.md](TEAM_RULES.md)** - Team standards and rules ⭐ **START HERE**
2. 📘 **[DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md)** - Detailed development guide
3. 🧪 **[TESTING_GUIDE.md](TESTING_GUIDE.md)** - Testing best practices
4. 🔒 **[SECURITY.md](SECURITY.md)** - Security guidelines
5. 👋 **[TEAM_ONBOARDING.md](TEAM_ONBOARDING.md)** - Onboarding guide
6. 🔐 **[ENV_VARIABLES.md](ENV_VARIABLES.md)** - Environment variables reference

**Quick Reference:**

- ⚡ **This file** - Quick start guide
- 📝 **[README.md](../README.md)** - Project overview
- 📋 **[DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)** - Complete documentation index

---

## 🎓 Learning Path

### Week 1

- [ ] Read TEAM_RULES.md completely
- [ ] Complete environment setup
- [ ] Review TESTING_GUIDE.md
- [ ] Merge first PR (small task)
- [ ] Conduct 2 code reviews

### Month 1

- [ ] Master development workflow
- [ ] Understand testing approach (Vitest + React Testing Library)
- [ ] Complete 5+ tasks
- [ ] Pair program with teammates

### Month 3

- [ ] Own features end-to-end
- [ ] Lead technical discussions
- [ ] Mentor new team members
- [ ] Contribute to documentation

---

## 💡 Pro Tips

### Productivity Hacks

1. **Use Path Aliases**

   ```typescript
   import { Button } from '@/components/Button'; // ✅
   import { Button } from '../../../components/Button'; // ❌
   ```

2. **Hot Reload Issues?**

   ```bash
   # Restart Vite dev server with clean cache
   rm -rf node_modules/.vite
   npm run dev
   ```

3. **Slow Tests?**

   ```bash
   # Run specific test file only
   npm test -- src/components/MyComponent.test.tsx

   # Run tests without coverage for speed
   npm run test:watch
   ```

4. **Quick Commit**

   ```bash
   # Stage and commit in one go
   git commit -am "fix(bug): quick fix"
   ```

5. **Check PR Status**
   ```bash
   # View CI status
   gh pr status
   ```

### VS Code Shortcuts

- `Ctrl/Cmd + P` - Quick file open
- `Ctrl/Cmd + Shift + F` - Search in files
- `F2` - Rename symbol everywhere
- `Alt + Click` - Multiple cursors
- `Ctrl/Cmd + D` - Select next occurrence

---

## ✨ Your First PR Checklist

Before clicking "Create Pull Request":

- [ ] ✅ Code works locally
- [ ] ✅ Tests pass (`npm test`)
- [ ] ✅ Linting passes (`npm run lint`)
- [ ] ✅ Type check passes (`npm run type-check`)
- [ ] ✅ Build works (`npm run build`)
- [ ] ✅ Coverage maintained (≥80%)
- [ ] ✅ No console.log statements
- [ ] ✅ No `any` types
- [ ] ✅ PR template filled out
- [ ] ✅ Tests are meaningful
- [ ] ✅ Documentation updated

**Run This Command:**

```bash
npm run validate && npm run build
```

If everything passes, you're good to go! 🚀

---

## 🆘 Emergency Contacts

**Production Issues:**

- Slack: `#security-emergency`
- Email: critical@example.com
- On-call: Check `#on-call` channel

**Blocked on Work:**

- Slack: `#help`

**Security Issues:**

- Email: deep@owlsy.dev
- **DO NOT** post in public channels

---

## 🎉 Welcome!

You're ready to start contributing! Here's what to do next:

1. ✅ Complete the setup above
2. 📖 Read [TEAM_RULES.md](TEAM_RULES.md)
3. 💬 Introduce yourself in `#dev-general`
4. 🎯 Ask team lead for your first task
5. 🚀 Start coding!

**Remember:**

- Ask questions (we're here to help!)
- Test thoroughly
- Follow team standards
- Have fun! 😊

---

**Need help?** Ask in `#help` or contact your mentor

**Good luck!** 🍀

---

**Last Updated:** January 2025  
**Maintained by:** Development Team

For detailed guides, see:

- [README.md](../README.md) - Full project documentation
- [TEAM_RULES.md](TEAM_RULES.md) - Comprehensive team rules
- [DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md) - Detailed development guide
- [TESTING_GUIDE.md](TESTING_GUIDE.md) - Testing best practices
