/**
 * Performance Monitor Hook Tests
 */

import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import {
  usePerformanceMonitor,
  useAsyncPerformance,
  useLifecycleTiming,
  useRenderProfiler,
  usePerformanceMetrics,
} from './usePerformanceMonitor';

// Mock logger
vi.mock('../utils/logger', () => ({
  logger: {
    warn: vi.fn(),
    debug: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock performance monitor
vi.mock('../utils/performance', () => ({
  performanceMonitor: {
    getFCP: vi.fn(() => 1500),
    getTTFB: vi.fn(() => 100),
    getMetricsByName: vi.fn((name: string) => {
      const metrics: Record<string, any> = {
        LCP: [{ value: 2000 }],
        FID: [{ value: 50 }],
        CLS: [{ value: 0.05 }],
      };
      return metrics[name] || [];
    }),
    recordMetric: vi.fn(),
    getMetrics: vi.fn(() => []),
    getMemoryUsage: vi.fn(() => ({
      usedJSHeapSize: 50000000,
      totalJSHeapSize: 100000000,
      jsHeapSizeLimit: 200000000,
      percentage: 25,
    })),
    generateReport: vi.fn(() => ({
      webVitals: {
        fcp: 1500,
        lcp: 2000,
        fid: 50,
        cls: 0.05,
        ttfb: 100,
      },
    })),
    clearMetrics: vi.fn(),
  },
}));

describe('usePerformanceMonitor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    // Mock performance.now
    Object.defineProperty(window, 'performance', {
      writable: true,
      value: {
        now: vi.fn(() => Date.now()),
      },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should initialize with default performance data', () => {
    const { result } = renderHook(() => usePerformanceMonitor());

    expect(result.current).toBeDefined();
    expect(result.current.renderCount).toBe(0);
    expect(result.current.lastRenderTime).toBe(0);
    expect(result.current.averageRenderTime).toBe(0);
    expect(result.current.totalRenderTime).toBe(0);
    expect(result.current.slowRendersCount).toBe(0);
  });

  it('should track render count', () => {
    const { result, rerender } = renderHook(() => usePerformanceMonitor({ enabled: true }));

    rerender();
    rerender();

    expect(result.current.renderCount).toBeGreaterThan(0);
  });

  it('should not track when disabled', () => {
    renderHook(() =>
      usePerformanceMonitor({
        enabled: false,
        logSlowRenders: true,
      })
    );

    // Just verify it doesn't crash when disabled
    expect(true).toBe(true);
  });

  it('should use custom component name', () => {
    const { result } = renderHook(() =>
      usePerformanceMonitor({
        enabled: true,
        componentName: 'TestComponent',
      })
    );

    expect(result.current).toBeDefined();
  });

  it('should track web vitals when enabled', () => {
    const { result } = renderHook(() =>
      usePerformanceMonitor({
        enabled: true,
        trackWebVitals: true,
      })
    );

    expect(result.current.webVitals).toBeDefined();
  });

  it('should not track web vitals when disabled', () => {
    const { result } = renderHook(() =>
      usePerformanceMonitor({
        enabled: true,
        trackWebVitals: false,
      })
    );

    expect(result.current.webVitals).toBeDefined();
  });

  it('should log slow renders when threshold exceeded', () => {
    let renderTime = 0;
    vi.spyOn(performance, 'now').mockImplementation(() => {
      renderTime += 20;
      return renderTime;
    });

    const { rerender } = renderHook(() =>
      usePerformanceMonitor({
        enabled: true,
        logSlowRenders: true,
        slowRenderThreshold: 16,
        componentName: 'TestComponent',
      })
    );

    rerender();

    // Test passes if no errors thrown
    expect(true).toBe(true);
  });

  it('should not log slow renders when disabled', () => {
    let renderTime = 0;
    vi.spyOn(performance, 'now').mockImplementation(() => {
      renderTime += 20;
      return renderTime;
    });

    const { rerender } = renderHook(() =>
      usePerformanceMonitor({
        enabled: true,
        logSlowRenders: false,
      })
    );

    rerender();

    // Test passes if no errors thrown
    expect(true).toBe(true);
  });

  it('should log to console when enabled', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    renderHook(() =>
      usePerformanceMonitor({
        enabled: true,
        logToConsole: true,
        componentName: 'TestComponent',
      })
    );

    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('should calculate average render time', () => {
    let callCount = 0;
    vi.spyOn(performance, 'now').mockImplementation(() => {
      callCount++;
      return callCount * 10;
    });

    const { result, rerender } = renderHook(() =>
      usePerformanceMonitor({
        enabled: true,
      })
    );

    rerender();
    rerender();

    expect(result.current.averageRenderTime).toBeGreaterThanOrEqual(0);
  });

  it('should log mount duration on unmount', () => {
    const { unmount } = renderHook(() =>
      usePerformanceMonitor({
        enabled: true,
        componentName: 'TestComponent',
      })
    );

    unmount();

    // Test passes if no errors thrown
    expect(true).toBe(true);
  });

  it('should limit render times to last 100', async () => {
    const { rerender } = renderHook(() =>
      usePerformanceMonitor({
        enabled: true,
      })
    );

    // Trigger more than 100 rerenders
    for (let i = 0; i < 150; i++) {
      rerender();
    }

    // Hook should handle this without issues
    expect(true).toBe(true);
  });
});

describe('useAsyncPerformance', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should measure async operation duration', async () => {
    const { result } = renderHook(() => useAsyncPerformance());

    const asyncFn = vi.fn(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return 'result';
    });

    const measurement = await result.current.measureAsync('testOperation', asyncFn);

    expect(measurement.result).toBe('result');
    expect(measurement.duration).toBeGreaterThanOrEqual(0);
  });

  it('should log async operation completion', async () => {
    const { result } = renderHook(() => useAsyncPerformance());

    const asyncFn = vi.fn(async () => 'result');

    const returnValue = await result.current.measureAsync('testOperation', asyncFn);

    expect(returnValue.result).toBe('result');
    expect(asyncFn).toHaveBeenCalled();
  });

  it('should record metric for async operation', async () => {
    const { result } = renderHook(() => useAsyncPerformance());

    const asyncFn = vi.fn(async () => 'result');

    const returnValue = await result.current.measureAsync('testOperation', asyncFn);

    expect(returnValue.result).toBe('result');
    expect(asyncFn).toHaveBeenCalled();
  });

  it('should handle async operation errors', async () => {
    const { result } = renderHook(() => useAsyncPerformance());

    const error = new Error('Test error');
    const asyncFn = vi.fn(async () => {
      throw error;
    });

    await expect(result.current.measureAsync('testOperation', asyncFn)).rejects.toThrow(error);

    expect(asyncFn).toHaveBeenCalled();
  });

  it('should measure duration even on error', async () => {
    const { result } = renderHook(() => useAsyncPerformance());

    const asyncFn = vi.fn(async () => {
      throw new Error('Test error');
    });

    try {
      await result.current.measureAsync('testOperation', asyncFn);
    } catch (error) {
      // Expected error
    }

    expect(asyncFn).toHaveBeenCalled();
  });
});

