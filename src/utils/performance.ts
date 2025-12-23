/**
 * Performance Monitoring Utilities
 * Tools for measuring and tracking application performance
 */

/* eslint-disable class-methods-use-this */

export interface IPerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

export interface IPerformanceThresholds {
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte
  tti?: number; // Time to Interactive
}

export interface IMemoryUsage {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
  percentage: number;
}

export interface IResourceTiming {
  name: string;
  duration: number;
  size: number;
  type: string;
  startTime: number;
}

/**
 * Default performance thresholds (in milliseconds, except CLS)
 */
const DEFAULT_THRESHOLDS: Required<IPerformanceThresholds> = {
  fcp: 1800, // Good: < 1.8s
  lcp: 2500, // Good: < 2.5s
  fid: 100, // Good: < 100ms
  cls: 0.1, // Good: < 0.1
  ttfb: 800, // Good: < 0.8s
  tti: 3800, // Good: < 3.8s
};

/**
 * Performance metric collector
 */
class PerformanceMonitor {
  private metrics: IPerformanceMetric[] = [];

  private thresholds: Required<IPerformanceThresholds>;

  private observers: Map<string, PerformanceObserver> = new Map();

  constructor(thresholds: IPerformanceThresholds = {}) {
    this.thresholds = { ...DEFAULT_THRESHOLDS, ...thresholds };
    this.initializeObservers();
  }

  /**
   * Initialize performance observers
   */
  private initializeObservers(): void {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return;
    }

    // Observe Web Vitals
    this.observeWebVitals();

    // Observe Long Tasks
    this.observeLongTasks();

