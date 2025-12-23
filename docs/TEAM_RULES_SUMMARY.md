# Team Rules - Quick Reference Card

**🎯 Print this out and keep it at your desk!**

---

## 🚫 ZERO TOLERANCE RULES

### Code Quality

```
❌ NO console.log statements          → Use logger utility
❌ NO TypeScript 'any' types          → Use proper types or 'unknown'
❌ NO unused variables/imports        → Clean up your code
❌ NO ESLint warnings                 → Fix all warnings
❌ NO disabled ESLint rules           → Must have justification
❌ NO committing secrets/API keys     → Use environment variables
❌ NO skipping tests                  → Tests are mandatory
```

### Before Every Commit

```bash
✅ Run: npm run validate
✅ All tests pass
✅ No ESLint errors
✅ TypeScript checks pass
✅ Code is formatted
```

---

## 📏 SIZE LIMITS

| Item                      | Limit     | Action if Exceeded        |
| ------------------------- | --------- | ------------------------- |
| **PR Size**               | 400 lines | Break into smaller PRs    |
| **Function Length**       | 50 lines  | Extract smaller functions |
| **File Length**           | 300 lines | Split into multiple files |
| **Cyclomatic Complexity** | 10        | Refactor and simplify     |
| **Bundle Size (initial)** | 200 KB    | Optimize and code split   |
| **Bundle Size (lazy)**    | 100 KB    | Review and optimize       |

---

## ⏰ TIME COMMITMENTS

### Code Reviews

| Priority    | Response Time | Resolution Time |
| ----------- | ------------- | --------------- |
| 🔴 Critical | 2 hours       | Same day        |
| 🟠 High     | 4 hours       | 1 day           |
| 🟡 Medium   | 24 hours      | 2-3 days        |
| 🟢 Low      | 48 hours      | 1 week          |

### Daily Schedule

- **9:30 AM** - Daily Stand-up (15 min)
- **Within 2 hours** - Respond to @mentions
- **By EOD** - Respond to channel messages
- **Push daily** - Commit work to remote

---

## ✅ PR REQUIREMENTS (ALL MANDATORY)

### Must Have:

- [x] ✅ All CI/CD checks passing
- [x] ✅ 80%+ test coverage maintained
- [x] ✅ Unit + integration tests included
- [x] ✅ No ESLint warnings
- [x] ✅ TypeScript strict mode passes
- [x] ✅ Documentation updated
- [x] ✅ PR template completely filled
- [x] ✅ Related issues linked
- [x] ✅ At least 1 approval
- [x] ✅ All review comments resolved

### Reviewer Must:

- Review within 24 hours
- Test locally when possible
- Check for security issues
- Verify accessibility
- Approve only when satisfied

---

## 📊 TESTING REQUIREMENTS

### Coverage Thresholds (ENFORCED)

```
Statements:  ≥ 80%
Branches:    ≥ 80%
Functions:   ≥ 80%
Lines:       ≥ 80%
```

### What Must Be Tested

- [x] All new features
- [x] All bug fixes
- [x] All utility functions
- [x] All API calls
- [x] All form validations
- [x] Error scenarios
- [x] Edge cases
- [x] Accessibility (UI components)

---

## 🌿 GIT WORKFLOW

### Branch Naming

```
<type>/<ticket-id>-<description>

✅ feature/PROJ-123-user-auth
✅ bugfix/PROJ-456-fix-login
✅ hotfix/PROJ-789-security-patch
```

### Commit Message Format

```
<type>(scope): <subject>

Types: feat, fix, docs, style, refactor, perf, test, chore, ci

✅ feat(auth): add OAuth login
✅ fix(api): handle timeout errors
✅ docs(readme): update setup guide
```

### Commit Rules

- Use imperative mood ("add" not "added")
- First line max 72 characters
- Reference ticket in footer
- Separate subject from body

---

## 🏗️ CODE STRUCTURE

### Import Order

```typescript
// 1. External imports
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 2. Internal imports
import { Button } from '@components/Button';
import { api } from '@services/api';

// 3. Type imports
import type { IUser } from '@types/user.types';

// 4. Constants, types, component, exports
```

### Component Structure

