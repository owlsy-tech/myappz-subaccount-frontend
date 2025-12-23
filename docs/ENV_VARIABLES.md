# Environment Variables Reference

Quick reference guide for all environment variables used in this Vite-based React application.

## 🔑 Important Notes

1. **All client-side variables MUST be prefixed with `VITE_`** to be exposed to the browser
2. Variables are statically replaced at build time
3. Restart the dev server after changing `.env` files
4. Never commit sensitive values to version control

## 📋 Available Variables

### API Configuration

```bash
# Base URL for API requests
VITE_API_BASE_URL=https://api.example.com

# API request timeout in milliseconds
VITE_API_TIMEOUT=30000
```

### Application Environment

```bash
# Custom environment identifier
VITE_ENV=development
```

### Feature Flags

```bash
# Enable analytics tracking
VITE_ENABLE_ANALYTICS=false

# Enable error reporting to external service
VITE_ENABLE_ERROR_REPORTING=false

# Enable performance monitoring
VITE_ENABLE_PERFORMANCE_MONITORING=true
```

### Authentication

```bash
# Authentication domain
VITE_AUTH_DOMAIN=auth.example.com

# OAuth client ID
VITE_AUTH_CLIENT_ID=your_client_id_here
```

### Logging

```bash
# Log level: DEBUG, INFO, WARN, ERROR, NONE
VITE_LOG_LEVEL=debug

# Optional: Error reporting endpoint
VITE_ERROR_REPORTING_ENDPOINT=https://your-logging-service.com/api/logs
```

### Performance Monitoring

```bash
# Sample rate for performance monitoring (0.0 to 1.0)
VITE_PERFORMANCE_SAMPLE_RATE=1.0

# Memory leak check interval in milliseconds
VITE_MEMORY_LEAK_CHECK_INTERVAL=60000
```

### Testing

```bash
# Enable mock API responses
VITE_MOCK_API=false
```

### External Services (Optional)

```bash
# Sentry DSN for error tracking
VITE_SENTRY_DSN=

# Google Analytics tracking ID
VITE_GOOGLE_ANALYTICS_ID=

# Hotjar site ID
VITE_HOTJAR_ID=
```

### Application Version

```bash
# Application version (usually set by CI/CD)
VITE_VERSION=0.1.0
```

### Build Configuration (Non-prefixed)

These variables are used during build and are NOT exposed to the client:

```bash
# Generate source maps
GENERATE_SOURCEMAP=true

# Inline runtime chunk
INLINE_RUNTIME_CHUNK=false
```

## 🔍 Built-in Vite Variables

These are automatically available without configuration:

```typescript
import.meta.env.MODE; // 'development', 'production', or 'test'
import.meta.env.VITE_ENV; // 'development', 'production', or 'test'
import.meta.env.DEV; // true in development
import.meta.env.PROD; // true in production
import.meta.env.BASE_URL; // base URL of the app
import.meta.env.SSR; // true if running server-side
```

## 💻 Usage in Code

### Accessing Variables

```typescript
// ✅ Correct
const apiUrl = import.meta.env.VITE_API_BASE_URL;
const isDev = import.meta.env.MODE === 'development';

// ❌ Wrong - process.env doesn't work in Vite
const apiUrl = process.env.REACT_APP_API_BASE_URL;
const isDev = process.env.NODE_ENV === 'development';
```

### TypeScript Support

Type definitions are in `src/react-app-env.d.ts`:

```typescript
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_LOG_LEVEL: string;
  // ... etc
}
```

### Default Values

Always provide fallbacks for optional variables:

```typescript
const apiTimeout = Number(import.meta.env.VITE_API_TIMEOUT) || 30000;
const logLevel = import.meta.env.VITE_LOG_LEVEL || 'info';
```

## 📝 Environment Files

### File Priority (highest to lowest)

1. `.env.[mode].local` - Local overrides for specific mode
2. `.env.[mode]` - Mode-specific variables
3. `.env.local` - Local overrides (not committed)
4. `.env` - Default values (committed)

### Common Files

```
.env                # Default values (committed to git)
.env.local          # Local overrides (gitignored)
.env.development    # Development-specific
.env.production     # Production-specific
.env.test           # Test-specific
```

## 🚀 Deployment

### Development

```bash
npm run dev
# Uses .env.development + .env.local
```

### Production Build

```bash
npm run build
# Uses .env.production + .env.local
```

### Testing

```bash
npm test
# Uses .env.test + mocked values from setupTests.ts
```

## 🔒 Security Best Practices

1. **Never commit sensitive values** - Use `.env.local` for secrets
2. **Use different values per environment** - Development vs Production
3. **Rotate secrets regularly** - Especially API keys and tokens
4. **Limit exposed variables** - Only prefix with `VITE_` what's needed
5. **Use CI/CD secrets** - Store production values in deployment platform

## 📦 CI/CD Setup

### GitHub Actions Example

```yaml
env:
  VITE_API_BASE_URL: ${{ secrets.API_BASE_URL }}
  VITE_AUTH_CLIENT_ID: ${{ secrets.AUTH_CLIENT_ID }}
```

### Vercel/Netlify

Add environment variables in the deployment platform's dashboard:

- Go to Project Settings → Environment Variables
- Add each `VITE_*` variable with appropriate values
- Redeploy to apply changes

## 🐛 Troubleshooting

### Variable is undefined

- ✅ Check the variable name has `VITE_` prefix
- ✅ Restart dev server after adding new variables
- ✅ Verify the variable is defined in `.env` file
- ✅ Check for typos in variable name

### Wrong value in production

- ✅ Rebuild the application after changing variables
- ✅ Check deployment platform environment settings
- ✅ Verify `.env.production` is not overriding values

### TypeScript errors

- ✅ Add variable to `ImportMetaEnv` interface in `src/react-app-env.d.ts`
- ✅ Restart TypeScript server in your IDE

## 📚 Additional Resources

- [Vite Env Variables Docs](https://vitejs.dev/guide/env-and-mode.html)
- [Migration Guide](./VITE_ENV_MIGRATION.md)
- [Vite Configuration](./vite.config.ts)

---

**Last Updated**: 2025
**Maintained By**: Development Team
