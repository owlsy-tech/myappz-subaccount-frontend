/**
 * Home Page Component
 * Landing page with sample form using React Hook Form and Zod validation
 */

import { usePerformanceMonitor, useMemoryLeakDetector } from '../../hooks';

const Home = () => {
  // Performance monitoring
  usePerformanceMonitor({
    componentName: 'Home',
    logSlowRenders: true,
    slowRenderThreshold: 16,
  });

  // Memory leak detection
  useMemoryLeakDetector({
    componentName: 'Home',
    enabled: import.meta.env.MODE === 'development',
  });

  return (
    <div
      style={{
        maxWidth: '600px',
        margin: '0 auto',
      }}
    >
      <header style={{ marginBottom: '2rem' }}>
        <h1
          style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#1a202c',
            marginBottom: '0.5rem',
          }}
        >
          Welcome to React Boilerplate
        </h1>
        <p style={{ fontSize: '1.125rem', color: '#718096', lineHeight: '1.6' }}>
          A production-ready React TypeScript boilerplate with modern tooling, comprehensive
          testing, performance monitoring, and best practices.
        </p>
      </header>

      <section
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '2rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          marginBottom: '2rem',
        }}
        aria-labelledby="features-heading"
      >
        <h2
          id="features-heading"
          style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#2d3748',
            marginBottom: '1rem',
          }}
        >
          Features
        </h2>
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'grid',
            gap: '0.75rem',
          }}
        >
          {[
            '✅ TypeScript with strict mode',
            '✅ ESLint + Prettier + Husky pre-commit hooks',
            '✅ React Router v6 for navigation',
            '✅ Zustand for state management',
            '✅ Axios with interceptors and retry logic',
            '✅ React Hook Form + Zod validation',
            '✅ Jest + React Testing Library (80%+ coverage)',
            '✅ Cypress for E2E testing',
            '✅ Performance monitoring with Web Vitals',
            '✅ Memory leak detection',
            '✅ GitHub Actions CI/CD pipeline',
            '✅ SonarQube integration',
            '✅ Error boundaries and logging',
          ].map((feature) => (
            <li
              key={feature}
              style={{
                padding: '0.5rem',
                color: '#4a5568',
                fontSize: '0.9rem',
              }}
            >
              {feature}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Home;
