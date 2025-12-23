# Team Onboarding Guide

Welcome to the team! 🎉 This guide will help you get up to speed quickly and become a productive team member.

## Table of Contents

- [Welcome](#welcome)
- [Day 1: Setup & Orientation](#day-1-setup--orientation)
- [Week 1: Learning & Integration](#week-1-learning--integration)
- [Month 1: Full Productivity](#month-1-full-productivity)
- [Essential Resources](#essential-resources)
- [Team Contacts](#team-contacts)
- [FAQ](#faq)

---

## Welcome

You're joining a team that values:

- **Code Quality** - We write clean, maintainable, well-tested code
- **Collaboration** - We help each other succeed
- **Continuous Learning** - We're always improving
- **Accountability** - We own our work from development to production
- **Respect** - We treat each other professionally and kindly

### What to Expect

- **First Week:** Setup, learning, and small tasks
- **First Month:** Increasing responsibility and ownership
- **After 3 Months:** Full team member contributing to major features

---

## Day 1: Setup & Orientation

### Morning (9:00 AM - 12:00 PM)

#### 1. Welcome Meeting (30 min)

- Meet with team lead
- Get team overview
- Understand current projects
- Set expectations

#### 2. Administrative Setup (1 hour)

- [ ] HR paperwork completed
- [ ] Company accounts created
- [ ] Email configured
- [ ] VPN access granted
- [ ] Badge/building access obtained

#### 3. Tool Access (1 hour)

- [ ] **GitHub** - Request repository access
- [ ] **Slack** - Join team channels
- [ ] **Jira/Project Management** - Get account and project access
- [ ] **AWS/Cloud Services** - Request necessary permissions
- [ ] **CI/CD Tools** - Jenkins/CircleCI/GitHub Actions access
- [ ] **Monitoring Tools** - DataDog/Sentry/New Relic
- [ ] **Design Tools** - Figma/Sketch access (if applicable)
- [ ] **Documentation** - Wiki/Confluence access

### Afternoon (1:00 PM - 5:00 PM)

#### 4. Development Environment Setup (2-3 hours)

**Prerequisites:**

```bash
# Install Node.js 18+
node --version  # Should be 18.0.0 or higher

# Install npm 9+
npm --version   # Should be 9.0.0 or higher

# Install Git
git --version   # Should be 2.0.0 or higher
```

**Clone and Setup:**

```bash
# Clone repository
git clone https://github.com/owlsy-dev/subaccount-frontend.git
cd subaccount-frontend

# Install dependencies
npm ci

# Copy environment file
cp .env.example .env

# Edit .env with your credentials (ask team for values)
# nano .env or code .env

# Initialize Git hooks
npm run prepare

# Verify setup
npm run validate
```

**IDE Setup:**

- Install recommended IDE: VS Code, WebStorm, or your preference
- Install required extensions:
  - ESLint
  - Prettier
  - TypeScript
  - GitLens
  - Error Lens
  - Jest Runner (optional)
  - React Developer Tools (browser extension)

**VS Code Settings:**

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

#### 5. First Build and Run (30 min)

```bash
# Start development server (Vite)
npm run dev
# or
npm start

# In another terminal, run tests (Vitest)
npm test

# Build for production
npm run build
```

**Success Criteria:**

- ✅ Application starts without errors
- ✅ All tests pass
- ✅ Build completes successfully
- ✅ No TypeScript or ESLint errors

#### 6. Team Introduction (1 hour)

- Meet team members (video call or in-person)
- Understand roles and responsibilities
- Exchange contact information
- Join daily stand-up schedule

---

## Week 1: Learning & Integration

### Required Reading (Day 1-2)

**Critical Documents:**

1. ✅ [README.md](../README.md) - Project overview and setup
2. ✅ [TEAM_RULES.md](TEAM_RULES.md) - **MOST IMPORTANT** - Read thoroughly
3. ✅ [TEAM_RULES_SUMMARY.md](TEAM_RULES_SUMMARY.md) - Quick reference card
4. ✅ [QUICK_START.md](QUICK_START.md) - Quick start guide

**Technical Guides:** 5. ✅ [DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md) - Detailed development guide 6. ✅ [TESTING_GUIDE.md](TESTING_GUIDE.md) - Testing best practices 7. ✅ [SECURITY.md](SECURITY.md) - Security guidelines 8. ✅ [ENV_VARIABLES.md](ENV_VARIABLES.md) - Environment variables reference 9. ✅ [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md) - Complete documentation index

### Codebase Exploration (Day 2-3)

**Understand the Structure:**

```
subaccount-frontend/
├── src/
│   ├── components/   # Reusable UI components
│   ├── pages/        # Page-level components
│   ├── hooks/        # Custom React hooks
│   ├── services/     # API and external services
│   ├── store/        # State management (Zustand)
│   ├── types/        # TypeScript type definitions
│   ├── utils/        # Utility functions
│   └── App.tsx       # Root component
```

**Key Files to Review:**

- `src/App.tsx` - Application entry and routing
- `src/services/api.ts` - API client implementation
- `src/store/useUserStore.ts` - State management example
- `src/utils/validation.ts` - Form validation schemas
- `src/hooks/usePerformanceMonitor.ts` - Performance tracking

**Exercise - Code Review:**

- Pick 3 recent merged PRs
- Read the code changes
- Understand the testing approach
- Note any patterns or conventions

### Attend Key Meetings (Throughout Week 1)

- [ ] **Daily Stand-up** (9:30 AM, 15 min) - Every day
- [ ] **Team Sync** (Weekly, 1 hour) - Team updates and discussions
- [ ] **Sprint Planning** (Bi-weekly, 2 hours) - If one is scheduled
- [ ] **Code Review Session** (As needed) - Learn review practices

### First Task (Day 3-5)

**Starter Issues:**
Your team lead will assign a "good first issue" that's:

- Small in scope (< 4 hours)
- Well-defined requirements
- Has clear acceptance criteria
- Low risk

**Task Checklist:**

- [ ] Understand the requirements
- [ ] Ask questions if anything is unclear
- [ ] Create feature branch following naming convention
- [ ] Write code following team standards
- [ ] Write tests (maintain 80%+ coverage)
- [ ] Self-review your code
- [ ] Run `npm run validate` locally
- [ ] Create PR using the template
- [ ] Respond to review comments
- [ ] Celebrate your first merged PR! 🎉

---

## Month 1: Full Productivity

### Week 2-4 Goals

**Technical Goals:**

- [ ] Complete 3-5 tasks/features
- [ ] Conduct 5+ code reviews
- [ ] Contribute to 1 technical discussion
- [ ] Fix 1 production bug (if available)
- [ ] Pair program with 2 different team members

**Team Integration:**

- [ ] Understand the product roadmap
- [ ] Know all team members and their roles
- [ ] Attend all team ceremonies
- [ ] Present in team meeting (share a learning)
- [ ] Contribute to team retrospective

**Learning Objectives:**

- [ ] Master the development workflow
- [ ] Understand the CI/CD pipeline
- [ ] Know how to debug production issues
- [ ] Familiar with monitoring and logging
- [ ] Comfortable with deployment process

### Knowledge Areas to Master

#### 1. React & TypeScript Best Practices

- Functional components with hooks
- TypeScript strict mode patterns
- Performance optimization (memo, useCallback, useMemo)
- Error boundaries and error handling

#### 2. Testing

- Vitest and React Testing Library
- Writing meaningful tests
- Testing user interactions
- Mocking API calls with MSW
- Achieving 80%+ code coverage

#### 3. State Management

- Zustand store patterns
- When to use global vs local state
- State persistence
- Optimistic updates

#### 4. API Integration

- Axios interceptors
- Error handling
- Retry logic
- Request cancellation
- Loading states

#### 5. Performance

- Web Vitals monitoring
- Bundle size optimization
- Lazy loading
- Memory leak prevention
- Performance profiling

#### 6. Git & GitHub

- Branch strategy
- Commit conventions
- PR workflow
- Handling merge conflicts
- Git best practices

### Mentorship Program

**Your Mentor:**

- Assigned in first week
- Available for questions
- Pair programming sessions
- Code review guidance
- Career development discussions

**Schedule:**

- Weekly 1:1 (30 min)
- Bi-weekly pair programming (1 hour)
- On-demand Slack/video support

---

## Essential Resources

### Internal Resources

**Documentation:**

- 📚 [Documentation Index](DOCUMENTATION_INDEX.md) - Complete documentation index
- 📖 [README.md](../README.md) - Project overview
- 🎨 [Development Guide](DEVELOPMENT_GUIDE.md) - Development workflows
- 📊 [Testing Guide](TESTING_GUIDE.md) - Testing practices
- 🐛 [Security Guide](SECURITY.md) - Security policies

**Communication:**

- 💬 **Slack Channels:**
  - `#deployments` - Deployment notifications
  - `#bugs-reporting` - Bug reports and tracking
  - `#help` - Ask questions here!
  - `#tech-talks` - Team social channel

**Tools:**

- 🔧 [Jira Board](link) - Sprint planning and tracking
- 🚀 [CI/CD Pipeline](link) - Build and deployment status
- 📈 [Analytics Dashboard](link) - Usage metrics
- 🔍 [Code Coverage](link) - Test coverage reports

### External Resources

**Learning Materials:**

- [React Documentation](https://react.dev) - Official React docs
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - TypeScript guide
- [Testing Library](https://testing-library.com) - Testing best practices
- [Vitest Documentation](https://vitest.dev) - Vitest testing framework
- [Vite Documentation](https://vitejs.dev) - Vite build tool
- [Zustand Documentation](https://github.com/pmndrs/zustand) - State management
- [React Hook Form](https://react-hook-form.com) - Form management
- [Zod Documentation](https://zod.dev) - Schema validation
- [MSW Documentation](https://mswjs.io) - API mocking

---

## Team Contacts

### Core Team

| Role                | Contact         | Best Channel     |
| ------------------- | --------------- | ---------------- |
| Team Lead           | deep@owlsy.dev  | Slack: @teamlead |
| Technical Questions | `#help` channel | Slack            |

### Emergency Contacts

**Production Issues:**

- Slack: `#security-emergency` or `#bugs-reporting`
- Email: deep@owlsy.dev
- Escalation: Team Lead → Engineering Manager

**After-Hours Support:**

- Check `#tech-talks` channel for current on-call person
- Email: deep@owlsy.dev

---

## FAQ

### Development Questions

**Q: What should I do if I'm stuck on a problem?**

A: Follow this escalation:

1. Try to solve it yourself (30 min)
2. Search documentation and past issues (15 min)
3. Ask in `#help` Slack channel (immediate)
4. Tag your mentor (if no response in 1 hour)
5. Ask team lead (if urgent)

**Q: How do I know what to work on?**

A: Check in this order:

1. Current sprint tasks assigned to you in Jira
2. Ask team lead in stand-up
3. Look for "good first issue" or "help wanted" labels
4. Code reviews that need attention

**Q: What if tests are failing locally but pass in CI?**

A: Common causes:

- Environment differences (check `.env`)
- Node/npm version mismatch
- Cached dependencies (`rm -rf node_modules && npm ci`)
- OS-specific issues
- Ask in `#help` if stuck

**Q: How do I handle a production bug?**

A:

1. Alert team immediately in `#bugs`
2. Assess severity with team lead
3. Create hotfix branch if critical
4. Fix, test thoroughly, create PR
5. Fast-track review with `[URGENT]` tag
6. Monitor after deployment
7. Write postmortem (for critical bugs)

### Process Questions

**Q: When should I ask for help vs figure it out myself?**

A: Ask for help if:

- You're blocked for > 1 hour
- It affects security or data
- You're unsure about architectural decisions
- The deadline is at risk
- You've tried everything you know

**Q: How detailed should my PR descriptions be?**

A: Include:

- Clear description of changes
- Why changes were needed
- How to test manually
- Screenshots for UI changes
- Any risks or concerns
- Link to related issues/tickets

**Q: What if I disagree with a code review comment?**

A: Professional approach:

1. Understand their perspective
2. Explain your reasoning politely
3. Discuss alternatives
4. Compromise or escalate to team lead
5. Document the decision

See [TEAM_RULES.md](TEAM_RULES.md) for code review guidelines.

**Q: Can I work on something not in the sprint?**

A: Generally no, but exceptions:

- Urgent bugs
- Critical technical debt
- Approved by team lead
- Between sprints

### Team Culture Questions

**Q: What are the working hours?**

A: Core hours: 10 AM - 4 PM (must be available)
Flexible around core hours
Communicate if unavailable

**Q: Is remote work allowed?**

A: Check with your team lead for current remote work policy.

- Communicate your schedule in advance
- Attend all key meetings
- Be available during core hours (10 AM - 4 PM)

**Q: How do I give feedback?**

A: Multiple channels:

- 1:1 with manager
- Sprint retrospectives
- Anonymous feedback form
- Suggest in team meetings

**Q: What if I make a mistake?**

A: Everyone makes mistakes! We have a no-blame culture.

1. Own the mistake
2. Communicate immediately
3. Fix it collaboratively
4. Learn from it
5. Share learnings with team

---

## 30-60-90 Day Plan

### 30 Days (First Month Goals)

- [ ] Complete environment setup
- [ ] Merge first 3 PRs
- [ ] Conduct 5 code reviews
- [ ] Understand codebase structure
- [ ] Deliver first feature end-to-end
- [ ] Read all essential documentation

### 60 Days (Two Month Goals)

- [ ] Work independently on medium tasks
- [ ] Lead one technical discussion
- [ ] Participate actively in code reviews
- [ ] Contribute to architecture decisions
- [ ] Improve test coverage in one area

### 90 Days (Three Month Goals)

- [ ] Own a feature from design to deployment
- [ ] Lead code reviews for complex changes
- [ ] Present in team knowledge sharing
- [ ] Identify and fix technical debt
- [ ] Fully integrated team member
- [ ] Mentor newer team members

---

## Checklist Summary

### Week 1

- [ ] All accounts and access granted
- [ ] Development environment working
- [ ] Read all required documentation
- [ ] First PR merged
- [ ] Met all team members
- [ ] Attended all team meetings

### Month 1

- [ ] 5+ PRs merged
- [ ] 10+ code reviews conducted
- [ ] Comfortable with development workflow
- [ ] Know how to deploy changes
- [ ] Understand monitoring and debugging
- [ ] Completed assigned tasks on time

### Month 3

- [ ] Working on complex features
- [ ] Leading technical discussions
- [ ] Mentoring others
- [ ] Contributing to team improvements
- [ ] Full team member

---

## Your Feedback

We want to continuously improve our onboarding process!

**After Week 1:**

- What was confusing?
- What documentation was missing?
- What was helpful?
- What should be improved?

**After Month 1:**

- How can we improve the process?
- What resources would have helped?
- What surprised you?
- What advice for future new hires?

Submit feedback to: [feedback form link] or email teamlead@example.com

---

## Welcome Again! 🎉

You're joining a great team. We're excited to have you here!

**Remember:**

- Ask questions - there are no stupid questions
- Be patient with yourself - learning takes time
- Help others when you can
- Have fun building great software!

**Your success is our success. Let's build something amazing together!** 🚀

---

**Questions?** Reach out to:

- Your mentor: Check with team lead for assignment
- Team lead: teamlead@example.com
- Slack: `#help` channel

**Useful Documentation:**

- [Quick Start Guide](QUICK_START.md)
- [Team Rules](TEAM_RULES.md)
- [Development Guide](DEVELOPMENT_GUIDE.md)
- [Documentation Index](DOCUMENTATION_INDEX.md)

**Last Updated:** January 2025
**Version:** 1.1.0
