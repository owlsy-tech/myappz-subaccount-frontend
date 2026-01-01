/**
 * Memory Leak Detector Hook
 * Custom hook for detecting potential memory leaks in React components
 */

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';

import { logger } from '../utils/logger';

import type { IMemoryUsage } from '../utils/performance';

export interface IMemoryLeakWarning {
  timestamp: number;
  componentName: string;
  type: 'listener' | 'timer' | 'memory' | 'state' | 'general';
  message: string;
  severity: 'low' | 'medium' | 'high';
  details?: Record<string, unknown>;
}

export interface IMemoryLeakDetectorOptions {
  enabled?: boolean;
  componentName?: string;
  checkInterval?: number;
  memoryThreshold?: number; // Percentage
  maxListeners?: number;
  trackTimers?: boolean;
  trackListeners?: boolean;
  trackMemory?: boolean;
  onWarning?: (warning: IMemoryLeakWarning) => void;
}

const DEFAULT_OPTIONS: Required<IMemoryLeakDetectorOptions> = {
  enabled: import.meta.env.VITE_ENABLE_PERFORMANCE_MONITORING === 'true',
  componentName: 'Component',
  checkInterval: Number(import.meta.env.VITE_MEMORY_LEAK_CHECK_INTERVAL) || 60000,
  memoryThreshold: 85,
  maxListeners: 10,
  trackTimers: true,
  trackListeners: true,
  trackMemory: true,
  onWarning: () => {},
};

/**
 * Hook for detecting memory leaks
 */
export const useMemoryLeakDetector = (
  options: IMemoryLeakDetectorOptions = {}
): {
  warnings: IMemoryLeakWarning[];
  hasLeaks: boolean;
  clearWarnings: () => void;
  forceCheck: () => void;
} => {
  const opts = useMemo(() => ({ ...DEFAULT_OPTIONS, ...options }), [options]);
  const [warnings, setWarnings] = useState<IMemoryLeakWarning[]>([]);
  const activeTimers = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());
  const activeIntervals = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());
  const activeListeners = useRef<Map<string, EventListenerOrEventListenerObject>>(new Map());
  const initialMemory = useRef<IMemoryUsage | null>(null);
  const memorySnapshots = useRef<IMemoryUsage[]>([]);
  const mountTime = useRef<number>(Date.now());
  const stateUpdateCount = useRef<number>(0);

  /**
   * Add warning
   */
  const addWarning = useCallback(
    (warning: IMemoryLeakWarning) => {
      setWarnings((prev) => [...prev, warning]);

      if (opts.onWarning) {
        opts.onWarning(warning);
      }

      logger.warn(`Memory leak warning in ${opts.componentName}`, {
        type: warning.type,
        message: warning.message,
        severity: warning.severity,
        details: warning.details,
      });
    },
    [opts]
  );

  /**
   * Get current memory usage
   */
  const getMemoryUsage = useCallback((): IMemoryUsage | null => {
    if (typeof window === 'undefined' || !('performance' in window)) {
      return null;
    }

    const { memory } = performance as Performance & {
      memory?: {
        usedJSHeapSize: number;
        totalJSHeapSize: number;
        jsHeapSizeLimit: number;
      };
    };

    if (!memory) return null;

    const percentage = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;

    return {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
      percentage: Math.round(percentage * 100) / 100,
    };
  }, []);

  /**
   * Check for memory leaks
   */
  const checkForLeaks = useCallback(() => {
    if (!opts.enabled) return;

    // Check timer leaks
    if (opts.trackTimers) {
      const totalTimers = activeTimers.current.size + activeIntervals.current.size;
      if (totalTimers > 20) {
        addWarning({
          timestamp: Date.now(),
          componentName: opts.componentName,
          type: 'timer',
          message: `High number of active timers detected: ${totalTimers}`,
          severity: totalTimers > 50 ? 'high' : 'medium',
          details: {
            timeouts: activeTimers.current.size,
            intervals: activeIntervals.current.size,
          },
        });
      }
    }

    // Check listener leaks
    if (opts.trackListeners) {
      const listenerCount = activeListeners.current.size;
      if (listenerCount > opts.maxListeners) {
        addWarning({
          timestamp: Date.now(),
          componentName: opts.componentName,
          type: 'listener',
          message: `High number of event listeners: ${listenerCount}`,
          severity: listenerCount > opts.maxListeners * 2 ? 'high' : 'medium',
          details: {
            listenerCount,
            maxListeners: opts.maxListeners,
            listeners: Array.from(activeListeners.current.keys()),
          },
        });
      }
    }

    // Check memory leaks
    if (opts.trackMemory) {
      const currentMemory = getMemoryUsage();
      if (currentMemory) {
        memorySnapshots.current.push(currentMemory);

        // Keep only last 10 snapshots
        if (memorySnapshots.current.length > 10) {
          memorySnapshots.current.shift();
        }

        // Check memory threshold
        if (currentMemory.percentage > opts.memoryThreshold) {
          addWarning({
            timestamp: Date.now(),
            componentName: opts.componentName,
            type: 'memory',
            message: `High memory usage: ${currentMemory.percentage.toFixed(2)}%`,
            severity: currentMemory.percentage > 95 ? 'high' : 'medium',
            details: {
              usedMB: (currentMemory.usedJSHeapSize / 1024 / 1024).toFixed(2),
              limitMB: (currentMemory.jsHeapSizeLimit / 1024 / 1024).toFixed(2),
              percentage: currentMemory.percentage,
            },
          });
        }

        // Check for memory growth
        if (memorySnapshots.current.length >= 5) {
          const first = memorySnapshots.current[0];
          const last = memorySnapshots.current[memorySnapshots.current.length - 1];

          if (first && last) {
            const growth = last.usedJSHeapSize - first.usedJSHeapSize;
            const growthPercentage = (growth / first.usedJSHeapSize) * 100;

            if (growthPercentage > 50) {
              addWarning({
                timestamp: Date.now(),
                componentName: opts.componentName,
                type: 'memory',
                message: `Significant memory growth detected: ${growthPercentage.toFixed(2)}%`,
                severity: growthPercentage > 100 ? 'high' : 'medium',
                details: {
                  growthMB: (growth / 1024 / 1024).toFixed(2),
                  growthPercentage: growthPercentage.toFixed(2),
                  snapshots: memorySnapshots.current.length,
                },
              });
            }
          }
        }

        // Store initial memory if not set
        if (!initialMemory.current) {
          initialMemory.current = currentMemory;
        }
      }
    }

    // Check for excessive state updates
    const componentLifetime = Date.now() - mountTime.current;
    const updatesPerMinute = (stateUpdateCount.current / componentLifetime) * 60000;

    if (updatesPerMinute > 100) {
      addWarning({
        timestamp: Date.now(),
        componentName: opts.componentName,
        type: 'state',
        message: `High state update frequency: ${updatesPerMinute.toFixed(2)} updates/min`,
        severity: updatesPerMinute > 200 ? 'high' : 'medium',
        details: {
          totalUpdates: stateUpdateCount.current,
          lifetimeMs: componentLifetime,
          updatesPerMinute: updatesPerMinute.toFixed(2),
        },
      });
    }
  }, [opts, addWarning, getMemoryUsage]);

  /**
   * Track state updates
   */
  useEffect(() => {
    stateUpdateCount.current += 1;
    // Intentionally no dependencies - tracks every render
  });

  /**
   * Periodic leak check
   */
  useEffect(() => {
    if (!opts.enabled) {
      return undefined;
    }

    const interval = setInterval(() => {
      checkForLeaks();
    }, opts.checkInterval);

    return () => clearInterval(interval);
  }, [opts.enabled, opts.checkInterval, checkForLeaks]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    const savedTimers = activeTimers.current;
    const savedIntervals = activeIntervals.current;
    const savedListeners = activeListeners.current;
    const { enabled, componentName } = opts;
    return () => {
      // Check if there are active timers/listeners on unmount
      if (enabled) {
        const hasActiveTimers = savedTimers.size > 0 || savedIntervals.size > 0;
        const hasActiveListeners = savedListeners.size > 0;

        if (hasActiveTimers || hasActiveListeners) {
          logger.warn(`Potential memory leak: ${componentName} unmounted with active resources`, {
            activeTimers: savedTimers.size,
            activeIntervals: savedIntervals.size,
            activeListeners: savedListeners.size,
          });
        }
      }

      // Clear all tracked resources
      savedTimers.clear();
      savedIntervals.clear();
      savedListeners.clear();
    };
  }, [opts]);

  /**
   * Clear warnings
   */
  const clearWarnings = useCallback(() => {
    setWarnings([]);
  }, []);

  /**
   * Force check
   */
  const forceCheck = useCallback(() => {
    checkForLeaks();
  }, [checkForLeaks]);

  return {
    warnings,
    hasLeaks: warnings.length > 0,
    clearWarnings,
    forceCheck,
  };
};