    // Observe Resource Timing
    this.observeResourceTiming();
  }

  /**
   * Observe Web Vitals (LCP, FID, CLS)
   */
  private observeWebVitals(): void {
    try {
      // Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as PerformanceEntry & {
          renderTime: number;
          loadTime: number;
        };
        if (lastEntry) {
          const lcp = lastEntry.renderTime || lastEntry.loadTime;
          this.recordMetric({
            name: 'LCP',
            value: lcp,
            unit: 'ms',
            timestamp: Date.now(),
            metadata: {
              threshold: this.thresholds.lcp,
              status: this.getStatus(lcp, this.thresholds.lcp),
            },
          });
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.set('lcp', lcpObserver);
    } catch (error) {
      // LCP not supported
    }

    try {
      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          const fidEntry = entry as PerformanceEventTiming;
          const fid = fidEntry.processingStart - fidEntry.startTime;
          this.recordMetric({
            name: 'FID',
            value: fid,
            unit: 'ms',
            timestamp: Date.now(),
            metadata: {
              threshold: this.thresholds.fid,
              status: this.getStatus(fid, this.thresholds.fid),
            },
          });
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      this.observers.set('fid', fidObserver);
    } catch (error) {
      // FID not supported
    }

    try {
      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          const clsEntry = entry as PerformanceEntry & { value: number; hadRecentInput: boolean };
          if (!clsEntry.hadRecentInput) {
            clsValue += clsEntry.value;
            this.recordMetric({
              name: 'CLS',
              value: clsValue,
              unit: 'score',
              timestamp: Date.now(),
              metadata: {
                threshold: this.thresholds.cls,
                status: this.getStatus(clsValue, this.thresholds.cls),
              },
            });
          }
        });
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.set('cls', clsObserver);
    } catch (error) {
      // CLS not supported
    }
  }

  /**
   * Observe long tasks (> 50ms)
   */
  private observeLongTasks(): void {
    try {
      const longTaskObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          this.recordMetric({
            name: 'LongTask',
            value: entry.duration,
            unit: 'ms',
            timestamp: Date.now(),
            metadata: { startTime: entry.startTime },
          });
        });
      });
      longTaskObserver.observe({ entryTypes: ['longtask'] });
      this.observers.set('longtask', longTaskObserver);
    } catch (error) {
      // Long tasks not supported
    }
  }

  /**
   * Observe resource timing
   */
  private observeResourceTiming(): void {
    try {
      const resourceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          const resourceEntry = entry as PerformanceResourceTiming;
          this.recordMetric({
            name: 'ResourceLoad',
            value: resourceEntry.duration,
            unit: 'ms',
            timestamp: Date.now(),
            metadata: {
              url: resourceEntry.name,
              type: resourceEntry.initiatorType,
              size: resourceEntry.transferSize,
            },
          });
        });
      });
      resourceObserver.observe({ entryTypes: ['resource'] });
      this.observers.set('resource', resourceObserver);
    } catch (error) {
      // Resource timing not supported
    }
  }

  /**
   * Get performance status based on threshold
   */
  private getStatus(value: number, threshold: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= threshold) return 'good';
    if (value <= threshold * 1.5) return 'needs-improvement';
    return 'poor';
  }

  /**
   * Record a custom metric
   */
  recordMetric(metric: IPerformanceMetric): void {
    this.metrics.push(metric);
  }

  /**
   * Get all recorded metrics
   */
  getMetrics(): IPerformanceMetric[] {
    return [...this.metrics];
  }

  /**
   * Get metrics by name
   */
  getMetricsByName(name: string): IPerformanceMetric[] {
    return this.metrics.filter((metric) => metric.name === name);
  }

  /**
   * Clear all metrics
   */
  clearMetrics(): void {
    this.metrics = [];
  }

  /**
   * Get current memory usage
   */
  getMemoryUsage(): IMemoryUsage | null {
    if (typeof window === 'undefined' || !('performance' in window)) {
      return null;
    }

    const perfWithMemory = performance as Performance & {
      memory?: {
        usedJSHeapSize: number;
        totalJSHeapSize: number;
        jsHeapSizeLimit: number;
      };
    };

    const { memory } = perfWithMemory;
    if (!memory) return null;

    const percentage = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;

    return {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
      percentage: Math.round(percentage * 100) / 100,
    };
  }

  /**
   * Get navigation timing
   */
  getNavigationTiming(): PerformanceNavigationTiming | null {
    if (typeof window === 'undefined' || !('performance' in window)) {
      return null;
    }

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    return navigation || null;
  }

  /**
   * Get resource timing information
   */
  getResourceTimings(): IResourceTiming[] {
    if (typeof window === 'undefined' || !('performance' in window)) {
      return [];
    }

    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    return resources.map((resource) => ({
      name: resource.name,
      duration: resource.duration,
      size: resource.transferSize,
      type: resource.initiatorType,
      startTime: resource.startTime,
    }));
  }

  /**
   * Calculate Time to First Byte (TTFB)
   */
  getTTFB(): number | null {
    const navigation = this.getNavigationTiming();
    if (!navigation) return null;

    return navigation.responseStart - navigation.requestStart;
  }

  /**
   * Calculate First Contentful Paint (FCP)
   */
  getFCP(): number | null {
    if (typeof window === 'undefined' || !('performance' in window)) {
      return null;
    }

    const paintEntries = performance.getEntriesByType('paint');
    const fcpEntry = paintEntries.find((entry) => entry.name === 'first-contentful-paint');
    return fcpEntry ? fcpEntry.startTime : null;
  }

  /**
   * Generate performance report
   */
  generateReport(): {
    webVitals: Record<string, number | null>;
    memory: IMemoryUsage | null;
    navigation: PerformanceNavigationTiming | null;
    resources: IResourceTiming[];
    customMetrics: IPerformanceMetric[];
  } {
    return {
      webVitals: {
        fcp: this.getFCP(),
        lcp: this.getMetricsByName('LCP')[0]?.value || null,
        fid: this.getMetricsByName('FID')[0]?.value || null,
        cls: this.getMetricsByName('CLS')[0]?.value || null,
        ttfb: this.getTTFB(),
      },
      memory: this.getMemoryUsage(),
      navigation: this.getNavigationTiming(),
      resources: this.getResourceTimings(),
      customMetrics: this.getMetrics(),
    };
  }

  /**
   * Disconnect all observers
   */
  disconnect(): void {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers.clear();
  }
}

