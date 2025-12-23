/**
 * Error Boundary Tests
 * Unit tests for ErrorBoundary component
 */

import { ErrorInfo } from 'react';

import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';

import ErrorBoundary from './ErrorBoundary';

// Component that throws an error
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

describe('ErrorBoundary', () => {
  // Suppress console errors in tests
  const originalError = console.error;
  beforeAll(() => {
    console.error = vi.fn();
  });

  afterAll(() => {
    console.error = originalError;
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Normal Rendering', () => {
    it('should render children when no error occurs', () => {
      render(
        <ErrorBoundary>
          <div data-testid="child">Child Component</div>
        </ErrorBoundary>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
      expect(screen.getByText('Child Component')).toBeInTheDocument();
    });

    it('should not render error UI when no error', () => {
      render(
        <ErrorBoundary>
          <div>Normal content</div>
        </ErrorBoundary>
      );

      expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should display error UI when child throws error', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow />
        </ErrorBoundary>
      );

      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('should display error message in error UI', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow />
        </ErrorBoundary>
      );

      expect(
        screen.getByText(/We apologize for the inconvenience. An unexpected error has occurred/)
      ).toBeInTheDocument();
    });

    it('should render action buttons in error UI', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow />
        </ErrorBoundary>
      );

      expect(screen.getByText('Try Again')).toBeInTheDocument();
      expect(screen.getByText('Reload Page')).toBeInTheDocument();
      expect(screen.getByText('Go to Home')).toBeInTheDocument();
    });
  });

  describe('Custom Fallback', () => {
    it('should render custom fallback when provided', () => {
      const CustomFallback = <div data-testid="custom-fallback">Custom Error UI</div>;

      render(
        <ErrorBoundary fallback={CustomFallback}>
          <ThrowError shouldThrow />
        </ErrorBoundary>
      );

      expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
      expect(screen.getByText('Custom Error UI')).toBeInTheDocument();
      expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
    });
  });

  describe('Error Callback', () => {
    it('should call onError callback when error occurs', () => {
      const onError = vi.fn();

      render(
        <ErrorBoundary onError={onError}>
          <ThrowError shouldThrow />
        </ErrorBoundary>
      );

      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          componentStack: expect.any(String),
        })
      );
    });

    it('should pass correct error details to callback', () => {
      const onError = vi.fn();

      render(
        <ErrorBoundary onError={onError}>
          <ThrowError shouldThrow />
        </ErrorBoundary>
      );

      const [error, errorInfo] = onError.mock.calls[0] as [Error, ErrorInfo];
      expect(error.message).toBe('Test error');
      expect(errorInfo.componentStack).toBeTruthy();
    });
  });

  describe('Reset Keys', () => {
    it('should reset error when reset keys change', () => {
      const { rerender } = render(
        <ErrorBoundary resetKeys={['key1']}>
          <ThrowError shouldThrow />
        </ErrorBoundary>
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();

      // Change reset key and render non-throwing component
      rerender(
        <ErrorBoundary resetKeys={['key2']}>
          <div data-testid="recovered">Recovered</div>
        </ErrorBoundary>
      );

      expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
      expect(screen.getByTestId('recovered')).toBeInTheDocument();
    });

    it('should not reset error when reset keys stay the same', () => {
      const { rerender } = render(
        <ErrorBoundary resetKeys={['key1']}>
          <ThrowError shouldThrow />
        </ErrorBoundary>
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();

      // Rerender with same reset key
      rerender(
        <ErrorBoundary resetKeys={['key1']}>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow />
        </ErrorBoundary>
      );

      const alert = screen.getByRole('alert');
      expect(alert).toHaveAttribute('aria-live', 'assertive');
    });

    it('should have focusable action buttons', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow />
        </ErrorBoundary>
      );

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
      buttons.forEach((button) => {
        expect(button).toHaveAttribute('type', 'button');
      });
    });
  });

  describe('Development Mode', () => {
    const originalMode = import.meta.env.MODE;

    afterEach(() => {
      import.meta.env.MODE = originalMode;
      vi.unstubAllEnvs();
    });

    it('should show error details in development mode', () => {
      vi.stubEnv('MODE', 'development');

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow />
        </ErrorBoundary>
      );

      expect(screen.getByText('Error Details (Development Only)')).toBeInTheDocument();
      expect(screen.getByText(/Error: Test error/)).toBeInTheDocument();
    });

    it('should not show error details in production mode', () => {
      vi.stubEnv('MODE', 'production');

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow />
        </ErrorBoundary>
      );

      expect(screen.queryByText('Error Details (Development Only)')).not.toBeInTheDocument();
    });
  });
});