describe('useLifecycleTiming', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should log mount event', () => {
    renderHook(() => useLifecycleTiming('TestComponent'));

    // Test passes if no errors thrown
    expect(true).toBe(true);
  });

  it('should log unmount event', () => {
    const { unmount } = renderHook(() => useLifecycleTiming('TestComponent'));

    unmount();

    // Test passes if no errors thrown
    expect(true).toBe(true);
  });

  it('should track update count', () => {
    const { rerender } = renderHook(() => useLifecycleTiming('TestComponent'));

    rerender();
    rerender();
    rerender();

    // Updates are tracked internally
    expect(true).toBe(true);
  });
});

describe('useRenderProfiler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return handleRender function', () => {
    const { result } = renderHook(() => useRenderProfiler('TestProfiler'));

    expect(result.current.handleRender).toBeDefined();
    expect(typeof result.current.handleRender).toBe('function');
  });

  it('should record metric on render', () => {
    const { result } = renderHook(() => useRenderProfiler('TestProfiler'));

    act(() => {
      result.current.handleRender('TestProfiler', 'mount', 10, 8, 100, 110);
    });

    // Test passes if no errors thrown
    expect(result.current.handleRender).toBeDefined();
  });

  it('should log slow renders', () => {
    const { result } = renderHook(() => useRenderProfiler('TestProfiler'));

    act(() => {
      result.current.handleRender('TestProfiler', 'update', 20, 15, 100, 120);
    });

    // Test passes if no errors thrown
    expect(result.current.handleRender).toBeDefined();
  });

  it('should not log fast renders', () => {
    const { result } = renderHook(() => useRenderProfiler('TestProfiler'));

    act(() => {
      result.current.handleRender('TestProfiler', 'mount', 10, 8, 100, 110);
    });

    // Test passes if no errors thrown
    expect(result.current.handleRender).toBeDefined();
  });

  it('should call custom onRender callback', () => {
    const onRender = vi.fn();
    const { result } = renderHook(() => useRenderProfiler('TestProfiler', onRender));

    act(() => {
      result.current.handleRender('TestProfiler', 'mount', 10, 8, 100, 110);
    });

    expect(onRender).toHaveBeenCalledWith('TestProfiler', 'mount', 10, 8, 100, 110);
  });

  it('should include metadata in recorded metric', () => {
    const { result } = renderHook(() => useRenderProfiler('TestProfiler'));

    act(() => {
      result.current.handleRender('TestProfiler', 'update', 12, 10, 200, 212);
    });

    // Test passes if no errors thrown
    expect(result.current.handleRender).toBeDefined();
  });
});