/**
 * Measure function execution time
 */
export const measureExecutionTime = async <T>(
  _name: string,
  fn: () => T | Promise<T>
): Promise<{ result: T; duration: number }> => {
  const startTime = performance.now();
  const result = await fn();
  const endTime = performance.now();
  const duration = endTime - startTime;

  return { result, duration };
};

/**
 * Mark performance timing
 */
export const markPerformance = (name: string): void => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    performance.mark(name);
  }
};

/**
 * Measure performance between two marks
 */
export const measurePerformance = (
  name: string,
  startMark: string,
  endMark: string
): number | null => {
  if (typeof window === 'undefined' || !('performance' in window)) {
    return null;
  }

  try {
    performance.measure(name, startMark, endMark);
    const measure = performance.getEntriesByName(name, 'measure')[0];
    return measure ? measure.duration : null;
  } catch (error) {
    return null;
  }
};

/**
 * Log performance metrics to console (dev only)
 */
export const logPerformance = (monitor: PerformanceMonitor): void => {
  if (import.meta.env.MODE === 'development') {
    const report = monitor.generateReport();
    // eslint-disable-next-line no-console
    console.table({
      'FCP (ms)': report.webVitals['fcp']?.toFixed(2) || 'N/A',
      'LCP (ms)': report.webVitals['lcp']?.toFixed(2) || 'N/A',
      'FID (ms)': report.webVitals['fid']?.toFixed(2) || 'N/A',
      CLS: report.webVitals['cls']?.toFixed(3) || 'N/A',
      'TTFB (ms)': report.webVitals['ttfb']?.toFixed(2) || 'N/A',
      'Memory Usage (%)': report.memory?.percentage.toFixed(2) || 'N/A',
    });
  }
};

/**
 * Detect performance issues
 */
export const detectPerformanceIssues = (
  monitor: PerformanceMonitor,
  thresholds?: IPerformanceThresholds
): string[] => {
  const issues: string[] = [];
  const report = monitor.generateReport();
  const limits = { ...DEFAULT_THRESHOLDS, ...thresholds };

  // Check Web Vitals
  if (report.webVitals['fcp'] && report.webVitals['fcp'] > limits.fcp) {
    issues.push(
      `FCP is slow: ${report.webVitals['fcp'].toFixed(2)}ms (threshold: ${limits.fcp}ms)`
    );
  }

  if (report.webVitals['lcp'] && report.webVitals['lcp'] > limits.lcp) {
    issues.push(
      `LCP is slow: ${report.webVitals['lcp'].toFixed(2)}ms (threshold: ${limits.lcp}ms)`
    );
  }

  if (report.webVitals['fid'] && report.webVitals['fid'] > limits.fid) {
    issues.push(
      `FID is high: ${report.webVitals['fid'].toFixed(2)}ms (threshold: ${limits.fid}ms)`
    );
  }

  if (report.webVitals['cls'] && report.webVitals['cls'] > limits.cls) {
    issues.push(`CLS is high: ${report.webVitals['cls'].toFixed(3)} (threshold: ${limits.cls})`);
  }

  if (report.webVitals['ttfb'] && report.webVitals['ttfb'] > limits.ttfb) {
    issues.push(
      `TTFB is slow: ${report.webVitals['ttfb'].toFixed(2)}ms (threshold: ${limits.ttfb}ms)`
    );
  }

  // Check memory usage
  if (report.memory && report.memory.percentage > 80) {
    issues.push(`High memory usage: ${report.memory.percentage.toFixed(2)}%`);
  }

  // Check for long tasks
  const longTasks = report.customMetrics.filter((m) => m.name === 'LongTask');
  if (longTasks.length > 10) {
    issues.push(`Too many long tasks detected: ${longTasks.length}`);
  }

  return issues;
};

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Export class for custom instances
export { PerformanceMonitor };
