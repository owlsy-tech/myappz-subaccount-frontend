# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Currently supported versions:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

We take the security of our project seriously. If you have discovered a security vulnerability, please follow these steps:

### 🚨 DO NOT create a public GitHub issue for security vulnerabilities

### Reporting Process

1. **Email Security Team**
   - Send details to: security@example.com
   - Use subject: `[SECURITY] Brief description`
   - Include as much information as possible

2. **Expected Response Time**
   - Initial response: Within 24 hours
   - Status update: Within 72 hours
   - Resolution timeline: Depends on severity

3. **What to Include in Your Report**
   ```
   - Type of vulnerability
   - Full path to affected source file(s)
   - Location of affected code (tag/branch/commit)
   - Step-by-step instructions to reproduce
   - Proof-of-concept or exploit code (if possible)
   - Impact of the vulnerability
   - Suggested fix (if you have one)
   ```

### Example Report

```
Subject: [SECURITY] XSS vulnerability in user profile page

Type: Cross-Site Scripting (XSS)
Severity: High
Affected Component: src/components/UserProfile/UserProfile.tsx
Version: 0.1.0

Description:
The user profile page renders user-supplied bio text without sanitization,
allowing arbitrary JavaScript execution.

Steps to Reproduce:
1. Login to the application
2. Navigate to profile settings
3. Enter the following in the bio field: <script>alert('XSS')</script>
4. Save profile
5. Navigate to profile page
6. JavaScript executes

Impact:
- Session hijacking
- Cookie theft
- Phishing attacks

Suggested Fix:
Use DOMPurify to sanitize HTML before rendering with dangerouslySetInnerHTML
```

## Security Best Practices

### For Contributors

#### 1. Authentication & Authorization

**DO:**

- ✅ Use HTTPS for all API communications
- ✅ Store tokens securely (httpOnly cookies or secure storage)
- ✅ Implement proper session management
- ✅ Use CSRF tokens for state-changing operations
- ✅ Implement rate limiting on authentication endpoints
- ✅ Use strong password requirements

**DON'T:**

- ❌ Store passwords in plain text
- ❌ Store sensitive data in localStorage (use sessionStorage or cookies)
- ❌ Trust client-side authentication alone
- ❌ Use weak or predictable tokens
- ❌ Expose authentication tokens in URLs

#### 2. Input Validation

**DO:**

- ✅ Validate all user inputs on client AND server
- ✅ Use Zod schemas for type-safe validation
- ✅ Sanitize HTML content before rendering
- ✅ Use parameterized queries (if applicable)
- ✅ Whitelist allowed characters/values

**DON'T:**

- ❌ Trust any user input
- ❌ Use regex alone for security validation
- ❌ Rely solely on client-side validation
- ❌ Use `dangerouslySetInnerHTML` without sanitization

**Example:**

```typescript
import DOMPurify from 'dompurify';

// ❌ BAD - XSS vulnerability
<div dangerouslySetInnerHTML={{ __html: userContent }} />

// ✅ GOOD - Sanitized content
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userContent) }} />
```

#### 3. Secrets Management

**DO:**

- ✅ Use environment variables for configuration
- ✅ Keep `.env` files out of version control
- ✅ Use `.env.example` for templates
- ✅ Rotate secrets regularly
- ✅ Use secret management services (AWS Secrets Manager, Vault)
- ✅ Encrypt sensitive data at rest

**DON'T:**

- ❌ Commit API keys, passwords, or tokens
- ❌ Hardcode secrets in source code
- ❌ Share secrets in chat or email
- ❌ Log secrets to console or files
- ❌ Include secrets in error messages

**Checking for Secrets:**

```bash
# Run before committing
git diff | grep -i "api_key\|password\|secret\|token"

# Use git-secrets tool
git secrets --scan
```

#### 4. Dependencies Security

**DO:**

- ✅ Run `npm audit` regularly (weekly minimum)
- ✅ Keep dependencies up to date
- ✅ Review dependency changes in PRs
- ✅ Use lock files (package-lock.json)
- ✅ Monitor security advisories
- ✅ Use Dependabot or Renovate for automated updates

**DON'T:**

- ❌ Ignore `npm audit` warnings
- ❌ Use packages with known vulnerabilities
- ❌ Install unnecessary dependencies
- ❌ Use unmaintained packages

**Commands:**

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities automatically
npm audit fix

# View detailed report
npm audit --json

# Check production dependencies only
npm audit --production
```

#### 5. XSS Prevention

**DO:**

- ✅ React automatically escapes content (use it!)
- ✅ Sanitize HTML if you must render it
- ✅ Validate URLs before rendering
- ✅ Use Content Security Policy (CSP)
- ✅ Encode output based on context

**DON'T:**

- ❌ Render raw HTML from user input
- ❌ Use `eval()` or `Function()` constructor
- ❌ Disable React's built-in XSS protection
- ❌ Trust data from external sources

**Example:**

```typescript
// ✅ GOOD - React escapes automatically
<div>{userInput}</div>

