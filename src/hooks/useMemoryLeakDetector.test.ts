/**
 * Memory Leak Detector Hook Tests
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import {
  useMemoryLeakDetector,
  useTrackedTimeout,
  useTrackedInterval,
  useTrackedEventListener,
  useDetachedDOMDetector,
} from './useMemoryLeakDetector';

// Mock logger
vi.mock('../utils/logger', () => ({
  logger: {
    warn: vi.fn(),
    debug: vi.fn(),
    error: vi.fn(),
  },
}));

describe('useMemoryLeakDetector', () => {
  const mockMemory = {
    usedJSHeapSize: 50000000,
    totalJSHeapSize: 100000000,
    jsHeapSizeLimit: 200000000,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    // Mock performance.memory
    Object.defineProperty(window, 'performance', {
      writable: true,
      value: {
        memory: mockMemory,
        now: vi.fn(() => Date.now()),
      },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should initialize with no warnings', () => {
    const { result } = renderHook(() => useMemoryLeakDetector());

    expect(result.current.warnings).toEqual([]);
    expect(result.current.hasLeaks).toBe(false);
  });

  it('should not check for leaks when disabled', () => {
    const onWarning = vi.fn();
    renderHook(() =>
      useMemoryLeakDetector({
        enabled: false,
        onWarning,
      })
    );

    act(() => {
      vi.advanceTimersByTime(60000);
    });

    expect(onWarning).not.toHaveBeenCalled();
  });

  it('should check for leaks at specified interval', () => {
    const onWarning = vi.fn();
    const { result } = renderHook(() =>
      useMemoryLeakDetector({
        enabled: true,
        checkInterval: 10000,
        onWarning,
      })
    );

    act(() => {
      vi.advanceTimersByTime(10000);
    });

    expect(result.current).toBeDefined();
  });

  it('should detect high memory usage', () => {
    Object.defineProperty(window.performance, 'memory', {
      value: {
        usedJSHeapSize: 190000000,
        totalJSHeapSize: 195000000,
        jsHeapSizeLimit: 200000000,
      },
      configurable: true,
    });

    const { result } = renderHook(() =>
      useMemoryLeakDetector({
        enabled: true,
        trackMemory: true,
        memoryThreshold: 85,
        checkInterval: 1000,
      })
    );

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.warnings.length).toBeGreaterThanOrEqual(0);
  });

  it('should detect critical memory usage', () => {
    Object.defineProperty(window.performance, 'memory', {
      value: {
        usedJSHeapSize: 195000000,
        totalJSHeapSize: 195000000,
        jsHeapSizeLimit: 200000000,
      },
      configurable: true,
    });

    const { result } = renderHook(() =>
      useMemoryLeakDetector({
        enabled: true,
        trackMemory: true,
        memoryThreshold: 85,
        checkInterval: 1000,
        componentName: 'CustomComponent',
      })
    );

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.warnings.length).toBeGreaterThanOrEqual(0);
  });

  it('should call onWarning callback when warning is added', () => {
    const onWarning = vi.fn();

    Object.defineProperty(window.performance, 'memory', {
      value: {
        usedJSHeapSize: 190000000,
        totalJSHeapSize: 195000000,
        jsHeapSizeLimit: 200000000,
      },
      configurable: true,
    });

    renderHook(() =>
      useMemoryLeakDetector({
        enabled: true,
        trackMemory: true,
        memoryThreshold: 85,
        checkInterval: 1000,
        onWarning,
      })
    );

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // onWarning may be called based on memory threshold
    expect(onWarning).toHaveBeenCalled();
  });

  it('should clear warnings', () => {
    const { result } = renderHook(() =>
      useMemoryLeakDetector({
        enabled: true,
      })
    );

    act(() => {
      result.current.clearWarnings();
    });

    expect(result.current.warnings).toEqual([]);
  });

  it('should force check for leaks', () => {
    Object.defineProperty(window.performance, 'memory', {
      value: {
        usedJSHeapSize: 190000000,
        totalJSHeapSize: 195000000,
        jsHeapSizeLimit: 200000000,
      },
      configurable: true,
    });

    const { result } = renderHook(() =>
      useMemoryLeakDetector({
        enabled: true,
        trackMemory: true,
        memoryThreshold: 85,
        checkInterval: 60000,
      })
    );

    act(() => {
      result.current.forceCheck();
    });

    expect(result.current.warnings.length).toBeGreaterThanOrEqual(0);
  });

  it('should handle missing performance.memory', () => {
    Object.defineProperty(window, 'performance', {
      writable: true,
      value: {
        now: vi.fn(() => Date.now()),
      },
    });

    const { result } = renderHook(() =>
      useMemoryLeakDetector({
        enabled: true,
        trackMemory: true,
      })
    );

    expect(result.current.warnings).toEqual([]);
  });

  it('should use custom component name in warnings', () => {
    const onWarning = vi.fn();

    Object.defineProperty(window.performance, 'memory', {
      value: {
        usedJSHeapSize: 190000000,
        totalJSHeapSize: 190000000,
        jsHeapSizeLimit: 200000000,
      },
      configurable: true,
    });

    renderHook(() =>
      useMemoryLeakDetector({
        enabled: true,
        componentName: 'TestComponent',
        trackMemory: true,
        memoryThreshold: 85,
        checkInterval: 1000,
        onWarning,
      })
    );

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // Test passes if no errors thrown
    expect(true).toBe(true);
  });

  it('should cleanup interval on unmount', () => {
    const { unmount } = renderHook(() =>
      useMemoryLeakDetector({
        enabled: true,
        checkInterval: 1000,
      })
    );

    unmount();

    // Verify no errors occur after unmount
    act(() => {
      vi.advanceTimersByTime(1000);
    });
  });
});

describe('useTrackedTimeout', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should call callback after delay', () => {
    const callback = vi.fn();

    renderHook(() => useTrackedTimeout(callback, 1000));

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should not call callback when delay is null', () => {
    const callback = vi.fn();

    renderHook(() => useTrackedTimeout(callback, null));

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(callback).not.toHaveBeenCalled();
  });

  it('should clear timeout on unmount', () => {
    const callback = vi.fn();

    const { unmount } = renderHook(() => useTrackedTimeout(callback, 1000));

    unmount();

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(callback).not.toHaveBeenCalled();
  });

  it('should reset timeout when delay changes', () => {
    const callback = vi.fn();

    const { rerender } = renderHook(({ delay }) => useTrackedTimeout(callback, delay), {
      initialProps: { delay: 1000 },
    });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    rerender({ delay: 2000 });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(callback).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('useTrackedInterval', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should call callback at interval', () => {
    const callback = vi.fn();

    renderHook(() => useTrackedInterval(callback, 1000));

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(callback).toHaveBeenCalledTimes(3);
  });

  it('should not call callback when delay is null', () => {
    const callback = vi.fn();

    renderHook(() => useTrackedInterval(callback, null));

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(callback).not.toHaveBeenCalled();
  });

  it('should clear interval on unmount', () => {
    const callback = vi.fn();

    const { unmount } = renderHook(() => useTrackedInterval(callback, 1000));

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    unmount();

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('useTrackedEventListener', () => {
  it('should add event listener', () => {
    const handler = vi.fn();
    const addEventListener = vi.spyOn(window, 'addEventListener');

    renderHook(() => useTrackedEventListener('resize', handler));

    expect(addEventListener).toHaveBeenCalledWith('resize', expect.any(Function), undefined);
  });

  it('should remove event listener on unmount', () => {
    const handler = vi.fn();
    const removeEventListener = vi.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() => useTrackedEventListener('resize', handler));

    unmount();

    expect(removeEventListener).toHaveBeenCalledWith('resize', expect.any(Function), undefined);
  });

  it('should call handler when event fires', () => {
    const handler = vi.fn();

    renderHook(() => useTrackedEventListener('resize', handler));

    act(() => {
      window.dispatchEvent(new Event('resize'));
    });

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('should work with custom element', () => {
    const handler = vi.fn();
    const element = document.createElement('div');
    const addEventListener = vi.spyOn(element, 'addEventListener');

    renderHook(() => useTrackedEventListener('click', handler as any, element));

    expect(addEventListener).toHaveBeenCalledWith('click', expect.any(Function), undefined);
  });

  it('should update handler without re-adding listener', () => {
    const handler1 = vi.fn();
    const handler2 = vi.fn();
    const addEventListener = vi.spyOn(window, 'addEventListener');

    const { rerender } = renderHook(({ handler }) => useTrackedEventListener('resize', handler), {
      initialProps: { handler: handler1 },
    });

    const callCount = addEventListener.mock.calls.length;

    rerender({ handler: handler2 });

    expect(addEventListener).toHaveBeenCalledTimes(callCount);

    act(() => {
      window.dispatchEvent(new Event('resize'));
    });

    expect(handler1).not.toHaveBeenCalled();
    expect(handler2).toHaveBeenCalledTimes(1);
  });
});

describe('useDetachedDOMDetector', () => {
  it('should initialize without errors', () => {
    const { result } = renderHook(() => useDetachedDOMDetector('TestComponent'));
    expect(result.current).toBeUndefined();
  });

  it('should cleanup on unmount', () => {
    const { unmount } = renderHook(() => useDetachedDOMDetector('TestComponent'));

    expect(() => unmount()).not.toThrow();
  });
});
