/**
 * Test Utilities
 * Custom render functions and utilities for testing React components
 */

import { ReactElement, ReactNode } from 'react';

import { render, RenderOptions, RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

/**
 * Options for custom render function
 */
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialEntries?: string[];
  route?: string;
  withRouter?: boolean;
}

/**
 * All providers wrapper
 */
interface AllProvidersProps {
  children: ReactNode;
  initialEntries?: string[];
  withRouter?: boolean;
}

const AllProviders = ({
  children,
  initialEntries = ['/'],
  withRouter = true,
}: AllProvidersProps) => {
  if (!withRouter) {
    return <>{children}</>;
  }

  if (initialEntries.length > 0) {
    return <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>;
  }

  return <BrowserRouter>{children}</BrowserRouter>;
};

/**
 * Custom render function that wraps components with necessary providers
 */
export const renderWithProviders = (
  ui: ReactElement,
  options: CustomRenderOptions = {}
): RenderResult => {
  const { initialEntries = ['/'], route = '/', withRouter = true, ...renderOptions } = options;

  // Set the initial route if specified
  if (route && withRouter) {
    window.history.pushState({}, 'Test page', route);
  }

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <AllProviders initialEntries={initialEntries} withRouter={withRouter}>
      {children}
    </AllProviders>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

/**
 * Render with router only
 */
export const renderWithRouter = (
  ui: ReactElement,
  options: CustomRenderOptions = {}
): RenderResult => {
  return renderWithProviders(ui, { ...options, withRouter: true });
};

/**
 * Render without any providers (pure component testing)
 */
export const renderPure = (ui: ReactElement, options?: RenderOptions): RenderResult => {
  return render(ui, options);
};

/**
 * Setup user event with component
 */
export const setupUser = () => {
  return userEvent.setup();
};

/**
 * Wait for a condition to be true
 */
export const waitForCondition = async (
  condition: () => boolean,
  timeout = 3000,
  interval = 100
): Promise<void> => {
  const startTime = Date.now();

  while (!condition()) {
    if (Date.now() - startTime > timeout) {
      throw new Error('Timeout waiting for condition');
    }
    await new Promise((resolve) => setTimeout(resolve, interval));
  }
};

/**
 * Mock window.matchMedia
 */
export const mockMatchMedia = (matches: boolean) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
};

/**
 * Mock window.scrollTo
 */
export const mockScrollTo = () => {
  Object.defineProperty(window, 'scrollTo', {
    writable: true,
    value: vi.fn(),
  });
};

/**
 * Mock IntersectionObserver
 */
export const mockIntersectionObserver = () => {
  globalThis.IntersectionObserver = class IntersectionObserver {
    constructor() {}

    disconnect() {}

    observe() {}

    takeRecords() {
      return [];
    }

    unobserve() {}
  } as any;
};

/**
 * Create mock event
 */
export const createMockEvent = <T extends Event>(type: string, properties?: Partial<T>): T => {
  const event = new Event(type) as T;
  if (properties) {
    Object.assign(event, properties);
  }
  return event;
};

/**
 * Create mock file
 */
export const createMockFile = (
  name: string,
  size: number,
  type: string,
  content?: string
): File => {
  const blob = new Blob([content || ''], { type });
  const file = new File([blob], name, { type });
  Object.defineProperty(file, 'size', { value: size });
  return file;
};

/**
 * Mock localStorage
 */
export const mockLocalStorage = () => {
  const store: Record<string, string> = {};

  const localStorageMock = {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      Object.keys(store).forEach((key) => delete store[key]);
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: vi.fn((index: number) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    }),
  };

  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true,
  });

  return localStorageMock;
};

/**
 * Mock sessionStorage
 */
export const mockSessionStorage = () => {
  const store: Record<string, string> = {};

  const sessionStorageMock = {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      Object.keys(store).forEach((key) => delete store[key]);
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: vi.fn((index: number) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    }),
  };

  Object.defineProperty(window, 'sessionStorage', {
    value: sessionStorageMock,
    writable: true,
  });

  return sessionStorageMock;
};

/**
 * Suppress console errors/warnings in tests
 */
export const suppressConsole = (methods: ('error' | 'warn' | 'log' | 'debug')[] = ['error']) => {
  const originalConsole: Partial<Console> = {};

  methods.forEach((method) => {
    originalConsole[method] = console[method];
    console[method] = vi.fn() as any;
  });

  return () => {
    methods.forEach((method) => {
      if (originalConsole[method]) {
        console[method] = originalConsole[method] as any;
      }
    });
  };
};

/**
 * Wait for async operations to complete
 */
export const flushPromises = () => {
  return new Promise((resolve) => setTimeout(resolve));
};

/**
 * Delay execution
 */
export const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Re-export everything from @testing-library/react
 */
export * from '@testing-library/react';
export { userEvent };

/**
 * Export custom render as default
 */
export { renderWithProviders as render };
