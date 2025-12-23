/**
 * DEPRECATED: Jest Configuration
 *
 * This project has migrated from Jest to Vitest for better performance and
 * compatibility with Vite.
 *
 * Please refer to vitest.config.ts for the current test configuration.
 *
 * To run tests, use:
 *   npm run test          - Run tests once
 *   npm run test:watch    - Run tests in watch mode
 *   npm run test:ui       - Run tests with UI
 *   npm run test:coverage - Run tests with coverage report
 *
 * Migration Notes:
 * - All test files have been updated to use Vitest API (vi instead of jest)
 * - Test setup is configured in src/setupTests.ts
 * - Vitest globals are enabled in vitest.config.ts
 *
 * For more information about Vitest, visit: https://vitest.dev/
 */

console.warn(
  '\n⚠️  WARNING: jest.config.js is deprecated.\n' +
    '   This project now uses Vitest instead of Jest.\n' +
    '   Please refer to vitest.config.ts for test configuration.\n'
);

module.exports = {};
