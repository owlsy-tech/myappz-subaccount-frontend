# Documentation Maintenance Checklist

**Purpose:** Ensure all documentation remains accurate, up-to-date, and useful.

---

## 📋 Quick Validation (Run Before Every PR)

When your PR includes documentation changes:

- [ ] All links are working (no 404s)
- [ ] No broken internal references
- [ ] Code examples are tested and working
- [ ] No placeholder text (e.g., `[Name]`, `[link]`, `TODO`)
- [ ] Spelling and grammar checked
- [ ] Markdown formatting is correct
- [ ] File is in correct directory (docs/ for guides)
- [ ] DOCUMENTATION_INDEX.md updated (if new file)
- [ ] Version/date updated in document footer

---

## 🔍 Monthly Documentation Review

### Link Validation

- [ ] Test all internal links (`docs/` references)
- [ ] Test all relative links (`../` references)
- [ ] Verify GitHub template links work
- [ ] Check external links (may have changed)
- [ ] Verify anchor links (`#section-name`)

### Content Accuracy

- [ ] Command examples still work
- [ ] Code snippets are current
- [ ] Dependencies versions are correct
- [ ] Contact information is up-to-date
- [ ] Slack channels mentioned still exist
- [ ] Tool names/versions haven't changed

### Completeness

- [ ] New features are documented
- [ ] Deprecated features are marked
- [ ] Common issues have solutions
- [ ] FAQ section is current
- [ ] Examples cover main use cases

---

## 📅 Quarterly Deep Review (Every 3 Months)

### Structure & Organization

- [ ] Document hierarchy makes sense
- [ ] Navigation is intuitive
- [ ] Related docs are cross-referenced
- [ ] DOCUMENTATION_INDEX.md is comprehensive
- [ ] No orphaned documents (not linked anywhere)

### Content Quality

- [ ] Language is clear and concise
- [ ] Technical level is appropriate
- [ ] Examples are practical and useful
- [ ] Terminology is consistent
- [ ] No contradictions between documents

### Maintenance Items

- [ ] Remove outdated information
- [ ] Update screenshots (if any)
- [ ] Refresh code examples
- [ ] Update version numbers
- [ ] Review and update dates

---

## 🆕 When Adding New Documentation

### Before Creating

- [ ] Check if information already exists elsewhere
- [ ] Determine best location (README vs docs/)
- [ ] Choose appropriate filename (follows conventions)
- [ ] Plan document structure
- [ ] Identify target audience

### During Creation

- [ ] Use consistent markdown formatting
- [ ] Add clear headings (H1, H2, H3)
- [ ] Include table of contents (if long)
- [ ] Add code examples with syntax highlighting
- [ ] Use emoji sparingly and consistently
- [ ] Add metadata (version, date, maintainer)

### After Creation

- [ ] Add to DOCUMENTATION_INDEX.md
- [ ] Link from related documents
- [ ] Update README.md if needed
- [ ] Test all links in new document
- [ ] Get peer review
- [ ] Announce in team channel

---

## 🔄 When Updating Existing Documentation

### Preparation

- [ ] Read entire document first
- [ ] Understand current structure
- [ ] Identify all sections needing updates
- [ ] Check related documents for impacts

### Making Changes

- [ ] Maintain consistent tone and style
- [ ] Don't break existing links
- [ ] Update examples to match current code
- [ ] Preserve important historical context
- [ ] Update "Last Updated" date

### Verification

- [ ] Re-read entire document
- [ ] Test all code examples
- [ ] Verify all links still work
- [ ] Check formatting renders correctly
- [ ] Get peer review if major changes

---

## 📁 File-Specific Checklists

### README.md

- [ ] Badges are up-to-date
- [ ] Features list is current
- [ ] Installation steps work
- [ ] Links to all key docs present
- [ ] Quick start section is accurate
- [ ] Project description is clear

### TEAM_RULES.md

- [ ] All rules are still relevant
- [ ] Examples are current
- [ ] Response times are realistic
- [ ] Contact info is correct
- [ ] Enforcement section is clear
- [ ] No contradictions with other docs

### QUICK_START.md

- [ ] Can complete in stated time (10 min)
- [ ] All commands work
- [ ] Links to next steps are clear
- [ ] Prerequisites are accurate
- [ ] Common issues addressed

### DEVELOPMENT_GUIDE.md

- [ ] Code examples work
- [ ] Tool versions are current
- [ ] Best practices are up-to-date
- [ ] Common tasks are covered
- [ ] Troubleshooting is helpful

### TESTING_GUIDE.md

- [ ] Test examples pass
- [ ] Coverage requirements match CI/CD
- [ ] Testing commands work
- [ ] Patterns are current best practices
- [ ] Mocking examples are relevant

### SECURITY.md

- [ ] Reporting process is clear
- [ ] Contact info is correct
- [ ] Best practices are current
- [ ] No outdated security advice
- [ ] Compliance info is accurate

### TEAM_ONBOARDING.md

- [ ] Timeline is realistic
- [ ] Required reading list is current
- [ ] Contact info is up-to-date
- [ ] Checklist items are relevant
- [ ] Tools list is complete

### ENV_VARIABLES.md

