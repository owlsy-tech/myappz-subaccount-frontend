/**
 * Vitest Setup Configuration
 * Configuration and global test utilities
 */

/* eslint-disable max-classes-per-file */

import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { expect, afterEach, vi, beforeAll, afterAll } from 'vitest';

// Clean up after each test automatically
afterEach(() => {
  cleanup();
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}

  disconnect() {}

  observe() {}

  takeRecords() {
    return [];
  }

  unobserve() {}
} as any;

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}

  disconnect() {}

  observe() {}

  unobserve() {}
} as any;

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: vi.fn((index: number) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock sessionStorage
const sessionStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: vi.fn((index: number) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    }),
  };
})();

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
});

// Mock performance methods
if (!window.performance.mark) {
  window.performance.mark = vi.fn();
}
if (!window.performance.measure) {
  window.performance.measure = vi.fn();
}
if (!window.performance.clearMarks) {
  window.performance.clearMarks = vi.fn();
}
if (!window.performance.clearMeasures) {
  window.performance.clearMeasures = vi.fn();
}

// Mock console methods to reduce noise in tests
const originalConsole = {
  error: console.error,
  warn: console.warn,
  log: console.log,
  debug: console.debug,
};

global.console = {
  ...console,
  error: vi.fn(),
  warn: vi.fn(),
  log: vi.fn(),
  debug: vi.fn(),
};

// Add custom matchers
expect.extend({
  toBeWithinRange(received: number, floor: number, ceiling: number) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () => `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      };
    }
    return {
      message: () => `expected ${received} to be within range ${floor} - ${ceiling}`,
      pass: false,
    };
  },
});

// Suppress specific React warnings in tests
beforeAll(() => {
  const originalError = console.error;
  console.error = vi.fn((...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render') ||
        args[0].includes('Not implemented: HTMLFormElement.prototype.submit'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  });
});

afterAll(() => {
  console.error = originalConsole.error;
  console.warn = originalConsole.warn;
  console.log = originalConsole.log;
  console.debug = originalConsole.debug;
});

// Clean up mocks after each test
afterEach(() => {
  vi.clearAllMocks();
  localStorageMock.clear();
  sessionStorageMock.clear();
});

// Mock environment variables for Vite
Object.defineProperty(import.meta, 'env', {
  value: {
    VITE_API_BASE_URL: 'https://api.test.example.com',
    VITE_ENV: 'test',
    MODE: 'test',
    DEV: false,
    PROD: false,
    SSR: false,
  },
  writable: true,
});

// Mock logger utility
vi.mock('./utils/logger', () => ({
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    getLogs: vi.fn(() => []),
    getLogsByLevel: vi.fn(() => []),
    clearLogs: vi.fn(),
    exportLogs: vi.fn(() => '[]'),
    downloadLogs: vi.fn(),
    createChild: vi.fn(() => ({
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    })),
    updateConfig: vi.fn(),
    getConfig: vi.fn(() => ({
      level: 0,
      enabled: false,
      persistLogs: false,
      maxLogs: 1000,
      remoteLogging: false,
    })),
  },
  Logger: vi.fn(),
  LogLevel: {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
    NONE: 4,
  },
  createLogger: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
}));

// Mock performance utility
vi.mock('./utils/performance', () => ({
  performanceMonitor: {
    recordMetric: vi.fn(),
    getMetrics: vi.fn(() => []),
    getMetricsByName: vi.fn(() => []),
    clearMetrics: vi.fn(),
    getMemoryUsage: vi.fn(() => ({
      usedJSHeapSize: 10000000,
      totalJSHeapSize: 20000000,
      jsHeapSizeLimit: 100000000,
      percentage: 10,
    })),
    getNavigationTiming: vi.fn(() => null),
    getResourceTimings: vi.fn(() => []),
    getTTFB: vi.fn(() => 100),
    getFCP: vi.fn(() => 1000),
    generateReport: vi.fn(() => ({
      webVitals: {
        fcp: 1000,
        lcp: 2000,
        fid: 50,
        cls: 0.05,
        ttfb: 100,
      },
      memory: {
        usedJSHeapSize: 10000000,
        totalJSHeapSize: 20000000,
        jsHeapSizeLimit: 100000000,
        percentage: 10,
      },
      navigation: null,
      resources: [],
      customMetrics: [],
    })),
    disconnect: vi.fn(),
  },
  PerformanceMonitor: vi.fn(),
  measureExecutionTime: vi.fn(async (name, fn) => {
    const result = await fn();
    return { result, duration: 10 };
  }),
  markPerformance: vi.fn(),
  measurePerformance: vi.fn(() => 100),
  logPerformance: vi.fn(),
  detectPerformanceIssues: vi.fn(() => []),
}));