```typescript
const MyComponent = () => {
  // 1. Hooks
  // 2. State
  // 3. Refs
  // 4. Computed values (useMemo)
  // 5. Callbacks (useCallback)
  // 6. Effects (useEffect)
  // 7. Render
};
```

---

## 📝 NAMING CONVENTIONS

```typescript
// Components: PascalCase
const UserProfile = () => {};

// Functions: camelCase
const fetchUserData = () => {};

// Event Handlers: handle* or on*
const handleClick = () => {};
const onUserLogin = () => {};

// Booleans: is*, has*, should*, can*
const isLoading = false;
const hasError = false;
const shouldRender = true;

// Constants: UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com';
const MAX_RETRIES = 3;

// Private: _prefix (use sparingly)
const _internalHelper = () => {};
```

---

## ⚡ PERFORMANCE STANDARDS

### Web Vitals Targets

```
FCP  (First Contentful Paint)  < 1.8s   ✅
LCP  (Largest Contentful Paint) < 2.5s   ✅
FID  (First Input Delay)        < 100ms  ✅
CLS  (Cumulative Layout Shift)  < 0.1    ✅
TTFB (Time to First Byte)       < 800ms  ✅
```

### Lighthouse Scores

```
Performance:     > 90  ✅
Accessibility:   100   ✅ (REQUIRED)
Best Practices:  > 95  ✅
SEO:             > 90  ✅
```

### Optimization Rules

- ✅ Use React.memo for expensive components
- ✅ Use useCallback for event handlers
- ✅ Use useMemo for expensive computations
- ✅ Lazy load routes and heavy components
- ✅ Optimize images (WebP, lazy load)
- ✅ Clean up timers/listeners on unmount

---

## 🔒 SECURITY RULES

### Never Commit

```
❌ API keys
❌ Passwords
❌ Private keys
❌ Access tokens
❌ Secrets in any form
```

### Always Do

```
✅ Validate ALL user input (client + server)
✅ Sanitize HTML before rendering
✅ Use environment variables for secrets
✅ Run npm audit weekly
✅ Use HTTPS for all API calls
✅ Implement CSRF protection
```

### XSS Prevention

```typescript
// ❌ NEVER DO THIS
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ ALWAYS SANITIZE
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{
  __html: DOMPurify.sanitize(userInput)
}} />
```

---

## 💬 COMMUNICATION

### Slack Etiquette

- **@here** → Respond within 1 hour
- **@mention** → Respond within 2 hours
- **Channel message** → Respond by EOD
- **Use threads** → Keep discussions organized
- **Status updates** → Update when away/busy

### Code Review Comments

```
[BLOCKING]    - Must fix before merge
[SUGGESTION]  - Nice to have, not required
[QUESTION]    - Need clarification
[NIT]         - Minor/stylistic change
```

---

## 🚨 WHEN TO ESCALATE

### Immediately (< 1 hour)

- 🔴 Production down
- 🔴 Security breach
- 🔴 Data loss
- 🔴 Critical bug affecting users

### Within 24 Hours

- 🟠 Blocked > 1 day
- 🟠 Disagreement on approach
- 🟠 Resource conflicts
- 🟠 Timeline concerns

### Escalation Chain

```
Level 1: Team Lead        → Technical decisions
Level 2: Engineering Mgr  → Team conflicts
Level 3: CTO              → Strategic decisions
```

---

## 📅 MEETINGS

### Daily Stand-up (9:30 AM - 15 min)

```
1. What I did yesterday
2. What I'm doing today
3. Any blockers

Rules:
- Be on time (2 min early)
- Be concise (2 min max)
- Take details offline
```

### Sprint Planning (Every 2 weeks - 2 hours)

- Review backlog
- Estimate stories
- Commit to sprint goals

### Sprint Review (End of sprint - 1 hour)

- Demo work
- Gather feedback

### Retrospective (After review - 1 hour)

- What went well
- What can improve
- Action items

---

## 🧪 TESTING QUICK REF

### Test Types Distribution

```
Unit Tests:        60% ████████████░░░░░░░░
Integration:       30% ██████░░░░░░░░░░░░░░
E2E Tests:         10% ██░░░░░░░░░░░░░░░░░░
```

### Test Naming

