/**
 * Performance Monitoring Hook
 * Custom hook for monitoring component performance and Web Vitals
 */

import { useEffect, useRef, useState, useCallback } from 'react';

import { logger } from '../utils/logger';
import { performanceMonitor, type IPerformanceMetric } from '../utils/performance';

export interface IPerformanceData {
  renderCount: number;
  lastRenderTime: number;
  averageRenderTime: number;
  totalRenderTime: number;
  slowRendersCount: number;
  webVitals: {
    fcp: number | null;
    lcp: number | null;
    fid: number | null;
    cls: number | null;
    ttfb: number | null;
  };
}

export interface IUsePerformanceMonitorOptions {
  enabled?: boolean;
  componentName?: string;
  logSlowRenders?: boolean;
  slowRenderThreshold?: number;
  logToConsole?: boolean;
  trackWebVitals?: boolean;
}

const DEFAULT_OPTIONS: Required<IUsePerformanceMonitorOptions> = {
  enabled: import.meta.env.MODE === 'development',
  componentName: 'Component',
  logSlowRenders: true,
  slowRenderThreshold: 16, // 16ms = 60fps
  logToConsole: false,
  trackWebVitals: true,
};

/**
 * Hook for monitoring component performance
 */
export const usePerformanceMonitor = (
  options: IUsePerformanceMonitorOptions = {}
): IPerformanceData => {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const renderStartTime = useRef<number>(0);
  const mountTime = useRef<number>(Date.now());
  const renderTimes = useRef<number[]>([]);

  const [performanceData, setPerformanceData] = useState<IPerformanceData>({
    renderCount: 0,
    lastRenderTime: 0,
    averageRenderTime: 0,
    totalRenderTime: 0,
    slowRendersCount: 0,
    webVitals: {
      fcp: null,
      lcp: null,
      fid: null,
      cls: null,
      ttfb: null,
    },
  });

  // Track render start
  renderStartTime.current = performance.now();

  useEffect(() => {
    if (!opts.enabled) return;

    // Calculate render time
    const renderEndTime = performance.now();
    const renderTime = renderEndTime - renderStartTime.current;

    // Store render time
    renderTimes.current.push(renderTime);

    // Keep only last 100 render times
    if (renderTimes.current.length > 100) {
      renderTimes.current.shift();
    }

    // Calculate statistics
    const renderCount = renderTimes.current.length;
    const totalRenderTime = renderTimes.current.reduce((sum, time) => sum + time, 0);
    const averageRenderTime = totalRenderTime / renderCount;
    const slowRendersCount = renderTimes.current.filter(
      (time) => time > opts.slowRenderThreshold
    ).length;

    // Check for slow render
    if (opts.logSlowRenders && renderTime > opts.slowRenderThreshold) {
      logger.warn(`Slow render detected in ${opts.componentName}`, {
        renderTime: `${renderTime.toFixed(2)}ms`,
        threshold: `${opts.slowRenderThreshold}ms`,
        renderCount,
      });
    }

    // Get Web Vitals
    const webVitals = opts.trackWebVitals
      ? {
          fcp: performanceMonitor.getFCP(),
          lcp: performanceMonitor.getMetricsByName('LCP')[0]?.value || null,
          fid: performanceMonitor.getMetricsByName('FID')[0]?.value || null,
          cls: performanceMonitor.getMetricsByName('CLS')[0]?.value || null,
          ttfb: performanceMonitor.getTTFB(),
        }
      : performanceData.webVitals;

    // Update state
    setPerformanceData({
      renderCount,
      lastRenderTime: renderTime,
      averageRenderTime,
      totalRenderTime,
      slowRendersCount,
      webVitals,
    });

    // Log to console if enabled
    if (opts.logToConsole) {
      // eslint-disable-next-line no-console
      console.log(`[${opts.componentName}] Performance:`, {
        renderTime: `${renderTime.toFixed(2)}ms`,
        averageRenderTime: `${averageRenderTime.toFixed(2)}ms`,
        renderCount,
        slowRendersCount,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    opts.enabled,
    opts.logSlowRenders,
    opts.slowRenderThreshold,
    opts.trackWebVitals,
    opts.logToConsole,
    opts.componentName,
  ]);

  // Log mount time on unmount
  useEffect(() => {
    const savedMountTime = mountTime.current;
    const savedRenderTimes = renderTimes.current;
    return () => {
      if (!opts.enabled) return;

      const mountDuration = Date.now() - savedMountTime;
      logger.debug(`${opts.componentName} unmounted`, {
        mountDuration: `${mountDuration}ms`,
        totalRenders: savedRenderTimes.length,
        averageRenderTime: `${(
          savedRenderTimes.reduce((sum, time) => sum + time, 0) / savedRenderTimes.length
        ).toFixed(2)}ms`,
      });
    };
  }, [opts.enabled, opts.componentName]);

  return performanceData;
};

/**
 * Hook for measuring async operation performance
 */
export const useAsyncPerformance = () => {
  const measureAsync = useCallback(
    async <T>(
      name: string,
      asyncFn: () => Promise<T>
    ): Promise<{ result: T; duration: number }> => {
      const startTime = performance.now();

      try {
        const result = await asyncFn();
        const endTime = performance.now();
        const duration = endTime - startTime;

        logger.debug(`Async operation completed: ${name}`, {
          duration: `${duration.toFixed(2)}ms`,
        });

        // Record metric
        performanceMonitor.recordMetric({
          name: `AsyncOp:${name}`,
          value: duration,
          unit: 'ms',
          timestamp: Date.now(),
        });

        return { result, duration };
      } catch (error) {
        const endTime = performance.now();
        const duration = endTime - startTime;

        logger.error(`Async operation failed: ${name}`, {
          duration: `${duration.toFixed(2)}ms`,
          error,
        });

        throw error;
      }
    },
    []
  );

  return { measureAsync };
};

/**
 * Hook for tracking component lifecycle timing
 */
export const useLifecycleTiming = (componentName: string): void => {
  const mountTime = useRef<number>(0);
  const updateCount = useRef<number>(0);

  // Track mount
  useEffect(() => {
    mountTime.current = performance.now();
    logger.debug(`${componentName} mounted`, {
      timestamp: mountTime.current,
    });

    // Track unmount
    return () => {
      const unmountTime = performance.now();
      const lifetimeDuration = unmountTime - mountTime.current;

      logger.debug(`${componentName} unmounted`, {
        lifetimeDuration: `${lifetimeDuration.toFixed(2)}ms`,
        totalUpdates: updateCount.current,
      });
    };
  }, [componentName]);

  // Track updates
  useEffect(() => {
    updateCount.current += 1;
  });
};

/**
 * Hook for monitoring render performance with profiler
 */
export const useRenderProfiler = (
  _id: string,
  onRender?: (
    id: string,
    phase: 'mount' | 'update',
    actualDuration: number,
    baseDuration: number,
    startTime: number,
    commitTime: number
  ) => void
) => {
  const handleRender = useCallback(
    (
      profileId: string,
      phase: 'mount' | 'update',
      actualDuration: number,
      baseDuration: number,
      startTime: number,
      commitTime: number
    ) => {
      // Record metric
      performanceMonitor.recordMetric({
        name: `Render:${profileId}`,
        value: actualDuration,
        unit: 'ms',
        timestamp: Date.now(),
        metadata: {
          phase,
          baseDuration,
          startTime,
          commitTime,
        },
      });

      // Log slow renders
      if (actualDuration > 16) {
        logger.warn(`Slow render in ${profileId}`, {
          phase,
          actualDuration: `${actualDuration.toFixed(2)}ms`,
          baseDuration: `${baseDuration.toFixed(2)}ms`,
        });
      }

      // Call custom handler
      if (onRender) {
        onRender(profileId, phase, actualDuration, baseDuration, startTime, commitTime);
      }
    },
    [onRender]
  );

  return { handleRender };
};

/**
 * Hook for getting current performance metrics
 */
export const usePerformanceMetrics = (): {
  metrics: IPerformanceMetric[];
  memory: ReturnType<typeof performanceMonitor.getMemoryUsage>;
  report: ReturnType<typeof performanceMonitor.generateReport>;
  clearMetrics: () => void;
} => {
  const [metrics, setMetrics] = useState<IPerformanceMetric[]>([]);
  const [memory, setMemory] = useState(performanceMonitor.getMemoryUsage());
  const [report, setReport] = useState(performanceMonitor.generateReport());

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(performanceMonitor.getMetrics());
      setMemory(performanceMonitor.getMemoryUsage());
      setReport(performanceMonitor.generateReport());
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const clearMetrics = useCallback(() => {
    performanceMonitor.clearMetrics();
    setMetrics([]);
  }, []);

  return {
    metrics,
    memory,
    report,
    clearMetrics,
  };
};