// ❌ BAD - Direct HTML injection
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ GOOD - If HTML is needed, sanitize it
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{
  __html: DOMPurify.sanitize(userInput, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong']
  })
}} />
```

#### 6. CSRF Protection

**DO:**

- ✅ Use anti-CSRF tokens
- ✅ Verify Origin/Referer headers
- ✅ Use SameSite cookie attribute
- ✅ Require re-authentication for sensitive actions

**Example:**

```typescript
// Set CSRF token in header
api.setHeader('X-CSRF-Token', csrfToken);

// Verify token on backend
```

#### 7. API Security

**DO:**

- ✅ Use HTTPS only
- ✅ Implement rate limiting
- ✅ Validate request payloads
- ✅ Use proper authentication headers
- ✅ Handle errors without exposing internals
- ✅ Set appropriate CORS policies

**DON'T:**

- ❌ Expose sensitive data in responses
- ❌ Include stack traces in production errors
- ❌ Use GET for state-changing operations
- ❌ Trust referer header for security

**Example:**

```typescript
// ✅ GOOD - Secure API configuration
const api = axios.create({
  baseURL: process.env.VITE_API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Send cookies
});

// Add auth token
api.interceptors.request.use((config) => {
  const token = getSecureToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

#### 8. Data Protection

**DO:**

- ✅ Minimize data collection
- ✅ Encrypt sensitive data
- ✅ Implement data retention policies
- ✅ Respect user privacy settings
- ✅ Comply with GDPR/CCPA requirements

**DON'T:**

- ❌ Store unnecessary personal data
- ❌ Log sensitive information
- ❌ Expose PII in URLs or logs
- ❌ Keep data longer than needed

## Security Checklist

### Before Every Commit

- [ ] No hardcoded secrets or API keys
- [ ] No sensitive data in logs
- [ ] User input is validated
- [ ] No new security warnings from ESLint
- [ ] Dependencies are up to date
- [ ] No `dangerouslySetInnerHTML` without sanitization

### Before Every PR

- [ ] Run `npm audit` and fix critical/high issues
- [ ] Security implications reviewed
- [ ] Authentication/authorization tested
- [ ] Input validation tested
- [ ] No secrets in diff
- [ ] Security-sensitive changes reviewed by security team

### Before Every Release

- [ ] Full security audit completed
- [ ] All dependencies updated
- [ ] Penetration testing performed
- [ ] Security documentation updated
- [ ] Incident response plan reviewed
- [ ] Monitoring and alerting configured

## Security Features

### Implemented Security Measures

1. **Content Security Policy (CSP)**
   - Defined in `public/index.html`
   - Restricts script sources
   - Prevents inline script execution

2. **HTTP Security Headers**
   - X-Content-Type-Options: nosniff
   - X-Frame-Options: DENY
   - Referrer-Policy: strict-origin-when-cross-origin

3. **Input Validation**
   - Zod schemas for all forms
   - Server-side validation required
   - Sanitization for HTML content

4. **Authentication**
   - JWT tokens with expiration
   - Secure token storage
   - Automatic token refresh
   - Session timeout

5. **API Security**
   - Request interceptors
   - Authentication headers
   - Error handling without data exposure
   - CORS configuration

6. **Dependency Security**
   - Regular audits
   - Automated vulnerability scanning
   - Dependency update policy

## Known Security Considerations

### Current Limitations

1. **Client-Side Security**
   - All client-side code is visible to users
   - Never rely on client-side checks for security
   - Always validate and authorize on server

2. **Token Storage**
   - Using localStorage for tokens (consider httpOnly cookies)
   - XSS can access localStorage
   - Plan: Migrate to secure cookies

3. **Rate Limiting**
   - Implement on API server
   - Client cannot enforce rate limits

## Security Testing

### Automated Security Testing

```bash
# Run security audit
npm audit

# Run with production dependencies only
npm audit --production

# Generate detailed report
npm audit --json > security-audit.json
```

### Manual Security Testing

**Regular Security Checks:**

1. **Weekly:**
   - Run `npm audit`
   - Review new dependencies
   - Check for security advisories

2. **Monthly:**
   - Review authentication flows
   - Test authorization boundaries
   - Check for exposed sensitive data
   - Review error messages
   - Test input validation

3. **Quarterly:**
   - Full security audit
   - Penetration testing
   - Update security documentation
   - Review and update dependencies

### Security Testing Tools

**Recommended Tools:**

- **OWASP ZAP** - Automated security testing
- **Snyk** - Dependency vulnerability scanning
- **SonarQube** - Code security analysis
- **npm audit** - Built-in vulnerability checker
- **Lighthouse** - Security best practices check

## Incident Response

### If You Discover a Vulnerability

1. **Stop immediately** - Don't exploit or expose it
2. **Report it** - Email security@example.com
3. **Document it** - Save all details
4. **Don't share** - Keep confidential until patched
5. **Help fix it** - Offer to assist with remediation

### If a Security Incident Occurs

1. **Alert the team** - Use `#security-alert` channel
2. **Assess impact** - What data/users are affected?
3. **Contain the threat** - Stop the attack if possible
4. **Preserve evidence** - Log files, screenshots
5. **Fix the vulnerability** - Deploy patch ASAP
6. **Notify users** - If their data is affected
7. **Document incident** - Write postmortem
8. **Learn and improve** - Update processes

### Incident Severity Levels

**Critical (P0):**

- Active breach or data leak
- Authentication bypass
- Remote code execution
- Response: Immediate (< 1 hour)

**High (P1):**

- SQL injection vulnerability
- Stored XSS
- Privilege escalation
- Response: Same day

**Medium (P2):**

- Reflected XSS
- CSRF vulnerability
- Information disclosure
- Response: Within 3 days

**Low (P3):**

- Minor security improvements
- Security hardening
- Response: Next sprint

## Security Contacts

### Internal Contacts

| Role          | Contact               | Use For                  |
| ------------- | --------------------- | ------------------------ |
| Security Team | deep@owlsy.dev        | Security vulnerabilities |
| DevOps Team   | deep@owlsy.dev        | Infrastructure security  |
| Team Lead     | deep@owlsy.dev        | Code-related security    |
| CTO           | team@startyoursaas.io | Major security incidents |

### Emergency Contacts

**For Critical Security Incidents:**

- 24/7 Hotline: +919812406053
- Emergency Email: deep@owlsy.dev
- Slack: `#security-emergency` (mention @security-team)

## Disclosure Policy

### Responsible Disclosure

We ask that:

1. **Give us time** - Allow 90 days to fix before public disclosure
2. **Work with us** - Coordinate disclosure timing
3. **Be professional** - Don't exploit vulnerabilities
4. **Respect privacy** - Don't access user data

### Recognition

We appreciate security researchers who:

- Report vulnerabilities responsibly
- Help us improve security
- Follow our disclosure policy

**Recognition options:**

- Listed in Hall of Fame (with permission)
- Acknowledgment in release notes
- Swag/rewards for significant findings

## Security Updates

### How We Communicate Security Updates

1. **Security Advisories** - GitHub Security Advisories
2. **Release Notes** - Detailed in CHANGELOG.md
3. **Email** - Critical updates sent to users
4. **Blog** - Security blog posts for major issues

### Subscribing to Security Updates

- Watch this repository on GitHub
- Subscribe to security advisories
- Follow our security blog
- Join `#security-announcements` Slack channel

## Security Resources

### For Developers

**Internal:**

- Security Wiki: [link]
- Security Training: [link]
- Secure Coding Guidelines: [link]

**External:**

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CWE Top 25](https://cwe.mitre.org/top25/)
- [React Security Best Practices](https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml)
- [npm Security Best Practices](https://docs.npmjs.com/packages-and-modules/securing-your-code)

### Security Checklists

#### Development Checklist

- [ ] No hardcoded secrets
- [ ] User input is validated and sanitized
- [ ] Authentication is required for protected routes
- [ ] Authorization checks are in place
- [ ] Errors don't expose sensitive information
- [ ] Dependencies are up to date
- [ ] No known vulnerabilities in dependencies
- [ ] Security headers are configured
- [ ] HTTPS is enforced
- [ ] Logging doesn't include sensitive data

#### Code Review Security Checklist

- [ ] No credentials in code
- [ ] Input validation is present
- [ ] Authentication checks are correct
- [ ] Authorization is properly enforced
- [ ] Sensitive data is encrypted
- [ ] Error handling doesn't leak information
- [ ] Dependencies are secure
- [ ] No unsafe functions used (eval, Function(), etc.)
- [ ] XSS prevention in place
- [ ] CSRF protection implemented

## Compliance

### Standards We Follow

- **OWASP** - Top 10 Web Application Security Risks
- **CWE** - Common Weakness Enumeration
- **GDPR** - General Data Protection Regulation (if applicable)
- **CCPA** - California Consumer Privacy Act (if applicable)
- **SOC 2** - Security compliance (if applicable)

### Regular Audits

- **Internal Audits:** Quarterly
- **External Audits:** Annually
- **Penetration Testing:** Bi-annually
- **Dependency Audits:** Weekly

## Security Hall of Fame

We recognize security researchers who have helped improve our security:

<!-- Names will be added here with permission -->

_No entries yet. Be the first to help us improve security!_

## Legal

### Safe Harbor

We support safe harbor for security researchers who:

1. Make good faith effort to avoid:
   - Privacy violations
   - Destruction of data
   - Service interruption

2. Only interact with test accounts you own
3. Don't exploit vulnerabilities beyond proof-of-concept
4. Report findings privately to our security team

### Bug Bounty Program

Status: **Coming Soon**

We're planning to launch a bug bounty program. Details will be announced at:

- [link to bug bounty page]

## Version History

| Version | Date       | Changes                 |
| ------- | ---------- | ----------------------- |
| 1.0.0   | 2025-12-22 | Initial security policy |

---

## Commitment

We are committed to:

- Protecting user data and privacy
- Maintaining secure code practices
- Responding to security issues promptly
- Transparent communication about security
- Continuous security improvement

**Thank you for helping keep our project secure!** 🔒

---

**Last Updated:** Description 2025  
**Next Review:** April 2025  
**Contact:** deep@owlsy.dev

For any security concerns, please contact us immediately at deep@owlsy.dev
