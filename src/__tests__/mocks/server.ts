/**
 * Mock Service Worker (MSW) Server Setup
 * Configures MSW for use in Node.js test environment
 */

import { setupServer } from 'msw/node';

import { handlers } from './handlers';

/**
 * Setup MSW server with default handlers
 */
export const server = setupServer(...handlers);

/**
 * Start server before all tests
 */
export const startServer = () => {
  server.listen({
    onUnhandledRequest: 'warn',
  });
};

/**
 * Reset handlers after each test
 */
export const resetServer = () => {
  server.resetHandlers();
};

/**
 * Close server after all tests
 */
export const closeServer = () => {
  server.close();
};

/**
 * Add runtime request handlers
 */
export const addHandler = (...newHandlers: Parameters<typeof server.use>) => {
  server.use(...newHandlers);
};

/**
 * Reset and replace all handlers
 */
export const replaceHandlers = (...newHandlers: Parameters<typeof server.use>) => {
  server.resetHandlers(...newHandlers);
};

/**
 * Export default server instance
 */
export default server;