- [ ] All current variables documented
- [ ] No obsolete variables listed
- [ ] Examples match .env.example
- [ ] Types and defaults are correct
- [ ] Usage examples work

### DOCUMENTATION_INDEX.md

- [ ] All docs are listed
- [ ] Categories make sense
- [ ] Links are correct
- [ ] Descriptions are accurate
- [ ] Priority levels are appropriate

---

## 🔧 Documentation Tools

### Recommended Tools

```bash
# Check for broken links
npm install -g markdown-link-check
markdown-link-check docs/**/*.md

# Spell check
npm install -g markdown-spellcheck
mdspell docs/**/*.md --en-us --report

# Lint markdown
npm install -g markdownlint-cli
markdownlint docs/**/*.md

# Format markdown
npm install -g prettier
prettier --write "docs/**/*.md"
```

### Manual Checks

```bash
# Find TODO items
grep -r "TODO\|FIXME\|XXX" docs/

# Find placeholder text
grep -r "\[Name\]\|\[link\]\|example\.com\|yourusername" docs/

# Find broken internal links
grep -r "](.*\.md)" docs/ | grep -v "^Binary"

# Check for inconsistent formatting
grep -r "^#[^# ]" docs/  # Missing space after #
```

---

## 📊 Documentation Quality Metrics

### Measure These:

- **Completeness:** All features documented?
- **Accuracy:** Information is correct?
- **Clarity:** Easy to understand?
- **Findability:** Can users find what they need?
- **Consistency:** Formatting and terminology consistent?
- **Maintainability:** Easy to update?

### Target Goals:

- ✅ Zero broken links
- ✅ All docs updated within 30 days of code changes
- ✅ < 5% of support questions about docs
- ✅ New members can onboard from docs alone
- ✅ Quarterly review completion rate: 100%

---

## 🚨 Red Flags (Fix Immediately)

- ❌ Broken links in critical docs (README, QUICK_START, TEAM_RULES)
- ❌ Installation steps don't work
- ❌ Code examples throw errors
- ❌ Contact information is wrong
- ❌ Security information is outdated
- ❌ Contradictions between documents
- ❌ Missing required documentation
- ❌ Docs not updated after major changes

---

## 👥 Ownership & Responsibilities

### Documentation Owners:

| Document Type    | Owner             | Reviewer            |
| ---------------- | ----------------- | ------------------- |
| README.md        | Team Lead         | All developers      |
| TEAM_RULES.md    | Team Lead         | Engineering Manager |
| Technical Guides | Senior Developers | Team Lead           |
| SECURITY.md      | Security Team     | Team Lead           |
| GitHub Templates | Team Lead         | All developers      |

### Team Responsibilities:

**All Developers:**

- Update docs when changing features
- Fix broken links you find
- Report documentation issues
- Review doc changes in PRs

**Code Reviewers:**

- Verify docs updated with code changes
- Check for new broken links
- Ensure examples are tested

**Team Lead:**

- Quarterly deep reviews
- Maintain DOCUMENTATION_INDEX
- Resolve conflicting information
- Approve major doc changes

---

## 📝 Best Practices

### Writing Style:

- ✅ Use clear, simple language
- ✅ Write in present tense
- ✅ Use active voice
- ✅ Be concise but complete
- ✅ Include examples
- ✅ Use consistent terminology
- ✅ Add visual breaks (lists, code blocks, tables)

### Formatting:

- ✅ Use markdown headings properly (H1, H2, H3)
- ✅ Add blank lines around lists and code blocks
- ✅ Use code blocks with language tags
- ✅ Use tables for structured data
- ✅ Add horizontal rules for major sections
- ✅ Use emoji consistently and sparingly

### Content:

- ✅ Start with context/purpose
- ✅ Include prerequisites
- ✅ Provide step-by-step instructions
- ✅ Add troubleshooting section
- ✅ Link to related docs
- ✅ Include "What's Next" or next steps

---

## 🔄 Update Triggers

Update documentation when:

- ✅ Adding new features
- ✅ Deprecating features
- ✅ Changing APIs
- ✅ Updating dependencies
- ✅ Changing processes
- ✅ Adding/removing team members
- ✅ Changing contact information
- ✅ Tool versions change
- ✅ Environment setup changes
- ✅ Receiving feedback about confusion

---

## 📞 Getting Help

If you're unsure about documentation:

1. **Check existing docs** - See how similar info is documented
2. **Ask in #dev-general** - Get team input
3. **Review with team lead** - For major changes
4. **Use this checklist** - Follow the guidelines
5. **Get peer review** - Before finalizing

---

## ✅ PR Documentation Checklist

Include this in your PR description when changing docs:

```markdown
## Documentation Changes

- [ ] All links tested and working
- [ ] Code examples tested
- [ ] No placeholder text remaining
- [ ] Formatting is correct
- [ ] DOCUMENTATION_INDEX.md updated (if applicable)
- [ ] Related docs updated
- [ ] Spelling/grammar checked
- [ ] Follows style guidelines
- [ ] Date updated
```

---

**Remember:** Good documentation is a team effort. Everyone contributes to keeping it accurate and useful!

---

**Version:** 1.0.0  
**Last Updated:** December 2025  
**Next Review:** June 2026  
**Maintained By:** Development Team