/**
 * Hook for tracking timer cleanup
 */
export const useTrackedTimeout = (
  callback: () => void,
  delay: number | null,
  componentName?: string
): void => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (delay === null) {
      return undefined;
    }

    timeoutRef.current = setTimeout(callback, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [callback, delay, componentName]);
};

/**
 * Hook for tracking interval cleanup
 */
export const useTrackedInterval = (
  callback: () => void,
  delay: number | null,
  componentName?: string
): void => {
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (delay === null) {
      return undefined;
    }

    intervalRef.current = setInterval(callback, delay);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [callback, delay, componentName]);
};

/**
 * Hook for tracking event listener cleanup
 */
export const useTrackedEventListener = <K extends keyof WindowEventMap>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  element: HTMLElement | Window = window,
  options?: boolean | AddEventListenerOptions
): void => {
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    const eventListener = (event: Event) => {
      handlerRef.current(event as WindowEventMap[K]);
    };

    element.addEventListener(eventName, eventListener, options);

    return () => {
      element.removeEventListener(eventName, eventListener, options);
    };
  }, [eventName, element, options]);
};

/**
 * Hook for detecting detached DOM nodes
 */
export const useDetachedDOMDetector = (componentName: string): void => {
  const domNodes = useRef<Set<HTMLElement>>(new Set());

  useEffect(() => {
    const savedDomNodes = domNodes.current;
    return () => {
      // Check for detached nodes on unmount
      const detachedNodes = Array.from(savedDomNodes).filter(
        (node) => !document.body.contains(node)
      );

      if (detachedNodes.length > 0) {
        logger.warn(`Detached DOM nodes detected in ${componentName}`, {
          count: detachedNodes.length,
        });
      }

      savedDomNodes.clear();
    };
  }, [componentName]);
};