```typescript
// ✅ GOOD
it('should display error message when API call fails', () => {});

// ❌ BAD
it('test 1', () => {});
it('works', () => {});
```

### Query Priority

```typescript
1. getByRole()           // ⭐ Most accessible
2. getByLabelText()      // Form elements
3. getByPlaceholderText()
4. getByText()
5. getByTestId()         // Last resort
```

---

## 🎨 ACCESSIBILITY (WCAG 2.1 AA)

### Required for All UI

- [x] Semantic HTML (`<header>`, `<nav>`, `<main>`, `<footer>`)
- [x] ARIA labels where needed
- [x] Keyboard navigation (Tab, Enter, Escape)
- [x] Focus management
- [x] Color contrast ≥ 4.5:1
- [x] Alt text for images
- [x] Form labels for inputs
- [x] Error messages with aria-live

### Test Checklist

```bash
✅ Screen reader works
✅ Keyboard-only navigation works
✅ Focus indicators visible
✅ Color contrast sufficient
✅ No flashing content
```

---

## 📦 TYPESCRIPT RULES

### Type Definitions

```typescript
// Interfaces: Prefix with 'I'
interface IUser {
  id: string;
  name: string;
}

// Type Aliases: Prefix with 'T'
type TUserRole = 'admin' | 'user' | 'guest';

// Enums: PascalCase
enum UserStatus {
  Active = 'active',
  Inactive = 'inactive',
}
```

### Avoid 'any'

```typescript
// ❌ BAD
const data: any = fetchData();

// ✅ GOOD
const data: IUserData = fetchData();

// ✅ ACCEPTABLE (when truly unknown)
const data: unknown = fetchData();
if (isUserData(data)) {
  // Now typed as IUserData
}
```

---

## 🔄 DAILY CHECKLIST

### Morning

- [ ] Pull latest develop
- [ ] Check Slack messages
- [ ] Review assigned tasks
- [ ] Attend stand-up (9:30 AM)

### During Development

- [ ] Commit frequently
- [ ] Push to remote regularly
- [ ] Run tests often
- [ ] Ask for help when stuck > 1 hour

### Before Committing

- [ ] `npm run validate` passes
- [ ] Self-review your changes
- [ ] No debugging code left

### End of Day

- [ ] Push all work to remote
- [ ] Update ticket status
- [ ] Document blockers
- [ ] Plan tomorrow

---

## 🎯 QUALITY GATES

### No PR Merge Until:

```
✅ All CI checks pass
✅ 80%+ coverage maintained
✅ At least 1 approval
✅ All comments resolved
✅ No merge conflicts
✅ Up to date with target branch
✅ Security reviewed (if needed)
✅ Documentation updated
```

### CI/CD Pipeline Checks

```
1. ✅ ESLint (no warnings)
2. ✅ Prettier (formatted)
3. ✅ TypeScript (no errors)
4. ✅ Unit tests (all pass)
5. ✅ Coverage (≥80%)
6. ✅ Build (successful)
7. ✅ Security audit (no critical)
8. ✅ E2E tests (passing)
```

---

## 🆘 COMMON ISSUES & SOLUTIONS

### Issue: Tests failing in CI but pass locally

```bash
# Solution:
npm ci                    # Clean install
npm test -- --clearCache  # Clear Jest cache
```

### Issue: Linting errors

```bash
# Solution:
npm run lint:fix          # Auto-fix
npm run format            # Format code
```

### Issue: TypeScript errors

```bash
# Solution:
npm run type-check        # Check errors
# Restart TS server in IDE
```

### Issue: Merge conflicts

```bash
# Solution:
git checkout develop
git pull origin develop
git checkout feature/branch
git rebase develop
# Resolve conflicts
git push --force-with-lease
```

---

---

## 🎓 LEARNING RESOURCES

### Must Read (In Order)

1. **TEAM_RULES.md** ⭐ Most important
2. **CODE_OF_CONDUCT.md**
3. **CONTRIBUTING.md**
4. **DEVELOPMENT_GUIDE.md**
5. **TESTING_GUIDE.md**
6. **SECURITY.md**

### Quick Links

