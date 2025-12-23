/**
 * Error Boundary Component
 * Catches and handles React errors gracefully with fallback UI
 */

import { Component, ErrorInfo, ReactNode } from 'react';

import { logger } from '../../utils/logger';

interface IErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetKeys?: Array<string | number>;
}

interface IErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary Component
 * Provides error handling for React component tree
 */
class ErrorBoundary extends Component<IErrorBoundaryProps, IErrorBoundaryState> {
  constructor(props: IErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  /**
   * Update state when error is caught
   */
  static getDerivedStateFromError(error: Error): Partial<IErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  /**
   * Reset error state when props change
   */
  override componentDidUpdate(prevProps: IErrorBoundaryProps): void {
    const { resetKeys } = this.props;
    const { hasError } = this.state;

    if (!resetKeys) return;

    const hasResetKeyChanged = resetKeys.some((key, index) => key !== prevProps.resetKeys?.[index]);

    if (hasResetKeyChanged && hasError) {
      this.resetError();
    }
  }

  /**
   * Log error details
   */
  override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const { onError } = this.props;

    // Log error
    logger.error('Error caught by boundary', {
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name,
      },
      errorInfo: {
        componentStack: errorInfo.componentStack,
      },
    });

    // Update state with error info
    this.setState({
      errorInfo,
    });

    // Call custom error handler
    if (onError) {
      onError(error, errorInfo);
    }

    // Report to error tracking service in production
    if (import.meta.env.MODE === 'production') {
      // Send to error tracking service (e.g., Sentry)
      // Example: Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo.componentStack } } });
    }
  }

  /**
   * Reset error state
   */
  private resetError = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  /**
   * Reload the page
   */
  // eslint-disable-next-line class-methods-use-this
  private handleReload = (): void => {
    window.location.reload();
  };

  /**
   * Render fallback UI or children
   */
  override render(): ReactNode {
    const { hasError, error, errorInfo } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback;
      }

      // Default error UI
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '2rem',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            backgroundColor: '#f7fafc',
          }}
          role="alert"
          aria-live="assertive"
        >
          <div
            style={{
              maxWidth: '600px',
              width: '100%',
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '2rem',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '1.5rem',
              }}
            >
              <svg
                style={{
                  width: '48px',
                  height: '48px',
                  color: '#f56565',
                  marginRight: '1rem',
                }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <h1
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#2d3748',
                  margin: 0,
                }}
              >
                Something went wrong
              </h1>
            </div>

            <p
              style={{
                color: '#4a5568',
                marginBottom: '1.5rem',
                lineHeight: '1.6',
              }}
            >
              We apologize for the inconvenience. An unexpected error has occurred. Our team has
              been notified and is working to fix the issue.
            </p>

            {import.meta.env.MODE === 'development' && error && (
              <div
                style={{
                  backgroundColor: '#fed7d7',
                  border: '1px solid #fc8181',
                  borderRadius: '4px',
                  padding: '1rem',
                  marginBottom: '1.5rem',
                }}
              >
                <h2
                  style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#742a2a',
                    marginTop: 0,
                    marginBottom: '0.5rem',
                  }}
                >
                  Error Details (Development Only)
                </h2>
                <p
                  style={{
                    color: '#742a2a',
                    fontSize: '0.875rem',
                    marginBottom: '0.5rem',
                    fontWeight: '600',
                  }}
                >
                  {error.toString()}
                </p>
                {errorInfo && (
                  <details style={{ marginTop: '0.5rem' }}>
                    <summary
                      style={{
                        cursor: 'pointer',
                        color: '#742a2a',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                      }}
                    >
                      Component Stack
                    </summary>
                    <pre
                      style={{
                        marginTop: '0.5rem',
                        padding: '0.5rem',
                        backgroundColor: '#fff5f5',
                        borderRadius: '4px',
                        overflow: 'auto',
                        fontSize: '0.75rem',
                        color: '#742a2a',
                      }}
                    >
                      {errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            <div
              style={{
                display: 'flex',
                gap: '1rem',
                flexWrap: 'wrap',
              }}
            >
              <button
                onClick={this.resetError}
                style={{
                  backgroundColor: '#4299e1',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '0.75rem 1.5rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#3182ce';
                }}
                onFocus={(e) => {
                  e.currentTarget.style.backgroundColor = '#3182ce';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#4299e1';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.backgroundColor = '#4299e1';
                }}
                type="button"
              >
                Try Again
              </button>

              <button
                onClick={this.handleReload}
                style={{
                  backgroundColor: '#edf2f7',
                  color: '#2d3748',
                  border: '1px solid #cbd5e0',
                  borderRadius: '4px',
                  padding: '0.75rem 1.5rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#e2e8f0';
                }}
                onFocus={(e) => {
                  e.currentTarget.style.backgroundColor = '#e2e8f0';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#edf2f7';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.backgroundColor = '#edf2f7';
                }}
                type="button"
              >
                Reload Page
              </button>

              <button
                onClick={() => {
                  window.location.href = '/';
                }}
                style={{
                  backgroundColor: '#edf2f7',
                  color: '#2d3748',
                  border: '1px solid #cbd5e0',
                  borderRadius: '4px',
                  padding: '0.75rem 1.5rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#e2e8f0';
                }}
                onFocus={(e) => {
                  e.currentTarget.style.backgroundColor = '#e2e8f0';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#edf2f7';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.backgroundColor = '#edf2f7';
                }}
                type="button"
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