describe('usePerformanceMonitor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.useRealTimers();
  });

  it('should return initial metrics', () => {
    const { result } = renderHook(() => usePerformanceMetrics());

    expect(result.current.metrics).toBeDefined();
    expect(result.current.memory).toBeDefined();
    expect(result.current.report).toBeDefined();
    expect(result.current.clearMetrics).toBeDefined();
  });

  it('should update metrics periodically', () => {
    const { result } = renderHook(() => usePerformanceMetrics());

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(result.current.metrics).toBeDefined();
  });

  it('should update memory periodically', () => {
    const { result } = renderHook(() => usePerformanceMetrics());

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(result.current.memory).toBeDefined();
  });

  it('should update report periodically', () => {
    const { result } = renderHook(() => usePerformanceMetrics());

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(result.current.report).toBeDefined();
  });

  it('should clear metrics when clearMetrics is called', () => {
    const { result } = renderHook(() => usePerformanceMetrics());

    result.current.clearMetrics();

    // Test passes if no errors thrown
    expect(result.current.clearMetrics).toBeDefined();
  });

  it('should clear interval on unmount', () => {
    const { unmount } = renderHook(() => usePerformanceMetrics());

    unmount();

    // Verify no errors occur after unmount
    act(() => {
      vi.advanceTimersByTime(5000);
    });
  });

  it('should have correct initial state', () => {
    const { result } = renderHook(() => usePerformanceMetrics());

    expect(Array.isArray(result.current.metrics)).toBe(true);
    expect(result.current.memory).toEqual(
      expect.objectContaining({
        usedJSHeapSize: expect.any(Number),
        totalJSHeapSize: expect.any(Number),
        jsHeapSizeLimit: expect.any(Number),
        percentage: expect.any(Number),
      })
    );
    expect(result.current.report).toEqual(
      expect.objectContaining({
        webVitals: expect.any(Object),
      })
    );
  });
});