- 📖 [Full Team Rules](TEAM_RULES.md)
- 🚀 [Quick Start](QUICK_START.md)
- 👋 [Onboarding](TEAM_ONBOARDING.md)
- 📘 [Development Guide](DEVELOPMENT_GUIDE.md)

---

## 💻 ESSENTIAL COMMANDS

```bash
# Development
npm start                 # Start dev server
npm test                  # Run tests (watch)
npm run validate          # Run ALL checks ⭐

# Code Quality
npm run lint              # Check linting
npm run lint:fix          # Fix linting
npm run format            # Format code
npm run type-check        # Check types

# Testing
npm run test:coverage     # Run with coverage

# Build
npm run build             # Production build
npm run analyze           # Bundle analysis
```

---

## 🔑 KEY PRINCIPLES

### Code Quality Over Speed

```
Never compromise quality for speed
Write clean, maintainable code
Refactor as you go
Address tech debt immediately
```

### Team First

```
Help teammates before starting new work
Review PRs within 24 hours
Share knowledge freely
Pair program on complex features
```

### Ownership & Accountability

```
Own your code to production
Monitor features after deployment
Fix your bugs promptly
Be proactive about issues
```

### Fail Fast, Learn Faster

```
Test early and often
Deploy small changes
Learn from mistakes
Share lessons with team
```

---

## ⚠️ CONSEQUENCES

### Minor Violations (First Time)

- Verbal warning
- Coaching session
- Pair programming

### Repeated Violations

- Written warning
- Performance improvement plan
- Additional training

### Serious Violations

- Immediate discussion with lead
- Documented incident
- Improvement plan
- Regular check-ins

---

## ✨ BEST PRACTICES QUICK LIST

### React

- ✅ Functional components only
- ✅ Use hooks (no class components)
- ✅ Memo expensive components
- ✅ useCallback for event handlers
- ✅ useMemo for computations
- ✅ Lazy load routes

### TypeScript

- ✅ Strict mode enabled
- ✅ Explicit types
- ✅ No 'any' type
- ✅ Use type guards
- ✅ Readonly when appropriate

### Testing

- ✅ Test behavior, not implementation
- ✅ Arrange-Act-Assert pattern
- ✅ One assertion per test (when possible)
- ✅ Clear test names
- ✅ Mock external dependencies

### Performance

- ✅ Monitor Web Vitals
- ✅ Optimize bundle size
- ✅ Lazy load heavy components
- ✅ Clean up side effects
- ✅ Prevent memory leaks

### Accessibility

- ✅ Semantic HTML
- ✅ ARIA labels
- ✅ Keyboard navigation
- ✅ Color contrast
- ✅ Alt text for images

### Security

- ✅ Validate input
- ✅ Sanitize output
- ✅ Use environment variables
- ✅ Run npm audit
- ✅ HTTPS only

---

## 🎯 QUICK VALIDATION

### Before Creating PR

```bash
# Run this command:
npm run validate && npm run build

# If passes, you're ready! ✅
# If fails, fix issues ❌
```

### Checklist

```
✅ Code works
✅ Tests pass (≥80% coverage)
✅ No console.log
✅ No 'any' types
✅ No lint errors
✅ Types check pass
✅ Build succeeds
✅ Documentation updated
✅ PR template filled
```

---

## 📌 REMEMBER

```
🧠 Ask questions - no stupid questions!
🤝 Help others - we succeed together
🧪 Test thoroughly - bugs affect users
📖 Document well - help your future self
🔒 Security first - protect user data
⚡ Performance matters - fast apps win
♿ Accessibility required - include everyone
🎯 Quality over quantity - do it right
```

---

## 🚀 GETTING STARTED

### New Team Member?

1. Read this card thoroughly
2. Complete setup in [QUICK_START.md](QUICK_START.md)
3. Read [TEAM_RULES.md](TEAM_RULES.md) completely
4. Ask team lead for first task
5. Start contributing!

**💡 Pro Tip:** Bookmark this page and refer to it daily!

**📌 Print this out and keep it visible while coding!**

---

**Version:** 1.0.0  
**Last Updated:** December 2025  
**Next Review:** Quarterly

**Questions?** Ask in `#tech-talks` or contact your team lead

---

**Welcome to the team! Let's build amazing software together! 🎉**
