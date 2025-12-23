/**
 * PerformanceMonitor Component Tests
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import PerformanceMonitor from './PerformanceMonitor';

// Create mock functions
const mockUsePerformanceMetrics = vi.fn();
const mockDetectPerformanceIssues = vi.fn();

// Mock the hooks and utils before imports
vi.mock('../../hooks', () => ({
  usePerformanceMetrics: () => mockUsePerformanceMetrics(),
}));

vi.mock('../../utils/performance', () => ({
  detectPerformanceIssues: (monitor: unknown) => mockDetectPerformanceIssues(monitor),
  performanceMonitor: {
    getMetrics: vi.fn(() => []),
    getMemoryUsage: vi.fn(() => null),
    generateReport: vi.fn(() => ({ webVitals: {} })),
    clearMetrics: vi.fn(),
  },
}));

describe('PerformanceMonitor', () => {
  const originalEnv = import.meta.env.VITE_ENV;

  const defaultMockReturn = {
    metrics: [],
    memory: {
      usedJSHeapSize: 50000000,
      totalJSHeapSize: 100000000,
      jsHeapSizeLimit: 200000000,
      percentage: 25,
    },
    report: {
      webVitals: {
        fcp: 1500,
        lcp: 2000,
        fid: 50,
        cls: 0.05,
        ttfb: 100,
      },
    },
    clearMetrics: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    // Set environment to development
    import.meta.env.VITE_ENV = 'development';
    // Set default mock return
    mockUsePerformanceMetrics.mockReturnValue(defaultMockReturn);
    mockDetectPerformanceIssues.mockReturnValue([]);
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    import.meta.env.VITE_ENV = originalEnv;
  });

  it('should render without crashing', () => {
    render(<PerformanceMonitor />);
    expect(screen.getByText(/Performance Monitor/i)).toBeInTheDocument();
  });

  it('should not render in non-development environment', () => {
    import.meta.env.VITE_ENV = 'production';
    const { container } = render(<PerformanceMonitor />);
    expect(container.firstChild).toBeNull();
  });

  it('should render with default position (bottom-right)', () => {
    const { container } = render(<PerformanceMonitor />);
    const monitor = container.firstChild as HTMLElement;

    expect(monitor).toHaveStyle({
      position: 'fixed',
      bottom: '1rem',
      right: '1rem',
    });
  });

  it('should render with custom position (top-left)', () => {
    const { container } = render(<PerformanceMonitor position="top-left" />);
    const monitor = container.firstChild as HTMLElement;

    expect(monitor).toHaveStyle({
      position: 'fixed',
      top: '1rem',
      left: '1rem',
    });
  });

  it('should render with custom position (top-right)', () => {
    const { container } = render(<PerformanceMonitor position="top-right" />);
    const monitor = container.firstChild as HTMLElement;

    expect(monitor).toHaveStyle({
      position: 'fixed',
      top: '1rem',
      right: '1rem',
    });
  });

  it('should render with custom position (bottom-left)', () => {
    const { container } = render(<PerformanceMonitor position="bottom-left" />);
    const monitor = container.firstChild as HTMLElement;

    expect(monitor).toHaveStyle({
      position: 'fixed',
      bottom: '1rem',
      left: '1rem',
    });
  });

  it('should render minimized initially when minimized prop is true', () => {
    render(<PerformanceMonitor minimized={true} />);
    expect(screen.queryByText('Web Vitals')).not.toBeInTheDocument();
  });

  it('should toggle minimize state when button is clicked', () => {
    render(<PerformanceMonitor />);

    const minimizeButton = screen.getByRole('button', { name: /Minimize performance monitor/i });
    fireEvent.click(minimizeButton);

    expect(screen.queryByText('Web Vitals')).not.toBeInTheDocument();
  });

  it('should expand when minimized and expand button is clicked', () => {
    render(<PerformanceMonitor minimized={true} />);

    const expandButton = screen.getByRole('button', { name: /Expand performance monitor/i });
    fireEvent.click(expandButton);

    expect(screen.getByText('Web Vitals')).toBeInTheDocument();
  });

  it('should render Web Vitals section', () => {
    render(<PerformanceMonitor />);
    expect(screen.getByText('Web Vitals')).toBeInTheDocument();
  });

  it('should render FCP metric', () => {
    render(<PerformanceMonitor />);
    expect(screen.getByText(/FCP:/i)).toBeInTheDocument();
  });

  it('should render LCP metric', () => {
    render(<PerformanceMonitor />);
    expect(screen.getByText(/LCP:/i)).toBeInTheDocument();
  });

  it('should render FID metric', () => {
    render(<PerformanceMonitor />);
    expect(screen.getByText(/FID:/i)).toBeInTheDocument();
  });

  it('should render CLS metric', () => {
    render(<PerformanceMonitor />);
    expect(screen.getByText(/CLS:/i)).toBeInTheDocument();
  });

  it('should render Memory Usage section', () => {
    render(<PerformanceMonitor />);
    expect(screen.getByText('Memory Usage')).toBeInTheDocument();
  });

  it('should render memory used value', () => {
    render(<PerformanceMonitor />);
    expect(screen.getByText(/Used:/i)).toBeInTheDocument();
  });

  it('should render memory total value', () => {
    render(<PerformanceMonitor />);
    expect(screen.getByText(/Total:/i)).toBeInTheDocument();
  });

  it('should render memory status', () => {
    render(<PerformanceMonitor />);
    expect(screen.getByText(/Status:/i)).toBeInTheDocument();
  });

  it('should display correct memory values in MB', () => {
    render(<PerformanceMonitor />);
    expect(screen.getByText(/47\.68 MB/i)).toBeInTheDocument(); // 50000000 / 1024 / 1024
  });

  it('should not render memory section when memory is null', () => {
    mockUsePerformanceMetrics.mockReturnValue({
      ...defaultMockReturn,
      memory: null,
    });

    render(<PerformanceMonitor />);
    expect(screen.queryByText('Memory Usage')).not.toBeInTheDocument();
  });

  it('should render performance issues when detected', () => {
    mockDetectPerformanceIssues.mockReturnValue(['Slow render detected', 'High memory usage']);

    render(<PerformanceMonitor />);

    expect(screen.getByText(/Issues Detected/i)).toBeInTheDocument();
    expect(screen.getByText('Slow render detected')).toBeInTheDocument();
    expect(screen.getByText('High memory usage')).toBeInTheDocument();
  });

  it('should not render issues section when no issues detected', () => {
    mockDetectPerformanceIssues.mockReturnValue([]);

    render(<PerformanceMonitor />);
    expect(screen.queryByText(/Issues Detected/i)).not.toBeInTheDocument();
  });

  it('should limit issues display to 3 items', () => {
    mockDetectPerformanceIssues.mockReturnValue([
      'Issue 1',
      'Issue 2',
      'Issue 3',
      'Issue 4',
      'Issue 5',
    ]);

    render(<PerformanceMonitor />);

    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(3);
  });

  it('should update issues when metrics change', () => {
    mockDetectPerformanceIssues.mockReturnValue(['Issue 1']);

    const { rerender } = render(<PerformanceMonitor />);

    // Update mock to return different metrics
    mockUsePerformanceMetrics.mockReturnValue({
      metrics: [{ name: 'test', value: 100 }],
      memory: {
        usedJSHeapSize: 50000000,
        totalJSHeapSize: 100000000,
        jsHeapSizeLimit: 200000000,
        percentage: 25,
      },
      report: {
        webVitals: {
          fcp: 1500,
          lcp: 2000,
          fid: 50,
          cls: 0.05,
          ttfb: 100,
        },
      },
      clearMetrics: vi.fn(),
    });

    rerender(<PerformanceMonitor />);

    expect(mockDetectPerformanceIssues).toHaveBeenCalled();
  });

  it('should render metric with Good status when below threshold', () => {
    render(<PerformanceMonitor />);
    // FCP of 1500ms is below 1800ms threshold
    const goodStatuses = screen.getAllByText('(Good)');
    expect(goodStatuses.length).toBeGreaterThan(0);
  });

  it('should render metric with N/A status when value is null', () => {
    mockUsePerformanceMetrics.mockReturnValue({
      ...defaultMockReturn,
      report: {
        webVitals: {
          fcp: null,
          lcp: null,
          fid: null,
          cls: null,
          ttfb: null,
        },
      },
    });

    render(<PerformanceMonitor />);
    expect(screen.getAllByText('N/A').length).toBeGreaterThan(0);
  });

  it('should show Normal memory status for low percentage', () => {
    render(<PerformanceMonitor />);
    expect(screen.getByText('Normal (25.0%)')).toBeInTheDocument();
  });

  it('should show Medium memory status for medium percentage', () => {
    mockUsePerformanceMetrics.mockReturnValue({
      ...defaultMockReturn,
      memory: {
        usedJSHeapSize: 130000000,
        totalJSHeapSize: 150000000,
        jsHeapSizeLimit: 200000000,
        percentage: 65,
      },
    });

    render(<PerformanceMonitor />);
    expect(screen.getByText('Medium (65.0%)')).toBeInTheDocument();
  });

  it('should show High memory status for high percentage', () => {
    mockUsePerformanceMetrics.mockReturnValue({
      ...defaultMockReturn,
      memory: {
        usedJSHeapSize: 180000000,
        totalJSHeapSize: 190000000,
        jsHeapSizeLimit: 200000000,
        percentage: 90,
      },
    });

    render(<PerformanceMonitor />);
    expect(screen.getByText('High (90.0%)')).toBeInTheDocument();
  });

  it('should render memory progress bar', () => {
    render(<PerformanceMonitor />);
    const progressBar = screen.getByRole('progressbar', { name: /Memory usage percentage/i });

    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute('aria-valuenow', '25');
    expect(progressBar).toHaveAttribute('aria-valuemin', '0');
    expect(progressBar).toHaveAttribute('aria-valuemax', '100');
  });

  it('should have proper ARIA labels', () => {
    render(<PerformanceMonitor />);

    const complementary = screen.getByRole('complementary', { name: /Performance metrics/i });
    expect(complementary).toBeInTheDocument();
  });

  it('should apply correct decimals to metrics', () => {
    render(<PerformanceMonitor />);
    // CLS should show 3 decimals
    expect(screen.getByText(/0\.050/i)).toBeInTheDocument();
  });

  it('should have monospace font family', () => {
    const { container } = render(<PerformanceMonitor />);
    const monitor = container.firstChild as HTMLElement;

    expect(monitor).toHaveStyle({
      fontFamily: 'monospace',
    });
  });

  it('should show Fair status for metrics above threshold but below 1.5x', () => {
    mockUsePerformanceMetrics.mockReturnValue({
      ...defaultMockReturn,
      report: {
        webVitals: {
          fcp: 2000, // Above 1800ms threshold
          lcp: 3000,
          fid: 120,
          cls: 0.12,
          ttfb: 100,
        },
      },
    });

    render(<PerformanceMonitor />);
    const fairStatuses = screen.getAllByText('(Fair)');
    expect(fairStatuses.length).toBeGreaterThan(0);
  });

  it('should show Poor status for metrics above 1.5x threshold', () => {
    mockUsePerformanceMetrics.mockReturnValue({
      ...defaultMockReturn,
      report: {
        webVitals: {
          fcp: 3000, // Above 1.5 * 1800ms threshold
          lcp: 4000,
          fid: 200,
          cls: 0.2,
          ttfb: 100,
        },
      },
    });

    render(<PerformanceMonitor />);
    const poorStatuses = screen.getAllByText('(Poor)');
    expect(poorStatuses.length).toBeGreaterThan(0);
  });

  it('should render MetricRow component correctly', () => {
    render(<PerformanceMonitor />);

    // Check that metric rows display label, value, unit, and status
    const fcpRow = screen.getByText(/FCP:/i).parentElement;
    expect(fcpRow).toHaveTextContent('1500');
    expect(fcpRow).toHaveTextContent('ms');
    expect(fcpRow).toHaveTextContent('(Good)');
  });
});
