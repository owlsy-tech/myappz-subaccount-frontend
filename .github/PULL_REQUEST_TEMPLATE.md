# Pull Request

## Description

<!-- Provide a clear and concise description of your changes -->

## Type of Change

<!-- Mark the relevant option with an "x" -->

- [ ] 🐛 Bug fix (non-breaking change which fixes an issue)
- [ ] ✨ New feature (non-breaking change which adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] 📝 Documentation update
- [ ] 🎨 Style/UI update (formatting, CSS, etc.)
- [ ] ♻️ Code refactoring (no functional changes)
- [ ] ⚡ Performance improvement
- [ ] ✅ Test updates
- [ ] 🔧 Configuration/build changes
- [ ] 🔒 Security fix

## Related Issues

<!-- Link to related issues. Use "Closes #123" to auto-close issues when PR is merged -->

Closes #
Related to #

## Changes Made

<!-- List the specific changes made in this PR -->

-
-
-

## Screenshots/Videos

<!-- If applicable, add screenshots or videos to help explain your changes -->
<!-- Delete this section if not applicable -->

### Before

<!-- Screenshot or description of the previous behavior -->

### After

<!-- Screenshot or description of the new behavior -->

## Testing Performed

<!-- Describe the testing you've done -->

### Unit Tests

- [ ] All existing tests pass
- [ ] New tests added for new functionality
- [ ] Test coverage maintained or improved (≥80%)

### Manual Testing

- [ ] Tested in Chrome
- [ ] Tested in Firefox
- [ ] Tested in Safari
- [ ] Tested on mobile devices
- [ ] Tested edge cases
- [ ] Tested error scenarios

### Test Scenarios

<!-- Describe the test scenarios you executed -->

1.
2.
3.

## Checklist

<!-- Mark completed items with an "x" -->

### Code Quality

- [ ] Code follows the project's style guidelines
- [ ] Self-review of code completed
- [ ] Code is DRY (Don't Repeat Yourself)
- [ ] Functions are small and focused (<50 lines)
- [ ] Complex logic is commented
- [ ] No console.log statements (using logger instead)
- [ ] No TypeScript `any` types used
- [ ] No ESLint warnings or errors

### Testing

- [ ] Unit tests added/updated
- [ ] Integration tests added/updated (if applicable)
- [ ] E2E tests added/updated (if applicable)
- [ ] All tests pass locally (`npm test`)
- [ ] Coverage threshold met (≥80%)

### Documentation

- [ ] Comments added for complex code
- [ ] JSDoc added for public APIs
- [ ] README updated (if needed)
- [ ] CHANGELOG updated (if needed)
- [ ] Wiki/documentation updated (if applicable)

### Performance

- [ ] No obvious performance issues introduced
- [ ] Bundle size checked (`npm run analyze`)
- [ ] Large images optimized
- [ ] Unnecessary re-renders prevented (memo/useCallback/useMemo)
- [ ] No memory leaks (verified with profiler)

### Accessibility

- [ ] Proper semantic HTML used
- [ ] ARIA labels added where needed
- [ ] Keyboard navigation works
- [ ] Color contrast is sufficient
- [ ] Screen reader tested (if UI changes)

### Security

- [ ] No sensitive data exposed
- [ ] User input is validated
- [ ] XSS prevention in place
- [ ] No new security vulnerabilities (`npm audit`)
- [ ] Environment variables used for secrets

### Git

- [ ] Commits follow conventional commits format
- [ ] Branch is up to date with target branch
- [ ] No merge conflicts
- [ ] Meaningful commit messages

## Performance Impact

<!-- Describe any performance implications -->

- **Bundle Size Change:** +/- X KB
- **Performance Metrics:** (FCP, LCP, etc.)
- **Memory Impact:** Minimal/Moderate/Significant

## Breaking Changes

<!-- If this PR includes breaking changes, describe them here -->
<!-- Delete this section if no breaking changes -->

### Migration Guide

<!-- Provide steps for users to migrate to the new version -->

1.
2.
3.

## Deployment Notes

<!-- Special notes for deployment, if any -->
<!-- Delete this section if not applicable -->

- [ ] Database migrations required
- [ ] Environment variables need updating
- [ ] Feature flags need configuration
- [ ] Cache clearing required
- [ ] Third-party services need updating

## Rollback Plan

<!-- Describe how to rollback if issues are found after deployment -->
<!-- Delete this section if not applicable -->

## Additional Context

<!-- Add any other context about the PR here -->

## Reviewer Notes

<!-- Any specific areas you want reviewers to focus on? -->

Please pay special attention to:

-
-

## Post-Merge Tasks

<!-- Tasks to be completed after merge -->
<!-- Delete this section if not applicable -->

- [ ] Monitor error tracking for new issues
- [ ] Update related documentation
- [ ] Notify team in Slack
- [ ] Create follow-up tickets
- [ ] Update project board

---

## Reviewer Checklist

<!-- For reviewers - do not modify above sections -->

### Code Review

- [ ] Code logic is correct and efficient
- [ ] Edge cases are handled
- [ ] Error handling is appropriate
- [ ] Code follows team standards (see TEAM_RULES.md)
- [ ] No security vulnerabilities introduced
- [ ] Performance impact is acceptable

### Testing Review

- [ ] Tests are comprehensive
- [ ] Tests are meaningful (not just for coverage)
- [ ] Test descriptions are clear
- [ ] Mocks are appropriate

### Documentation Review

- [ ] Documentation is clear and complete
- [ ] Comments explain "why", not "what"
- [ ] Public APIs are documented

### Final Checks

- [ ] Tested locally
- [ ] All CI/CD checks pass
- [ ] No merge conflicts
- [ ] Ready to merge

---

**Review Priority:** High / Medium / Low

**Estimated Review Time:** \_\_\_ minutes

---

<!--
Thank you for your contribution! 🎉
Please ensure all checks are completed before requesting review.
-->
